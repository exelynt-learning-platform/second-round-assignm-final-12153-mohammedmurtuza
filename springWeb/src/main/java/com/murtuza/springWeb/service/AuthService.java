package com.murtuza.springWeb.service;

import com.murtuza.springWeb.dto.AuthRequest;
import com.murtuza.springWeb.model.Role;
import com.murtuza.springWeb.model.User;
import com.murtuza.springWeb.repository.UserRepo;
import com.murtuza.springWeb.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(UserRepo userRepo,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtService jwtService) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public String register(AuthRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            throw new RuntimeException("Email and password are required");
        }
        if (userRepo.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.ROLE_USER);
        userRepo.save(user);

        return jwtService.generateToken(user.getEmail());
    }

    public String login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        return jwtService.generateToken(request.getEmail());
    }
}
