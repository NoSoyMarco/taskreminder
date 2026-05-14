// ========================================
// API DEL BACKEND
// ========================================

const API = "https://taskreminder-api-pa5z.onrender.com";


// ========================================
// CARGAR TODAS LAS TAREAS
// ========================================

async function cargarTareas() {

    try {

        // pedir tareas al backend
        const res = await fetch(`${API}/tareas`);

        // convertir respuesta a JSON
        const tareas = await res.json();

        // contenedor HTML
        const lista = document.getElementById("lista");

        // limpiar lista antes de renderizar
        lista.innerHTML = "";

        // recorrer tareas
        tareas.forEach(tarea => {

            // crear elemento HTML
            const li = document.createElement("li");

            // estilos modernos
            li.className =
                "bg-[#111827] border border-white/10 rounded-2xl p-5 flex justify-between items-center hover:border-cyan-400 transition";

            // contenido de la tarea
            li.innerHTML = `

                <div>

                    <h3 class="text-xl font-semibold">
                        ${tarea.texto}
                    </h3>

                    <p class="text-gray-400 mt-1">
                        Estado: ${tarea.estado}
                    </p>

                </div>

                <div class="flex gap-3">

                    <button
                        onclick="completar(${tarea.id})"
                        class="bg-green-400 hover:bg-green-300 text-black px-4 py-2 rounded-xl transition"
                    >
                        ✔
                    </button>

                    <button
                        onclick="eliminar(${tarea.id})"
                        class="bg-red-400 hover:bg-red-300 text-black px-4 py-2 rounded-xl transition"
                    >
                        ✖
                    </button>

                </div>
            `;

            // agregar al DOM
            lista.appendChild(li);

        });

    } catch (error) {

        console.error("Error cargando tareas:", error);

    }

}


// ========================================
// AGREGAR NUEVA TAREA
// ========================================

async function agregarTarea() {

    try {

        // obtener input
        const input = document.getElementById("tarea");

        // limpiar espacios
        const texto = input.value.trim();

        // validar vacío
        if (!texto) return;

        // enviar al backend
        const res = await fetch(`${API}/tareas`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({ texto })

        });

        // verificar respuesta
        if (res.ok) {

            // limpiar input
            input.value = "";

            // esperar un poco para sincronizar MySQL
            setTimeout(async () => {

                await cargarTodo();

            }, 200);

        }

    } catch (error) {

        console.error("Error agregando tarea:", error);

    }

}


// ========================================
// COMPLETAR TAREA
// ========================================

async function completar(id) {

    try {

        // petición PUT
        const res = await fetch(`${API}/tareas/${id}`, {

            method: "PUT"

        });

        // si salió bien
        if (res.ok) {

            // actualizar dashboard
            setTimeout(async () => {

                await cargarTodo();

            }, 200);

        }

    } catch (error) {

        console.error("Error completando tarea:", error);

    }

}


// ========================================
// ELIMINAR TAREA
// ========================================

async function eliminar(id) {

    try {

        // petición DELETE
        const res = await fetch(`${API}/tareas/${id}`, {

            method: "DELETE"

        });

        // si salió bien
        if (res.ok) {

            // actualizar dashboard
            setTimeout(async () => {

                await cargarTodo();

            }, 200);

        }

    } catch (error) {

        console.error("Error eliminando tarea:", error);

    }

}


// ========================================
// CARGAR ESTADÍSTICAS
// ========================================

async function cargarStats() {

    try {

        // pedir estadísticas
        const res = await fetch(`${API}/stats`);

        // convertir a JSON
        const data = await res.json();

        // actualizar cards
        document.getElementById("completadas").innerText =
            data.completadas;

        document.getElementById("pendientes").innerText =
            data.pendientes;

        document.getElementById("productividad").innerText =
            data.productividad + "%";

        document.getElementById("total").innerText =
            data.total;

    } catch (error) {

        console.error("Error cargando estadísticas:", error);

    }

}


// ========================================
// CARGAR ACTIVIDAD RECIENTE
// ========================================

async function cargarActividad() {

    try {

        // pedir actividad
        const res = await fetch(`${API}/actividad`);

        // convertir a JSON
        const actividad = await res.json();

        // contenedor
        const contenedor =
            document.getElementById("actividadLista");

        // limpiar contenido
        contenedor.innerHTML = "";

        // recorrer actividades
        actividad.forEach(a => {

            // crear card
            const div = document.createElement("div");

            div.className =
                "bg-[#111827] border border-white/10 rounded-2xl p-4 hover:border-cyan-400 transition";

            // contenido
            div.innerHTML = `

                <h3 class="font-semibold text-lg">
                    ${a.mensaje}
                </h3>

                <p class="text-gray-400 text-sm mt-2">
                    ${new Date(a.fecha).toLocaleString()}
                </p>

            `;

            // agregar al DOM
            contenedor.appendChild(div);

        });

    } catch (error) {

        console.error("Error cargando actividad:", error);

    }

}


// ========================================
// CARGAR TODO EL DASHBOARD
// ========================================

async function cargarTodo() {

    await cargarTareas();

    await cargarStats();

    await cargarActividad();

}


// ========================================
// INICIAR APP
// ========================================

cargarTodo();