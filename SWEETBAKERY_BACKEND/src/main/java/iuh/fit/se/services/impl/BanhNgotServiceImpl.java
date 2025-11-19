package iuh.fit.se.services.impl;

import iuh.fit.se.dtos.BanhNgotDTO;
import iuh.fit.se.dtos.request.BanhNgotCreationRequest;
import iuh.fit.se.dtos.response.BanhNgotCreationResponse;
import iuh.fit.se.entities.BanhNgot;
import iuh.fit.se.exceptions.ItemNotFoundException;
import iuh.fit.se.exceptions.ValidationException;
import iuh.fit.se.mapper.BanhNgotMapper;
import iuh.fit.se.repositories.BanhNgotRepository;
import iuh.fit.se.services.BanhNgotService;
import jakarta.validation.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.modelmapper.ModelMapper;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Service
public class BanhNgotServiceImpl implements BanhNgotService {
    BanhNgotRepository banhNgotRepository;
    BanhNgotMapper banhNgotMapper;
    ModelMapper modelMapper;
    private BanhNgotDTO convertToDTO(BanhNgot entity) {
        return modelMapper.map(entity, BanhNgotDTO.class);
    }

    @Override
    public BanhNgotDTO findById(String id) {
        BanhNgot bn = banhNgotRepository.findById(id)
                .orElseThrow(() -> new ItemNotFoundException("Không tìm thấy bánh ngọt với id: " + id));
        return convertToDTO(bn);
    }

    @Override
    public List<BanhNgotDTO> findAll() {
        return banhNgotRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public Page<BanhNgotDTO> findAllWithPaging(@ParameterObject Pageable pageable) {
        return banhNgotRepository.findAll(pageable).map(this::convertToDTO);
    }

    @Transactional
    @Override
    public BanhNgotCreationResponse save(BanhNgotCreationRequest request) {
        BanhNgot banhNgot = banhNgotMapper.toBanhNgot(request);
        return banhNgotMapper.toBanhNgotCreationResponse(banhNgotRepository.save(banhNgot));
    }

    @Transactional
    @Override
    public BanhNgotDTO update(String id, BanhNgot banhNgot) {
        findById(id);
        validate(banhNgot);
        banhNgot.setId(id);
        banhNgotRepository.save(banhNgot);
        return convertToDTO(banhNgot);
    }

    @Override
    public boolean delete(String id) {
        BanhNgotDTO dto = findById(id);
        banhNgotRepository.deleteById(dto.getId());
        return true;
    }

    @Override
    public List<BanhNgotDTO> search(String keyword) {
        return banhNgotRepository.findAll().stream()
                .filter(b -> b.getTenBanh().toLowerCase().contains(keyword.toLowerCase()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private void validate(BanhNgot bn) {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        Set<ConstraintViolation<BanhNgot>> violations = validator.validate(bn);

        if (!violations.isEmpty()) {
            Map<String, Object> errors = new LinkedHashMap<>();
            violations.forEach(v -> errors.put(v.getPropertyPath().toString(), v.getMessage()));
            throw new ValidationException("Lỗi khi xử lý bánh ngọt", errors);
        }
    }
}
