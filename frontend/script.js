// Load the processed markets data
fetch("processed_markets.json")
  .then((response) => response.json())
  .then((data) => renderEvents(data));

// Function to render events and markets
function renderEvents(events) {
  const app = document.getElementById("app");

  events.forEach((event) => {
    // Create the event card
    const eventCard = document.createElement("div");
    eventCard.className = "event-card";

    // Event details
    const eventTitle = document.createElement("div");
    eventTitle.className = "event-title";
    eventTitle.textContent = `${event.event_name} (${event.status})`;

    const eventTime = document.createElement("div");
    eventTime.textContent = `Start Time: ${new Date(
      event.start_time
    ).toLocaleString()}`;

    eventCard.appendChild(eventTitle);
    eventCard.appendChild(eventTime);

    // Add markets
    event.markets.forEach((market) => {
      const marketSection = document.createElement("div");
      marketSection.className = "market-section";

      const marketTitle = document.createElement("div");
      marketTitle.className = "market-title";
      marketTitle.textContent = market.market_name;

      marketSection.appendChild(marketTitle);

      // Add selections
      market.selections.forEach((selection) => {
        const button = document.createElement("button");
        button.className = "bet-button";
        button.textContent = `${selection.name} (${selection.odds})`;
        marketSection.appendChild(button);
      });

      eventCard.appendChild(marketSection);
    });

    // Append event card to the app container
    app.appendChild(eventCard);
  });
}
