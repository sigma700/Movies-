import express from "express";
import {fileURLToPath} from "url";
import path from "path";

//instantiate=ing express
let app = express();

let port = 3000;
// path to html
let __fileName = fileURLToPath(import.meta.url);
console.log({__fileName});

let __dirName = path.dirname(__fileName);
console.log({__dirName});

//find file path

app.set("views", "./views");
app.set("view engine", "pug");

// Verify public directory exists
const publicPath = path.join(__dirName, "public");
console.log("Public directory path:", publicPath);

//link static file - absolute path is more reliable
app.use(express.static("public"));

// home route
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.get;

// app.get("/movies", (req, res) => {
//   res.sendFile(path.join(publicPath, "movies.html"));
// });

app.get("/movies", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/discover/movie",
      {
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNzBlMTRmNTQ0ZjM3MzU4M2QwY2EwMDgzMjUwMjdmYiIsIm5iZiI6MTc0NDM1ODAzNi4xMjEsInN1YiI6IjY3ZjhjYTk0ZGU1ZTRkZWM2MmFkNjUwNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kR2pla8op4DVtmJcIzgRSmUIX1apy_o_NjvPsP5CJjA",
        },
      }
    );

    const movies = await response.json();

    console.log({movies});

    //render a template

    res.render("movies", {data: movies.results});
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({message: "Failed to fetch movies"});
  }
});

//individual movie path

//path to series list

app.get("/series", async (req, res) => {
  try {
    const response = await fetch("https://api.themoviedb.org/3/discover/tv", {
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNzBlMTRmNTQ0ZjM3MzU4M2QwY2EwMDgzMjUwMjdmYiIsIm5iZiI6MTc0NDM1ODAzNi4xMjEsInN1YiI6IjY3ZjhjYTk0ZGU1ZTRkZWM2MmFkNjUwNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kR2pla8op4DVtmJcIzgRSmUIX1apy_o_NjvPsP5CJjA",
      },
    });

    const series = await response.json();

    console.log({series});

    //render a template

    res.render("series", {data: series.results});
  } catch (error) {
    console.error("Error fetching series:", error);
    res.status(500).json({message: "Failed to fetch series"});
  }
});

app.get("/genres", (req, res) => {
  res.sendFile(path.join(publicPath, "genres.html"));
});

app.get("/movies/:id", async (req, res) => {
  //fetching movies
  let id = req.params.id;
  console.log({id});

  try {
    const movieRes = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNzBlMTRmNTQ0ZjM3MzU4M2QwY2EwMDgzMjUwMjdmYiIsIm5iZiI6MTc0NDM1ODAzNi4xMjEsInN1YiI6IjY3ZjhjYTk0ZGU1ZTRkZWM2MmFkNjUwNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kR2pla8op4DVtmJcIzgRSmUIX1apy_o_NjvPsP5CJjA",
      },
    });

    const movie = await movieRes.json();

    console.log({movie});

    res.render("movie", {data: movie});
  } catch (error) {
    console.error("Error fetching movie details:", error);
    res.status(500).json({message: "Failed to fetch movie details"});
  }
});

app.get("/series/:id", async (req, res) => {
  //fetching individual series
  let id = req.params.id;
  console.log({id});

  try {
    const seriesRes = await fetch(`https://api.themoviedb.org/3/tv/${id}`, {
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNzBlMTRmNTQ0ZjM3MzU4M2QwY2EwMDgzMjUwMjdmYiIsIm5iZiI6MTc0NDM1ODAzNi4xMjEsInN1YiI6IjY3ZjhjYTk0ZGU1ZTRkZWM2MmFkNjUwNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kR2pla8op4DVtmJcIzgRSmUIX1apy_o_NjvPsP5CJjA",
      },
    });
    //await and async => used for concurrent responses to boost performance
    const serie = await seriesRes.json();

    console.log({serie});

    res.render("serie", {data: serie});
  } catch (error) {
    console.error("Error fetching series details:", error);
    res.status(500).json({message: "Failed to fetch series details"});
  }
});

app
  .listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  })
  .on("error", (err) => {
    console.error("Server failed to start:", err.message);
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${port} is already in use.`);
    }
  });
