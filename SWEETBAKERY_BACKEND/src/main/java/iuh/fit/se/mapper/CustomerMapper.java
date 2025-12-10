package iuh.fit.se.mapper;

import iuh.fit.se.dtos.request.CustomerRegistrationRequest;
import iuh.fit.se.dtos.request.CustomerSeftUpdateRequest;
import iuh.fit.se.dtos.request.CustomerUpdateByAdminRequest;
import iuh.fit.se.dtos.request.EmployeeRegistrationRequest;
import iuh.fit.se.dtos.response.CustomerRegistrationResponse;
import iuh.fit.se.dtos.response.CustomerSeftUpdateResponse;
import iuh.fit.se.dtos.response.CustomerUpdateByAdminResponse;
import iuh.fit.se.dtos.response.UserResponse;
import iuh.fit.se.entities.Customer;
import iuh.fit.se.entities.Employee;
import iuh.fit.se.entities.User;
import org.mapstruct.*;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 28/11/2025, Friday
 **/
@Mapper(componentModel = "spring")
public interface CustomerMapper {
    @Mapping(target = "id", ignore = true)
    Customer toCustomer(CustomerRegistrationRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "loyaltyPoints", ignore = true)
    })
    void updateCustomer(@MappingTarget Customer customer, CustomerSeftUpdateRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mappings({
            @Mapping(target = "id", ignore = true),
    })
    void updateCustomerByAdmin(@MappingTarget Customer customer, CustomerUpdateByAdminRequest request);
    CustomerRegistrationResponse toCustomerRegistrationResponse(Customer user);
    CustomerSeftUpdateResponse toCustomerSeftUpdateResponse(Customer user);
    CustomerUpdateByAdminResponse toCustomerUpdateByAdminResponse(Customer user);
}
