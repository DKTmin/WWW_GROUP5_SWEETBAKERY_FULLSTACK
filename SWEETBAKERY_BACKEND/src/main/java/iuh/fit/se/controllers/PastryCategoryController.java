package iuh.fit.se.controllers;

import iuh.fit.se.dtos.request.PastryCategoryCreationRequest;
import iuh.fit.se.dtos.request.PastryCategoryUpdateRequest;
import iuh.fit.se.dtos.response.ApiResponse;
import iuh.fit.se.dtos.response.PastryCategoryCreationResponse;
import iuh.fit.se.dtos.response.PastryCategoryUpdateResponse;
import iuh.fit.se.entities.enums.HttpCode;
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

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RestController
@RequestMapping("category-management/api/v1/categories")
@RequiredArgsConstructor
public class PastryCategoryController {
    PastryCategoryService categoryService;

    @GetMapping("/{id}")
    public ApiResponse<PastryCategoryCreationResponse> getById(@PathVariable String id){
        return ApiResponse.<PastryCategoryCreationResponse>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(categoryService.findById(id))
                .build();
    }

    @PostMapping
    public ApiResponse<PastryCategoryCreationResponse> save(
            @RequestBody PastryCategoryCreationRequest request) {

        return ApiResponse.<PastryCategoryCreationResponse>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(categoryService.save(request))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<PastryCategoryUpdateResponse> update(
            @PathVariable String id,
            @RequestBody PastryCategoryUpdateRequest request) {

        return ApiResponse.<PastryCategoryUpdateResponse>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(categoryService.update(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> delete(@PathVariable String id) {
        return ApiResponse.builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(categoryService.delete(id))
                .build();
    }

    @GetMapping
    public ApiResponse<List<PastryCategory>> getAll() {
        return ApiResponse.<List<PastryCategory>>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(categoryService.findAll())
                .build();
    }
}
