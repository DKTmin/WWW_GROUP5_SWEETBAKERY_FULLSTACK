package iuh.fit.se.mapper;

import iuh.fit.se.dtos.request.CustomerRegistrationRequest;
import iuh.fit.se.dtos.request.EmployeeRegistrationRequest;
import iuh.fit.se.dtos.response.UserResponse;
import iuh.fit.se.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 19/11/2025, Wednesday
 **/

@Mapper(componentModel = "spring")
public interface UserMapper {
//    @Mapping(target = "id", ignore = true)
//    User toUser(CustomerRegistrationRequest request);
//
//    @Mapping(target = "id", ignore = true)
//    User toUser(EmployeeRegistrationRequest request);
//
    UserResponse toUserResponse(User user);
}
