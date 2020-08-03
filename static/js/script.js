/*
	script file for index.html
	sih2020 KB145
	Editha
	--------------------------------
	* sends the input to the server
	* display the progress of uploading file
	* display the result from the server to the user
	--------------------------------
*/

// after loading document
window.onload = function() {

	/*-----------------------------------VARIABLES----------------------------------------*/
	
	const DEBUG = {
		Log: true,
		Error: true
	};
	let resultText = ''
	let isSpeachOn = false
	console.log("Welcome to EDITHA KB145 PS 😉")
	
	/*-------------------------------EVENT LISTENETRS-------------------------------------*/
	
	/*
		get submit button
	 	and add event listener of click for uploading
		the user selected file via ajax
	*/
	document.querySelector ( ".dropdown-submit" ).addEventListener ( "click", fetchResult )

	// event on file select
	document.getElementById("img").addEventListener ( "change", handleSelectImage )

	// event on search from result
	document.querySelector("#searchText").addEventListener ( "keyup", searchText )

	// event on selecting drop down
	document.querySelector("div.dropdown-menu").addEventListener( "click", handleLangSelect )

	// reset result when clicked on close button
	document.querySelector(".closeResult").addEventListener ( "click", function handleResultClose ( event ) {
		
		event.srcElement.parentElement.classList.add ( "hidden" )
		event.srcElement.parentElement.querySelector(".outputResult").innerHTML = ""
		event.srcElement.parentElement.querySelector("#inputImage").style.background = 'none'
		event.srcElement.parentElement.querySelector("#searchText").value = ''
		document.getElementById("noOfSearch").innerHTML = ''
		document.getElementById("fileName").innerHTML = ''
		document.getElementById("copyToClipboard").classList.remove("green")
		resultText = ''
		
	})

	// copy result to clipboard
	document.getElementById("copyToClipboard").addEventListener("click", function copyToClipboard(event) {
		document.getElementById("originalData").select()
		document.execCommand("copy")
		event.srcElement.classList.add("green")
	})

	// download to txt file
	document.getElementById("downloadTxt").addEventListener("click", handleDownloadData)

	// voice rec
	document.querySelector(".startStopIcon").addEventListener("click", handleVoiceButton)

	// on lang change
	document.querySelector(".recLang").addEventListener("change", handleLangChange)

	/*-----------------------------------FUNCTIONS----------------------------------------*/

	function handleDownloadData( event ) {
		let filename = document.getElementById("fileName").innerText + '.txt'
		let element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + resultText );
		element.setAttribute('download', filename);
	
		element.style.display = 'none';
		document.body.appendChild(element);
	
		element.click();
	
		document.body.removeChild(element);
	}
	
	/*
		voice recog function recturn the controlles for
		start/stop/changlang of the speach recognition
	*/
	function makeSpeachRecog ( onres, onend ) {

			// is restart required
			let restart = false
			// default current language
			currentLang = 'English'
		
			// initiate speacg recognition
			var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
			var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
			var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

			var grammar = '#JSGF V1.0 UTF-8';

			var recognition = new SpeechRecognition();
			var speechRecognitionList = new SpeechGrammarList();
			speechRecognitionList.addFromString(grammar, 1);
			recognition.grammars = speechRecognitionList;
			recognition.continuous = true;
			
			// set default language
			recognition.lang = 'en-US';
			
			recognition.interimResults = true;
			recognition.maxAlternatives = 1;

			recognition.onresult = function ( event ) {
				let resCount = event.results.length
				let str=''
				for ( let i = 0; i < resCount; i++ ) {
					str += event.results[i][0].transcript
				}
				onres(str)
			}
			
			recognition.onend = function() {
				if ( restart ) {
					recognition.start()
					restart = false
				}	else {
					recognition.stop()
					onend()
				}
			}
			
			// return callback functions
			return {
				startSpeach: function startSpeach() { 
					recognition.start()
				},
				setLang: function setLang( lang ) {
					if ( lang == "Telugu" ) {
						recognition.lang = 'te-IN'
					} else if ( lang == 'English' ) {
						recognition.lang = 'en-IN'
					} else {
						recognition.lang = 'ur-IN'
					}
				},
				endSpeach: function endSpeach() {
					recognition.stop()
				},
				getCurrentLang: function getCurrentLang() {
					return currentLang
				},
				restartSpeach: function restartSpeach() {
					restart = true
				}
			}
			
	}
	
	// create a speach object
	const speach = makeSpeachRecog ( handleSpeachData, handleSpeachEnd )
	
	// handle when voice button is clicked
	function handleVoiceButton () {
		let element = document.querySelector(".startStopIcon")
		if ( !isSpeachOn ) {
			isSpeachOn = true
			handleLangChange(true)
			element.innerHTML = '<i class="fa fa-microphone" aria-hidden="true"></i>'
		} else {
			speach.endSpeach()
			isSpeachOn = false
			element.innerHTML = '<i class="fa fa-microphone-slash" aria-hidden="true"></i>'
		}

	}
	
	// handle when language is changed from dropdown
	// menu of speach recogination
	function handleLangChange (start) {
		if ( isSpeachOn ) {
			let selLang = document.querySelector(".recLang").value
			speach.endSpeach()
			speach.setLang ( selLang )
			
			// first time ?
			if ( start === true ) {
				speach.startSpeach()
			} else {
				speach.restartSpeach()
			}

		}
	}

	// handle the data from the speach recogination
	function handleSpeachData ( data ) {
		
		let inputElement = document.getElementById("searchText")

		// disable the input field and
		// set the data
		inputElement.disable = true
		inputElement.value = data
		
		// trigger the change event
		// let changeEvent = new Event('change');
		// inputElement.dispatchEvent(changeEvent);
		searchText()
		
	}
	
	function handleSpeachEnd () {
		
		let inputElement = document.getElementById("searchText")
		
		// enable the input field
		inputElement.disable = false

		// change the mic back to slash
		document.querySelector(".startStopIcon").innerHTML = '<i class="fa fa-microphone-slash" aria-hidden="true"></i>'
		
	}
	
	/*
		handle the click event on language selection
		dropdown
	*/
	function handleLangSelect ( event ) {
		
		// prevent going to #
		event.preventDefault()

		let selectElement = event.srcElement
		// to be shown as placeholder
		let buttonElement = selectElement.parentElement.previousElementSibling
		// element in with data to be saved of selected language
		let dataElement = buttonElement.parentElement

		// save the selected info
		let selectedInfo = {
			value: selectElement.getAttribute("data-val"),
			text: selectElement.innerHTML
		}

		// toogle data b/w selected element and 
		// placeholder element
		selectElement.innerHTML = buttonElement.innerHTML
		selectElement.setAttribute("data-val", dataElement.getAttribute("data-val"))
		dataElement.setAttribute("data-val", selectedInfo.value)
		buttonElement.innerHTML = selectedInfo.text
		
		if ( DEBUG.Log ) {
			console.log(event)
		}
	}
	
	/*
		make result text for displaying
	*/
	function makeResult ( responseText, search = false ) {

		if ( search == false ) {
			resultText = responseText
		}

		let outputHtml = ''
		
		outputHtml = responseText.replace(/\n/g,'</br>')
		
		document.querySelector(".outputResult").innerHTML = outputHtml
		document.querySelector("section.result").classList.remove("hidden")

		// scroll to result
		if ( search == false ) {
			scrollUpTo = document.querySelector("nav.navbar").scrollHeight + document.querySelector(".sectionDiv").scrollHeight
			window.scroll( 0, scrollUpTo - 100 )
		}

	}

	/*
		Search from result
	*/
	function searchText ( event ) {
		if ( DEBUG.Log ) {
			console.log( event )
		}

		let countElement = document.getElementById("noOfSearch")
		
		let searchText = document.getElementById("searchText").value.trim()
		if ( searchText.length == '' ) {
			makeResult ( resultText, true )
			countElement.innerHTML = ''
			return
		}
		
		// match all regex
		let exp = new RegExp(searchText, "ig")
		let result = [...resultText.matchAll(exp)]


		let outputText = resultText.split(exp)

		// set count
		countElement.innerHTML = "Search Count: " + result.length

		// insert mark of searched element
		let i = 0;
		result.forEach( function handleSearch( result ) {
			outputText[i] = outputText[i] + '<span class="mark">' + result[0] + '</span>'
			i++
		})
		
		makeResult ( outputText.join(''), true )
		
		if ( DEBUG.Log ) {
			console.log(searchText, result)
		}

	}

	/*
		Detect file select changes and update status
	*/
	function handleSelectImage( event ) {
		
		// remove previous result
		document.querySelector(".closeResult").click()
		
		let statusElement = document.querySelector(".text.text-upload")
		let choosenFile = event.srcElement.files[0]
		let imgElement = document.querySelector("#inputImage")
		let fileNameHolder = document.getElementById("fileName");
		
		if ( DEBUG.Log ) {
			console.log(choosenFile)
		}
		
		// text to display
		statusElement.innerHTML = "File: " + choosenFile.name
		fileNameHolder.innerHTML = "File: " + choosenFile.name
		
		// if selected file is an image
		// then show the image preview in result
		if ( choosenFile.type.indexOf("image") != -1 ) {
		
			imgElement.style.background = "url(" + URL.createObjectURL(choosenFile) + ")"
			imgElement.parentElement.classList.remove ( "remove" )
			imgElement.onload = function() {
				URL.revokeObjectURL(this.src)
			}
			
		} else {
			imgElement.parentElement.classList.add("remove")
		}

		// show filename
		this.parentElement.classList.add("drop");
		this.parentElement.classList.remove("drag");

		
	}

	/*
		get the click event of input button
		and make a ajax request to the server
	*/
	function fetchResult ( event ) {

		// stop default operation
		event.preventDefault();

		let selectedLanguage = event.srcElement.previousElementSibling.getAttribute("data-val")
		let statusElement = document.querySelector(".text.text-upload")
		let fileElement = document.getElementById("img")

		// if no file selected
		if ( fileElement.files.length == 0 ) {
			statusElement.previousElementSibling.innerHTML = "Please Select or DROP a File"
			statusElement.previousElementSibling.classList.add("shake")
			return
		}
		
		fileToUplaod = fileElement.files[0]

		let formData = new FormData()

		// set the language and file to be parsed
		formData.append(selectedLanguage,"1")
		formData.append("ajax","1")
		formData.append("file", fileToUplaod)

		// initaiate the ajax request
		let send = xhr(
			'POST', '/',

			function handleProgress ( event ) {
				let percentage = (event.loaded/event.total)*100
				statusElement.innerHTML = 'Uploading File: '+parseInt(percentage)+'%'
			},

			function handleUploaded ( event ) {
				statusElement.parentElement.classList.add("done")

				// show waiting after uploading image
				// and tick animation is over
				setTimeout(function startWaiting() {
					statusElement.innerHTML = "Waiting For Result..."
					statusElement.parentElement.classList.remove("done")
				}, 2000)

				if ( DEBUG.Log ) {
					console.log("doone uploading")
				}
				
			}
		)
		
		// send the data to the server
		send(formData)
		.then(
			function handleResponse( responseText ) {
				
				// reverse back the upload status
				statusElement.innerHTML = ""
				statusElement.parentElement.classList.remove("done")
				statusElement.parentElement.classList.remove("drop")
				fileElement.value = ''

				document.getElementById("originalData").value = responseText
				makeResult(responseText)
				
				if ( DEBUG.Log ) {
					console.log ( responseText )
				}
				
			}
		)
		.catch(
			function handleError( status ) {
				if ( DEBUG.Error ) {
					console.error ( "Failed to get result", status, "😥" )
				}
			}
		)
		
	}

	/*
		create a ajax request
	*/
	function xhr( type, url, progressEvent, loadEvent ) {

		let xhr = new XMLHttpRequest()
		xhr.upload.addEventListener("progress", progressEvent )
		xhr.upload.addEventListener("load", loadEvent )
		
		return function( data ) {
			return new Promise( function (resolve, reject) {
				
				xhr.onreadystatechange = function() {
					if ( xhr.status == 200 && xhr.readyState == 4 ) {
						resolve ( xhr.responseText )
					} if ( xhr.readyState == 4 ) {
						reject ( xhr.status )
					}
				}
				
				xhr.open( type, url )
				xhr.send( data )
			})
		}

	}

}