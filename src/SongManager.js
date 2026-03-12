export class SongManager {
    constructor(adapter) {
        this.adapter = adapter;
        this.allSongs = [];
        this.filteredSongs = [];
    }

    /**
     * Read song data from a JSON file and store it in the manager
     * @param {string} filePath default: 'data/song_list.json'
     */
    async fetchSongs(filePath = 'data/song_list.json') {
        try {
            const response = await fetch(filePath);
            
            if (!response.ok) {
                throw new Error(`Unable to fetch songs data. Status code: ${response.status}`);
            }

            // Original array with all songs from the JSON file
            this.allSongs = await response.json();
            
            // Initialize filteredSongs as a copy of allSongs
            this.filteredSongs = [...this.allSongs];
            
            return this.allSongs;
        } catch (error) {
            console.error("Fail to fetch songs data.", error);
            return [];
        }
    }

    /**
     * Filter Logic
     * @param {Object} criteria Filter criteria (query, difficulty, pack, etc.)
     */
    applyFilters(criteria) {
        this.filteredSongs = this.allSongs.filter(song => {
            return this.adapter.match(song, criteria);
        });
        return this.filteredSongs;
    }

    /**
     * Pagination Logic
     * @param {number} page Current page number
     * @param {number} itemsPerPage #Songs per page
     */
    getPage(page, itemsPerPage) {
        const start = (page - 1) * itemsPerPage;
        return this.filteredSongs.slice(start, start + itemsPerPage);
    }

    /**
     * Randomize Songs Chosen
     * @param {number} count #Song to pick randomly (default: 1)
     */
    getRandomSongs(count = 1) {
        if (this.filteredSongs.length === 0) return [];
        
        // Simple Fisher-Yates
        const shuffled = [...this.filteredSongs].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    /**
     * Calculate total pages based on current filtered songs and items per page
     */
    getTotalPages(itemsPerPage) {
        return Math.ceil(this.filteredSongs.length / itemsPerPage);
    }
}