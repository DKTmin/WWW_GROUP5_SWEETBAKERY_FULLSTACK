package iuh.fit.se.services.impl;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import iuh.fit.se.dtos.request.AuthenticationRequest;
import iuh.fit.se.dtos.request.IntrospectRequest;
import iuh.fit.se.dtos.request.RegistrationRequest;
import iuh.fit.se.dtos.response.AccountCredentialResponse;
import iuh.fit.se.dtos.response.AuthenticationResponse;
import iuh.fit.se.dtos.response.IntrospectResponse;
import iuh.fit.se.dtos.response.RegistrationResponse;
import iuh.fit.se.entities.AccountCredential;
import iuh.fit.se.entities.Role;
import iuh.fit.se.entities.User;
import iuh.fit.se.entities.enums.HttpCode;
import iuh.fit.se.entities.enums.UserRole;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.mapper.AccountMapper;
import iuh.fit.se.mapper.UserMapper;
import iuh.fit.se.repositories.AccountCredentialRepository;
import iuh.fit.se.repositories.RoleRepository;
import iuh.fit.se.repositories.UserRepository;
import iuh.fit.se.services.AuthenticationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.StringJoiner;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 19/11/2025, Wednesday
 **/
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {
    AccountMapper accountMapper;
    UserMapper userMapper;
    AccountCredentialRepository accountCredentialRepository;
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;

    @NonFinal
    @Value("${jwt.secret-key}")
    String SECRET_KEY;
    @Override
    public RegistrationResponse register(RegistrationRequest request) {
        if(userRepository.findUserByEmail(request.getEmail()) != null)
            throw new AppException(HttpCode.EMAIL_EXISTED);
        if(accountCredentialRepository.findByCredential(request.getUsername()) != null)
            throw new AppException(HttpCode.USERNAME_EXISTED);

        User user = userMapper.toUser(request);
        Set<Role> roles = new HashSet<>();
        Role customerRole = roleRepository.findById(UserRole.CUSTOMER.name())
                .orElseThrow(()-> new NullPointerException("Customer role not found!"));
        roles.add(customerRole);
        user.setRoles(roles);
        userRepository.save(user);

        AccountCredential accountCredentialUsedUsername= accountMapper.toAccountUsedUsername(request);
        accountCredentialUsedUsername.setUser(user);
        accountCredentialUsedUsername.setPassword(passwordEncoder.encode(request.getPassword()));
        accountCredentialRepository.save(accountCredentialUsedUsername);

        AccountCredential accountCredentialUsedEmail = accountMapper.toAccountUsedEmail(request);
        accountCredentialUsedEmail.setUser(user);
        accountCredentialUsedEmail.setPassword(passwordEncoder.encode(request.getPassword()));
        accountCredentialRepository.save(accountCredentialUsedEmail);

        Set<AccountCredentialResponse> accountCredentialResponses = new HashSet<>();
        accountCredentialResponses.add(accountMapper.toAccountCredentialResponse(accountCredentialUsedUsername));
        accountCredentialResponses.add(accountMapper.toAccountCredentialResponse(accountCredentialUsedEmail));

        return RegistrationResponse.builder()
                .user(user)
                .accountCredentials(accountCredentialResponses)
                .build();
    }

    @Override
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        AccountCredential accountCredential = accountCredentialRepository.findByCredential(request.getIdentifier());
        if(accountCredential == null)
             throw new NullPointerException("Account not found!");
        if(!passwordEncoder.matches(request.getPassword(), accountCredential.getPassword()))
            throw new AppException(HttpCode.UNAUTHENTICATED);
        User user = userRepository.findById(accountCredential.getUser().getId())
                .orElseThrow(()-> new NullPointerException("User not found!"));

        String token = generateToken(user, accountCredential);

        return AuthenticationResponse.builder()
                .authenticated(true)
                .token(token)
                .build();
    }

    @Override
    public IntrospectResponse introspect(IntrospectRequest request) {
        var token = request.getToken();
        JWSVerifier verifier = null;
        try {
            verifier = new MACVerifier(SECRET_KEY.getBytes());
            SignedJWT signedJWT = SignedJWT.parse(token);

            Date expirationTokenTime = signedJWT.getJWTClaimsSet().getExpirationTime();
            var verified = signedJWT.verify(verifier);

            return IntrospectResponse.builder()
                    .valid(verified && expirationTokenTime.after(new Date()))
                    .build();
        } catch (JOSEException | ParseException e) {
            throw new RuntimeException(e);
        }
    }

    private String generateToken(User user, AccountCredential accountCredential){
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(accountCredential.getCredential())
                .issuer("user664dntp.dev")
                .issueTime(new Date())
                .expirationTime(Date.from(Instant.now().plus(500, ChronoUnit.SECONDS)))
                .claim("scope", buildScope(user))
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SECRET_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
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
