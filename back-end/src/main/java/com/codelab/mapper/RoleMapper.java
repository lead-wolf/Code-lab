package com.codelab.mapper;

import com.codelab.dto.request.RoleRequest;
import com.codelab.dto.response.RoleResponse;
import com.codelab.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface RoleMapper {

    Role toRole(RoleRequest roleRequest);

    RoleResponse toRoleResponse(Role role);
}
