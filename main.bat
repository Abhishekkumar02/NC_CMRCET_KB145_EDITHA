@echo off
echo Welcome to OCR Software by Editha Team!
python --version 3>NUL
if errorlevel 1 goto errorNoPython
pip install -r requirements.txt
python main.py
:errorNoPython
echo Error^: Python 3 not installed. Please install python in your system and re-run the script.