package iuh.fit.se.mapper;

import iuh.fit.se.dtos.request.EmployeeRegistrationRequest;
import iuh.fit.se.dtos.request.EmployeeUpdateRequest;
import iuh.fit.se.dtos.response.EmployeeRegistrationResponse;
import iuh.fit.se.dtos.response.EmployeeUpdateResponse;
import iuh.fit.se.entities.Employee;
import iuh.fit.se.entities.Role;
import org.mapstruct.*;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 28/11/2025, Friday
 **/
@Mapper(componentModel = "spring")
public interface EmployeeMapper {
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "roles", ignore = true)
    })
    Employee toEmployee(EmployeeRegistrationRequest request);

    EmployeeRegistrationResponse toEmployeeRegistrationResponse(Employee employee);

    @Mapping(target = "roles", ignore = true)
    Employee toEmployee(EmployeeUpdateRequest request);

    EmployeeUpdateResponse toEmployeeUpdateResponse(Employee employee);

//    default Set<Role> map(List<String> roles) {
//        if (roles == null)
//            return null;
//        return roles.stream()
//                .filter(r -> r != null && !r.isBlank())
//                .map(r -> Role.builder().name(r).build())
//                .collect(Collectors.toSet());
//    }

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "roles", ignore = true)
    })
    void update(@MappingTarget Employee employee, EmployeeUpdateRequest request);
}
