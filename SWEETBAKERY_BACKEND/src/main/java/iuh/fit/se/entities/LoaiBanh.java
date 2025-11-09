package iuh.fit.se.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
public class LoaiBanh {
    @Id
    private String id;

    private String tenLoai;

    @OneToMany(mappedBy = "loaiBanh")
    private List<BanhNgot> banhNgots;

    public LoaiBanh(String id, String tenLoai, List<BanhNgot> banhNgots) {
        this.id = id;
        this.tenLoai = tenLoai;
        this.banhNgots = banhNgots;
    }

    public LoaiBanh() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTenLoai() {
        return tenLoai;
    }

    public void setTenLoai(String tenLoai) {
        this.tenLoai = tenLoai;
    }

    public List<BanhNgot> getBanhNgots() {
        return banhNgots;
    }

    public void setBanhNgots(List<BanhNgot> banhNgots) {
        this.banhNgots = banhNgots;
    }

    @Override
    public String toString() {
        return "LoaiBanh{" +
                "id='" + id + '\'' +
                ", tenLoai='" + tenLoai + '\'' +
                ", banhNgots=" + banhNgots +
                '}';
    }
}
