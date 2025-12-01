package iuh.fit.se.services;

import iuh.fit.se.dtos.response.UserResponse;

import java.util.List;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 19/11/2025, Wednesday
 **/
public interface UserService {
    List<UserResponse> findAll();
    UserResponse getUserInformation();
    UserResponse updateInfor(iuh.fit.se.dtos.request.UpdateUserRequest request);

    boolean delete(String id);
}
