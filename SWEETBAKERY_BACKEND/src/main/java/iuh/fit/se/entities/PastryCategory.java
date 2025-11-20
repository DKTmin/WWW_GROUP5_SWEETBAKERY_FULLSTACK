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
public class PastryCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String tenLoai;

    @OneToMany(mappedBy = "pastryCategory")
    private List<Pastry> pastries;
}
