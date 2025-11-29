const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Bienvenido al API Gateway - Consulta centralizada de APIs');
});

// 1. GitHub usuario
app.get('/github', async (req, res) => {
    const user = req.query.user || 'rpinedaec83';
    try {
        const response = await axios.get(`https://api.github.com/users/${user}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error en GitHub API');
    }
});

// 2. Clima
app.get('/clima', async (req, res) => {
    const ciudad = req.query.ciudad || 'Lima';
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${process.env.OPENWEATHER_KEY}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error en Clima API - Revisa tu key');
    }
});

// 3. Tipo de cambio dólar en Perú
app.get('/dolar', async (req, res) => {
    try {
        const response = await axios.get('https://api.frankfurter.app/latest?base=USD&symbols=PEN');
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error en Dólar API');
    }
});

// 4. Lista de Pokemones
app.get('/pokemons', async (req, res) => {
    try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=10');
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error en Pokemons API');
    }
});

// 5. Poderes de un Pokémon
app.get('/pokemon', async (req, res) => {
    const nombre = req.query.nombre || 'pikachu';
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
        res.json(response.data.abilities);
    } catch (error) {
        res.status(500).send('Error en Pokémon Poderes API');
    }
});

// 6. Personajes de Rick and Morty
app.get('/rickmorty', async (req, res) => {
    try {
        const response = await axios.get('https://rickandmortyapi.com/api/character');
        res.json(response.data.results.slice(0, 10)); // Top 10
    } catch (error) {
        res.status(500).send('Error en Rick and Morty API');
    }
});

// 7. Detalle de personaje Rick and Morty
app.get('/rickmortydetalle', async (req, res) => {
    const id = req.query.id || '1';
    try {
        const response = await axios.get(`https://rickandmortyapi.com/api/character/${id}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error en Rick and Morty Detalle API');
    }
});

// 8. Top 10 bebidas y cocteles
app.get('/cocteles', async (req, res) => {
    try {
        const response = await axios.get('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
        res.json(response.data.drinks.slice(0, 10));
    } catch (error) {
        res.status(500).send('Error en Cocteles API');
    }
});

// 9. Listado de productos tienda
app.get('/productos', async (req, res) => {
    try {
        const response = await axios.get('https://fakestoreapi.com/products');
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error en Productos API');
    }
});

// 10. Fotos con tema y tamaño
app.get('/fotos', async (req, res) => {
    const tema = req.query.tema || 'nature';
    const tamano = req.query.tamano || 'regular'; // small, regular, full
    try {
        const response = await axios.get(`https://api.unsplash.com/search/photos?query=${tema}&per_page=1&client_id=${process.env.UNSPLASH_KEY}`);
        const fotoUrl = response.data.results[0].urls[tamano];
        res.json({ url: fotoUrl });
    } catch (error) {
        res.status(500).send('Error en Fotos API - Revisa tu key');
    }
});

// 11. Citas famosas
app.get('/citas', async (req, res) => {
    try {
        const response = await axios.get('https://quotes.rest/qod');
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error en Citas API');
    }
});

// 12. Datos ficticios usuario
app.get('/usuario', async (req, res) => {
    try {
        const response = await axios.get('https://randomuser.me/api/');
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error en Usuario Ficticio API');
    }
});

// 13. Top películas estreno
app.get('/peliculas', async (req, res) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.TMDB_KEY}`);
        res.json(response.data.results.slice(0, 10));
    } catch (error) {
        res.status(500).send('Error en Películas API - Revisa tu key');
    }
});

// 14. Detalle película
app.get('/pelicula', async (req, res) => {
    const id = req.query.id || '550';
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_KEY}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error en Película Detalle API');
    }
});

// 15. Datos de Marte
app.get('/marte', async (req, res) => {
    try {
        const response = await axios.get('https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=DEMO_KEY');
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error en Marte API');
    }
});

// Ruta centralizada
app.get('/all', async (req, res) => {
    try {
        const github = await axios.get(`https://api.github.com/users/${req.query.user || 'rpinedaec83'}`);
        const clima = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${req.query.ciudad || 'Lima'}&appid=${process.env.OPENWEATHER_KEY}`);
        const dolar = await axios.get('https://api.frankfurter.app/latest?base=USD&symbols=PEN');
        const pokemons = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=10');
        const pokemon = await axios.get(`https://pokeapi.co/api/v2/pokemon/${req.query.nombre || 'pikachu'}`);
        const rickmorty = await axios.get('https://rickandmortyapi.com/api/character');
        const rickmortydetalle = await axios.get(`https://rickandmortyapi.com/api/character/${req.query.id || '1'}`);
        const cocteles = await axios.get('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
        const productos = await axios.get('https://fakestoreapi.com/products');
        const fotos = await axios.get(`https://api.unsplash.com/search/photos?query=${req.query.tema || 'nature'}&per_page=1&client_id=${process.env.UNSPLASH_KEY}`);
        const citas = await axios.get('https://quotes.rest/qod');
        const usuario = await axios.get('https://randomuser.me/api/');
        const peliculas = await axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.TMDB_KEY}`);
        const pelicula = await axios.get(`https://api.themoviedb.org/3/movie/${req.query.id || '550'}?api_key=${process.env.TMDB_KEY}`);
        const marte = await axios.get('https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=DEMO_KEY');

        res.json({
            github: github.data,
            clima: clima.data,
            dolar: dolar.data,
            pokemons: pokemons.data,
            pokemon: pokemon.data.abilities,
            rickmorty: rickmorty.data.results.slice(0, 10),
            rickmortydetalle: rickmortydetalle.data,
            cocteles: cocteles.data.drinks.slice(0, 10),
            productos: productos.data,
            fotos: fotos.data.results[0].urls.regular,
            citas: citas.data,
            usuario: usuario.data,
            peliculas: peliculas.data.results.slice(0, 10),
            pelicula: pelicula.data,
            marte: marte.data
        });
    } catch (error) {
        console.error('ERROR DETALLADO EN /all:', error.message);
        if (error.response) {
            console.error('Datos del error:', error.response.data);
            console.error('Status:', error.response.status);
        }
        res.status(500).json({ 
            error: 'Fallo en una API externa', 
            detalles: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});