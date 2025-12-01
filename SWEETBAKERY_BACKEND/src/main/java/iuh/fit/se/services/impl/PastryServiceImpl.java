package iuh.fit.se.services.impl;

import iuh.fit.se.dtos.request.PastryCreationRequest;
import iuh.fit.se.dtos.request.PastryUpdateRequest;
import iuh.fit.se.dtos.response.PastryCreationResponse;
import iuh.fit.se.dtos.response.PastryUpdateResponse;
import iuh.fit.se.entities.Pastry;
import iuh.fit.se.entities.PastryCategory;
import iuh.fit.se.mapper.PastryMapper;
import iuh.fit.se.repositories.PastryCategoryRepository;
import iuh.fit.se.repositories.PastryRepository;
import iuh.fit.se.services.PastryService;
import jakarta.validation.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Method;
import java.util.*;
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
    PastryCategoryRepository pastryCategoryRepository; // new: used to resolve categories

    @Override
    public PastryCreationResponse findById(String id) {
        Pastry pastry = pastryRepository.findById(id).orElse(null);
        if (pastry == null)
            throw new NullPointerException("Banh ngot not found!");
        return pastryMapper.toPastryCreationResponse(pastry);
    }

    @Override
    public List<PastryCreationResponse> findAll() {
        return pastryRepository.findAll()
                .stream()
                .map(pastryMapper::toPastryCreationResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public PastryCreationResponse save(PastryCreationRequest request) {
        // convert request -> entity (mapper ignores id & category based on your mapper)
        Pastry pastry = pastryMapper.toPastry(request);

        // if client supplied categoryId in request, try to set category entity
        if (request != null) {
            try {
                Method m = request.getClass().getMethod("getCategoryId");
                Object cidObj = m.invoke(request);
                if (cidObj instanceof String) {
                    String cid = (String) cidObj;
                    if (cid != null && !cid.isBlank()) {
                        pastryCategoryRepository.findById(cid).ifPresent(pastry::setCategory);
                        // If you prefer to set category by id even if not exists, you could create new PastryCategory with id only.
                    }
                }
            } catch (NoSuchMethodException nsme) {
                // request DTO doesn't have categoryId -> ignore
            } catch (Exception ex) {
                // ignore reflection or repository exceptions here (don't fail save just because category wasn't set)
                ex.printStackTrace();
            }
        }

        Pastry saved = pastryRepository.save(pastry);
        return pastryMapper.toPastryCreationResponse(saved);
    }

    @Transactional
    @Override
    public PastryUpdateResponse update(String id, PastryUpdateRequest request) {
        Pastry pastry = pastryRepository.findById(id).orElse(null);
        if (pastry == null)
            throw new NullPointerException("Banh ngot not found!");

        // use mapper to update fields (mapper configured to ignore category)
        pastryMapper.update(pastry, request);

        // Try to set category if update request contains categoryId
        if (request != null) {
            try {
                Method m = request.getClass().getMethod("getCategoryId");
                Object cidObj = m.invoke(request);
                if (cidObj instanceof String) {
                    String cid = (String) cidObj;
                    if (cid != null && !cid.isBlank()) {
                        pastryCategoryRepository.findById(cid).ifPresent(pastry::setCategory);
                    }
                }
            } catch (NoSuchMethodException nsme) {
                // no categoryId field -> nothing to do
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }

        Pastry updated = pastryRepository.save(pastry);
        return pastryMapper.toPastryUpdateResponse(updated);
    }

    @Override
    public boolean delete(String id) {
        Pastry pastry = pastryRepository.findById(id).orElse(null);
        if (pastry == null)
            throw new NullPointerException("Banh ngot not found!");
        try {
            pastryRepository.delete(pastry);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public List<PastryCreationResponse> findByCategory(String categoryId) {
        if (categoryId == null || categoryId.isBlank()) {
            return findAll();
        }
        return pastryRepository.findAllByCategory_Id(categoryId)
                .stream()
                .map(pastryMapper::toPastryCreationResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PastryCreationResponse> search(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return findAll();
        }
        String q = keyword.trim();
        return pastryRepository
                .findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(q, q)
                .stream()
                .map(pastryMapper::toPastryCreationResponse)
                .collect(Collectors.toList());
    }
}
