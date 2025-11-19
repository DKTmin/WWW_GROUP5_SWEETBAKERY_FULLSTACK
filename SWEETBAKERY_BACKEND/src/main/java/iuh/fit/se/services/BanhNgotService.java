package iuh.fit.se.services;

import iuh.fit.se.dtos.BanhNgotDTO;
import iuh.fit.se.dtos.request.BanhNgotCreationRequest;
import iuh.fit.se.dtos.request.BanhNgotUpdateRequest;
import iuh.fit.se.dtos.response.BanhNgotCreationResponse;
import iuh.fit.se.dtos.response.BanhNgotUpdateResponse;
import iuh.fit.se.entities.BanhNgot;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BanhNgotService {
    BanhNgotCreationResponse findById(String id);
    List<BanhNgotCreationResponse> findAll();
    Page<BanhNgotDTO> findAllWithPaging(@ParameterObject Pageable pageable);
    BanhNgotCreationResponse save(BanhNgotCreationRequest request);
    BanhNgotUpdateResponse update(String id, BanhNgotUpdateRequest request);
    boolean delete(String id);
    List<BanhNgotDTO> search(String keyword);
}
