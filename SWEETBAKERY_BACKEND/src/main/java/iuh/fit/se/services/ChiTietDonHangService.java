package iuh.fit.se.services;

import iuh.fit.se.dtos.ChiTietDonHangDTO;
import iuh.fit.se.entities.ChiTietDonHang;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ChiTietDonHangService {
    ChiTietDonHangDTO findById(String id);
    List<ChiTietDonHangDTO> findAll();
    Page<ChiTietDonHangDTO> findAllWithPaging(@ParameterObject Pageable pageable);
    ChiTietDonHangDTO save(ChiTietDonHang chiTietDonHang);
    ChiTietDonHangDTO update(String id, ChiTietDonHang chiTietDonHang);
    boolean delete(String id);
    List<ChiTietDonHangDTO> search(String keyword);
}
