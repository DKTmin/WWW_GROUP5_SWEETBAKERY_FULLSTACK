package iuh.fit.se.services;

import iuh.fit.se.dtos.request.AuthenticationRequest;
import iuh.fit.se.dtos.request.IntrospectRequest;
import iuh.fit.se.dtos.request.RegistrationRequest;
import iuh.fit.se.dtos.response.AuthenticationResponse;
import iuh.fit.se.dtos.response.IntrospectResponse;
import iuh.fit.se.dtos.response.RegistrationResponse;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 19/11/2025, Wednesday
 **/
public interface AuthenticationService {
    RegistrationResponse register(RegistrationRequest request);
    AuthenticationResponse authenticate(AuthenticationRequest request);
    IntrospectResponse introspect(IntrospectRequest request);
}
