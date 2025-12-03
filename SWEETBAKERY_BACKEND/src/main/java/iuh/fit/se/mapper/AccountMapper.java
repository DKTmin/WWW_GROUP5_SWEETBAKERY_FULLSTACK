package iuh.fit.se.mapper;

import iuh.fit.se.dtos.request.CustomerRegistrationRequest;
import iuh.fit.se.dtos.request.EmployeeRegistrationRequest;
import iuh.fit.se.dtos.response.AccountCredentialResponse;
import iuh.fit.se.entities.AccountCredential;
import org.mapstruct.*;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 19/11/2025, Wednesday
 **/
@Mapper(componentModel = "spring")
public interface AccountMapper {
    // dùng username
    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "lastLogin", ignore = true),
            @Mapping(target = "user", ignore = true),
            @Mapping(target = "type", ignore = true),
            @Mapping(target = "credential", ignore = true),
            @Mapping(target = "password", ignore = true)
    })
    AccountCredential toAccountUsedUsername(CustomerRegistrationRequest request);

    // dùng email
    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "lastLogin", ignore = true),
            @Mapping(target = "user", ignore = true),
            @Mapping(target = "type", ignore = true),
            @Mapping(target = "credential", ignore = true),
            @Mapping(target = "password", ignore = true)
    })
    AccountCredential toAccountUsedEmail(CustomerRegistrationRequest request);

    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "lastLogin", ignore = true),
            @Mapping(target = "user", ignore = true),
            @Mapping(target = "type", ignore = true),
            @Mapping(target = "credential", ignore = true),
            @Mapping(target = "password", ignore = true)
    })
    AccountCredential toAccountUsedUsername(EmployeeRegistrationRequest request);

    // dùng email
    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "lastLogin", ignore = true),
            @Mapping(target = "user", ignore = true),
            @Mapping(target = "type", ignore = true),
            @Mapping(target = "credential", ignore = true),
            @Mapping(target = "password", ignore = true)
    })
    AccountCredential toAccountUsedEmail(EmployeeRegistrationRequest request);
    AccountCredentialResponse toAccountCredentialResponse(AccountCredential accountCredential);
    @AfterMapping
    default void setAccountCredentialResponseDefaults(@MappingTarget AccountCredentialResponse accountCredentialResponse,
                                                      AccountCredential accountCredential){
        accountCredentialResponse.setUserId(accountCredential.getUser().getId());
    }
}
