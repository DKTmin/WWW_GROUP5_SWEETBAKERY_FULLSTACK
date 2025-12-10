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
    @Column(name = "trang_thai", columnDefinition = "ENUM('PENDING','PAID','CONFIRMED','COMPLETED','REFUND_PENDING','CANCELLED')")
    private TrangThaiDH trangThai;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User customer;

    // payment method (e.g., CASH, MOMO)
    private String paymentMethod;

    // banking info (for VNPay refund reference)
    @Column(name = "bank_account_name", length = 150)
    private String bankAccountName;

    @Column(name = "bank_account_number", length = 64)
    private String bankAccountNumber;

    @Column(name = "bank_name", length = 120)
    private String bankName;

    // Ảnh chứng từ hoàn tiền (Cloudinary URL)
    @Column(name = "refund_proof_image_url", length = 512)
    private String refundProofImageUrl;

    // Lý do hủy đơn hàng
    @Column(name = "ly_do_huy", length = 500)
    private String lyDoHuy;

    // @ManyToOne
    // @JoinColumn(name = "nhan_vien_id")
    // private Employee employee;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderDetail> orderDetails;
}
