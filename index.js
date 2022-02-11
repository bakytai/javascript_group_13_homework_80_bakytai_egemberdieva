const express = require('express');
const cors = require('cors');
const db = require('./mysqlDb');
const products = require('./app/products')
const app = express();
const port = 8000;