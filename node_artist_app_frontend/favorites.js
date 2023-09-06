import { updateArtistGrid, endpoint } from "/app.js"

const dummyUser = "user123";

// Toggle favorite //

async function toggleFavorite(artistId) {
  const userId = dummyUser;
  const button = document.querySelector(`.btn-toggle-favorite-artist`);

  const isFavorite = await checkFavoriteStatus(userId, artistId);

  if (isFavorite) {
    await removeFromFavorites(artistId);
    button.classList.remove("favorite-icon-selected");
    button.classList.add("favorite-icon-unselected");
    console.log("unselected")
  } else {
    await addToFavorites(artistId);
    button.classList.remove("favorite-icon-unselected");
    button.classList.add("favorite-icon-selected");
    console.log("selected")
  }

  // Working but no classlist changes ... //
}

// Check if favorite //

async function checkFavoriteStatus(userId, artistId) {
  const response = await fetch(`${endpoint}/favorites/${userId}`);
  if (response.ok) {
    const favorites = await response.json();
    return favorites.includes(artistId);
  } else {
    console.error("Error checking favorite status:", response.statusText);
    return false;
  }
}

// Add artist to user favorites //
async function addToFavorites(artistId) {
  const userId = dummyUser;

  const requestData = { userId, artistId };
  const response = await fetch(`${endpoint}/favorites/${userId}`, {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {
        "Content-Type": "application/json",
      },
  });

  updateArtistGrid();
}

// Remove artist from user favorite //
async function removeFromFavorites(artistId) {
  const userId = dummyUser;

  const requestData = { userId, artistId };
  const response = await fetch(`${endpoint}/favorites/${userId}`, {
      method: "DELETE",
      body: JSON.stringify(requestData),
      headers: {
        "Content-Type": "application/json",
      },
  });

  updateArtistGrid();
}

// Get favorite artist IDs for User ID //

async function getFavoriteArtistIds() {
  const userId = dummyUser;
  console.log("Fetching favorite artist IDs for User ID:", userId);

  const response = await fetch(`${endpoint}/favorites/${userId}`);
  if (response.ok) {
    const favoriteArtistIds = await response.json();
    console.log("Favorite Artist IDs:", favoriteArtistIds);
    return favoriteArtistIds || [];
  } else {
    console.log("Error fetching favorite artist IDs:", response.statusText);
    return [];
  }
}

export { toggleFavorite, getFavoriteArtistIds };