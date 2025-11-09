package iuh.fit.se.dtos;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Builder
public class BanhNgotDTO {
    private String id;

    @NotEmpty(message = "Tên bánh không được để trống")
    private String tenBanh;

    @Positive(message = "Giá phải lớn hơn 0")
    private double gia;

    private String mota;

    private String hinhAnh;

    private String loaiBanhId;

    public BanhNgotDTO(String id, String tenBanh, double gia, String mota, String hinhAnh, String loaiBanhId) {
        this.id = id;
        this.tenBanh = tenBanh;
        this.gia = gia;
        this.mota = mota;
        this.hinhAnh = hinhAnh;
        this.loaiBanhId = loaiBanhId;
    }

    public BanhNgotDTO() {
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

    public String getLoaiBanhId() {
        return loaiBanhId;
    }

    public void setLoaiBanhId(String loaiBanhId) {
        this.loaiBanhId = loaiBanhId;
    }

    @Override
    public String toString() {
        return "BanhNgotDTO{" +
                "id='" + id + '\'' +
                ", tenBanh='" + tenBanh + '\'' +
                ", gia=" + gia +
                ", mota='" + mota + '\'' +
                ", hinhAnh='" + hinhAnh + '\'' +
                ", loaiBanhId='" + loaiBanhId + '\'' +
                '}';
    }
}
