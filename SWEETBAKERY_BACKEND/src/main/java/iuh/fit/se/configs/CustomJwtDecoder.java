package iuh.fit.se.configs;

import com.nimbusds.jwt.SignedJWT;
import iuh.fit.se.dtos.request.IntrospectRequest;
import iuh.fit.se.dtos.response.IntrospectResponse;
import iuh.fit.se.entities.enums.HttpCode;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.services.AuthenticationService;
import iuh.fit.se.services.RedisService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 20/11/2025, Thursday
 **/
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Component
public class CustomJwtDecoder implements JwtDecoder {
    @NonFinal
    @Value("${jwt.secret-key}")
    String SECRET_KEY;

    AuthenticationService authenticationService;
    RedisService redisService;
    @NonFinal
    NimbusJwtDecoder nimbusJwtDecoder = null;

    @Override
    public Jwt decode(String token) throws JwtException {
        if(redisService.isTokenInvalidated(token))
            throw new JwtException("Token invalidated (logged out)!");
        IntrospectRequest introspectRequest = IntrospectRequest.builder()
                .token(token)
                .build();
        IntrospectResponse introspectResponse = authenticationService.introspect(introspectRequest);
        if(!introspectResponse.isValid())
            throw new AppException(HttpCode.UNAUTHENTICATED);
        SecretKeySpec secretKeySpec = new SecretKeySpec(SECRET_KEY.getBytes(), "HS512");
        nimbusJwtDecoder = NimbusJwtDecoder.withSecretKey(secretKeySpec)
                .macAlgorithm(MacAlgorithm.HS512)
                .build();
        return nimbusJwtDecoder.decode(token);
    }
}
