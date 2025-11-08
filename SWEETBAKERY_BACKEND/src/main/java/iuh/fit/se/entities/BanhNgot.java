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
public class BanhNgot {
    @Id
    private String id;

    private String tenBanh;
    private double gia;
    private String mota;
    private String hinhAnh;

    @ManyToOne
    @JoinColumn(name = "loai_banh_id")
    private LoaiBanh loaiBanh;

    @OneToMany(mappedBy = "banhNgot")
    private List<ChiTietDonHang> chiTietDonHangs;
}
