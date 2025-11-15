// Clase encargada de manejar la DB (localStorage en este caso)
class DB {
    saveData(key, valor) {
        //console.log("SaveData", valor);
        localStorage.setItem(key, JSON.stringify(valor));
    }

    getData(key) {
        try {
            const result = JSON.parse(localStorage.getItem(key));
            return result? result : [] // Si result es distinto de null/false/undefined, devolverá result, si no, devolverá un array vacío.
            // Es lo mismo que: if (result) {return result;} else {return [];}
        } catch (err) {
            return [];
        }
    }
}