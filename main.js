// Inicialización de variables globales
let listaReproduccion = [];

// Función para cargar la lista de reproducción desde localStorage
const cargarListaReproduccion = () => {
    const listaGuardada = localStorage.getItem('listaReproduccion');
    if (listaGuardada) {
        listaReproduccion = JSON.parse(listaGuardada);
    }
};

// Función para guardar la lista de reproducción en localStorage
const guardarListaReproduccion = () => {
    localStorage.setItem('listaReproduccion', JSON.stringify(listaReproduccion));
};

// Función para mostrar la lista de animes en el DOM
const mostrarListaAnimes = (animesFiltrados = animes) => {
    const listaAnimes = document.getElementById('anime-list');
    listaAnimes.innerHTML = '';

    animesFiltrados.forEach(anime => {
        const animeElement = document.createElement('div');
        animeElement.className = 'anime-item';
        animeElement.innerHTML = `
            <h3>${anime.nombre}</h3>
            <p>${anime.descripcion}</p>
            <p>Episodios: ${anime.episodios}</p>
            <button class="add-to-playlist" data-id="${anime.id}">Agregar a la lista</button>
        `;
        listaAnimes.appendChild(animeElement);
    });
};

// Función para mostrar la lista de reproducción en el DOM
const mostrarListaReproduccion = () => {
    const playlistElement = document.getElementById('playlist');
    playlistElement.innerHTML = '';

    listaReproduccion.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'playlist-item';
        itemElement.innerHTML = `
            <p>${item.nombre} - Episodio ${item.episodio}</p>
            <button class="remove-from-playlist" data-id="${item.id}">Eliminar</button>
        `;
        playlistElement.appendChild(itemElement);
    });
};

// Función para buscar anime
const buscarAnime = (nombre) => {
    const animesFiltrados = animes.filter(anime => 
        anime.nombre.toLowerCase().includes(nombre.toLowerCase())
    );
    mostrarListaAnimes(animesFiltrados);
};

// Función para agregar un episodio a la lista de reproducción
const agregarAListaReproduccion = (animeId, episodio) => {
    const anime = animes.find(a => a.id === animeId);
    if (anime && episodio > 0 && episodio <= anime.episodios) {
        const nuevoItem = {
            id: Date.now(),
            nombre: anime.nombre,
            episodio: episodio
        };
        listaReproduccion.push(nuevoItem);
        guardarListaReproduccion();
        mostrarListaReproduccion();
        Swal.fire({
            icon: 'success',
            title: '¡Agregado!',
            text: `${anime.nombre} - Episodio ${episodio} ha sido agregado a tu lista de reproducción.`,
            timer: 2000,
            showConfirmButton: false
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Número de episodio inválido',
        });
    }
};

// Función para eliminar un episodio de la lista de reproducción
const eliminarDeLista = (id) => {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            listaReproduccion = listaReproduccion.filter(item => item.id !== id);
            guardarListaReproduccion();
            mostrarListaReproduccion();
            Swal.fire(
                '¡Eliminado!',
                'El episodio ha sido eliminado de tu lista.',
                'success'
            );
        }
    });
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    cargarListaReproduccion();
    mostrarListaAnimes();
    mostrarListaReproduccion();

    // Evento para el botón de búsqueda
    document.getElementById('search-button').addEventListener('click', () => {
        const searchTerm = document.getElementById('search-input').value;
        buscarAnime(searchTerm);
    });

    // Evento para la tecla Enter en el campo de búsqueda
    document.getElementById('search-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = e.target.value;
            buscarAnime(searchTerm);
        }
    });

    // Evento para agregar a la lista de reproducción
    document.getElementById('anime-list').addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-playlist')) {
            const animeId = parseInt(e.target.getAttribute('data-id'));
            Swal.fire({
                title: 'Agregar episodio',
                input: 'number',
                inputLabel: 'Número de episodio',
                inputPlaceholder: 'Ingrese el número de episodio',
                showCancelButton: true,
                inputValidator: (value) => {
                    if (!value) {
                        return 'Debes ingresar un número de episodio';
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    agregarAListaReproduccion(animeId, parseInt(result.value));
                }
            });
        }
    });

    // Evento para eliminar de la lista de reproducción
    document.getElementById('playlist').addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-from-playlist')) {
            const itemId = parseInt(e.target.getAttribute('data-id'));
            eliminarDeLista(itemId);
        }
    });
});