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
//Get a single movie only for the fastes
async function getMovie(id) {
  const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
//async function for the Top Movie
async function getFastestTopMovie() {
  //Para obtener una lista de indetificadores de las m.pelis.
  const ids = await getTopMoviesIds();
  const moviePromises = ids.map((id) => getMovie(id));

  const movie = await Promise.race(moviePromises);
  return movie;
}
//funcion render para agregar mi informacion al HTML
function renderMovies(movies) {
  const movieList = document.getElementById("movies");
  movieList.innerHTML = "";

  movies.forEach((movie) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w342${movie.poster_path}" />
        <h5>${movie.title}</h5>
        <p>Released on <em>${movie.release_date}</em></p>
        `;

    movieList.appendChild(listItem);
  });
}
document.getElementById("fastest").onclick = async function () {
  const movie = await getFastestTopMovie();
  renderMovies([movie]);
};
