package iuh.fit.se.services.admin.impl;

import iuh.fit.se.dtos.request.OrderUpdateStatusRequest;
import iuh.fit.se.dtos.response.OrderDetailResponse;
import iuh.fit.se.dtos.response.OrderResponse;
import iuh.fit.se.entities.Order;
import iuh.fit.se.entities.OrderDetail;
import iuh.fit.se.entities.enums.HttpCode;
import iuh.fit.se.entities.enums.TrangThaiDH;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.repositories.OrderRepository;
import iuh.fit.se.services.admin.OrderAdminService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class OrderAdminServiceImpl implements OrderAdminService {
    OrderRepository orderRepository;

    @Override
    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        List<OrderResponse> out = new ArrayList<>();
        for (Order o : orders) {
            out.add(mapToOrderResponse(o));
        }
        return out;
    }

    @Override
    public OrderResponse getOrderById(String id) {
        Optional<Order> opt = orderRepository.findById(id);
        if (opt.isEmpty()) {
            throw new AppException(HttpCode.NOT_FOUND);
        }
        return mapToOrderResponse(opt.get());
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(String orderId, OrderUpdateStatusRequest request) {
        Optional<Order> opt = orderRepository.findById(orderId);
        if (opt.isEmpty()) {
            throw new AppException(HttpCode.NOT_FOUND);
        }

        Order order = opt.get();
        TrangThaiDH current = order.getTrangThai();
        TrangThaiDH target = request.getTrangThai();

        boolean allowed = (current == TrangThaiDH.PENDING && target == TrangThaiDH.CONFIRMED) ||
                (current == TrangThaiDH.PAID && target == TrangThaiDH.CONFIRMED) ||
                (current == TrangThaiDH.REFUND_PENDING && target == TrangThaiDH.CANCELLED);

        if (!allowed) {
            throw new AppException(HttpCode.BAD_REQUEST);
        }

        order.setTrangThai(target);
        if (target == TrangThaiDH.CANCELLED && current == TrangThaiDH.REFUND_PENDING) {
            order.setRefundProofImageUrl(request.getRefundProofImageUrl());
        }
        orderRepository.save(order);

        log.info("Order {} status updated to {}", orderId, request.getTrangThai());
        return mapToOrderResponse(order);
    }

    private OrderResponse mapToOrderResponse(Order o) {
        OrderResponse r = new OrderResponse();
        r.setId(o.getId());
        r.setNgayDatHang(o.getNgayDatHang());
        r.setTongTien(o.getTongTien());
        r.setPaymentMethod(o.getPaymentMethod());
        r.setTrangThai(o.getTrangThai() == null ? null : o.getTrangThai().name());
        r.setCustomerAddress(o.getCustomer() != null ? o.getCustomer().getAddress() : null);

        // Add customer name
        String customerName = null;
        if (o.getCustomer() != null) {
            String firstName = o.getCustomer().getFirstName();
            String lastName = o.getCustomer().getLastName();
            if (firstName != null || lastName != null) {
                customerName = (firstName != null ? firstName : "") + " " + (lastName != null ? lastName : "");
                customerName = customerName.trim();
            }
        }
        r.setCustomerName(customerName);
        r.setLyDoHuy(o.getLyDoHuy());
        r.setBankAccountName(o.getBankAccountName());
        r.setBankAccountNumber(o.getBankAccountNumber());
        r.setBankName(o.getBankName());
        r.setRefundProofImageUrl(o.getRefundProofImageUrl());

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
