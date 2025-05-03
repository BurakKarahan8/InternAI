package com.burakkarahan.InternAI.controller;

import com.burakkarahan.InternAI.model.Language;
import com.burakkarahan.InternAI.service.GithubService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("internai/api")
public class BackendController {

    private final GithubService githubService;

    public BackendController(GithubService githubService) {
        this.githubService = githubService;
    }

    @GetMapping("/test")
    public String greeting() {
        return "InternAI";
    }

    //hangi dil yüzde kaç kullanılmış
    @GetMapping("/github-languages/{owner}")
    public List<Language> getUserLanguages(@PathVariable String owner) {
        return githubService.getUserLanguages(owner);
    }

    @GetMapping("/lines/{owner}")
    public int getTotalLinesOfCode(@PathVariable String owner) {
        return githubService.getTotalLinesOfCode(owner);
    }
}
