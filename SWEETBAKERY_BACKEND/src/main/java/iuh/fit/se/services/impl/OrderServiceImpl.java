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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderServiceImpl implements OrderService {
    OrderRepository orderRepository;
    PastryRepository pastryRepository;
    AccountCredentialRepository accountCredentialRepository;
    CartRepository cartRepository;

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
        order.setTrangThai(TrangThaiDH.HOAN_THANH);
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
        return resp;
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
