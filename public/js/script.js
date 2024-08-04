console.log("script.js is loaded"); // Debug log

const socket = io();

if (navigator.geolocation) {
    console.log("Geolocation is supported"); // Debug log
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        console.log("Sending location:", latitude, longitude); // Debug log
        socket.emit("send-location", { latitude, longitude });
    }, (error) => {
        console.error(error);
    }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    });
}

const map = L.map("map").setView([0, 0], 16);
console.log("Map initialized"); // Debug log

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "OpenStreetMap"
}).addTo(map);
console.log("Tile layer added to map"); // Debug log

const markers = {};

socket.on("recive-location", (data) => {
    const { id, longitude, latitude } = data;
    map.setView([latitude, longitude]);
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]); // Corrected typo here
        delete markers[id];
    }
});
