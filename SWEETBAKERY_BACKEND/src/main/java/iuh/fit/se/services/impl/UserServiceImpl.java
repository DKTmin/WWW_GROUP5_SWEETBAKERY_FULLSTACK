package iuh.fit.se.services.impl;

import iuh.fit.se.dtos.response.UserResponse;
import iuh.fit.se.entities.AccountCredential;
import iuh.fit.se.entities.Role;
import iuh.fit.se.entities.User;
import iuh.fit.se.entities.enums.AccountType;
import iuh.fit.se.entities.enums.HttpCode;
import iuh.fit.se.entities.enums.UserRole;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.mapper.AccountMapper;
import iuh.fit.se.mapper.UserMapper;
import iuh.fit.se.repositories.AccountCredentialRepository;
import iuh.fit.se.repositories.RoleRepository;
import iuh.fit.se.repositories.UserRepository;
import iuh.fit.se.services.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 19/11/2025, Wednesday
 **/

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {
    UserRepository userRepository;
    AccountCredentialRepository accountCredentialRepository;
    UserMapper userMapper;
    AccountMapper accountMapper;
    RoleRepository roleRepository;

    @Override
    public List<UserResponse> findAll() {
        return userRepository.findAll().stream()
//                .filter(user -> {
//                    Role adminRole = roleRepository.findById(UserRole.ADMIN.name()).orElse(null);
//                    if(adminRole != null)
//                        return !user.getRoles().contains(adminRole);
//                    return false;
//                })
                .map(userMapper::toUserResponse)
                .map(userResponse -> {
                    Set<AccountCredential> accountCredential = accountCredentialRepository.findAllByUserId(userResponse.getId());
                    userResponse.setAccounts(
                            accountCredential.stream()
                                    .map(accountMapper::toAccountCredentialResponse).collect(Collectors.toSet())
                    );
                    userResponse.setIsVerified(accountCredential.stream().toList().getFirst().getIsVerified());
                    accountCredential.stream()
                            .filter(acc -> acc.getType().name().equalsIgnoreCase(AccountType.USERNAME.name()))
                            .findFirst().ifPresent(usernameAccount -> userResponse.setUsername(usernameAccount.getCredential()));
                    return userResponse;
                })
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse getUserInformation() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        AccountCredential accountCredential = accountCredentialRepository.findByCredential(username);
        if (accountCredential == null)
            throw new AppException(HttpCode.NOT_FOUND);
        String userId = accountCredential.getUser().getId();
        User user = userRepository.findById(userId).orElse(null);
        UserResponse userResponse = userMapper.toUserResponse(user);
        userResponse.setUsername(username);
        return userResponse;
    }

    @Override
    public UserResponse updateInfor(iuh.fit.se.dtos.request.UpdateUserRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        AccountCredential accountCredential = accountCredentialRepository.findByCredential(username);
        if (accountCredential == null)
            throw new AppException(HttpCode.NOT_FOUND);
        String userId = accountCredential.getUser().getId();
        User user = userRepository.findById(userId).orElse(null);
        if (user == null)
            throw new AppException(HttpCode.NOT_FOUND);
        user.setAddress(request.getAddress());
        user = userRepository.save(user);
        UserResponse userResponse = userMapper.toUserResponse(user);
        userResponse.setUsername(username);
        return userResponse;
    }

    @Override
    public boolean delete(String id) {
        try {
            userRepository.deleteById(id);
            return true;
        } catch (Exception exception) {
            throw new RuntimeException(exception.getMessage());
        }
    }
}
