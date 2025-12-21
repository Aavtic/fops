package auth;

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func createToken(username, email, secretKey string) (string, error) {
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, 
        jwt.MapClaims{
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

func verifyToken(tokenString, secretKey string) error {
   token, err := jwt.Parse(tokenString, func(token *jwt.Token) (any, error) {
      return []byte(secretKey), nil
   })
  
   if err != nil {
      return err
   }
  
   if !token.Valid {
      return fmt.Errorf("invalid token")
   }
   return nil
}
