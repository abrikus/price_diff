const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const userRouter = require('./users/routes');


const { NODE_DOCKER_PORT } = process.env;

const app = express();
app.use(express.json());
app.use('/users', userRouter);

const server = app.listen(NODE_DOCKER_PORT, () => console.log(`Server has started on port: ${NODE_DOCKER_PORT}`));

module.exports = { app, server };
