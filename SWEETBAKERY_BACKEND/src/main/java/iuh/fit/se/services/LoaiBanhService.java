package iuh.fit.se.services;

import iuh.fit.se.dtos.LoaiBanhDTO;
import iuh.fit.se.entities.LoaiBanh;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface LoaiBanhService {
    LoaiBanhDTO findById(String id);
    List<LoaiBanhDTO> findAll();
    Page<LoaiBanhDTO> findAllWithPaging(@ParameterObject Pageable pageable);
    LoaiBanhDTO save(LoaiBanh loaiBanh);
    LoaiBanhDTO update(String id, LoaiBanh loaiBanh);
    boolean delete(String id);
    List<LoaiBanhDTO> search(String keyword);
}
