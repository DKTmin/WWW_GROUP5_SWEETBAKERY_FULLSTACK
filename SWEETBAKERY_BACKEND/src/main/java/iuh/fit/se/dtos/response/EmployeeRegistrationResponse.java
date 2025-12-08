package iuh.fit.se.dtos.response;

import iuh.fit.se.entities.Employee;
import iuh.fit.se.entities.Role;
import iuh.fit.se.entities.User;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 19/11/2025, Wednesday
 **/

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeRegistrationResponse {
    String id;
    String firstName;
    String lastName;
    String username;
    String email;
    String phoneNumber;
    String address;
    String identification;
    Integer numOfExperience;
    Set<AccountCredentialResponse> accounts;
    Set<Role> roles;
    Boolean isVerified;
}
