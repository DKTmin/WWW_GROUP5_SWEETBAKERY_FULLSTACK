package iuh.fit.se.controllers.admin;

import iuh.fit.se.dtos.request.PastryCreationRequest;
import iuh.fit.se.dtos.request.PastryUpdateRequest;
import iuh.fit.se.dtos.response.ApiResponse;
import iuh.fit.se.dtos.response.PastryCreationResponse;
import iuh.fit.se.dtos.response.PastryUpdateResponse;
import iuh.fit.se.entities.enums.HttpCode;
import iuh.fit.se.services.admin.PastryAdminService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@RestController
@RequestMapping("/admin/api/v1/pastries")
public class PastryAdminController {

    PastryAdminService pastryAdminService;

    @GetMapping("/{id}")
    public ApiResponse<PastryCreationResponse> getById(@PathVariable String id) {
        return ApiResponse.<PastryCreationResponse>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(pastryAdminService.findById(id))
                .build();
    }

    @PostMapping
    public ApiResponse<PastryCreationResponse> save(@RequestBody PastryCreationRequest request) {
        return ApiResponse.<PastryCreationResponse>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(pastryAdminService.save(request))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<PastryUpdateResponse> update(
            @PathVariable String id,
            @RequestBody PastryUpdateRequest request
    ) {
        return ApiResponse.<PastryUpdateResponse>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(pastryAdminService.update(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> delete(@PathVariable String id) {
        return ApiResponse.builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(pastryAdminService.delete(id))
                .build();
    }

    @GetMapping
    public ApiResponse<List<PastryCreationResponse>> getAll(
            @RequestParam(name = "category", required = false) String category
    ) {
        List<PastryCreationResponse> data =
                (category == null || category.isBlank())
                        ? pastryAdminService.findAll()
                        : pastryAdminService.findByCategory(category);

        return ApiResponse.<List<PastryCreationResponse>>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(data)
                .build();
    }

    @GetMapping("/search")
    public ApiResponse<List<PastryCreationResponse>> search(
            @RequestParam("keyword") String keyword
    ) {
        return ApiResponse.<List<PastryCreationResponse>>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(pastryAdminService.search(keyword))
                .build();
    }
}
