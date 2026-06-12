import './style.css';

export function getListeCourse() {
  return JSON.parse(localStorage.getItem('listeCourse') || '[]');
}

export function sauvegarderListe(liste) {
  localStorage.setItem('listeCourse', JSON.stringify(liste));
}

export function calculerTotal(liste) {
  return liste.reduce((total, item) => total + item.prix * item.quantite, 0);
}

export function supprimerProduit(index) {
  const liste = getListeCourse();
  liste.splice(index, 1);
  sauvegarderListe(liste);
  afficherListe();
}

export function modifierQuantite(index, nouvelleQuantite) {
  const liste = getListeCourse();
  const qte = parseInt(nouvelleQuantite, 10);

  if (qte <= 0) {
    liste.splice(index, 1);
  } else {
    liste[index].quantite = qte;
  }

  sauvegarderListe(liste);
  afficherListe();
}

export function viderListe() {
  localStorage.removeItem('listeCourse');
  afficherListe();
}

export function afficherListe() {
  const tbody = document.getElementById('liste-course-body');
  const totalEl = document.getElementById('total-general');
  if (!tbody) return;

  const liste = getListeCourse();
  tbody.innerHTML = '';

  if (liste.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty-message">Votre liste de course est vide.</td></tr>`;
    if (totalEl) totalEl.innerHTML = '<strong>0.00 €</strong>';
    return;
  }

  liste.forEach((item, index) => {
    const sousTotal = (item.prix * item.quantite).toFixed(2);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.nom}</td>
      <td>${item.prix.toFixed(2)} €</td>
      <td><input type="number" value="${item.quantite}" min="1" data-index="${index}" /></td>
      <td>${sousTotal} €</td>
      <td><button class="btn btn-danger btn-sm" data-delete data-index="${index}">Supprimer</button></td>
    `;
    tbody.appendChild(tr);
  });

  const total = calculerTotal(liste);
  if (totalEl) totalEl.innerHTML = `<strong>${total.toFixed(2)} €</strong>`;
}

export function ajouterEcouteursListe() {
  const tbody = document.getElementById('liste-course-body');
  const viderBtn = document.getElementById('vider-liste');

  if (tbody) {
    tbody.addEventListener('change', (e) => {
      const input = e.target;
      if (input.type === 'number' && input.dataset.index !== undefined) {
        modifierQuantite(parseInt(input.dataset.index, 10), input.value);
      }
    });

    tbody.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-delete]');
      if (btn && btn.dataset.index !== undefined) {
        supprimerProduit(parseInt(btn.dataset.index, 10));
      }
    });
  }

  if (viderBtn) {
    viderBtn.addEventListener('click', () => {
      if (confirm('Voulez-vous vraiment vider la liste ?')) {
        viderListe();
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  afficherListe();
  ajouterEcouteursListe();
});
