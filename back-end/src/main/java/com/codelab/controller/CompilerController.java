package com.codelab.controller;

import com.codelab.dto.request.EditorContentRequest;
import com.codelab.dto.response.ApiResponse;
import com.codelab.dto.response.EditorContentResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class CompilerController {
    @PostMapping("/save-content")
    public ApiResponse<?> saveContent(@RequestBody @Valid EditorContentRequest request, HttpSession session) throws JsonProcessingException {
        session.setAttribute("editorContent", request.getEditorContent());
        session.setAttribute("mode", request.getMode());
        session.setAttribute("language_name", request.getLanguage_name());
        session.setAttribute("current_tab_id", request.getCurrent_tab_id());
        return ApiResponse.<String>builder()
                .result("Content saved successfully!")
                .build();
    }

//    @GetMapping("/get-content")
//    public ApiResponse<String> getContent(HttpSession session) throws JsonProcessingException {
//        ObjectMapper objectMapper = new ObjectMapper();
//        String content = objectMapper.writeValueAsString(session.getAttribute("editorContent"));
//        String mode = objectMapper.writeValueAsString(session.getAttribute("mode"));
//        String language_name = objectMapper.writeValueAsString(session.getAttribute("language_name"));
//        String current_tab_id = objectMapper.writeValueAsString(session.getAttribute("current_tab_id"));
//        if (content.equals("null") || mode.equals("null")  || language_name.equals("null")  || current_tab_id.equals("null")) {
//            return ApiResponse.<String>builder()
//                    .message("Lỗi khi get-content")
//                    .build();
//        }
////        return "{ \"content\":" + content + ", \"mode\":" + mode + ", \"language_name\":" + language_name + ", \"current_tab_id\":" + current_tab_id + " }";
//            return  ApiResponse.<EditorContentResponse>builder()
//                    .result(
//                            EditorContentResponse.builder()
//                                    .editorContent(content)
//                                    .mode(mode)
//                                    .language_name(language_name)
//                                    .current_tab_id(current_tab_id)
//                                    .build()
//                    )
//                    .build();
//    }

    @PostMapping("/clear-session")
    public ResponseEntity<String> clearSessionRequest(HttpSession session) {
        if (clearSession(session)) {
            return ResponseEntity.ok("Session cleared successfully!");
        } else return ResponseEntity.ok("Error when clear session !");

    }

    private Boolean clearSession(HttpSession session) {
        if (session != null) {
            session.removeAttribute("editorContent");
            session.removeAttribute("mode");
            session.removeAttribute("option");
            session.removeAttribute("language_name");
            session.removeAttribute("current_tab_id");
            System.out.println("Session cleared successfully!");
            return true;
        }
        return false;
    }
}
