package iuh.fit.se.dtos.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class CartSyncRequest {
    List<CartItemSyncRequest> items;
    Boolean replace;
}
