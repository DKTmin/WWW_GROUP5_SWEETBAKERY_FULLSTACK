package iuh.fit.se.controllers;

import iuh.fit.se.dtos.request.AiChatRequest;
import iuh.fit.se.dtos.response.AiChatResponse;
import iuh.fit.se.dtos.response.AiProductSuggestion;
import iuh.fit.se.dtos.response.ApiResponse;
import iuh.fit.se.entities.Pastry;
import iuh.fit.se.repositories.PastryRepository;
import iuh.fit.se.services.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RestController
@RequestMapping("/ai-management/api/v1/ai")
public class AiController {

    private final AiService aiService;
    private final PastryRepository pastryRepository;

    @PostMapping("/chat")
    public ApiResponse<AiChatResponse> chat(@RequestBody AiChatRequest req) {
        String message = req.getMessage();

        // 1. Gọi AI sinh câu trả lời text
        String answer = aiService.askGemini(message);

        // 2. Tìm 2–3 sản phẩm phù hợp nhất dựa trên keyword (để FE vẽ card click được)
        List<Pastry> matchPastries =
                pastryRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
                        message, message
                );

        List<AiProductSuggestion> suggestions = matchPastries.stream()
                .limit(3)
                .map(p -> AiProductSuggestion.builder()
                        .id(p.getId())
                        .name(p.getName())
                        .price(p.getPrice())
                        .imageUrl(p.getImageUrl())
                        .build())
                .collect(Collectors.toList());

        AiChatResponse data = AiChatResponse.builder()
                .answer(answer)
                .suggestions(suggestions)
                .build();

        return ApiResponse.<AiChatResponse>builder()
                .code(200)
                .message("Success")
                .data(data)
                .build();
    }
}
