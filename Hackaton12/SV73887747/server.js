const http = require('http');
const crypto = require('crypto');
const { deserialize } = require('v8');

let listSales = [];

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if(method === 'GET' && url === '/api/lista') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(listSales));
    console.log(listSales);
    return;
  }
  
  if(method === 'GET' && url === '/api/lista/pendientes') {
    const pendientes = listSales.filter(item => item.esCompletado === false);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(pendientes));
    console.log(pendientes);
    return;
  };

  if(method === 'GET' && url === '/api/lista/completados') {
    const completados = listSales.filter(item => item.esCompletado === true);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(completados));
    console.log(completados);
    return;
  };

  if(method === 'POST' && url === '/api/lista') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        if (!data.name || !data.description || !data.date || typeof data.esCompletado !== 'boolean') {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Faltan campos requeridos o esCompletado no es boolean' }));
          return;
        }
        const dataWithId = {
          id: crypto.randomUUID(),
          name: data.name,
          description: data.description,
          date: data.date,
          esCompletado: data.esCompletado
        };
        listSales.push(dataWithId);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(dataWithId));
        console.log(dataWithId);
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'JSON inválido' }));
      }
    });
    return;
  };

  if(method==='PUT' && url.startsWith('/api/lista/')){
    const id = url.split('/')[3];

    let body = '';
    req.on('data', chunk=>{
      body += chunk.toString();
    });
    req.on('end', ()=>{
      try{
        const data= JSON.parse(body);

        const index = listSales.findIndex(item=> item.id===id);

        if(index === -1){
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'No se encontro la venta' }));
          return;
        }

        if(typeof data.esCompletado !== 'boolean'){
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'esCompletado debe ser boolean' }));
          return;
        }

        listSales[index].esCompletado = data.esCompletado;

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(listSales[index]));
        console.log(listSales[index]);
      } catch(error){
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'JSON inválido' }));
      }
    })
    return;
  };

  if(method==='DELETE' && url.startsWith('/api/lista/')){
    const id = url.split('/')[3];

    const index = listSales.findIndex(item=> item.id===id);

    if(index === -1){
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'No se encontro la venta' }));
      return;
    }

    console.log(`Venta ${listSales[index]} con id ${id} sera eliminada`);
    listSales.splice(index, 1);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Venta eliminada correctamente' }));
    console.log('Venta eliminada correctamente');
    return;
  };
  
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Ruta no encontrada' }));
});

server.listen(3000, () => {
  console.log('Server corriendo en http://localhost:3000');
});
