package iuh.fit.se.entities.enums;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 19/11/2025, Wednesday
 **/

@Getter
public enum HttpCode {
    OK(200, "Successfully!", HttpStatus.OK),
    CREATED(201, "Created!", HttpStatus.CREATED),
    VALIDATION_FAILED(400, "Validation failed!", HttpStatus.BAD_REQUEST),
    BAD_REQUEST(400, "Bad request!", HttpStatus.BAD_REQUEST),
    DISABLE_ACCOUNT(400, "Account has been disabled!", HttpStatus.BAD_REQUEST),
    PASSWORD_NOMATCH(400, ValidationMessage.PASSWORD_NOMATCH.getMESSAGE(), HttpStatus.BAD_REQUEST),
    PASSWORD_INCORRECT(400, ValidationMessage.PASSWORD_INCORRECT.getMESSAGE(), HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED(401, "Unauthenticated!", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(403, "You do not have any permissions!", HttpStatus.FORBIDDEN),
    NOT_FOUND(404, "Not found!", HttpStatus.NOT_FOUND),
    EMAIL_NOT_FOUND(404, "Email not found!", HttpStatus.NOT_FOUND),
    USER_NOT_FOUND(404, "User not found!", HttpStatus.NOT_FOUND),
    EMPLOYEE_NOT_FOUND(404, "Employee not found!", HttpStatus.NOT_FOUND),
    CUSTOMER_NOT_FOUND(404, "Customer not found!", HttpStatus.NOT_FOUND),
    ROLE_NOT_FOUND(404, "Role not found!", HttpStatus.NOT_FOUND),
    ACCOUNT_NOT_FOUND(404, "Account not found!", HttpStatus.NOT_FOUND),
    USERNAME_EXISTED(409, "Username existed!", HttpStatus.CONFLICT),
    EMAIL_EXISTED(409, "Email existed!", HttpStatus.CONFLICT);

    final int CODE;
    final String MESSAGE;
    final HttpStatusCode HTTP_CODE;

    private HttpCode(int code, String message, HttpStatusCode httpStatusCode){
        this.CODE = code;
        this.MESSAGE = message;
        this.HTTP_CODE = httpStatusCode;
    }
}
