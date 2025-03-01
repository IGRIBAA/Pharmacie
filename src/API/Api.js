const API_URL = "https://apipharmacie.pecatte.fr/api/1/medicaments";
// Remplace {idpharmacie} par ton ID personnel

// 📌 Récupérer la liste des médicaments (avec option de recherche)
export function getMedicaments(callback, search = "") {
  let url = API_URL;

  if (search.trim()) {
    url += `?search=${encodeURIComponent(search)}`;
  }

  fetch(url)
    .then((response) => response.json())
    .then((data) => callback(data))
    .catch((error) =>
      console.error("Erreur lors de la récupération des médicaments :", error)
    );
}

// 📌 Ajouter un médicament
export function ajouterMedicament(med, callback) {
  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(med),
  })
    .then((response) => response.json())
    .then(() => {
      alert("Médicament ajouté avec succès !");
      callback();
    })
    .catch((error) =>
      console.error("Erreur lors de l'ajout du médicament :", error)
    );
}

// 📌 Supprimer un médicament
export function supprimerMedicament(id, callback) {
  fetch(`${API_URL}/${id}`, { method: "DELETE" })
    .then((response) => response.json())
    .then(() => callback())
    .catch((error) =>
      console.error("Erreur lors de la suppression du médicament :", error)
    );
}

// 📌 Modifier un médicament
export function modifierMedicament(med, callback) {
  fetch(API_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(med),
  })
    .then((response) => response.json())
    .then(() => callback())
    .catch((error) =>
      console.error("Erreur lors de la modification du médicament :", error)
    );
}

// 📌 Modifier la quantité (+1 ou -1)
export function modifierQuantite(id, nouvelleQuantite, callback) {
  fetch(API_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: id, qte: nouvelleQuantite }),
  })
    .then((response) => response.json())
    .then(() => callback())
    .catch((error) =>
      console.error("Erreur lors de la modification de quantité :", error)
    );
}
