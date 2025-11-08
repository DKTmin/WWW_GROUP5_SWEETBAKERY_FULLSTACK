package iuh.fit.se.services;

import iuh.fit.se.dtos.KhachHangDTO;
import iuh.fit.se.entities.KhachHang;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface KhachHangService {
    KhachHangDTO findById(String id);
    List<KhachHangDTO> findAll();
    Page<KhachHangDTO> findAllWithPaging(@ParameterObject Pageable pageable);
    KhachHangDTO save(KhachHang khachHang);
    KhachHangDTO update(String id, KhachHang khachHang);
    boolean delete(String id);
    List<KhachHangDTO> search(String keyword);
}
