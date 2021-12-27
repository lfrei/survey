package main

// https://github.com/99designs/gqlgen/blob/master/docs/content/recipes/cors.md
// https://github.com/99designs/gqlgen/blob/master/docs/content/recipes/gin.md

import (
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/lfrei/survey/vote-service/graph"
	"github.com/lfrei/survey/vote-service/graph/generated"
	"net/http"
	"time"
)

func newGraphQLServer(resolver *graph.Resolver) *handler.Server {
	srv := handler.New(generated.NewExecutableSchema(generated.Config{Resolvers: resolver}))

	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})
	srv.AddTransport(transport.MultipartForm{})

	srv.AddTransport(&transport.Websocket{
		Upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
		},
		KeepAlivePingInterval: 10 * time.Second,
	})

	return srv
}

func graphqlHandler(srv *handler.Server) gin.HandlerFunc {
	return func(c *gin.Context) {
		srv.ServeHTTP(c.Writer, c.Request)
	}
}

func playgroundHandler() gin.HandlerFunc {
	h := playground.Handler("GraphQL", "/query")

	return func(c *gin.Context) {
		h.ServeHTTP(c.Writer, c.Request)
	}
}

func statusHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.String(http.StatusOK, "Service UP")
	}
}

func newRouter(srv *handler.Server) *gin.Engine {
	r := gin.Default()
	r.Use(cors.Default()) //https://github.com/gin-contrib/cors

	r.GET("/status", statusHandler())
	r.GET("/playground", playgroundHandler())
	r.GET("/subscriptions", graphqlHandler(srv))
	r.POST("/query", graphqlHandler(srv))
	return r
}

func main() {
	resolver := graph.NewResolver()
	server := newGraphQLServer(resolver)
	router := newRouter(server)

	router.Run()
}
