document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Polla Mundialista 2026 - Cargada para GitHub Pages');
    
    // ================= CONFIGURACIÓN =================
    const CONFIG = {
        sonidoActivado: false,
        audioContext: null,
        volumen: 0.3
    };
    
    // Datos iniciales
    const equipos = [
        "España", "Argentina", "Inglaterra", "Portugal", "Brasil", 
        "Francia", "Alemania", "Colombia", "Noruega/Ecuador", "Uruguay/Marruecos"
    ];
    
    const personas = [
        "David", "Sebastián", "Manolo", "Daniel", "Stiven", 
        "Robert", "Ximena", "Andrés", "Jessenia", "Camila"
    ];
    
    let equiposDisponibles = [...equipos];
    let personasDisponibles = [...personas];
    let resultados = [];
    let sorteoEnProgreso = false;
    
    // ================= ELEMENTOS DOM =================
    const elementos = {
        listaEquipos: document.getElementById('listaEquipos'),
        listaPersonas: document.getElementById('listaPersonas'),
        listaResultados: document.getElementById('listaResultados'),
        btnSortear: document.getElementById('btnSortear'),
        btnReiniciar: document.getElementById('btnReiniciar'),
        btnSilenciar: document.getElementById('btnSilenciar'),
        tarjetaPersona: document.getElementById('tarjetaPersona'),
        tarjetaEquipo: document.getElementById('tarjetaEquipo'),
        contador: document.getElementById('contador'),
        contadorEquipos: document.getElementById('contadorEquipos'),
        contadorPersonas: document.getElementById('contadorPersonas'),
        contadorResultados: document.getElementById('contadorResultados'),
        advertenciaSonido: document.getElementById('advertenciaSonido'),
        drama1: document.getElementById('drama1'),
        drama2: document.getElementById('drama2'),
        drama3: document.getElementById('drama3')
    };
    
    // ================= SISTEMA DE AUDIO =================
    function inicializarAudio() {
        // Intentar crear contexto de audio
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            CONFIG.audioContext = new AudioContext();
            console.log('✅ AudioContext inicializado');
            
            // Mostrar advertencia hasta que el usuario interactúe
            elementos.advertenciaSonido.style.display = 'block';
            
            // Activar audio al primer clic en la página
            document.body.addEventListener('click', activarAudioUnaVez, { once: true });
            
        } catch (e) {
            console.warn('❌ Audio no disponible:', e.message);
            elementos.advertenciaSonido.textContent = '🔇 Audio no disponible en este navegador';
            elementos.btnSilenciar.style.display = 'none';
        }
    }
    
    function activarAudioUnaVez() {
        if (CONFIG.audioContext && CONFIG.audioContext.state === 'suspended') {
            CONFIG.audioContext.resume().then(() => {
                CONFIG.sonidoActivado = true;
                elementos.advertenciaSonido.style.display = 'none';
                elementos.btnSilenciar.innerHTML = '<i class="fas fa-volume-up"></i> SONIDO: ACTIVADO';
                console.log('🔊 Audio activado');
                
                // Reproducir sonido de confirmación
                playBeep(523.25, 0.1);
            });
        }
    }
    
    function toggleSonido() {
        CONFIG.sonidoActivado = !CONFIG.sonidoActivado;
        elementos.btnSilenciar.innerHTML = CONFIG.sonidoActivado 
            ? '<i class="fas fa-volume-up"></i> SONIDO: ACTIVADO'
            : '<i class="fas fa-volume-mute"></i> SONIDO: SILENCIADO';
        
        if (CONFIG.sonidoActivado) {
            playBeep(659.25, 0.1);
        }
    }
    
    // Funciones de sonido simples
    function playBeep(frecuencia, duracion) {
        if (!CONFIG.sonidoActivado || !CONFIG.audioContext) return;
        
        try {
            const oscilador = CONFIG.audioContext.createOscillator();
            const ganancia = CONFIG.audioContext.createGain();
            
            oscilador.connect(ganancia);
            ganancia.connect(CONFIG.audioContext.destination);
            
            oscilador.frequency.value = frecuencia;
            oscilador.type = 'sine';
            
            ganancia.gain.setValueAtTime(0, CONFIG.audioContext.currentTime);
            ganancia.gain.linearRampToValueAtTime(CONFIG.volumen, CONFIG.audioContext.currentTime + 0.01);
            ganancia.gain.exponentialRampToValueAtTime(0.001, CONFIG.audioContext.currentTime + duracion);
            
            oscilador.start(CONFIG.audioContext.currentTime);
            oscilador.stop(CONFIG.audioContext.currentTime + duracion);
        } catch (e) {
            console.log('Error en sonido:', e);
        }
    }
    
    function playSonidoSuspenso() {
        if (!CONFIG.sonidoActivado) return;
        
        // Sonido descendente
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                playBeep(800 - (i * 100), 0.3);
            }, i * 300);
        }
    }
    
    function playSonidoGol() {
        if (!CONFIG.sonidoActivado) return;
        
        // Acorde de celebración
        const notas = [523.25, 659.25, 783.99, 1046.50]; // Do, Mi, Sol, Do alto
        notas.forEach((nota, index) => {
            setTimeout(() => {
                playBeep(nota, 0.2);
            }, index * 80);
        });
    }
    
    function playSonidoTambores() {
        if (!CONFIG.sonidoActivado) return;
        
        // Ritmo de tambor
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                playBeep(150, 0.05);
            }, i * 200);
        }
    }
    
    function playSonidoError() {
        if (!CONFIG.sonidoActivado) return;
        
        const notas = [300, 250, 200];
        notas.forEach((nota, index) => {
            setTimeout(() => {
                playBeep(nota, 0.1);
            }, index * 100);
        });
    }
    
    // ================= FUNCIONES PRINCIPALES =================
    function inicializar() {
        inicializarAudio();
        mostrarEquipos();
        mostrarPersonas();
        actualizarContadores();
        
        // Event listeners
        elementos.btnSortear.addEventListener('click', iniciarSorteoDramatico);
        elementos.btnReiniciar.addEventListener('click', reiniciarTodo);
        elementos.btnSilenciar.addEventListener('click', toggleSonido);
        
        // Tecla Enter para sortear
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !sorteoEnProgreso) {
                iniciarSorteoDramatico();
            }
            if (e.key === 'r' || e.key === 'R') {
                reiniciarTodo();
            }
        });
        
        console.log('✅ Aplicación inicializada');
    }
    
    function mostrarEquipos() {
        elementos.listaEquipos.innerHTML = '';
        equiposDisponibles.forEach(equipo => {
            const div = document.createElement('div');
            div.className = 'equipo';
            div.innerHTML = `<div>${getBandera(equipo)}</div><div>${equipo}</div>`;
            elementos.listaEquipos.appendChild(div);
        });
    }
    
    function mostrarPersonas() {
        elementos.listaPersonas.innerHTML = '';
        personasDisponibles.forEach(persona => {
            const div = document.createElement('div');
            div.className = 'persona';
            div.innerHTML = `<div>${getEmojiPersona(persona)}</div><div>${persona}</div>`;
            elementos.listaPersonas.appendChild(div);
        });
    }
    
    function getBandera(equipo) {
        const banderas = {
            'España': '🇪🇸',
            'Argentina': '🇦🇷',
            'Inglaterra': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
            'Portugal': '🇵🇹',
            'Brasil': '🇧🇷',
            'Francia': '🇫🇷',
            'Alemania': '🇩🇪',
            'Colombia': '🇨🇴',
            'Noruega/Ecuador': '🇳🇴/🇪🇨',
            'Uruguay/Marruecos': '🇺🇾/🇲🇦'
        };
        return banderas[equipo] || '🏴‍☠️';
    }
    
    function getEmojiPersona(nombre) {
        const emojisHombres = ['😎', '🤠', '🧐', '🤩', '😃', '🦸', '🧑‍💻', '👨‍🍳', '🕺', '💪'];
        const emojisMujeres = ['👩‍🦰', '👸', '💃', '👩‍🎤', '👩‍🚀', '👩‍💻', '👩‍🍳', '🦸‍♀️', '🧚', '🌟'];
        
        // Detectar si es nombre femenino (simple)
        const nombresFemeninos = ['Ximena', 'Jessenia', 'Camila'];
        
        if (nombresFemeninos.includes(nombre)) {
            const index = nombre.length % emojisMujeres.length;
            return emojisMujeres[index];
        } else {
            const index = nombre.length % emojisHombres.length;
            return emojisHombres[index];
        }
    }
    
    function actualizarContadores() {
        elementos.contadorEquipos.textContent = equiposDisponibles.length;
        elementos.contadorPersonas.textContent = personasDisponibles.length;
        elementos.contadorResultados.textContent = resultados.length;
    }
    
    // ================= SORTEO DRAMÁTICO =================
    async function iniciarSorteoDramatico() {
        if (sorteoEnProgreso) return;
        
        if (equiposDisponibles.length === 0 || personasDisponibles.length === 0) {
            alert('¡Ya se sortearon todos los equipos!\nHaz clic en "REINICIAR TODO" para empezar de nuevo.');
            playSonidoError();
            return;
        }
        
        sorteoEnProgreso = true;
        
        // Preparar UI
        elementos.btnSortear.disabled = true;
        elementos.btnSortear.innerHTML = '<i class="fas fa-cog fa-spin"></i> SORTEANDO...';
        
        // 1. Cuenta regresiva dramática
        await realizarCuentaRegresiva();
        
        // 2. Selección con suspenso
        const { persona, equipo } = await seleccionarAleatorioConSuspenso();
        
        // 3. Mostrar resultado
        mostrarResultadoFinal(persona, equipo);
        
        // 4. Actualizar datos
        resultados.push({ persona, equipo, timestamp: new Date().toLocaleTimeString() });
        equiposDisponibles = equiposDisponibles.filter(e => e !== equipo);
        personasDisponibles = personasDisponibles.filter(p => p !== persona);
        
        // 5. Actualizar UI
        mostrarEquipos();
        mostrarPersonas();
        actualizarResultados();
        actualizarContadores();
        
        // 6. Reactivar
        sorteoEnProgreso = false;
        elementos.btnSortear.disabled = false;
        elementos.btnSortear.innerHTML = '<i class="fas fa-bolt"></i> ¡INICIAR SORTEO DRAMÁTICO!';
    }
    
    function realizarCuentaRegresiva() {
        return new Promise(resolve => {
            let cuenta = 3;
            elementos.contador.textContent = cuenta;
            
            const intervalo = setInterval(() => {
                cuenta--;
                
                if (cuenta > 0) {
                    elementos.contador.textContent = cuenta;
                    playSonidoSuspenso();
                    
                    // Activar elementos de drama
                    if (cuenta === 3) elementos.drama1.classList.add('activo');
                    if (cuenta === 2) {
                        elementos.drama1.classList.remove('activo');
                        elementos.drama2.classList.add('activo');
                    }
                    if (cuenta === 1) {
                        elementos.drama2.classList.remove('activo');
                        elementos.drama3.classList.add('activo');
                        playSonidoTambores();
                    }
                } else {
                    clearInterval(intervalo);
                    elementos.contador.textContent = '¡YA!';
                    elementos.drama3.classList.remove('activo');
                    setTimeout(resolve, 500);
                }
            }, 1000);
        });
    }
    
    function seleccionarAleatorioConSuspenso() {
        return new Promise(resolve => {
            let contadorPasos = 0;
            const maxPasos = 25;
            let velocidad = 80; // ms
            let intervalo;
            
            // Función para mostrar selección aleatoria
            function mostrarSeleccionAleatoria() {
                const personaIndex = Math.floor(Math.random() * personasDisponibles.length);
                const equipoIndex = Math.floor(Math.random() * equiposDisponibles.length);
                
                const persona = personasDisponibles[personaIndex];
                const equipo = equiposDisponibles[equipoIndex];
                
                // Actualizar tarjetas
                elementos.tarjetaPersona.querySelector('.nombre-grande').textContent = persona;
                elementos.tarjetaPersona.querySelector('.emoji').textContent = getEmojiPersona(persona);
                
                elementos.tarjetaEquipo.querySelector('.equipo-grande').textContent = equipo;
                elementos.tarjetaEquipo.querySelector('.bandera').textContent = getBandera(equipo);
                
                contadorPasos++;
                
                // Ir haciendo más lento
                if (contadorPasos > maxPasos / 2) {
                    velocidad += 15;
                }
                
                // Detenerse al final
                if (contadorPasos >= maxPasos) {
                    clearInterval(intervalo);
                    
                    // Efecto final
                    setTimeout(() => {
                        playSonidoGol();
                        
                        // Animación de celebración
                        elementos.tarjetaPersona.style.transform = 'scale(1.15)';
                        elementos.tarjetaEquipo.style.transform = 'scale(1.15)';
                        elementos.tarjetaPersona.style.boxShadow = '0 0 40px #003893';
                        elementos.tarjetaEquipo.style.boxShadow = '0 0 40px #CE1126';
                        
                        // Crear confeti
                        crearConfeti();
                        
                        setTimeout(() => {
                            elementos.tarjetaPersona.style.transform = 'scale(1)';
                            elementos.tarjetaEquipo.style.transform = 'scale(1)';
                            elementos.tarjetaPersona.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.2)';
                            elementos.tarjetaEquipo.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.2)';
                            resolve({ persona, equipo });
                        }, 800);
                    }, 200);
                }
            }
            
            // Iniciar intervalo
            intervalo = setInterval(mostrarSeleccionAleatoria, velocidad);
        });
    }
    
    function crearConfeti() {
        const colores = ['#FCD116', '#CE1126', '#003893', '#28a745', '#20c997'];
        const emojis = ['⚽', '🎉', '🎊', '⭐', '🌟', '🏆', '🇨🇴', '🔥'];
        
        for (let i = 0; i < 25; i++) {
            setTimeout(() => {
                const confeti = document.createElement('div');
                confeti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                confeti.style.position = 'fixed';
                confeti.style.left = Math.random() * 100 + 'vw';
                confeti.style.top = '-50px';
                confeti.style.fontSize = (Math.random() * 30 + 20) + 'px';
                confeti.style.zIndex = '9999';
                confeti.style.opacity = '0.9';
                confeti.style.pointerEvents = 'none';
                confeti.style.animation = `confetiCaida ${1 + Math.random() * 2}s linear forwards`;
                
                // Color aleatorio
                confeti.style.color = colores[Math.floor(Math.random() * colores.length)];
                
                // Rotación aleatoria
                confeti.style.transform = `rotate(${Math.random() * 360}deg)`;
                
                document.body.appendChild(confeti);
                
                // Eliminar después
                setTimeout(() => {
                    if (confeti.parentNode) {
                        confeti.parentNode.removeChild(confeti);
                    }
                }, 3000);
            }, i * 50);
        }
        
        // Agregar animación CSS si no existe
        if (!document.getElementById('animacionConfeti')) {
            const style = document.createElement('style');
            style.id = 'animacionConfeti';
            style.textContent = `
                @keyframes confetiCaida {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    function mostrarResultadoFinal(persona, equipo) {
        // Destacar en las listas
        const equipoElements = elementos.listaEquipos.querySelectorAll('.equipo');
        const personaElements = elementos.listaPersonas.querySelectorAll('.persona');
        
        equipoElements.forEach(el => {
            if (el.textContent.includes(equipo)) {
                el.classList.add('seleccionado');
            }
        });
        
        personaElements.forEach(el => {
            if (el.textContent.includes(persona)) {
                el.classList.add('seleccionada');
            }
        });
    }
    
    function actualizarResultados() {
        elementos.listaResultados.innerHTML = '';
        
        if (resultados.length === 0) {
            elementos.listaResultados.innerHTML = `
                <p class="instruccion">
                    <i class="fas fa-info-circle"></i><br>
                    Los resultados aparecerán aquí después de cada sorteo.
                </p>
            `;
            return;
        }
        
        // Mostrar en orden inverso (el más reciente primero)
        [...resultados].reverse().forEach((item, index) => {
            const posicionReal = resultados.length - index;
            const div = document.createElement('div');
            div.className = 'resultado-item';
            div.innerHTML = `
                <div>
                    <div class="nombre-resultado">${posicionReal}. ${item.persona}</div>
                    <div style="font-size: 0.9rem; color: #666; margin-top: 5px;">
                        <i class="far fa-clock"></i> ${item.timestamp}
                    </div>
                </div>
                <div class="equipo-resultado">
                    ${getBandera(item.equipo)} ${item.equipo}
                </div>
            `;
            elementos.listaResultados.appendChild(div);
        });
        
        // Scroll al inicio
        elementos.listaResultados.scrollTop = 0;
    }
    
    function reiniciarTodo() {
        if (sorteoEnProgreso) {
            alert('¡Espera a que termine el sorteo actual!');
            return;
        }
        
        if (resultados.length === 0) {
            playSonidoError();
            return;
        }
        
        if (!confirm('¿Estás seguro de reiniciar todo?\n\nSe perderán todos los resultados actuales.')) {
            return;
        }
        
        // Resetear datos
        equiposDisponibles = [...equipos];
        personasDisponibles = [...personas];
        resultados = [];
        
        // Resetear UI
        elementos.tarjetaPersona.querySelector('.nombre-grande').textContent = '¿QUIÉN SERÁ?';
        elementos.tarjetaPersona.querySelector('.emoji').textContent = '😱';
        elementos.tarjetaEquipo.querySelector('.equipo-grande').textContent = '¿QUÉ EQUIPO?';
        elementos.tarjetaEquipo.querySelector('.bandera').textContent = '🏴‍☠️';
        elementos.contador.textContent = '3';
        
        // Limpiar clases activas
        elementos.drama1.classList.remove('activo');
        elementos.drama2.classList.remove('activo');
        elementos.drama3.classList.remove('activo');
        
        // Actualizar todo
        mostrarEquipos();
        mostrarPersonas();
        actualizarResultados();
        actualizarContadores();
        
        // Sonido de reinicio
        playBeep(659.25, 0.2);
        
        console.log('🔄 Todo reiniciado');
    }
    
    // ================= INICIAR APLICACIÓN =================
    inicializar();
});
