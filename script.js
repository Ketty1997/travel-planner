//elementi html
const main = document.querySelector('main');
const destinationInput = document.querySelector('#destination');
const typeSelectionButtons = document.querySelectorAll('.type-selection button');
const decrementButton = document.querySelector('#decrement');
const incrementButton = document.querySelector('#increment');
const daysCounterDiv = document.querySelector('.days-counter');
const generateButton = document.querySelector('#generate');
const itineraryDiv = document.querySelector('.itinerary');
const newTripButton = document.querySelector('#new-trip');

//eventi

//comportamento selezione tipo di viaggio
for (const button of typeSelectionButtons) {
    button.addEventListener('click', function () {
        for (const button of typeSelectionButtons) button.className = '';
        button.className = 'selected';
    })
}
//comportamento numero di giorni
decrementButton.addEventListener('click', function () {
    //converto testo -->numero
    const value = Number(daysCounterDiv.innerText);
    if (value > 1) daysCounterDiv.innerText = value - 1;
});

incrementButton.addEventListener('click', function () {
    const value = Number(daysCounterDiv.innerText);
    if (value < 7) daysCounterDiv.innerText = value + 1;
});

//generazione travel plan

generateButton.addEventListener('click', async function () {
    //estrazione parametri viaggio
    const destination = destinationInput.value;
    const type = document.querySelector('.type-selection .selected .type-name').innerText;
    const days = Number(daysCounterDiv.innerText);

    console.log('parametri', { destination, type, days });

    //verifica destinazine
    if (destination === '') {
        alert('Fornisci una destinazione')
        return;
    }
    //navigazione loading screen
    main.className = 'loading';
    //generazione travel plan
    const plan = await getTravelPlan(destination, type, days);

    const itinerary = JSON.parse(plan.choises[0].message.content);

    //presentazione itinerario
    displayItinerary(itinerary);
    //navigazione result screen
    main.className = 'result';
});

newTripButton.addEventListener('click', function () {
    location.reload();
})

//dichiarazioni funzioni
async function getTravelPlan(destination, type, days) {
    const url = 'https://api.openai.com/v1/chat/completions';
    const key = '';

    prompt = `Crea un itineratio di ${days} giorni per una vacanza di tipo ${type} in ${destination}.Ogni giorno deve avere tre attivita uniche che si possono fare a ${destination}. Non dare indicazioni generiche, ma indica i nomi dei posti in maniera corretta, anche per ristoranti e altre attivita.

Le tue risposte sono solo in formato JSON come questo esempio:

[
    {
    "number":"Giorno 1",
    "activities": [
        {"title":"Musei vaticani", "text":"esplora i musei vaticani e la cappella sistina"},
        {"title":"piazza san pietro", "text":"visita la basilica di san pietro e la piazza"},
        {"title":"colosseo", "text":"scropri la storia del colosseo"}
    
        ]
    }
]

Assicurati  che le chiavi del JSON siano sempre tra virgolette
`;


    const res = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
        },
        method: 'POST',
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            temperature: 0.7,
            messages: [{
                role: 'user',
                content: prompt
            }]
        })
    });
    const data = await res.json();
    return data;
}

function displayItinerary(itinerary) {
    itineraryDiv.innerHTML = '';

    for (const day of itinerary) displayDayCard(day);
}

function displayDayCard(day) {
    //varibile di appoggio
    let activities = '';

    //accumulo manipolazione sulla variabile
    for (const activity of day.activities) {
        activities += `<div class="activity"><h3>${activity.title}</h3><p>${activity.text}</p></div>`;
    }

    itineraryDiv.innerHTML += `<div class="day-card"><h2>${day.number}</h2> ${activities}</div>`;
}


