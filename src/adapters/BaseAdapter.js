export class BaseAdapter {
    constructor() {
        if (this.constructor === BaseAdapter) {
            throw new Error("BaseAdapter is an abstract class and cannot be instantiated directly.");
        }
    }

    // Default: string to number
    parseLevel(level) {
        return Number(level) || 0;
    }

    // Default: general matchings
    match(item, criteria) {
        const { query = "", minLevel = 0, maxLevel = 99 } = criteria;
        const itemLevel = this.parseLevel(item.level);
        
        const matchQuery = query === "" || 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.artist?.toLowerCase().includes(query.toLowerCase());
        const matchLevel = itemLevel >= this.parseLevel(minLevel) && 
                           itemLevel <= this.parseLevel(maxLevel);

        return matchQuery && matchLevel;
    }

    // Default: no styles
    getStyles(item) {
        return {
            difficultyClass: item.difficulty?.toLowerCase() || 'default',
            sideClass: item.side?.toLowerCase() || 'none'
        };
    }
}