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
	echo -e "installing tesseract and poppler"
	sudo apt install tesseract-ocr tesseract-ocr-tel tesseract-ocr-eng tesseract-ocr-urd -y
	sudo apt-get install -y poppler-utils
	check=1
else
	lang=$(tesseract --list-langs | egrep -i '^(urd|tel|eng)')
	if ! [[ $lang[0] =~ "eng" && $lang[1] =~ "tel" && $lang[2] =~ "urd" ]]; then
		sudo apt install tesseract-ocr tesseract-ocr-tel tesseract-ocr-eng tesseract-ocr-urd -y
	fi
fi

# check if all requirements satisfied
if [[ $check == 1 ]]; then
	
	# installed python requirements
	python3 -m pip install -r requirements.txt | grep -v 'already satisfied'

	# run the server
	python3 main.py
	
fi