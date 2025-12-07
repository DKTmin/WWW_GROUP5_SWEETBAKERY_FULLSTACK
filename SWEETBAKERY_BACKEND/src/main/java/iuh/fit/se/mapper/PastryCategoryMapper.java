package iuh.fit.se.mapper;

import iuh.fit.se.dtos.request.PastryCategoryCreationRequest;
import iuh.fit.se.dtos.request.PastryCategoryUpdateRequest;
import iuh.fit.se.dtos.response.PastryCategoryCreationResponse;
import iuh.fit.se.dtos.response.PastryCategoryUpdateResponse;
import iuh.fit.se.entities.PastryCategory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PastryCategoryMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "pastries", ignore = true)
    PastryCategory toCategory(PastryCategoryCreationRequest request);

    @Mapping(target = "pastries", ignore = true)
    void update(@MappingTarget PastryCategory category, PastryCategoryUpdateRequest request);

    PastryCategoryCreationResponse toCategoryCreationResponse(PastryCategory category);

    PastryCategoryUpdateResponse toCategoryUpdateResponse(PastryCategory category);
}
