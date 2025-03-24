package com.burakkarahan.InternAI.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("internai")
public class BackendController {

    @GetMapping(path = "/api/test")
    public String greeting() {
        return "InternAI";
    }

}
