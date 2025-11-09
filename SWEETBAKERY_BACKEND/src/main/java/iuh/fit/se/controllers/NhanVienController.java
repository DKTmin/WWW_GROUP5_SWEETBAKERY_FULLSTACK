package iuh.fit.se.controllers;

import iuh.fit.se.dtos.NhanVienDTO;
import iuh.fit.se.entities.NhanVien;
import iuh.fit.se.services.NhanVienService;
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
@RequestMapping("/api/nhanvien")
public class NhanVienController {

    @Autowired
    private NhanVienService nhanVienService;

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable String id) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", HttpStatus.OK.value());
        response.put("data", nhanVienService.findById(id));
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> save(@RequestBody NhanVien nhanVien) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", HttpStatus.CREATED.value());
        response.put("data", nhanVienService.save(nhanVien));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable String id, @RequestBody NhanVien nhanVien) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", HttpStatus.OK.value());
        response.put("data", nhanVienService.update(id, nhanVien));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable String id) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", HttpStatus.OK.value());
        response.put("data", nhanVienService.delete(id));
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll(@RequestParam(required = false) String keyword) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", HttpStatus.OK.value());
        if (keyword == null || keyword.isEmpty()) {
            response.put("data", nhanVienService.findAll());
        } else {
            response.put("data", nhanVienService.search(keyword));
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/paging")
    public ResponseEntity<Page<NhanVienDTO>> getAllWithPaging(@ParameterObject Pageable pageable) {
        Page<NhanVienDTO> response = nhanVienService.findAllWithPaging(pageable);
        return ResponseEntity.ok(response);
    }
}
