
// Set up the Mapbox map
mapboxgl.accessToken = 'pk.eyJ1IjoiYW1rOTcxMCIsImEiOiJjbGc1cWRtNTIwNWl0M2VuNW9yZTJxYmJ2In0.BR49nDMsJOC3F0VxtVqT9Q';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-73.9712, 40.7831],
    zoom: 11
});

// Add navigation controls to map
map.addControl(new mapboxgl.NavigationControl());

map.on('load', function () {
    map.addSource('parks', {
        type: 'geojson',
        data: 'data/ParksProperties.geojson'
    })

    map.addLayer({
        id: 'parks-props-fill',
        type: 'fill',
        source: 'parks',
        paint: {
            'fill-color': [
                'match',
                ['get', 'jurisdiction'],
                'DPR',
                '#317338',
                'DOE',
                '#f57058',
                'NYCHA',
                '#072ef0',
                'DPR/DOE',
                '#b258c4',
             /* other */ '#ccc'
            ]
        }
    })


  // Add popup to parks layer
  map.on('click', 'parks', function (e) {
    var popupContent = '<div class="popup-content">' +
        '<h3>' + e.features[0].properties.name311 + '</h3>' +
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
