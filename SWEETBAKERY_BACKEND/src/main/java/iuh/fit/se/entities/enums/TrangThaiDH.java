package iuh.fit.se.entities.enums;

public enum TrangThaiDH {
    PENDING, // Pending / Đang chờ xử lý
    PAID, // Paid / Đã thanh toán (VNPay thành công)
    CONFIRMED, // Confirmed / Đã xác nhận
    COMPLETED, // Completed / Hoàn thành
    REFUND_PENDING, // Waiting for refund / Đang đợi hoàn tiền
    CANCELLED // Cancelled / Đã hủy
}
