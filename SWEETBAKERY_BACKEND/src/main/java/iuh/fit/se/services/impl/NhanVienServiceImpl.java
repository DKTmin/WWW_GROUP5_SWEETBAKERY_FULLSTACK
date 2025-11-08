package iuh.fit.se.services.impl;

import iuh.fit.se.dtos.NhanVienDTO;
import iuh.fit.se.entities.NhanVien;
import iuh.fit.se.exceptions.ItemNotFoundException;
import iuh.fit.se.exceptions.ValidationException;
import iuh.fit.se.repositories.NhanVienRepository;
import iuh.fit.se.services.NhanVienService;
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
public class NhanVienServiceImpl implements NhanVienService {

    private final NhanVienRepository nhanVienRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public NhanVienServiceImpl(NhanVienRepository nhanVienRepository, ModelMapper modelMapper) {
        this.nhanVienRepository = nhanVienRepository;
        this.modelMapper = modelMapper;
    }

    private NhanVienDTO convertToDTO(NhanVien entity) {
        return modelMapper.map(entity, NhanVienDTO.class);
    }

    @Override
    public NhanVienDTO findById(String id) {
        NhanVien nv = nhanVienRepository.findById(id)
                .orElseThrow(() -> new ItemNotFoundException("Không tìm thấy nhân viên với id: " + id));
        return convertToDTO(nv);
    }

    @Override
    public List<NhanVienDTO> findAll() {
        return nhanVienRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public Page<NhanVienDTO> findAllWithPaging(@ParameterObject Pageable pageable) {
        return nhanVienRepository.findAll(pageable).map(this::convertToDTO);
    }

    @Transactional
    @Override
    public NhanVienDTO save(NhanVien nhanVien) {
        validate(nhanVien);
        nhanVienRepository.save(nhanVien);
        return convertToDTO(nhanVien);
    }

    @Transactional
    @Override
    public NhanVienDTO update(String id, NhanVien nhanVien) {
        findById(id);
        validate(nhanVien);
        nhanVien.setId(id);
        nhanVienRepository.save(nhanVien);
        return convertToDTO(nhanVien);
    }

    @Override
    public boolean delete(String id) {
        NhanVienDTO dto = findById(id);
        nhanVienRepository.deleteById(dto.getId());
        return true;
    }

    @Override
    public List<NhanVienDTO> search(String keyword) {
        return nhanVienRepository.findAll().stream()
                .filter(n -> n.getTen().toLowerCase().contains(keyword.toLowerCase()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private void validate(NhanVien nv) {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        Set<ConstraintViolation<NhanVien>> violations = validator.validate(nv);

        if (!violations.isEmpty()) {
            Map<String, Object> errors = new LinkedHashMap<>();
            violations.forEach(v -> errors.put(v.getPropertyPath().toString(), v.getMessage()));
            throw new ValidationException("Lỗi khi xử lý nhân viên", errors);
        }
    }
}
