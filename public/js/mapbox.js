export const displayMap = (location) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYXl1bWk5MTkiLCJhIjoiY2tqNXNoanFiNDduNDJ4c2NpNXBtYTYwMyJ9.3Dfn9k5wQbzklaKPgSlQyg';

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/ayumi919/ckj5tf7600nsl1anuupud5u39',
    scrollZoom: false,
    // center: [-118.113491, 34.111745],
    // zoom: 5,
    // interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  location.forEach((loc) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom', // bottom of the pin is the real geo location
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 140,
      left: 100,
      right: 100,
    },
  });
};
