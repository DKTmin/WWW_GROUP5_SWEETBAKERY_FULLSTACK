package iuh.fit.se.controllers.admin;

import iuh.fit.se.dtos.request.EmployeeRegistrationRequest;
import iuh.fit.se.dtos.request.EmployeeUpdateRequest;
import iuh.fit.se.dtos.response.ApiResponse;
import iuh.fit.se.dtos.response.EmployeeRegistrationResponse;
import iuh.fit.se.dtos.response.EmployeeUpdateResponse;
import iuh.fit.se.entities.enums.HttpCode;
import iuh.fit.se.services.admin.EmployeeAdminService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 3/12/2025, Wednesday
 **/

@RestController
@RequestMapping("admin/api/v1/employees")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class EmployeeAdminController {
    EmployeeAdminService employeeAdminService;
    @PostMapping
    ApiResponse<EmployeeRegistrationResponse> create(@Valid @RequestBody EmployeeRegistrationRequest request){
        return ApiResponse.<EmployeeRegistrationResponse>builder()
                .code(HttpCode.CREATED.getCODE())
                .message(HttpCode.CREATED.getMESSAGE())
                .data(employeeAdminService.create(request))
                .build();
    }

    @PutMapping("/{employeeId}")
    ApiResponse<EmployeeUpdateResponse> update(@PathVariable String employeeId, @Valid @RequestBody EmployeeUpdateRequest request){
        return ApiResponse.<EmployeeUpdateResponse>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(employeeAdminService.update(employeeId, request))
                .build();
    }
}
