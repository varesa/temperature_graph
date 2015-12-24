var datapoints = {};
var request_size = 5000;
var chart;

function create_chart() {
    chart  = new CanvasJS.Chart("chart", {
        title: { text: "Temperature" },
        axisX: { title: "Time"},
        axisY: { title: "degrees C"},
        zoomEnabled: true,
        data: []
    });
    chart.render();
}

function set_status(status) {
    $("#status").text(status);
}

function process_values(response) {
    if (response.links.self != response.links.last) {
        get_values(response.links.next, response.links.last);
    } else {
        set_status("Completed");
    }
    var values = response.data;
    for(var x = 0; x < values.length; x++) {
        if(Object.keys(datapoints).indexOf(values[x].deviceId) == -1) {
            datapoints[values[x].deviceId] = [];
            chart.options.data.push({
                type: "line",
                xValueType: "dateTime",
                dataPoints: datapoints[values[x].deviceId]
            });
        }
        datapoints[values[x].deviceId].push({x: new Date(values[x].date), y: values[x].value});
    }

    chart.render();
}

function page_from_url(url) {
    var segments = url.split("/");
    return parseInt(segments[segments.length-1])+1;
}

function get_values(url, last) {
    url = url || "https://temperature-cache.esav.fi/values/limit/" + request_size + "/page/0";
    url = url.replace("-cache", "-data");
    if(last !== undefined) {
        set_status("Fetching " + url + " (" + page_from_url(url) + "/" + page_from_url(last) + ")");
    }
    $.get(url, process_values);
}

$(document).ready(function () {
    create_chart();
    get_values();
});
