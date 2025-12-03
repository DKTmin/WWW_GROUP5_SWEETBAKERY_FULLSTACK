package iuh.fit.se.controllers;

import iuh.fit.se.dtos.request.CustomerRegistrationRequest;
import iuh.fit.se.dtos.request.EmployeeRegistrationRequest;
import iuh.fit.se.dtos.response.ApiResponse;
import iuh.fit.se.dtos.response.CustomerRegistrationResponse;
import iuh.fit.se.dtos.response.EmployeeRegistrationResponse;
import iuh.fit.se.entities.enums.HttpCode;
import iuh.fit.se.services.CustomerService;
import iuh.fit.se.services.EmployeeService;
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
@RequestMapping("employee-management/api/v1/employees")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class EmployeeController {
    EmployeeService employeeService;

    @GetMapping
    ApiResponse<List<EmployeeRegistrationResponse>> findALl(){
        return ApiResponse.<List<EmployeeRegistrationResponse>>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(employeeService.getALl())
                .build();
    }
}
