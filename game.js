const get = (url) => {
    const request = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
        request.onload = function () {
            if (request.readyState !== 4) return;

            // Check status code
            if (request.status >= 200 && request.status < 300) {
                resolve(JSON.parse(request.response));
            } else {
                reject({
                    status: request.status,
                    request: request,
                });
            }
        };
        request.onerror = function handleError() {
            request = null;
            reject("NETWORK ERROR!");
        };
        request.open('GET', url); // Add timestamp to bust cache
        request.send();
    });
};


// Initial deck draw
deck = get("https://deckofcardsapi.com/api/deck/new/draw/?count=2");

deck
  .then(resp => {
    console.log("Initial Draw:", resp.cards);
    console.log("Deck ID:", resp.deck_id);
    console.log("Remaining Cards:", resp.remaining);

    // Ensure the button is properly set up
    const btn = document.getElementById("btn");
    if (btn) {
      btn.addEventListener('click', function(evt) {
        // Draw 2 more cards when the button is clicked
        get(`https://deckofcardsapi.com/api/deck/${resp.deck_id}/draw/?count=1`)
          .then(newResp => {
            console.log("Cards Drawn on Button Click:", newResp.cards);
            console.log("Remaining Cards:", newResp.remaining);

            // Append each new card image to the container
            const container = document.getElementById("card-container");
            if (!container) {
              // Create a container if it doesn't exist
              const newContainer = document.createElement("div");
              newContainer.id = "card-container";
              document.body.appendChild(newContainer);
            }
            
            // Append each card image to the container
            for (const card of newResp.cards) {
                document.getElementById("card-container").innerHTML += 
                  `<img src="${card.image}" alt="${card.value} of ${card.suit}" style="transform: rotate(${Math.floor(Math.random() * 100)}deg);" />`;
              }
              
          })
          .catch(error => {
            console.error("Error drawing cards:", error); // Handle errors during card draw
          });
      });
    } else {
      console.warn("Button with id 'btn' not found.");
    }
  })
  .catch(error => {
    console.error("Error:", error); // Handle any errors that occur during initial draw
  });