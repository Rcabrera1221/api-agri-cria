const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT fecha, comentarios FROM actividades');

    res.json(rows);

  } catch (error) {
    console.error('Error en /traeActividades:', error);
    res.status(500).json({ error: 'Error al obtener actividades' });
  }
});

module.exports = router;
