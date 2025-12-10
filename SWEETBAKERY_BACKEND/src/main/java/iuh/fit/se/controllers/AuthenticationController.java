package iuh.fit.se.controllers;

import iuh.fit.se.dtos.request.*;
import iuh.fit.se.dtos.response.ApiResponse;
import iuh.fit.se.dtos.response.AuthenticationResponse;
import iuh.fit.se.dtos.response.CreateNewPasswordResponse;
import iuh.fit.se.dtos.response.IntrospectResponse;
import iuh.fit.se.entities.AccountCredential;
import iuh.fit.se.entities.Customer;
import iuh.fit.se.entities.User;
import iuh.fit.se.entities.enums.HttpCode;
import iuh.fit.se.entities.enums.TokenType;
import iuh.fit.se.repositories.AccountCredentialRepository;
import iuh.fit.se.repositories.CustomerRepository;
import iuh.fit.se.services.AuthenticationService;
import iuh.fit.se.services.CustomerService;
import iuh.fit.se.services.GoogleAuthService;
import iuh.fit.se.services.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 19/11/2025, Wednesday
 **/
@RestController
@RequestMapping("auth-management/api/v1/auth")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class AuthenticationController {
    AuthenticationService authenticationService;
    GoogleAuthService googleAuthService;
    UserService userService;
    CustomerService customerService;
    AccountCredentialRepository accountCredentialRepository;
    CustomerRepository customerRepository;

    @PostMapping("/log-in")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        return ApiResponse.<AuthenticationResponse>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(authenticationService.authenticate(request))
                .build();
    }

    @PostMapping("/log-out")
    ApiResponse<Void> logout(@RequestBody LogoutRequest request) {
        authenticationService.logout(request);
        return ApiResponse.<Void>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .build();
    }

    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> introspect(@RequestBody IntrospectRequest request) {
        return ApiResponse.<IntrospectResponse>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(authenticationService.introspect(request))
                .build();
    }

    @PostMapping("/refresh")
    ApiResponse<AuthenticationResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        return ApiResponse.<AuthenticationResponse>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(authenticationService.refreshToken(request))
                .build();
    }

    @PostMapping("/forget-password")
    ApiResponse<CreateNewPasswordResponse> forgetPassword(@RequestBody CreateNewPasswordRequest request) {
        CreateNewPasswordResponse response = authenticationService.forgetPassword(request);
        return ApiResponse.<CreateNewPasswordResponse>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(response)
                .build();
    }

    @PostMapping("/google")
    public ApiResponse<AuthenticationResponse> loginWithGoogle(@RequestBody GoogleLoginRequest request) {
        return ApiResponse.<AuthenticationResponse>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                // Gọi hàm xử lý logic bên Service
                .data(authenticationService.authenticateGoogleUser(request.getCode()))
                .build();
    }
}
