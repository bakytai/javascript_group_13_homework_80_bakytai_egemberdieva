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

module.exports = router;

