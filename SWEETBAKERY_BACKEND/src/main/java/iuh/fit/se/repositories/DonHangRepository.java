package iuh.fit.se.repositories;

import iuh.fit.se.entities.DonHang;
import iuh.fit.se.entities.enums.TrangThaiDH;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonHangRepository  extends JpaRepository<DonHang, String> {
    List<DonHang> findByTrangThai(TrangThaiDH trangThai);
    List<DonHang> findByKhachHang_Id(String khachHangId);
}
