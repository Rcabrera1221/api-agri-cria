const express = require('express');
const router = express.Router();
const db = require('../db'); // Esto ahora debe ser un pool de mysql2/promise
const authenticateToken = require('../middlewares/authMiddleware');

// POST para guardar reporte
// ¡Marcar la función del handler como 'async'!
router.post('/', authenticateToken, async (req, res) => {
  const {
    filtro,
    tipoActividad,
    area,
    volumen,
    duracion,
    humedad,
    costo
  } = req.body;

  const sql = `
    INSERT INTO reportes (filtro, tipoActividad, area, volumen, duracion, humedad, costo)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [filtro, tipoActividad, area, volumen, duracion, humedad, costo];

  try {
    // Usar await con pool.execute() para queries con placeholders (?)
    const [result] = await db.execute(sql, values); // 'execute' es preferible para prepared statements

    res.status(201).json({
      message: 'Reporte guardado correctamente',
      id: result.insertI
    });

  } catch (err) {
    res.status(500).json({
      error: 'Error al guardar el reporte en la base de datos',
      details: err.message
    });
  }
});

module.exports = router;