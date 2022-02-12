const express = require('express');
const db = require('../mysqlDb');
const router = express.Router();

router.get('/', async ( req, res,next) => {
    try {
        let query = 'SELECT * FROM categories';

        let [categories] = await db.getConnection().execute(query);
        let arr = [];
        categories.forEach(item => {
            arr.push({id: item.id,name: item.name});
            return arr;
        });

        return  res.send(arr);
    } catch (e) {
        next(e)
    }
});

router.get('/:id', async (req, res,next) => {
    try {
        const [categories] = await db.getConnection().execute('SELECT * FROM categories WHERE id = ?', [req.params.id]);

        const category = categories[0];
        if (!category) {
            return  res.status(404).send({message: 'Not found'});
        }
        return  res.send(category);
    } catch (e) {
        next(e);
    }
});

router.post('/', async (req, res,next) => {
    try {
        if (!req.body.name) {
            return res.status(400).send({message: 'please write category name'});
        } else {
            const category = {
                name: req.body.name,
                description: req.body.description,
            };

            let query = 'INSERT INTO categories (name,description) VALUES (?,?)';

            const [results] = await db.getConnection().execute(query, [
                category.name,
                category.description,
            ]);

            const id = results.insertId;

            return  res.send({message: 'Created new category', id});
        }

    } catch (e) {
        next(e);
    }
});

router.delete('/:id', async (req, res,next) => {
    try {
        const categories = await db.getConnection().execute('DELETE FROM categories WHERE id = ?', [req.params.id]);

        return  res.send({message: 'deleted this category'});
    } catch (e) {
        next(e);
        return res.send({message: 'this category has foreign key'})
    }
});

module.exports = router;

