package iuh.fit.se.mapper;

import iuh.fit.se.dtos.request.PastryCreationRequest;
import iuh.fit.se.dtos.request.PastryUpdateRequest;
import iuh.fit.se.dtos.response.PastryCreationResponse;
import iuh.fit.se.dtos.response.PastryUpdateResponse;
import iuh.fit.se.entities.Pastry;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 14/11/2025, Friday
 **/

@Mapper(componentModel = "spring")
public interface PastryMapper {
    @Mapping(target = "id", ignore = true)
    Pastry toBanhNgot(PastryCreationRequest request);
    void update(@MappingTarget Pastry pastry, PastryUpdateRequest request);
    PastryCreationResponse toBanhNgotCreationResponse(Pastry pastry);
    PastryUpdateResponse toBanhNgotUpdateResponse(Pastry pastry);
}
