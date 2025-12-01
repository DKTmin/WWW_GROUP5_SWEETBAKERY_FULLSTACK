package iuh.fit.se.services;

import iuh.fit.se.dtos.request.PastryCreationRequest;
import iuh.fit.se.dtos.request.PastryUpdateRequest;
import iuh.fit.se.dtos.response.PastryCreationResponse;
import iuh.fit.se.dtos.response.PastryUpdateResponse;

import java.util.List;

public interface PastryService {
    PastryCreationResponse findById(String id);
    List<PastryCreationResponse> findAll();
    List<PastryCreationResponse> findByCategory(String categoryId);
//    Page<BanhNgotDTO> findAllWithPaging(@ParameterObject Pageable pageable);
    List<PastryCreationResponse> search(String keyword);
    PastryCreationResponse save(PastryCreationRequest request);
    PastryUpdateResponse update(String id, PastryUpdateRequest request);
    boolean delete(String id);
//    List<BanhNgotDTO> search(String keyword);



}
