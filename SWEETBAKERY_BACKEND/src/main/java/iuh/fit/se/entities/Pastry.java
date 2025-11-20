package iuh.fit.se.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "pastries")
public class Pastry {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String tenBanh;
    Double gia;
    String moTa;
    String hinhAnh;

    @ManyToOne
    @JoinColumn(name = "loai_banh_id")
    private PastryCategory pastryCategory;

    @Column(nullable = true)
    @OneToMany(mappedBy = "pastry")
    private List<OrderDetail> orderDetails;
}
