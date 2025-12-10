package iuh.fit.se.services.admin.impl;

import iuh.fit.se.dtos.request.CustomerRegistrationRequest;
import iuh.fit.se.dtos.request.CustomerUpdateByAdminRequest;
import iuh.fit.se.dtos.response.AccountCredentialResponse;
import iuh.fit.se.dtos.response.CustomerRegistrationResponse;
import iuh.fit.se.dtos.response.CustomerUpdateByAdminResponse;
import iuh.fit.se.entities.AccountCredential;
import iuh.fit.se.entities.Customer;
import iuh.fit.se.entities.Role;
import iuh.fit.se.entities.enums.AccountType;
import iuh.fit.se.entities.enums.HttpCode;
import iuh.fit.se.entities.enums.UserRole;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.mapper.AccountMapper;
import iuh.fit.se.mapper.CustomerMapper;
import iuh.fit.se.repositories.AccountCredentialRepository;
import iuh.fit.se.repositories.CustomerRepository;
import iuh.fit.se.repositories.RoleRepository;
import iuh.fit.se.repositories.UserRepository;
import iuh.fit.se.services.admin.CustomerAdminService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 1/12/2025, Monday
 **/

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class CustomerAdminServiceImpl implements CustomerAdminService {
    AccountMapper accountMapper;
    CustomerMapper customerMapper;
    AccountCredentialRepository accountCredentialRepository;
    CustomerRepository customerRepository;
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;
    @Override
    public CustomerRegistrationResponse create(CustomerRegistrationRequest request) {
        if (userRepository.findUserByEmail(request.getEmail()) != null)
            throw new AppException(HttpCode.EMAIL_EXISTED);
        if (accountCredentialRepository.findByCredential(request.getUsername()) != null)
            throw new AppException(HttpCode.USERNAME_EXISTED);

        Customer customer = customerMapper.toCustomer(request);

        Set<Role> roles = new HashSet<>();
        Role customerRole = roleRepository.findById(UserRole.CUSTOMER.name())
                .orElseThrow(() -> new NullPointerException("Customer role not found!"));
        roles.add(customerRole);
        customer.setRoles(roles);

        customer.setLoyaltyPoints(request.getLoyaltyPoints() == null ? 0 : request.getLoyaltyPoints());
        customerRepository.save(customer);

        AccountCredential accountCredentialUsedUsername = accountMapper.toAccountUsedUsername(request);
        accountCredentialUsedUsername.setUser(customer);
        accountCredentialUsedUsername.setPassword(passwordEncoder.encode(request.getPassword()));
        accountCredentialUsedUsername.setType(AccountType.USERNAME);
        accountCredentialUsedUsername.setCredential(request.getUsername());
        accountCredentialUsedUsername.setIsVerified(request.getIsVerified());
        accountCredentialRepository.save(accountCredentialUsedUsername);

        AccountCredential accountCredentialUsedEmail = accountMapper.toAccountUsedEmail(request);
        accountCredentialUsedEmail.setUser(customer);
        accountCredentialUsedEmail.setPassword(passwordEncoder.encode(request.getPassword()));
        accountCredentialUsedEmail.setType(AccountType.EMAIL);
        accountCredentialUsedEmail.setCredential(request.getEmail());
        accountCredentialUsedEmail.setIsVerified(request.getIsVerified());
        accountCredentialRepository.save(accountCredentialUsedEmail);

        Set<AccountCredential> accountCredentialSet = new HashSet<>();
        accountCredentialSet.add(accountCredentialUsedUsername);
        accountCredentialSet.add(accountCredentialUsedEmail);
        customer.setAccounts(accountCredentialSet);
        customerRepository.save(customer);

        Set<AccountCredentialResponse> accountCredentialResponses = new HashSet<>();
        accountCredentialResponses.add(accountMapper.toAccountCredentialResponse(accountCredentialUsedUsername));
        accountCredentialResponses.add(accountMapper.toAccountCredentialResponse(accountCredentialUsedEmail));

        CustomerRegistrationResponse customerRegistrationResponse = customerMapper
                .toCustomerRegistrationResponse(customer);
        customerRegistrationResponse.setAccounts(accountCredentialResponses);
        customerRegistrationResponse.setUsername(request.getUsername());
        customerRegistrationResponse.setIsVerified(request.getIsVerified());
        return customerRegistrationResponse;
    }

    @Override
    public CustomerUpdateByAdminResponse update(String customerId, CustomerUpdateByAdminRequest request) {
        Customer customer = customerRepository.findById(customerId).orElse(null);
        if(customer == null) throw new AppException(HttpCode.CUSTOMER_NOT_FOUND);
        customerMapper.updateCustomerByAdmin(customer, request);

        Set<AccountCredential> accounts = accountCredentialRepository.findAllByUserId(customerId);
        if(accounts.isEmpty()) throw new AppException(HttpCode.ACCOUNT_NOT_FOUND);
        accounts.forEach(acc -> acc.setIsVerified(request.getIsVerified()));

        AccountCredential emailAccount = accountCredentialRepository
                .findByUserIdAndAccountType(customerId, AccountType.EMAIL);
        if(emailAccount == null)throw new AppException(HttpCode.ACCOUNT_NOT_FOUND);
        emailAccount.setCredential(request.getEmail());

        boolean passwordIsChanging = request.getOldPassword() != null
                && request.getNewPassword() != null
                && request.getConfirmNewPassword() != null;
        if(passwordIsChanging){
            if(!passwordEncoder.matches(request.getOldPassword(), emailAccount.getPassword()))
                throw new AppException(HttpCode.PASSWORD_INCORRECT);
            if(!request.getNewPassword().equalsIgnoreCase(request.getConfirmNewPassword()))
                throw new AppException(HttpCode.PASSWORD_NOMATCH);
            accounts.forEach(acc -> acc.setPassword(passwordEncoder.encode(request.getNewPassword())));
        }

        customerRepository.save(customer);
        accountCredentialRepository.saveAll(accounts);

        CustomerUpdateByAdminResponse response =  customerMapper.toCustomerUpdateByAdminResponse(customer);
        response.setLoyaltyPoints(request.getLoyaltyPoints());
        response.setNewPassword(request.getNewPassword());
        response.setIsVerified(request.getIsVerified());
        return response;
    }
}
