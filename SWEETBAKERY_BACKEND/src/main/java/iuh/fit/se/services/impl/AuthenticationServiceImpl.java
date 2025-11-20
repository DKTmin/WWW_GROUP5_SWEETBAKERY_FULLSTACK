package iuh.fit.se.services.impl;

import iuh.fit.se.dtos.request.AuthenticationRequest;
import iuh.fit.se.dtos.request.RegistrationRequest;
import iuh.fit.se.dtos.response.AccountCredentialResponse;
import iuh.fit.se.dtos.response.AuthenticationResponse;
import iuh.fit.se.dtos.response.RegistrationResponse;
import iuh.fit.se.entities.AccountCredential;
import iuh.fit.se.entities.User;
import iuh.fit.se.entities.enums.HttpCode;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.mapper.AccountMapper;
import iuh.fit.se.mapper.UserMapper;
import iuh.fit.se.repositories.AccountCredentialRepository;
import iuh.fit.se.repositories.UserRepository;
import iuh.fit.se.services.AuthenticationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

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
    @Override
    public RegistrationResponse register(RegistrationRequest request) {
        User user = userMapper.toUser(request);
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
    public boolean authenticate(AuthenticationRequest request) {
        AccountCredential accountCredential = accountCredentialRepository.findByCredential(request.getIdentifier());
        if(accountCredential == null)
             throw new NullPointerException("Account not found!");
        return passwordEncoder.matches(request.getPassword(), accountCredential.getPassword());
    }
}
