package iuh.fit.se.controllers;

import iuh.fit.se.dtos.request.CustomerRegistrationRequest;
import iuh.fit.se.dtos.response.ApiResponse;
import iuh.fit.se.dtos.response.CustomerRegistrationResponse;
import iuh.fit.se.entities.enums.HttpCode;
import iuh.fit.se.services.CustomerService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @PostMapping("/register")
    ApiResponse<CustomerRegistrationResponse> register(@Valid @RequestBody CustomerRegistrationRequest request){
        return ApiResponse.<CustomerRegistrationResponse>builder()
                .code(HttpCode.CREATED.getCODE())
                .message(HttpCode.CREATED.getMESSAGE())
                .data(customerService.create(request))
                .build();
    }
}
