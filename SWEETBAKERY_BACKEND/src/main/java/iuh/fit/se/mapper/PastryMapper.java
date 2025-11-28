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
 * Mapper for Pastry <-> DTO
 */
@Mapper(componentModel = "spring")
public interface PastryMapper {

    // Khi mapping từ Request -> Entity, ignore id (generated), ignore orderDetails, ignore category (set in service)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "orderDetails", ignore = true)
    @Mapping(target = "category", ignore = true)
    Pastry toPastry(PastryCreationRequest request);

    // update entity từ update request: ignore id, orderDetails, category
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "orderDetails", ignore = true)
    @Mapping(target = "category", ignore = true)
    void update(@MappingTarget Pastry pastry, PastryUpdateRequest request);

    // Entity -> CreationResponse: map category fields
    @Mapping(target = "categoryId", expression = "java(pastry.getCategory() != null ? pastry.getCategory().getId() : null)")
    @Mapping(target = "categoryName", expression = "java(pastry.getCategory() != null ? pastry.getCategory().getName() : null)")
    PastryCreationResponse toPastryCreationResponse(Pastry pastry);

    // Entity -> UpdateResponse: map category fields
    @Mapping(target = "categoryId", expression = "java(pastry.getCategory() != null ? pastry.getCategory().getId() : null)")
    @Mapping(target = "categoryName", expression = "java(pastry.getCategory() != null ? pastry.getCategory().getName() : null)")
    PastryUpdateResponse toPastryUpdateResponse(Pastry pastry);
}
