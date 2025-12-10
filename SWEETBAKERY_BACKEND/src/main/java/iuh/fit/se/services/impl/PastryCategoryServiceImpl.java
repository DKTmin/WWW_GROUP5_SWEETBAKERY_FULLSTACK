package iuh.fit.se.services.impl;

import iuh.fit.se.dtos.request.PastryCategoryCreationRequest;
import iuh.fit.se.dtos.request.PastryCategoryUpdateRequest;
import iuh.fit.se.dtos.response.PastryCategoryCreationResponse;
import iuh.fit.se.dtos.response.PastryCategoryUpdateResponse;
import iuh.fit.se.entities.PastryCategory;
import iuh.fit.se.mapper.PastryCategoryMapper;
import iuh.fit.se.repositories.PastryCategoryRepository;
import iuh.fit.se.services.PastryCategoryService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PastryCategoryServiceImpl implements PastryCategoryService {

    PastryCategoryRepository repository;
    PastryCategoryMapper mapper;

    @Override
    public PastryCategoryCreationResponse findById(String id) {
        PastryCategory category = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        return mapper.toCategoryCreationResponse(category);
    }

    @Override
    public List<PastryCategoryCreationResponse> findAll() {
        // CŨ: return repository.findAll()... (Lấy hết cả ẩn hiện)

        // MỚI: Chỉ lấy danh mục đang hiện
        return repository.findByIsActiveTrue()
                .stream()
                .map(mapper::toCategoryCreationResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PastryCategoryCreationResponse save(PastryCategoryCreationRequest request) {
        PastryCategory category = mapper.toCategory(request);

        // Nếu DTO không gửi isActive thì default vẫn true trong entity
        if (request.getIsActive() != null) {
            category.setIsActive(request.getIsActive());
        }

        PastryCategory saved = repository.save(category);

        return mapper.toCategoryCreationResponse(saved);
    }

    @Override
    public PastryCategoryUpdateResponse update(String id, PastryCategoryUpdateRequest request) {
        PastryCategory category = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        mapper.update(category, request);

        PastryCategory updated = repository.save(category);

        return mapper.toCategoryUpdateResponse(updated);
    }

    /**
     * Soft delete category: set isActive = false
     */
    @Transactional
    @Override
    public boolean delete(String id) {
        PastryCategory category = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setIsActive(false);
        repository.save(category);
        return true;
    }
}
