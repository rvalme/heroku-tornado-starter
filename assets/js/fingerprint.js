var ws;


function sendMsg() {
    ws.send(document.getElementById('msg').value);
}
function userTrack() {
        ws = new WebSocket("ws://localhost:5000/websocket");
        var x = "User-agent header sent: " + navigator.userAgent;
        document.getElementById("user_agent").innerHTML = x;

        ws.onmessage = function(e) {
            alert(e.data);
        }
}
