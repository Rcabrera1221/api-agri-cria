const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const reportesRouter = require('./routes/reportes');
const dashboardRouter = require('./routes/dashboard');
const reportesGanadero = require('./routes/reportesGanadero');
const dashboardGanadero = require('./routes/dashboardGanadero');
const guardarActividad = require('./routes/guardaActividades');
const traeActividad = require('./routes/traeActividades');
require('dotenv').config();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

//app.options('*', cors()); // Preflight

app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api/reportes', reportesRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/reportesGanadero', reportesGanadero);
app.use('/api/dashboardGanadero', dashboardGanadero);
app.use('/api/guardarActividad', guardarActividad);
app.use('/api/traeActividades', traeActividad);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
