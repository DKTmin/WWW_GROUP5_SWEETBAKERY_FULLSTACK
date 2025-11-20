package iuh.fit.se.mapper;

import iuh.fit.se.dtos.request.RegistrationRequest;
import iuh.fit.se.dtos.response.AccountCredentialResponse;
import iuh.fit.se.entities.AccountCredential;
import iuh.fit.se.entities.enums.AccountType;
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
            @Mapping(target = "type", constant = "USERNAME"),
            @Mapping(target = "credential", source = "username"),
            @Mapping(target = "password", source = "password")
    })
    AccountCredential toAccountUsedUsername(RegistrationRequest request);

    // dùng email
    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "lastLogin", ignore = true),
            @Mapping(target = "user", ignore = true),
            @Mapping(target = "type", constant = "EMAIL"),
            @Mapping(target = "credential", source = "email"),
            @Mapping(target = "password", source = "password")
    })
    AccountCredential toAccountUsedEmail(RegistrationRequest request);
    AccountCredentialResponse toAccountCredentialResponse(AccountCredential accountCredential);
    @AfterMapping
    default void setAccountCredentialResponseDefaults(@MappingTarget AccountCredentialResponse accountCredentialResponse,
                                                      AccountCredential accountCredential){
        accountCredentialResponse.setUserId(accountCredential.getUser().getId());
    }
}
