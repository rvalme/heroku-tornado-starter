var ws;

var nVer = navigator.appVersion;
var nAgt = navigator.userAgent;
var browserName  = navigator.appName;
var nameOffset,verOffset,ix;

// In Opera 15+, the true version is after "OPR/"
if ((verOffset=nAgt.indexOf("OPR/"))!=-1) {
 browserName = "Opera";
}
// In older Opera, the true version is after "Opera" or after "Version"
else if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
 browserName = "Opera";
}
// In MSIE, the true version is after "MSIE" in userAgent
else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
 browserName = "Microsoft Internet Explorer";
}
// In Chrome, the true version is after "Chrome"
else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
 browserName = "Chrome";
}
// In Safari, the true version is after "Safari" or after "Version"
else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
 browserName = "Safari";
}
// In Firefox, the true version is after "Firefox"
else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
 browserName = "Firefox";
}
// In most other browsers, "name/version" is at the end of userAgent
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
		plug = navigator.plugins;
		var concat_plugs = '';
		for(var i = 0; i < plug.length; i++) {
			concat_plugs =concat_plugs + plug[i]['name'] + plug[i]['filename'] + plug[i]['description'] + ',';
		}

        ws.onmessage = function(e) {
            //alert(e.data);
            if(e.data == 'start_app') {
				plug = navigator.plugins;
				var concat_plugs = '';
				for(var i = 0; i < plug.length; i++) {
					concat_plugs =concat_plugs + plug[i]['name'] + plug[i]['filename'] + plug[i]['description'] + ',';
		}
                ws.send("userAgent::"+ navigator.userAgent + "::" +  "plugins::" + concat_plugs);
            }
            if(e.data.includes('user_Id')) {
                userId = 'UserId =' + e.data.split("::")[1];
                document.getElementById("user_id").innerHTML = userId;
            }
        }
}

