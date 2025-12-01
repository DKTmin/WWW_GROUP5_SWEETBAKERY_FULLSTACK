package iuh.fit.se.mapper;

import iuh.fit.se.dtos.request.CustomerRegistrationRequest;
import iuh.fit.se.dtos.request.CustomerSeftUpdateRequest;
import iuh.fit.se.dtos.request.EmployeeRegistrationRequest;
import iuh.fit.se.dtos.response.CustomerRegistrationResponse;
import iuh.fit.se.dtos.response.CustomerSeftUpdateResponse;
import iuh.fit.se.dtos.response.UserResponse;
import iuh.fit.se.entities.Customer;
import iuh.fit.se.entities.Employee;
import iuh.fit.se.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Mappings;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 28/11/2025, Friday
 **/
@Mapper(componentModel = "spring")
public interface CustomerMapper {
    @Mapping(target = "id", ignore = true)
    Customer toCustomer(CustomerRegistrationRequest request);
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "loyaltyPoints", ignore = true)
    void updateCustomer(@MappingTarget Customer customer, CustomerSeftUpdateRequest request);
    CustomerRegistrationResponse toCustomerRegistrationResponse(Customer user);
    CustomerSeftUpdateResponse toCustomerSeftUpdateResponse(Customer user);
}
