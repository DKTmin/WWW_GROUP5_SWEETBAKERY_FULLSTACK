package iuh.fit.se.controllers.admin;

import iuh.fit.se.dtos.request.OrderUpdateStatusRequest;
import iuh.fit.se.dtos.response.ApiResponse;
import iuh.fit.se.dtos.response.OrderResponse;
import iuh.fit.se.entities.enums.HttpCode;
import iuh.fit.se.services.admin.OrderAdminService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("admin/api/v1/orders")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class OrderAdminController {
    OrderAdminService orderAdminService;

    @GetMapping
    ApiResponse<List<OrderResponse>> getAllOrders() {
        return ApiResponse.<List<OrderResponse>>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(orderAdminService.getAllOrders())
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<OrderResponse> getOrderById(@PathVariable String id) {
        return ApiResponse.<OrderResponse>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(orderAdminService.getOrderById(id))
                .build();
    }

    @PutMapping("/{id}/status")
    ApiResponse<OrderResponse> updateOrderStatus(
            @PathVariable String id,
            @Valid @RequestBody OrderUpdateStatusRequest request) {
        return ApiResponse.<OrderResponse>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(orderAdminService.updateOrderStatus(id, request))
                .build();
    }
}

