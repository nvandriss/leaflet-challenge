async function main () {
//Background Map
    const bgmap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        });
      
      const map = L.map("map", {
        center: [
          40.7, -94.5
        ],
        zoom: 3
      });
      //Import GeoJSON data
      bgmap.addTo(map);
            d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson").then(function(data) {
      //Markers
        function styleInfo(feature) {
          return {
            opacity: 1,
            fillOpacity: 0.75,
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 1
          };
        }
      //Set Color - lower depth (green) -> greater depth (red)
        function getColor(depth) {
          switch (true) {
          case depth > 90:
            return "#e92684";
          case depth > 70: 
            return "#e95d26"; 
          case depth > 50:
            return "#ee9c00";
          case depth > 30:
            return "#eecc00";
          case depth > 10:
            return "#d4ee00";
          default:
            return "#98ee00";
          }
        }
      //Set Radius
        function getRadius(magnitude) {
          if (magnitude === 0) {
            return 1;
          }
          return magnitude * 4;
        }
      
      //Add Layer
        L.geoJson(data, {
          pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
          },
          style: styleInfo,
          onEachFeature: function(feature, layer) {
            layer.bindPopup(
              "Magnitude: "
                + feature.properties.mag
                + "<br>Depth: "
                + feature.geometry.coordinates[2]
                + "<br>Location: "
                + feature.properties.place
            );
          }
        }).addTo(map);
      //Legend
        const legend = L.control({position: "bottomright"});
      
      legend.onAdd = function(myMap) {
          const div = L.DomUtil.create("div", "info legend");
          const grades = [-10, 10, 30, 50, 70, 90];
          const colors = [
        "#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#e95d26",
        "#e92684"
          ];
          const legendInfo = "<h3>Earthquake Depth (km)</h3>" +
            "<div class=\"labels\">" + "</div>";
        div.innerHTML = legendInfo;

        for (let i = 0; i < grades.length; i++) {
            div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
            + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
          };
          return div;
        };
      //Add Legend
        legend.addTo(map);
      });
}

    main();