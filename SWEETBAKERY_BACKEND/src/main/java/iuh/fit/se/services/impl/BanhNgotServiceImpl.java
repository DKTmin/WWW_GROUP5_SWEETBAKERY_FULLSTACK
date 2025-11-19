package iuh.fit.se.services.impl;

import iuh.fit.se.dtos.BanhNgotDTO;
import iuh.fit.se.dtos.request.BanhNgotCreationRequest;
import iuh.fit.se.dtos.request.BanhNgotUpdateRequest;
import iuh.fit.se.dtos.response.BanhNgotCreationResponse;
import iuh.fit.se.dtos.response.BanhNgotUpdateResponse;
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
    public BanhNgotCreationResponse findById(String id) {
        BanhNgot banhNgot = banhNgotRepository.findById(id).orElse(null);
        if(banhNgot == null)
            throw new NullPointerException("Banh ngot not found!");
        return banhNgotMapper.toBanhNgotCreationResponse(banhNgot);
    }

    @Override
    public List<BanhNgotCreationResponse> findAll() {
        return banhNgotRepository.findAll()
                .stream()
                .map(banhNgotMapper::toBanhNgotCreationResponse)
                .collect(Collectors.toList());
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
    public BanhNgotUpdateResponse update(String id, BanhNgotUpdateRequest request) {
        BanhNgot banhNgot = banhNgotRepository.findById(id).orElse(null);
        if(banhNgot == null)
            throw new NullPointerException("Banh ngot not found!");
        banhNgotMapper.update(banhNgot, request);
        return banhNgotMapper.toBanhNgotUpdateResponse(banhNgotRepository.save(banhNgot));
    }

    @Override
    public boolean delete(String id) {
        BanhNgot banhNgot = banhNgotRepository.findById(id).orElse(null);
        if(banhNgot == null)
            throw new NullPointerException("Banh ngot not found!");
        try {
            banhNgotRepository.delete(banhNgot);
            return true;
        }catch (Exception e){
            return false;
        }
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
