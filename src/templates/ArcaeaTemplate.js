import { BaseTemplate } from './BaseTemplate.js';

const ASSET_BASE = "https://cdn.jsdelivr.net/gh/omeiLab/Song-Assets/Arcaea/";

function getImageUrl(jsonImagePath) {
    // images/abc.jpg --> abc.jpg
    jsonImagePath = jsonImagePath.split('/').pop();
    return encodeURI(`${ASSET_BASE}${jsonImagePath}`);
}

export class ArcaeaTemplate extends BaseTemplate {
    /**
     * Override: add unlock icon
     */
    songCard(song, styles) {
        const { difficultyClass, unlockType } = styles;
        let lockIconHtml = '';

        if (unlockType === 'special') {
            lockIconHtml = `<div class="lock-icon"><i class="fa-solid fa-diamond"></i></div>`;
        } else if (unlockType === 'world') {
            lockIconHtml = `<div class="lock-icon"><i class="fas fa-lock"></i></div>`;
        }

        return `
            <div class="song-card">
                <img src="${getImageUrl(song.image)}" alt="${song.title}" loading="lazy">
                ${lockIconHtml}
                <label class="${difficultyClass}">${song.difficulty} ${song.level}</label>
            </div>
        `;
    }

    /**
     * Override: add pack, BPM, side, chart designer, unlock condition
     */
    songModal(song, styles) {
        const { sideClass, difficultyClass } = styles;
        return `
            <img src="${getImageUrl(song.image)}" alt="${song.title}" loading="lazy">
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

    /**
     * Random Grid Item
     */
    randomGridItem(song) {
        return `
            <div class="random-modal-song-item" data-id="${song.title}">
                <img src="${getImageUrl(song.image)}" alt="${song.title}" loading="lazy">
                <h3 class="${song.difficulty.toLowerCase()}">${song.difficulty} ${song.level}</h3>
            </div>
        `;
    }
}