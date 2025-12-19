package markdown

import (
	"net/http"

	"github.com/aavtic/fops/utils/markdown"

	"github.com/gin-gonic/gin"
)

type MarkdownHandler struct {}

func NewMarkdownHandler() MarkdownHandler {
	return MarkdownHandler{}
}

func (*MarkdownHandler) Render_custom_markdown() gin.HandlerFunc {
	return func(c *gin.Context) {

		type renderCustomMarkdownResponse struct {
			Html string `json:"html"`
		}
		type renderCustomMarkdownRequest struct {
			Markdown string `json:"markdown"`
		}
		var request renderCustomMarkdownRequest
		if c.Bind(&request) == nil {
			html := markdown.MDToHTML([]byte(request.Markdown))
			html_string := string(html)
			var response renderCustomMarkdownResponse
			response.Html = html_string
			c.JSON(http.StatusOK, response)
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Incorrect input json"})
		}
	}
}
