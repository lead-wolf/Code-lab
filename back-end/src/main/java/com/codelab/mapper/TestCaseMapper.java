package com.codelab.mapper;

import com.codelab.dto.request.TestCaseRequest;
import com.codelab.dto.response.TestCaseResponse;
import com.codelab.entity.TestCase;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface TestCaseMapper {
    @Mapping(target = "id", ignore = true)
    TestCase toTestCase(TestCaseRequest request);

    TestCaseResponse toTestCaseResponse(TestCase testCase);

    void updateTestCase(@MappingTarget TestCase testCase, TestCaseRequest testCaseRequest);
}
