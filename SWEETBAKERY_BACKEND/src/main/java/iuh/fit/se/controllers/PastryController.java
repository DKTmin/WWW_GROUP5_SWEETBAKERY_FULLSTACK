package iuh.fit.se.controllers;

import iuh.fit.se.dtos.request.PastryCreationRequest;
import iuh.fit.se.dtos.request.PastryUpdateRequest;
import iuh.fit.se.dtos.response.ApiResponse;
import iuh.fit.se.dtos.response.PastryCreationResponse;
import iuh.fit.se.dtos.response.PastryUpdateResponse;
import iuh.fit.se.entities.enums.HttpCode;
import iuh.fit.se.services.PastryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@RestController
@RequestMapping("pastry-management/api/v1/pastries")
public class PastryController {
    PastryService pastryService;
    @GetMapping("/{id}")
    public ApiResponse<PastryCreationResponse> getById(@PathVariable String id) {
        return ApiResponse.<PastryCreationResponse>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(pastryService.findById(id))
                .build();
    }
    @PostMapping
    public ApiResponse<PastryCreationResponse> save(@RequestBody PastryCreationRequest request) {
        return ApiResponse.<PastryCreationResponse>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(pastryService.save(request))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<PastryUpdateResponse> update(@PathVariable String id, @RequestBody PastryUpdateRequest request) {
        return ApiResponse.<PastryUpdateResponse>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(pastryService.update(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> delete(@PathVariable String id) {
        return ApiResponse.builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(pastryService.delete(id))
                .build();
    }

    @GetMapping
    public ApiResponse<List<PastryCreationResponse>> getAll(@RequestParam(name = "category", required = false) String category) {
        List<PastryCreationResponse> data;
        if (category == null || category.isBlank()) {
            data = pastryService.findAll();
        } else {
            data = pastryService.findByCategory(category);
        }

        return ApiResponse.<List<PastryCreationResponse>>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(data)
                .build();
    }

//    @GetMapping("/paging")
//    public ResponseEntity<Page<BanhNgotDTO>> getAllWithPaging(@ParameterObject Pageable pageable) {
//        Page<BanhNgotDTO> response = pastryService.findAllWithPaging(pageable);
//        return ResponseEntity.ok(response);
//    }
}
