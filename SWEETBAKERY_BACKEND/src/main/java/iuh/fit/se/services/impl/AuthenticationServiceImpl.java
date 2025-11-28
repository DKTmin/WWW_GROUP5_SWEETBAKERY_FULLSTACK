package iuh.fit.se.services.impl;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import iuh.fit.se.dtos.request.*;
import iuh.fit.se.dtos.response.AuthenticationResponse;
import iuh.fit.se.dtos.response.IntrospectResponse;
import iuh.fit.se.entities.AccountCredential;
import iuh.fit.se.entities.User;
import iuh.fit.se.entities.enums.HttpCode;
import iuh.fit.se.entities.enums.TokenType;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.mapper.AccountMapper;
import iuh.fit.se.mapper.UserMapper;
import iuh.fit.se.repositories.AccountCredentialRepository;
import iuh.fit.se.repositories.RoleRepository;
import iuh.fit.se.repositories.UserRepository;
import iuh.fit.se.services.AuthenticationService;
import iuh.fit.se.services.RedisService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 19/11/2025, Wednesday
 **/
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class AuthenticationServiceImpl implements AuthenticationService {
    AccountMapper accountMapper;
    UserMapper userMapper;
    AccountCredentialRepository accountCredentialRepository;
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;
    RedisService redisService;

    @NonFinal
    @Value("${jwt.secret-key}")
    String SECRET_KEY;
    @Override
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        AccountCredential accountCredential = accountCredentialRepository.findByCredential(request.getIdentifier());
        if(accountCredential == null)
             throw new NullPointerException("Account not found!");
        if(!passwordEncoder.matches(request.getPassword(), accountCredential.getPassword()))
            throw new AppException(HttpCode.UNAUTHENTICATED);
        User user = userRepository.findById(accountCredential.getUser().getId())
                .orElseThrow(()-> new NullPointerException("User not found!"));

        String accessToken = generateAccessToken(user, accountCredential);
        String refreshToken = generateRefreshToken(user, accountCredential);

        return AuthenticationResponse.builder()
                .authenticated(true)
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType(TokenType.BEARER.getTokenType())
                .build();
    }

    @Override
    public IntrospectResponse introspect(IntrospectRequest request) {
        var token = request.getToken();
        boolean isValid = true;
        try {
            verifyToken(token);
        } catch (Exception e) {
            isValid = false;
        }
        return IntrospectResponse.builder()
                .valid(isValid)
                .build();
    }

    @Override
    public void logout(LogoutRequest request) {
        String token = request.getToken();
        if(token == null || token.isBlank())
            throw new IllegalArgumentException("Token invalid!");
        try {
            SignedJWT signedJWT = verifyToken(token);
            Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
            long now = System.currentTimeMillis();
            long expirySeconds = (expiryTime.getTime() - now) / 1000;

            if(expirySeconds > 0){
                redisService.setToken(signedJWT.getJWTClaimsSet().getJWTID(), expirySeconds, TimeUnit.SECONDS);
                log.info("Token đã được thêm vào Redis blacklist, TTL={} giây", expirySeconds);
            }else{
                log.info("Token đã hết hạn!");
            }
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public AuthenticationResponse refreshToken(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();
        SignedJWT signedJWT = verifyToken(refreshToken);
        String username;

        try {
            username = signedJWT.getJWTClaimsSet().getSubject();
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }

        AccountCredential accountCredential = accountCredentialRepository.findByCredential(username);
        User user = accountCredential.getUser();

        String newAccessToken = generateAccessToken(user, accountCredential);

        return AuthenticationResponse.builder()
                .authenticated(true)
                .accessToken(newAccessToken)
                .refreshToken(refreshToken)
                .tokenType(TokenType.BEARER.getTokenType())
                .build();
    }

    private String generateAccessToken(User user, AccountCredential accountCredential){
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(accountCredential.getCredential())
                .issuer("user664dntp.dev")
                .issueTime(new Date())
                .expirationTime(Date.from(Instant.now().plus(1, ChronoUnit.MINUTES)))
                .claim("scope", buildScope(user))
                .jwtID(UUID.randomUUID().toString())
                .build();
        return signToken(jwtClaimsSet);
    }

    private String generateRefreshToken(User user, AccountCredential accountCredential){
        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(accountCredential.getCredential())
                .issuer("user664dntp.dev")
                .issueTime(new Date())
                .expirationTime(Date.from(Instant.now().plus(10, ChronoUnit.MINUTES)))
                .jwtID(UUID.randomUUID().toString())
                .build();
        return signToken(claimsSet);
    }

    private String signToken(JWTClaimsSet claimsSet){
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        Payload payload = new Payload(claimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);
        try {
            jwsObject.sign(new MACSigner(SECRET_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }
    }

    public SignedJWT verifyToken(String token){
        try {
            JWSVerifier verifier = new MACVerifier(SECRET_KEY.getBytes());
            SignedJWT signedJWT = SignedJWT.parse(token);
            boolean verified = signedJWT.verify(verifier);

            Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
            if(!(verified && expiryTime.after(new Date())))
                throw new AppException(HttpCode.UNAUTHENTICATED);
            if(redisService.isTokenInvalidated(signedJWT.getJWTClaimsSet().getJWTID()))
                throw new AppException(HttpCode.UNAUTHENTICATED);
            return signedJWT;
        } catch (JOSEException | ParseException e) {
            throw new RuntimeException(e);
        }
    }
    private String buildScope(User user){
        StringJoiner roles = new StringJoiner(" ");
        if(!CollectionUtils.isEmpty(user.getRoles()))
            user.getRoles().forEach(role -> roles.add(role.getName()));
        return roles.toString();
    }
}
