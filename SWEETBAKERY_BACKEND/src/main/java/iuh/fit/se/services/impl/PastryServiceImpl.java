package iuh.fit.se.services.impl;

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
import iuh.fit.se.services.PastryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Pastry service implementation
 */
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Service
public class PastryServiceImpl implements PastryService {

    PastryRepository pastryRepository;
    PastryMapper pastryMapper;
    PastryCategoryRepository pastryCategoryRepository;

    @Override
    public PastryCreationResponse findById(String id) {
        Pastry pastry = pastryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pastry not found"));

        return pastryMapper.toPastryCreationResponse(pastry);
    }

    /**
     * Dùng cho FE khách hàng:
     * Chỉ trả bánh: status = ACTIVE & category.isActive = true
     */
    @Override
    public List<PastryCreationResponse> findAll() {
        // Gọi repository với tham số ACTIVE
        return pastryRepository.findAllAvailablePastries(PastryStatus.ACTIVE)
                .stream()
                .map(pastryMapper::toPastryCreationResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public PastryCreationResponse save(PastryCreationRequest request) {
        // MapStruct map trực tiếp các field: name, price, description, imageUrl, stockQuantity, status
        Pastry pastry = pastryMapper.toPastry(request);

        // Gắn category nếu có categoryId
        if (request.getCategoryId() != null && !request.getCategoryId().isBlank()) {
            PastryCategory category = pastryCategoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            pastry.setCategory(category);
        }

        // Nếu request không gửi status -> giữ default DRAFT từ entity
        if (pastry.getStatus() == null) {
            pastry.setStatus(PastryStatus.DRAFT);
        }

        // Nếu stockQuantity < 0 thì về 0
        if (pastry.getStockQuantity() < 0) {
            pastry.setStockQuantity(0);
        }

        Pastry saved = pastryRepository.save(pastry);
        return pastryMapper.toPastryCreationResponse(saved);
    }

    @Transactional
    @Override
    public PastryUpdateResponse update(String id, PastryUpdateRequest request) {
        Pastry pastry = pastryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pastry not found"));

        // MapStruct update các field cơ bản
        pastryMapper.update(pastry, request);

        // Nếu có categoryId mới -> đổi category
        if (request.getCategoryId() != null && !request.getCategoryId().isBlank()) {
            PastryCategory category = pastryCategoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            pastry.setCategory(category);
        }

        // Nếu status có gửi lên thì cập nhật
        if (request.getStatus() != null) {
            pastry.setStatus(request.getStatus());
        }

        // Nếu stockQuantity có gửi lên thì cập nhật, chặn số âm
        if (request.getStockQuantity() != null) {
            int sq = request.getStockQuantity();
            pastry.setStockQuantity(Math.max(sq, 0));
        }

        Pastry updated = pastryRepository.save(pastry);
        return pastryMapper.toPastryUpdateResponse(updated);
    }

    /**
     * Soft delete: không xóa cứng.
     * Chuyển status về DISCONTINUED.
     */
    @Transactional
    @Override
    public boolean delete(String id) {
        Pastry pastry = pastryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pastry not found"));

        pastry.setStatus(PastryStatus.DISCONTINUED);
        pastryRepository.save(pastry);
        return true;
    }

    @Override
    public List<PastryCreationResponse> findByCategory(String categoryId) {
        if (categoryId == null || categoryId.isBlank()) {
            return findAll();
        }

        // Lấy theo category rồi filter theo status + isActive
        return pastryRepository.findAllByCategory_Id(categoryId)
                .stream()
                .filter(p -> p.getStatus() == PastryStatus.ACTIVE
                        && p.getCategory() != null
                        && p.getCategory().isActive())
                .map(pastryMapper::toPastryCreationResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PastryCreationResponse> search(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return findAll();
        }
        String q = keyword.trim();

        // --- ĐÃ SỬA LỖI TẠI ĐÂY ---
        // Truyền thêm PastryStatus.ACTIVE vào đầu để khớp với Repository
        return pastryRepository.searchAvailablePastries(PastryStatus.ACTIVE, q)
                .stream()
                .map(pastryMapper::toPastryCreationResponse)
                .collect(Collectors.toList());
    }
}