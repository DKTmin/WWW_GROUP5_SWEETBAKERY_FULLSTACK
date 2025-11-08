package iuh.fit.se.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class NhanVien {
    @Id
    private String id;

    private String ten;
    private String gmail;
    private String sdt;
    private String diaChi;

    @OneToOne
    @JoinColumn(name = "tai_khoan_id")
    private TaiKhoan taiKhoan;

    @OneToMany(mappedBy = "nhanVien")
    private List<DonHang> donHangs;
}
