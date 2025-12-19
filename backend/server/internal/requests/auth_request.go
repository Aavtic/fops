package requests

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Email string `json:"email"`
}
