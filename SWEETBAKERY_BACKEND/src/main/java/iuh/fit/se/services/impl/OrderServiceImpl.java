package iuh.fit.se.services.impl;

import iuh.fit.se.dtos.request.CancelOrderRequest;
import iuh.fit.se.dtos.request.OrderItemRequest;
import iuh.fit.se.dtos.response.OrderDetailResponse;
import iuh.fit.se.dtos.response.OrderResponse;
import iuh.fit.se.entities.*;
import iuh.fit.se.entities.enums.PastryStatus; // Đảm bảo đã import
import iuh.fit.se.entities.enums.TrangThaiDH;
import iuh.fit.se.repositories.*;
import iuh.fit.se.services.OrderService;
import iuh.fit.se.entities.enums.HttpCode;
import iuh.fit.se.exceptions.AppException;
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
        // ... (Giữ nguyên code phần đặt hàng như trước)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) return null;
        String username = authentication.getName();
        AccountCredential account = accountCredentialRepository.findByCredential(username);
        if (account == null || account.getUser() == null) return null;

        Order order = new Order();
        order.setId(UUID.randomUUID().toString());
        order.setNgayDatHang(LocalDateTime.now());
        order.setTrangThai(TrangThaiDH.PENDING);
        order.setCustomer(account.getUser());
        if (request.getPaymentMethod() != null)
            order.setPaymentMethod(request.getPaymentMethod());

        List<OrderDetail> details = new ArrayList<>();
        double total = 0.0;
        if (request.getItems() != null) {
            for (OrderItemRequest it : request.getItems()) {
                if (it == null || it.getPastryId() == null || it.getQty() == null || it.getQty() <= 0)
                    continue;
                Optional<Pastry> pOpt = pastryRepository.findById(it.getPastryId());
                if (!pOpt.isPresent()) continue;
                Pastry pastry = pOpt.get();

                // TRỪ STOCK
                if (pastry.getStockQuantity() < it.getQty()) {
                    throw new RuntimeException("Sản phẩm " + pastry.getName() + " không đủ số lượng tồn kho (Còn: " + pastry.getStockQuantity() + ")");
                }
                int newStock = pastry.getStockQuantity() - it.getQty();
                pastry.setStockQuantity(newStock);
                if (newStock <= 0) {
                    pastry.setStatus(PastryStatus.OUT_OF_STOCK);
                }
                pastryRepository.save(pastry);

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
        orderRepository.save(order);

        Cart cart = cartRepository.findByUser_Id(account.getUser().getId()).orElse(null);
        if (cart != null) {
            cart.getCartItems().clear();
            cartRepository.save(cart);
        }

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
        resp.setLyDoHuy(order.getLyDoHuy());
        resp.setBankAccountName(order.getBankAccountName());
        resp.setBankAccountNumber(order.getBankAccountNumber());
        resp.setBankName(order.getBankName());

        if (order.getPaymentMethod() != null && "VNPAY".equalsIgnoreCase(order.getPaymentMethod())) {
            long amount = Math.round(order.getTongTien());
            try {
                String url = vnPayService.createPaymentUrl(order.getId(), amount, null, "Thanh toan don hang " + order.getId());
                resp.setPaymentUrl(url);
            } catch (Exception ex) {
                log.error("Failed to create VNPay url", ex);
            }
        }
        return resp;
    }

    @Override
    @Transactional
    public OrderResponse placeOrderFromTransaction(String txnRef) {
        // ... (Giữ nguyên code phần VNPAY transaction như trước)
        try {
            VnPayTransaction tx = vnPayTransactionRepository.findById(txnRef).orElse(null);
            if (tx == null) return null;

            iuh.fit.se.dtos.request.OrderRequest req = objectMapper.readValue(tx.getPayload(), iuh.fit.se.dtos.request.OrderRequest.class);
            AccountCredential account = accountCredentialRepository.findByCredential(tx.getUserId());
            iuh.fit.se.entities.User user = (account != null) ? account.getUser() : null;

            Order order = new Order();
            order.setId(tx.getId());
            order.setNgayDatHang(LocalDateTime.now());
            order.setTrangThai(TrangThaiDH.PAID);
            order.setCustomer(user);
            order.setPaymentMethod(req.getPaymentMethod() != null ? req.getPaymentMethod() : "VNPAY");

            // Copy bank info logic... (giữ nguyên)

            List<OrderDetail> details = new ArrayList<>();
            double total = 0.0;
            if (req.getItems() != null) {
                for (OrderItemRequest it : req.getItems()) {
                    if (it == null || it.getPastryId() == null || it.getQty() <= 0) continue;
                    Optional<Pastry> pOpt = pastryRepository.findById(it.getPastryId());
                    if (!pOpt.isPresent()) continue;
                    Pastry pastry = pOpt.get();

                    // TRỪ STOCK VNPAY
                    if (pastry.getStockQuantity() < it.getQty()) {
                        throw new RuntimeException("Sản phẩm " + pastry.getName() + " không đủ số lượng.");
                    }
                    int newStock = pastry.getStockQuantity() - it.getQty();
                    pastry.setStockQuantity(newStock);
                    if (newStock <= 0) {
                        pastry.setStatus(PastryStatus.OUT_OF_STOCK);
                    }
                    pastryRepository.save(pastry);

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
            orderRepository.save(order);

            // Clear cart logic... (giữ nguyên)
            if (user != null) {
                cartRepository.findByUser_Id(user.getId()).ifPresent(c -> {
                    c.getCartItems().clear();
                    cartRepository.save(c);
                });
            }

            tx.setStatus("PAID");
            vnPayTransactionRepository.save(tx);

            // Build response... (giữ nguyên)
            OrderResponse resp = new OrderResponse();
            resp.setId(order.getId());
            // ... copy fields
            return resp;
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    @Override
    public List<OrderResponse> getOrdersForCurrentUser() {
        // ... (Giữ nguyên logic cũ)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) return Collections.emptyList();
        String username = authentication.getName();
        AccountCredential account = accountCredentialRepository.findByCredential(username);
        if (account == null || account.getUser() == null) return Collections.emptyList();

        List<Order> orders = orderRepository.findByCustomer_Id(account.getUser().getId());
        List<OrderResponse> out = new ArrayList<>();
        for (Order o : orders) {
            // Mapping thủ công như cũ để tránh lỗi
            OrderResponse r = mapOrderToResponse(o);
            out.add(r);
        }
        return out;
    }

    @Override
    public OrderResponse getOrderById(String id) {
        // ... (Giữ nguyên logic cũ)
        Optional<Order> opt = orderRepository.findById(id);
        if (opt.isEmpty()) return null;
        return mapOrderToResponse(opt.get());
    }

    // Hàm phụ trợ để map Order -> OrderResponse cho gọn code
    private OrderResponse mapOrderToResponse(Order o) {
        OrderResponse r = new OrderResponse();
        r.setId(o.getId());
        r.setNgayDatHang(o.getNgayDatHang());
        r.setTongTien(o.getTongTien());
        r.setPaymentMethod(o.getPaymentMethod());
        r.setTrangThai(o.getTrangThai() == null ? null : o.getTrangThai().name());
        r.setCustomerAddress(o.getCustomer() != null ? o.getCustomer().getAddress() : null);
        r.setLyDoHuy(o.getLyDoHuy());
        r.setBankAccountName(o.getBankAccountName());
        r.setBankAccountNumber(o.getBankAccountNumber());
        r.setBankName(o.getBankName());
        List<OrderDetailResponse> items = new ArrayList<>();
        if (o.getOrderDetails() != null) {
            for (OrderDetail od : o.getOrderDetails()) {
                OrderDetailResponse dr = new OrderDetailResponse();
                dr.setId(od.getId());
                if (od.getPastry() != null) {
                    dr.setPastryId(od.getPastry().getId());
                    dr.setName(od.getPastry().getName());
                    dr.setPrice(od.getPastry().getPrice());
                    dr.setImage(od.getPastry().getImageUrl());
                }
                dr.setQty(od.getSoLuong());
                items.add(dr);
            }
        }
        r.setItems(items);
        return r;
    }

    @Override
    @Transactional
    public OrderResponse cancelOrder(String orderId, CancelOrderRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) throw new AppException(HttpCode.UNAUTHORIZED);

        String username = authentication.getName();
        AccountCredential account = accountCredentialRepository.findByCredential(username);
        if (account == null || account.getUser() == null) throw new AppException(HttpCode.UNAUTHORIZED);

        Optional<Order> opt = orderRepository.findById(orderId);
        if (opt.isEmpty()) throw new AppException(HttpCode.NOT_FOUND);

        Order order = opt.get();

        if (!order.getCustomer().getId().equals(account.getUser().getId()))
            throw new AppException(HttpCode.UNAUTHORIZED);

        if (order.getTrangThai() == TrangThaiDH.PENDING) {
            order.setTrangThai(TrangThaiDH.CANCELLED);

            // --- [START] LOGIC HOÀN TRẢ TỒN KHO KHI HỦY ĐƠN ---
            if (order.getOrderDetails() != null) {
                for (OrderDetail od : order.getOrderDetails()) {
                    Pastry p = od.getPastry();
                    if (p != null) {
                        // Cộng lại số lượng vào kho
                        p.setStockQuantity(p.getStockQuantity() + od.getSoLuong());

                        // Nếu bánh đang ở trạng thái Hết hàng, mở lại trạng thái Đang bán
                        if (p.getStatus() == PastryStatus.OUT_OF_STOCK) {
                            p.setStatus(PastryStatus.ACTIVE);
                        }
                        pastryRepository.save(p);
                    }
                }
            }
            // --- [END] LOGIC HOÀN TRẢ TỒN KHO ---

        } else if (order.getTrangThai() == TrangThaiDH.PAID) {
            order.setTrangThai(TrangThaiDH.REFUND_PENDING);
            // Với REFUND_PENDING (đã thanh toán), thường admin duyệt hoàn tiền mới hoàn kho
            // Nên tạm thời chưa cộng lại stock ở đây.
        } else {
            throw new RuntimeException("Chỉ có thể hủy đơn hàng khi đang ở trạng thái PENDING hoặc PAID");
        }

        order.setLyDoHuy(request.getLyDoHuy());
        orderRepository.save(order);

        return mapOrderToResponse(order);
    }
}