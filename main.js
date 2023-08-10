// map class initialize
var map = L.map("map").setView([-1.2939, 36.8683], 12);
map.zoomControl.setPosition("topright");

// adding various tilelayer
var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

var st = L.tileLayer(
  "https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}",
  {
    attribution:
      'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: "abcd",
    minZoom: 0,
    maxZoom: 20,
    ext: "png",
  }
);

var Esri_StreetMap = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",
  }
);

var Esri_WorldImagery = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  }
);

//add map scale
L.control.scale().addTo(map);

//Map coordinate display
map.on("mousemove", function (e) {
  $(".coordinate").html(`Lat: ${e.latlng.lat} Lng: ${e.latlng.lng}`);
});

//Geojson load zoning centroids
var centroids = L.markerClusterGroup();
var data = L.geoJSON(data, {
  onEachFeature: function (feature, layer) {
    layer.bindPopup(feature.properties.Zone_ID);
  },
});
data.addTo(centroids);
centroids.addTo(map);

//Geojson load city boundary
var cBoundary = L.markerClusterGroup();
var bdata = L.geoJSON(boundary, {
  onEachFeature: function (feature, layer) {
    layer.bindPopup(feature.properties.county);
    layer.setStyle({ color: "black", fillColor: "#30D5C8", fillOpacity: 0.2 });
  },
});
bdata.addTo(cBoundary);
cBoundary.addTo(map);

//Geojson load city administrative wards
var adminwards = L.markerClusterGroup();
var wardadmin = L.geoJSON(wards, {
  onEachFeature: function (feature, layer) {
    layer.bindPopup(feature.properties.ward);
    layer.setStyle({ color: "black", fillColor: "#30D5C8", fillOpacity: 0.2 });
  },
});
wardadmin.addTo(adminwards);
adminwards.addTo(map);

//Geojson load city survey blocks 2020
var surveyblocks = L.markerClusterGroup();
var surv = L.geoJSON(survey, {
  onEachFeature: function (feature, layer) {
    layer.bindPopup(feature.properties.Name);
    layer.setStyle({ color: "purple", fillColor: "grey", fillOpacity: 0.5 });
  },
});
surv.addTo(surveyblocks);
surveyblocks.addTo(map);

//Geojson load city zoning polys
var cityzones = L.markerClusterGroup();
var zones = L.geoJSON(zoning, {
  onEachFeature: function (feature, layer) {
    layer.bindPopup(feature.properties.Name);
    layer.setStyle({ color: "blue", fillColor: "#13433E", fillOpacity: 0.5 });
  },
});
zones.addTo(cityzones);
cityzones.addTo(map);

//Leaflet layer control
var baseMaps = {
  OpenStreetMaps: osm,
  "Stamen Toner": st,
  "Esri StreetMap": Esri_StreetMap,
  "Esri World Imagery": Esri_WorldImagery,
};

var overlayMaps = {
  "City Boundary": cBoundary,
  "City Wards": adminwards,
  "Zoning Polygons": cityzones,
  "Zoning Centroids": centroids,
  "Survey Blocks": surveyblocks,
};

L.control
  .layers(baseMaps, overlayMaps, { collapsed: false, position: "topleft" })
  .addTo(map);
