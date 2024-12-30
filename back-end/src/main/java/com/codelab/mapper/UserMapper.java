package com.codelab.mapper;

import com.codelab.constant.PredefinedRole;
import com.codelab.dto.request.UserCreationRequest;
import com.codelab.dto.request.UserUpdateRequest;
import com.codelab.dto.response.UserResponse;
import com.codelab.entity.Role;
import com.codelab.entity.User;
import com.codelab.respository.RoleRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public abstract class UserMapper {

    @Autowired
    private RoleRepository roleRepository;

    @Mapping(target = "roles",ignore = true)
    public abstract User toUser(UserCreationRequest request);

    @Mapping(target = "roles", expression = "java(mapRolesToNames(user.getRoles()))")
    public abstract UserResponse toUserResponse(User user);

    @Mapping(target = "roles", expression = "java(mapNamesToRoles(request.getRoles()))")
    public abstract void updateUser(@MappingTarget User user, UserUpdateRequest request);

    protected Set<String> mapRolesToNames(Set<Role> roles) {
        return roles.stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
    }

    protected Set<Role> mapNamesToRoles(Set<String> roleNames) {
        Set<Role> roles = new HashSet<>();

        for (String name : roleNames) {
            Optional<Role> roleOptional = getRoleFromName(name);
            roleOptional.ifPresent(roles::add);
        }

        return roles;
    }

    protected Optional<Role> getRoleFromName(String name) {
        return switch (name) {
            case PredefinedRole.ADMIN_ROLE -> roleRepository.findById(PredefinedRole.ADMIN_ROLE);
            case PredefinedRole.TEACHER_ROLE -> roleRepository.findById(PredefinedRole.TEACHER_ROLE);
            case PredefinedRole.USER_ROLE -> roleRepository.findById(PredefinedRole.USER_ROLE);
            default -> Optional.empty();
        };
    }
}
