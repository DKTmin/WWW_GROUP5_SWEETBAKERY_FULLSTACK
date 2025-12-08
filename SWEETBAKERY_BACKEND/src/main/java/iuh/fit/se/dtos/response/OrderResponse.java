package iuh.fit.se.dtos.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class OrderResponse {
    String id;
    LocalDateTime ngayDatHang;
    Double tongTien;
    String paymentMethod;
    String trangThai;
    String paymentUrl;
    String customerAddress;
    String customerName;
    String lyDoHuy;
    List<OrderDetailResponse> items;
}
