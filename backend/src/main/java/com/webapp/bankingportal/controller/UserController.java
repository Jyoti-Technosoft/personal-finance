package com.webapp.bankingportal.controller;

import com.webapp.bankingportal.dto.LoginRequest;
import com.webapp.bankingportal.dto.UserResponse;
import com.webapp.bankingportal.entity.User;
import com.webapp.bankingportal.security.JwtTokenUtil;
import com.webapp.bankingportal.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;
    private final UserDetailsService userDetailsService;
    private final UserService userService;

    public UserController(UserService userService, AuthenticationManager authenticationManager, JwtTokenUtil jwtTokenUtil, UserDetailsService userDetailsService) {
        this.userService =  userService;
        this.authenticationManager = authenticationManager;
        this.jwtTokenUtil = jwtTokenUtil;
        this.userDetailsService = userDetailsService;
    }
    
    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(@RequestBody User user) {
        User registeredUser = userService.registerUser(user);
        
        UserResponse userResponse = new UserResponse();
        userResponse.setName(registeredUser.getName());
        userResponse.setEmail(registeredUser.getEmail());
        userResponse.setAccountNumber(registeredUser.getAccount().getAccountNumber());
        userResponse.setAddress(registeredUser.getAddress());
        userResponse.setPhone_number(registeredUser.getPhone_number());

        return ResponseEntity.ok(userResponse);
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Authenticate the user with the account number and password
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getAccountNumber(), loginRequest.getPassword())
            );
        } catch (BadCredentialsException e) {
            // Invalid credentials, return 401 Unauthorized
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid account number or password");
        }

        // If authentication successful, generate JWT token
        UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getAccountNumber());
        System.out.println(userDetails);
        String token = jwtTokenUtil.generateToken(userDetails);
        Map<String, String> result =  new HashMap<>();
        result.put("token", token);
        // Return the JWT token in the response
        return new ResponseEntity<>(result , HttpStatus.OK);
    }
    

    @PostMapping("/update")
    public ResponseEntity<UserResponse> updateUser(@RequestBody User user) {
        User updateUser = userService.updateUser(user);

        UserResponse userResponse = new UserResponse();
        userResponse.setName(updateUser.getName());
        userResponse.setEmail(updateUser.getEmail());
        userResponse.setAccountNumber(updateUser.getAccount().getAccountNumber());


        return ResponseEntity.ok(userResponse);
    }
}
