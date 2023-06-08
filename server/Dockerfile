FROM python:3.11-alpine

RUN adduser -D apiuser && \
    apk update && \
    apk --no-cache add curl && \
    apk --no-cache add openssh-keygen && \
    mkdir /home/apiuser/.ssh && \
    mkdir /home/apiuser/app && \
    ssh-keygen -t rsa -f /home/apiuser/.ssh/id_rsa -N "" && \
    chown -R apiuser:apiuser /home/apiuser/.ssh/* && \
    pip install -U pip

COPY requirements.txt .

COPY app /home/apiuser/app

RUN pip install -r requirements.txt

WORKDIR /home/apiuser/

ARG DB_PORT
ARG DB_NAME
ARG DB_USERNAME
ARG DB_PWD

ENV DB_HOSTNAME=mysqldb
ENV DB_PORT=$DB_PORT
ENV DB_NAME=$DB_NAME
ENV DB_USERNAME=$DB_USERNAME
ENV DB_PWD=$DB_PWD
ENV LOG_FOLDER='/home/apiuser/app/logs'

RUN chown -R apiuser:apiuser *

USER apiuser

CMD uvicorn app.main:app --host 0.0.0.0