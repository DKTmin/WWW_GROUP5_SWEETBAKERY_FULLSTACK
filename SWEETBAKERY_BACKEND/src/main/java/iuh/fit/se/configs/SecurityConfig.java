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
    private static final String[] SWAGGER_WHITELIST = {
            "/swagger-ui.html",
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/api-docs/**",
            "/swagger-resources/**",
            "/webjars/**"
    };
    private final String[] POST_PUBLIC_ENDPOINT = {
            "/auth-management/api/v1/auth/register",
            "/auth-management/api/v1/auth/log-in",
            "/auth-management/api/v1/auth/introspect",
            "/payments/vnpay/create",
            "/payments/vnpay/simulate",
            "/customer-management/api/v1/customers/register",
            "/category-management/api/v1/categories/**",
            "/api/chat"
    };

    private final String[] POST_CUSTOMER_ENDPOINT = {
            "/customer-management/api/v1/customers/update/**",
    };


    private final String[] GET_PUBLIC_ENDPOINT = {
            "/user-management/api/v1/users/information",
            "/pastry-management/api/v1/pastries/**",
            "/category-management/api/v1/categories/**",
            // Cho phép VNPay redirect về mà không cần JWT
            "/payments/vnpay/return",
            "/payments/vnpay/ipn",
    };

    private final String[] ADMIN_ENDPOINT = {
            "/auth-management/api/v1/auth/**",
            "/pastry-management/api/v1/pastries/**",
            "/user-management/api/v1/users/**",
            "/employee-management/api/v1/employees/**",
            "/gmail-management/api/v1/gmail/**"
    };

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        // CORS
        httpSecurity.cors(cors -> cors.configurationSource(request -> {
            var corConfig = new CorsConfiguration();
            corConfig.addAllowedOrigin("http://localhost:5173");
            corConfig.addAllowedHeader("*");
            corConfig.addAllowedMethod("*");
            corConfig.setAllowCredentials(true);
            return corConfig;
        })).csrf(AbstractHttpConfigurer::disable);

        httpSecurity.authorizeHttpRequests(request -> {
            request.requestMatchers(HttpMethod.POST, POST_PUBLIC_ENDPOINT).permitAll()
                    .requestMatchers(HttpMethod.GET, GET_PUBLIC_ENDPOINT).permitAll()
                    .requestMatchers(HttpMethod.POST, POST_CUSTOMER_ENDPOINT).hasAnyRole(
                            UserRole.CUSTOMER.name(),
                            UserRole.ADMIN.name()
                    )
                    .requestMatchers(HttpMethod.GET, ADMIN_ENDPOINT).hasRole(UserRole.ADMIN.name())
                    .requestMatchers(SWAGGER_WHITELIST).permitAll()
                    .anyRequest().authenticated();
        }).oauth2ResourceServer(oauth2 -> {
            oauth2.jwt(jwtConfigurer -> jwtConfigurer.decoder(customJwtDecoder)
                    .jwtAuthenticationConverter(jwtAuthenticationConverter()))
                    .authenticationEntryPoint(new JwtAuthenticationEntrypoint())
                    .accessDeniedHandler(new CustomAccessDeniedHandler());
        });

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
