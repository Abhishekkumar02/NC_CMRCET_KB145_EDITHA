#!/bin/bash

# check if python3 is installed
if !python3 &> /dev/null; then
	echo -e "python3 not found\ninstall it by command: sudo apt install python3"
else
	# check if pip3 is installed
	if !pip3 &> /dev/null; then
		echo -e "pip3 is not installed\ninstall it by command: sudo apt install pip3"
	else	
		# install requirements
		# grep is used to remove Requirement already satisfied lines
		pip3 install -r requirements.txt | grep -v 'already satisfied'
		
		# run the main file
		python3 main.py
	fi
fi