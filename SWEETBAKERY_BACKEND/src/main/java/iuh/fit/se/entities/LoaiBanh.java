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
public class LoaiBanh {
    @Id
    private String id;

    private String tenLoai;

    @OneToMany(mappedBy = "loaiBanh")
    private List<BanhNgot> banhNgots;
}
