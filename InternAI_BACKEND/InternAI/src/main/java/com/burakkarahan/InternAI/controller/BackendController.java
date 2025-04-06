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

    @GetMapping("/languages/{owner}/{repo}")
    public List<Language> getRepoLanguages(@PathVariable String owner, @PathVariable String repo) {
        return githubService.getRepoLanguages(owner, repo);
    }

    @GetMapping("/lines/{owner}/{repo}")
    public int getTotalLinesOfCode(@PathVariable String owner, @PathVariable String repo) {
        return githubService.getTotalLinesOfCode(owner, repo);
    }
}
