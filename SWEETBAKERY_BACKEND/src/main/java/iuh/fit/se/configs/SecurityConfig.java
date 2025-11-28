package iuh.fit.se.configs;

import iuh.fit.se.entities.enums.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    CustomJwtDecoder customJwtDecoder;

    // ====== KHAI BÁO HẰNG Ở ĐÂY ======
    // Các endpoint POST cho auth: public
    private static final String[] PUBLIC_POST_ENDPOINTS = {
            "/auth-management/api/v1/auth/register",
            "/auth-management/api/v1/auth/log-in",
            "/auth-management/api/v1/auth/introspect",
            "/category-management/api/v1/categories/**",
    };

    // Các endpoint GET bánh: public (homepage dùng)
    private static final String[] PUBLIC_GET_ENDPOINTS = {
            "/pastry-management/api/v1/pastries",
            "/pastry-management/api/v1/pastries/**",
            "/pastry-management/api/v1/pastry-categories",
            "/pastry-management/api/v1/pastry-categories/**"
    };


    // Endpoint chỉ ADMIN được phép
    private static final String[] ADMIN_ENDPOINT = {
            "/auth-management/api/v1/auth/*",
            "/user-management/api/v1/users/**"
    };
    // ================================

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        // CORS
        httpSecurity.cors(cors -> cors.configurationSource(request -> {
            var corConfig = new CorsConfiguration();
            // KHÔNG có dấu "/" ở cuối
            corConfig.addAllowedOrigin("http://localhost:5173");
            corConfig.addAllowedHeader("*");
            corConfig.addAllowedMethod("*");
            corConfig.setAllowCredentials(true);
            return corConfig;
        })).csrf(AbstractHttpConfigurer::disable);

        httpSecurity.authorizeHttpRequests(request -> {
            request.requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINT).permitAll()
            .requestMatchers(HttpMethod.GET, PUBLIC_ENDPOINT).permitAll()
                    .requestMatchers(HttpMethod.GET, ADMIN_ENDPOINT).hasRole(UserRole.ADMIN.name())
                    .anyRequest().authenticated();
        }).oauth2ResourceServer(oauth2 -> {
            oauth2.jwt(jwtConfigurer -> jwtConfigurer.decoder(customJwtDecoder)
                            .jwtAuthenticationConverter(jwtAuthenticationConverter()))
                    .authenticationEntryPoint(new JwtAuthenticationEntrypoint())
                    .accessDeniedHandler(new CustomAccessDeniedHandler());
        });
        // PHÂN QUYỀN
        httpSecurity.authorizeHttpRequests(req -> req
                // 3 endpoint POST auth: ai cũng gọi được
                .requestMatchers(HttpMethod.POST, PUBLIC_POST_ENDPOINTS).permitAll()
                // GET danh sách bánh: ai cũng xem được (homepage)
                .requestMatchers(HttpMethod.GET, PUBLIC_GET_ENDPOINTS).permitAll()
                // Các endpoint admin
                .requestMatchers(ADMIN_ENDPOINT).hasRole(UserRole.ADMIN.name())
                // Còn lại thì phải có token
                .anyRequest().authenticated()
        ).oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt
                        .decoder(customJwtDecoder)
                        .jwtAuthenticationConverter(jwtAuthenticationConverter()))
                .authenticationEntryPoint(new JwtAuthenticationEntrypoint())
                .accessDeniedHandler(new CustomAccessDeniedHandler())
        );

        return httpSecurity.build();
    }

    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
