package iuh.fit.se.services.impl;

import iuh.fit.se.dtos.ChiTietDonHangDTO;
import iuh.fit.se.entities.ChiTietDonHang;
import iuh.fit.se.exceptions.ItemNotFoundException;
import iuh.fit.se.exceptions.ValidationException;
import iuh.fit.se.repositories.ChiTietDonHangRepository;
import iuh.fit.se.services.ChiTietDonHangService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.modelmapper.ModelMapper;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChiTietDonHangServiceImpl implements ChiTietDonHangService {

    private final ChiTietDonHangRepository chiTietDonHangRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public ChiTietDonHangServiceImpl(ChiTietDonHangRepository chiTietDonHangRepository, ModelMapper modelMapper) {
        this.chiTietDonHangRepository = chiTietDonHangRepository;
        this.modelMapper = modelMapper;
    }

    private ChiTietDonHangDTO convertToDTO(ChiTietDonHang entity) {
        return modelMapper.map(entity, ChiTietDonHangDTO.class);
    }

    @Override
    public ChiTietDonHangDTO findById(String id) {
        ChiTietDonHang ct = chiTietDonHangRepository.findById(id)
                .orElseThrow(() -> new ItemNotFoundException("Không tìm thấy chi tiết đơn hàng với id: " + id));
        return convertToDTO(ct);
    }

    @Override
    public List<ChiTietDonHangDTO> findAll() {
        return chiTietDonHangRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public Page<ChiTietDonHangDTO> findAllWithPaging(@ParameterObject Pageable pageable) {
        return chiTietDonHangRepository.findAll(pageable).map(this::convertToDTO);
    }

    @Transactional
    @Override
    public ChiTietDonHangDTO save(ChiTietDonHang chiTietDonHang) {
        validate(chiTietDonHang);
        chiTietDonHangRepository.save(chiTietDonHang);
        return convertToDTO(chiTietDonHang);
    }

    @Transactional
    @Override
    public ChiTietDonHangDTO update(String id, ChiTietDonHang chiTietDonHang) {
        findById(id);
        validate(chiTietDonHang);
        chiTietDonHang.setId(id);
        chiTietDonHangRepository.save(chiTietDonHang);
        return convertToDTO(chiTietDonHang);
    }

    @Override
    public boolean delete(String id) {
        ChiTietDonHangDTO dto = findById(id);
        chiTietDonHangRepository.deleteById(dto.getId());
        return true;
    }

    @Override
    public List<ChiTietDonHangDTO> search(String keyword) {
        String kw = keyword == null ? "" : keyword.toLowerCase();
        return chiTietDonHangRepository.findAll().stream()
                .filter(ct -> (ct.getBanhNgot() != null && ct.getBanhNgot().getTenBanh() != null
                        && ct.getBanhNgot().getTenBanh().toLowerCase().contains(kw))
                        || (ct.getDonHang() != null && ct.getDonHang().getId() != null
                                && ct.getDonHang().getId().toLowerCase().contains(kw)))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private void validate(ChiTietDonHang ct) {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        Set<ConstraintViolation<ChiTietDonHang>> violations = validator.validate(ct);

        if (!violations.isEmpty()) {
            Map<String, Object> errors = new LinkedHashMap<>();
            violations.forEach(v -> errors.put(v.getPropertyPath().toString(), v.getMessage()));
            throw new ValidationException("Lỗi khi xử lý chi tiết đơn hàng", errors);
        }
    }
}
