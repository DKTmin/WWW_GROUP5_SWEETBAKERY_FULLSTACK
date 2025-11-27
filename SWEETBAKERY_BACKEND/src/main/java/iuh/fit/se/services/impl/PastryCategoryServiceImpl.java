package iuh.fit.se.services.impl;

import iuh.fit.se.entities.PastryCategory;
import iuh.fit.se.repositories.PastryCategoryRepository;
import iuh.fit.se.services.PastryCategoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Service
public class PastryCategoryServiceImpl implements PastryCategoryService {
    PastryCategoryRepository categoryRepository;

    @Override
    public List<PastryCategory> findAll() {
        return categoryRepository.findAll();
    }
}
