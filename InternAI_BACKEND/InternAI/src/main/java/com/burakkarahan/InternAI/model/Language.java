package com.burakkarahan.InternAI.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Language {

    @JsonProperty("name")
    private String name;

    @JsonProperty("percentage")
    private double percentage;

    public Language(String name, double percentage) {
        this.name = name;
        this.percentage = percentage;
    }

}
