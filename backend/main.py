import uvicorn
from punq import Container

from src.app import TApp
from src.deps import get_container

if __name__ == "__main__":
    container: Container = get_container()
    app: TApp = container.resolve(TApp)
    uvicorn.run(app, host="localhost", port=8000)
