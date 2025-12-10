package iuh.fit.se.services.admin;

import iuh.fit.se.dtos.request.EmployeeRegistrationRequest;
import iuh.fit.se.dtos.request.EmployeeUpdateRequest;
import iuh.fit.se.dtos.response.EmployeeRegistrationResponse;
import iuh.fit.se.dtos.response.EmployeeUpdateResponse;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 3/12/2025, Wednesday
 **/
public interface EmployeeAdminService {
    EmployeeRegistrationResponse create(EmployeeRegistrationRequest request);
    EmployeeUpdateResponse update(String employeeId, EmployeeUpdateRequest request);
}
