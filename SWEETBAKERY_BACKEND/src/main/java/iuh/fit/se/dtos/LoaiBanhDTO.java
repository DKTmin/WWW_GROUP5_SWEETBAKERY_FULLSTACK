package iuh.fit.se.dtos;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;

@Builder
public class LoaiBanhDTO {
    private String id;

    @NotEmpty(message = "Tên loại bánh không được để trống")
    private String tenLoai;

    public LoaiBanhDTO(String id, String tenLoai) {
        this.id = id;
        this.tenLoai = tenLoai;
    }

    public LoaiBanhDTO() {
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

    @Override
    public String toString() {
        return "LoaiBanhDTO{" +
                "id='" + id + '\'' +
                ", tenLoai='" + tenLoai + '\'' +
                '}';
    }
}
