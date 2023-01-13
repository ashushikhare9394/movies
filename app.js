const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "moviesData.db");
const app = express();

app.use(express.json());

let db = null;

const initializeDbAndServer = async () => {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
  app.listen(3000, () => {
    console.log("Server running at http://localhost:3000/");
  });
}catch(e) {
    console.log(`DB Error ${e.message}`);
    process.exit(1);
};

initializeDbAndServer();

const convertDbObjectToResponseObject = (dbObject) => {
    return {
        movieId: dbObject.movie_id,
        directorId: dbObject.director_id,
        movieName: dbObject.movie_name,
        leadActor: dbObject.lead_actor,
        directorName: dbObject.director_name,
    };
};

//get method API 1 

app.get("/movies/",async(request,response) => {
    const getMovieQuery = `
    SELECT* 
    FROM movie;`;
    const moviesArray = await db.all(getMovieQuery);
    response.send(moviesArray.map(eachMovie) => {
        convertDbObjectToResponseObject(eachMovie);
    });
});

//post method API2 

app.post("/movies/",async(request,response) =>{
    const movieDetails = request.body;
    const {
         movieId,
         directorId,
         movieName,
         leadActor
    } = movieDetails;
    const addMovieQuery = `
    INSERT INTO 
        movie(movie_id, director_id, movie_name, lead_actor)
    VALUES (
        '${movieId}',
        '${directorId}',
        '${movieName}',
        '{leadActor}'
        );`
    const dbResponse = await db.run(addMovieQuery);
    response.send("Movie Successfully Added");     
});

//get method API 3 


app.get("/movies/:movieId",async(request,response) => {
    const {movieId} = request.params;
    const getMovieId = 
    SELECT*
    FROM movie 
    WHERE movie_id = '${movieId};';
    const pic await db.get(getMovieId);
    response.send(convertDbObjectToResponseObject(pic)); 
});

//method put API4 

app.put("/movies/:movieId",async(request,response) => {
    const { bookId } = request.params;
    const {movieId,directorId,movieName,leadActor} = request.body;
    const updateMovieQuery = `
    UPDATE movie 
    SET 
      director_id = '${directorId}',
      movie_name = '${movieName}',
      lead_actor = '${leadActor}'
    WHERE 
        movie_id = '${movieId};`;
    await db.run(updateMovieQuery);
    response.send("Movie Details Updated");    
});

//delete method API 5 

app.delete("/movies/:movieId",async(request,response) => {
    const{movieId} = request.params;
    const deleteMovieQuery = `
    DELETE FROM 
        movie 
    WHERE 
        movie_id = ${bookId};`;
    await db.run(deleteMovieQuery);
    response.send("Movie Removed"); 
});

// get method all API 6 

app.get("/directors/",async(request,response) => {
    const getDirectorQuery = `
    SELECT*
    FROM 
        director
    ORDER BY 
        director_id;    
    `;
    const directorArray = await db.all(getDirectorQuery);
    response.send(directorArray);
});

// get method API 7 

app.get("/directors/:directorId/movies", async(request,response) => {
    const {director_id} = request.params;
    const getDirectorQuery = `
    SELECT*
    FROM 
       director 
    WHERE 
        director_id = ${directorId};`;
    const directorArray = await db.all(getDirectorQuery);
    response.send(directorArray);
});

module.exports = app;