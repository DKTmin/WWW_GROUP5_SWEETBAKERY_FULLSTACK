package iuh.fit.se.services.admin.impl;

import iuh.fit.se.dtos.request.EmployeeRegistrationRequest;
import iuh.fit.se.dtos.request.EmployeeUpdateRequest;
import iuh.fit.se.dtos.response.AccountCredentialResponse;
import iuh.fit.se.dtos.response.EmployeeRegistrationResponse;
import iuh.fit.se.dtos.response.EmployeeUpdateResponse;
import iuh.fit.se.entities.AccountCredential;
import iuh.fit.se.entities.Employee;
import iuh.fit.se.entities.Role;
import iuh.fit.se.entities.enums.AccountType;
import iuh.fit.se.entities.enums.HttpCode;
import iuh.fit.se.entities.enums.UserRole;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.mapper.AccountMapper;
import iuh.fit.se.mapper.EmployeeMapper;
import iuh.fit.se.repositories.AccountCredentialRepository;
import iuh.fit.se.repositories.EmployeeRepository;
import iuh.fit.se.repositories.RoleRepository;
import iuh.fit.se.repositories.UserRepository;
import iuh.fit.se.services.admin.EmployeeAdminService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 3/12/2025, Wednesday
 **/

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class EmployeeAdminServiceImpl implements EmployeeAdminService {
    AccountMapper accountMapper;
    EmployeeMapper employeeMapper;
    AccountCredentialRepository accountCredentialRepository;
    UserRepository userRepository;
    EmployeeRepository employeeRepository;
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;

    @Override
    public EmployeeRegistrationResponse create(EmployeeRegistrationRequest request) {
        if (userRepository.findUserByEmail(request.getEmail()) != null)
            throw new AppException(HttpCode.EMAIL_EXISTED);
        if (accountCredentialRepository.findByCredential(request.getUsername()) != null)
            throw new AppException(HttpCode.USERNAME_EXISTED);

        Employee employee = employeeMapper.toEmployee(request);
        Set<Role> roles = new HashSet<>(roleRepository.findAllById(request.getRoles()));

        if(roles.isEmpty())
            throw new AppException(HttpCode.NOT_FOUND);

        employee.setRoles(roles);
        employeeRepository.save(employee);

        AccountCredential accountCredentialUsedUsername = accountMapper.toAccountUsedUsername(request);
        accountCredentialUsedUsername.setUser(employee);
        accountCredentialUsedUsername.setPassword(passwordEncoder.encode(request.getPassword()));
        accountCredentialUsedUsername.setType(AccountType.USERNAME);
        accountCredentialUsedUsername.setCredential(request.getUsername());
        accountCredentialRepository.save(accountCredentialUsedUsername);

        AccountCredential accountCredentialUsedEmail = accountMapper.toAccountUsedEmail(request);
        accountCredentialUsedEmail.setUser(employee);
        accountCredentialUsedEmail.setPassword(passwordEncoder.encode(request.getPassword()));
        accountCredentialUsedEmail.setType(AccountType.EMAIL);
        accountCredentialUsedEmail.setCredential(request.getEmail());
        accountCredentialRepository.save(accountCredentialUsedEmail);

        Set<AccountCredential> accountCredentialSet = new HashSet<>();
        accountCredentialSet.add(accountCredentialUsedUsername);
        accountCredentialSet.add(accountCredentialUsedEmail);
        employee.setAccounts(accountCredentialSet);
        employeeRepository.save(employee);

        Set<AccountCredentialResponse> accountCredentialResponses = new HashSet<>();
        accountCredentialResponses.add(accountMapper.toAccountCredentialResponse(accountCredentialUsedUsername));
        accountCredentialResponses.add(accountMapper.toAccountCredentialResponse(accountCredentialUsedEmail));

        EmployeeRegistrationResponse employeeRegistrationResponse = employeeMapper.toEmployeeRegistrationResponse(employee);
        employeeRegistrationResponse.setUsername(request.getUsername());
        employeeRegistrationResponse.setAccounts(accountCredentialResponses);
        return employeeRegistrationResponse;
    }

    @Override
    public EmployeeUpdateResponse update(String employeeId, EmployeeUpdateRequest request) {
        Employee employee = (Employee) userRepository.findById(employeeId).orElse(null);
        if (employee == null)
            throw new AppException(HttpCode.NOT_FOUND);

        employeeMapper.update(employee, request);

        Set<AccountCredential> accountCredentialSet = accountCredentialRepository.findAllByUserId(employeeId);
        if(accountCredentialSet.isEmpty())
            throw new AppException(HttpCode.NOT_FOUND);

        AccountCredential emailAccount = accountCredentialRepository.findByUserIdAndAccountType(employeeId, AccountType.EMAIL);
        emailAccount.setCredential(request.getEmail());

        boolean passwordIsChanging = request.getOldPassword() != null
                && request.getNewPassword() != null
                && request.getConfirmNewPassword() != null;

        if (passwordIsChanging) {
            if(!passwordEncoder.matches(request.getOldPassword(), emailAccount.getPassword()))
                throw new AppException(HttpCode.PASSWORD_INCORRECT);
            if (!request.getNewPassword().equalsIgnoreCase(request.getConfirmNewPassword()))
                throw new AppException(HttpCode.PASSWORD_NOMATCH);
            accountCredentialSet.forEach(accountCredential ->
                    accountCredential.setPassword(passwordEncoder.encode(request.getNewPassword()))
            );
        }

        Set<Role> roles = new HashSet<>(roleRepository.findAllById(request.getRoles()));
        employee.setRoles(roles);

        employeeRepository.save(employee);
        accountCredentialRepository.saveAll(accountCredentialSet);

        EmployeeUpdateResponse employeeUpdateResponse = employeeMapper.toEmployeeUpdateResponse(employee);
        if(passwordIsChanging)
            employeeUpdateResponse.setNewPassword(request.getNewPassword());
        return employeeUpdateResponse;
    }
}
