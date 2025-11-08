package iuh.fit.se.dtos;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BanhNgotDTO {
    private String id;

    @NotEmpty(message = "Tên bánh không được để trống")
    private String tenBanh;

    @Positive(message = "Giá phải lớn hơn 0")
    private double gia;

    private String mota;

    private String hinhAnh;

    private String loaiBanhId;
}
