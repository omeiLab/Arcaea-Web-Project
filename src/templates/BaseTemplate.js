export class BaseTemplate {
    /**
     * Grid Item
     */
    songCard(song, styles) {
        const { difficultyClass } = styles;
        return `
            <div class="song-card">
                <img src="${song.image}" alt="${song.title}" loading="lazy">
                <label class="${difficultyClass}">${song.difficulty} ${song.level}</label>
            </div>
        `;
    }

    /**
     * Modal
     */
    songModal(song, styles) {
        const { difficultyClass } = styles;
        return `
            <img src="${song.image}" alt="${song.title}" loading="lazy">
            <h3 class="default-title">${song.title}</h3>
            <p>${song.artist}</p>
            <label class="${difficultyClass}">${song.difficulty} ${song.level}</label>
        `;
    }

    /**
     * Random Grid Item
     */
    randomGridItem(song) {
        return `
            <div class="random-modal-song-item" data-id="${song.title}">
                <img src="${song.image}" alt="${song.title}" loading="lazy">
                <h3 class="${song.difficulty.toLowerCase()}">${song.difficulty} ${song.level}</h3>
            </div>
        `;
    }
}