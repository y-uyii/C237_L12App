// Import required modules
const express = require('express');

// Create an Express application
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));

// Declare any necessary variables or in-memory data structures here


// TASK: Define appropriate routes below
// ---------------------------------------------------
let expenses = [
    {
        name: "Bus Fare",
        type: "transport",
        cost: 15,
        date: "2026-01-28"
    },
    {
        name: "Groceries",
        type: "food",
        cost: 50,
        date: "2026-01-29"
    },
    {
        name: "Movie Tickets",
        type: "others",
        cost: 25,
        date: "2026-01-30"
    },
    {
        name: "Taxi Fare",
        type: "transport",
        cost: 20,
        date: "2026-02-01"
    },
    {
        name: "Dinner",
        type: "food",
        cost: 30,
        date: "2026-02-02"
    }
];

//Define a route to render the index page
app.get('/', (req, res) => {

    let summary = {};

    for (let item of expenses) {

        let monthName = new Date(item.date).toLocaleString('default', {
            month: 'long'
        });

        if (!summary[monthName]) {
            summary[monthName] = {};
        }

        summary[monthName][item.type] =
            (summary[monthName][item.type] || 0) + item.cost;
    }

    res.render('index', { summary });
});

app.get('/add', (req, res) => {
    res.render('add');
});


app.post('/add', (req, res) => {

    const { name, type, cost, date } = req.body;

    expenses.push({
        name,
        type,
        cost: parseFloat(cost),
        date
    });

    res.redirect('/history');
});

app.get('/history', (req, res) => {

    let type = req.query.type;
    let newlist = expenses;

    if (type && type !== "All") {
        newlist = expenses.filter(expense =>
            expense.type.toLowerCase() === type.toLowerCase()
        );
    }

    res.render('history', { expenses: newlist });
});

app.get('/delete/:index', (req, res) => {

    let index = parseInt(req.params.index);

    // reverse copy (same as frontend)
    let reversed = expenses.slice().reverse();

    // get actual item to delete
    let itemToDelete = reversed[index];

    // remove from original array
    expenses = expenses.filter(e => e !== itemToDelete);

    res.redirect('/history');
});
// ---------------------------------------------------

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});