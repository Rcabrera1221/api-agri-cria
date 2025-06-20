const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middlewares/authMiddleware'); // <-- IMPORTANTE

router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM reportes');

    if (rows.length === 0) {
      return res.json({
        totalRiego: 0,
        litroPorHa: 0,
        humedadMedia: 0,
        costoPorHa: 0
      });
    }

    const totalRiego = rows.filter(r => r.tipoActividad === 'Riego').length;
    const totalVolumen = rows.reduce((acc, r) => acc + (r.volumen || 0), 0);
    const totalArea = rows.reduce((acc, r) => acc + (r.area || 0), 0);
    const humedadMedia = rows.reduce((acc, r) => acc + (r.humedad || 0), 0) / rows.length;
    const totalCosto = rows.reduce((acc, r) => acc + (r.costo || 0), 0);

    const litroPorHa = totalArea > 0 ? totalVolumen / totalArea : 0;
    const costoPorHa = totalArea > 0 ? totalCosto / totalArea : 0;

    res.json({
      totalRiego,
      litroPorHa: litroPorHa.toFixed(2),
      humedadMedia: humedadMedia.toFixed(2),
      costoPorHa: costoPorHa.toFixed(2)
    });
  } catch (error) {
    console.error('Error en /dashboard:', error);
    res.status(500).json({ error: 'Error al obtener KPIs' });
  }
});

module.exports = router;
