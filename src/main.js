import { SongManager } from './SongManager.js';
import { ArcaeaAdapter } from './adapters/ArcaeaAdapter.js';
import { ArcaeaTemplate } from './templates/ArcaeaTemplate.js';
import { UIManager } from './UIManager.js';

/**
 * main entry
 */
async function bootstrap() {
    try {
        // Arcaea adapter & template
        const adapter = new ArcaeaAdapter();
        const template = new ArcaeaTemplate();

        // Initialize song manager
        const manager = new SongManager(adapter);

        // Initialize UI manager
        const ui = new UIManager(manager, template);

        // fetch data
        await manager.fetchSongs('data/song_list.json');

        // render UI
        ui.init();

        console.log("Successfully initialized Song Grid for Arcaea.");
    } catch (error) {
        console.error("Critical Error during bootstrap:", error);
    }
}

// start
bootstrap();