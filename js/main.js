/**
 * @file Script contenant les fonctions de base
 * @author Jonathan Martel (jmartel@cmaisonneuve.qc.ca)
 * @version 0.1
 * @update 2019-01-21
 * @license Creative Commons BY-NC 3.0 (Licence Creative Commons Attribution - Pas d’utilisation commerciale 3.0 non transposé)
 * @license http://creativecommons.org/licenses/by-nc/3.0/deed.fr
 *
 */
const BaseURL = window.location.origin + window.location.pathname;

//const BaseURL = "http://127.0.0.1/vino/";
console.log(BaseURL);
window.addEventListener('load', function() {
    const BaseURL = window.location.origin + window.location.pathname;
    console.log("load");
    console.log("allo");
    DisplayLogin();
    document.querySelectorAll(".btnBoire").forEach(function(element) {
        console.log(element);

        element.addEventListener("click", function(evt) {
            // Je disabled le btn ajouter le temps de la requête.
            element.disabled = true;
            // Je vais chercher la quantite de cette bouteille.
            let quantite = evt.composedPath();
            console.dir(quantite);
            quantite = quantite[2].children[3].children[1];
            console.dir(quantite);

            quantite = quantite.firstElementChild;
            console.dir(quantite);
            qt = quantite.innerHTML;
            console.log(document.baseURI);
            let id = evt.target.parentElement.dataset.id;
            let requete = new Request(BaseURL + "?requete=boireBouteilleCellier", {
                method: 'POST',
                body: '{"id": ' + id + '}'
            });

            fetch(requete)
                .then(response => {
                    if (response.status === 200) {
                        console.dir(response);
                        return response.json();
                    } else {
                        throw new Error('Erreur');
                    }
                })
                .then(response => {
                    // Si la reponse est Ok changer la quantité dans le cellier sans recharger la page.
                    console.dir(quantite);
                    if (parseInt(qt) == 0) {
                        quantite.innerHTML = parseInt(qt);
                        // Je reéactive le bouton pour un ajout futur.
                        element.disabled = false;

                    } else {
                        quantite.innerHTML = parseInt(qt) - 1;
                        element.disabled = false;
                    }

                    console.debug(response);
                }).catch(error => {
                    console.error(error);
                });
        })

    });
    document.querySelectorAll(".btnModif").forEach(function(element) {
        //console.log(element);
        element.addEventListener("click", function(evt) {
            let id = evt.target.parentElement.dataset.id;
            let url = ("?requete=ModificationFormulaire&Id=" + id);
            window.location.href = url;
        });
    });

    document.querySelectorAll(".btnAjouter").forEach(function(element) {
        console.log(element);
        element.addEventListener("click", function(evt) {
            let id = evt.target.parentElement.dataset.id;
            let requete = new Request(BaseURL + "?requete=ajouterBouteilleCellier", {
                method: 'POST',
                body: '{"id": ' + id + '}'
            });
            console.dir(element);
            element.disabled = true;
            // Je vais chercher la quantite de cette bouteille.
            console.dir(evt.parentElement);
            let quantite = evt.composedPath();
            console.dir(quantite);
            console.dir(quantite);
            quantite = quantite[2].children[3].children[1];
            console.dir(quantite);

            quantite = quantite.firstElementChild;
            qt = quantite.innerHTML;
            fetch(requete)
                .then(response => {
                    if (response.status === 200) {
                        console.log(response.ok);

                        return response.json();
                    } else {
                        throw new Error('Erreur');
                    }
                })
                .then(response => {
                    console.log(response);
                    // Si la reponse est Ok changer la quantité dans le cellier sans recharger la page.

                    console.dir(quantite);
                    quantite.innerHTML = parseInt(qt) + 1;
                    // Je reéactive le bouton pour un ajout futur.
                    element.disabled = false;

                    console.debug(response);
                }).catch(error => {
                    console.error(error);
                });
        })

    });

    let inputNomBouteille = document.querySelector("[name='nom_bouteille']");
    console.log(inputNomBouteille);
    let liste = document.querySelector('.listeAutoComplete');

    if (inputNomBouteille) {
        inputNomBouteille.addEventListener("keyup", function(evt) {
            console.log(evt);
            let nom = inputNomBouteille.value;
            liste.innerHTML = "";
            if (nom) {
                let requete = new Request(BaseURL + "?requete=autocompleteBouteille", {
                    method: 'POST',
                    body: '{"nom": "' + nom + '"}'
                });
                fetch(requete)
                    .then(response => {
                        if (response.status === 200) {
                            return response.json();
                        } else {
                            throw new Error('Erreur');
                        }
                    })
                    .then(response => {
                        console.log(response);


                        response.forEach(function(element) {
                            liste.innerHTML += "<li data-id='" + element.id + "'>" + element.nom + "</li>";
                        })
                    }).catch(error => {
                        console.error(error);
                    });
            }


        });

        let bouteille = {
            nom: document.querySelector(".nom_bouteille"),
            millesime: document.querySelector("[name='millesime']"),
            quantite: document.querySelector("[name='quantite']"),
            date_achat: document.querySelector("[name='date_achat']"),
            prix: document.querySelector("[name='prix']"),
            garde_jusqua: document.querySelector("[name='garde_jusqua']"),
            notes: document.querySelector("[name='notes']"),
        };


        liste.addEventListener("click", function(evt) {
            console.dir(evt.target)
            if (evt.target.tagName == "LI") {
                bouteille.nom.dataset.id = evt.target.dataset.id;
                bouteille.nom.innerHTML = evt.target.innerHTML;

                liste.innerHTML = "";
                inputNomBouteille.value = "";

            }
        });

        let btnAjouter = document.querySelector("[name='ajouterBouteilleCellier']");
        if (btnAjouter) {
            btnAjouter.addEventListener("click", function(evt) {
                var param = {
                    "id_bouteille": bouteille.nom.dataset.id,
                    "date_achat": bouteille.date_achat.value,
                    "garde_jusqua": bouteille.garde_jusqua.value,
                    "notes": bouteille.date_achat.value,
                    "prix": bouteille.prix.value,
                    "quantite": bouteille.quantite.value,
                    "millesime": bouteille.millesime.value,
                };
                let requete = new Request(BaseURL + "?requete=ajouterNouvelleBouteilleCellier", {
                    method: 'POST',
                    body: JSON.stringify(param)
                });
                fetch(requete)
                    .then(response => {
                        if (response.status === 200) {
                            return response.json();
                        } else {
                            throw new Error('Erreur');
                        }
                    })
                    .then(response => {
                        console.log(response);

                    }).catch(error => {
                        console.error(error);
                    });

            });
        }
    }

    //Menu Mobile
    let btnMenuMobile = document.querySelector(".pointsMenu > img");
    let menu = document.querySelector("nav");

    btnMenuMobile.addEventListener("click", function() {

        console.log("menu");
        menu.classList.toggle("active");
    });

    // Description expanding 

    document.querySelectorAll(".voir-plus").forEach(function(element) {
        
        if (element) {
            element.addEventListener("click", function(e) {
                console.log(e.target);
                let divDescription = next(e.target);
                divDescription.classList.toggle("active-flex");
                fadeIn(divDescription);
            });
        }

    })

});

function DisplayLogin() {
    var UserID = trim(document.getElementById('UserID').textContent);
    var monCellier = document.getElementById('monCellier');
    var ajouterBouteilleCellier = document.getElementById('ajouterBouteilleCellier');
    var login = document.getElementById('login');
    var logout = document.getElementById('logout');
    var signup = document.getElementById('signup');
    var myaccount = document.getElementById('myaccount');


/* 
    if (UserID == "NULL") {
        myaccount.style.display = "none";
        logout.style.display = "none";
        monCellier.style.display = "none";
        ajouterBouteilleCellier.style.display = "none";

    } else {
      
        ajouterBouteilleCellier.style.display = "block";
        myaccount.style.display = "block";
        logout.style.display = "block";


        signup.style.display = "none";
        login.style.display = "none";


    } */


}

function trim(str) {　　
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

function fadeIn(el) {
    el.style.opacity = 0;

    var last = +new Date();
    var tick = function() {
        el.style.opacity = +el.style.opacity + (new Date() - last) / 400;
        last = +new Date();

        if (+el.style.opacity < 1) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
        }
    };

    tick();
}

function next(elem) {
    do {
        elem = elem.nextSibling;
    } while (elem && elem.nodeType !== 1);
    return elem;
}