package iuh.fit.se.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class OrderDetail {
    @Id
    private String id;

    private int soLuong;

    @ManyToOne
    @JoinColumn(name = "don_hang_id")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "banh_ngot_id")
    private Pastry pastry;
}
