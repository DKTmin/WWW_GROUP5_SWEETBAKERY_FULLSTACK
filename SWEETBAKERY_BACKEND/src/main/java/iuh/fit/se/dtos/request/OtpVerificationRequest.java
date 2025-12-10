package iuh.fit.se.dtos.request;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 29/11/2025, Saturday
 **/

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class OtpVerificationRequest {
    String otp;
}
