package iuh.fit.se.dtos.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class OrderRequest {
    List<OrderItemRequest> items;
    // future: shipping address, note, etc.
    String paymentMethod;
}
