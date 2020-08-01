#!/bin/bash

check=1

# check for requirements
if ! python3 --version &> /dev/null; then
	echo -e "python3 not installed\ninstall it by command: sudo apt install python3"
	check=0
elif ! pip3 --version &> /dev/null; then
	echo -e "pip3 not installed\ninstall it by command: sudo apt install python3-pip"
	check=0
elif ! tesseract --version &> /dev/null; then
	check=0
	echo -e "installing tesseract"
	sudo apt install tesseract-ocr tesseract-ocr-tel tesseract-ocr-eng -y
	check=1
fi

# check if all requirements satisfied
if [[ $check == 1 ]]; then
	
	# installed python requirements
	python3 -m pip install -r requirements.txt | grep -v 'already satisfied'

	# run the server
	python3 main.py
	
fi