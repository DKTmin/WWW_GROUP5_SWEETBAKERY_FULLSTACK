package iuh.fit.se.services.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import iuh.fit.se.entities.Pastry;
import iuh.fit.se.repositories.PastryRepository;
import iuh.fit.se.services.AiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiServiceImpl implements AiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    // ví dụ: models/gemini-2.5-flash
    @Value("${gemini.model}")
    private String geminiModel;

    private static final String BASE_URL = "https://generativelanguage.googleapis.com";

    // Repository để lấy danh sách bánh
    private final PastryRepository pastryRepository;

    @Override
    public String askGemini(String message) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            String url = BASE_URL + "/v1beta/" + geminiModel + ":generateContent?key=" + apiKey;

            // 1. Lấy danh sách bánh trong DB
            List<Pastry> pastries = pastryRepository.findAll();

            String productsContext = pastries.stream()
                    .map(p -> String.format(
                            "- id: %s | tên: %s | giá: %s | mô tả: %s",
                            p.getId(),
                            p.getName(),
                            p.getPrice() != null ? p.getPrice().toString() : "N/A",
                            p.getDescription() != null ? p.getDescription() : ""
                    ))
                    .collect(Collectors.joining("\n"));

            // 2. Prompt hướng AI chỉ tư vấn bánh + từ chối câu hỏi lạc đề
            String finalPrompt = """
                    Bạn là Trợ lý AI Sweet Bakery – nhân viên tư vấn bánh ngọt thân thiện.

                    Nhiệm vụ:
                    - Chỉ tư vấn về các loại bánh trong DANH SÁCH SẢN PHẨM dưới đây.
                    - Luôn trả lời bằng tiếng Việt, giọng vui vẻ, gần gũi, xưng "mình" – "bạn".
                    - Mỗi câu trả lời nên gợi ý 2–3 sản phẩm phù hợp nhất với nhu cầu khách,
                      mô tả ngắn lý do phù hợp + nhắc lại giá từng bánh (dùng đơn vị VNĐ).
                    - Không bịa ra sản phẩm không có trong danh sách.
                    - Nếu câu hỏi KHÔNG liên quan đến bánh, đồ ăn, cửa hàng, đơn hàng,
                      hãy trả lời đúng một câu:

                      "Xin lỗi, mình chỉ có thể tư vấn các loại bánh và sản phẩm của Sweet Bakery thôi ạ. ❤️"

                    DANH SÁCH SẢN PHẨM (id, tên, giá, mô tả):
                    %s

                    CÂU HỎI CỦA KHÁCH: "%s"
                    """.formatted(productsContext, message);

            // 3. Tạo body gọi Gemini
            String escapedPrompt = finalPrompt
                    .replace("\\", "\\\\")
                    .replace("\"", "\\\"")
                    .replace("\n", "\\n");

            String body = """
                    {
                      "contents": [
                        {
                          "parts": [
                            { "text": "%s" }
                          ]
                        }
                      ],
                      "generationConfig": {
                        "temperature": 0.7,
                        "maxOutputTokens": 512
                      }
                    }
                    """.formatted(escapedPrompt);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> entity = new HttpEntity<>(body, headers);

            ResponseEntity<String> response =
                    restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            if (!response.getStatusCode().is2xxSuccessful()) {
                log.error("Gemini HTTP error: status={} body={}", response.getStatusCode(), response.getBody());
                return "Xin lỗi, hệ thống AI đang gặp lỗi (mã " + response.getStatusCode().value() + "). Bạn thử lại sau nhé.";
            }

            // 4. Parse JSON -> lấy text trả lời
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());

            JsonNode candidates = root.path("candidates");
            if (!candidates.isArray() || candidates.isEmpty()) {
                log.warn("Gemini response không có candidates: {}", response.getBody());
                return "Mình hiện chưa có câu trả lời phù hợp, bạn hỏi lại giúp mình với cách khác nhé.";
            }

            JsonNode content = candidates.get(0).path("content");
            StringBuilder sb = new StringBuilder();
            for (JsonNode part : content.path("parts")) {
                if (part.has("text")) {
                    sb.append(part.get("text").asText());
                }
            }

            String answer = sb.toString().trim();
            if (answer.isEmpty()) {
                return "Mình hiện chưa có câu trả lời phù hợp, bạn hỏi lại giúp mình với cách khác nhé.";
            }

            return answer;

        } catch (HttpClientErrorException ex) {
            log.error("Gemini HTTP error: status={} body={}", ex.getStatusCode(), ex.getResponseBodyAsString());
            return "Xin lỗi, hệ thống AI đang gặp lỗi (" + ex.getStatusCode().value() + "). Bạn thử lại sau nhé.";
        } catch (Exception ex) {
            log.error("Gemini exception", ex);
            return "Xin lỗi, hệ thống đang gặp lỗi, bạn thử lại sau nhé.";
        }
    }
}
