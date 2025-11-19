package iuh.fit.se.dtos.request;

import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.FieldDefaults;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 14/11/2025, Friday
 **/

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)

public class BanhNgotCreationRequest {
    String tenBanh;
    Double gia;
    String moTa;
}
