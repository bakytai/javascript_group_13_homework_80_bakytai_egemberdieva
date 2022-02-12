const express = require('express');
const multer = require('multer');
const path = require('path');
const config = require('../config');
const { nanoid } = require('nanoid');
const db = require('../mysqlDb');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});

const upload = multer({storage});

router.get('/', async ( req, res,next) => {
    try {
        let query = 'SELECT * FROM items';

        if (req.query.filter === 'image') {
            query += ' WHERE image IS NOT NULL';
        }

        if (req.query.direction === 'desc') {
            query += ' ORDER BY id DESC';
        }

        let [items] = await db.getConnection().execute(query);
        let arr = [];
        items.forEach(item => {
            arr.push({id: item.id,name: item.name, categoryId: item.category_id, placeId: item.place_id});
            return arr;
        });

        return  res.send(arr);
    } catch (e) {
        next(e)
    }

});

router.get('/:id', async (req, res,next) => {
    try {
        const [items] = await db.getConnection().execute('SELECT * FROM items WHERE id = ?', [req.params.id]);

        const item = items[0];
        if (!item) {
            return  res.status(404).send({message: 'Not found'});
        }
        return  res.send(item);
    } catch (e) {
        next(e);
    }
});

router.post('/', upload.single('image'), async (req, res,next) => {
    try {
        if (!req.body.name || !req.body.categoryId || !req.body.placeId) {
            return res.status(400).send({message: 'Wrong item'});
        }

        const item = {
            name: req.body.name,
            categoryId: req.body.categoryId,
            placeId: req.body.placeId,
            description: req.body.description,
            image: null,
        };

        if (req.file) {
            item.image = req.file.filename;
        }

        let query = 'INSERT INTO items (name,category_id,place_id,description,image) VALUES (?,?,?,?,?)';

        const [results] = await db.getConnection().execute(query, [
            item.name,
            item.categoryId,
            item.placeId,
            item.description,
            item.image
        ]);

        const id = results.insertId;

        return  res.send({message: 'Created new item', id});
    } catch (e) {
        next(e);
    }
});

router.delete('/:id', async (req, res,next) => {
    try {
        const [items] = await db.getConnection().execute('DELETE * FROM items WHERE id = ?', [req.params.id]);

        return  res.send({message: 'deleted this item'});
    } catch (e) {
        next(e);
    }
});




module.exports = router;