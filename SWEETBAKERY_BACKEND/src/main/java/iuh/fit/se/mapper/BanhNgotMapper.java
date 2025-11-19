package iuh.fit.se.mapper;

import iuh.fit.se.dtos.request.BanhNgotCreationRequest;
import iuh.fit.se.dtos.request.BanhNgotUpdateRequest;
import iuh.fit.se.dtos.response.BanhNgotCreationResponse;
import iuh.fit.se.dtos.response.BanhNgotUpdateResponse;
import iuh.fit.se.entities.BanhNgot;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 14/11/2025, Friday
 **/

@Mapper(componentModel = "spring")
public interface BanhNgotMapper {
    @Mapping(target = "id", ignore = true)
    BanhNgot toBanhNgot(BanhNgotCreationRequest request);
    void update(@MappingTarget BanhNgot banhNgot, BanhNgotUpdateRequest request);
    BanhNgotCreationResponse toBanhNgotCreationResponse(BanhNgot banhNgot);
    BanhNgotUpdateResponse toBanhNgotUpdateResponse(BanhNgot banhNgot);
}
