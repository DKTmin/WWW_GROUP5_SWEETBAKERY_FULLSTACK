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
    UNAUTHENTICATED(401, "Unauthenticated!", HttpStatus.UNAUTHORIZED),
    NOT_FOUND(404, "Not found!", HttpStatus.NOT_FOUND),
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
