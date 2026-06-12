import './style.css';

let produits = [];
let produitsFiltres = [];

export function chargerProduits() {
  return fetch('/liste_produits_quotidien.json')
    .then(response => response.json())
    .then(data => {
      produits = data;
      produitsFiltres = [...data];
      afficherProduits(produitsFiltres);
      return data;
    });
}

export function afficherProduits(liste) {
  const ul = document.getElementById('liste-produits');
  const compteur = document.getElementById('compteur-produits');
  if (!ul) return;

  ul.innerHTML = '';
  if (compteur) compteur.textContent = liste.length;

  liste.forEach((produit, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <h2 class="card-title">${produit.nom}</h2>
      <span class="card-info">Stock : ${produit.quantite_stock}</span>
      <span class="card-price">${produit.prix_unitaire.toFixed(2)} €</span>
      <button class="btn btn-primary" data-index="${index}" data-nom="${produit.nom}" data-prix="${produit.prix_unitaire}">Ajouter à la liste</button>
    `;
    ul.appendChild(li);
  });
}

export function rechercherProduits(motCle, listeProduits) {
  const terme = motCle.toLowerCase().trim();
  if (!terme) return listeProduits;
  return listeProduits.filter(p => p.nom.toLowerCase().includes(terme));
}

export function trierProduits(critere, listeProduits) {
  const copie = [...listeProduits];
  if (critere === 'nom') {
    copie.sort((a, b) => a.nom.localeCompare(b.nom));
  } else if (critere === 'prix') {
    copie.sort((a, b) => a.prix_unitaire - b.prix_unitaire);
  }
  return copie;
}

export function ajouterAuPanier(nom, prix, quantite = 1) {
  const liste = JSON.parse(localStorage.getItem('listeCourse') || '[]');
  const existant = liste.find(item => item.nom === nom);

  if (existant) {
    existant.quantite += quantite;
  } else {
    liste.push({ nom, prix, quantite });
  }

  localStorage.setItem('listeCourse', JSON.stringify(liste));
  return liste;
}

function appliquerFiltres() {
  const recherche = document.getElementById('recherche');
  const tri = document.getElementById('tri');

  let resultat = rechercherProduits(recherche ? recherche.value : '', produits);
  resultat = trierProduits(tri ? tri.value : '', resultat);

  produitsFiltres = resultat;
  afficherProduits(produitsFiltres);
}

export function ajouterEcouteurs() {
  const recherche = document.getElementById('recherche');
  const tri = document.getElementById('tri');
  const resetBtn = document.getElementById('reset-filtres');
  const listeProduits = document.getElementById('liste-produits');

  if (recherche) {
    recherche.addEventListener('input', appliquerFiltres);
  }

  if (tri) {
    tri.addEventListener('change', appliquerFiltres);
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (recherche) recherche.value = '';
      if (tri) tri.value = '';
      produitsFiltres = [...produits];
      afficherProduits(produitsFiltres);
    });
  }

  if (listeProduits) {
    listeProduits.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      const nom = btn.dataset.nom;
      const prix = parseFloat(btn.dataset.prix);
      ajouterAuPanier(nom, prix);

      btn.textContent = 'Ajouté !';
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-secondary');
      setTimeout(() => {
        btn.textContent = 'Ajouter à la liste';
        btn.classList.remove('btn-secondary');
        btn.classList.add('btn-primary');
      }, 1000);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  chargerProduits();
  ajouterEcouteurs();
});
