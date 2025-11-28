function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        document.getElementById("output").innerText = "Location not supported.";
    }
}

function showPosition(position) {
    document.getElementById("output").innerText = 
    "Latitude: " + position.coords.latitude + 
    ", Longitude: " + position.coords.longitude;
}

function searchPart() {
    let part = document.getElementById("search").value;
    document.getElementById("output").innerText = 
    "Searching for: " + part;
}
