FROM python:3.8-slim

WORKDIR /swiftshare_backend

COPY requirements.txt requirements.txt

RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "manage.py", "runserver"]
 