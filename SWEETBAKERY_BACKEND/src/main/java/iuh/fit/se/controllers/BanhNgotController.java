package iuh.fit.se.controllers;

import iuh.fit.se.dtos.BanhNgotDTO;
import iuh.fit.se.dtos.request.BanhNgotCreationRequest;
import iuh.fit.se.dtos.request.BanhNgotUpdateRequest;
import iuh.fit.se.dtos.response.ApiResponse;
import iuh.fit.se.dtos.response.BanhNgotCreationResponse;
import iuh.fit.se.dtos.response.BanhNgotUpdateResponse;
import iuh.fit.se.entities.BanhNgot;
import iuh.fit.se.entities.enums.HttpCode;
import iuh.fit.se.services.BanhNgotService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@RestController
@RequestMapping("pastry-management/api/v1/pastries")
public class BanhNgotController {
    BanhNgotService banhNgotService;
    @GetMapping("/{id}")
    public ApiResponse<BanhNgotCreationResponse> getById(@PathVariable String id) {
        return ApiResponse.<BanhNgotCreationResponse>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(banhNgotService.findById(id))
                .build();
    }
    @PostMapping
    public ApiResponse<BanhNgotCreationResponse> save(@RequestBody BanhNgotCreationRequest request) {
        return ApiResponse.<BanhNgotCreationResponse>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(banhNgotService.save(request))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<BanhNgotUpdateResponse> update(@PathVariable String id, @RequestBody BanhNgotUpdateRequest request) {
        return ApiResponse.<BanhNgotUpdateResponse>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(banhNgotService.update(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> delete(@PathVariable String id) {
        return ApiResponse.builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(banhNgotService.delete(id))
                .build();
    }

    @GetMapping
    public ApiResponse<List<BanhNgotCreationResponse>> getAll(@RequestParam(required = false) String keyword) {
        return ApiResponse.<List<BanhNgotCreationResponse>>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(banhNgotService.findAll())
                .build();
    }

    @GetMapping("/paging")
    public ResponseEntity<Page<BanhNgotDTO>> getAllWithPaging(@ParameterObject Pageable pageable) {
        Page<BanhNgotDTO> response = banhNgotService.findAllWithPaging(pageable);
        return ResponseEntity.ok(response);
    }
}
