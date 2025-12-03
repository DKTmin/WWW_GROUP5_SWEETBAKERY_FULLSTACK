package iuh.fit.se.dtos.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AiChatResponse {
    String answer;                             // câu trả lời văn bản của AI
    List<AiProductSuggestion> suggestions;     // danh sách bánh gợi ý (tối đa 2–3 cái)
}
