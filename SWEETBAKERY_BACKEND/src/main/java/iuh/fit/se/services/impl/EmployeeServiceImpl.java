package iuh.fit.se.services.impl;

import iuh.fit.se.dtos.request.EmployeeRegistrationRequest;
import iuh.fit.se.dtos.response.AccountCredentialResponse;
import iuh.fit.se.dtos.response.CustomerRegistrationResponse;
import iuh.fit.se.dtos.response.EmployeeRegistrationResponse;
import iuh.fit.se.entities.AccountCredential;
import iuh.fit.se.entities.Employee;
import iuh.fit.se.entities.Role;
import iuh.fit.se.entities.User;
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
import java.util.Set;

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
    public EmployeeRegistrationResponse create(EmployeeRegistrationRequest request) {
        if(userRepository.findUserByEmail(request.getEmail()) != null)
            throw new AppException(HttpCode.EMAIL_EXISTED);
        if(accountCredentialRepository.findByCredential(request.getUsername()) != null)
            throw new AppException(HttpCode.USERNAME_EXISTED);

        Employee employee = employeeMapper.toEmployee(request);
        Set<Role> roles = new HashSet<>();
        Role employeeRole = roleRepository.findById(UserRole.EMPLOYEE.name())
                .orElseThrow(()-> new NullPointerException("Employee role not found!"));
        roles.add(employeeRole);
        employee.setRoles(roles);
        employeeRepository.save(employee);

        AccountCredential accountCredentialUsedUsername= accountMapper.toAccountUsedUsername(request);
        accountCredentialUsedUsername.setUser(employee);
        accountCredentialUsedUsername.setPassword(passwordEncoder.encode(request.getPassword()));
        accountCredentialRepository.save(accountCredentialUsedUsername);

        AccountCredential accountCredentialUsedEmail = accountMapper.toAccountUsedEmail(request);
        accountCredentialUsedEmail.setUser(employee);
        accountCredentialUsedEmail.setPassword(passwordEncoder.encode(request.getPassword()));
        accountCredentialRepository.save(accountCredentialUsedEmail);

        Set<AccountCredential> accountCredentialSet = new HashSet<>();
        accountCredentialSet.add(accountCredentialUsedUsername);
        accountCredentialSet.add(accountCredentialUsedEmail);
        employee.setAccounts(accountCredentialSet);
        employeeRepository.save(employee);

        Set<AccountCredentialResponse> accountCredentialResponses = new HashSet<>();
        accountCredentialResponses.add(accountMapper.toAccountCredentialResponse(accountCredentialUsedUsername));
        accountCredentialResponses.add(accountMapper.toAccountCredentialResponse(accountCredentialUsedEmail));

        return EmployeeRegistrationResponse.builder()
                .employee(employee)
                .accountCredentials(accountCredentialResponses)
                .build();
    }
}
