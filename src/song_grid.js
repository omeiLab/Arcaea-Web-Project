fetch('data/song_list.json') 
    .then(response => response.json())
    .then(songs => {
        const songList = document.querySelector('.song-grid');
        const modal = document.getElementById('song-modal');
        const modalContent = modal.querySelector('.modal-content');
        const packFilter = document.getElementById('song-pack-filter');
        const nameFilter = document.getElementById('search'); 
        const difficultyFilter = document.getElementById('difficulty-filter'); 
        const minLevelFilter = document.getElementById('min-level');
        const maxLevelFilter = document.getElementById('max-level');

        let allSongs = songs; // save all songs in a variable
        let currentPage = 1;
        const rowsPerPage = 3; // number of songs to display per page   

        function generateModal(song, sideClass, difficultyClass) {
            return `
                <img src="${song.image}" alt="${song.title}" loading="lazy">
                <p>${song.pack}</p>
                <h3 class="${sideClass}">${song.title}</h3>
                <p>${song.artist}</p>
                <label class="${difficultyClass}">${song.difficulty} ${song.constant}</label>
                <p>BPM: ${song.bpm}</p>
                <p>Side: ${song.side}</p>
                <p>Chart Designer: ${song.chart_designer}</p>
                <p>Unlock Condition: ${song.unlock}</p>
            `;
        }

        // Random Skeleton
        function generateRandomSkeleton() {
            return `
                <div class="img-skeleton"></div>
                <p>???</p>
                <h3>Randomizing…</h3>
                <p>---</p>
            `;
        }

        // Function to get number of items per row
        function getItemsPerRow() {
            const firstRowTop = songList.children[0]?.offsetTop;
            let count = 0;

            for (let card of songList.children) {
                if (card.offsetTop !== firstRowTop) break;
                count++;
            }
            return count || 1;
        }

        // Function to render pagination
        function renderPagination(totalSongs, songsPerPage) {
            const pagination = document.getElementById("pagination");
            pagination.innerHTML = "";

            const totalPages = Math.ceil(totalSongs / songsPerPage);
            if (totalPages <= 1) return;

            const createButton = (label, page, disabled = false, active = false) => {
                const btn = document.createElement("button");
                btn.textContent = label;
                if (active) btn.classList.add("active");
                if (disabled) btn.disabled = true;
                btn.onclick = () => {
                    currentPage = page;
                    displaySongsPage(filteredSongs, currentPage);
                };
                return btn;
            };

            // Prev
            pagination.appendChild(
                createButton("«", currentPage - 1, currentPage === 1)
            );

            const pages = [];

            if (totalPages <= 7) {
                // 少頁數：全顯示
                for (let i = 1; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);

                if (currentPage > 4) pages.push("…");

                const start = Math.max(2, currentPage - 2);
                const end = Math.min(totalPages - 1, currentPage + 2);

                for (let i = start; i <= end; i++) {
                    pages.push(i);
                }

                if (currentPage < totalPages - 3) pages.push("…");

                pages.push(totalPages);
            }

            pages.forEach(p => {
                if (p === "…") {
                    const span = document.createElement("span");
                    span.textContent = "…";
                    span.style.padding = "6px 4px";
                    span.style.color = "#888";
                    pagination.appendChild(span);
                } else {
                    pagination.appendChild(
                        createButton(p, p, false, p === currentPage)
                    );
                }
            });

            // Next
            pagination.appendChild(
                createButton("»", currentPage + 1, currentPage === totalPages)
            );
        }

        // Function to display songs in the grid
        function displaySongsPage(songs, page = 1) {
            songList.innerHTML = "";

            // render for counting 
            songs.slice(0, 20).forEach(song => {
                const card = document.createElement("div");
                card.className = "song-card";
                card.innerHTML = `<img src="${song.image}" loading="lazy">`;
                songList.appendChild(card);
            });

            const itemsPerRow = getItemsPerRow();
            const itemsPerPage = itemsPerRow * rowsPerPage;

            songList.innerHTML = ""; // clear previous contnet

            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const pageSongs = songs.slice(start, end);

            pageSongs.forEach(song => {
                const difficultyClass = song.difficulty.toLowerCase();
                const sideClass = song.side.toLowerCase();

                let lockIcon = '';
                if(song.unlock.includes("[Special]") || song.unlock.includes("[Anomaly]")) {
                    lockIcon = `<div class="lock-icon">
                        <i class="fa-solid fa-diamond" title="The song has some special unlock condition."></i>
                    </div>`;
                } else if(song.unlock.includes("World Mode")) {
                    lockIcon = `<div class="lock-icon">
                        <i class="fas fa-lock" title="The song can be unlocked in world mode."></i>
                    </div>`;
                }

                // Create a card for each song
                const card = document.createElement('div');
                card.classList.add('song-card');
                card.innerHTML = `
                    <img src="${song.image}" alt="${song.title}" loading="lazy">
                    ${lockIcon}
                    <label class="${difficultyClass}">${song.difficulty} ${song.level}</label>
                `;

                // Click event listener for each card to display the song details in the modal
                card.addEventListener('click', () => {
                    modalContent.innerHTML = generateModal(song, sideClass, difficultyClass);

                    modal.classList.remove('hidden');
                    modal.classList.add('show');
                });

                songList.appendChild(card);
            });

            // Pagination
            renderPagination(songs.length, itemsPerPage);
        }

        // Load all songs initially
        displaySongsPage(allSongs, currentPage);

        // Parse "+" to 0.7 in level, 9+ → 9.7
        function parseLevel(level) {
            if (level.includes("+")) {
                return parseInt(level) + 0.7; 
            }
            return parseInt(level); 
        }

        // Function to filter and display songs
        let filteredSongs = allSongs
        function applyFilters() {
            filteredSongs = allSongs.filter(song => {
                const selectedDifficulty = difficultyFilter.value.toLowerCase();
                const selectedPack = packFilter.value.toLowerCase();
                const searchQuery = nameFilter.value.trim().toLowerCase();
                const selectedMinLevel = parseLevel(minLevelFilter.value); 
                const selectedMaxLevel = parseLevel(maxLevelFilter.value);
                return (
                    (selectedDifficulty === "all" || song.difficulty.toLowerCase() === selectedDifficulty) &&
                    (selectedPack === "all" || song.pack.toLowerCase().includes(selectedPack)) &&
                    (searchQuery === "" || song.title.toLowerCase().includes(searchQuery)) &&
                    (parseLevel(song.level) >= selectedMinLevel) &&
                    (parseLevel(song.level) <= selectedMaxLevel)
                );
            });

            currentPage = 1;
            displaySongsPage(filteredSongs, currentPage);
        }

        // Attach event listeners to filters
        difficultyFilter.addEventListener('change', applyFilters);
        packFilter.addEventListener('change', applyFilters);
        minLevelFilter.addEventListener('input', applyFilters);
        maxLevelFilter.addEventListener('input', applyFilters);
        nameFilter.addEventListener('input', applyFilters);

        document.getElementById("resetFilters").addEventListener("click", () => {
            document.getElementById("search").value = "";
            document.getElementById("difficulty-filter").value = "all";
            document.getElementById("min-level").value = "1";
            document.getElementById("max-level").value = "12";
            document.getElementById("song-pack-filter").value = "all";
            currentPage = 1;
            filteredSongs = allSongs;
            displaySongsPage(filteredSongs, currentPage);
        });

        // Close modal when clicked outside
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.add('hidden');
            }
        });

        const randomModal = document.getElementById("random-multiple-modal");

        randomModal.addEventListener('click', (event) => {
            if (event.target === randomModal) {
                randomModal.classList.add('hidden');
                randomModal.classList.remove('show'); // Ensure 'show' class is also removed
            }
        });

        // Random Button
        document.getElementById("random-button").addEventListener("click", function() {
            if(filteredSongs.length === 0){
                alert("No songs found.");
                return;
            }
            modal.classList.remove('hidden');
            modal.classList.add('show');
            const modalContent = modal.querySelector('.modal-content');

            const animationInterval = setInterval(() => {
                const randomIndex = Math.floor(Math.random() * filteredSongs.length);
                const sideClass = filteredSongs[randomIndex].side.toLowerCase();
                const difficultyClass = filteredSongs[randomIndex].difficulty.toLowerCase();
                modalContent.innerHTML = generateModal(filteredSongs[randomIndex], sideClass, difficultyClass);
            }, 100);

            setTimeout(() => {
                clearInterval(animationInterval);
                const finalSong = filteredSongs[Math.floor(Math.random() * filteredSongs.length)];
                const sideClass = finalSong.side.toLowerCase();
                const difficultyClass = finalSong.difficulty.toLowerCase();
                modalContent.innerHTML = generateModal(finalSong, sideClass, difficultyClass);
    
                modalContent.innerHTML += `<button id="pick-again-button">Pick Again</button>`;
                document.getElementById("pick-again-button").addEventListener("click", function() {
                    document.getElementById("random-button").click();
                });
            }, 2000);
        });

        // Random button multiple
        function generateFourSongGrid(songs) {
            return `
                <div class="random-modal-song-grid">
                    ${songs.map(song => `
                        <div class="random-modal-song-item"
                            data-title="${song.title}"
                            data-image="${song.image}"
                            data-difficulty="${song.difficulty}"
                            data-constant="${song.constant}"
                            data-pack="${song.pack}"
                            data-artist="${song.artist}"
                            data-bpm="${song.bpm}"
                            data-side="${song.side}"
                            data-chart-designer="${song.chart_designer}"
                            data-unlock="${song.unlock}"
                        >
                            <img src="${song.image}" alt="${song.title} loading="lazy"">
                            <h3 class="${song.difficulty.toLowerCase()}">${song.difficulty} ${song.constant}</h3>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        document.getElementById("random-button-multiple").addEventListener("click", function () {
            if(filteredSongs.length === 0){
                alert("No songs found.");
                return;
            }

            const randomModal = document.getElementById("random-multiple-modal");
            randomModal.classList.remove("hidden");
            randomModal.classList.add("show");

            const modalContent = randomModal.querySelector(".random-modal-content");

            let animationInterval = setInterval(() => {
                let selectedSongs = [];
                for (let i = 0; i < 4; i++) {
                    let randomIndex = Math.floor(Math.random() * filteredSongs.length);
                    selectedSongs.push(filteredSongs[randomIndex]);
                }
                let tempDiv = document.createElement("div");
                tempDiv.innerHTML = generateFourSongGrid(selectedSongs);
                modalContent.replaceChildren(...tempDiv.children);
            }, 100);

            setTimeout(() => {
                clearInterval(animationInterval);
                let finalSongs = [];
                for (let i = 0; i < 4; i++) {
                    let randomIndex = Math.floor(Math.random() * filteredSongs.length);
                    finalSongs.push(filteredSongs[randomIndex]);
                }

                modalContent.innerHTML = generateFourSongGrid(finalSongs);
                let pickAgainButton = document.createElement("button");
                pickAgainButton.id = "pick-again-button-multiple";
                pickAgainButton.textContent = "Pick Again";
                modalContent.appendChild(pickAgainButton);

                document.getElementById("pick-again-button-multiple").addEventListener("click", function () {
                    document.getElementById("random-button-multiple").click();
                });
            }, 2000);
        });

        document.addEventListener("click", function (event) {
            if (event.target.closest(".random-modal-song-item")) {
                const songItem = event.target.closest(".random-modal-song-item");
                const songTitle = songItem.dataset.title;
                const songImage = songItem.dataset.image;
                const songDifficulty = songItem.dataset.difficulty;
                const songConstant = songItem.dataset.constant;
                const songPack = songItem.dataset.pack;
                const songArtist = songItem.dataset.artist;
                const songBPM = songItem.dataset.bpm;
                const songSide = songItem.dataset.side;
                const songChartDesigner = songItem.dataset.chartDesigner;
                const songUnlock = songItem.dataset.unlock;

                const difficultyClass = songDifficulty.toLowerCase();
                const sideClass = songSide.toLowerCase();

                const song = {
                    title: songTitle,
                    image: songImage,
                    difficulty: songDifficulty,
                    constant: songConstant,
                    pack: songPack,
                    artist: songArtist,
                    bpm: songBPM,
                    side: songSide,
                    chart_designer: songChartDesigner,
                    unlock: songUnlock
                };

                modalContent.innerHTML = generateModal(song, sideClass, difficultyClass);
                modal.classList.remove("hidden");
                modal.classList.add("show");
            }
        });

        // resize
        let resizeTimer;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                displaySongsPage(filteredSongs, currentPage);
            }, 150);
        });

    })
    .catch(error => console.error('Error loading songs:', error));
