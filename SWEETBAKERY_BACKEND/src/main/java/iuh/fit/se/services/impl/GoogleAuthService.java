package iuh.fit.se.services.impl;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 10/12/2025, Wednesday
 **/
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class GoogleAuthService implements iuh.fit.se.services.GoogleAuthService {

    @NonFinal
    @Value("${google.client-id}")
    private String clientId;

    @NonFinal
    @Value("${google.client-secret}")
    private String clientSecret;

    @NonFinal
    @Value("${google.redirect-uri}")
    private String redirectUri;

    private final RestTemplate restTemplate = new RestTemplate();
    @Override
    public Map<String, Object> authenticateGoogle(String code) {
        // BƯỚC 1: Lấy Code đổi lấy Access Token từ Google
        String tokenEndpoint = "https://oauth2.googleapis.com/token";

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("code", code);
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("redirect_uri", redirectUri); // Google check cái này rất kỹ
        params.add("grant_type", "authorization_code");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        try {
            // Gọi POST lên Google
            ResponseEntity<Map> response = restTemplate.postForEntity(tokenEndpoint, request, Map.class);
            String googleAccessToken = (String) response.getBody().get("access_token");

            // BƯỚC 2: Dùng Access Token lấy thông tin User (Email, Name, Avatar)
            return getUserInfo(googleAccessToken);

        } catch (Exception e) {
            throw new RuntimeException("Lỗi xác thực Google: " + e.getMessage());
        }
    }

    @Override
    public Map<String, Object> getUserInfo(String googleAccessToken) {
        String userInfoEndpoint = "https://www.googleapis.com/oauth2/v2/userinfo";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(googleAccessToken);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(userInfoEndpoint, HttpMethod.GET, entity, Map.class);
        return response.getBody(); // Trả về Map chứa: id, email, name, picture...
    }
}
