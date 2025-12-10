from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from app.routers import cipher
import time

app = FastAPI(
    title="Cifrado de Hill",
    description="Aplicación web para encriptar/desencriptar mensajes usando el Cifrado de Hill",
    version="1.0.0"
)

app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")

app.include_router(cipher.router, prefix="/api", tags=["cipher"])

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    # Pasamos un parámetro "static_version" con timestamp para forzar cache-busting
    static_version = int(time.time())
    return templates.TemplateResponse("index.html", {"request": request, "static_version": static_version})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
