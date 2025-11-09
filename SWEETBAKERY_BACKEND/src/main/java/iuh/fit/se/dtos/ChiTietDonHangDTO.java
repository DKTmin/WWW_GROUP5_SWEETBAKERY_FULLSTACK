package iuh.fit.se.dtos;

import jakarta.validation.constraints.Min;
import lombok.*;

@Builder
public class ChiTietDonHangDTO {
    private String id;

    @Min(value = 1, message = "Số lượng tối thiểu là 1")
    private int soLuong;

    private String donHangId;

    private String banhNgotId;

    public ChiTietDonHangDTO(String id, int soLuong, String donHangId, String banhNgotId) {
        this.id = id;
        this.soLuong = soLuong;
        this.donHangId = donHangId;
        this.banhNgotId = banhNgotId;
    }

    public ChiTietDonHangDTO() {
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

    public String getDonHangId() {
        return donHangId;
    }

    public void setDonHangId(String donHangId) {
        this.donHangId = donHangId;
    }

    public String getBanhNgotId() {
        return banhNgotId;
    }

    public void setBanhNgotId(String banhNgotId) {
        this.banhNgotId = banhNgotId;
    }

    @Override
    public String toString() {
        return "ChiTietDonHangDTO{" +
                "id='" + id + '\'' +
                ", soLuong=" + soLuong +
                ", donHangId='" + donHangId + '\'' +
                ", banhNgotId='" + banhNgotId + '\'' +
                '}';
    }
}
