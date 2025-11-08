package iuh.fit.se.services.impl;

import iuh.fit.se.dtos.TaiKhoanDTO;
import iuh.fit.se.entities.TaiKhoan;
import iuh.fit.se.exceptions.ItemNotFoundException;
import iuh.fit.se.exceptions.ValidationException;
import iuh.fit.se.repositories.TaiKhoanRepository;
import iuh.fit.se.services.TaiKhoanService;
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
public class TaiKhoanServiceImpl implements TaiKhoanService {
    private final TaiKhoanRepository taiKhoanRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public TaiKhoanServiceImpl(TaiKhoanRepository taiKhoanRepository, ModelMapper modelMapper) {
        this.taiKhoanRepository = taiKhoanRepository;
        this.modelMapper = modelMapper;
    }

    private TaiKhoanDTO convertToDTO(TaiKhoan entity) {
        return modelMapper.map(entity, TaiKhoanDTO.class);
    }

    @Override
    public TaiKhoanDTO findById(String id) {
        TaiKhoan tk = taiKhoanRepository.findById(id)
                .orElseThrow(() -> new ItemNotFoundException("Không tìm thấy tài khoản với id: " + id));
        return convertToDTO(tk);
    }

    @Override
    public List<TaiKhoanDTO> findAll() {
        return taiKhoanRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Page<TaiKhoanDTO> findAllWithPaging(@ParameterObject Pageable pageable) {
        return taiKhoanRepository.findAll(pageable).map(this::convertToDTO);
    }

    @Transactional
    @Override
    public TaiKhoanDTO save(TaiKhoan taiKhoan) {
        validate(taiKhoan);
        taiKhoanRepository.save(taiKhoan);
        return convertToDTO(taiKhoan);
    }

    @Transactional
    @Override
    public TaiKhoanDTO update(String id, TaiKhoan taiKhoan) {
        findById(id);
        validate(taiKhoan);
        taiKhoan.setId(id);
        taiKhoanRepository.save(taiKhoan);
        return convertToDTO(taiKhoan);
    }

    @Override
    public boolean delete(String id) {
        TaiKhoanDTO dto = findById(id);
        taiKhoanRepository.deleteById(dto.getId());
        return true;
    }

    @Override
    public List<TaiKhoanDTO> search(String keyword) {
        return taiKhoanRepository.findAll().stream()
                .filter(t -> t.getUser().toLowerCase().contains(keyword.toLowerCase()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private void validate(TaiKhoan taiKhoan) {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        Set<ConstraintViolation<TaiKhoan>> violations = validator.validate(taiKhoan);

        if (!violations.isEmpty()) {
            Map<String, Object> errors = new LinkedHashMap<>();
            violations.forEach(v -> errors.put(v.getPropertyPath().toString(), v.getMessage()));
            throw new ValidationException("Lỗi khi xử lý tài khoản", errors);
        }
    }
}
