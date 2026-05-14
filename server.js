const cors = require('cors');
const express = require('express');
const app = express();
app.use(cors());

// estadísticas
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


// actividad reciente
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