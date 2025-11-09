package iuh.fit.se.controllers;

import iuh.fit.se.dtos.BanhNgotDTO;
import iuh.fit.se.entities.BanhNgot;
import iuh.fit.se.services.BanhNgotService;
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
@RequestMapping("/api/banhngot")
public class BanhNgotController {

    @Autowired
    private BanhNgotService banhNgotService;

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable String id) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", HttpStatus.OK.value());
        response.put("data", banhNgotService.findById(id));
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> save(@RequestBody BanhNgot banhNgot) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", HttpStatus.CREATED.value());
        response.put("data", banhNgotService.save(banhNgot));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable String id, @RequestBody BanhNgot banhNgot) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", HttpStatus.OK.value());
        response.put("data", banhNgotService.update(id, banhNgot));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable String id) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", HttpStatus.OK.value());
        response.put("data", banhNgotService.delete(id));
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll(@RequestParam(required = false) String keyword) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", HttpStatus.OK.value());
        if (keyword == null || keyword.isEmpty()) {
            response.put("data", banhNgotService.findAll());
        } else {
            response.put("data", banhNgotService.search(keyword));
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/paging")
    public ResponseEntity<Page<BanhNgotDTO>> getAllWithPaging(@ParameterObject Pageable pageable) {
        Page<BanhNgotDTO> response = banhNgotService.findAllWithPaging(pageable);
        return ResponseEntity.ok(response);
    }
}
