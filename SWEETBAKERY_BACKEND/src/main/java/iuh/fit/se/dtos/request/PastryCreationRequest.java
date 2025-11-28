package iuh.fit.se.dtos.request;

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
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)

public class PastryCreationRequest {
    String name;
    Double price;
    String description;

    //
    String imageUrl;
    String categoryId;
}
