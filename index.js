const express = require('express');
const db = require('./mysqlDb');
const items = require('./app/items');
const categories = require('./app/categories');
const places = require('./app/places');
const app = express();
const port = 8000;

app.use(express.json());
app.use(express.static('public'));
app.use('/items', items);

const run = async () => {
    await db.init();

    app.listen(port, () => {
        console.log(`Server started on ${port} port!`);
    });
};

run().catch(e => console.log(e));

