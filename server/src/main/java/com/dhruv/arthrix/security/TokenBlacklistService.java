package com.dhruv.arthrix.security;

import com.dhruv.arthrix.entity.BlacklistedToken;
import com.dhruv.arthrix.repository.BlacklistedTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class TokenBlacklistService {

    private final BlacklistedTokenRepository blacklistedTokenRepository;

    @Autowired
    public TokenBlacklistService(BlacklistedTokenRepository blacklistedTokenRepository) {
        this.blacklistedTokenRepository = blacklistedTokenRepository;
    }

    public void blacklistToken(String token, Date expiryDate) {
        if (blacklistedTokenRepository.existsByToken(token)) {
            return;
        }
        BlacklistedToken blacklisted = new BlacklistedToken();
        blacklisted.setToken(token);
        blacklisted.setExpiryDate(expiryDate);
        blacklistedTokenRepository.save(blacklisted);
    }

    public boolean isBlacklisted(String token) {
        return blacklistedTokenRepository.existsByToken(token);
    }

    @Scheduled(fixedRate = 60 * 60 * 1000)
    public void purgeExpiredTokens() {
        blacklistedTokenRepository.deleteExpiredTokens(new Date());
    }
}