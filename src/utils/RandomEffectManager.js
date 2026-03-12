export class RandomEffectManager {
    /**
     * @param {Object} manager SongManager
     * @param {Object} template Template
     */
    constructor(manager, template) {
        this.manager = manager;
        this.template = template;
        this.animationTimer = null;
    }

    /**
     * Pick-1 randomization with animation
     * @param {HTMLElement} container Container for displaying the result
     * @param {Function} onComplete Function call at the end of the animation
     */
    rollSingle(container, onComplete) {
        // Animations: per 80 ms
        this.animationTimer = setInterval(() => {
            const [randomSong] = this.manager.getRandomSongs(1);
            const styles = this.manager.adapter.getStyles(randomSong);
            container.innerHTML = this.template.songModal(randomSong, styles);
        }, 80);

        // Show result after 2 sec
        setTimeout(() => {
            clearInterval(this.animationTimer);
            const [finalSong] = this.manager.getRandomSongs(1);
            const styles = this.manager.adapter.getStyles(finalSong);
            container.innerHTML = this.template.songModal(finalSong, styles);
            if (onComplete) onComplete(finalSong);
        }, 2000);
    }

    /**
     * Pick-4 randomization with animation
     * @param {HTMLElement} container Container for displaying the result
     * @param {Function} onComplete Function call at the end of the animation
     */
    rollMultiple(container, onComplete) {
        this.animationTimer = setInterval(() => {
            const songs = this.manager.getRandomSongs(4);
            container.innerHTML = `
                <div class="random-modal-song-grid">
                    ${songs.map(s => this.template.randomGridItem(s)).join('')}
                </div>
            `;
        }, 80);

        setTimeout(() => {
            clearInterval(this.animationTimer);
            const finalSongs = this.manager.getRandomSongs(4);
            container.innerHTML = `
                <div class="random-modal-song-grid">
                    ${finalSongs.map(s => this.template.randomGridItem(s)).join('')}
                </div>
            `;
            if (onComplete) onComplete(finalSongs);
        }, 2000);
    }
}