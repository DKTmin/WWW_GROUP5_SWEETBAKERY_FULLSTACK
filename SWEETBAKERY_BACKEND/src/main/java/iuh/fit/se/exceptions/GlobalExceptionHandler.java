package iuh.fit.se.exceptions;

import iuh.fit.se.dtos.response.ApiResponse;
import iuh.fit.se.entities.enums.HttpCode;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.LinkedHashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

	@ExceptionHandler(ItemNotFoundException.class)
	public ResponseEntity<Map<String, Object>> userNotFoundException(ItemNotFoundException ex) {
		Map<String, Object> errors = new LinkedHashMap<String, Object>();
		errors.put("status", HttpStatus.NOT_FOUND.value());
		errors.put("message", ex.getMessage());
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errors);
	}

	@ExceptionHandler(ValidationException.class)
	public ResponseEntity<Map<String, Object>> validationException(ValidationException ex) {
		Map<String, Object> errors = new LinkedHashMap<String, Object>();
		errors.put("status", HttpStatus.BAD_REQUEST.value());
		errors.put("errors", ex.getErrors());
		errors.put("message", ex.getMessage());
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<Map<String, Object>> globleExcpetionHandler(Exception ex) {
		Map<String, Object> errors = new LinkedHashMap<String, Object>();
		errors.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
		errors.put("message", ex.getMessage());
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errors);
	}

	@ExceptionHandler(NullPointerException.class)
	ResponseEntity<ApiResponse<?>> handlingNullPointerException(NullPointerException exception){
		HttpCode httpCode = HttpCode.NOT_FOUND;
		ApiResponse<?> apiResponse = new ApiResponse<>();
		apiResponse.setCode(httpCode.getCODE());
		apiResponse.setMessage(exception.getMessage());
		return ResponseEntity.status(httpCode.getHTTP_CODE()).body(apiResponse);
	}

	@ExceptionHandler(AppException.class)
	ResponseEntity<ApiResponse<?>> handlingAppException(AppException exception){
		HttpCode httpCode = exception.getHttpCode();
		ApiResponse<?> apiResponse = new ApiResponse<>();
		apiResponse.setCode(httpCode.getCODE());
		apiResponse.setMessage(httpCode.getMESSAGE());
		return ResponseEntity.status(httpCode.getHTTP_CODE()).body(apiResponse);
	}
}
