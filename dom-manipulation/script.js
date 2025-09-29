let quotes = [
    { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
    { text: "Your time is limited, so don’t waste it living someone else’s life.", category: "Inspiration" },
    { text: "Everything you’ve ever wanted is on the other side of fear.", category: "Inspiration" },
    
];

// Load from localStorage if exists
if (localStorage.getItem("quotes")) {
    quotes = JSON.parse(localStorage.getItem("quotes"));
}

function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// NOTE: quoteDisplay and newQuoteBtn will cause an error if the elements 
// with these IDs don't exist in your HTML.
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');

// REMOVED BROKEN DOWNLOAD BUTTON CREATION HERE

function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    // Added a check to prevent errors if quoteDisplay isn't found
    if (quoteDisplay) {
        quoteDisplay.innerHTML = `<blockquote>${quote.text}</blockquote>
        <p><em>Category: ${quote.category}</em></p>`;
    } else {
        console.error("Element with ID 'quoteDisplay' not found.");
    }
}

function createAddQuoteForm() {
    const form = document.createElement('form');

    const textLabel = document.createElement("label");
    textLabel.textContent = 'Quote: ';
    const textInput = document.createElement("input");
    textInput.type = 'text';
    textInput.required = true;

    const categoryLabel = document.createElement("label");
    categoryLabel.textContent = 'Category: ';
    const categoryInput = document.createElement("input");
    categoryInput.type = 'text';
    categoryInput.required = true;

    const submitBtn = document.createElement("button");
    submitBtn.type = 'submit';
    submitBtn.textContent = 'Add Quote';

    form.appendChild(textLabel);
    form.appendChild(textInput);
    form.appendChild(categoryLabel);
    form.appendChild(categoryInput);
    form.appendChild(submitBtn);

    document.body.appendChild(form);

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const text = textInput.value.trim();
        const category = categoryInput.value.trim();

        if (text && category) {
            const newQuote = { text, category };
            quotes.push(newQuote);
            saveQuotes(); // Save to localStorage

            if (quoteDisplay) {
                quoteDisplay.innerHTML = `<blockquote>${newQuote.text}</blockquote>
                <p><em>Category: ${newQuote.category}</em></p>`;
            }

            alert("Quote added successfully!");
            form.reset();
        }
    });
}

// Function to trigger the download (this part is correct)
function exportJsonToFile(jsonData, filename = 'data.json') {
    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click(); // This is what triggers the download

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}
// The correct and consolidated download button creation and listener
const downloadButton = document.createElement('button');
downloadButton.id = 'export-json-button';
downloadButton.textContent = 'DOWNLOAD QUOTES JSON'

document.body.appendChild(downloadButton);

downloadButton.addEventListener('click', () => {
    exportJsonToFile(quotes, 'quotes_backup.json');
});


// Event listeners
if (newQuoteBtn) {
    newQuoteBtn.addEventListener("click", showRandomQuote);
} else {
    console.error("Element with ID 'newQuote' not found. Random quote button won't work.");
}

// Initial setup
showRandomQuote();
createAddQuoteForm();