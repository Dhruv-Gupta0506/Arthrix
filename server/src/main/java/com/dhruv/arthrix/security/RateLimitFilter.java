package com.dhruv.arthrix.security;

import com.dhruv.arthrix.response.ApiResponse;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

// Applies a token-bucket rate limit per client IP, scoped to auth endpoints only —
// these are your most abuse-prone routes (login redirect, logout) since they're
// reachable without a valid JWT and could be hammered by a script.
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private static final Logger logger = LogManager.getLogger(RateLimitFilter.class);

    // One bucket per IP address, kept in memory. Fine for a single-instance deployment;
    // if you ever run multiple app instances behind a load balancer, this would need to
    // move to a shared store (Redis) so limits are enforced consistently across instances.
    private final ConcurrentMap<String, Bucket> buckets = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();

        // Only rate-limit auth-related endpoints — everything else passes straight through.
        // /oauth2/authorization/google (login start), /login/oauth2/code/google (OAuth callback),
        // /api/auth/logout — these don't require a JWT, so they're the ones a bad actor could hit repeatedly.
        boolean isAuthEndpoint = path.startsWith("/oauth2/") || path.startsWith("/login/") || path.startsWith("/api/auth/");

        if (!isAuthEndpoint) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientIp = getClientIp(request);
        Bucket bucket = buckets.computeIfAbsent(clientIp, ip -> newBucket());

        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
        } else {
            logger.warn("Rate limit exceeded for IP {} on path {}", clientIp, path);

            response.setStatus(429); // 429 Too Many Requests
            response.setContentType("application/json");
            ApiResponse<Void> body = ApiResponse.error("Too many requests. Please try again later.");
            response.getWriter().write(objectMapper.writeValueAsString(body));
        }
    }

    // 10 requests per minute per IP, refilled gradually (not all at once every 60s) —
    // this is intentionally generous for normal login use but stops a rapid-fire script.
    private Bucket newBucket() {
        Bandwidth limit = Bandwidth.classic(10, Refill.greedy(10, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    // X-Forwarded-For is checked first in case you're ever behind a reverse proxy (nginx,
    // a cloud load balancer) in Phase 15 deployment — falls back to the direct connection
    // IP for local testing, which is what you'll see right now.
    private String getClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}