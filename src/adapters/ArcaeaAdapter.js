import { BaseAdapter } from './BaseAdapter.js';

export class ArcaeaAdapter extends BaseAdapter {

    // Override: the '+' should add 0.7 to constant
    parseLevel(level) {
        if (typeof level === 'string' && level.includes("+")) {
            return parseInt(level) + 0.7;
        }
        return super.parseLevel(level); 
    }

    // Override: add difficulty and pack filter
    match(song, criteria) {
        const baseMatch = super.match(song, criteria);
        const { difficulty, pack } = criteria;

        const matchDifficulty = difficulty === "all" || 
                                song.difficulty.toLowerCase() === difficulty.toLowerCase();
        const matchPack = pack === "all" || 
                          song.pack.toLowerCase().includes(pack.toLowerCase());

        return baseMatch && matchDifficulty && matchPack;
    }

    // Override: add unlock type
    getStyles(song) {
        const baseStyles = super.getStyles(song);
        let unlockType = 'none';

        if (song.unlock.includes("World Mode")) unlockType = 'lock';
        else if (song.unlock.includes("[Special]") || song.unlock.includes("[Anomaly]")) {
            unlockType = 'diamond';
        }

        return {
            ...baseStyles,
            unlockType
        };
    }
}