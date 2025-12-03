package iuh.fit.se.services.impl;

import iuh.fit.se.dtos.request.EmployeeRegistrationRequest;
import iuh.fit.se.dtos.response.AccountCredentialResponse;
import iuh.fit.se.dtos.response.CustomerRegistrationResponse;
import iuh.fit.se.dtos.response.EmployeeRegistrationResponse;
import iuh.fit.se.entities.AccountCredential;
import iuh.fit.se.entities.Employee;
import iuh.fit.se.entities.Role;
import iuh.fit.se.entities.User;
import iuh.fit.se.entities.enums.AccountType;
import iuh.fit.se.entities.enums.HttpCode;
import iuh.fit.se.entities.enums.UserRole;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.mapper.AccountMapper;
import iuh.fit.se.mapper.EmployeeMapper;
import iuh.fit.se.mapper.UserMapper;
import iuh.fit.se.repositories.AccountCredentialRepository;
import iuh.fit.se.repositories.EmployeeRepository;
import iuh.fit.se.repositories.RoleRepository;
import iuh.fit.se.repositories.UserRepository;
import iuh.fit.se.services.EmployeeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 28/11/2025, Friday
 **/

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Transactional
public class EmployeeServiceImpl implements EmployeeService {
    AccountMapper accountMapper;
    EmployeeMapper employeeMapper;
    AccountCredentialRepository accountCredentialRepository;
    UserRepository userRepository;
    EmployeeRepository employeeRepository;
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;

    @Override
    public List<EmployeeRegistrationResponse> getALl() {
        return employeeRepository.findAll()
                .stream()
                .filter(user -> {
                    Role adminRole = roleRepository.findById(UserRole.ADMIN.name()).orElse(null);
                    if(adminRole != null)
                        return !user.getRoles().contains(adminRole);
                    return false;
                })
                .map(employeeMapper::toEmployeeRegistrationResponse)
                .map(empResponse -> {
                    empResponse.setUsername(getUserName(empResponse.getId()));
                    return empResponse;
                })
                .collect(Collectors.toList());
    }

    private String getUserName(String userId){
        Set<AccountCredential> accountCredentialSet = accountCredentialRepository.findAllByUserId(userId);
        AccountCredential userNameAccount = accountCredentialSet.stream()
                .filter(acc -> acc.getType().name().equalsIgnoreCase(AccountType.USERNAME.name()))
                .toList().getFirst();
        return userNameAccount.getCredential();
    }

}
