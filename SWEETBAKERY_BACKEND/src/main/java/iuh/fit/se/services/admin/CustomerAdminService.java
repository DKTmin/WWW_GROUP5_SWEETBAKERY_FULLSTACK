package iuh.fit.se.services.admin;

import iuh.fit.se.dtos.request.CustomerRegistrationRequest;
import iuh.fit.se.dtos.response.CustomerRegistrationResponse;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 1/12/2025, Monday
 **/
public interface CustomerAdminService {
    CustomerRegistrationResponse create(CustomerRegistrationRequest request);
}
