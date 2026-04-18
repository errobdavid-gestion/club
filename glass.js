document.addEventListener('DOMContentLoaded', function() {
// ---------- RADIO -------------
    let manuallyDisconnected = false;
    let hasError = false;
    let audio = document.getElementById('audio');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const status = document.getElementById('status');
    const streamUrl = audio.src;

    let isConnected = false;

    function updateStatus(msg) {
      status.textContent = msg;
    }

    function createAudioElement() {
        const newAudio = document.createElement('audio');
        newAudio.id = 'audio';
        newAudio.src = streamUrl;
        newAudio.preload = 'none';
        newAudio.volume = volumeSlider.value;

        // Eventos
        newAudio.addEventListener('playing', () => updateStatus('Reproduciendo...'));
        newAudio.addEventListener('pause', () => {
                if (!manuallyDisconnected && !hasError) {
                    updateStatus('Desconectado');
                }
            });
        newAudio.addEventListener('waiting', () => updateStatus('Cargando...'));
        newAudio.addEventListener('error', () => {
        if (!manuallyDisconnected) {
                hasError = true;
                updateStatus('No hay señal de audio.');
            }
        });
        newAudio.addEventListener('ended', () => {
            isConnected = false;
            playPauseBtn.innerHTML = '&#9654;';
            playPauseBtn.title = 'Conectar';
            updateStatus('Finalizado');
        });

        audio.parentNode.replaceChild(newAudio, audio);
        audio = newAudio;
    }

    playPauseBtn.addEventListener('click', function () {
        if (!isConnected) {
        manuallyDisconnected = false;
        hasError = false;

        playPauseBtn.disabled = true;
        updateStatus('Conectando...');

        createAudioElement(); // Nueva conexión

        audio.play().then(() => {
            isConnected = true;
            playPauseBtn.innerHTML = '&#9632;'; // Icono para desconectar
            playPauseBtn.title = 'Desconectar';
            updateStatus('Reproduciendo...');
        }).catch(() => {
            updateStatus('No hay señal de audio.');
        }).finally(() => {
            playPauseBtn.disabled = false;
        });
        } else {
            manuallyDisconnected = true; // Marcar desconexión voluntaria
            audio.pause();
            audio.src = ""; // Detener totalmente
            isConnected = false;
            playPauseBtn.innerHTML = '&#9654;';
            playPauseBtn.title = 'Conectar';
            updateStatus('Desconectado');
            playPauseBtn.disabled = false; // Asegura reactivación si alguien se desconecta muy rápido
        }
    });
    

})