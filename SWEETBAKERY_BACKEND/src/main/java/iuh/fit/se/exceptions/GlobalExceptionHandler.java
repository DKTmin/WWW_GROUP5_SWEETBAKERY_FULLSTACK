package iuh.fit.se.exceptions;

import iuh.fit.se.dtos.response.ApiResponse;
import iuh.fit.se.entities.enums.HttpCode;
import iuh.fit.se.entities.enums.ValidationMessage;
import jakarta.validation.ConstraintViolation;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.nio.file.AccessDeniedException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(value = NullPointerException.class)
    ResponseEntity<ApiResponse<?>> handlingNullPointerException(NullPointerException exception) {
        HttpCode httpCode = HttpCode.NOT_FOUND;
        ApiResponse<?> apiResponse = new ApiResponse<>();
        apiResponse.setCode(httpCode.getCODE());
        apiResponse.setMessage(exception.getMessage());
        return ResponseEntity.status(httpCode.getHTTP_CODE()).body(apiResponse);
    }

    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse<?>> handlingAppException(AppException exception) {
        HttpCode httpCode = exception.getHttpCode();
        ApiResponse<?> apiResponse = new ApiResponse<>();
        apiResponse.setCode(httpCode.getCODE());
        apiResponse.setMessage(httpCode.getMESSAGE());
        return ResponseEntity.status(httpCode.getHTTP_CODE()).body(apiResponse);
    }

    @ExceptionHandler(value = AccessDeniedException.class)
    ResponseEntity<ApiResponse<?>> handlingAccessDeniedException(AccessDeniedException exception) {
        HttpCode httpCode = HttpCode.UNAUTHORIZED;
        ApiResponse<?> apiResponse = new ApiResponse<>();
        apiResponse.setCode(httpCode.getCODE());
        apiResponse.setMessage(httpCode.getMESSAGE());
        return ResponseEntity.status(httpCode.getHTTP_CODE()).body(apiResponse);
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse<?>> handlingMethodArgumentNotValidException(MethodArgumentNotValidException exception) {
        HttpCode httpCode = HttpCode.VALIDATION_FAILED;

        List<Map<String, Object>> errors = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> {
                    Map<String, Object> fieldError = new HashMap<>();

                    try {
                        ConstraintViolation<?> constraintViolation = error.unwrap(ConstraintViolation.class);
                        Map<String, Object> attrs = constraintViolation.getConstraintDescriptor().getAttributes();
                        String validationMessageKey = error.getDefaultMessage();
                        ValidationMessage validationMessageObject = ValidationMessage.valueOf(validationMessageKey);
                        String validationMessage = getMessage(validationMessageObject.getMESSAGE(), attrs);

                        fieldError.put("field", error.getField());
                        fieldError.put("message", validationMessage);
                    }catch (Exception e){
                        fieldError.put("field", error.getField());
                        fieldError.put("message", error.getDefaultMessage());
                    }
                    return fieldError;
                })
                .collect(Collectors.toList());

        ApiResponse<?> apiResponse = ApiResponse.builder()
                .code(httpCode.getCODE())
                .message(httpCode.getMESSAGE())
                .data(errors)
                .build();

        return ResponseEntity.status(httpCode.getHTTP_CODE()).body(apiResponse);
    }

    String getMessage(String validationMessage, Map<String, Object> attrs){
        String minValue = attrs.get("min").toString();
        return validationMessage.replace("{" + "min" + "}", minValue);
    }

    @ExceptionHandler(value = RuntimeException.class)
    ResponseEntity<ApiResponse<?>> handlingRuntimeException(RuntimeException exception){
        HttpCode httpCode = HttpCode.BAD_REQUEST;
        ApiResponse<?> apiResponse = ApiResponse.builder()
                .code(httpCode.getCODE())
                .message(exception.getMessage())
                .build();
        return ResponseEntity.status(httpCode.getHTTP_CODE()).body(apiResponse);
    }
}
