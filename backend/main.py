import os

import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from punq import Container

from src.app import TApp
from src.deps import get_container

if __name__ == "__main__":
    container: Container = get_container()
    app: TApp = container.resolve(TApp)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Для разработки, в проде укажите конкретные домены
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )

    STATIC_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../frontend/static"))
    app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")

    @app.get("/")
    async def serve_index():
        return FileResponse(os.path.join(STATIC_DIR, "index.html"))

    uvicorn.run(app, host="0.0.0.0", port=8000)
