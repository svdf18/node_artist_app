import express from "express";
import fs from "fs/promises";
import cors from "cors";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
})

// READ-WRITE FUNCTIONS //

function readDataFromFile() {
  return fs.readFile("artists.json").then(data => JSON.parse(data));
}

function writeDataToFile(data) {
  return fs.writeFile("artists.json", JSON.stringify(data));
}

function readFavoriteDataFromFile() {
  return fs.readFile("favorites.json").then(data => JSON.parse(data));
}

function writeFavoritesToFile(data) {
  return fs.writeFile("favorites.json", JSON.stringify(data));
}

// Sort / filter //

function sortArtistsByName(artists) {
  return artists.slice().sort((a, b) => a.name.localeCompare(b.name));
}

// HTTP METHODS FOR ARTISTS //

// Get all artists //
app.get("/artists", async (req, res) => {
  const artists = await readDataFromFile();
  const sortedArtists = sortArtistsByName(artists);
  console.log(sortedArtists);
  res.json(sortedArtists);
});

// Get artist by ID //
app.get("/artists/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const artists = await readDataFromFile();

  const foundArtist = artists.find(artist => artist.id === id);

  if (!foundArtist) {
    res.status(404).json({ error: "Artist not found"})
  } else {
    res.json(foundArtist);
  }
});

// Post new artist //
app.post("/artists", async (req, res) => {
  const newArtist = { ...req.body, id: new Date().getTime() };
  const artists = await readDataFromFile();

  const artistExists = artists.find(artist => artist.name === newArtist.name);

  if(artistExists) {
    res.status(400).json({ error: "Artist name already exists" });
  } else {
    artists.push(newArtist);
    await writeDataToFile(artists);
    console.log(newArtist);
    res.json(artists);
  }
});

// Update existing artist by ID //
app.put("/artists/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const artists = await readDataFromFile();

  const artistToUpdate = artists.find(artist => artist.id === id);

  if(!artistToUpdate) {
    return res.status(404).json({ error: "Artist not found" });
  }

  const existingArtist = artists.find(artist => artist.name === req.body.name);

  if (existingArtist && existingArtist.id !== id) {
    return res.status(404).json({ error: "Artist name already exists" });
  }

  const body = req.body;
  console.log(body);

  Object.assign(artistToUpdate, body);

  await writeDataToFile(artists);
  res.json(artists);
});

// Delete existing artist by ID //
app.delete("/artists/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const artists = await readDataFromFile();

  const newArtists = artists.filter(artist => artist.id !== id);
  await writeDataToFile(newArtists);

  res.json(newArtists);
});


// HTTP METHODS FOR FAVORITES //

// Get favorites for user //
app.get("/favorites/:userId", async (req, res) => {
  const userId = req.params.userId;
  console.log("user favorites")
  const favorites = await readFavoriteDataFromFile();
  const userFavorites = favorites[userId] || [];
  console.log(userFavorites);
  res.json(userFavorites);
});

// Post favorite to user //
app.post("/favorites/:userId", async (req, res) => {
  const userId = req.params.userId;
  const artistId = parseInt(req.body.artistId);
  const favorites = await readFavoriteDataFromFile();

  console.log(userId);
  
  if (!favorites[userId]) {
    favorites[userId] = [];
  }

  if (favorites[userId].includes(artistId)) {
    res.status(400).json({ error: "Artist already exists in favorites" });
    return;
  }

  favorites[userId].push(artistId);

  await writeFavoritesToFile(favorites);
  res.status(201).json({ message: "Artist added to favorites" });
});

// Delete favorite from user //
app.delete("/favorites/:userId", async (req, res) => {
  const userId = req.params.userId;
  const artistId = parseInt(req.body.artistId);
  let favorites = await readFavoriteDataFromFile();

  if (!favorites[userId] || !favorites[userId].includes(artistId)) {
    res.status(404).json({ error: "Artist not found in favorites" });
    return;
  }

  favorites[userId] = favorites[userId].filter(favId=>favId!==artistId);

  await writeFavoritesToFile(favorites);
  res.json({ message: "Artist removed from favorites" });
});


