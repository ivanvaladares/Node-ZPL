var http = require('http');
var gui = require('nw.gui');
var fs  = require('fs'); 
var url = require('url');
var path = require('path');


// ini - code to control the window and the tray icon
var win = gui.Window.get();
var tray;

win.on('minimize', function() {
	this.hide();

	tray = new gui.Tray({ icon: 'icon.png' });

	// Show window and remove tray when clicked
	tray.on('click', function() {
		win.show();
		win.restore();
		this.remove();
		tray = null;
		});
});

win.minimize();
// end - code to control the window and the tray icon




function handleRequest(request, response){

	response.setHeader('Access-Control-Allow-Origin', '*');

	response.setHeader('Access-Control-Allow-Methods', 'GET, POST');

	response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');	

	var POST = {};
	if (request.method == 'POST') {
		request.on('data', function(data) {
		    data = data.toString();
		    data = data.split('&');
		    
		    for (var i = 0; i < data.length; i++) {
			var _data = data[i].split("=");
			POST[_data[0]] = _data[1];
		    }
		    
		    console.log(POST); //POST object containig form fields
		    
		    //todo: create a control to protect printer from malicious softwares
		    
		    printLabel(decodeURIComponent(POST.etiqueta).replace(/\+/g, ' '), decodeURIComponent(POST.impressora).replace(/\+/g, ' ')).then(function(successurl){
			response.writeHead(200);
			response.end("OK");
		    }).then(undefined, function(error){
			response.end("ERROR: " + error);
		    });
	    
		});
	}else{
		response.writeHead(501);
		response.end("Not Implemented!");
	}
}

var server = http.createServer(handleRequest);

server.listen(portaServidor, function(){
    console.log("Server listening on: http://localhost:%s", portaServidor);
});


function copyFile(source, target) {
    return new Promise(function(resolve, reject) {
    
        var rd = fs.createReadStream(source);
        rd.on('error', reject);
        
        var wr = fs.createWriteStream(target);
        wr.on('error', reject);
        wr.on('finish', resolve);
        rd.pipe(wr);
        
    });
}

function printLabel(texto, impressora){
	return new Promise(function(resolve, reject) {
		var tempLabelPath = path.join(require('nw.gui').App.dataPath, 'etiqueta.etq');

		fs.writeFile(path.join(require('nw.gui').App.dataPath, 'etiqueta.etq'), texto, function(err) {
			if(err) {
				reject(error);
			}

			copyFile(tempLabelPath, impressora).then(function(successurl){
				resolve();
			}).then(undefined, function(error){
				reject(error);
				console.log('Error: ' + error)
			});
		}); 
	});
}