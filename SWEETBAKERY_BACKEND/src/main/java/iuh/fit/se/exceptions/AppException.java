package iuh.fit.se.exceptions;

import iuh.fit.se.entities.enums.HttpCode;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 20/11/2025, Thursday
 **/
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AppException extends RuntimeException{
    HttpCode httpCode;
    public AppException(HttpCode httpCode){
        super(httpCode.getMESSAGE());
        this.httpCode = httpCode;
    }
}
