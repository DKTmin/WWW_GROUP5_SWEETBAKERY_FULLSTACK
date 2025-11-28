package iuh.fit.se.dtos.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)


public class PastryCategoryCreationRequest {
    private String tenLoai;
}
