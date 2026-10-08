mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
        style: 'mapbox://styles/mapbox/streets-v12',
        container: 'map', // container ID
        center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
});

console.log(coordinates);
const marker = new mapboxgl.Marker()
    .setLngLat(coordinates) //listing.gemotery.coordinates
    .addTo(map);