package iuh.fit.se.services;

import iuh.fit.se.dtos.request.OrderRequest;
import iuh.fit.se.dtos.response.OrderResponse;

import java.util.List;

public interface OrderService {
    OrderResponse placeOrder(OrderRequest request);

    // create order from stored VNPay transaction payload (used after successful
    // payment)
    OrderResponse placeOrderFromTransaction(String txnRef);

    List<OrderResponse> getOrdersForCurrentUser();

    OrderResponse getOrderById(String id);
}
