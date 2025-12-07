package iuh.fit.se.dtos.request;

import iuh.fit.se.entities.enums.PastryStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PastryUpdateRequest {

    String name;
    Double price;
    String description;
    String imageUrl;

    String categoryId;

    PastryStatus status;

    Integer stockQuantity;
}
