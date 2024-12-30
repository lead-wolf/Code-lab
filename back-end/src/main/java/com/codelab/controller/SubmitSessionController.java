package com.codelab.controller;

import com.codelab.dto.request.SubmitSessionsRequest;
import com.codelab.service.SubmitSessionService;
import jakarta.validation.Valid;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Builder
@RequiredArgsConstructor
@RequestMapping("/submits")
public class SubmitSessionController {
    private final SubmitSessionService submitSessionService;

    @PostMapping
    void createSubmit(@Valid @RequestBody SubmitSessionsRequest request){
        submitSessionService.createSubmit(request);
    }
}
