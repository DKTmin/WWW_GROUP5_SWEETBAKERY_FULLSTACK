package iuh.fit.se.dtos;

import iuh.fit.se.entities.enums.TrangThaiDH;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonHangDTO {
    private String id;

    @NotNull(message = "Ngày đặt hàng không được để trống")
    private LocalDateTime ngayDatHang;

    @PositiveOrZero(message = "Tổng tiền phải >= 0")
    private double tongTien;

    private TrangThaiDH trangThai;

    private String khachHangId;

    private String nhanVienId;

    private List<ChiTietDonHangDTO> chiTietDonHangs;
}
