package com.burakkarahan.InternAI.model;

import com.burakkarahan.InternAI.enums.ApplicationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "applications", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"applicant_id", "job_post_id"})
})
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applicant_id", nullable = false)
    private User applicant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_post_id", nullable = false)
    private JobPost jobPost;

    private LocalDateTime applyDate;

    @Enumerated(EnumType.STRING)  // enum'u string olarak kaydet
    private ApplicationStatus status;

    private String coverLetter;

    @PrePersist
    protected void onCreate() {
        applyDate = LocalDateTime.now();
        status = ApplicationStatus.PENDING;
    }

}
