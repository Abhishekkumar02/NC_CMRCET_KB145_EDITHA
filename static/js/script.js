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

	/*
		get all submit button
		like upload english and upload telugu
	 	and add event listener of click for uploading
		the user selected file via ajax
	*/
	document.querySelectorAll ( "input[type=submit]" ).forEach( function (element) {
		element.addEventListener ( "click", fetchResult )
	})

	/*
		get the click event of input button
		and make a ajax request to the server
	*/
	function fetchResult ( event ) {

		// stop default operation
		event.preventDefault();

		button = event.srcElement
		fileToUplaod = document.getElementById("img").files[0]

		let formData = new FormData()

		// set the language and file to be parsed
		formData.append(button.name,"1")
		formData.append("file", fileToUplaod)

		// initaiate the ajax request
		let send = xhr(
			'POST', '/',

			function handleProgress ( event ) {
				let percentage = (event.loaded/event.total)*100
				console.log("Uploading: ", percentage)
			},

			function handleUploaded ( event ) {
				console.log("done upload")
			}
		)
		
		// send the data to the server
		send(formData)
		.then(
			function handleResponse( responseText ) {
				console.log ( responseText )
			}
		)
		.catch(
			function handleError( status ) {
				console.error ( status )
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