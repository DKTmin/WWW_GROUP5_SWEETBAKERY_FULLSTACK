package iuh.fit.se.entities.enums;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 21/11/2025, Friday
 **/
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ValidationMessage {
    PASSWORD_INVALID("Password must be at least {min} chars!"),
    PASSWORD_INCORRECT("Password is incorrect!"),
    PASSWORD_NOMATCH("New password is not match!");
    String MESSAGE;
    ValidationMessage(String message){
        this.MESSAGE = message;
    }
}
