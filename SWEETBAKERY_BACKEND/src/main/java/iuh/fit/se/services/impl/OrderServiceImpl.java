package iuh.fit.se.services.impl;

import iuh.fit.se.dtos.request.OrderItemRequest;
import iuh.fit.se.dtos.response.OrderDetailResponse;
import iuh.fit.se.dtos.response.OrderResponse;
import iuh.fit.se.entities.*;
import iuh.fit.se.entities.enums.TrangThaiDH;
import iuh.fit.se.repositories.*;
import iuh.fit.se.services.OrderService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class OrderServiceImpl implements OrderService {
    OrderRepository orderRepository;
    PastryRepository pastryRepository;
    AccountCredentialRepository accountCredentialRepository;
    CartRepository cartRepository;
    iuh.fit.se.services.VnPayService vnPayService;
    iuh.fit.se.repositories.VnPayTransactionRepository vnPayTransactionRepository;
    com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    @Override
    @Transactional
    public iuh.fit.se.dtos.response.OrderResponse placeOrder(iuh.fit.se.dtos.request.OrderRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null)
            return null;
        String username = authentication.getName();
        AccountCredential account = accountCredentialRepository.findByCredential(username);
        if (account == null || account.getUser() == null)
            return null;

        // customer fetched if needed in future

        // create order
        Order order = new Order();
        order.setId(UUID.randomUUID().toString());
        order.setNgayDatHang(LocalDateTime.now());
        order.setTrangThai(TrangThaiDH.PENDING);
        // set customer (link order to user)
        order.setCustomer(account.getUser());
        // set payment method if provided
        if (request.getPaymentMethod() != null)
            order.setPaymentMethod(request.getPaymentMethod());

        List<OrderDetail> details = new ArrayList<>();
        double total = 0.0;
        if (request.getItems() != null) {
            for (OrderItemRequest it : request.getItems()) {
                if (it == null || it.getPastryId() == null || it.getQty() == null || it.getQty() <= 0)
                    continue;
                Optional<Pastry> pOpt = pastryRepository.findById(it.getPastryId());
                if (!pOpt.isPresent())
                    continue;
                Pastry pastry = pOpt.get();
                OrderDetail od = new OrderDetail();
                od.setId(UUID.randomUUID().toString());
                od.setPastry(pastry);
                od.setSoLuong(it.getQty());
                od.setOrder(order);
                details.add(od);
                total += (pastry.getPrice() * it.getQty());
            }
        }

        order.setTongTien(total);
        order.setOrderDetails(details);

        // persist order (cascade will persist details)
        orderRepository.save(order);

        // clear user's cart
        Cart cart = cartRepository.findByUser_Id(account.getUser().getId()).orElse(null);
        if (cart != null) {
            cart.getCartItems().clear();
            cartRepository.save(cart);
        }

        // build response
        iuh.fit.se.dtos.response.OrderResponse resp = new iuh.fit.se.dtos.response.OrderResponse();
        resp.setId(order.getId());
        resp.setNgayDatHang(order.getNgayDatHang());
        resp.setTongTien(order.getTongTien());
        resp.setTrangThai(order.getTrangThai().name());
        List<OrderDetailResponse> out = new ArrayList<>();
        for (OrderDetail od : details) {
            OrderDetailResponse rdr = new OrderDetailResponse();
            rdr.setId(od.getId());
            rdr.setPastryId(od.getPastry().getId());
            rdr.setName(od.getPastry().getName());
            rdr.setQty(od.getSoLuong());
            rdr.setPrice(od.getPastry().getPrice());
            rdr.setImage(od.getPastry().getImageUrl());
            out.add(rdr);
        }
        resp.setItems(out);
        resp.setPaymentMethod(order.getPaymentMethod());
        resp.setCustomerAddress(order.getCustomer() != null ? order.getCustomer().getAddress() : null);

        // If payment method is VNPAY, generate a VNPay payment URL and return it to
        // client
        if (order.getPaymentMethod() != null && "VNPAY".equalsIgnoreCase(order.getPaymentMethod())) {
            // amount as VND (no decimals)
            long amount = Math.round(order.getTongTien());
            String clientIp = null; // we don't have client IP here; VNPay allows omission
            String orderInfo = "Thanh toan don hang " + order.getId();
            try {
                String url = vnPayService.createPaymentUrl(order.getId(), amount, clientIp, orderInfo);
                resp.setPaymentUrl(url);
                log.info("VNPay paymentUrl generated for order {}", order.getId());
                log.debug("VNPay URL: {}", url);
            } catch (Exception ex) {
                // log full stacktrace for debugging
                log.error("Failed to create VNPay url for order {}", order.getId(), ex);
            }
        }
        return resp;
    }

    @Override
    public OrderResponse placeOrderFromTransaction(String txnRef) {
        try {
            VnPayTransaction tx = vnPayTransactionRepository.findById(txnRef).orElse(null);
            if (tx == null)
                return null;
            // parse payload as OrderRequest
            iuh.fit.se.dtos.request.OrderRequest req = objectMapper.readValue(tx.getPayload(),
                    iuh.fit.se.dtos.request.OrderRequest.class);

            // create order similarly to placeOrder but using tx.userId
            // tx.getUserId stores the credential/username (set at transaction creation),
            // so lookup by credential first
            AccountCredential account = accountCredentialRepository.findByCredential(tx.getUserId());
            // if account is null, try to find user
            iuh.fit.se.entities.User user = null;
            if (account != null)
                user = account.getUser();
            if (user == null) {
                // try load user by id
                // assume UserRepository exists via accountRepository's user mapping; skip if
                // not available
            }

            Order order = new Order();
            order.setId(tx.getId());
            order.setNgayDatHang(java.time.LocalDateTime.now());
            order.setTrangThai(TrangThaiDH.CONFIRMED);
            order.setCustomer(user);
            if (req.getPaymentMethod() != null)
                order.setPaymentMethod(req.getPaymentMethod());

            List<OrderDetail> details = new ArrayList<>();
            double total = 0.0;
            if (req.getItems() != null) {
                for (iuh.fit.se.dtos.request.OrderItemRequest it : req.getItems()) {
                    if (it == null || it.getPastryId() == null || it.getQty() == null || it.getQty() <= 0)
                        continue;
                    Optional<Pastry> pOpt = pastryRepository.findById(it.getPastryId());
                    if (!pOpt.isPresent())
                        continue;
                    Pastry pastry = pOpt.get();
                    OrderDetail od = new OrderDetail();
                    od.setId(java.util.UUID.randomUUID().toString());
                    od.setPastry(pastry);
                    od.setSoLuong(it.getQty());
                    od.setOrder(order);
                    details.add(od);
                    total += (pastry.getPrice() * it.getQty());
                }
            }

            order.setTongTien(total);
            order.setOrderDetails(details);
            orderRepository.save(order);

            // clear user's cart (same behavior as placeOrder)
            try {
                if (user != null) {
                    com.fasterxml.jackson.databind.node.ObjectNode noop = null; // placeholder to keep style
                    com.fasterxml.jackson.databind.ObjectMapper mapper = objectMapper;
                    // find and clear cart
                    iuh.fit.se.entities.Cart cart = cartRepository.findByUser_Id(user.getId()).orElse(null);
                    if (cart != null) {
                        cart.getCartItems().clear();
                        cartRepository.save(cart);
                    }
                }
            } catch (Exception e) {
                log.warn("Failed to clear cart after VNPay order: {}", e.getMessage());
            }

            // mark transaction as PAID
            tx.setStatus("PAID");
            vnPayTransactionRepository.save(tx);

            // build response
            OrderResponse resp = new OrderResponse();
            resp.setId(order.getId());
            resp.setNgayDatHang(order.getNgayDatHang());
            resp.setTongTien(order.getTongTien());
            resp.setTrangThai(order.getTrangThai().name());
            List<iuh.fit.se.dtos.response.OrderDetailResponse> out = new ArrayList<>();
            for (OrderDetail od : details) {
                iuh.fit.se.dtos.response.OrderDetailResponse rdr = new iuh.fit.se.dtos.response.OrderDetailResponse();
                rdr.setId(od.getId());
                rdr.setPastryId(od.getPastry().getId());
                rdr.setName(od.getPastry().getName());
                rdr.setQty(od.getSoLuong());
                rdr.setPrice(od.getPastry().getPrice());
                rdr.setImage(od.getPastry().getImageUrl());
                out.add(rdr);
            }
            resp.setItems(out);
            resp.setPaymentMethod(order.getPaymentMethod());
            resp.setCustomerAddress(order.getCustomer() != null ? order.getCustomer().getAddress() : null);
            return resp;
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    @Override
    public List<OrderResponse> getOrdersForCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null)
            return Collections.emptyList();
        String username = authentication.getName();
        AccountCredential account = accountCredentialRepository.findByCredential(username);
        if (account == null || account.getUser() == null)
            return Collections.emptyList();
        List<Order> orders = orderRepository.findByCustomer_Id(account.getUser().getId());
        List<OrderResponse> out = new ArrayList<>();
        for (Order o : orders) {
            OrderResponse r = new OrderResponse();
            r.setId(o.getId());
            r.setNgayDatHang(o.getNgayDatHang());
            r.setTongTien(o.getTongTien());
            r.setPaymentMethod(o.getPaymentMethod());
            r.setTrangThai(o.getTrangThai() == null ? null : o.getTrangThai().name());
            r.setCustomerAddress(o.getCustomer() != null ? o.getCustomer().getAddress() : null);
            List<OrderDetailResponse> items = new ArrayList<>();
            if (o.getOrderDetails() != null) {
                for (OrderDetail od : o.getOrderDetails()) {
                    OrderDetailResponse dr = new OrderDetailResponse();
                    dr.setId(od.getId());
                    dr.setPastryId(od.getPastry() != null ? od.getPastry().getId() : null);
                    dr.setName(od.getPastry() != null ? od.getPastry().getName() : null);
                    dr.setQty(od.getSoLuong());
                    dr.setPrice(od.getPastry() != null ? od.getPastry().getPrice() : null);
                    dr.setImage(od.getPastry() != null ? od.getPastry().getImageUrl() : null);
                    items.add(dr);
                }
            }
            r.setItems(items);
            out.add(r);
        }
        return out;
    }

    @Override
    public OrderResponse getOrderById(String id) {
        Optional<Order> opt = orderRepository.findById(id);
        if (opt.isEmpty())
            return null;
        Order o = opt.get();
        OrderResponse r = new OrderResponse();
        r.setId(o.getId());
        r.setNgayDatHang(o.getNgayDatHang());
        r.setTongTien(o.getTongTien());
        r.setPaymentMethod(o.getPaymentMethod());
        r.setTrangThai(o.getTrangThai() == null ? null : o.getTrangThai().name());
        r.setCustomerAddress(o.getCustomer() != null ? o.getCustomer().getAddress() : null);
        List<OrderDetailResponse> items = new ArrayList<>();
        if (o.getOrderDetails() != null) {
            for (OrderDetail od : o.getOrderDetails()) {
                OrderDetailResponse dr = new OrderDetailResponse();
                dr.setId(od.getId());
                dr.setPastryId(od.getPastry() != null ? od.getPastry().getId() : null);
                dr.setName(od.getPastry() != null ? od.getPastry().getName() : null);
                dr.setQty(od.getSoLuong());
                dr.setPrice(od.getPastry() != null ? od.getPastry().getPrice() : null);
                dr.setImage(od.getPastry() != null ? od.getPastry().getImageUrl() : null);
                items.add(dr);
            }
        }
        r.setItems(items);
        return r;
    }
}
