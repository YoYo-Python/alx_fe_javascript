let quotes = [
    { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
    { text: "Your time is limited, so don’t waste it living someone else’s life.", category: "Inspiration" },
    { text: "Everything you’ve ever wanted is on the other side of fear.", category: "Inspiration" },
    { text: "Happiness is not something ready made. It comes from your own actions.", category: "Inspiration" },
    { text: "Believe you can and you're halfway there.", category: "Inspiration" },
    { text: "Do not wait to strike till the iron is hot, but make it hot by striking.", category: "Motivation" },
    { text: "It always seems impossible until it’s done.", category: "Motivation" },
    { text: "Act as if what you do makes a difference. It does.", category: "Motivation" },
    { text: "Hard work beats talent when talent doesn’t work hard.", category: "Motivation" },
    { text: "Don’t watch the clock; do what it does. Keep going.", category: "Motivation" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Life" },
    { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
    { text: "The purpose of our lives is to be happy.", category: "Life" },
    { text: "Difficulties in life don’t come to destroy you, but to help you realize your hidden potential.", category: "Life" },
    { text: "Life is really simple, but we insist on making it complicated.", category: "Life" },
    { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Success" },
    { text: "Opportunities don’t happen. You create them.", category: "Success" },
    { text: "Success usually comes to those who are too busy to be looking for it.", category: "Success" },
    { text: "The road to success and the road to failure are almost exactly the same.", category: "Success" },
    { text: "Don’t be afraid to give up the good to go for the great.", category: "Success" },
    { text: "Knowing yourself is the beginning of all wisdom.", category: "Wisdom" },
    { text: "The only true wisdom is in knowing you know nothing.", category: "Wisdom" },
    { text: "Educating the mind without educating the heart is no education at all.", category: "Wisdom" },
    { text: "Wise men speak because they have something to say; fools because they have to say something.", category: "Wisdom" },
    { text: "Turn your wounds into wisdom.", category: "Wisdom" },
    { text: "Fall seven times and stand up eight.", category: "Perseverance" },
    { text: "Great works are performed not by strength but by perseverance.", category: "Perseverance" },
    { text: "A river cuts through rock not because of its power, but because of its persistence.", category: "Perseverance" },
    { text: "Courage doesn’t always roar. Sometimes courage is the quiet voice at the end of the day saying, ‘I will try again tomorrow.’", category: "Perseverance" },
    { text: "Perseverance is not a long race; it is many short races one after the other.", category: "Perseverance" },
    { text: "I am so clever that sometimes I don’t understand a single word of what I am saying.", category: "Humor" },
    { text: "People say nothing is impossible, but I do nothing every day.", category: "Humor" },
    { text: "Behind every great man is a woman rolling her eyes.", category: "Humor" },
    { text: "If you think you are too small to make a difference, try sleeping with a mosquito.", category: "Humor" },
    { text: "I can resist everything except temptation.", category: "Humor" }
];

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');

function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    quoteDisplay.innerHTML = `<blockquote>${quote.text}</blockquote>
    <p><em>Category: ${quote.category}</em></p>`;
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
        const newQuote = {
            text: textInput.value.trim(),
            category: categoryInput.value.trim()
        };

        quotes.push(newQuote);

        textInput.value = '';
        categoryInput.value = '';

        quoteDisplay.innerHTML = `<blockquote>${newQuote.text}</blockquote>
        <p><em>Category: ${newQuote.category}</em></p>`;
    });
}

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);

// Initial setup
showRandomQuote();
createAddQuoteForm();
