// Create initial map
const myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4,
});

//Adding a tile layer/background map image
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

//Store API endpoint
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(queryUrl, function(data) {
    function styleInfo(feature) {
        return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: getColor(feature.properties.mag),
          color: "#000000",
          radius: getRadius(feature.properties.mag),
          stroke: true,
          weight: 0.5
        };
      }
      // Set color
        function getColor(magnitude) {
        switch (true) {
        case magnitude > 5:
          return "#ea2c2c";
        case magnitude > 4:
          return "#ea822c";
        case magnitude > 3:
          return "#ee9c00";
        case magnitude > 2:
          return "#eecc00";
        case magnitude > 1:
          return "#d4ee00";
        default:
          return "#98ee00";
        }
      }
      // Set radius
        function getRadius(magnitude) {
        if (magnitude === 0) {
          return 1;
        }
    
        return magnitude * 4;
      }
      //GeoJSON layer
      L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
          },
          style: styleInfo,
          onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
          }
        }).addTo(myMap);

        //Legend
        var legend = L.control({
            position: "bottomright"
          });
          legend.onAdd = function() {
            var div = L.DomUtil.create("div", "info legend");
            var grades = [0, 1, 2, 3, 4, 5];
            var colors = [
              "#98ee00",
              "#d4ee00",
              "#eecc00",
              "#ee9c00",
              "#ea822c",
              "#ea2c2c"
            ];

            //Loop
            for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                  "<i style='background: " + colors[i] + "'></i> " +
                  grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
              }
              return div;
            };
            //Add Legend
            legend.addTo(myMap);
})