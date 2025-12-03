package iuh.fit.se.mapper;

import iuh.fit.se.dtos.request.EmployeeRegistrationRequest;
import iuh.fit.se.dtos.request.EmployeeUpdateRequest;
import iuh.fit.se.dtos.response.EmployeeRegistrationResponse;
import iuh.fit.se.dtos.response.EmployeeUpdateResponse;
import iuh.fit.se.entities.Employee;
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
public interface EmployeeMapper {
    Employee toEmployee(EmployeeRegistrationRequest request);

    EmployeeRegistrationResponse toEmployeeRegistrationResponse(Employee employee);

    @Mapping(target = "roles", ignore = true)
    Employee toEmployee(EmployeeUpdateRequest request);

    EmployeeUpdateResponse toEmployeeUpdateResponse(Employee employee);

    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "roles", ignore = true)
    })
    void update(@MappingTarget Employee employee, EmployeeUpdateRequest request);
}
