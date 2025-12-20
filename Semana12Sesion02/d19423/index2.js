console.log("inicio de la aplicacion")

function calculadora(num1, num2, mycallback){
    setTimeout(()=>{
        mycallback( num1 + num2);
    },5000)
}

function mycallback(result){
    document.getElementById("demo1").innerText = result;
    document.getElementById("demo2").innerText = "Listo!!!"
}

calculadora(44,55,mycallback);

let miPromesa = new Promise((resolve, reject)=>{
    try {
        setTimeout(()=>{
            resolve("Promesa Resuelta")
        }, 3000);
        //throw new Error("Hubo un error")
    } catch (error) {
        reject(error)
    }
});

miPromesa.then(data=>{
    console.log(data);
    document.getElementById("demo2").innerText = data;
}).catch(error=>{
    console.error(error)
})

async function miPromesaAsync() {
    let promesa3 = new Promise((resolve,reject)=>{
        let req = new XMLHttpRequest();
        req.open("GET", "https://jsonplaceholder.typicode.com/posts",true);
        req.onload = ()=>{
            if(req.status === 200){
                setTimeout(()=>{
                    resolve(req.response);
                },7000)
            }
            else{
                reject("Error en la respuesta")
            }
        }
        req.send();
    });
    document.getElementById("demo3").innerText = "Cargando....";
    let resultado = await promesa3;
    document.getElementById("demo3").innerText = resultado;
    return resultado;
}

miPromesaAsync();




console.log("Fin de la aplicacion")