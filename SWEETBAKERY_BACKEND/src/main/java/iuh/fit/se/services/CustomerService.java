package iuh.fit.se.services;

import iuh.fit.se.dtos.request.CustomerRegistrationRequest;
import iuh.fit.se.dtos.response.CustomerRegistrationResponse;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 28/11/2025, Friday
 **/
public interface CustomerService {
    CustomerRegistrationResponse create(CustomerRegistrationRequest request);
}
