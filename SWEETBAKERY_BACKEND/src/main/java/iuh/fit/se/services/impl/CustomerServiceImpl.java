package iuh.fit.se.services.impl;

import iuh.fit.se.dtos.request.CustomerRegistrationRequest;
import iuh.fit.se.dtos.request.CustomerSeftUpdateRequest;
import iuh.fit.se.dtos.response.AccountCredentialResponse;
import iuh.fit.se.dtos.response.CustomerRegistrationResponse;
import iuh.fit.se.dtos.response.CustomerSeftUpdateResponse;
import iuh.fit.se.entities.AccountCredential;
import iuh.fit.se.entities.Customer;
import iuh.fit.se.entities.Role;
import iuh.fit.se.entities.User;
import iuh.fit.se.entities.enums.AccountType;
import iuh.fit.se.entities.enums.HttpCode;
import iuh.fit.se.entities.enums.UserRole;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.mapper.AccountMapper;
import iuh.fit.se.mapper.CustomerMapper;
import iuh.fit.se.mapper.UserMapper;
import iuh.fit.se.repositories.AccountCredentialRepository;
import iuh.fit.se.repositories.CustomerRepository;
import iuh.fit.se.repositories.RoleRepository;
import iuh.fit.se.repositories.UserRepository;
import iuh.fit.se.services.CustomerService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
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
public class CustomerServiceImpl implements CustomerService {
    AccountMapper accountMapper;
    CustomerMapper customerMapper;
    AccountCredentialRepository accountCredentialRepository;
    CustomerRepository customerRepository;
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;

    @Override
    public CustomerRegistrationResponse create(CustomerRegistrationRequest request) {
        if(userRepository.findUserByEmail(request.getEmail()) != null)
            throw new AppException(HttpCode.EMAIL_EXISTED);
        if(accountCredentialRepository.findByCredential(request.getUsername()) != null)
            throw new AppException(HttpCode.USERNAME_EXISTED);

        Customer customer = customerMapper.toCustomer(request);

        Set<Role> roles = new HashSet<>();
        Role customerRole = roleRepository.findById(UserRole.CUSTOMER.name())
                .orElseThrow(()-> new NullPointerException("Customer role not found!"));
        roles.add(customerRole);
        customer.setRoles(roles);
        customer.setLoyaltyPoints(0);
        customerRepository.save(customer);

        AccountCredential accountCredentialUsedUsername= accountMapper.toAccountUsedUsername(request);
        accountCredentialUsedUsername.setUser(customer);
        accountCredentialUsedUsername.setPassword(passwordEncoder.encode(request.getPassword()));
        accountCredentialUsedUsername.setType(AccountType.USERNAME);
        accountCredentialRepository.save(accountCredentialUsedUsername);

        AccountCredential accountCredentialUsedEmail = accountMapper.toAccountUsedEmail(request);
        accountCredentialUsedEmail.setUser(customer);
        accountCredentialUsedEmail.setPassword(passwordEncoder.encode(request.getPassword()));
        accountCredentialUsedEmail.setType(AccountType.EMAIL);
        accountCredentialRepository.save(accountCredentialUsedEmail);

        Set<AccountCredential> accountCredentialSet = new HashSet<>();
        accountCredentialSet.add(accountCredentialUsedUsername);
        accountCredentialSet.add(accountCredentialUsedEmail);
        customer.setAccounts(accountCredentialSet);
        customerRepository.save(customer);

        Set<AccountCredentialResponse> accountCredentialResponses = new HashSet<>();
        accountCredentialResponses.add(accountMapper.toAccountCredentialResponse(accountCredentialUsedUsername));
        accountCredentialResponses.add(accountMapper.toAccountCredentialResponse(accountCredentialUsedEmail));

        return CustomerRegistrationResponse.builder()
                .customer(customer)
                .accountCredentials(accountCredentialResponses)
                .build();
    }

    @Override
    public CustomerSeftUpdateResponse update(String userId, CustomerSeftUpdateRequest request) {
        Customer customer = customerRepository.findById(userId).orElse(null);
        Set<AccountCredential> accountCredentialSet = accountCredentialRepository.findAllByUserId(userId);

        if(accountCredentialSet.isEmpty())
            throw new AppException(HttpCode.NOT_FOUND);

        AccountCredential emailAccount = accountCredentialRepository.findByUserIdAndAccountType(userId, AccountType.EMAIL);

        if(customer == null)
            throw new AppException(HttpCode.NOT_FOUND);
        if(!passwordEncoder.matches(request.getOldPassword(), emailAccount.getPassword()))
            throw new AppException(HttpCode.PASSWORD_INCORRECT);
        if(!request.getNewPassword().equalsIgnoreCase(request.getConfirmNewPassword()))
            throw new AppException(HttpCode.PASSWORD_NOMATCH);

        customerMapper.updateCustomer(customer, request);
        accountCredentialSet.forEach(acc -> acc.setPassword(passwordEncoder.encode(request.getNewPassword())));
        emailAccount.setCredential(request.getEmail());

        userRepository.save(customer);
        accountCredentialRepository.saveAll(accountCredentialSet);

        CustomerSeftUpdateResponse customerSeftUpdateResponse =  customerMapper.toCustomerSeftUpdateResponse(customer);
        customerSeftUpdateResponse.setEmail(request.getEmail());
        return customerSeftUpdateResponse;
    }
}
