package iuh.fit.se.entities;

import iuh.fit.se.entities.enums.Role;
import jakarta.persistence.*;
import lombok.*;


@Entity
public class TaiKhoan {
    @Id
    private String id;

    private String user;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToOne(mappedBy = "taiKhoan")
    private KhachHang khachHang;

    @OneToOne(mappedBy = "taiKhoan")
    private NhanVien nhanVien;

    public TaiKhoan(String id, String user, String password, Role role, KhachHang khachHang, NhanVien nhanVien) {
        this.id = id;
        this.user = user;
        this.password = password;
        this.role = role;
        this.khachHang = khachHang;
        this.nhanVien = nhanVien;
    }

    public TaiKhoan() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
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

    @Override
    public String toString() {
        return "TaiKhoan{" +
                "id='" + id + '\'' +
                ", user='" + user + '\'' +
                ", password='" + password + '\'' +
                ", role=" + role +
                ", khachHang=" + khachHang +
                ", nhanVien=" + nhanVien +
                '}';
    }
}
