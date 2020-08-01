window.onload = function() {
	document.querySelectorAll(".btnSubmit").forEach(el => {
		el.addEventListener("click", uploadme)
	})
}

// upload the file via ajax
function uploadme(eve) {
	eve.preventDefault();
	ele = eve.srcElement
	uploadfile = document.getElementById("img").files[0]
	// let reader = new FileReader()
	let fd = new FormData()
	fd.append("file", uploadfile)

	let xhr = new XMLHttpRequest()
	xhr.upload.addEventListener("progress", (e) => {
		console.log(e)
	})
	xhr.upload.addEventListener("load", (e) => {
		console.log(e)
	})
	xhr.onload = function(e) {
		console.log(e)
		console.log(xhr.responseText)
	}
	xhr.open("POST","http://127.0.0.1:5000?lang="+ele.value.split(' ')[1])
	xhr.send(fd)
	// xhr.send(evt.target.result)
	// reader.onload = function(evt) {
	// }
	// reader.readAsBinaryString(uploadfile)
}