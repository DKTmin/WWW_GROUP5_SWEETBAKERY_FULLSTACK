package iuh.fit.se.dtos.response;

import iuh.fit.se.entities.enums.PastryStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

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

    Integer stockQuantity;
    PastryStatus status;

    String categoryId;
    String categoryName;
}
