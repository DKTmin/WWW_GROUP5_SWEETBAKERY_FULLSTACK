package iuh.fit.se.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Builder
public class NhanVienDTO {
    private String id;

    @NotEmpty(message = "Tên không được để trống")
    private String ten;

    @Email(message = "Email không hợp lệ")
    private String gmail;

    @Pattern(regexp = "0[0-9]{9,10}", message = "Số điện thoại không hợp lệ")
    private String sdt;

    private String diaChi;

    private String taiKhoanId;

    public NhanVienDTO(String id, String ten, String gmail, String sdt, String diaChi, String taiKhoanId) {
        this.id = id;
        this.ten = ten;
        this.gmail = gmail;
        this.sdt = sdt;
        this.diaChi = diaChi;
        this.taiKhoanId = taiKhoanId;
    }

    public NhanVienDTO() {
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

    public String getTaiKhoanId() {
        return taiKhoanId;
    }

    public void setTaiKhoanId(String taiKhoanId) {
        this.taiKhoanId = taiKhoanId;
    }

    @Override
    public String toString() {
        return "NhanVienDTO{" +
                "id='" + id + '\'' +
                ", ten='" + ten + '\'' +
                ", gmail='" + gmail + '\'' +
                ", sdt='" + sdt + '\'' +
                ", diaChi='" + diaChi + '\'' +
                ", taiKhoanId='" + taiKhoanId + '\'' +
                '}';
    }
}
