package iuh.fit.se.services;

import iuh.fit.se.dtos.request.PastryCategoryCreationRequest;
import iuh.fit.se.dtos.request.PastryCategoryUpdateRequest;
import iuh.fit.se.dtos.response.PastryCategoryCreationResponse;
import iuh.fit.se.dtos.response.PastryCategoryUpdateResponse;
import iuh.fit.se.entities.PastryCategory;

import java.util.List;

public interface PastryCategoryService {
    PastryCategoryCreationResponse findById(String id);
    List<PastryCategory> findAll();
    PastryCategoryCreationResponse save(PastryCategoryCreationRequest request);
    PastryCategoryUpdateResponse update(String id, PastryCategoryUpdateRequest request);
    boolean delete(String id);
//    List<PastryCategory> findAll();
}
