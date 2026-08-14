package com.dhruv.arthrix.service.impl;

import com.dhruv.arthrix.entity.User;
import com.dhruv.arthrix.exception.BadRequestException;
import com.dhruv.arthrix.exception.ResourceNotFoundException;
import com.dhruv.arthrix.repository.UserRepository;
import com.dhruv.arthrix.service.ChatService;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChatServiceImpl implements ChatService {

    private final ChatClient chatClient;
    private final UserRepository userRepository;
    private final ChatRateLimiter chatRateLimiter;

    @Autowired
    public ChatServiceImpl(ChatClient chatClient, UserRepository userRepository, ChatRateLimiter chatRateLimiter) {
        this.chatClient = chatClient;
        this.userRepository = userRepository;
        this.chatRateLimiter = chatRateLimiter;
    }

    @Override
    public String chat(Long userId, String message) {
        if (!chatRateLimiter.allowRequest(userId)) {
            throw new BadRequestException("You're sending messages too quickly. Please wait a few seconds and try again.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        String systemPrompt = buildSystemPrompt(user);

        return chatClient.prompt()
                .system(systemPrompt)
                .user(message)
                .call()
                .content();
    }

    private String buildSystemPrompt(User user) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are Arthrix's AI fitness coach. Give friendly, safe, practical advice on workouts, ")
                .append("nutrition, and general fitness. You are not a medical professional — recommend consulting ")
                .append("a doctor for medical concerns. Keep answers concise and actionable. ")
                .append("Format plainly: short paragraphs, and a numbered list only when giving a sequence of exercises or steps. ")
                .append("Do not use nested bullets, asterisked sub-notes, or heavy bold formatting — write like a coach texting a client.\n\n")
                .append("Context about this user:\n");

        if (user.getFitnessGoal() != null) sb.append("- Fitness goal: ").append(user.getFitnessGoal()).append("\n");
        if (user.getDietPreference() != null) sb.append("- Diet preference: ").append(user.getDietPreference()).append("\n");
        if (user.getAge() != null) sb.append("- Age: ").append(user.getAge()).append("\n");
        if (user.getGender() != null) sb.append("- Gender: ").append(user.getGender()).append("\n");
        if (user.getHeight() != null) sb.append("- Height (cm): ").append(user.getHeight()).append("\n");
        if (user.getWeight() != null) sb.append("- Weight (kg): ").append(user.getWeight()).append("\n");

        sb.append("\nUse this context to personalize advice when relevant, but don't force it into every answer.");
        return sb.toString();
    }
}