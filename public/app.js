// Initialize the dropdowns after DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
  initialize();
});

// Event listener for the calculate button
document.getElementById('calculateButton').addEventListener('click', async function () {
  const potType = document.getElementById('potType').value;
  const potDiameter = parseFloat(document.getElementById('potDiameter').value);
  const potHeight = parseFloat(document.getElementById('potHeight').value);
  const plantType = document.getElementById('plantType').value;
  const season = document.getElementById('season').value;

  if (!potType || isNaN(potDiameter) || isNaN(potHeight) || !plantType || !season) {
    alert('Please fill in all the required fields');
    return;
  }

  const potVolume = calculatePotVolume(potDiameter, potHeight);
  document.getElementById('potSize').textContent = (potVolume / 1000).toFixed(1);

  await calculateRecommendations(potVolume, potType, plantType, season);
  await findRecommendations(potVolume, potType, plantType, season);
});

// Placeholder implementation for fetchData to prevent errors
async function fetchData() {
  // Replace with actual implementation to fetch necessary data
  return [];
}
