package iuh.fit.se.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NhanVienDTO {
    private String id;

    @NotEmpty(message = "Tên không được để trống")
    private String ten;

    @Email(message = "Email không hợp lệ")
    private String gmail;

    @Pattern(regexp = "0[0-9]{9,10}", message = "Số điện thoại không hợp lệ")
    private String sdt;

    private String diaChi;

    private String taiKhoanId;
}
