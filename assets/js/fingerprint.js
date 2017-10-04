var ws;

var nVer = navigator.appVersion;
var nAgt = navigator.userAgent;
var browserName  = navigator.appName;
var nameOffset,verOffset,ix;

if ((verOffset=nAgt.indexOf("OPR/"))!=-1) {
 browserName = "Opera";
}
else if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
 browserName = "Opera";
}
else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
 browserName = "Microsoft Internet Explorer";
}
else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
 browserName = "Chrome";
}
else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
 browserName = "Safari";
}
else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
 browserName = "Firefox";
}
else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
          (verOffset=nAgt.lastIndexOf('/')) )
{
 browserName = nAgt.substring(nameOffset,verOffset);
 if (browserName.toLowerCase()==browserName.toUpperCase()) {
  browserName = navigator.appName;
 }
}

function sendMsg() {
    ws.send(document.getElementById('msg').value);
}
function userTrack() {
        ws = new WebSocket("ws://rsvalme.herokuapp.com/websocket");
        //ws = new WebSocket("ws://localhost:5000/websocket");
        document.getElementById("user_browser").innerHTML = 'Browser Name: ' +browserName;
        ws.onmessage = function(e) {
            //alert(e.data);
            if(e.data == 'start_app') {
				//plugin detection
				plug = navigator.plugins;
				var concat_plugs = '';
				for(var i = 0; i < plug.length; i++) {
					concat_plugs =concat_plugs + plug[i]['name'] + plug[i]['filename'] + plug[i]['description'] + ',';
		}
				//font detection
				var detective = new Detector();
				var font_str = ''
				var fonts = ['cursive', 'monospace', 'serif', 'sans-serif', 'fantasy', 'default', 'Arial', 'Arial Black', 'Arial Narrow', 'Arial Rounded MT Bold', 'Bookman Old Style', 'Bradly Hand ITC', 'Century', 'Courier', 'Courier New', 'Georgia', 'Gentium', 'Impact', 'King', 'Lucida Console', 'Lalit', 'Modena', 'Monotype Corsiva', 'Papyrus', 'Tahoma', 'TeX', 'Times', 'Times New Roman', 'Verdana', 'Verona'];
				for(var i = 0; i < fonts.length; i++) {
					font_str = font_str + fonts[i] + '_' + detective.detect(fonts[i]) + ',';
				}
                ws.send("userAgent::"+ navigator.userAgent + "::" +  "plugins::" + concat_plugs + "::" + "fonts::" + font_str);
            }
            if(e.data.includes('user_Id')) {
                userId = 'UserId =' + e.data.split("::")[1];
                document.getElementById("user_id").innerHTML = userId;
            }
        }
}

