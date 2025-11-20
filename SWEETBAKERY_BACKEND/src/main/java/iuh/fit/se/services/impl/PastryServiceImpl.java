package iuh.fit.se.services.impl;

import iuh.fit.se.dtos.request.PastryCreationRequest;
import iuh.fit.se.dtos.request.PastryUpdateRequest;
import iuh.fit.se.dtos.response.PastryCreationResponse;
import iuh.fit.se.dtos.response.PastryUpdateResponse;
import iuh.fit.se.entities.Pastry;
import iuh.fit.se.exceptions.ValidationException;
import iuh.fit.se.mapper.PastryMapper;
import iuh.fit.se.repositories.PastryRepository;
import iuh.fit.se.services.PastryService;
import jakarta.validation.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Service
public class PastryServiceImpl implements PastryService {
    PastryRepository pastryRepository;
    PastryMapper pastryMapper;
    ModelMapper modelMapper;
//    private BanhNgotDTO convertToDTO(Pastry entity) {
//        return modelMapper.map(entity, BanhNgotDTO.class);
//    }

    @Override
    public PastryCreationResponse findById(String id) {
        Pastry pastry = pastryRepository.findById(id).orElse(null);
        if(pastry == null)
            throw new NullPointerException("Banh ngot not found!");
        return pastryMapper.toBanhNgotCreationResponse(pastry);
    }

    @Override
    public List<PastryCreationResponse> findAll() {
        return pastryRepository.findAll()
                .stream()
                .map(pastryMapper::toBanhNgotCreationResponse)
                .collect(Collectors.toList());
    }

//    @Override
//    public Page<BanhNgotDTO> findAllWithPaging(Pageable pageable) {
//        return null;
//    }

//    @Override
//    public Page<BanhNgotDTO> findAllWithPaging(@ParameterObject Pageable pageable) {
//        return banhNgotRepository.findAll(pageable).map(this::convertToDTO);
//    }

    @Transactional
    @Override
    public PastryCreationResponse save(PastryCreationRequest request) {
        Pastry pastry = pastryMapper.toBanhNgot(request);
        return pastryMapper.toBanhNgotCreationResponse(pastryRepository.save(pastry));
    }
    @Transactional
    @Override
    public PastryUpdateResponse update(String id, PastryUpdateRequest request) {
        Pastry pastry = pastryRepository.findById(id).orElse(null);
        if(pastry == null)
            throw new NullPointerException("Banh ngot not found!");
        pastryMapper.update(pastry, request);
        return pastryMapper.toBanhNgotUpdateResponse(pastryRepository.save(pastry));
    }

    @Override
    public boolean delete(String id) {
        Pastry pastry = pastryRepository.findById(id).orElse(null);
        if(pastry == null)
            throw new NullPointerException("Banh ngot not found!");
        try {
            pastryRepository.delete(pastry);
            return true;
        }catch (Exception e){
            return false;
        }
    }

//    @Override
//    public List<BanhNgotDTO> search(String keyword) {
//        return null;
//    }

//    @Override
//    public List<BanhNgotDTO> search(String keyword) {
//        return banhNgotRepository.findAll().stream()
//                .filter(b -> b.getTenBanh().toLowerCase().contains(keyword.toLowerCase()))
//                .map(this::convertToDTO)
//                .collect(Collectors.toList());
//    }

    private void validate(Pastry bn) {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        Set<ConstraintViolation<Pastry>> violations = validator.validate(bn);

        if (!violations.isEmpty()) {
            Map<String, Object> errors = new LinkedHashMap<>();
            violations.forEach(v -> errors.put(v.getPropertyPath().toString(), v.getMessage()));
            throw new ValidationException("Lỗi khi xử lý bánh ngọt", errors);
        }
    }
}
