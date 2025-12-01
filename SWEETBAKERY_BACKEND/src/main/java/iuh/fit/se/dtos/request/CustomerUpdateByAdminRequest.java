package iuh.fit.se.dtos.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

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
public class CustomerUpdateByAdminRequest {
    String firstName;
    String lastName;
    String oldPassword;
    String newPassword;
    String confirmNewPassword;
    String phoneNumber;
    String address;
    Integer loyaltyPoints;
}
