package iuh.fit.se.controllers;

import iuh.fit.se.dtos.KhachHangDTO;
import iuh.fit.se.entities.KhachHang;
import iuh.fit.se.services.KhachHangService;
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
@RequestMapping("/api/khachhang")
public class KhachHangController {

    @Autowired
    private KhachHangService khachHangService;

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable String id) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", HttpStatus.OK.value());
        response.put("data", khachHangService.findById(id));
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> save(@RequestBody KhachHang khachHang) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", HttpStatus.CREATED.value());
        response.put("data", khachHangService.save(khachHang));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable String id, @RequestBody KhachHang khachHang) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", HttpStatus.OK.value());
        response.put("data", khachHangService.update(id, khachHang));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable String id) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", HttpStatus.OK.value());
        response.put("data", khachHangService.delete(id));
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll(@RequestParam(required = false) String keyword) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", HttpStatus.OK.value());
        if (keyword == null || keyword.isEmpty()) {
            response.put("data", khachHangService.findAll());
        } else {
            response.put("data", khachHangService.search(keyword));
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/paging")
    public ResponseEntity<Page<KhachHangDTO>> getAllWithPaging(@ParameterObject Pageable pageable) {
        Page<KhachHangDTO> response = khachHangService.findAllWithPaging(pageable);
        return ResponseEntity.ok(response);
    }
}
