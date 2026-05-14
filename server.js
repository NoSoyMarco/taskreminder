const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();


// ========================================
// MIDDLEWARES
// ========================================

app.use(cors());

app.use(express.json());


// ========================================
// CONEXIÓN MYSQL (RAILWAY)
// ========================================

const db = mysql.createPool({

    host: process.env.DB_HOST,

    port: process.env.DB_PORT,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME,

    waitForConnections: true,

    connectionLimit: 10,

    queueLimit: 0

});

// ========================================
// EVITAR CRASH MYSQL
// ========================================

db.on('error', (err) => {

    console.log("MySQL error:");
    console.log(err);

});

// ========================================
// PROBAR CONEXIÓN MYSQL
// ========================================

db.getConnection((err, connection) => {

    if (err) {

        console.log("Error conectando MySQL:");
        console.log(err);

    } else {

        console.log("Conectado a MySQL 🚀");

        connection.release();

    }

});


// ========================================
// CREAR TABLAS AUTOMÁTICAMENTE
// ========================================

db.query(

    `
    CREATE TABLE IF NOT EXISTS tareas (

        id INT AUTO_INCREMENT PRIMARY KEY,

        texto VARCHAR(255),

        estado VARCHAR(50)

    )
    `,

    (err) => {

        if (err) {

            console.log("Error creando tabla tareas:");
            console.log(err);

        } else {

            console.log("Tabla tareas lista 🚀");

        }

    }

);

db.query(

    `
    CREATE TABLE IF NOT EXISTS actividad (

        id INT AUTO_INCREMENT PRIMARY KEY,

        mensaje VARCHAR(255),

        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP

    )
    `,

    (err) => {

        if (err) {

            console.log("Error creando tabla actividad:");
            console.log(err);

        } else {

            console.log("Tabla actividad lista 🚀");

        }

    }

);


// ========================================
// OBTENER TODAS LAS TAREAS
// ========================================

app.get('/tareas', (req, res) => {

    db.query(
        'SELECT * FROM tareas',
        (err, result) => {

            if (err) {

                return res.status(500).send(err);

            }

            res.json(result);

        }
    );

});


// ========================================
// CREAR TAREA
// ========================================

app.post('/tareas', (req, res) => {

    const { texto } = req.body;

    db.query(

        'INSERT INTO tareas (texto, estado) VALUES (?, ?)',

        [texto, 'pendiente'],

        (err, result) => {

            if (err) {

                return res.status(500).send(err);

            }

            // guardar actividad
            db.query(

                'INSERT INTO actividad (mensaje) VALUES (?)',

                ['Nueva tarea creada']

            );

            res.json({

                id: result.insertId,

                texto,

                estado: 'pendiente'

            });

        }

    );

});


// ========================================
// COMPLETAR TAREA
// ========================================

app.put('/tareas/:id', (req, res) => {

    const id = req.params.id;

    db.query(

        'UPDATE tareas SET estado = ? WHERE id = ?',

        ['completada', id],

        (err) => {

            if (err) {

                return res.status(500).send(err);

            }

            // guardar actividad
            db.query(

                'INSERT INTO actividad (mensaje) VALUES (?)',

                ['Tarea completada']

            );

            res.json({

                mensaje: 'Tarea completada'

            });

        }

    );

});


// ========================================
// ELIMINAR TAREA
// ========================================

app.delete('/tareas/:id', (req, res) => {

    const id = req.params.id;

    db.query(

        'DELETE FROM tareas WHERE id = ?',

        [id],

        (err) => {

            if (err) {

                return res.status(500).send(err);

            }

            // guardar actividad
            db.query(

                'INSERT INTO actividad (mensaje) VALUES (?)',

                ['Tarea eliminada']

            );

            res.json({

                mensaje: 'Tarea eliminada'

            });

        }

    );

});


// ========================================
// ESTADÍSTICAS
// ========================================

app.get('/stats', (req, res) => {

    db.query(

        'SELECT * FROM tareas',

        (err, result) => {

            if (err) {

                return res.status(500).send(err);

            }

            const total = result.length;

            const completadas =
                result.filter(
                    t => t.estado === 'completada'
                ).length;

            const pendientes =
                total - completadas;

            const productividad =
                total > 0
                    ? Math.round(
                        (completadas / total) * 100
                    )
                    : 0;

            res.json({

                total,
                completadas,
                pendientes,
                productividad

            });

        }

    );

});


// ========================================
// ACTIVIDAD RECIENTE
// ========================================

app.get('/actividad', (req, res) => {

    db.query(

        'SELECT * FROM actividad ORDER BY fecha DESC LIMIT 5',

        (err, result) => {

            if (err) {

                return res.status(500).send(err);

            }

            res.json(result);

        }

    );

});


// ========================================
// INICIAR SERVIDOR
// ========================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Servidor corriendo en puerto ${PORT}`);

});