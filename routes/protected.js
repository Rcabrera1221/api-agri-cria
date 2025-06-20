const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/perfil', authenticateToken, (req, res) => {
  res.json({ message: `Hola, ${req.user.login}! Este es tu perfil privado.` });
});

module.exports = router;
