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







module.exports = router;