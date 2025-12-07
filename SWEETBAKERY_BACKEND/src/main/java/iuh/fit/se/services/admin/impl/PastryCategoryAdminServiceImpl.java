package iuh.fit.se.services.admin.impl;

import iuh.fit.se.dtos.request.PastryCategoryCreationRequest;
import iuh.fit.se.dtos.request.PastryCategoryUpdateRequest;
import iuh.fit.se.dtos.response.PastryCategoryCreationResponse;
import iuh.fit.se.dtos.response.PastryCategoryUpdateResponse;
import iuh.fit.se.entities.PastryCategory;
import iuh.fit.se.mapper.PastryCategoryMapper;
import iuh.fit.se.repositories.PastryCategoryRepository;
import iuh.fit.se.services.admin.PastryCategoryAdminService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PastryCategoryAdminServiceImpl implements PastryCategoryAdminService {

    PastryCategoryRepository repository;
    PastryCategoryMapper mapper;

    @Override
    public PastryCategoryCreationResponse findById(String id) {
        PastryCategory category = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        return mapper.toCategoryCreationResponse(category);
    }

    @Override
    public List<PastryCategory> findAll() {
        // Admin thấy cả active + inactive
        return repository.findAll();
    }

    @Transactional
    @Override
    public PastryCategoryCreationResponse save(PastryCategoryCreationRequest request) {
        PastryCategory category = mapper.toCategory(request);

        // name
        if (request.getName() != null) {
            category.setName(request.getName());
        }

        // isActive: nếu FE không gửi → mặc định true
        if (request.getIsActive() != null) {
            category.setIsActive(request.getIsActive());
        } else {
            category.setIsActive(true);
        }

        PastryCategory saved = repository.save(category);
        return mapper.toCategoryCreationResponse(saved);
    }

    @Transactional
    @Override
    public PastryCategoryUpdateResponse update(String id, PastryCategoryUpdateRequest request) {
        PastryCategory category = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // Cập nhật name
        if (request.getName() != null) {
            category.setName(request.getName());
        }

        // Cập nhật isActive
        if (request.getIsActive() != null) {
            category.setIsActive(request.getIsActive());
        }

        PastryCategory updated = repository.save(category);
        return mapper.toCategoryUpdateResponse(updated);
    }

    @Override
    @Transactional
    public boolean delete(String id) {
        PastryCategory category = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // Nếu còn bánh trong category → không cho ẩn
        if (category.getPastries() != null && !category.getPastries().isEmpty()) {
            return false;
        }

        // Soft delete: ẩn category
        category.setIsActive(false);
        repository.save(category);
        return true;
    }
}