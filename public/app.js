// Cache constants to prevent redundant network requests
let cachedConstants = null;

// Function to fetch constants from 'constants.json'
async function fetchConstants() {
  if (cachedConstants) return cachedConstants;
  try {
    const response = await fetch('constants.json');
    cachedConstants = await response.json();
    return cachedConstants;
  } catch (error) {
    console.error('Error fetching constants:', error);
  }
}

// Generalized function to populate dropdown menus
async function populateDropdown(elementId, dataType) {
  const data = await fetchConstants();
  if (!data) return;

  const dropdown = document.getElementById(elementId);
  const fragment = document.createDocumentFragment();

  data.forEach(item => {
    if (item.datatype === dataType) {
      const option = document.createElement('option');
      option.text = item.name;
      option.value = item.name;
      fragment.appendChild(option);
    }
  });

  dropdown.appendChild(fragment);
}

// Populate dropdown menus for pot type, plant type, and season
function initialize() {
  populateDropdown('potType', 'pot');
  populateDropdown('plantType', 'species');
  populateDropdown('season', 'season');
}

// Function to calculate pot volume
function calculatePotVolume(diameter, height) {
  const radius = diameter / 2;
  return Math.PI * Math.pow(radius, 2) * height;
}

// Function to calculate water and fertilizer recommendations
async function calculateRecommendations(potVolume, potType, plantType, season) {
  const data = await fetchConstants();
  if (!data) return;

  const potData = data.find(item => item.datatype === 'pot' && item.name === potType);
  const speciesData = data.find(item => item.datatype === 'species' && item.name === plantType);
  const seasonData = data.find(item => item.datatype === 'season' && item.name === season);

  if (potData && speciesData && seasonData) {
    const water = potVolume * 0.0001 * potData.datafield_1 * seasonData.datafield_1;
    const fertilizer = water * seasonData.datafield_2;

    document.getElementById('recommendedWater').textContent = `${water.toFixed(1)} liters`;
    document.getElementById('recommendedFertilizer').textContent = `${fertilizer.toFixed(2)} units`;
  }
}

// Function to find recommendations and calculate statistics
async function findRecommendations(potVolume, potType, plantType, season) {
  const data = await fetchData();
  if (!data) return;

  const similarEntries = data.filter(item =>
    item.pot_type === potType &&
    item.plant_type === plantType &&
    item.time_of_year === season &&
    item.pot_volume > potVolume * 0.9 &&
    item.pot_volume < potVolume * 1.1
  );

  document.getElementById('similar').textContent = similarEntries.length;

  const similarWaterEntries = similarEntries.filter(item =>
    item.actual_water > item.recommended_water * 0.9 &&
    item.actual_water < item.recommended_water * 1.1
  );

  const lessWaterEntries = similarEntries.filter(item =>
    item.actual_water <= item.recommended_water * 0.9
  );

  const moreWaterEntries = similarEntries.filter(item =>
    item.actual_water >= item.recommended_water * 1.1
  );

  const calculateAverage = (entries, field) =>
    entries.length ? (entries.reduce((sum, entry) => sum + entry[field], 0) / entries.length).toFixed(1) : "-";

  document.getElementById('similarwaterCount').textContent = similarWaterEntries.length;
  document.getElementById('similarwaterGrowthAverage').textContent = calculateAverage(similarWaterEntries, 'growth_rate');
  document.getElementById('similarwaterYieldAverage').textContent = calculateAverage(similarWaterEntries, 'crop_yield');

  document.getElementById('lesswaterCount').textContent = lessWaterEntries.length;
  document.getElementById('lesswaterGrowthAverage').textContent = calculateAverage(lessWaterEntries, 'growth_rate');
  document.getElementById('lesswaterYieldAverage').textContent = calculateAverage(lessWaterEntries, 'crop_yield');

  document.getElementById('morewaterCount').textContent = moreWaterEntries.length;
  document.getElementById('morewaterGrowthAverage').textContent = calculateAverage(moreWaterEntries, 'growth_rate');
  document.getElementById('morewaterYieldAverage').textContent = calculateAverage(moreWaterEntries, 'crop_yield');

  document.getElementById('outputSection').style.display = "block";
}

// Event listener for the calculate button
document.getElementById('calculateButton').addEventListener('click', async function () {
  const potType = document.getElementById('potType').value;
  const potDiameter = parseFloat(document.getElementById('potDiameter').value);
  const potHeight = parseFloat(document.getElementById('potHeight').value);
  const plantType = document.getElementById('plantType').value;
  const season = document.getElementById('season').value;

  const potVolume = calculatePotVolume(potDiameter, potHeight);
  document.getElementById('potSize').textContent = (potVolume / 1000).toFixed(1);

  await calculateRecommendations(potVolume, potType, plantType, season);
  await findRecommendations(potVolume, potType, plantType, season);
});
