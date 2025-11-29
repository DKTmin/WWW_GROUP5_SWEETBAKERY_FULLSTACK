package iuh.fit.se.services;

import iuh.fit.se.dtos.request.OrderRequest;
import iuh.fit.se.dtos.response.OrderResponse;

import java.util.List;

public interface OrderService {
    OrderResponse placeOrder(OrderRequest request);

    List<OrderResponse> getOrdersForCurrentUser();

    OrderResponse getOrderById(String id);
}
