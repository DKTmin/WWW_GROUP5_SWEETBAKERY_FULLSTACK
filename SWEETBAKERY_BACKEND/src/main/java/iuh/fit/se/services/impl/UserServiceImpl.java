package iuh.fit.se.services.impl;

import iuh.fit.se.dtos.response.UserResponse;
import iuh.fit.se.entities.AccountCredential;
import iuh.fit.se.entities.User;
import iuh.fit.se.entities.enums.HttpCode;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.mapper.UserMapper;
import iuh.fit.se.repositories.AccountCredentialRepository;
import iuh.fit.se.repositories.UserRepository;
import iuh.fit.se.services.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 19/11/2025, Wednesday
 **/

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    UserRepository userRepository;
    AccountCredentialRepository accountCredentialRepository;
    UserMapper userMapper;

    @Override
    public List<UserResponse> findAll() {
        return userRepository.findAll().stream()
                .map(userMapper::toUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse getInfor() {
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
        return false;
    }

}
