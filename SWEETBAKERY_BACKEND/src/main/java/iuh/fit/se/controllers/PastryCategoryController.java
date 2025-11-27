package iuh.fit.se.controllers;

import iuh.fit.se.dtos.response.ApiResponse;
import iuh.fit.se.entities.PastryCategory;
import iuh.fit.se.entities.enums.HttpCode;
import iuh.fit.se.repositories.PastryCategoryRepository;
import iuh.fit.se.services.PastryCategoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("pastry-management/api/v1/pastry-categories")
public class PastryCategoryController {

    PastryCategoryService pastryCategoryService;

    @GetMapping
    public ApiResponse<List<PastryCategory>> getAll() {
        return ApiResponse.<List<PastryCategory>>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(pastryCategoryService.findAll())
                .build();
    }
}
