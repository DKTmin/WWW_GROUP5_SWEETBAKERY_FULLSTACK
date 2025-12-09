package iuh.fit.se.services;

import iuh.fit.se.dtos.request.*;
import iuh.fit.se.dtos.response.AuthenticationResponse;
import iuh.fit.se.dtos.response.CreateNewPasswordResponse;
import iuh.fit.se.dtos.response.IntrospectResponse;
import iuh.fit.se.entities.AccountCredential;
import iuh.fit.se.entities.User;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 19/11/2025, Wednesday
 **/
public interface AuthenticationService {
    AuthenticationResponse authenticate(AuthenticationRequest request);
    IntrospectResponse introspect(IntrospectRequest request);
    void logout(LogoutRequest request);
    AuthenticationResponse refreshToken(RefreshTokenRequest request);

    CreateNewPasswordResponse forgetPassword(CreateNewPasswordRequest request);
    String generateAccessToken(User user, AccountCredential accountCredential);

}
