var PADDING = 1.0;
var WIDTH_LIMIT = 180;
if (window.File && window.FileReader && window.FileList && window.Blob) {
	$("#file-api-issue").hide();
	$("#file-form").show();
} else {
	$("#file-api-issue").show();
	$("#file-form").hide();
}

function handleFileSelect(evt) {
	var files = evt.target.files; // FileList object
	// files is a FileList of File objects. List some properties.
	var output = [];
	if (files.length <= 0) return;
	var file = files[0];
	if (!file.type.toString().startsWith("image/")) {
		$("#and-save").hide();
		$("#image-result").hide();
		alert('Oops, the file type is not correct.');
		return;
	}
	process(file);
}
document.getElementById('file-select-button-native').addEventListener('change', handleFileSelect, false);
$("#file-select-button").click(function() {
	$("#file-select-button-native").click();
});

function process(file) {
	var img = new Image();
	img.onload = function() {
		var canvas = document.createElement('canvas');
		var imgH = img.height;
		var imgW = img.width;
		if (imgW > WIDTH_LIMIT) {
			imgH = imgH / imgW * WIDTH_LIMIT;
			imgW = WIDTH_LIMIT;
		}
		canvas.height = imgH + PADDING * 6;
		canvas.width = imgW + PADDING * 6;
		var context = canvas.getContext('2d');
		context.fillStyle = "#ffffff";
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = "#000000";
		context.fillRect(PADDING, PADDING, canvas.width - PADDING * 2, canvas.height - PADDING * 2);
		context.fillStyle = "#ffffff";
		context.fillRect(PADDING*2, PADDING*2, canvas.width - PADDING * 4, canvas.height - PADDING * 4);
		context.drawImage(img, PADDING * 3, PADDING * 3, imgW, imgH);
		var encoder = new GIFEncoder();
		encoder.start();
		encoder.addFrame(context);
		encoder.finish();
		var binary_gif = encoder.stream().getData();
		var data_url = 'data:image/gif;base64,' + encode64(binary_gif);
		//console.log(data_url);
		$("#image-result").attr("src", data_url);
		$("#image-result").show();
		$("#and-save").show();
	}
	img.src = URL.createObjectURL(file);
}