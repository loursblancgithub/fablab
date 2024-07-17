//fichier avec toutes les fonctions qui peuvent servir un peu partout

export default function removeAllChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}