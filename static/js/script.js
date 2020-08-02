window.onload = function() {
	document.querySelectorAll("input[type=submit]").forEach(el => {
		el.addEventListener("click", uploadme)
	})
}

// upload the file via ajax
function uploadme(eve) {
	// comment this line to use ajax
	return
	eve.preventDefault();
	ele = eve.srcElement
	uploadfile = document.getElementById("img").files[0]
	// let reader = new FileReader()
	let fd = new FormData()
	fd.append(ele.name,"Upload "+ele.name)
	fd.append("file", uploadfile)

	let xhr = new XMLHttpRequest()
	xhr.upload.addEventListener("progress", (e) => {
		// controll progress bar
		let per = (e.loaded/e.total)*100
		console.log("prog",per+"%")
	})
	xhr.upload.addEventListener("load", (e) => {
		// end progress bar
		console.log("load: 100%")
	})
	xhr.onload = function(e) {
		// load data to user
		// console.log("onload",e)
		console.log(xhr.responseText)
	}
	xhr.open("POST","http://127.0.0.1:5000")
	xhr.send(fd)
	// xhr.send(evt.target.result)
	// reader.onload = function(evt) {
	// }
	// reader.readAsBinaryString(uploadfile)
}