FROM python:3.13-rc-slim

RUN apt-get update && apt-get install -y --no-install-recommends sqlite3 \
    && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir uv

WORKDIR /app
COPY backend/pyproject.toml .
COPY backend/uv.lock .
RUN uv pip install --system .

COPY backend/ ./backend/
COPY frontend/ ./frontend/

WORKDIR /app/backend
CMD ["python3", "main.py"]
