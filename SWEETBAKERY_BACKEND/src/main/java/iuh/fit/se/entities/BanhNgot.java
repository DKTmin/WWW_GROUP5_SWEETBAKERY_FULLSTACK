package iuh.fit.se.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
public class BanhNgot {
    @Id
    private String id;

    private String tenBanh;
    private double gia;
    private String mota;
    private String hinhAnh;

    @ManyToOne
    @JoinColumn(name = "loai_banh_id")
    private LoaiBanh loaiBanh;

    @OneToMany(mappedBy = "banhNgot")
    private List<ChiTietDonHang> chiTietDonHangs;

    public BanhNgot(String id, String tenBanh, double gia, String mota, String hinhAnh, LoaiBanh loaiBanh, List<ChiTietDonHang> chiTietDonHangs) {
        this.id = id;
        this.tenBanh = tenBanh;
        this.gia = gia;
        this.mota = mota;
        this.hinhAnh = hinhAnh;
        this.loaiBanh = loaiBanh;
        this.chiTietDonHangs = chiTietDonHangs;
    }

    public BanhNgot() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTenBanh() {
        return tenBanh;
    }

    public void setTenBanh(String tenBanh) {
        this.tenBanh = tenBanh;
    }

    public double getGia() {
        return gia;
    }

    public void setGia(double gia) {
        this.gia = gia;
    }

    public String getMota() {
        return mota;
    }

    public void setMota(String mota) {
        this.mota = mota;
    }

    public String getHinhAnh() {
        return hinhAnh;
    }

    public void setHinhAnh(String hinhAnh) {
        this.hinhAnh = hinhAnh;
    }

    public LoaiBanh getLoaiBanh() {
        return loaiBanh;
    }

    public void setLoaiBanh(LoaiBanh loaiBanh) {
        this.loaiBanh = loaiBanh;
    }

    public List<ChiTietDonHang> getChiTietDonHangs() {
        return chiTietDonHangs;
    }

    public void setChiTietDonHangs(List<ChiTietDonHang> chiTietDonHangs) {
        this.chiTietDonHangs = chiTietDonHangs;
    }

    @Override
    public String toString() {
        return "BanhNgot{" +
                "id='" + id + '\'' +
                ", tenBanh='" + tenBanh + '\'' +
                ", gia=" + gia +
                ", mota='" + mota + '\'' +
                ", hinhAnh='" + hinhAnh + '\'' +
                ", loaiBanh=" + loaiBanh +
                ", chiTietDonHangs=" + chiTietDonHangs +
                '}';
    }
}
