package iuh.fit.se.dtos.response;

import iuh.fit.se.entities.enums.PastryStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PastryCreationResponse {
    String id;
    String name;
    Double price;
    String description;
    String imageUrl;

    Integer stockQuantity;      // tồn kho hiện tại
    PastryStatus status;        // DRAFT / ACTIVE / OUT_OF_STOCK / DISCONTINUED

    String categoryId;
    String categoryName;
}
