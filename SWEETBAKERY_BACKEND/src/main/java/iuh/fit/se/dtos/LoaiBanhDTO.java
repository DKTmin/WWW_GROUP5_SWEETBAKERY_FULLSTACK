package iuh.fit.se.dtos;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoaiBanhDTO {
    private String id;

    @NotEmpty(message = "Tên loại bánh không được để trống")
    private String tenLoai;
}
