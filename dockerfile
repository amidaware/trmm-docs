FROM python:3.9-alpine

RUN pip install --upgrade pip && \ 
    pip install --upgrade setuptools wheel && \
    pip install mkdocs mkdocs-material pymdown-extensions 

EXPOSE 8005

WORKDIR /trmm-docs

ENTRYPOINT ["mkdocs"]

CMD ["serve", "--dev-addr=0.0.0.0:8005"]