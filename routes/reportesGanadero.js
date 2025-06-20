const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/', authenticateToken, async (req, res) => {
  const {
    filtro,
    tipoGanado,
    numeroCabezas,
    pesoPromedio,
    alimentacion,
    duracion,
    costo,
  } = req.body;

  const sql = `
    INSERT INTO reportes_ganaderos 
    (filtro, tipo_ganado, numero_cabezas, peso_promedio, alimentacion, duracion, costo)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    filtro || null,
    tipoGanado || null,
    numeroCabezas || null,
    pesoPromedio || null,
    alimentacion || null,
    duracion || null,
    costo || null,
  ];

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
