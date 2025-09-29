// Global DOM References (assuming they exist in the HTML)
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const categoryFilter = document.getElementById('categoryFilter');
const exportButton = document.getElementById('exportBtn');
const addQuoteFormContainer = document.getElementById('addQuoteFormContainer'); // New container

// --- 1. Data and Persistence ---
let quotes = [
    { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
    { text: "Your time is limited, so don’t waste it living someone else’s life.", category: "Inspiration" },
    { text: "Everything you’ve ever wanted is on the other side of fear.", category: "Inspiration" },
];

// Load quotes from localStorage if exists
if (localStorage.getItem("quotes")) {
    try {
        quotes = JSON.parse(localStorage.getItem("quotes"));
    } catch (e) {
        console.error("Error parsing quotes from Local Storage:", e);
        // Fallback to default quotes if parsing fails
    }
}

function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// --- 2. Filter & Category Functions ---

/**
 * Dynamically populates the dropdown with unique categories from the quotes array.
 * Also restores the last selected filter from Local Storage.
 */
function populateCategories() {
    // 1. Get unique categories using a Set
    const uniqueCategories = new Set(quotes.map(quote => quote.category).filter(c => c)); // Filter out empty strings

    // 2. Clear existing options
    categoryFilter.innerHTML = '';

    // 3. Add the "All Categories" option (Value = empty string is standard for 'select all')
    const allOption = document.createElement('option');
    allOption.textContent = 'All Categories';
    allOption.value = '';
    categoryFilter.appendChild(allOption);

    // 4. Add unique categories
    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.textContent = category;
        option.value = category;
        categoryFilter.appendChild(option);
    });

    // 5. Restore the last selected filter
    restoreLastFilter();
}

/**
 * Reads the selected category, filters the quotes array, and displays a random quote
 * from the filtered set. Saves the selection to Local Storage.
 */
function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    let quotesToDisplay = [];

    if (selectedCategory === '') {
        // Show all quotes if 'All Categories' is selected
        quotesToDisplay = quotes;
    } else {
        // Use Array.prototype.filter() for robust filtering
        quotesToDisplay = quotes.filter(quote => quote.category === selectedCategory);
    }

    // Save the selection for persistence
    localStorage.setItem('lastCategoryFilter', selectedCategory);

    // Display a random quote from the filtered set
    showRandomQuoteFromSet(quotesToDisplay);
}

/**
 * Retrieves the last filter value from Local Storage and applies it.
 */
function restoreLastFilter() {
    const lastFilter = localStorage.getItem('lastCategoryFilter');

    if (lastFilter && categoryFilter) {
        categoryFilter.value = lastFilter;
        // Apply the filter immediately upon restoration
        filterQuotes();
    } else {
        // If no filter is saved, show a random quote from the whole array
        showRandomQuoteFromSet(quotes);
    }
}

// --- 3. Display Functions ---

/**
 * Displays one random quote from a specified array (filtered or main array).
 * @param {Array<Object>} quoteSet - The array of quotes to choose from.
 */
function showRandomQuoteFromSet(quoteSet) {
    if (quoteSet.length === 0) {
        if (quoteDisplay) {
            quoteDisplay.innerHTML = `<blockquote>No quotes found for this category.</blockquote>`;
        }
        return;
    }

    const randomIndex = Math.floor(Math.random() * quoteSet.length);
    const quote = quoteSet[randomIndex];

    if (quoteDisplay) {
        quoteDisplay.innerHTML = `<blockquote>${quote.text}</blockquote>
        <p><em>Category: ${quote.category}</em></p>`;
    } else {
        console.error("Element with ID 'quoteDisplay' not found.");
    }
}

// --- 4. CRUD and I/O Functions (Refined) ---

function createAddQuoteForm() {
    // ... (All the form element creation code remains the same) ...
    const form = document.createElement('form');
    form.id = 'addQuoteForm'; // Give the form an ID

    // Input for Quote Text
    const textLabel = document.createElement("label");
    textLabel.textContent = 'Quote: ';
    const textInput = document.createElement("input");
    textInput.type = 'text';
    textInput.required = true;

    // Input for Category
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
    form.appendChild(document.createElement('br'));
    form.appendChild(categoryLabel);
    form.appendChild(categoryInput);
    form.appendChild(document.createElement('br'));
    form.appendChild(submitBtn);

    // Append form to the new dedicated container (addQuoteFormContainer)
    if (addQuoteFormContainer) {
        addQuoteFormContainer.appendChild(form);
    } else {
        document.body.appendChild(form);
    }

    // Form Submission Logic (UPDATED)
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const text = textInput.value.trim();
        const category = categoryInput.value.trim();

        if (text && category) {
            const newQuote = { text, category };
            quotes.push(newQuote);
            saveQuotes(); // 1. Save new quote data to Local Storage

            // 2. IMPORTANT: Update the categories dropdown 
            //    This ensures the new category appears immediately if one was added.
            populateCategories();

            // 3. Display the newly added quote
            showRandomQuoteFromSet([newQuote]);

            alert("Quote added successfully! Categories updated.");
            form.reset();
        }
    });
}

/**
 * Function to trigger the download of the JSON data.
 */
function exportJsonToFile(jsonData, filename = 'quotes_backup.json') {
    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Imports quotes from a JSON file and adds them to the main quotes array.
 */
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
        try {
            // Assuming the JSON file is an array of quote objects [ {...}, {...} ]
            const importedQuotes = JSON.parse(event.target.result);

            if (Array.isArray(importedQuotes)) {
                // Use spread operator to add all imported quotes individually
                quotes.push(...importedQuotes);
                saveQuotes();
                populateCategories(); // Update the dropdown after import
                alert(`Successfully imported ${importedQuotes.length} quotes!`);
            } else {
                alert('Import failed: File content is not a valid JSON array of quotes.');
            }
        } catch (e) {
            alert('Import failed: Invalid JSON file format.');
            console.error(e);
        }
    };
    // Check if a file was selected before attempting to read
    if (event.target.files.length > 0) {
        fileReader.readAsText(event.target.files[0]);
    }
}

// --- 5. Event Listeners and Initial Setup ---

// Check for the newQuote button and link it to the filter function
if (newQuoteBtn) {
    // Clicking 'New Quote' should just re-run the filter to get a new random quote from the CURRENTLY selected category
    newQuoteBtn.addEventListener("click", filterQuotes);
}

// Event listener for the filter change
if (categoryFilter) {
    categoryFilter.addEventListener('change', filterQuotes);
}

// Event listener for the export button
if (exportButton) {
    exportButton.addEventListener('click', () => {
        // The export button should export the WHOLE quotes array
        exportJsonToFile(quotes, 'quotes_backup.json');
    });
}

// Initial setup execution
createAddQuoteForm();
populateCategories(); // This calls restoreLastFilter() internally