package iuh.fit.se.services.admin;

import iuh.fit.se.dtos.request.CustomerRegistrationRequest;
import iuh.fit.se.dtos.request.CustomerUpdateByAdminRequest;
import iuh.fit.se.dtos.request.EmployeeUpdateRequest;
import iuh.fit.se.dtos.response.CustomerRegistrationResponse;
import iuh.fit.se.dtos.response.CustomerUpdateByAdminResponse;
import iuh.fit.se.dtos.response.EmployeeUpdateResponse;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 1/12/2025, Monday
 **/
public interface CustomerAdminService {
    CustomerRegistrationResponse create(CustomerRegistrationRequest request);
    CustomerUpdateByAdminResponse update(String customerId, CustomerUpdateByAdminRequest request);
}
