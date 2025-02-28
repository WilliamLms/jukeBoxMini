const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json()); 

const PORT = process.env.PORT || 3000;

// GET Retrieve all users
app.get("/users", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// GET Retrieve a specific user with playlists
app.get("/users/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const user = await prisma.user.findUnique({
      where: { id },
      include: { playlists: true }, 
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// POST Create a new playlist for a user
app.post("/users/:id/playlists", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { title } = req.body;

    if (!title || typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({ error: "Title is required and must be a valid string." });
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const newPlaylist = await prisma.playlist.create({
      data: { title: title.trim(), userId: id },
    });

    res.status(201).json(newPlaylist);
  } catch (error) {
    next(error);
  }
});

// Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Starts the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
