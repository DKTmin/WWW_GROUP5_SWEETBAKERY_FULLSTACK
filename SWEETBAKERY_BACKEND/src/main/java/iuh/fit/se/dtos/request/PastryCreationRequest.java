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
public class PastryCreationRequest {

    String name;
    Double price;
    String description;
    String imageUrl;

    String categoryId;

    // Mặc định admin có thể set hoặc để null → mặc định DRAFT
    PastryStatus status = PastryStatus.DRAFT;

    // Số lượng tồn kho ban đầu
    Integer stockQuantity = 0;
}
