package iuh.fit.se.services;

import iuh.fit.se.dtos.request.CartItemSyncRequest;

import java.util.List;

public interface CartService {
    void syncCartForCurrentUser(List<CartItemSyncRequest> items, boolean replace);

    java.util.List<iuh.fit.se.dtos.response.CartItemResponse> getCartForCurrentUser();
}
