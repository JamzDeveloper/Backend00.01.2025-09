


class DB {
  saveData(key, valor) {
    console.log("SaveData", valor);

    localStorage.setItem(key, JSON.stringify(valor));
  }

  getData(key) {
    try {
      const result = JSON.parse(localStorage.getItem(key));
      return result ? result : [];
    } catch (err) {
      return [];
    }
  }
}

class sessionDB {
  saveData(key, valor) {
    console.log("SaveData", valor);

    sessionStorage.setItem(key, JSON.stringify(valor));
  }

  getData(key) {
    try {
      const result = JSON.parse(sessionStorage.getItem(key));
      return result ? result : [];
    } catch (err) {
      return [];
    }
  }
}