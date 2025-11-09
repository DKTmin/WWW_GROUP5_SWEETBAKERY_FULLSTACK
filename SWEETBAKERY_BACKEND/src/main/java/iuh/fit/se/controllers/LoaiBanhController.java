package iuh.fit.se.controllers;

import iuh.fit.se.dtos.LoaiBanhDTO;
import iuh.fit.se.entities.LoaiBanh;
import iuh.fit.se.services.LoaiBanhService;
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
@RequestMapping("/api/loaibanh")
public class LoaiBanhController {

    @Autowired
    private LoaiBanhService loaiBanhService;

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable String id) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", HttpStatus.OK.value());
        response.put("data", loaiBanhService.findById(id));
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> save(@RequestBody LoaiBanh loaiBanh) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", HttpStatus.CREATED.value());
        response.put("data", loaiBanhService.save(loaiBanh));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable String id, @RequestBody LoaiBanh loaiBanh) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", HttpStatus.OK.value());
        response.put("data", loaiBanhService.update(id, loaiBanh));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable String id) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", HttpStatus.OK.value());
        response.put("data", loaiBanhService.delete(id));
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll(@RequestParam(required = false) String keyword) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", HttpStatus.OK.value());
        if (keyword == null || keyword.isEmpty()) {
            response.put("data", loaiBanhService.findAll());
        } else {
            response.put("data", loaiBanhService.search(keyword));
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/paging")
    public ResponseEntity<Page<LoaiBanhDTO>> getAllWithPaging(@ParameterObject Pageable pageable) {
        Page<LoaiBanhDTO> response = loaiBanhService.findAllWithPaging(pageable);
        return ResponseEntity.ok(response);
    }
}
