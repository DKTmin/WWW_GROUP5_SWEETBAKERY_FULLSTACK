package iuh.fit.se.entities;

import iuh.fit.se.entities.enums.AccountType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 19/11/2025, Wednesday
 **/
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@Entity
@Table(name = "accounts")
public class AccountCredential {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    AccountType type;
    String credential;
    String password;
    Boolean isVerified;
    LocalDateTime createdAt;
    LocalDateTime lastLogin;

    @ManyToOne
            @JoinColumn(name = "user_id")
    User user;

    @PrePersist
    void onCreate(){
        this.createdAt = LocalDateTime.now();
        this.lastLogin = LocalDateTime.now();
    }

}
