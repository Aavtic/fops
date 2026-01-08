package auth;

import (
	"fmt"
	"time"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
)

func createToken(userId, username, email, secretKey string) (string, error) {
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, 
        jwt.MapClaims{
					"user_id": userId,
					"username": username, 
					"email": email, 
					"exp": time.Now().Add(time.Hour * 24).Unix(), 
        })

    tokenString, err := token.SignedString([]byte(secretKey))
    if err != nil {
			return "", err
    }

 return tokenString, nil
}

func verifyToken(tokenString, secretKey string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (any, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return []byte(secretKey), nil
	})

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	return claims, nil
}

func getTokenFromCookie(r *http.Request) (string, error) {
	cookie, err := r.Cookie("auth")
	if err != nil {
		return "", err
	}
	return cookie.Value, nil
}

func parseToken(tokenString, secretKey string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (any, error) {
		// Ensure signing method is HMAC
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return []byte(secretKey), nil
	})

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	return claims, nil
}

func getUserFromRequest(r *http.Request, secretKey string) (string, string, string, error) {
	tokenString, err := getTokenFromCookie(r)
	if err != nil {
		return "", "", "", err
	}

	claims, err := parseToken(tokenString, secretKey)
	if err != nil {
		return "", "", "", err
	}

	userID := claims["user_id"].(string)
	username := claims["username"].(string)
	email := claims["email"].(string)

	return userID, username, email, nil
}
