package iuh.fit.se.dtos;

import iuh.fit.se.entities.enums.Role;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Builder
public class TaiKhoanDTO {

    private String id;

    @NotEmpty(message = "Tên đăng nhập không được để trống")
    private String user;

    @NotEmpty(message = "Mật khẩu không được để trống")
    private String password;

    @NotNull(message = "Vai trò không được để trống")
    private Role role;

    public TaiKhoanDTO(String id, String user, String password, Role role) {
        this.id = id;
        this.user = user;
        this.password = password;
        this.role = role;
    }

    public TaiKhoanDTO() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    @Override
    public String toString() {
        return "TaiKhoanDTO{" +
                "id='" + id + '\'' +
                ", user='" + user + '\'' +
                ", password='" + password + '\'' +
                ", role=" + role +
                '}';
    }
}
