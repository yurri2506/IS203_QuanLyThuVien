package com.library_web.library.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import java.util.Map;

import com.library_web.library.model.User;

public class JwtUtil {

    private static final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private static final long ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 5; // 5 phút
    private static final long REFRESH_TOKEN_EXPIRATION = 1000 * 60 * 60 * 24 * 7; // 1 tuần

    public static String generateAccessToken(String username) {

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION))
                .signWith(key)
                .compact();
    }

    public static String generateRefreshToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION))
                .signWith(key)
                .compact();
    }

    public static Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public static boolean isTokenExpired(String token) {
        try {
            return parseClaims(token).getExpiration().before(new Date());
        } catch (JwtException e) {
            return true;
        }
    }

    public static String validateToken(String token) {
        return parseClaims(token).getSubject();
    }

    public static Map<String, Object> getPayload(String token) {
        Claims claims = parseClaims(token);
        return Map.of(
            "username", claims.getSubject(),
            "email", claims.get("email"),
            "phone", claims.get("phone"),
            "fullname", claims.get("fullname"),
            "role", claims.get("role")
        );
    }
}
