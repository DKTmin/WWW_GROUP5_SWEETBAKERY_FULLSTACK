package iuh.fit.se.services.admin;

import iuh.fit.se.dtos.request.PastryCreationRequest;
import iuh.fit.se.dtos.request.PastryUpdateRequest;
import iuh.fit.se.dtos.response.PastryCreationResponse;
import iuh.fit.se.dtos.response.PastryUpdateResponse;

import java.util.List;

public interface PastryAdminService {

    PastryCreationResponse findById(String id);

    // ADMIN: thấy tất cả bánh, mọi trạng thái
    List<PastryCreationResponse> findAll();

    // ADMIN: lọc theo category nhưng KHÔNG lọc status
    List<PastryCreationResponse> findByCategory(String categoryId);

    // ADMIN: search tất cả, không lọc trạng thái
    List<PastryCreationResponse> search(String keyword);

    PastryCreationResponse save(PastryCreationRequest request);
    PastryUpdateResponse update(String id, PastryUpdateRequest request);

    // Soft delete (status = DISCONTINUED)
    boolean delete(String id);
}
