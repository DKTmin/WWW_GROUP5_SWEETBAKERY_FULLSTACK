package iuh.fit.se.entities;

import iuh.fit.se.entities.enums.Role;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class TaiKhoan {
    @Id
    private String id;

    private String user;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToOne(mappedBy = "taiKhoan")
    private KhachHang khachHang;

    @OneToOne(mappedBy = "taiKhoan")
    private NhanVien nhanVien;
}
