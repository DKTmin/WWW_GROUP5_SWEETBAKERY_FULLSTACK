package iuh.fit.se.services;

import iuh.fit.se.dtos.TaiKhoanDTO;
import iuh.fit.se.entities.TaiKhoan;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface TaiKhoanService {
    TaiKhoanDTO findById(String id);
    List<TaiKhoanDTO> findAll();
    Page<TaiKhoanDTO> findAllWithPaging(@ParameterObject Pageable pageable);
    TaiKhoanDTO save(TaiKhoan taiKhoan);
    TaiKhoanDTO update(String id, TaiKhoan taiKhoan);
    boolean delete(String id);
    List<TaiKhoanDTO> search(String keyword);
}
