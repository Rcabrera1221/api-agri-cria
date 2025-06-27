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
        costoPorHa: 0,
        hectareasTotales: 0,
        actividadesTotales: 0,
        volumenHumedad: volumenHumedadData.map(row => ({
          humedad: 0,
          volumen:0
        })),
        duracionVolumen: duracionVolumenData.map(row => ({
          duracion: 0,
          volumen: 0
        }))
      });
    }

    const totalRiego = rows.filter(r => r.tipoActividad === 'Riego').length;
    const totalVolumen = rows.reduce((acc, r) => acc + (r.volumen || 0), 0);
    const totalArea = rows.reduce((acc, r) => acc + (r.area || 0), 0);
    const humedadMedia = rows.reduce((acc, r) => acc + (r.humedad || 0), 0) / rows.length;
    const totalCosto = rows.reduce((acc, r) => acc + (r.costo || 0), 0);

    const litroPorHa = totalArea > 0 ? totalVolumen / totalArea : 0;
    const costoPorHa = totalArea > 0 ? totalCosto / totalArea : 0;

    // Datos para card actividades
    const [resCantidadActividades] = await db.query(`
      SELECT  count(1) AS actividades_totales FROM actividades
    `);
    const cantidadActividades = resCantidadActividades[0];

    // Datos para el gráfico de barras: Volumen vs Humedad
    const [volumenHumedadData] = await db.query(`
      SELECT humedad, volumen FROM reportes
    `);

    // Datos para el gráfico de puntos: Duración y Volumen
    const [duracionVolumenData] = await db.query(`
      SELECT  duracion, volumen FROM reportes
    `);

    res.json({
      totalRiego,
      litroPorHa: litroPorHa.toFixed(2),
      humedadMedia: humedadMedia.toFixed(2),
      costoPorHa: costoPorHa.toFixed(2),
      hectareasTotales: totalArea,
      actividadesTotales: cantidadActividades.actividades_totales || 0,
      volumenHumedad: volumenHumedadData.map(row => ({
        humedad: row.humedad,
        volumen: Number(row.volumen)
      })),
      duracionVolumen: duracionVolumenData.map(row => ({
        duracion: Number(row.duracion),
        volumen: Number(row.volumen)
      }))
    });

  } catch (error) {
    console.error('Error en /dashboard:', error);
    res.status(500).json({ error: 'Error al obtener KPIs' });
  }
});

module.exports = router;
