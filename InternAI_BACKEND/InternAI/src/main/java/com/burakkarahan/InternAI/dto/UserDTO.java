package com.burakkarahan.InternAI.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserDTO {
    private String fullName;
    private String email;
    private String profilePicture;
    private String username;
}