package iuh.fit.se.entities;

import iuh.fit.se.entities.enums.TrangThaiDH;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class DonHang {
    @Id
    private String id;

    private LocalDateTime ngayDatHang;
    private double tongTien;

    @Enumerated(EnumType.STRING)
    private TrangThaiDH trangThai;

    @ManyToOne
    @JoinColumn(name = "khach_hang_id")
    private KhachHang khachHang;

    @ManyToOne
    @JoinColumn(name = "nhan_vien_id")
    private NhanVien nhanVien;

    @OneToMany(mappedBy = "donHang", cascade = CascadeType.ALL)
    private List<ChiTietDonHang> chiTietDonHangs;
}
