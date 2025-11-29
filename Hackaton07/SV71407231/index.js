const express = require("express");
const axios = require('axios');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

//Ejercicio 1
class GitHubService {
    constructor(username){
        this.username = username;
    }
    getUser() {
        const url = `https://api.github.com/users/${this.username}`; //Usuario unico, mi perfil: Harold-11 (.env)
        return axios.get(url);
    }

}

app.get("/github", (req, res) => {
    const service = new GitHubService(process.env.GITHUB_USER);

    service.getUser()
        .then(response => {
            res.json({
                    mensaje: "Datos del usuario en GitHub",
                    data: response.data
            });
        })
        .catch(error => {
                console.log(error);
        });

})

//Ejercicio 2
class ClimaService {
    constructor(ciudad, apiKey, units = "metric", lang = "es") {
        this.ciudad = ciudad;
        this.apiKey = apiKey;
        this.units = units;
        this.lang = lang;
    }
    getClima() {
        const url = "https://api.openweathermap.org/data/2.5/weather";

        return axios.get(url, {
            params: {
                q: this.ciudad,
                appid: this.apiKey,
                units: this.units,
                lang: this.lang
            }
        });
    }
}
app.get("/clima", (req, res) => {
    const service = new ClimaService (
        process.env.CIUDAD,
        process.env.API_KEY,
        process.env.UNITS,
        process.env.LANG
    )
    service 
        .getClima()
        .then(response => {
            const clima = response.data;
            res.json({
                mensaje: `Clima actual en ${clima.name}`,
                // data: response.data
                ciudad: clima.name,
                pais: clima.sys.country,
                temperatura: clima.main.temp,
                sensacion: clima.main.feels_like,
                humedad: clima.main.humidity
            });
        })
        .catch(error => {
                console.log(error);
        });
})

//Ejercicio 3
class CambioDeDolar {
    constructor() {
        this.url = "https://api.apis.net.pe/v1/tipo-cambio-sunat";
    }

    getTipoCambio() {
        return axios.get(this.url);
    }
}

app.get("/dolar", (req, res) => {
    const service = new CambioDeDolar();

    service.getTipoCambio()
        .then(response => {
            const data = response.data;

            res.json({
                mensaje: "Tipo de cambio del dólar según la SUNAT",
                compra: data.compra,
                venta: data.venta,
                fecha: data.fecha
            });
        })
        .catch(error => {
                console.log(error);
        });
});

//Ejercicio 4
class PokeAPI {
    constructor() {
        this.url = "https://pokeapi.co/api/v2/pokemon";
    }

    getPokemons(limit = 2000) {
        return axios.get(`${this.url}?limit=${limit}`);
    }
}
app.get("/pokemons", (req, res) => {
    const service = new PokeAPI();

    service.getPokemons()
        .then(response => {
            const data = response.data;

            res.json({
                mensaje: "Lista de Pokemones (PokeAPI)",
                total: data.count,
                resultados: data.results  
            });
        })
        .catch(error => {
                console.log(error);
        });
});
//Ejercicio 5
class PoderesDePokemon {
    constructor() {
        this.url = "https://pokeapi.co/api/v2/pokemon";
    }

    getPokemon(nameOrId) {
        return axios.get(`${this.url}/${nameOrId}`);
    }    
}

app.get("/pokemon/powers/:nameOrId", (req, res) => { //Ejemplo: http://localhost:3000/pokemon/powers/charmander
    const { nameOrId } = req.params;
    const service = new PoderesDePokemon();

    service.getPokemon(nameOrId)
        .then(response => {
            const data = response.data;
            const powers = data.moves.map(m => m.move.name);

            res.json({
                mensaje: `Poderes del Pokémon: ${data.name}`,
                total_poderes: powers.length,
                poderes: powers
            });
        })
        .catch(error => {
                console.log(error);
        });
});

//Ejercicio 6
class RickAndMortyService {
    constructor() {
        this.url = "https://rickandmortyapi.com/api/character";
    }

