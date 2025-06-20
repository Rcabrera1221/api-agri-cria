const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middlewares/authMiddleware'); // <-- IMPORTANTE

router.get('/', authenticateToken, async (req, res) => {
  try {
    const sql = `
      SELECT 
        AVG(peso_promedio) AS peso_promedio_general,
        SUM(alimentacion) / NULLIF(SUM(numero_cabezas), 0) AS alimentacion_promedio_por_animal,
        SUM(costo) AS costo_total_alimentacion,
        SUM(numero_cabezas) AS numero_total_animales
      FROM reportes_ganaderos
    `;

    const [data] = await db.query(sql);


    res.json({
      pesoPromedioGeneral: data[0].peso_promedio_general.toFixed(2),
      alimentacionPromedioPorAnimal: data[0].alimentacion_promedio_por_animal.toFixed(2),
      costoTotalAlimentacion: data[0].costo_total_alimentacion.toFixed(2),
      numeroTotalAnimales: data[0].numero_total_animales,
    });

  } catch (error) {
    console.error('Error en /dashboard:', error);
    res.status(500).json({ error: 'Error al obtener KPIs' });
  }
});

module.exports = router;
