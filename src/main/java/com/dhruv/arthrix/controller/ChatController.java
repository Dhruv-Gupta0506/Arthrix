package com.dhruv.arthrix.controller;

import com.dhruv.arthrix.dto.request.ChatRequest;
import com.dhruv.arthrix.response.ApiResponse;
import com.dhruv.arthrix.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    @Autowired
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<ApiResponse<String>> chat(@PathVariable Long userId, @RequestBody ChatRequest request) {
        String reply = chatService.chat(userId, request.getMessage());
        ApiResponse<String> response = ApiResponse.success("Chat response generated successfully", reply);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}