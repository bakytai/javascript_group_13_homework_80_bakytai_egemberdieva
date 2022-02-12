const express = require('express');
const db = require('../mysqlDb');
const router = express.Router();

router.get('/', async ( req, res,next) => {
    try {
        let query = 'SELECT * FROM places';

        let [places] = await db.getConnection().execute(query);
        let arr = [];
        places.forEach(item => {
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
        const [places] = await db.getConnection().execute('SELECT * FROM places WHERE id = ?', [req.params.id]);

        const place = places[0];
        if (!place) {
            return  res.status(404).send({message: 'Not found'});
        }
        return  res.send(place);
    } catch (e) {
        next(e);
    }
});

router.post('/', async (req, res,next) => {
    try {
        if (!req.body.name) {
            return res.status(400).send({message: 'please write place name'});
        } else {
            const place = {
                name: req.body.name,
                description: req.body.description,
            };

            let query = 'INSERT INTO places (name,description) VALUES (?,?)';

            const [results] = await db.getConnection().execute(query, [
                place.name,
                place.description,
            ]);

            const id = results.insertId;

            return  res.send({message: 'Created new place', id});
        }

    } catch (e) {
        next(e);
    }
});

router.delete('/:id', async (req, res,next) => {
    try {
        await db.getConnection().execute('DELETE FROM places WHERE id = ?', [req.params.id]);

        return  res.send({message: 'deleted this place'});
    } catch (e) {
        next(e);
        return res.send({message: 'this place has foreign key'})
    }
});

module.exports = router;