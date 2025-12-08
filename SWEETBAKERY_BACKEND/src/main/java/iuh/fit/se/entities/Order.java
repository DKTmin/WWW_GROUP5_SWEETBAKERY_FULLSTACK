package iuh.fit.se.entities;

import iuh.fit.se.entities.enums.TrangThaiDH;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "orders")
public class Order {
    @Id
    private String id;
    private LocalDateTime ngayDatHang;
    private double tongTien;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", columnDefinition = "ENUM('PENDING','CONFIRMED','COMPLETED','CANCELLED')")
    private TrangThaiDH trangThai;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User customer;

    // payment method (e.g., CASH, MOMO)
    private String paymentMethod;

    // Lý do hủy đơn hàng
    @Column(name = "ly_do_huy", length = 500)
    private String lyDoHuy;

    // @ManyToOne
    // @JoinColumn(name = "nhan_vien_id")
    // private Employee employee;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderDetail> orderDetails;
}
