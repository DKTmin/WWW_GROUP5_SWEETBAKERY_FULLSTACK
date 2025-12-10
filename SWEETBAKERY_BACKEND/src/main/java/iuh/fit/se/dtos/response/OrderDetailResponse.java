package iuh.fit.se.dtos.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class OrderDetailResponse {
    String id;
    String pastryId;
    String name;
    Integer qty;
    Double price;
    String image;
}
