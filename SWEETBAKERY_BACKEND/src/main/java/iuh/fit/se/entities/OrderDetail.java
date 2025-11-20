package iuh.fit.se.entities;

import jakarta.persistence.*;

@Entity
public class OrderDetail {
    @Id
    private String id;

    private int soLuong;

    @ManyToOne
    @JoinColumn(name = "don_hang_id")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "banh_ngot_id")
    private Pastry pastry;

    public OrderDetail(String id, int soLuong, Order order, Pastry pastry) {
        this.id = id;
        this.soLuong = soLuong;
        this.order = order;
        this.pastry = pastry;
    }

    public OrderDetail() {
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

    public Order getDonHang() {
        return order;
    }

    public void setDonHang(Order order) {
        this.order = order;
    }

    public Pastry getBanhNgot() {
        return pastry;
    }

    public void setBanhNgot(Pastry pastry) {
        this.pastry = pastry;
    }

    @Override
    public String toString() {
        return "OrderDetail{" +
                "id='" + id + '\'' +
                ", soLuong=" + soLuong +
                ", order=" + order +
                ", pastry=" + pastry +
                '}';
    }
}
