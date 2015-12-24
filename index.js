
var values = {};

function display_values() {
    var keys = Object.keys(values);
    for(var x = 0; x < keys.length; x++) {
	var key = keys[x];
	console.log(key);
	var element = $("<div/>").html("<h1>" + Math.round(parseFloat(values[key])*100)/100 + "</h1>" + "<br>" + "<h3>" + key + "</h3>" + "<br><br>");
	$("#container").append(element);
    }
}

function get_values(url, last) {
    url = url || "https://temperature-cache.esav.fi/values/limit/" + 50 + "/page/0";
    url = url.replace("-cache", "-data");
    $.get(url, function(response) {
	$.get(response.links.last, function(reponse) {
	    var data = response.data;
	    for(var x = 0; x < data.length; x++) {
		values[data[x].deviceId] = data[x].value;
	    }
	    display_values();
	});
    });
}

$(document).ready(function () {
    get_values();
});