    getPersonajesPrincipales() {
        return axios.get(this.url);
    }
}
app.get("/rickandmorty", (req, res) => {
    const service = new RickAndMortyService();

    service.getPersonajesPrincipales()
        .then(response => {
            const personajes = response.data.results;
            const principales = personajes.slice(0, 5);

            res.json({
                mensaje: "Principales personajes de Rick and Morty",
                personajes: principales.map(p => ({
                    nombre: p.name,
                    especie: p.species,
                    estado: p.status,
                    imagen: p.image
                }))
            });
        })
        .catch(error => {
                console.log(error);
        });
});
//Ejercicio 7
class PersonajeDeRickAndMorty {
    constructor() {
        this.url = "https://rickandmortyapi.com/api/character";
    }

    getPersonajePorId(id) {
        return axios.get(`${this.url}/${id}`);
    }
}
app.get("/rickandmorty/:id", (req, res) => { //por ejemplo: http://localhost:3000/rickandmorty/1
    const id = req.params.id;
    const service = new PersonajeDeRickAndMorty();

    service.getPersonajePorId(id)
        .then(response => {
            const p = response.data;

            res.json({
                mensaje: "Detalle del personaje",
                personaje: {
                    nombre: p.name,
                    estado: p.status,
                    especie: p.species,
                    genero: p.gender,
                    origen: p.origin.name,
                    ubicacionActual: p.location.name,
                    imagen: p.image
                }
            });
        })
        .catch(error => {
                console.log(error);
        });
});
//Ejercicio 8
class CoctelService {
    constructor() {
        this.url = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail";
    }

    getTop10() {
        return axios.get(this.url);
    }
}
app.get("/cocteles", (req, res) => {
    const service = new CoctelService();

    service.getTop10()
        .then(response => {
            const lista = response.data.drinks;

            const top10 = lista.slice(0, 10).map(drink => ({
                id: drink.idDrink,
                nombre: drink.strDrink,
                categoria: drink.strCategory,
                tipo: drink.strAlcoholic,
                vaso: drink.strGlass,
                imagen: drink.strDrinkThumb
            }));

            res.json({
                mensaje: "Top 10 bebidas y cócteles",
                total: top10.length,
                data: top10
            });
        })
        .catch(error => {
                console.log(error);
        });
});
//Ejercicio 9
class StoreService {
    constructor() {
        this.url = "https://fakestoreapi.com/products";
    }

    getProductos() {
        return axios.get(this.url);
    }
}
app.get("/tienda", (req, res) => {
    const service = new StoreService();

    service.getProductos()
        .then(response => {
            const productos = response.data;

            res.json({
                mensaje: "Listado de productos de la tienda",
                total: productos.length,
                data: productos
            });
        })
        .catch(error => {
                console.log(error);
        });
});
//Ejercicio 10

class UnsplashService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.url = "https://api.unsplash.com/search/photos";
    }

    buscarFotos(tema, cantidad) {
        return axios.get(this.url, {
            params: {
                query: tema,
                per_page: cantidad,
                client_id: this.apiKey
            }
        });
    }
}
app.get("/fotos/:tema/:cantidad/:tamanio", (req, res) => { //por ejemplo: http://localhost:3000/fotos/peru/5/small
    const { tema, cantidad,tamanio } = req.params;
    const service = new UnsplashService(process.env.UNSPLASH_KEY);

    service.buscarFotos(tema, cantidad)
        .then(response => {
            const fotos = response.data.results.map(img => ({
                id: img.id,
                descripcion: img.alt_description,
                url: img.urls[tamanio] || img.urls.regular
            }));

            res.json({
                mensaje: `Fotos sobre ${tema} (${tamanio})`,
                total: fotos.length,
                data: fotos
            });
        })
        .catch(error => {
                console.log(error);
        });
});
//Ejercicio 11 
class QuoteService {
    constructor() {
        this.url = "https://zenquotes.io/api/random";
    }

    getRandomQuote() {
        return axios.get(this.url);
    }
}

app.get("/cita", (req, res) => {
    const service = new QuoteService();

    service.getRandomQuote()
        .then(response => {
            const q = response.data[0]; 

            res.json({
                mensaje: "Cita famosa del día",
                autor: q.a,
                cita: q.q
            });
        })
        .catch(error => {
                console.log(error);
        });
});
//Ejercicio 12
class RandomUserService {
    constructor() {
        this.url = "https://randomuser.me/api/";
    }

