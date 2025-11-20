package iuh.fit.se.entities;

import iuh.fit.se.entities.enums.TrangThaiDH;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Order {
    @Id
    private String id;

    private LocalDateTime ngayDatHang;
    private double tongTien;

    @Enumerated(EnumType.STRING)
    private TrangThaiDH trangThai;

    @ManyToOne
    @JoinColumn(name = "khach_hang_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "nhan_vien_id")
    private Employee employee;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderDetail> orderDetails;

    public Order(String id, LocalDateTime ngayDatHang, double tongTien, TrangThaiDH trangThai, Customer customer, Employee employee, List<OrderDetail> orderDetails) {
        this.id = id;
        this.ngayDatHang = ngayDatHang;
        this.tongTien = tongTien;
        this.trangThai = trangThai;
        this.customer = customer;
        this.employee = employee;
        this.orderDetails = orderDetails;
    }

    public Order() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public LocalDateTime getNgayDatHang() {
        return ngayDatHang;
    }

    public void setNgayDatHang(LocalDateTime ngayDatHang) {
        this.ngayDatHang = ngayDatHang;
    }

    public double getTongTien() {
        return tongTien;
    }

    public void setTongTien(double tongTien) {
        this.tongTien = tongTien;
    }

    public TrangThaiDH getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThaiDH trangThai) {
        this.trangThai = trangThai;
    }

    public Customer getKhachHang() {
        return customer;
    }

    public void setKhachHang(Customer customer) {
        this.customer = customer;
    }

    public Employee getNhanVien() {
        return employee;
    }

    public void setNhanVien(Employee employee) {
        this.employee = employee;
    }

    public List<OrderDetail> getChiTietDonHangs() {
        return orderDetails;
    }

    public void setChiTietDonHangs(List<OrderDetail> orderDetails) {
        this.orderDetails = orderDetails;
    }

    @Override
    public String toString() {
        return "Order{" +
                "id='" + id + '\'' +
                ", ngayDatHang=" + ngayDatHang +
                ", tongTien=" + tongTien +
                ", trangThai=" + trangThai +
                ", customer=" + customer +
                ", employee=" + employee +
                ", orderDetails=" + orderDetails +
                '}';
    }
}
