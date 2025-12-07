package iuh.fit.se.services.admin;

import iuh.fit.se.dtos.request.PastryCategoryCreationRequest;
import iuh.fit.se.dtos.request.PastryCategoryUpdateRequest;
import iuh.fit.se.dtos.response.PastryCategoryCreationResponse;
import iuh.fit.se.dtos.response.PastryCategoryUpdateResponse;
import iuh.fit.se.entities.PastryCategory;

import java.util.List;

public interface PastryCategoryAdminService {

    PastryCategoryCreationResponse findById(String id);

    List<PastryCategory> findAll();

    PastryCategoryCreationResponse save(PastryCategoryCreationRequest request);

    PastryCategoryUpdateResponse update(String id, PastryCategoryUpdateRequest request);

    /**
     * Ẩn danh mục (set isActive = false) nếu không có bánh thuộc danh mục.
     *
     * @return true nếu ẩn được, false nếu đang có bánh nên không ẩn.
     */
    boolean delete(String id);
}
