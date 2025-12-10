package iuh.fit.se.dtos.response;

import iuh.fit.se.entities.enums.AccountType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 20/11/2025, Thursday
 **/

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AccountCredentialResponse {
    String id;
    AccountType type;
    String credential;
    Boolean isVerified;
    LocalDateTime createdAt;
    LocalDateTime lastLogin;
    String userId;
}
