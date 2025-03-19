document.addEventListener('DOMContentLoaded', function() {
    const songs = [
        { filename: "Sælskapssyke Banditta Feat. MC Frokost - Alt Eller Ingenting.mp3", displayName: "Sælskapssyke Banditta Feat. MC Frokost - Alt Eller Ingenting" },
        { filename: "Sælskapssyke Banditta - Væstkyst MC.mp3", displayName: "Sælskapssyke Banditta - Væstkyst MC" },
        { filename: "Sælskapssyke Banditta - Rar Kåtsekk.mp3", displayName: "Sælskapssyke Banditta - Rar Kåtsekk" },
        { filename: "Sælskapssyke Banditta - Kor Vi Kommer Fra.mp3", displayName: "Sælskapssyke Banditta - Kor Vi Kommer Fra" },
        { filename: "Sælskapssyke Banditta - Bandittan.mp3", displayName: "Sælskapssyke Banditta - Bandittan" },
        { filename: "Sælskapssyke Banditta - 6512.mp3", displayName: "Sælskapssyke Banditta - 6512" },
        { filename: "Balliztic Feat Zubztance Og Gitarduden - Rennesteinspoesi.mp3", displayName: "Balliztic Feat Zubztance Og Gitarduden - Rennesteinspoesi" },
        { filename: "Balliztic Feat MC Frokost - Ligg Lavt I Terrenget.mp3", displayName: "Balliztic Feat MC Frokost - Ligg Lavt I Terrenget" }
    ];

    const playlist = document.getElementById('playlist');
    const player = document.getElementById('audio-player');
    const contextMenu = document.createElement('div');
    contextMenu.className = 'context-menu';
    document.body.appendChild(contextMenu);

    function playSong(song) {
        player.src = `mp3/${song}`;
        player.play();
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

    if (playlist.querySelector('li')) {
        const firstSong = songs[0].filename;
        player.src = `mp3/${firstSong}`;
    }
});
