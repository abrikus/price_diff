const { Router } = require('express');
const controller = require('./controller');

const router = Router();

router.get('/getUsers', controller.getUsers);
router.post('/addUser', controller.addUser);
router.delete('/:email', controller.removeUser);

module.exports = router;
