package iuh.fit.se.controllers.admin;

import iuh.fit.se.dtos.request.PastryCategoryCreationRequest;
import iuh.fit.se.dtos.request.PastryCategoryUpdateRequest;
import iuh.fit.se.dtos.response.ApiResponse;
import iuh.fit.se.dtos.response.PastryCategoryCreationResponse;
import iuh.fit.se.dtos.response.PastryCategoryUpdateResponse;
import iuh.fit.se.entities.PastryCategory;
import iuh.fit.se.entities.enums.HttpCode;
import iuh.fit.se.services.PastryCategoryService;
import iuh.fit.se.services.admin.PastryCategoryAdminService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RestController
@RequestMapping("/admin/api/v1/categories")
@RequiredArgsConstructor
public class PastryCategoryAdminController {

    PastryCategoryAdminService categoryService;

    @GetMapping("/{id}")
    public ApiResponse<PastryCategoryCreationResponse> getById(@PathVariable String id) {
        return ApiResponse.<PastryCategoryCreationResponse>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(categoryService.findById(id))
                .build();
    }

    @PostMapping
    public ApiResponse<PastryCategoryCreationResponse> save(
            @RequestBody PastryCategoryCreationRequest request
    ) {
        return ApiResponse.<PastryCategoryCreationResponse>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(categoryService.save(request))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<PastryCategoryUpdateResponse> update(
            @PathVariable String id,
            @RequestBody PastryCategoryUpdateRequest request
    ) {
        return ApiResponse.<PastryCategoryUpdateResponse>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(categoryService.update(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> delete(@PathVariable String id) {
        boolean deleted = categoryService.delete(id);

        if (!deleted) {
            return ApiResponse.builder()
                    .code(HttpCode.BAD_REQUEST.getCODE())
                    .message("Không thể ẩn danh mục vì đang có bánh trong danh mục này.")
                    .data(false)
                    .build();
        }

        return ApiResponse.builder()
                .code(HttpCode.OK.getCODE())
                .message("Ẩn danh mục thành công.")
                .data(true)
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
