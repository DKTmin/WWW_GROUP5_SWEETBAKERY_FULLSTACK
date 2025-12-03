package iuh.fit.se.services;

import iuh.fit.se.dtos.response.ChatResponse;

public interface ChatService {
    ChatResponse generateResponse(String userMessage);
}