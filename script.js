function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        document.getElementById("output").innerText = "Location not supported.";
    }
}

let userLat = null;
let userLong = null;

function showPosition(position) {
    userLat = position.coords.latitude;
    userLong = position.coords.longitude;

    document.getElementById("output").innerText =
        "Latitude: " + userLat + ", Longitude: " + userLong;
}

async function searchPart() {
    const part = document.getElementById("search").value;

    if (!part) {
        alert("Enter spare part name.");
        return;
    }
    if (!userLat || !userLong) {
        alert("Click 'Get Location' first.");
        return;
    }

    // Your Render backend URL
    const apiUrl = `https://spare-finder-backend.onrender.com/nearby?lat=${userLat}&long=${userLong}&part=${part}`;

    document.getElementById("output").innerText = "Searching...";

    try {
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (data.count === 0) {
            document.getElementById("output").innerText = "No shops found.";
            return;
        }

        // format results
        let html = `<h3>Results (${data.shops.length} shops)</h3>`;
        data.shops.forEach((shop, i) => {
            html += `
                <p>
                <b>${i + 1}. ${shop.name}</b><br>
                Distance: ${shop.distanceKm} km<br>
                <a href="${shop.googleMapLink}" target="_blank">📍 Open in Maps</a>
                </p>
            `;
        });

        document.getElementById("output").innerHTML = html;

    } catch (e) {
        document.getElementById("output").innerText = "Error contacting server.";
        console.log(e);
    }
}
