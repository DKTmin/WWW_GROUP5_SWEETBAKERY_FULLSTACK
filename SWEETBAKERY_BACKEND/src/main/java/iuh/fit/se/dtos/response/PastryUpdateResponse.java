package iuh.fit.se.dtos.response;

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

    String categoryId;
    String categoryName;
}
