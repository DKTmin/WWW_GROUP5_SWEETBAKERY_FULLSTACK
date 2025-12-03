package iuh.fit.se.controllers;

import iuh.fit.se.dtos.request.ChatRequest;
import iuh.fit.se.dtos.response.ChatResponse;
import iuh.fit.se.services.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
// Cho phép tất cả các nguồn gọi vào (để test cho dễ)
@CrossOrigin(origins = "http://localhost:5173")

public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        // Kiểm tra đầu vào
        if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new ChatResponse("Vui lòng nhập nội dung tin nhắn."));
        }

        // Gọi Service xử lý
        ChatResponse response = chatService.generateResponse(request.getMessage());

        return ResponseEntity.ok(response);
    }
}