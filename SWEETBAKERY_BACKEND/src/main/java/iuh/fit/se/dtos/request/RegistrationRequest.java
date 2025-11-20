package iuh.fit.se.dtos.request;

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

public class RegistrationRequest {
    String firstName;
    String lastName;
    String username;
    String password;
    String confirmPassword;
    String email;
    String phoneNumber;
    String address;
}
