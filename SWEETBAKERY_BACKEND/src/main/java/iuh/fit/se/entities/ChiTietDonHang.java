package iuh.fit.se.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietDonHang {
    @Id
    private String id;

    private int soLuong;

    @ManyToOne
    @JoinColumn(name = "don_hang_id")
    private DonHang donHang;

    @ManyToOne
    @JoinColumn(name = "banh_ngot_id")
    private BanhNgot banhNgot;
}
