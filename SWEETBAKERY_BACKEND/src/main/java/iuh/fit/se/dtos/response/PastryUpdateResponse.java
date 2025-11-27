package iuh.fit.se.dtos.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 14/11/2025, Friday
 **/

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)

public class PastryUpdateResponse {
    String id;
    String name;
    Double price;
    String description;
    String imageUrl;
}
