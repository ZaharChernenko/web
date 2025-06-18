### Запустить код:
```shell
docker build -t web .
# в контейнере должен быть обязательно 8000 порт, т.к. на нем работает uvicorn
docker run -p 8000:8000 web
```
### Точка входа:
localhost:8000/
### Пример работы:
Uploading web.mp4…
