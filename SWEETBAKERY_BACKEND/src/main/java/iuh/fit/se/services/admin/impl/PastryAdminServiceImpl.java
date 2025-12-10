package iuh.fit.se.services.admin.impl;

import iuh.fit.se.dtos.request.PastryCreationRequest;
import iuh.fit.se.dtos.request.PastryUpdateRequest;
import iuh.fit.se.dtos.response.PastryCreationResponse;
import iuh.fit.se.dtos.response.PastryUpdateResponse;
import iuh.fit.se.entities.Pastry;
import iuh.fit.se.entities.PastryCategory;
import iuh.fit.se.entities.enums.PastryStatus;
import iuh.fit.se.mapper.PastryMapper;
import iuh.fit.se.repositories.PastryCategoryRepository;
import iuh.fit.se.repositories.PastryRepository;
import iuh.fit.se.services.admin.PastryAdminService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PastryAdminServiceImpl implements PastryAdminService {

    PastryRepository pastryRepository;
    PastryCategoryRepository pastryCategoryRepository;
    PastryMapper pastryMapper;

    @Override
    public PastryCreationResponse findById(String id) {
        Pastry pastry = pastryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pastry not found"));
        return pastryMapper.toPastryCreationResponse(pastry);
    }

    @Override
    public List<PastryCreationResponse> findAll() {
        return pastryRepository.findAll()
                .stream()
                .map(pastryMapper::toPastryCreationResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PastryCreationResponse> findByCategory(String categoryId) {
        if (categoryId == null || categoryId.isBlank()) {
            return findAll();
        }
        return pastryRepository.findAllByCategory_Id(categoryId)
                .stream()
                .map(pastryMapper::toPastryCreationResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PastryCreationResponse> search(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return findAll();
        }

        String q = keyword.trim();
        return pastryRepository
                .findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(q, q)
                .stream()
                .map(pastryMapper::toPastryCreationResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public PastryCreationResponse save(PastryCreationRequest request) {
        // Map cơ bản từ request -> entity
        Pastry pastry = pastryMapper.toPastry(request);

        // Mặc định status = DRAFT, stockQuantity = 0 đã để trong entity

        // Set category nếu có categoryId
        Optional.ofNullable(request.getCategoryId())
                .filter(id -> !id.isBlank())
                .flatMap(pastryCategoryRepository::findById)
                .ifPresent(pastry::setCategory);

        Pastry saved = pastryRepository.save(pastry);
        return pastryMapper.toPastryCreationResponse(saved);
    }

    @Transactional
    @Override
    public PastryUpdateResponse update(String id, PastryUpdateRequest request) {
        Pastry pastry = pastryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pastry not found"));

        // Update các field cơ bản: name, price, description,...
        pastryMapper.update(pastry, request);

        try {
            var method = request.getClass().getMethod("getCategoryId");
            Object cidObj = method.invoke(request);
            if (cidObj instanceof String cid && !cid.isBlank()) {
                pastryCategoryRepository.findById(cid)
                        .ifPresent(pastry::setCategory);
            }
        } catch (NoSuchMethodException ignored) {
            // Không có field categoryId thì bỏ qua
        } catch (Exception e) {
            e.printStackTrace();
        }

        Pastry updated = pastryRepository.save(pastry);
        return pastryMapper.toPastryUpdateResponse(updated);
    }

    @Transactional
    @Override
    public boolean delete(String id) {
        Pastry pastry = pastryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pastry not found"));

        // Nếu đã từng nằm trong order -> chỉ soft delete
        if (pastry.getOrderDetails() != null && !pastry.getOrderDetails().isEmpty()) {
            pastry.setStatus(PastryStatus.DISCONTINUED);
            pastryRepository.save(pastry);
        } else {
            // Chưa có trong đơn hàng -> có thể xoá hẳn
            pastryRepository.delete(pastry);
        }
        return true;
    }
}
