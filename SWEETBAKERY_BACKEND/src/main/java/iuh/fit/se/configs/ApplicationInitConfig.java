package iuh.fit.se.configs;

import iuh.fit.se.entities.AccountCredential;
import iuh.fit.se.entities.Role;
import iuh.fit.se.entities.User;
import iuh.fit.se.entities.enums.AccountType;
import iuh.fit.se.entities.enums.UserRole;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.repositories.AccountCredentialRepository;
import iuh.fit.se.repositories.RoleRepository;
import iuh.fit.se.repositories.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 21/11/2025, Friday
 **/

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {
    PasswordEncoder passwordEncoder;

    @NonFinal
    @Value("${admin.username}")
    String adminUserName;

    @NonFinal
    @Value("${admin.password}")
    String adminPassword;

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository,
                                        AccountCredentialRepository accountCredentialRepository,
                                        RoleRepository roleRepository){
        return args -> {
            if(accountCredentialRepository.findByCredential(adminUserName) == null){
                Role adminRole = roleRepository.findById(UserRole.ADMIN.name()).orElse(null);
                if(adminRole == null)
                    throw new NullPointerException("Admin role not found!");
                Set<Role> roles = new HashSet<>();
                roles.add(adminRole);

                User user = User.builder()
                        .roles(roles)
                        .build();
                userRepository.save(user);
                AccountCredential accountCredential = AccountCredential.builder()
                        .credential(adminUserName)
                        .password(passwordEncoder.encode(adminPassword))
                        .type(AccountType.USERNAME)
                        .user(user)
                        .build();
                accountCredentialRepository.save(accountCredential);

                log.warn("admin has been created with username: " + adminUserName + ", password: " + adminPassword);
            }
        };
    }
}
