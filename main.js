const apiKey = "b89fc45c2067cbd33560270639722eae";

//Primero hago una lista como todos los resultados de las peliculas de la APi
async function getPopularMovies() {
  const url = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results;
}
//Luego haces una lista con todas las ids de las 9 primeras peliculas

async function getTopMoviesIds(n = 9) {
  const peliculas = await getPopularMovies();
  const ids = peliculas.slice(0, n).map((movie) => movie.id);
  return ids;
}
//RandomIds
async function getRandomMoviesIds() {
  let min = 1;
  let max = 17;
  let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  let n = 6 + randomNumber;
  const peliculas = await getPopularMovies();
  const ids = peliculas.slice(randomNumber, n).map((movie) => movie.id);
  return ids;
}
//Get a single movie only for the fastes
async function getMovie(id) {
  const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
//async function for the Top Movie
async function getFastestTopMovie() {
  const ids = await getTopMoviesIds();
  const moviePromises = ids.map((id) => getMovie(id));
  const movie = await Promise.race(moviePromises);
  return movie;
}
//Movies on Paralel
async function getTopMoviesInParallel() {
  const ids = await getTopMoviesIds();
  const moviePromises = ids.map((id) => getMovie(id));
  const movies = await Promise.all(moviePromises);
  return movies;
}
//GetaRandomMovie
async function GetaRandomMovie() {
  const ids = await getRandomMoviesIds();
  const movies = [];

  for (const id of ids) {
    const movie = await getMovie(id);
    movies.push(movie);
  }

  return movies;
}
//funcion render para agregar mi informacion al HTML
function renderMovies(movies) {
  const movieList = document.getElementById("movies");
  movieList.innerHTML = "";
  movies.forEach((element) => {
    const listItem = document.createElement("div");
    listItem.classList.add("product-card");
    listItem.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w342${element.poster_path}" />
        <h4>${element.title}</h4>
        <p>Released on <em>${element.release_date}</em></p>
        <p>Puntuacion de IMDB<h5>${element.vote_average}</h5></p>
        `;

    movieList.appendChild(listItem);
  });
}
//Para hacer el onlick en los distintos botones
document.getElementById("fastest").onclick = async function () {
  const movie = await getFastestTopMovie();
  renderMovies([movie]);
};
//peliculas en paralelo
document.getElementById("parallel").onclick = async function () {
  const movies = await getTopMoviesInParallel();
  renderMovies(movies);
};
//random
document.getElementById("random").onclick = async function () {
  const movies = await GetaRandomMovie();
  renderMovies(movies);
};
