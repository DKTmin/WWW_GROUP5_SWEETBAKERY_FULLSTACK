package iuh.fit.se.dtos;

import iuh.fit.se.entities.enums.TrangThaiDH;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

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

    public DonHangDTO(String id, LocalDateTime ngayDatHang, double tongTien, TrangThaiDH trangThai, String khachHangId, String nhanVienId, List<ChiTietDonHangDTO> chiTietDonHangs) {
        this.id = id;
        this.ngayDatHang = ngayDatHang;
        this.tongTien = tongTien;
        this.trangThai = trangThai;
        this.khachHangId = khachHangId;
        this.nhanVienId = nhanVienId;
        this.chiTietDonHangs = chiTietDonHangs;
    }

    public DonHangDTO() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public LocalDateTime getNgayDatHang() {
        return ngayDatHang;
    }

    public void setNgayDatHang(LocalDateTime ngayDatHang) {
        this.ngayDatHang = ngayDatHang;
    }

    public double getTongTien() {
        return tongTien;
    }

    public void setTongTien(double tongTien) {
        this.tongTien = tongTien;
    }

    public TrangThaiDH getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThaiDH trangThai) {
        this.trangThai = trangThai;
    }

    public String getKhachHangId() {
        return khachHangId;
    }

    public void setKhachHangId(String khachHangId) {
        this.khachHangId = khachHangId;
    }

    public String getNhanVienId() {
        return nhanVienId;
    }

    public void setNhanVienId(String nhanVienId) {
        this.nhanVienId = nhanVienId;
    }

    public List<ChiTietDonHangDTO> getChiTietDonHangs() {
        return chiTietDonHangs;
    }

    public void setChiTietDonHangs(List<ChiTietDonHangDTO> chiTietDonHangs) {
        this.chiTietDonHangs = chiTietDonHangs;
    }

    @Override
    public String toString() {
        return "DonHangDTO{" +
                "id='" + id + '\'' +
                ", ngayDatHang=" + ngayDatHang +
                ", tongTien=" + tongTien +
                ", trangThai=" + trangThai +
                ", khachHangId='" + khachHangId + '\'' +
                ", nhanVienId='" + nhanVienId + '\'' +
                ", chiTietDonHangs=" + chiTietDonHangs +
                '}';
    }
}
