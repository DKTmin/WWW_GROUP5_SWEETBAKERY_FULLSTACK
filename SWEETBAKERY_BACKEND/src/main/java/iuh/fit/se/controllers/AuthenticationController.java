package iuh.fit.se.controllers;

import iuh.fit.se.dtos.request.*;
import iuh.fit.se.dtos.response.ApiResponse;
import iuh.fit.se.dtos.response.AuthenticationResponse;
import iuh.fit.se.dtos.response.IntrospectResponse;
import iuh.fit.se.dtos.response.RegistrationResponse;
import iuh.fit.se.entities.enums.HttpCode;
import iuh.fit.se.services.AuthenticationService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @PostMapping("/register")
    ApiResponse<RegistrationResponse> register(@Valid @RequestBody RegistrationRequest request){
        return ApiResponse.<RegistrationResponse>builder()
                .code(HttpCode.CREATED.getCODE())
                .message(HttpCode.CREATED.getMESSAGE())
                .data(authenticationService.register(request))
                .build();
    }

    @PostMapping("/log-in")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request){
        return ApiResponse.<AuthenticationResponse>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(authenticationService.authenticate(request))
                .build();
    }

    @PostMapping("/log-out")
    ApiResponse<Void> logout(@RequestBody LogoutRequest request){
        authenticationService.logout(request);
        return ApiResponse.<Void>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .build();
    }
    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> introspect(@RequestBody IntrospectRequest request){
        return ApiResponse.<IntrospectResponse>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(authenticationService.introspect(request))
                .build();
    }

    @PostMapping("/refresh")
    ApiResponse<AuthenticationResponse> refreshToken(@RequestBody RefreshTokenRequest request){
        return ApiResponse.<AuthenticationResponse>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(authenticationService.refreshToken(request))
                .build();
    }
}
