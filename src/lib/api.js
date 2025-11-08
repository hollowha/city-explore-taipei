// Simple mock API layer. Swap with real endpoints later.

export async function fetchMockExploration() {
  // Use absolute path from root
  const url = '/mock/segments.json';
  console.log('Fetching segments from:', url);
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load segments');
  const data = await res.json();
  return data;
}

export async function fetchMockLandmarks() {
  const url = '/mock/landmarks.json';
  console.log('Fetching landmarks from:', url);
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load landmarks');
  return res.json();
}

export async function fetchMockProgress() {
  const url = '/mock/progress.json';
  console.log('Fetching progress from:', url);
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load progress');
  return res.json();
}

// Fetch real park data from parks_decoded.json
export async function fetchParks() {
  const url = '/mock/parks_decoded.json';
  console.log('Fetching parks from:', url);
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load parks');
  const parks = await res.json();
  
  // Transform park data to landmark format
  return parks
    .filter(park => park.pm_Latitude && park.pm_Longitude) // Only parks with coordinates
    .map(park => ({
      id: `park-${park.SeqNo}`,
      name: park.pm_name,
      lat: parseFloat(park.pm_Latitude),
      lng: parseFloat(park.pm_Longitude),
      category: 'park',
      description: park.pm_overview ? park.pm_overview.trim().substring(0, 150) + '...' : '台北市公園',
      unlocked: false, // All parks start as locked
      phone: park.pm_phone,
      area: park.pm_LandPublicArea,
      sports: park.pm_sports,
      playarea: park.pm_playarea
    }));
}

// Fetch sports centers
export async function fetchSportsCenters() {
  const url = '/mock/sports_center.json';
  console.log('Fetching sports centers from:', url);
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load sports centers');
  const items = await res.json();
  return items
    .filter(it => it.latitude && it.longtitude)
    .map(it => ({
      id: `sports-${it.id}`,
      name: it.name,
      lat: parseFloat(it.latitude),
      lng: parseFloat(it.longtitude),
      category: 'sports',
      description: it.address,
      unlocked: true,
      phone: it.phone
    }));
}

// Fetch bike scenery spots
export async function fetchBikeScenery() {
  const url = '/mock/bike_scenary.json';
  console.log('Fetching bike scenery from:', url);
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load bike scenery');
  const items = await res.json();
  return items
    .filter(it => it.Latitude && it.Longitude)
    .map(it => ({
      id: `bike-${it.Id}`,
      name: it.Scenic_Spot,
      lat: parseFloat(it.Latitude),
      lng: parseFloat(it.Longitude),
      category: 'bike',
      description: it.Description,
      unlocked: true,
      riverside: it.Riverside_Park
    }));
}

// Fetch YouBike stations (latest JSON)
export async function fetchYouBikeStations() {
  const url = '/mock/youbike.json';
  console.log('Fetching YouBike stations from:', url);
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load YouBike stations');
  const items = await res.json();
  return items
    .filter(it => it.latitude && it.longitude)
    .map(it => ({
      id: `ub-${it.sno}`,
      name: it.sna,
      lat: Number(it.latitude),
      lng: Number(it.longitude),
      category: 'youbike',
      description: it.ar || `${it.sarea} YouBike 站點`,
      unlocked: true,
      area: it.sarea,
      totalDocks: it.Quantity,
      bikesAvailable: it.available_rent_bikes,
      docksAvailable: it.available_return_bikes,
      updatedAt: it.updateTime || it.mday
    }));
}

/**
 * Fetch district boundaries and data
 * @returns {Promise<Object>} GeoJSON FeatureCollection of districts
 */
export async function fetchDistricts() {
  const url = `/mock/districts.json`;
  console.log('Fetching districts from:', url);
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load districts');
  return await res.json();
}
