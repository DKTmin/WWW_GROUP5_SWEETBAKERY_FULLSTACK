package iuh.fit.se.dtos.response;

import iuh.fit.se.entities.AccountCredential;
import iuh.fit.se.entities.Role;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 21/11/2025, Friday
 **/
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String id;
    String firstName;
    String lastName;
    String username;
    String email;
    String phoneNumber;
    String address;
    Set<AccountCredentialResponse> accounts;
    Set<Role> roles;
    Boolean isVerified;
}
