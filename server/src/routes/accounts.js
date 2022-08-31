const express = require('express');
const joi = require('joi');
const mysql = require('mysql2/promise');
const DB_CONFIG = require('../../config');
const isLoggedIn = require('../middleware/authorization');

const router = express.Router();

const accountSchema = joi.object({
  eventId: joi.number().required(),
});

router.get('/', isLoggedIn, async (req, res) => {
  try {
    // console.log('req.userId', req.userId);
    const connection = await mysql.createConnection(DB_CONFIG);
    const [rows] = await connection.query(
      'SELECT e.id, e.name, e.date FROM `events` e JOIN `accounts` a ON e.id=a.group_id WHERE a.user_id = ?',
      [req.userId]
    );
    await connection.end();
    return res.json(rows);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post('/', isLoggedIn, async (req, res) => {
  const { eventId } = req.body;
  try {
    await accountSchema.validateAsync({ eventId });
  } catch (err) {
    return res.status(400).json(err);
  }
  try {
    const connection = await mysql.createConnection(DB_CONFIG);
    const [response] = await connection.query(
      'INSERT INTO accounts (`event_id`, `user_id`) VALUES (?, ?)',
      [eventId, req.userId]
    );
    const accountData = {
      id: response.insertId,
      userId: req.userId,
      eventId,
    };
    await connection.end();
    return res.json(accountData);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
