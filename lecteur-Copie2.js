// Initialiser Plyr
const audio = document.getElementById('audioPlayer');

const player = new Plyr(audio, {
  controls: [
    'play', 'progress', 'current-time', 'duration',
    'mute', 'volume', 'settings'
  ],
  settings: ['speed'],                 // affiche le menu vitesse
  speed: {
    selected: 1,                       // démarrer en Normal
    options: [0.9, 0.95, 1, 1.05, 1.1] // tes 5 vitesses seulement
  },
  i18n: {
    speed: 'Vitesse',                  // libellé du menu
    normal: 'Normal'                   // libellé de l’option 1x
  },
  // (optionnel) éviter que d’anciennes préférences réapparaissent
  storage: { enabled: false }
});


// ==============================
// Gestion de la playlist
// ==============================
const links = document.querySelectorAll('#playlist a');
let currentIndex = 0;

// Charger et jouer une piste donnée
function playTrack(index) {
  if (index < 0 || index >= links.length) return;

  // Retirer l'état actif sur toutes
  links.forEach(a => {
    a.classList.remove('active');
    a.removeAttribute('aria-current');
  });

  // Marquer la piste active
  const link = links[index];
  link.classList.add('active');
  link.setAttribute('aria-current', 'true');

  // Charger la source dans Plyr
  player.source = {
    type: 'audio',
    sources: [{ src: link.getAttribute('href'), type: 'audio/mp3' }]
  };

  currentIndex = index;
  player.play();
}

// Clic utilisateur sur la playlist
links.forEach((link, index) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    playTrack(index);
  });
});

// Charger la première piste par défaut
if (links.length > 0) {
  playTrack(0);
}

// Enchaînement automatique à la fin d'une piste
player.on('ended', () => {
  if (currentIndex + 1 < links.length) {
    playTrack(currentIndex + 1);
  }
});

// ==============================
// Afficher la durée de chaque piste
// ==============================
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

links.forEach(link => {
  const audioTemp = document.createElement('audio');
  audioTemp.src = link.getAttribute('href');
  audioTemp.addEventListener('loadedmetadata', () => {
    const duration = formatTime(audioTemp.duration);
    const span = document.createElement('span');
    span.textContent = ` (${duration})`;
    span.style.fontSize = "0.9em";
    span.style.color = "#555";
    link.parentNode.appendChild(span);
  });
});

// ==============================
// GROS BOUTON PLAY PERSONNALISÉ
// ==============================
const bigPlayBtn = document.getElementById('bigPlayBtn');

bigPlayBtn.addEventListener('click', () => {
  if (player.playing) {
    player.pause();
    bigPlayBtn.textContent = '▶'; // Play
  } else {
    player.play();
    bigPlayBtn.textContent = '❚❚'; // Pause
  }
});

player.on('play', () => {
  bigPlayBtn.textContent = '❚❚';
});
player.on('pause', () => {
  bigPlayBtn.textContent = '▶';
});
