FROM python:3.8-slim

# RUN apt-get update

RUN apt-get update && apt-get install -y \
  build-essential \
  default-libmysqlclient-dev

WORKDIR /app/backend

COPY . /app/backend/

RUN pip install -r requirements.txt

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]