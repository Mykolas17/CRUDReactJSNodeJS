const express = require('express');
const mysql = require('mysql2/promise');
const joi = require('joi');
const DB_CONFIG = require('../../config');
const isLoggedIn = require('../middleware/authorization');

const router = express.Router();

const guestSchema = joi.object({
  name: joi.string().required(),
  email: joi.string(),
  date: joi.string(),
});

router.get('/events/:eventId', isLoggedIn, async (req, res) => {
  try {
    const connection = await mysql.createConnection(DB_CONFIG);
    const [rows] = await connection.query(
      'SELECT g.id, g.name, g.email, g.date FROM `guests` g WHERE g.event_id = ?',
      [req.params.eventId]
    );
    await connection.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', isLoggedIn, async (req, res) => {
  try {
    const connection = await mysql.createConnection(DB_CONFIG);
    const [rows] = await connection.query(
      'SELECT g.id, g.event_id, g.name, g.email, g.date FROM `guests` g WHERE g.id = ?',
      [req.params.id]
    );
    await connection.end();
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', isLoggedIn, async (req, res) => {
  try {
    const { eventId, name, email, date } = req.body;
    try {
      await guestSchema.validateAsync({
        eventId,
        name,
        email,
        date,
      });
    } catch (err) {
      return res.status(400).json(err);
    }
    const connection = await mysql.createConnection(DB_CONFIG);
    const [rows] = await connection.query('SELECT 1 FROM `events` WHERE id=?', [
      eventId,
    ]);
    if (rows.length === 0) {
      return res.status(400).json({
        status: 'Bad Request!',
        error: 'Event does not exist!',
      });
    }
    const [response] = await connection.query(
      'INSERT INTO `guests` (`event_id`, `name`, `email`, `date`) VALUES (?,?,?,?)',
      [eventId, name, email, date]
    );
    const guestData = {
      id: response.insertId,
      eventId,
      name,
      email,
      date,
    };
    await connection.end();
    return res.json(guestData);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.delete('/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  try {
    const con = await mysql.createConnection(DB_CONFIG);
    const [resp] = await con.query(
      `DELETE FROM guests WHERE id="${Number(id)}"`
    );
    await con.end();
    return res.json(resp);
  } catch (err) {
    return res.status(500).json({
      status: 500,
      err,
    });
  }
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, date } = req.body;
  try {
    try {
      await guestSchema.validateAsync({ name, email, date });
    } catch (err) {
      return res.status(400).json({
        status: 400,
        err,
      });
    }
    const userData = {};
    if (name) userData.name = name;
    if (email) userData.email = email;
    if (date) userData.date = date;
    const con = await mysql.createConnection(DB_CONFIG);
    const [resp] = await con.query(
      `UPDATE guests SET ? WHERE id="${Number(id)}"`,
      userData
    );
    await con.end();
    return res.json(resp);
  } catch (err) {
    return res.status(500).json({
      status: 500,
      err,
    });
  }
});
module.exports = router;
