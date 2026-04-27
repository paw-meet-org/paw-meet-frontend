{
    "service": "paw-meet-frontend-api",
    "message": "Proxy routes backed by generated OpenAPI client",
    "endpoints": [
        {
            "method": "GET",
            "path": "/api/backend/health"
        },
        {
            "method": "POST",
            "path": "/api/login"
        },
        {
            "method": "POST",
            "path": "/api/registro"
        },
        {
            "method": "GET, PATCH",
            "path": "/api/user"
        },
        {
            "method": "GET",
            "path": "/api/encuentros"
        },
        {
            "method": "POST",
            "path": "/api/encuentros"
        },
        {
            "method": "GET",
            "path": "/api/user/mascotas"
        },
        {
            "method": "POST",
            "path": "/api/user/mascotas"
        },
        {
            "method": "GET",
            "path": "/api/social/foros"
        },
        {
            "method": "GET, POST",
            "path": "/api/social/foros/:id/temas"
        },
        {
            "method": "GET, POST, DELETE",
            "path": "/api/social/foros/:id/publicaciones"
        },
        {
            "method": "GET, POST",
            "path": "/api/admin/users"
        },
        {
            "method": "GET, PATCH, DELETE",
            "path": "/api/admin/users/:id"
        },
        {
            "method": "GET, POST",
            "path": "/api/admin/sponsors"
        },
        {
            "method": "GET, PATCH, DELETE",
            "path": "/api/admin/sponsors/:id"
        },
        {
            "method": "GET, POST",
            "path": "/api/admin/ciudades"
        },
        {
            "method": "GET, POST",
            "path": "/api/admin/razas"
        },
        {
            "method": "GET",
            "path": "/api/admin/moderacion"
        },
        {
            "method": "DELETE",
            "path": "/api/admin/moderacion/:id?user=:user"
        }
    ]
}