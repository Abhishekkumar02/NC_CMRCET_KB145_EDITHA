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
		Log: false,
		Error: true
	};
	let resultText = ''
	console.log("Welcome to EDITHA KB145 PS 😉")
	
	/*-------------------------------EVENT LISTENETRS-------------------------------------*/
	
	/*
		get all submit button
		like upload english and upload telugu
	 	and add event listener of click for uploading
		the user selected file via ajax
	*/
	document.querySelectorAll ( "input[type=submit]" ).forEach( function (element) {
		element.addEventListener ( "click", fetchResult )
	})

	document.getElementById("img").addEventListener ( "change", handleSelectImage )

	document.querySelector("#searchText").addEventListener ( "keyup", searchText )

	document.querySelector(".closeResult").addEventListener ( "click", function handleResultClose ( event ) {
		
		event.srcElement.parentElement.classList.add ( "hidden" )
		event.srcElement.parentElement.querySelector(".outputResult").innerHTML = ""
		event.srcElement.parentElement.querySelector("#inputImage").style.background = 'none'
		event.srcElement.parentElement.querySelector("#searchText").value = ''
		resultText = ''
		
	})

	/*-----------------------------------FUNCTIONS----------------------------------------*/
	
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
		scrollUpTo = document.querySelector("nav.navbar").scrollHeight + document.querySelector(".sectionDiv").scrollHeight
		window.scroll( 0, scrollUpTo + 100 )

	}

	/*
		Search from result
	*/
	function searchText ( event ) {
		if ( DEBUG.Log ) {
			console.log( event )
		}

		let countElement = document.getElementById("noOfSearch")
		
		let searchText = event.srcElement.value
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
		countElement.innerHTML = result.length
		// let result = resultText.replace(exp,'<span class="mark">'+searchText+'</span>')

		// makeResult ( result, true )
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

		if ( DEBUG.Log ) {
			console.log(choosenFile)
		}
		
		// text to display
		statusElement.innerHTML = "File: " + choosenFile.name
		
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

		let button = event.srcElement
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
		formData.append(button.name,"1")
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