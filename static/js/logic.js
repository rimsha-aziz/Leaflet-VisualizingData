

//url link to GEOJSON 
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Grab data with d3
d3.json(url, function(data) {
    createFeatures(data.features);
});

// Create function to create circular features
function createFeatures(data) {
    //map oject 
    var myMap = L.map("map", {
        center: [39.83, -98.58],
        zoom: 4
    });

    // Adding tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
}).addTo(myMap);


    //   make markers
    data.forEach(feature => {
        var mag = feature.properties.mag;

        var colour = "";
        if (mag <= 1) {
            colour = "green";
        }
        else if (mag <= 2) {
            colour = "yellow";
        }
        else if (mag <= 3) {
            colour = "#E59866";
        }
        else if (mag <= 4) {
            colour = "orange";
        }
        else if (mag <= 5) {
            color = "#D35400";
        }
        else {
            colour = "red";
        }
        
      // Add a new marker to the cluster group and bind a pop-up
      /*markers.addLayer(L.circle([location.coordinates[1], location.coordinates[0]])
        .bindPopup(data.features[i].properties.title));*/
        L.circle([feature.geometry.coordinates[1],
                 feature.geometry.coordinates[0]], {
                    fillColor: colour,
                    fillOpacity: 0.75,
                    color: colour,
                    radius: mag * 20000
                 }).bindPopup("<h3> Location: " + feature.properties.place + "<hr>Mag: " + mag + "</h3>").addTo(myMap);
    });
    
    // make legend
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function() {
        var div = L.DomUtil.create('div', 'info legend');
        var labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
        var colours = ["green", "yellow", "#E59866",
                        "orange", "#D35400", "red"];
    
        // loop through our density intervals and generate a label with a colored background for each interval
        for (var i = 0; i < colors.length; i++) {
            div.innerHTML +=
                '<li style="background-color:' + colours[i] + '">' + labels[i] + '</li>';
            }
        return div;
    }
    legend.addTo(myMap);
}