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
	
	/*-----------------------------------FUNCTIONS----------------------------------------*/

	/*
		Search from result
	*/
	function searchText ( event ) {
		if ( DEBUG.Log ) {
			console.log( event )
		}

		let resultText = document.querySelector(".outputResult").innerText

		// match all regex
		let exp = new RegExp(event.srcElement.value, "ig")
		let result = [...resultText.matchAll(exp)]

		if ( DEBUG.Log ) {
			console.log(result)
		}

	}

	/*
		Detect file select changes and update status
	*/
	function handleSelectImage( event ) {
		
		let statusElement = document.querySelector(".text.text-upload")
		let choosenFile = event.srcElement.files[0]
		let imgElement = document.querySelector("#inputImage")
		
		statusElement.innerHTML = "File: "+choosenFile.name

		imgElement.src = URL.createObjectURL(choosenFile)
		imgElement.onload = function() {
			URL.revokeObjectURL(this.src)
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
		let fileToUplaod = document.getElementById("img").files[0]

		let formData = new FormData()

		// set the language and file to be parsed
		formData.append(button.name,"1")
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

				// do something for displaying the result
				// temperory response display
				document.querySelector(".outputResult").innerHTML = responseText
				
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