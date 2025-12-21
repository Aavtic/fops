package requests

import (
	"github.com/go-ozzo/ozzo-validation/v4"
	"github.com/go-ozzo/ozzo-validation/v4/is"
)

type SignupRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Email string `json:"email"`
}

func (req SignupRequest) Validate() error {
	return validation.ValidateStruct(&req,
		validation.Field(&req.Username, validation.Required, validation.Length(5, 50)),
		validation.Field(&req.Password, validation.Required, validation.Length(8, 50)),
		validation.Field(&req.Email, validation.Required, is.Email),
	)
}

type LoginRequest struct {
	Email string `json:"email"`
	Password string `json:"password"`
}

func (req LoginRequest) Validate() error {
	return validation.ValidateStruct(&req,
		validation.Field(&req.Email, validation.Required, is.Email),
	)
}
