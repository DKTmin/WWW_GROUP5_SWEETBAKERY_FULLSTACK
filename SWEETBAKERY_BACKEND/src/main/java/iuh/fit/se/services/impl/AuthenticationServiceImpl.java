package iuh.fit.se.services.impl;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import iuh.fit.se.dtos.request.*;
import iuh.fit.se.dtos.response.AuthenticationResponse;
import iuh.fit.se.dtos.response.CreateNewPasswordResponse;
import iuh.fit.se.dtos.response.IntrospectResponse;
import iuh.fit.se.entities.AccountCredential;
import iuh.fit.se.entities.Customer;
import iuh.fit.se.entities.Role;
import iuh.fit.se.entities.User;
import iuh.fit.se.entities.enums.AccountType;
import iuh.fit.se.entities.enums.HttpCode;
import iuh.fit.se.entities.enums.TokenType;
import iuh.fit.se.entities.enums.UserRole;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.mapper.AccountMapper;
import iuh.fit.se.mapper.UserMapper;
import iuh.fit.se.repositories.AccountCredentialRepository;
import iuh.fit.se.repositories.CustomerRepository;
import iuh.fit.se.repositories.RoleRepository;
import iuh.fit.se.repositories.UserRepository;
import iuh.fit.se.services.AuthenticationService;
import iuh.fit.se.services.GoogleAuthService;
import iuh.fit.se.services.RedisService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
@Transactional
public class AuthenticationServiceImpl implements AuthenticationService {
    AccountMapper accountMapper;
    UserMapper userMapper;
    AccountCredentialRepository accountCredentialRepository;
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;
    RedisService redisService;
    GoogleAuthService googleAuthService;
    CustomerRepository customerRepository;

    @NonFinal
    @Value("${jwt.secret-key}")
    String SECRET_KEY;

    @NonFinal
    @Value("${jwt.access-token-time}")
    long ACCESS_TOKEN_TIME;

    @NonFinal
    @Value("${jwt.refresh-token-time}")
    long REFRESH_TOKEN_TIME;
    @Override
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        AccountCredential accountCredential = accountCredentialRepository.findByCredential(request.getIdentifier());
        if(accountCredential == null) throw new AppException(HttpCode.ACCOUNT_NOT_FOUND);
        if(!accountCredential.getIsVerified()) throw new AppException(HttpCode.DISABLE_ACCOUNT);
        if(!passwordEncoder.matches(request.getPassword(), accountCredential.getPassword()))
            throw new AppException(HttpCode.PASSWORD_INCORRECT);
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

    @Override
    public CreateNewPasswordResponse forgetPassword(CreateNewPasswordRequest request) {
        if(request.getNewPassword() == null) throw new AppException(HttpCode.NOT_FOUND);
        if(!request.getNewPassword().equalsIgnoreCase(request.getConfirmNewPassword()))
            throw new AppException((HttpCode.PASSWORD_NOMATCH));
        SignedJWT signedJWT = verifyToken(request.getResetPasswordToken());
        try {
            String email = signedJWT.getJWTClaimsSet().getSubject();
            AccountCredential emailAccount = accountCredentialRepository.findByCredential(email);
            if(emailAccount == null) throw new AppException(HttpCode.EMAIL_NOT_FOUND);
            String userId = emailAccount.getUser().getId();

            Set<AccountCredential> accounts = accountCredentialRepository.findAllByUserId(userId);
            String newPasswordEncode = passwordEncoder.encode(request.getNewPassword());
            accounts.forEach(acc -> acc.setPassword(newPasswordEncode));
            accountCredentialRepository.saveAll(accounts);
            return CreateNewPasswordResponse.builder()
                    .newPassword(newPasswordEncode)
                    .build();
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }

    }
    @Override
    public String generateAccessToken(User user, AccountCredential accountCredential){
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(accountCredential.getCredential())
                .issuer("user664dntp.dev")
                .issueTime(new Date())
                .expirationTime(Date.from(Instant.now().plus(ACCESS_TOKEN_TIME, ChronoUnit.MINUTES)))
                .claim("scope", buildScope(user))
                .jwtID(UUID.randomUUID().toString())
                .build();
        return signToken(jwtClaimsSet);
    }

    public String generateRefreshToken(User user, AccountCredential accountCredential){
        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(accountCredential.getCredential())
                .issuer("user664dntp.dev")
                .issueTime(new Date())
                .expirationTime(Date.from(Instant.now().plus(REFRESH_TOKEN_TIME, ChronoUnit.MINUTES)))
                .jwtID(UUID.randomUUID().toString())
                .build();
        return signToken(claimsSet);
    }

    @Override
    public AuthenticationResponse authenticateGoogleUser(String code) {
        Map<String, Object> googleUser = googleAuthService.authenticateGoogle(code);

        String email = (String) googleUser.get("email");
        String name = (String) googleUser.get("name");
        String avatar = (String) googleUser.get("picture");

        AccountCredential account = accountCredentialRepository.findByCredential(email);
        User user;

        if (account != null) {
            user = account.getUser();
        } else {
            Customer newCustomer = new Customer();
            newCustomer.setEmail(email);
            newCustomer.setFirstName(name);

            Role customerRole = roleRepository.findById(UserRole.CUSTOMER.name())
                    .orElseThrow(() -> new AppException(HttpCode.ROLE_NOT_FOUND));
            newCustomer.setRoles(Set.of(customerRole));

            user = customerRepository.save(newCustomer);

            account = AccountCredential.builder()
                    .credential(email)
                    .user(user)
                    .type(AccountType.GOOGLE)
                    .isVerified(true)
                    .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                    .build();

            accountCredentialRepository.save(account);
        }

        String accessToken = generateAccessToken(user, account);
        String refreshToken = generateRefreshToken(user, account);

        return AuthenticationResponse.builder()
                .authenticated(true)
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType(TokenType.BEARER.getTokenType())
                .build();
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
