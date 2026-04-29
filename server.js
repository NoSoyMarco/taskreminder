const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // por defecto en XAMPP
    database: 'taskreminder'
});

// conectar
db.connect(err => {
    if (err) {
        console.error('Error de conexión:', err);
        return;
    }
    console.log('Conectado a MySQL');
});

// crear tarea
app.post('/tareas', (req, res) => {
    const { texto } = req.body;

    db.query(
        'INSERT INTO tareas (texto, estado) VALUES (?, ?)',
        [texto, 'pendiente'],
        (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send("Error");
            } else {
                res.json({ id: result.insertId, texto, estado: 'pendiente' });
            }
        }
    );
});

// obtener tareas
app.get('/tareas', (req, res) => {
    db.query('SELECT * FROM tareas', (err, results) => {
        if (err) {
            res.status(500).send("Error");
        } else {
            res.json(results);
        }
    });
});

// completar tarea
app.put('/tareas/:id', (req, res) => {
    const id = req.params.id;

    db.query(
        'UPDATE tareas SET estado = ? WHERE id = ?',
        ['completada', id],
        (err) => {
            if (err) {
                res.status(500).send("Error");
            } else {
                res.json({ mensaje: "Tarea completada" });
            }
        }
    );
});
// eliminar tarea
app.delete('/tareas/:id', (req, res) => {
    const id = req.params.id;

    db.query(
        'DELETE FROM tareas WHERE id = ?',
        [id],
        (err) => {
            if (err) {
                res.status(500).send("Error");
            } else {
                res.json({ mensaje: "Tarea eliminada" });
            }
        }
    );
});


app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
