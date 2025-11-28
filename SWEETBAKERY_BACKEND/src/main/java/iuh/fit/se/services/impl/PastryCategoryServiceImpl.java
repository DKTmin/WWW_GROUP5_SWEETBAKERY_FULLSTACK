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
import iuh.fit.se.entities.PastryCategory;
import iuh.fit.se.repositories.PastryCategoryRepository;
import iuh.fit.se.services.PastryCategoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PastryCategoryServiceImpl implements PastryCategoryService {

    private final PastryCategoryRepository repository;
    private final PastryCategoryMapper mapper;

    @Override
    public PastryCategoryCreationResponse findById(String id) {
        PastryCategory category = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        return mapper.toCategoryCreationResponse(category);
    }

    @Override
    public List<PastryCategoryCreationResponse> findAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toCategoryCreationResponse)
                .toList();
    }

    @Override
    public PastryCategoryCreationResponse save(PastryCategoryCreationRequest request) {
        PastryCategory category = mapper.toCategory(request);

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

    @Override
    public boolean delete(String id) {
        if (!repository.existsById(id)) {
            return false;
        }

        repository.deleteById(id);
        return true;
    }
}
