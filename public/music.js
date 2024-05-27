document.addEventListener('DOMContentLoaded', () => {
    const musicList = document.getElementById('musicList');

    // Function to fetch uploaded music from the server
    const fetchMusic = () => {
        fetch('/music')
            .then(response => response.json())
            .then(data => {
                musicList.innerHTML = '';
                data.forEach(music => {
                    const li = document.createElement('li');
                    li.textContent = `${music.title} by ${music.artist}`;
                    
                    const audio = document.createElement('audio');
                    audio.controls = true;
                    audio.src = `/uploads/${music.filename}`;
                    li.appendChild(audio);

                    musicList.appendChild(li);
                });
            })
            .catch(error => console.error('Error fetching music:', error));
    };

    // Fetch uploaded music when the page loads
    fetchMusic();
});
