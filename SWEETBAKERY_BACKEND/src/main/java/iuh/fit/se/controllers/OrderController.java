package iuh.fit.se.controllers;

import iuh.fit.se.dtos.request.OrderRequest;
import iuh.fit.se.dtos.response.OrderResponse;
import iuh.fit.se.services.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderController {
    OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody OrderRequest request) {
        try {
            OrderResponse res = orderService.placeOrder(request);
            if (res == null)
                return ResponseEntity.status(400).body("Could not place order");
            return ResponseEntity.ok().body(res);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @GetMapping("")
    public ResponseEntity<?> listOrders() {
        try {
            List<OrderResponse> list = orderService.getOrdersForCurrentUser();
            return ResponseEntity.ok().body(list);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrder(@PathVariable String id) {
        try {
            OrderResponse r = orderService.getOrderById(id);
            if (r == null)
                return ResponseEntity.notFound().build();
            return ResponseEntity.ok().body(r);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }
}
