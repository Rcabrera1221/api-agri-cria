const express = require('express');
const router = express.Router();
const db = require('../db'); // Esto ahora debe ser un pool de mysql2/promise
const authenticateToken = require('../middlewares/authMiddleware');

// POST para guardar actividades
router.post('/', authenticateToken, async (req, res) => {
  const {
    fecha,
    comentarios
  } = req.body;

  const sql = `
    INSERT INTO actividades (fecha, comentarios)
    VALUES (?, ?)
  `;

  const values = [fecha, comentarios];

  try {
    // Usar await con pool.execute() para queries con placeholders (?)
    const [result] = await db.execute(sql, values); // 'execute' es preferible para prepared statements

    res.status(201).json({
      message: 'Actividad guardada correctamente',
      id: result.insert
    });

  } catch (err) {
    res.status(500).json({
      error: 'Error al guardar la actividad en la base de datos',
      details: err.message
    });
  }
});

module.exports = router;