    getUsuario() {
        return axios.get(this.url);
    }
}
app.get("/usuario-fake", (req, res) => {
    const service = new RandomUserService();

    service.getUsuario()
        .then(response => {
            const user = response.data.results[0];

            res.json({
                mensaje: "Usuario ficticio generado correctamente",
                nombre: `${user.name.first} ${user.name.last}`,
                genero: user.gender,
                email: user.email,
                telefono: user.phone,
                pais: user.location.country,
                ciudad: user.location.city,
                imagen: user.picture.large
            });
        })
        .catch(error => {
                console.log(error);
        });
});
//Ejercicio 12
class MovieService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.url = "https://api.themoviedb.org/3/movie/now_playing";
    }

    getEstrenos() {
        return axios.get(this.url, {
            params: {
                api_key: this.apiKey,
                language: "es-ES",
                page: 1
            }
        });
    }
}

app.get("/peliculas/estrenos", (req, res) => {
    const service = new MovieService(process.env.TMDB_KEY);

    service.getEstrenos()
        .then(response => {
            const peliculas = response.data.results;

            res.json({
                mensaje: "Top películas en estreno",
                total: peliculas.length,
                data: peliculas.map(p => ({
                    id: p.id,
                    titulo: p.title,
                    sinopsis: p.overview,
                    fecha_estreno: p.release_date,
                    popularidad: p.popularity,
                    poster: `https://image.tmdb.org/t/p/w500${p.poster_path}`
                }))
            });
        })
        .catch(error => {
                console.log(error);
        });
});
//Ejercicio 13
class NombreDePelicula {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.url = "https://api.themoviedb.org/3/movie";
    }

    getPelicula(id) {
        return axios.get(`${this.url}/${id}`, {
            params: {
                api_key: this.apiKey,
                language: "es-ES"
            }
        });
    }
}

app.get("/pelicula/:id", (req, res) => { //ejemplo: http://localhost:3000/pelicula/550
    const { id } = req.params;
    const service = new NombreDePelicula(process.env.TMDB_KEY);

    service.getPelicula(id)
        .then(response => {
            const p = response.data;

            res.json({
                mensaje: "Detalle de la película",
                pelicula: {
                    titulo: p.title,
                    tagline: p.tagline,
                    resumen: p.overview,
                    popularidad: p.popularity,
                    duracion: p.runtime,
                    fecha_estreno: p.release_date,
                    presupuesto: p.budget,
                    generos: p.genres,
                    imagen: "https://image.tmdb.org/t/p/w500" + p.poster_path
                }
            });
        })
        .catch(error => {
                console.log(error);
        });
});
//Ejercicio 14
class MarteWeatherService {
    constructor(apiKey) {
        this.url = `https://api.nasa.gov/insight_weather/?api_key=${apiKey}&feedtype=json&ver=1.0`;
    }

    getUltimoSol() {
        return axios.get(this.url);
    }
}

app.get("/marte/weather", (req, res) => {
    const service = new MarteWeatherService(process.env.NASA_KEY || "DEMO_KEY");

    service.getUltimoSol()
        .then(response => {
            const data = response.data;
            const solKeys = data.sol_keys;

            if (!solKeys || solKeys.length === 0) {
                return res.json({ mensaje: "No hay datos disponibles de Marte" });
            }

            const ultimoSol = solKeys[solKeys.length - 1];
            const solData = data[ultimoSol];

            res.json({
                mensaje: `Clima en Marte para el sol ${ultimoSol}`,
                sol: ultimoSol,
                temperatura: solData.AT ? {
                    promedio: solData.AT.av,
                    minima: solData.AT.mn,
                    maxima: solData.AT.mx
                } : "No disponible",
                viento: solData.HWS ? {
                    promedio: solData.HWS.av,
                    minima: solData.HWS.mn,
                    maxima: solData.HWS.mx
                } : "No disponible",
                presion: solData.PRE ? {
                    promedio: solData.PRE.av,
                    minima: solData.PRE.mn,
                    maxima: solData.PRE.mx
                } : "No disponible",
                primer_registro: solData.First_UTC,
                ultimo_registro: solData.Last_UTC
            });
        })
        .catch(error => {
                console.log(error);
        });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});