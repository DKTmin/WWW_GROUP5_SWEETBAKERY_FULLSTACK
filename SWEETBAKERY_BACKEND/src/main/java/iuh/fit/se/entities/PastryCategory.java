package iuh.fit.se.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "pastry_category")
public class PastryCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    String name;

    @Column(name = "is_active", nullable = false)
    @JsonProperty("isActive")
    boolean isActive = true;   // CHỐT: dùng isActive

    @OneToMany(mappedBy = "category")
    @JsonIgnore
    List<Pastry> pastries;

    /// Đổi tên từ getIsActive() thành isActive()
    public boolean isActive() {
        return isActive;
    }

    // Setter giữ nguyên hoặc đặt là setIsActive đều được,
    // nhưng Lombok thường thích setActive hơn.
    // Tuy nhiên để thủ công như bạn thì dùng setIsActive cũng không sao.
    public void setIsActive(boolean isActive) {
        this.isActive = isActive;
    }
}
