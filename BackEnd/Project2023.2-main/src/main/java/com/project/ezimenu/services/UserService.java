package com.project.ezimenu.services;

import com.project.ezimenu.dtos.AuthDTO.AuthRequestDTO;
import com.project.ezimenu.dtos.AuthDTO.AuthResponseDTO;
import com.project.ezimenu.entities.User;
import com.project.ezimenu.exceptions.BadRequestException;
import com.project.ezimenu.repositories.UserRepository;
import com.project.ezimenu.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import static com.project.ezimenu.utils.Constants.messages;

public class UserService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(messages.getString("user.validate.not-found")));
        return org.springframework.security.core.userdetails.User
                .withUsername(username)
                .password(user.getPassword())
                .roles(user.getRole())
                .build();
    }
    public AuthResponseDTO signIn(AuthRequestDTO authRequestDTO) throws BadCredentialsException, BadRequestException {
        AuthResponseDTO authResponseDTO = new AuthResponseDTO();
        String username = authRequestDTO.getUsername();
        String password = authRequestDTO.getPassword();
        Authentication authentication = authenticate(username, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String accessToken = jwtTokenProvider.generateToken(authentication);
        authResponseDTO.setStatus(true);
        authResponseDTO.setJwt(accessToken);
        return authResponseDTO;
    }
    private Authentication authenticate(String username, String password) throws BadRequestException {
        UserDetails userDetails = loadUserByUsername(username);
        System.out.println(userDetails);
        if(userDetails == null) {
            throw new BadCredentialsException(messages.getString("username.validate.invalid"));
        }
        if(!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException(messages.getString("password.validate.invalid"));
        }
        User user = userRepository.findByUsername(username).get();
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }
}
