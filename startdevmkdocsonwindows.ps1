# This is for running mkdocs locally on windows only. 
# Make sure you change directory to your docs folder before starting this process
# Use the "Run Selection" in VSCode to run the code blocks as-needed

# In case you have ExecutionPolicy Problems
Set-ExecutionPolicy -Scope CurrentUser Unrestricted

#Activate python
python -m venv env
.\env\Scripts\activate 

#Install requirements first time only
python -m pip install --upgrade pip #only 1st time
pip install --upgrade mkdocs mkdocs-material pymdown-extensions

#Run mkdocs and look at changes as you make them
Start-Process http://localhost:8005 #Opens Browser
mkdocs serve

#Stop python
deactivate