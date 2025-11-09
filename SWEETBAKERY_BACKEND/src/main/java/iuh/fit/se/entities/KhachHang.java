package iuh.fit.se.entities;


import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
public class KhachHang {
    @Id
    private String id;

    private String ten;
    private String gmail;
    private String sdt;
    private String diaChi;

    @OneToOne
    @JoinColumn(name = "tai_khoan_id")
    private TaiKhoan taiKhoan;

    @OneToMany(mappedBy = "khachHang")
    private List<DonHang> donHangs;

    public KhachHang(String id, String ten, String gmail, String sdt, String diaChi, TaiKhoan taiKhoan, List<DonHang> donHangs) {
        this.id = id;
        this.ten = ten;
        this.gmail = gmail;
        this.sdt = sdt;
        this.diaChi = diaChi;
        this.taiKhoan = taiKhoan;
        this.donHangs = donHangs;
    }

    public KhachHang() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTen() {
        return ten;
    }

    public void setTen(String ten) {
        this.ten = ten;
    }

    public String getGmail() {
        return gmail;
    }

    public void setGmail(String gmail) {
        this.gmail = gmail;
    }

    public String getSdt() {
        return sdt;
    }

    public void setSdt(String sdt) {
        this.sdt = sdt;
    }

    public String getDiaChi() {
        return diaChi;
    }

    public void setDiaChi(String diaChi) {
        this.diaChi = diaChi;
    }

    public TaiKhoan getTaiKhoan() {
        return taiKhoan;
    }

    public void setTaiKhoan(TaiKhoan taiKhoan) {
        this.taiKhoan = taiKhoan;
    }

    public List<DonHang> getDonHangs() {
        return donHangs;
    }

    public void setDonHangs(List<DonHang> donHangs) {
        this.donHangs = donHangs;
    }

    @Override
    public String toString() {
        return "KhachHang{" +
                "id='" + id + '\'' +
                ", ten='" + ten + '\'' +
                ", gmail='" + gmail + '\'' +
                ", sdt='" + sdt + '\'' +
                ", diaChi='" + diaChi + '\'' +
                ", taiKhoan=" + taiKhoan +
                ", donHangs=" + donHangs +
                '}';
    }
}
