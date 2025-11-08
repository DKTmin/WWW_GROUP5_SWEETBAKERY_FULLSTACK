package iuh.fit.se.dtos;

import jakarta.validation.constraints.Min;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChiTietDonHangDTO {
    private String id;

    @Min(value = 1, message = "Số lượng tối thiểu là 1")
    private int soLuong;

    private String donHangId;

    private String banhNgotId;

}
