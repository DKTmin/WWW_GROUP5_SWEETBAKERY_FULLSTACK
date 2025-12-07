package iuh.fit.se.dtos.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PastryCategoryUpdateRequest {

    String name;

    Boolean isActive;
}
