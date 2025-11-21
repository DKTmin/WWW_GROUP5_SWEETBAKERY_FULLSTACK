package iuh.fit.se.mapper;

import iuh.fit.se.dtos.request.RegistrationRequest;
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
    @Mapping(target = "id", ignore = true)
    User toUser(RegistrationRequest request);

    UserResponse toUserResponse(User user);

}
