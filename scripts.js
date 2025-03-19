document.addEventListener('DOMContentLoaded', function() {
    const songs = [
        { filename: "track1.mp3", displayName: "Sælskapssyke Banditta Feat. MC Frokost - Alt Eller Ingenting" },
        { filename: "track2.mp3", displayName: "Sælskapssyke Banditta - Væstkyst MC" },
        { filename: "track3.mp3", displayName: "Sælskapssyke Banditta - Rar Kåtsekk" },
        { filename: "track4.mp3", displayName: "Sælskapssyke Banditta - Kor Vi Kommer Fra" },
        { filename: "track5.mp3", displayName: "Sælskapssyke Banditta - Bandittan" },
        { filename: "track6.mp3", displayName: "Sælskapssyke Banditta - 6512" },
        { filename: "track7.mp3", displayName: "Balliztic Feat Zubztance Og Gitarduden - Rennesteinspoesi" },
        { filename: "track8.mp3", displayName: "Balliztic Feat MC Frokost - Ligg Lavt I Terrenget" }
    ];

    const playlist = document.getElementById('playlist');
    const player = document.getElementById('audio-player');
    const contextMenu = document.createElement('div');
    contextMenu.className = 'context-menu';
    document.body.appendChild(contextMenu);

    async function playSong(song) {
        try {
            player.src = `mp3/${song}`;
            const playPromise = player.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('Playback error:', error);
                    // Hvis feilen er relatert til autoplay, prøv igjen ved neste brukerinteraksjon
                    if (error.name === 'NotAllowedError') {
                        const playButton = document.createElement('button');
                        playButton.textContent = 'Klikk for å spille av';
                        playButton.style.position = 'fixed';
                        playButton.style.top = '10px';
                        playButton.style.right = '10px';
                        playButton.style.zIndex = '1000';
                        playButton.onclick = () => {
                            player.play();
                            document.body.removeChild(playButton);
                        };
                        document.body.appendChild(playButton);
                    }
                });
            }
        } catch (error) {
            console.error('Error playing song:', error);
        }
    }

    songs.forEach((song, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = song.displayName;
        listItem.dataset.index = index;
        playlist.appendChild(listItem);

        listItem.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            showContextMenu(e, song.filename);
        });
    });

    document.addEventListener('click', function() {
        hideContextMenu();
    });

    playlist.addEventListener('click', function(e) {
        if (e.target && e.target.nodeName === "LI") {
            const selectedSong = e.target;
            const songIndex = selectedSong.dataset.index;
            const song = songs[songIndex].filename;

            playSong(song);

            document.querySelectorAll('#playlist li').forEach(item => item.classList.remove('active'));
            selectedSong.classList.add('active');
        }
    });

    player.addEventListener('ended', function() {
        let currentIndex = parseInt(document.querySelector('#playlist li.active').dataset.index);
        let nextIndex = (currentIndex + 1) % songs.length;
        const nextSong = songs[nextIndex].filename;

        playSong(nextSong);

        document.querySelectorAll('#playlist li').forEach(item => item.classList.remove('active'));
        document.querySelector(`#playlist li[data-index="${nextIndex}"]`).classList.add('active');
    });

    function showContextMenu(event, filename) {
        contextMenu.innerHTML = `<a href="mp3/${filename}" download="${filename}">Download</a>`;
        contextMenu.style.top = `${event.clientY}px`;
        contextMenu.style.left = `${event.clientX}px`;
        contextMenu.style.display = 'block';
    }

    function hideContextMenu() {
        contextMenu.style.display = 'none';
    }

    // Last inn første sang som kilde, men ikke start avspilling
    if (playlist.querySelector('li')) {
        const firstSong = songs[0].filename;
        player.src = `mp3/${firstSong}`;
    }

    // Legg til en global klikk-handler for å aktivere lyd
    document.addEventListener('click', function initAudio() {
        player.play().then(() => {
            player.pause(); // Pause umiddelbart
            document.removeEventListener('click', initAudio);
        }).catch(() => {
            // Ignorer feil her, vi prøver bare å initialisere lyden
        });
    }, { once: true });
});
