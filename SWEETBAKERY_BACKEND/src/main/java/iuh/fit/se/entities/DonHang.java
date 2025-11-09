package iuh.fit.se.entities;

import iuh.fit.se.entities.enums.TrangThaiDH;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
public class DonHang {
    @Id
    private String id;

    private LocalDateTime ngayDatHang;
    private double tongTien;

    @Enumerated(EnumType.STRING)
    private TrangThaiDH trangThai;

    @ManyToOne
    @JoinColumn(name = "khach_hang_id")
    private KhachHang khachHang;

    @ManyToOne
    @JoinColumn(name = "nhan_vien_id")
    private NhanVien nhanVien;

    @OneToMany(mappedBy = "donHang", cascade = CascadeType.ALL)
    private List<ChiTietDonHang> chiTietDonHangs;

    public DonHang(String id, LocalDateTime ngayDatHang, double tongTien, TrangThaiDH trangThai, KhachHang khachHang, NhanVien nhanVien, List<ChiTietDonHang> chiTietDonHangs) {
        this.id = id;
        this.ngayDatHang = ngayDatHang;
        this.tongTien = tongTien;
        this.trangThai = trangThai;
        this.khachHang = khachHang;
        this.nhanVien = nhanVien;
        this.chiTietDonHangs = chiTietDonHangs;
    }

    public DonHang() {
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

    public KhachHang getKhachHang() {
        return khachHang;
    }

    public void setKhachHang(KhachHang khachHang) {
        this.khachHang = khachHang;
    }

    public NhanVien getNhanVien() {
        return nhanVien;
    }

    public void setNhanVien(NhanVien nhanVien) {
        this.nhanVien = nhanVien;
    }

    public List<ChiTietDonHang> getChiTietDonHangs() {
        return chiTietDonHangs;
    }

    public void setChiTietDonHangs(List<ChiTietDonHang> chiTietDonHangs) {
        this.chiTietDonHangs = chiTietDonHangs;
    }

    @Override
    public String toString() {
        return "DonHang{" +
                "id='" + id + '\'' +
                ", ngayDatHang=" + ngayDatHang +
                ", tongTien=" + tongTien +
                ", trangThai=" + trangThai +
                ", khachHang=" + khachHang +
                ", nhanVien=" + nhanVien +
                ", chiTietDonHangs=" + chiTietDonHangs +
                '}';
    }
}
