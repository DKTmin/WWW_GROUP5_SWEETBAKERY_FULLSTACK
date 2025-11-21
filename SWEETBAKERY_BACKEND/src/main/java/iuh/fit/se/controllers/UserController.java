package iuh.fit.se.controllers;

import iuh.fit.se.dtos.response.ApiResponse;
import iuh.fit.se.dtos.response.UserResponse;
import iuh.fit.se.entities.User;
import iuh.fit.se.entities.enums.HttpCode;
import iuh.fit.se.repositories.UserRepository;
import iuh.fit.se.services.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 19/11/2025, Wednesday
 **/
@RestController
@RequestMapping("user-management/api/v1/users")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class UserController {
    UserService userService;
    @GetMapping
    ApiResponse<List<UserResponse>> findAll(){
        return ApiResponse.<List<UserResponse>>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(userService.findAll())
                .build();
    }
}
