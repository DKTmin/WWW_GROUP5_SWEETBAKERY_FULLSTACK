package iuh.fit.se.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "vnpay_transaction")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VnPayTransaction {
    @Id
    private String id; // txnRef

    @Column(name = "user_id")
    private String userId;

    @Column(columnDefinition = "TEXT")
    private String payload; // JSON of items and other data

    private Double amount;

    private String status; // PENDING, PAID, FAILED

    private LocalDateTime createdAt;
}
