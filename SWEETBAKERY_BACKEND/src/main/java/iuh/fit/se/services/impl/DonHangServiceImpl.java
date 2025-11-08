package iuh.fit.se.services.impl;

import iuh.fit.se.dtos.DonHangDTO;
import iuh.fit.se.entities.DonHang;
import iuh.fit.se.exceptions.ItemNotFoundException;
import iuh.fit.se.exceptions.ValidationException;
import iuh.fit.se.repositories.DonHangRepository;
import iuh.fit.se.services.DonHangService;
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
public class DonHangServiceImpl implements DonHangService {

    private final DonHangRepository donHangRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public DonHangServiceImpl(DonHangRepository donHangRepository, ModelMapper modelMapper) {
        this.donHangRepository = donHangRepository;
        this.modelMapper = modelMapper;
    }

    private DonHangDTO convertToDTO(DonHang entity) {
        return modelMapper.map(entity, DonHangDTO.class);
    }

    @Override
    public DonHangDTO findById(String id) {
        DonHang dh = donHangRepository.findById(id)
                .orElseThrow(() -> new ItemNotFoundException("Không tìm thấy đơn hàng với id: " + id));
        return convertToDTO(dh);
    }

    @Override
    public List<DonHangDTO> findAll() {
        return donHangRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public Page<DonHangDTO> findAllWithPaging(@ParameterObject Pageable pageable) {
        return donHangRepository.findAll(pageable).map(this::convertToDTO);
    }

    @Transactional
    @Override
    public DonHangDTO save(DonHang donHang) {
        validate(donHang);
        donHangRepository.save(donHang);
        return convertToDTO(donHang);
    }

    @Transactional
    @Override
    public DonHangDTO update(String id, DonHang donHang) {
        findById(id);
        validate(donHang);
        donHang.setId(id);
        donHangRepository.save(donHang);
        return convertToDTO(donHang);
    }

    @Override
    public boolean delete(String id) {
        DonHangDTO dto = findById(id);
        donHangRepository.deleteById(dto.getId());
        return true;
    }

    @Override
    public List<DonHangDTO> search(String keyword) {
        String kw = keyword == null ? "" : keyword.toLowerCase();
        return donHangRepository.findAll().stream()
                .filter(d -> (d.getKhachHang() != null && d.getKhachHang().getTen() != null
                        && d.getKhachHang().getTen().toLowerCase().contains(kw))
                        || (d.getNhanVien() != null && d.getNhanVien().getTen() != null
                                && d.getNhanVien().getTen().toLowerCase().contains(kw)))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private void validate(DonHang dh) {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        Set<ConstraintViolation<DonHang>> violations = validator.validate(dh);

        if (!violations.isEmpty()) {
            Map<String, Object> errors = new LinkedHashMap<>();
            violations.forEach(v -> errors.put(v.getPropertyPath().toString(), v.getMessage()));
            throw new ValidationException("Lỗi khi xử lý đơn hàng", errors);
        }
    }
}
