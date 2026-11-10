/*
  Lista tuturor materialelor de pe site.
  Pentru un material nou: copiați materiale/_sablon.html, apoi adăugați aici un rând.

  id        numele fișierului, fără .html (trebuie să fie același cu data-id din pagină)
  titlu     titlul afișat
  clasa     5 ... 12
  capitol   un cuvânt sau două, de exemplu "Tablouri", "STL", "Grafuri"
  tip       "Predare" sau "Studiu individual"
  descriere o propoziție scurtă
  Ordinea din listă este ordinea lecțiilor în cadrul clasei.
*/
window.SITE = {
  nume: 'Materiale de informatică',
  descriere: 'Lecții, probleme rezolvate și teme pentru pregătirea de olimpiadă.',
  autor: 'CEX Prahova'
};

window.CLASE = {
  5: 'Clasa a V-a', 6: 'Clasa a VI-a', 7: 'Clasa a VII-a', 8: 'Clasa a VIII-a',
  9: 'Clasa a IX-a', 10: 'Clasa a X-a', 11: 'Clasa a XI-a', 12: 'Clasa a XII-a'
};

window.MATERIALE = [
  {
    id: 'two-pointers',
    titlu: 'Tehnica Two Pointers',
    clasa: 7,
    capitol: 'Tablouri',
    tip: 'Predare',
    descriere: 'Doi indici care parcurg vectorul: palindromuri, perechi de sumă dată, fereastra glisantă.'
  },
  {
    id: 'vectori-stl',
    titlu: 'Vectori STL',
    clasa: 7,
    capitol: 'STL',
    tip: 'Studiu individual',
    descriere: 'Containerul vector, operațiile lui și parcurgerea cu indici și cu iteratori.'
  },
  {
    id: 'kadane',
    titlu: 'Algoritmul lui Kadane',
    clasa: 7,
    capitol: 'Tablouri',
    tip: 'Predare',
    descriere: 'Secvența de sumă maximă, variantele ei și probleme celebre care se reduc la ea.'
  },
  {
    id: 'element-majoritar',
    titlu: 'Elementul majoritar',
    clasa: 7,
    capitol: 'Tablouri',
    tip: 'Predare',
    descriere: 'Votul Boyer-Moore: de ce funcționează, variante și probleme de discuție.'
  }
];
