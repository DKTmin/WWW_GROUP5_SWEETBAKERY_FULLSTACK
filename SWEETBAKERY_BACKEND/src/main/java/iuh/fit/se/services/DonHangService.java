package iuh.fit.se.services;

import iuh.fit.se.dtos.DonHangDTO;
import iuh.fit.se.entities.DonHang;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DonHangService {
    DonHangDTO findById(String id);
    List<DonHangDTO> findAll();
    Page<DonHangDTO> findAllWithPaging(@ParameterObject Pageable pageable);
    DonHangDTO save(DonHang donHang);
    DonHangDTO update(String id, DonHang donHang);
    boolean delete(String id);
    List<DonHangDTO> search(String keyword);
}
