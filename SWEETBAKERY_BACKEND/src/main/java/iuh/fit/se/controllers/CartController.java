package iuh.fit.se.controllers;

import iuh.fit.se.dtos.request.CartItemSyncRequest;
import iuh.fit.se.dtos.request.CartSyncRequest;
import iuh.fit.se.services.CartService;
// imports trimmed
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartController {
    CartService cartService;

    @PostMapping("/sync")
    public ResponseEntity<?> syncCart(@RequestBody CartSyncRequest request) {
        try {
            List<CartItemSyncRequest> items = request.getItems();
            if (items == null)
                items = List.of();
            boolean replace = Boolean.TRUE.equals(request.getReplace());
            cartService.syncCartForCurrentUser(items, replace);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    @GetMapping("")
    public ResponseEntity<?> getCartForCurrentUser() {
        try {
            java.util.List<iuh.fit.se.dtos.response.CartItemResponse> items = cartService.getCartForCurrentUser();
            return ResponseEntity.ok().body(java.util.Map.of("items", items));
        } catch (Exception e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }
}
