const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// POST /register - Crear nuevo usuario
router.post('/register', async (req, res) => {
  const { login, password, name, email } = req.body;
  
  if (!login || !password) {
    return res.status(400).json({ message: 'Login y password son requeridos' });
  }

  try {
    // Verificar si ya existe el usuario
    const [existing] = await pool.query('SELECT id FROM usuarios WHERE login = ?', [login]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO usuarios (login, password, full_name, email) VALUES (?, ?, ?, ?)', [login, hashedPassword, name, email]);

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
});

// POST /login - Autenticación de usuario
router.post('/login', async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ message: 'Login y password son requeridos' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE login = ?', [login]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user.id, login: user.login }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ message: 'Login exitoso', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;
