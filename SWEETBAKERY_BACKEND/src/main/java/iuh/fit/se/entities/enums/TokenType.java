package iuh.fit.se.entities.enums;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 22/11/2025, Saturday
 **/

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum TokenType {
    BEARER("Bearer");

    String tokenType;
    TokenType(String tokenType){
        this.tokenType = tokenType;
    }
}
