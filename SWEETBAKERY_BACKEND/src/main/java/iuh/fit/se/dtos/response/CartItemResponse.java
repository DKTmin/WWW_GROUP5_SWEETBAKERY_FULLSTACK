package iuh.fit.se.dtos.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class CartItemResponse {
    String pastryId;
    String name;
    Double price;
    Integer qty;
    String imageUrl;
    String size;
}
