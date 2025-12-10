package iuh.fit.se.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {

    @Bean
    public RestTemplate restTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();

        // Thời gian chờ kết nối (3 giây)
        factory.setConnectTimeout(3000);

        // Thời gian chờ dữ liệu trả về (10 giây)
        // Nếu Gemini xử lý quá lâu, nó sẽ tự ngắt
        factory.setReadTimeout(10000);

        return new RestTemplate(factory);
    }
}