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
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
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

        // TỐI ƯU: Chỉ lấy tối đa 30 sản phẩm để tránh làm đầy Context Token của gói Free
        return pastries.stream()
                .limit(30)
                .map(p -> String.format("ID: %s | Tên: %s | Giá: %s VND | Mô tả: %s",
                        p.getId(), p.getName(), p.getPrice(), p.getDescription()))
                .collect(Collectors.joining("\n"));
    }

    @Override
    public ChatResponse generateResponse(String userMessage) {
        try {
            // Kiểm tra API Key
            if (apiKey == null || apiKey.isEmpty() || apiKey.contains("YOUR_API_KEY")) {
                return new ChatResponse("Lỗi cấu hình Server: Chưa có API Key.");
            }

            String finalUrl = apiUrl + "?key=" + apiKey;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String menuData = getMenuFromDatabase();

            // Prompt
            String systemPrompt = """
                    Bạn là nhân viên tư vấn của Sweet Bakery.
                    MENU HIỆN TẠI:
                    %s
                    --------------------
                    YÊU CẦU:
                    1. Nếu khách hỏi về bánh, hãy gợi ý dựa trên menu trên.
                    2. Khi nhắc tên bánh, PHẢI dùng định dạng: [Tên Bánh](ID) (Ví dụ: [Bánh Tiramisu](101)).
                    3. Trả lời ngắn gọn (dưới 100 từ), thân thiện, dùng emoji.
                    
                    Khách hàng: "%s"
                    """.formatted(menuData, userMessage);

            // Cấu trúc Request Body chuẩn cho Gemini
            Map<String, Object> part = new HashMap<>();
            part.put("text", systemPrompt);

            Map<String, Object> content = new HashMap<>();
            content.put("parts", Collections.singletonList(part)); // Dùng singletonList cho gọn

            Map<String, Object> body = new HashMap<>();
            body.put("contents", Collections.singletonList(content));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            // Gọi API
            ResponseEntity<Map> response = restTemplate.postForEntity(finalUrl, entity, Map.class);

            // Xử lý Response
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

        } catch (HttpClientErrorException.TooManyRequests e) {
            // Log chi tiết nội dung trả về từ Gemini
            System.err.println("=== GEMINI 429 BODY ===");
            System.err.println(e.getResponseBodyAsString());
            System.err.println("=== END 429 BODY ===");

            return new ChatResponse(
                    "Bot đang quá tải do nhiều người dùng (Lỗi 429). " +
                            "Bạn vui lòng đợi một lúc rồi hỏi lại giúp mình nhé! ☕"
            );
        } catch (HttpClientErrorException e) {
            return new ChatResponse("Lỗi kết nối AI: " + e.getStatusCode());
        } catch (Exception e) {
            e.printStackTrace();
            return new ChatResponse("Hệ thống đang bận chút xíu. (" + e.getMessage() + ")");
        }
        return new ChatResponse("Xin lỗi, mình chưa hiểu ý bạn.");
    }
}