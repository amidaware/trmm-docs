FROM python:3.10-alpine

COPY requirements.txt /tmp/requirements.txt

RUN pip install --upgrade pip && \ 
    pip install --upgrade setuptools wheel && \
    pip install -r /tmp/requirements.txt 

EXPOSE 8005

WORKDIR /trmm-docs

ENTRYPOINT ["mkdocs"]

CMD ["serve", "--dev-addr=0.0.0.0:8005"]