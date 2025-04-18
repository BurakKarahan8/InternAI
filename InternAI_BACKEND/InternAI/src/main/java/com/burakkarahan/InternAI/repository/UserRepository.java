package com.burakkarahan.InternAI.repository;

import com.burakkarahan.InternAI.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    // Kullanıcı adı ile kullanıcıyı bulma
    Optional<User> findByUsername(String username);

    // E-posta ile kullanıcıyı bulma
    Optional<User> findByEmail(String email);
}
