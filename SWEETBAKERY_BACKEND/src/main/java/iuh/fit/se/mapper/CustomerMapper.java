package iuh.fit.se.mapper;

import iuh.fit.se.dtos.request.CustomerRegistrationRequest;
import iuh.fit.se.dtos.request.EmployeeRegistrationRequest;
import iuh.fit.se.dtos.response.CustomerRegistrationResponse;
import iuh.fit.se.dtos.response.UserResponse;
import iuh.fit.se.entities.Customer;
import iuh.fit.se.entities.Employee;
import iuh.fit.se.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 28/11/2025, Friday
 **/
@Mapper(componentModel = "spring")
public interface CustomerMapper {
    Customer toCustomer(CustomerRegistrationRequest request);

    CustomerRegistrationResponse toCustomerRegistrationResponse(Customer user);
}
