package iuh.fit.se.dtos.request;

import iuh.fit.se.validator.constraint.PasswordConstraint;
import lombok.*;
import lombok.experimental.FieldDefaults;

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

public class EmployeeRegistrationRequest {
    String firstName;
    String lastName;
    String username;
    @PasswordConstraint(min = 5)
    String password;
    String confirmPassword;
    String email;
    String phoneNumber;
    String address;
    String identification;
    Integer numOfExperience;
}
