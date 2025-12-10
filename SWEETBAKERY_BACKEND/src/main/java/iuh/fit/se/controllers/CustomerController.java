package iuh.fit.se.controllers;

import iuh.fit.se.dtos.request.CustomerRegistrationRequest;
import iuh.fit.se.dtos.request.CustomerSeftUpdateRequest;
import iuh.fit.se.dtos.response.ApiResponse;
import iuh.fit.se.dtos.response.CustomerRegistrationResponse;
import iuh.fit.se.dtos.response.CustomerSeftUpdateResponse;
import iuh.fit.se.dtos.response.EmployeeRegistrationResponse;
import iuh.fit.se.entities.enums.HttpCode;
import iuh.fit.se.services.CustomerService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 28/11/2025, Friday
 **/

@RestController
@RequestMapping("customer-management/api/v1/customers")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class CustomerController {
    CustomerService customerService;

    @GetMapping
    ApiResponse<List<CustomerRegistrationResponse>> findALl(){
        return ApiResponse.<List<CustomerRegistrationResponse>>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(customerService.getALl())
                .build();
    }

    @PostMapping("/register")
    ApiResponse<CustomerRegistrationResponse> register(@Valid @RequestBody CustomerRegistrationRequest request){
        return ApiResponse.<CustomerRegistrationResponse>builder()
                .code(HttpCode.CREATED.getCODE())
                .message(HttpCode.CREATED.getMESSAGE())
                .data(customerService.create(request))
                .build();
    }

    @PostMapping("/update/{userId}")
    ApiResponse<CustomerSeftUpdateResponse> update(@PathVariable String userId, @Valid @RequestBody CustomerSeftUpdateRequest request){
        return ApiResponse.<CustomerSeftUpdateResponse>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(customerService.update(userId, request))
                .build();
    }
}
