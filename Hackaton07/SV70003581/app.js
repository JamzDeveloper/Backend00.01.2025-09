require("dotenv").config();
const PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const axios = require('axios');
const path = require('path'); //Módulo
const HOST_RAPIDAPI = process.env.HOST_RAPIDAPI;
const KEY_RAPIAPI = process.env.KEY_RAPIAPI;
const KEY_TCA = process.env.KEY_TCA;
const CLIENT_UNS = process.env.CLIENT_UNS;
const AUTH_THEMOVIEDB = process.env.AUTH_THEMOVIEDB;
const HEAD_THEMOVIEDB = process.env.HEAD_THEMOVIEDB;
const KEY_NASA = process.env.KEY_NASA;

//CREACIÓN DE UN SERVIDOR HTTP USANDO EXPRESS

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//END POINTS
app.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post("/usuario", (req, res) => {
  let nombre = req.body.nombre;
  let html = "<div>";
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.github.com/users/${nombre}`,
    headers: {}
  };
  axios.request(config)
    .then((response) => {      
      data = response.data;      
      html += `<label>Login: </label><input value="${data.login}" disabled /><br>`;
      html += `<label>ID: </label><input value="${data.id}" disabled /><br>`;
      html += `<label>Node ID: </label><input value="${data.node_id}" disabled /><br>`;
      html += `<img src="${data.avatar_url}" width="200px" /><br>`;
      html += `<label>Perfil GitHub: </label><input value="${data.html_url}" disabled /><br>`;
      html += `<label>Tipo: </label><input value="${data.type}" disabled /><br>`;
      html += `<label>Vista Usuario: </label><input value="${data.user_view_type}" disabled /><br>`;
      html += `<label>Administrador del sitio: </label><input value="${data.site_admin}" disabled /><br>`;
      html += `<label>Nombre: </label><input value="${data.name}" disabled /><br>`;
      html += `<label>Compañía: </label><input value="${data.company}" disabled /><br>`;
      html += `<label>Blog personal: </label><input value="${data.blog}" disabled /><br>`;
      html += `<label>Ubicación: </label><input value="${data.location}" disabled /><br>`;
      html += `<label>Email: </label><input value="${data.email}" disabled /><br>`;
      html += `<label>Hireable: </label><input value="${data.hireable}" disabled /><br>`;
      html += `<label>Bio: </label><input value="${data.bio}" disabled /><br>`;
      html += `<label>Twitter: </label><input value="${data.twitter_username}" disabled /><br>`;
      html += `<label>Repos públicos: </label><input value="${data.public_repos}" disabled /><br>`;
      html += `<label>Gists públicos: </label><input value="${data.public_gists}" disabled /><br>`;
      html += `<label>Seguidores: </label><input value="${data.followers}" disabled /><br>`;
      html += `<label>Seguidos: </label><input value="${data.following}" disabled /><br>`;
      html += `<label>Fecha creación: </label><input value="${data.created_at}" disabled /><br>`;
      html += `<label>Última actualización: </label><input value="${data.updated_at}" disabled /><br>`;
      html += "</div>";
      res.send(html);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/clima", (req, res) => {
  let nombreCiudad = req.body.nombre;
  let html = "<div>";
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://weather-api99.p.rapidapi.com/weather?city=${nombreCiudad}`,
    headers: {
      'x-rapidapi-host': HOST_RAPIDAPI,
      'x-rapidapi-key': KEY_RAPIAPI
    }
  };
  axios.request(config)
    .then((response) => {
      let data = response.data;
      html += `<label>Temperatura Celsius: </label><input value="${data.main.temp - 273.15}" disabled />`
      html += "</div>";
      res.send(html);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/cambio", (req, res) => {
  let origen = req.body.origen;
  let destino;
  if (origen == "USD") { destino = "PEN" }
  if (origen == "PEN") { destino = "USD" }
  let monto = req.body.monto;
  let html = "<div>";
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.thecurrencyapi.com/convert?api_key=${KEY_TCA}&from=${origen}&to=${destino}&amount=${monto}`,
  };
  axios.request(config)
    .then((response) => {
      let data = response.data;
      html += `<label>Monto ingresado: ${origen} ${monto}</label><br>`,
        html += `<label>Monto equitativo: ${destino} ${data.data.converted_amount}</label>`
      html += "</div>";
      res.send(html);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/listadoPokemon", (req, res) => {
  let html = "<div>";
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://pokeapi.co/api/v2/pokemon?limit=100000/',
    headers: {}
  };
  axios.request(config)
    .then((response) => {
      //console.log(JSON.stringify(response.data));
      for (x = 0; x < 200; x++) {
        data = response.data.results[x];
        html += `<label>Nombre: "${data.name}"</label> <br>`
      }
      html += `<label>Nombre: "${data.name}"</label> <br>`
      html += "</div>"
      res.send(html)
    })
    .catch((error) => {
      console.log(error);
    });
})

app.post("/pokemon", (req, res) => {
  let pokemon = req.body.origen;
  let html = "<div>";
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://pokeapi.co/api/v2/pokemon/${pokemon}`,
    headers: {}
  };
  axios.request(config)
    .then((response) => {      
      data = response.data;
      data.moves.forEach(ablt => {
        html += `<label>Habilidad: ${ablt.move.name}</label><br>`;
      });
      html += "</div>";
      res.send(html);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/personajesRM", (req, res) => {
  let html = "<div>";
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://rickandmortyapi.com/api/character/',
    headers: {}
  };
  axios.request(config)
    .then((response) => {      
      data = response.data;
      for (x = 0; x < 5; x++) {
        html += `<label>Nombre: </label><label>"${data.results[x].name}"</label><br>`;
        html += `<label>Estado: </label><label>"${data.results[x].status}"</label><br>`;
        html += `<label>Especie: </label><label>"${data.results[x].species}"</label><br>`;
        html += `<label>Género: </label><label>"${data.results[x].gender}"</label><br>`;
        html += `<label>Ubicación: </label><label>"${data.results[x].location.name}"</label><br>`;
        html += `<label>Creación: </label><label>"${data.results[x].created}"</label><br>`;
        html += `<img src="${data.results[x].image}" width="200px" /><hr>`
      }
      html += "</div>";
      res.send(html);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/personajeRM", (req, res) => {
  let personaje = req.body.origen;
  let html = "<div>";
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://rickandmortyapi.com/api/character/?name=${personaje}`,
    headers: {}
  };
  axios.request(config)
    .then((response) => {      
      data = response.data.results[0];      
      html += `<H1>"${data.name}"</H1>`;
      html += `<img src="${data.image}" width="200px"/><br><br>`
      html += `<label>Nombre: </label><label>"${data.status}"</label><br>`;
      html += `<label>Especie: </label><label>"${data.species}"</label><br>`;
      html += `<label>Género: </label><label>"${data.gender}"</label><br>`;
      html += `<label>Origen: </label><label>"${data.origin.name}"</label><br>`;
      html += `<label>Ubicación: </label><label>"${data.location.name}"</label><br>`;
      html += "</div>";
      res.send(html);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/listadoCocktail", (req, res) => {
  let caracter = req.body.caracter;
  let html = "<div>";
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${caracter}`,
    headers: {}
  };
  axios.request(config)
    .then((response) => {      
      data = response.data;      
      for (x = 0; x < 10; x++) {
        html += `<H1>"${data.drinks[x].strDrink}"</H1>`;
        html += `<img src="${data.drinks[x].strDrinkThumb}" width="200px"/><br><br>`
        html += `<label>Preparación: </label><label>"${data.drinks[x].strInstructionsES}"</label>`;
      }
      html += "</div>";
      res.send(html);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/listadoStore", (req, res) => {
  let html = "<div>";
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://fakestoreapi.com/products/',
    headers: {}
  };
  axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      data = response.data;
      for (x = 0; x < 12; x++) {
        html += `<h1>"${data[x].title}"</h1>`;
        html += `<img src="${data[x].image}" width="200px"/><br>`
        html += `<label>Precio: S/."${data[x].price}" - ID: "${data[x].id}"</label><br>`;
        html += `<label>Descripción: </label><label>"${data[x].description}"</label><br>`;
        html += `<label>Categoría: </label><label>"${data[x].category}"</label><br><hr>`;
      }
      html += "</div>";
      res.send(html);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/fotografias", (req, res) => {
  let tema = req.body.tema;
  let tamano = req.body.tamano;
  let html = "<div>";
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.unsplash.com/search/photos?query=${tema}&client_id=${CLIENT_UNS}`,
    headers: {}
  };
  axios.request(config)
    .then((response) => {
      data = response.data.results[0];      
      switch (tamano) {
        case "raw":
          html += `<img src="${data.urls.raw}"/><br><br>`;
          break;
        case "full":
          html += `<img src="${data.urls.full}"/><br><br>`;
          break;
        case "small":
          html += `<img src="${data.urls.small}"/><br><br>`;
          break;
        case "thumb":
          html += `<img src="${data.urls.thumb}"/><br><br>`;
          break;
        default:
          break;
      }
      html += "</div>";
      res.send(html);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/citas", (req, res) => {
  let html = "<div>";
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://zenquotes.io/api/random'
  };
  axios.request(config)
    .then((response) => {      
      data = response.data[0];
      html += `<label>Cita: "${data.q}" </label><br>`;
      html += `<label>Autor: "${data.a}" </label>`;
      html += "</div>";
      res.send(html);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/random", (req, res) => {
  let html = "<div>";
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://randomuser.me/api/',
    headers: {}
  };
  axios.request(config)
    .then((response) => {      
      data = response.data.results[0];      
      html += `<label>Nombre: </label><input value="${data.name.first}" disabled /><br>`;
      html += `<label>Apellido: </label><input value="${data.name.last}" disabled /><br>`;
      html += `<label>Email: </label><input value="${data.email}" disabled /><br>`;
      html += `<img src="${data.picture.large}" width="200px" />`
      html += "</div>";
      res.send(html);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/peliculas", (req, res) => {
  let html = "<div>";
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api.themoviedb.org/3/movie/upcoming?page=1&language=es-ES',
    headers: {
      'Authorization': AUTH_THEMOVIEDB,
      'header': HEAD_THEMOVIEDB
    }
  };
  axios.request(config)
    .then((response) => {      
      data = response.data;      
      data.results.forEach(result => {
        html += `<h1>${result.title}</h1><br>`;
        html += `<img src="https://image.tmdb.org/t/p/w600_and_h900_bestv2${result.poster_path}" width="200px"/><br>`;
        html += `<label>Sinopsis: ${result.overview}</label><br>`;
        html += `<label>Idioma(s): ${result.original_language}</label><br>`;
        html += `<label>Fecha de lanzamiento: ${result.original_language}</label><br><hr>`;
      });
      html += "</div>";
      res.send(html);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/pelicula", (req, res) => {
  let nombre = req.body.nombre;
  let html = "<div>";
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.themoviedb.org/3/search/movie?query=${nombre}`,
    headers: {
      'Authorization': AUTH_THEMOVIEDB,
      'header': HEAD_THEMOVIEDB
    }
  };
  axios.request(config)
    .then((response) => {      
      let data = response.data;
      data.results.forEach(result => {
        html += `<h1>${result.title}</h1>`;
        html += `<img src="https://image.tmdb.org/t/p/w600_and_h900_bestv2${result.poster_path}" width="200px"/><br>`;
        html += `<label>Sinopsis: ${result.overview}</label><br>`;
        html += `<label>Lanzamiento: ${result.release_date}</label><br><hr>`;
      });
      html += "</div>";
      res.send(html);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/marte", (req, res) => {
  let html = "<div>";

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.nasa.gov/insight_weather/?api_key=${KEY_NASA}&feedtype=json&ver=1.0`,
    headers: {}
  };

  axios.request(config)
    .then((response) => {

      // Obtener el primer sol disponible
      const sol = response.data.sol_keys[0];
      const data = response.data[sol];

      html += `<label>Temperatura promedio (AT.av): ${data.AT.av} Cº</label><br>`;
      html += `<label>Cantidad de mediciones de temperatura (AT.ct): ${data.AT.ct}</label><br>`;
      html += `<label>Temperatura mínima (AT.mn): ${data.AT.mn} Cº</label><br>`;
      html += `<label>Temperatura máxima (AT.mx): ${data.AT.mx} Cº</label><br><br>`;

      html += `<label>Inicio del día (First_UTC): ${data.First_UTC}</label><br>`;
      html += `<label>Fin del día (Last_UTC): ${data.Last_UTC}</label><br><br>`;

      html += `<label>Velocidad del viento promedio (HWS.av): ${data.HWS.av} m/s</label><br>`;
      html += `<label>Cantidad de mediciones viento (HWS.ct): ${data.HWS.ct}</label><br>`;
      html += `<label>Velocidad mínima del viento (HWS.mn): ${data.HWS.mn} m/s</label><br>`;
      html += `<label>Velocidad máxima del viento (HWS.mx): ${data.HWS.mx} m/s</label><br><br>`;

      html += `<label>Mes marciano (Month_ordinal): ${data.Month_ordinal}</label><br>`;
      html += `<label>Estación (Season): ${data.Season}</label><br>`;
      html += `<label>Estación hemisferio norte (Northern_season): ${data.Northern_season}</label><br>`;
      html += `<label>Estación hemisferio sur (Southern_season): ${data.Southern_season}</label><br><br>`;

      html += `<label>Presión promedio (PRE.av): ${data.PRE.av} Pascal</label><br>`;
      html += `<label>Cantidad de mediciones presión (PRE.ct): ${data.PRE.ct}</label><br>`;
      html += `<label>Presión mínima (PRE.mn): ${data.PRE.mn} Pascal</label><br>`;
      html += `<label>Presión máxima (PRE.mx): ${data.PRE.mx} Pascal</label><br><br>`;

      html += `<label>Dirección del viento más común (WD.most_common.compass_point): ${data.WD.most_common.compass_point}</label><br>`;
      html += `<label>Grados de la dirección más común (WD.most_common.compass_degrees): ${data.WD.most_common.compass_degrees}</label><br>`;
      html += `<label>Conteo de la dirección más común (WD.most_common.ct): ${data.WD.most_common.ct}</label><br><br>`;

      html += "</div>";
      res.send(html);
    })
    .catch((error) => {
      console.log(error);
      res.send("Error al consultar la API de Marte");
    });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto: ${PORT}`);
});