const API_URL = "https://apipharmacie.pecatte.fr/api/1/medicaments";
// Remplace {idpharmacie} par ton ID personnel

// 📌 Récupérer les médicaments
export function getMedicaments(callback, search = "") {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `${API_URL}?search=${search}`, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(JSON.parse(xhr.responseText));
      } else {
        console.error("Erreur API :", xhr.statusText);
      }
    }
  };
  xhr.send();
}

// 📌 Ajouter un médicament
export function ajouterMedicament(med, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", API_URL, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(JSON.parse(xhr.responseText));
      } else {
        console.error("Erreur d'ajout :", xhr.statusText);
      }
    }
  };
  xhr.send(JSON.stringify(med));
}

// 📌 Supprimer un médicament
export function supprimerMedicament(id, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("DELETE", `${API_URL}/${id}`, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(JSON.parse(xhr.responseText));
      } else {
        console.error("Erreur de suppression :", xhr.statusText);
      }
    }
  };
  xhr.send();
}

// 📌 Modifier un médicament
export function modifierMedicament(med, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("PUT", API_URL, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(JSON.parse(xhr.responseText));
      } else {
        console.error("Erreur de modification :", xhr.statusText);
      }
    }
  };
  xhr.send(JSON.stringify(med));
}

// 📌 Modifier la quantité d’un médicament (+1 ou -1)
export function modifierQuantite(id, valeur, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("PATCH", `${API_URL}/${id}/qte/${valeur}`, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(JSON.parse(xhr.responseText));
      } else {
        console.error("Erreur de modification de quantité :", xhr.statusText);
      }
    }
  };
  xhr.send();
}
