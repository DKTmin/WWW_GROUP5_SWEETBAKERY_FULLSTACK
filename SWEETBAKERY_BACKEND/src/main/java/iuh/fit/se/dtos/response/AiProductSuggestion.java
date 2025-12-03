package iuh.fit.se.dtos.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AiProductSuggestion {
    String id;
    String name;
    Double price;
    String imageUrl;
}
