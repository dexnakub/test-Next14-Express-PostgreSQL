import express, { Express, Request, Response } from "express";

import router from './routers'
import dotenv from 'dotenv';
var cors = require('cors')
var bodyParser = require('body-parser')

dotenv.config();

const server: Express = express();
const PORT = process.env.PORT || 5000;

server.use(cors())
server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())

server.use('/', router);

server.listen(PORT, () => console.log(`Server is started at port ${PORT}`))