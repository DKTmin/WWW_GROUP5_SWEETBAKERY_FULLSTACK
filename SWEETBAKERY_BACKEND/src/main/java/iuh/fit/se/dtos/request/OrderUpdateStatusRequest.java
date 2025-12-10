package iuh.fit.se.dtos.request;

import iuh.fit.se.entities.enums.TrangThaiDH;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class OrderUpdateStatusRequest {
    @NotNull(message = "Trạng thái đơn hàng không được để trống")
    TrangThaiDH trangThai;

    // Chứng từ hoàn tiền (Cloudinary URL) khi chuyển REFUND_PENDING -> CANCELLED
    String refundProofImageUrl;
}

