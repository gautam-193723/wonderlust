
    
     let apiKey=api_Key;
    let address = Laddress; // Example address
    let geometry=coordinates;
    title=listingtitle;
    console.log(title)
    console.log()
    console.log(address)

    // Function to get coordinates from OpenCage API
    async function getCoordinates(address) {
        const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`);
     
        const data = await response.json();
        if (data.results.length > 0) {
            return {
                lat: data.results[0].geometry.lat,
                lng: data.results[0].geometry.lng
            };
        } else {
            throw new Error('No results found');
        }
       
    }
   

    // Initialize the map with Leaflet
    function initMap(lat, lng) {
        const map = L.map('map').setView([lat, lng], 13); // Set view to the location

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 20,
            attribution: '© OpenStreetMap'
        }).addTo(map);

        // Add a marker to the map
        L.marker([lat, lng]).addTo(map)
            .bindPopup(title,address,+"Exact location provided after booking")
            .openPopup();
    }

    // Fetch coordinates and initialize map
    getCoordinates(address)
        .then(coords => initMap(coords.lat, coords.lng))
        .catch(error => console.error('Error:', error));