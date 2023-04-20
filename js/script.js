$(document).ready(function () {
    // Set up the API URL and app token
    var apiUrl = "https://data.cityofnewyork.us/resource/enfh-gkve.json";
    var appToken = "YTzwUUtFCWU7SCDYzGNrww7yK";

    // Set up the Mapbox map
    mapboxgl.accessToken = 'pk.eyJ1IjoiYW1rOTcxMCIsImEiOiJjbGc1cWRtNTIwNWl0M2VuNW9yZTJxYmJ2In0.BR49nDMsJOC3F0VxtVqT9Q';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10',
        center: [-73.9712, 40.7831],
        zoom: 11
    });

    // Add navigation controls to map
    map.addControl(new mapboxgl.NavigationControl());

    $.ajax({
        url: apiUrl,
        type: "GET",
        data: {
            "$limit": 1000,
            "$$app_token": appToken,
        },
        success: function (data) {
            // Map the data array to a new array that contains only the name, latitude, and longitude properties
            var filteredData = data.map(function (park) {
                return {
                    name: park.name311,
                    acres: park.acres,
                    jurisdiction: park.jurisdiction,
                
                };
            });

            // Load data from API as a source
            map.on('load', function () {
                map.addSource('parks', {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: filteredData
                    }
                });

                // Add parks layer to map
                map.addLayer({
                    'id': 'parks',
                    'type': 'fill',
                    'source': 'parks',
                    'paint': {
                        'fill-color': [
                            'match',
                            ['get', 'jurisdiction'],
                            'DPR', '#1f78b4',
                            'DOE', '#a6cee3',
                            'DPR/TBTA', '#b2df8a',
                            'DPR/DOE', '#fdbf6f',
                            '#ccc'
                        ],
                        'fill-opacity': 0.7
                    }
                });

                // Add popup to parks layer
                map.on('click', 'parks', function (e) {
                    var popupContent = '<div class="popup-content">' +
                        '<h3>' + e.features[0].properties.name + '</h3>' +
                        '<p>' + e.features[0].properties.acres + ' acres</p>' +
                        '</div>';
                    new mapboxgl.Popup()
                        .setLngLat(e.lngLat)
                        .setHTML(popupContent)
                        .addTo(map);
                });

                // Change cursor to pointer when hovering over parks layer
                map.on('mouseenter', 'parks', function () {
                    map.getCanvas().style.cursor = 'pointer';
                });
                map.on('mouseleave', 'parks', function () {
                    map.getCanvas().style.cursor = '';
                });
            });
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
});
