package iuh.fit.se.configs;

import com.fasterxml.jackson.databind.ObjectMapper;
import iuh.fit.se.dtos.response.ApiResponse;
import iuh.fit.se.entities.enums.HttpCode;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 21/11/2025, Friday
 **/

public class CustomAccessDeniedHandler implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        ApiResponse<?> apiResponse = ApiResponse.builder()
                .code(HttpCode.UNAUTHORIZED.getCODE())
                .message(HttpCode.UNAUTHORIZED.getMESSAGE())
                .build();

        ObjectMapper mapper = new ObjectMapper();
        response.getWriter().write(mapper.writeValueAsString(apiResponse));
        response.flushBuffer();
    }
}
