package  iuh.fit.se.services.impl;

import iuh.fit.se.dtos.KhachHangDTO;
import iuh.fit.se.entities.KhachHang;
import iuh.fit.se.exceptions.ItemNotFoundException;
import iuh.fit.se.exceptions.ValidationException;
import iuh.fit.se.repositories.KhachHangRepository;
import iuh.fit.se.services.KhachHangService;
import jakarta.validation.*;
import org.modelmapper.ModelMapper;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class KhachHangServiceImpl implements KhachHangService {
    private final KhachHangRepository khachHangRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public KhachHangServiceImpl(KhachHangRepository khachHangRepository, ModelMapper modelMapper) {
        this.khachHangRepository = khachHangRepository;
        this.modelMapper = modelMapper;
    }

    private KhachHangDTO convertToDTO(KhachHang entity) {
        return modelMapper.map(entity, KhachHangDTO.class);
    }

    @Override
    public KhachHangDTO findById(String id) {
        KhachHang kh = khachHangRepository.findById(id)
                .orElseThrow(() -> new ItemNotFoundException("Không tìm thấy khách hàng với id: " + id));
        return convertToDTO(kh);
    }

    @Override
    public List<KhachHangDTO> findAll() {
        return khachHangRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public Page<KhachHangDTO> findAllWithPaging(@ParameterObject Pageable pageable) {
        return khachHangRepository.findAll(pageable).map(this::convertToDTO);
    }

    @Transactional
    @Override
    public KhachHangDTO save(KhachHang khachHang) {
        validate(khachHang);
        khachHangRepository.save(khachHang);
        return convertToDTO(khachHang);
    }

    @Transactional
    @Override
    public KhachHangDTO update(String id, KhachHang khachHang) {
        findById(id);
        validate(khachHang);
        khachHang.setId(id);
        khachHangRepository.save(khachHang);
        return convertToDTO(khachHang);
    }

    @Override
    public boolean delete(String id) {
        KhachHangDTO dto = findById(id);
        khachHangRepository.deleteById(dto.getId());
        return true;
    }

    @Override
    public List<KhachHangDTO> search(String keyword) {
        return khachHangRepository.findAll().stream()
                .filter(k -> k.getTen().toLowerCase().contains(keyword.toLowerCase()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private void validate(KhachHang kh) {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        Set<ConstraintViolation<KhachHang>> violations = validator.validate(kh);

        if (!violations.isEmpty()) {
            Map<String, Object> errors = new LinkedHashMap<>();
            violations.forEach(v -> errors.put(v.getPropertyPath().toString(), v.getMessage()));
            throw new ValidationException("Lỗi khi xử lý khách hàng", errors);
        }
    }
}
