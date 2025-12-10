package iuh.fit.se.dtos.request;

import iuh.fit.se.entities.Role;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.util.Set;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 1/12/2025, Monday
 **/

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeUpdateRequest {
    String firstName;
    String lastName;
    String oldPassword;
    String newPassword;
    String confirmNewPassword;
    String email;
    String phoneNumber;
    String address;
    String identification;
    Integer numOfExperience;
    List<String> roles;
    Boolean isVerified;
}
