package com.burakkarahan.InternAI.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.UUID;

@Getter
@AllArgsConstructor
public class UserDTO {
    private UUID id;
    private String fullName;
    private String email;
    private String profilePicture;
    private String username;
    private String githubUsername;
}