package iuh.fit.se.configs;

import com.fasterxml.jackson.databind.ObjectMapper;
import iuh.fit.se.dtos.response.ApiResponse;
import iuh.fit.se.entities.enums.HttpCode;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.awt.*;
import java.io.IOException;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 20/11/2025, Thursday
 **/
public class JwtAuthenticationEntrypoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        HttpCode httpCode = HttpCode.UNAUTHENTICATED;

        response.setStatus(httpCode.getHTTP_CODE().value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        ApiResponse<?> apiResponse = ApiResponse.builder()
                .code(httpCode.getCODE())
                .message(httpCode.getMESSAGE())
                .build();

        ObjectMapper mapper = new ObjectMapper();
        response.getWriter().write(mapper.writeValueAsString(apiResponse));
        response.flushBuffer();
    }
}
