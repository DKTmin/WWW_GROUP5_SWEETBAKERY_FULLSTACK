package iuh.fit.se.dtos;

import iuh.fit.se.entities.enums.Role;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaiKhoanDTO {

    private String id;

    @NotEmpty(message = "Tên đăng nhập không được để trống")
    private String user;

    @NotEmpty(message = "Mật khẩu không được để trống")
    private String password;

    @NotNull(message = "Vai trò không được để trống")
    private Role role;
}
