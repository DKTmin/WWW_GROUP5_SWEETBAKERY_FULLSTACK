package iuh.fit.se.dtos.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class CancelOrderRequest {
    @NotBlank(message = "Lý do hủy đơn hàng không được để trống")
    String lyDoHuy;
}

