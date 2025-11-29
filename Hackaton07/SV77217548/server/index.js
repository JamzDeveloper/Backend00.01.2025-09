const express = require("express");
const path = require("path");
const axios = require("axios");

class Server {

    constructor() {
        this.port = process.env.PORT || 8080;
        this.githubApi = process.env.GITHUB_API;
        this.openWeatherKey = process.env.OPENWEATHER_KEY;
        this.exchangeKey = process.env.EXCHANGE_API_KEY;
        this.unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
        this.quotesKey = process.env.QUOTE_API_KEY; // es api key de Nija https://api-ninjas.com/api/quotes
        this.tmdbKey = process.env.TMDB_API_KEY;
        this.nasaApi = process.env.NASA_API;
        this.nasaApiKey = process.env.NASA_API_KEY;
        
        this.app = express();

        this.middlewares();
        this.routes();

        this.dbConnection();
    }

    middlewares() {
        // Para parsear JSON y formularios
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));

        // Configurar carpeta views para vistas con pug
        this.app.set("view engine", "pug");
        this.app.set("views", path.join(__dirname, "../views"));

        // Carpeta pública para CSS, imágenes, etc.
        this.app.use(express.static(path.join(__dirname, "../public")));
    }

    routes() {
        // Vista Principal Web
        this.app.get("/", (req, res) => {
            res.render("index");
        });

        // Consultar los datos de GitHub de un usuario especifico.
        this.app.get("/github", async (req, res) => {
            const username = (req.query.username || "").trim();

            if (!username) {
                return res.render("github", {
                    error: "Debes ingresar un usuario de GitHub",
                    user: null,
                });
            }

            try {
                const result = await axios.get(
                    `${this.githubApi}${username}`
                );

                if (!result.data) {
                    return res.render("github", {
                        error: "No se encontraron datos del usuario",
                        user: null,
                    });
                }
                res.render("github", {
                    error: null,
                    user: result.data,
                });
            } catch (err) {
                console.error(err.message);
                res.render("github", {
                    error: "Ocurrió un error consultando GitHub",
                    user: null,
                });
            }
        });

        // Consultar el Clima de una ciudad o ubicacion especifica.
        this.app.get("/clima", async (req, res) => {
            const ciudad = (req.query.ciudad || "").trim();

            if (!ciudad) {
                return res.render("clima", {
                    error: "Debes ingresar una ciudad",
                    ciudad: null,
                    weather: null,
                });
            }

            try {
                const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
                    ciudad
                )}&appid=${this.openWeatherKey}&units=metric`;

                const result = await axios.get(url);

                res.render("clima", {
                    error: null,
                    ciudad,
                    weather: result.data,
                });
            } catch (err) {
                console.error(err.message);
                res.render("clima", {
                    error: "Ocurrió un error consultando el clima",
                    ciudad,
                    weather: null,
                });
            }
        });

        // Consultar el tipo de cambio del dolar en Peru.
        this.app.get("/cambio", async (req, res) => {
            // moneda destino, por defecto PEN
            const to = (req.query.to || "PEN").trim().toUpperCase();
            // monto en USD, por defecto 1
            const amount = Number(req.query.amount || 1);

            try {
                const url = `https://v6.exchangerate-api.com/v6/${this.exchangeKey}/latest/USD`;
                const result = await axios.get(url);

                const rates = result.data.conversion_rates;
                const rate = rates[to];

                if (!rate) {
                    return res.render("cambio", {
                        error: `La moneda "${to}" no existe o no está soportada`,
                        base: "USD",
                        to,
                        amount,
                        rate: null,
                        converted: null,
                        date: result.data.time_last_update_utc,
                        raw: result.data,
                    });
                }

                const converted = amount * rate;

                res.render("cambio", {
                    error: null,
                    base: "USD",
                    to,
                    amount,
                    rate,
                    converted,
                    date: result.data.time_last_update_utc,
                    raw: result.data,
                });
            } catch (err) {
                console.error("Error consultando tipo de cambio:", err.response?.data || err.message);
                res.render("cambio", {
                    error: "Ocurrió un error consultando el tipo de cambio",
                    base: "USD",
                    to,
                    amount,
                    rate: null,
                    converted: null,
                    date: null,
                    raw: null,
                });
            }
        });

        // Consultar la lista de Pokemones actual.
        this.app.get("/pokemones", async (req, res) => {
            const rawLimit = (req.query.limit || "todos").trim().toLowerCase();

            let limit;

            if (rawLimit === "todos") {
                limit = 100000;
            } else {
                const parsed = Number(rawLimit);

                if (!rawLimit || Number.isNaN(parsed) || parsed <= 0) {
                    return res.render("pokemon-list", {
                        error: 'El valor de "Cantidad" debe ser un número positivo o la palabra "todos"',
                        list: null,
                    });
                }

                limit = parsed;
            }

            try {
                const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=0`;
                const result = await axios.get(url);

                res.render("pokemon-list", {
                    error: null,
                    list: result.data,
                });
            } catch (err) {
                console.error(err.message);
                res.render("pokemon-list", {
                    error: "Ocurrió un error consultando la lista de pokemones",
                    list: null,
                });
            }
        });


        // Consultar los poderes de un pokemon especifico.
        this.app.get("/pokemon", async (req, res) => {
            const name = (req.query.name || "").trim().toLowerCase();

            if (!name) {
                return res.render("pokemon", {
                    error: "Debes ingresar el nombre de un Pokémon",
                    pokemon: null,
                    abilities: null,
                });
            }

            try {
                const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
                const result = await axios.get(url);
                const pokemon = result.data;
                const abilities = pokemon.abilities.map(a => a.ability.name);

                res.render("pokemon", {
                    error: null,
                    pokemon,
                    abilities,
                });
            } catch (err) {
                console.error(err.message);
                res.render("pokemon", {
                    error: "Ocurrió un error consultando el Pokémon",
                    pokemon: null,
                    abilities: null,
                });
            }
        });

        // Consultar los principales personajes de Rick and Morty
        this.app.get("/rick", async (req, res) => {
            const rawLimit = (req.query.limit || "todos").trim().toLowerCase();

            let limit;
            if (rawLimit === "todos") {
                limit = Infinity;
            } else {
                const parsed = Number(rawLimit);
                if (!rawLimit || Number.isNaN(parsed) || parsed <= 0) {
                    return res.render("rick", {
                        error: 'El valor de "Cantidad" debe ser un número positivo o la palabra "todos"',
                        info: null,
                        characters: null,
                    });
                }
                limit = parsed;
            }

            try {
                const characters = [];
                let nextUrl = "https://rickandmortyapi.com/api/character";
                let info = null;

                while (nextUrl && characters.length < limit) {
                    const result = await axios.get(nextUrl);
                    info = result.data.info;
                    characters.push(...result.data.results);
                    nextUrl = result.data.info.next;
                }

                if (limit !== Infinity) {
                    characters.splice(limit);
                }

                res.render("rick", {
                    error: null,
                    info,
                    characters,
                });
            } catch (err) {
                console.error(err.message);
                res.render("rick", {
                    error: "Ocurrió un error consultando personajes",
                    info: null,
                    characters: null,
                });
            }
        });

        // Detalle personaje Rick and Morty
        this.app.get("/rick/personaje", async (req, res) => {
            const id = (req.query.id || "").trim();
            const name = (req.query.name || "").trim();

            if (!id && !name) {
                return res.render("rick-detail", {
                    error: "Debes ingresar un ID o nombre de personaje",
                    character: null,
                });
            }

            try {
                let character;

                if (id) {
                    // Busqueda por ID
                    const url = `https://rickandmortyapi.com/api/character/${id}`;
                    const result = await axios.get(url);
                    character = result.data;
                } else {
                    // Busqueda por nombre
                    const url = `https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(name)}`;
                    const result = await axios.get(url);

                    if (!result.data.results || !result.data.results.length) {
                        return res.render("rick-detail", {
                            error: `No se encontró ningún personaje con el nombre "${name}"`,
                            character: null,
                        });
                    }

                    character = result.data.results[0];
                }

                res.render("rick-detail", {
                    error: null,
                    character,
                });
            } catch (err) {
                console.error(err.message);
                res.render("rick-detail", {
                    error: "Ocurrió un error consultando el personaje",
                    character: null,
                });
            }
        });


        // Consultar el top 10 de bebidas y cocteles
        // La consulta del top de bebidas es premium y cuesta 10 dolares, así que saqué
        // solo 10 al azar.
        this.app.get("/cocktails", async (req, res) => {
            try {
                const HOW_MANY = 10;

                const requests = [];
                for (let i = 0; i < HOW_MANY; i++) {
                    requests.push(
                        axios.get("https://www.thecocktaildb.com/api/json/v1/1/random.php")
                    );
                }

                const results = await Promise.all(requests);

                const drinks = [];
                const seen = new Set();

                for (const r of results) {
                    const drink = r.data?.drinks?.[0];
                    if (drink && !seen.has(drink.idDrink)) {
                        seen.add(drink.idDrink);
                        drinks.push(drink);
                    }
                }

                res.render("cocktails", {
                    error: null,
                    drinks,
                });
            } catch (err) {
                console.error("Error consultando cocteles:", err.response?.data || err.message);
                res.render("cocktails", {
                    error: "Ocurrió un error consultando cocteles",
                    drinks: [],
                });
            }
        });


        // Consultar un listado de productos de una tienda
        this.app.get("/productos", async (req, res) => {
            let limit = parseInt(req.query.limit, 10);
            if (Number.isNaN(limit) || limit <= 0) {
                limit = 10;
            }

            try {
                const url = "https://fakestoreapi.com/products";
                const result = await axios.get(url);

                let products = result.data || [];

                for (let i = products.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [products[i], products[j]] = [products[j], products[i]];
                }

                products = products.slice(0, limit);

                res.render("productos", {
                    error: null,
                    products,
                });
            } catch (err) {
                console.error("Error consultando productos:", err.message);
                res.render("productos", {
                    error: "Ocurrió un error consultando productos",
                    products: [],
                });
            }
        });

        // Consultar y traer Fotografias con un determinado tema y tamaño
        this.app.get("/fotos", async (req, res) => {
            const query = (req.query.q || "").trim();

            if (!query) {
                return res.render("fotos", {
                    error: "Debes ingresar un tema para buscar fotos",
                    query: null,
                    data: null,
                });
            }

            try {
                const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
                    query
                )}&per_page=10&client_id=${this.unsplashKey}`;

                const result = await axios.get(url);

                res.render("fotos", {
                    error: null,
                    query,
                    data: result.data,
                });
            } catch (err) {
                console.error(err.message);
                res.render("fotos", {
                    error: "Ocurrió un error consultando fotos",
                    query,
                    data: null,
                });
            }
        });

        // Consultar citas famosas
        this.app.get("/frase", async (req, res) => {
            try {
                const url = "https://api.api-ninjas.com/v2/quoteoftheday";
                const headers = {
                    "X-Api-Key": this.quotesKey,
                };

                const result = await axios.get(url, { headers });
                const quote = result.data && result.data[0];

                res.render("frase", {
                    error: null,
                    quote,
                    raw: result.data,
                });
            } catch (err) {
                console.error(err.response?.data || err.message);
                res.render("frase", {
                    error: "Ocurrió un error consultando una frase",
                    quote: null,
                    raw: null,
                });
            }
        });


        // Consultar datos ficticios de un usuario.
        this.app.get("/random-user", async (req, res) => {
            try {
                const url = "https://randomuser.me/api/";
                const result = await axios.get(url);
                const user = result.data.results[0];

                res.render("random-user", {
                    error: null,
                    user,
                });
            } catch (err) {
                console.error(err.message);
                res.render("random-user", {
                    error: "Ocurrió un error consultando usuario aleatorio",
                    user: null,
                });
            }
        });

        // Consultar el top de peliculas de estreno
        this.app.get("/peliculas", async (req, res) => {
            try {
                const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${this.tmdbKey}&language=es-ES&page=1`;
                const result = await axios.get(url);

                const moviesData = result.data || {};
                const results = moviesData.results || [];

                // Solo el top 10
                moviesData.results = results.slice(0, 10);

                res.render("peliculas", {
                    error: null,
                    movies: moviesData,
                });
            } catch (err) {
                console.error(err.message);
                res.render("peliculas", {
                    error: "Ocurrió un error consultando películas",
                    movies: null,
                });
            }
        });


        // Consultar el detalle de una pelicula especifica
        this.app.get("/pelicula", async (req, res) => {
            const id = (req.query.id || "").trim();
            const name = (req.query.name || "").trim();

            if (!id && !name) {
                return res.render("pelicula", {
                    error: "Debes ingresar un ID o un nombre de película",
                    movie: null,
                });
            }

            try {
                let movie;

                if (id) {
                    // Busqueda por ID
                    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${this.tmdbKey}&language=es-ES`;
                    const result = await axios.get(url);
                    movie = result.data;
                } else {
                    // Busqueda por nombre
                    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${this.tmdbKey}&language=es-ES&query=${encodeURIComponent(name)}`;
                    const searchResult = await axios.get(searchUrl);

                    const results = searchResult.data.results || [];
                    if (!results.length) {
                        return res.render("pelicula", {
                            error: `No se encontró ninguna película con el nombre "${name}"`,
                            movie: null,
                        });
                    }

                    const movieId = results[0].id;
                    const detailUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${this.tmdbKey}&language=es-ES`;
                    const detailResult = await axios.get(detailUrl);
                    movie = detailResult.data;
                }

                res.render("pelicula", {
                    error: null,
                    movie,
                });
            } catch (err) {
                console.error(err.message);
                res.render("pelicula", {
                    error: "Ocurrió un error consultando la película",
                    movie: null,
                });
            }
        });

        // Consultar datos especificos de Marte.
        this.app.get("/mars", async (req, res) => {
            try {
                const result = await axios.get(
                    `${this.nasaApi}/insight_weather/?api_key=${this.nasaApiKey}&feedtype=json&ver=1.0`
                );
                res.render("mars", {
                    data: result.data,
                    error: null,
                });
            } catch (err) {
                console.error(err.message);
                res.render("mars", {
                    data: null,
                    error: "Ocurrió un error consultando los datos de Marte",
                });
            }
        });
    }
    
    dbConnection() {}
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}

module.exports = {
    Server,
};

