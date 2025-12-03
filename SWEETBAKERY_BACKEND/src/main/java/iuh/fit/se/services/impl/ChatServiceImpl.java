package iuh.fit.se.services.impl;

import iuh.fit.se.dtos.response.ChatResponse;
import iuh.fit.se.entities.Pastry;
import iuh.fit.se.repositories.PastryRepository;
import iuh.fit.se.services.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ChatServiceImpl implements ChatService {

    @Value("${gemini.api-key}")
    private String apiKey;

    @Value("${gemini.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;
    private final PastryRepository pastryRepository;

    @Autowired
    public ChatServiceImpl(RestTemplate restTemplate, PastryRepository pastryRepository) {
        this.restTemplate = restTemplate;
        this.pastryRepository = pastryRepository;
    }

    private String getMenuFromDatabase() {
        List<Pastry> pastries = pastryRepository.findAll();
        if (pastries.isEmpty()) return "Menu đang cập nhật.";

        // Format: ID - Tên - Giá - Mô tả
        return pastries.stream()
                .map(p -> String.format("ID: %s | Tên: %s | Giá: %s VND | Mô tả: %s",
                        p.getId(), p.getName(), p.getPrice(), p.getDescription()))
                .collect(Collectors.joining("\n"));
    }

    @Override
    public ChatResponse generateResponse(String userMessage) {
        try {
            String cleanKey = apiKey.trim();
            String cleanUrl = apiUrl.trim();
            String finalUrl = cleanUrl + "?key=" + cleanKey;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String menuData = getMenuFromDatabase();

            // --- PROMPT CẬP NHẬT: YÊU CẦU TRẢ VỀ LINK ---
            String systemPrompt = """
                    Bạn là nhân viên Sweet Bakery. Dưới đây là MENU (kèm ID):
                    --------------------
                    %s
                    --------------------
                    QUY TẮC QUAN TRỌNG:
                    1. Khi nhắc đến tên bánh cụ thể, BẮT BUỘC dùng định dạng: [Tên Bánh](ID)
                       Ví dụ: Bạn nên thử [Bánh Tiramisu](101) nhé.
                    2. Không bịa ra ID không có trong danh sách.
                    3. Trả lời ngắn gọn, thân thiện, dùng emoji.
                    
                    Khách hỏi: "%s"
                    """.formatted(menuData, userMessage);

            Map<String, Object> part = new HashMap<>();
            part.put("text", systemPrompt);

            Map<String, Object> content = new HashMap<>();
            content.put("parts", List.of(part));

            Map<String, Object> body = new HashMap<>();
            body.put("contents", List.of(content));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(finalUrl, entity, Map.class);

            if (response.getBody() != null) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> contentObj = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) contentObj.get("parts");
                    if (parts != null && !parts.isEmpty()) {
                        return new ChatResponse((String) parts.get(0).get("text"));
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ChatResponse("Hệ thống đang bận chút xíu. (" + e.getMessage() + ")");
        }
        return new ChatResponse("Mình chưa hiểu ý bạn lắm.");
    }
}