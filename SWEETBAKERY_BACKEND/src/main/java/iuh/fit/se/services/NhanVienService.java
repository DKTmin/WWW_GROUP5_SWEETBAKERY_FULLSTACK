package iuh.fit.se.services;

import iuh.fit.se.dtos.NhanVienDTO;
import iuh.fit.se.entities.NhanVien;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface NhanVienService {
    NhanVienDTO findById(String id);
    List<NhanVienDTO> findAll();
    Page<NhanVienDTO> findAllWithPaging(@ParameterObject Pageable pageable);
    NhanVienDTO save(NhanVien nhanVien);
    NhanVienDTO update(String id, NhanVien nhanVien);
    boolean delete(String id);
    List<NhanVienDTO> search(String keyword);
}
