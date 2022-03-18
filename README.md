# Building with Docker

```
git clone https://github.com/amidaware/trmm-docs.git
cd trmm-docs
./build.sh
```

# Building standard
```
git clone https://github.com/amidaware/trmm-docs.git
cd trmm-docs
python3 -m venv env
source env/bin/activate
pip install --upgrade pip
pip install --upgrade setuptools wheel
pip install mkdocs mkdocs-material pymdown-extensions
mkdocs serve
```

Browse to http://your-server-ip:8005
