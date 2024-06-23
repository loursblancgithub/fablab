// Create WebSocket connection.
const socket = new WebSocket("ws://localhost:8080");

// Connection opened
socket.addEventListener("open", (event) => {
  socket.send("Hello Server!");
});

// Listen for messages
socket.addEventListener("message", (event) => {
  console.log("Message from server ", event.data);
});

document.addEventListener('DOMContentLoaded', function () { // Est activé quand le script est appelé
  document.getElementById('bt').addEventListener('click', function () { // Est activé quand le bouton #bt est cliqué
      console.log('Bouton cliqué'); // me dit si le bouton a été cliqué

      //Récupère le contenu des inputs
      let input1 = document.getElementById('input1').value;
      let input2 = document.getElementById('input2').value;
      let input3 = document.getElementById('input3').value;

      let result = document.getElementById('result');
      result.innerHTML = ''; //Vide le div dédié

      //Crée le premier texte avec le contenu du premier input
      let result1 = document.createElement('div');
      result1.className = 'result1';
      let p1 = document.createElement('p');
      p1.innerText = input1;
      result1.style.color = 'red';
      result1.style.padding = '10px';
      result1.append(p1);

      //Crée le deuxième texte avec le contenu du deuxième input
      let result2 = document.createElement('div');
      result2.className = 'result2';
      let p2 = document.createElement('p');
      p2.innerText = input2;
      result2.style.color = 'green';
      result2.style.padding = '10px';
      result2.append(p2);

      //Crée le troisième texte avec le contenu du troisième input
      let result3 = document.createElement('div');
      result3.className = 'result3';
      let p3 = document.createElement('p');
      p3.innerText = input3;
      result3.style.color = 'blue';
      result3.style.padding = '10px';
      result3.append(p3);

      //Ajoute le tout au div dédié
      result.appendChild(result1);
      result.appendChild(result2);
      result.appendChild(result3);


      //Envoie les données au serveur
      let data = {
          input1: input1,
          input2: input2,
          input3: input3
      }
      socket.send(JSON.stringify(data));

  });
});