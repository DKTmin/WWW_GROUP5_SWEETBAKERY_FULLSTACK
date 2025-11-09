package iuh.fit.se.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
public class ChiTietDonHang {
    @Id
    private String id;

    private int soLuong;

    @ManyToOne
    @JoinColumn(name = "don_hang_id")
    private DonHang donHang;

    @ManyToOne
    @JoinColumn(name = "banh_ngot_id")
    private BanhNgot banhNgot;

    public ChiTietDonHang(String id, int soLuong, DonHang donHang, BanhNgot banhNgot) {
        this.id = id;
        this.soLuong = soLuong;
        this.donHang = donHang;
        this.banhNgot = banhNgot;
    }

    public ChiTietDonHang() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getSoLuong() {
        return soLuong;
    }

    public void setSoLuong(int soLuong) {
        this.soLuong = soLuong;
    }

    public DonHang getDonHang() {
        return donHang;
    }

    public void setDonHang(DonHang donHang) {
        this.donHang = donHang;
    }

    public BanhNgot getBanhNgot() {
        return banhNgot;
    }

    public void setBanhNgot(BanhNgot banhNgot) {
        this.banhNgot = banhNgot;
    }

    @Override
    public String toString() {
        return "ChiTietDonHang{" +
                "id='" + id + '\'' +
                ", soLuong=" + soLuong +
                ", donHang=" + donHang +
                ", banhNgot=" + banhNgot +
                '}';
    }
}
