package iuh.fit.se.dtos.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

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
public class IntrospectResponse {
    boolean valid;
}
