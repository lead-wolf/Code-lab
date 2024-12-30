package com.codelab.mapper;

import com.codelab.dto.request.AssignmentRequest;
import com.codelab.dto.response.AssignmentResponse;
import com.codelab.entity.Assignment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface AssignmentMapper {

    @Mapping(target = "level", ignore = true)
    @Mapping(target = "language", ignore = true)
    @Mapping(target = "maxScore", ignore = true)
    Assignment toAssignment(AssignmentRequest assignmentRequest );

    @Mapping(target = "level", expression = "java(assignment.getLevel() != null ? assignment.getLevel().getName() : null)")
    @Mapping(target = "language", expression = "java(assignment.getLanguage() != null ? assignment.getLanguage().getName(): null)")
    AssignmentResponse toAssignmentResponse(Assignment assignment);

    @Mapping(target = "level", ignore = true)
    @Mapping(target = "language", ignore = true)
    void update(@MappingTarget Assignment assignment, AssignmentRequest assignmentRequest);
}
