const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

router.put('/clearCalendar', async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .query(`UPDATE calendar SET tag1 = 0, tag1_price = 0, tag2 = 0, tag2_price = 0, tag3 = 0, tag3_price = 0`);
        const updatedRows = await pool.request()
            .query(`SELECT * FROM calendar`);
        res.json(updatedRows.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.put('/putDate', async (req, res) => {
    try {
        const { date, tag1, tag1_price, tag2, tag2_price, tag3, tag3_price } = req.body;
        if (date > 0 && date < 32) {
            const pool = await getPool();
            await pool.request()
                .query(`UPDATE calendar SET tag1 = ${tag1}, tag1_price = ${tag1_price}, tag2 = ${tag2}, tag2_price = ${tag2_price}, tag3 = ${tag3}, tag3_price = ${tag3_price} WHERE date = ${date}`);
            const updatedRow = await pool.request()
                .query(`SELECT * FROM calendar WHERE date = ${date}`);
            res.json(updatedRow.recordset);
        } else {
            throw new Error('Invalid date');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.put('/putTags', async (req, res) => {
    try {
        const tags = req.body;
        const pool = await getPool();
        for (const tag of tags) {
            await pool.request()
                .query(`UPDATE tags SET logo = '${tag.logo}', price = ${tag.price}, count = 0, total = 0 WHERE id = ${tag.id}`);
        }
        const updatedTags = await pool.request()
            .query(`SELECT * FROM tags WHERE id IN (${tags.map(tag => tag.id).join(',')})`);
        res.json(updatedTags.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


router.get('/getAll', async (req, res) => {
    try {
        const pool = await getPool();
        if (!pool) {
            throw new Error('Database connection not established');
        }
        // console.log('table : ',req.body.table);
        if (!(req.body.table=='users' || req.body.table=='tags' || req.body.table=='calendar')) {
            throw new Error('Incorrect table name');
        }
        const result = await pool.request()
            .query(`SELECT * FROM ${req.body.table}`); // Implement validation for table name
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
