package iuh.fit.se.controllers;

import iuh.fit.se.dtos.ChiTietDonHangDTO;
import iuh.fit.se.entities.ChiTietDonHang;
import iuh.fit.se.services.ChiTietDonHangService;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/chitietdonhang")
public class ChiTietDonHangController {

    @Autowired
    private ChiTietDonHangService chiTietDonHangService;

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable String id) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", HttpStatus.OK.value());
        response.put("data", chiTietDonHangService.findById(id));
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> save(@RequestBody ChiTietDonHang chiTietDonHang) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", HttpStatus.CREATED.value());
        response.put("data", chiTietDonHangService.save(chiTietDonHang));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable String id,
            @RequestBody ChiTietDonHang chiTietDonHang) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", HttpStatus.OK.value());
        response.put("data", chiTietDonHangService.update(id, chiTietDonHang));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable String id) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", HttpStatus.OK.value());
        response.put("data", chiTietDonHangService.delete(id));
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll(@RequestParam(required = false) String keyword) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", HttpStatus.OK.value());
        if (keyword == null || keyword.isEmpty()) {
            response.put("data", chiTietDonHangService.findAll());
        } else {
            response.put("data", chiTietDonHangService.search(keyword));
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/paging")
    public ResponseEntity<Page<ChiTietDonHangDTO>> getAllWithPaging(@ParameterObject Pageable pageable) {
        Page<ChiTietDonHangDTO> response = chiTietDonHangService.findAllWithPaging(pageable);
        return ResponseEntity.ok(response);
    }
}
