package iuh.fit.se.dtos.response;

import iuh.fit.se.entities.Customer;
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
public class CustomerRegistrationResponse {
    Customer customer;
    Set<AccountCredentialResponse> accountCredentials;
}
