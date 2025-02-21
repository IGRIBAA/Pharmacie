export function getMedicaments(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "https://apipharmacie.pecatte.fr/pharmacies/{idpharmacie}/medicaments",
    true
  );
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(JSON.parse(xhr.responseText));
      } else {
        console.error(
          "Erreur lors de la récupération des médicaments",
          xhr.statusText
        );
      }
    }
  };
  xhr.send();
}
