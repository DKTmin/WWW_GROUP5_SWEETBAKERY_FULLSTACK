package iuh.fit.se.services.impl;

import iuh.fit.se.dtos.LoaiBanhDTO;
import iuh.fit.se.entities.LoaiBanh;
import iuh.fit.se.exceptions.ItemNotFoundException;
import iuh.fit.se.exceptions.ValidationException;
import iuh.fit.se.repositories.LoaiBanhRepository;
import iuh.fit.se.services.LoaiBanhService;
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
public class LoaiBanhServiceImpl implements LoaiBanhService {

    private final LoaiBanhRepository loaiBanhRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public LoaiBanhServiceImpl(LoaiBanhRepository loaiBanhRepository, ModelMapper modelMapper) {
        this.loaiBanhRepository = loaiBanhRepository;
        this.modelMapper = modelMapper;
    }

    private LoaiBanhDTO convertToDTO(LoaiBanh entity) {
        return modelMapper.map(entity, LoaiBanhDTO.class);
    }

    @Override
    public LoaiBanhDTO findById(String id) {
        LoaiBanh lb = loaiBanhRepository.findById(id)
                .orElseThrow(() -> new ItemNotFoundException("Không tìm thấy loại bánh với id: " + id));
        return convertToDTO(lb);
    }

    @Override
    public List<LoaiBanhDTO> findAll() {
        return loaiBanhRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public Page<LoaiBanhDTO> findAllWithPaging(@ParameterObject Pageable pageable) {
        return loaiBanhRepository.findAll(pageable).map(this::convertToDTO);
    }

    @Transactional
    @Override
    public LoaiBanhDTO save(LoaiBanh loaiBanh) {
        validate(loaiBanh);
        loaiBanhRepository.save(loaiBanh);
        return convertToDTO(loaiBanh);
    }

    @Transactional
    @Override
    public LoaiBanhDTO update(String id, LoaiBanh loaiBanh) {
        findById(id);
        validate(loaiBanh);
        loaiBanh.setId(id);
        loaiBanhRepository.save(loaiBanh);
        return convertToDTO(loaiBanh);
    }

    @Override
    public boolean delete(String id) {
        LoaiBanhDTO dto = findById(id);
        loaiBanhRepository.deleteById(dto.getId());
        return true;
    }

    @Override
    public List<LoaiBanhDTO> search(String keyword) {
        return loaiBanhRepository.findAll().stream()
                .filter(l -> l.getTenLoai() != null && l.getTenLoai().toLowerCase().contains(keyword.toLowerCase()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private void validate(LoaiBanh lb) {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        Set<ConstraintViolation<LoaiBanh>> violations = validator.validate(lb);

        if (!violations.isEmpty()) {
            Map<String, Object> errors = new LinkedHashMap<>();
            violations.forEach(v -> errors.put(v.getPropertyPath().toString(), v.getMessage()));
            throw new ValidationException("Lỗi khi xử lý loại bánh", errors);
        }
    }
}
