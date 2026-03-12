import { RandomEffectManager } from "./utils/RandomEffectManager.js";

export class UIManager {
    constructor(manager, template) {
        this.manager = manager;     // SongManager
        this.template = template;   // Template
        
        // status
        this.currentPage = 1;
        this.rowsPerPage = 3;
        
        // DOM snapshot
        this.songList = document.querySelector('.song-grid');
        this.modal = document.getElementById('song-modal');
        this.pagination = document.getElementById('pagination');
        this.filters = {
            search: document.getElementById('search'),
            pack: document.getElementById('song-pack-filter'),
            difficulty: document.getElementById('difficulty-filter'),
            minLevel: document.getElementById('min-level'),
            maxLevel: document.getElementById('max-level')
        };
        
        // randomized animation
        this.randomEffect = new RandomEffectManager(this.manager, this.template);
    }

    /**
     * Initialize: bind events and render initial view
     */
    init() {
        this.bindEvents();
        this.render();
    }

    /**
     * Bind all DOM events
     */
    bindEvents() {
        // Filter
        Object.values(this.filters).forEach(el => {
            const eventType = el.tagName === 'SELECT' ? 'change' : 'input';
            el.addEventListener(eventType, () => this.handleFilterChange());
        });

        // Reset Filters
        document.getElementById("resetFilters").addEventListener("click", () => this.resetFilters());

        // Model Hidden
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.modal.classList.add('hidden');
        });

        // Debounced
        let resizeTimer;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => this.render(), 150);
        });

        // Random Buttons
        document.getElementById("random-button").addEventListener("click", () => {
            const modalContent = this.modal.querySelector('.modal-content');
            this.modal.classList.remove('hidden');
            this.modal.classList.add('show');
            
            this.randomEffect.rollSingle(modalContent, (finalSong) => {
                this.appendPickAgainButton(modalContent, "random-button");
            });
        });
    }

    /**
     * Filter change event handler
     */
    handleFilterChange() {
        const criteria = {
            query: this.filters.search.value.trim(),
            pack: this.filters.pack.value,
            difficulty: this.filters.difficulty.value,
            minLevel: this.filters.minLevel.value,
            maxLevel: this.filters.maxLevel.value
        };
        this.manager.applyFilters(criteria);
        this.currentPage = 1;
        this.render();
    }

    /**
     * Render the song grid and pagination based on the current page and filtered songs
     */
    render() {
        const itemsPerRow = this.getItemsPerRow();
        const itemsPerPage = itemsPerRow * this.rowsPerPage;
        
        const pageSongs = this.manager.getPage(this.currentPage, itemsPerPage);
        this.renderGrid(pageSongs);
        this.renderPagination(this.manager.getTotalPages(itemsPerPage));
    }

    /**
     * Render the song grid
     */
    renderGrid(songs) {
        this.songList.innerHTML = "";
        songs.forEach(song => {
            const styles = this.manager.adapter.getStyles(song);
            const cardHtml = this.template.songCard(song, styles);
            
            const cardElement = document.createElement('div');
            cardElement.innerHTML = cardHtml.trim();
            const el = cardElement.firstChild;
            
            el.addEventListener('click', () => this.showModal(song));
            this.songList.appendChild(el);
        });
    }

    /**
     * Show Modal
     */
    showModal(song) {
        const styles = this.manager.adapter.getStyles(song);
        const modalContent = this.modal.querySelector('.modal-content');
        modalContent.innerHTML = this.template.songModal(song, styles);
        this.modal.classList.remove('hidden');
        this.modal.classList.add('show');
    }

    /**
     * Detect #objects of each row
     */
    getItemsPerRow() {
        if (this.songList.children.length === 0) {
            this.songList.innerHTML = '<div class="song-card"></div>';
        }
        const firstRowTop = this.songList.children[0]?.offsetTop;
        let count = 0;
        for (let card of this.songList.children) {
            if (card.offsetTop !== firstRowTop) break;
            count++;
        }
        return count || 1;
    }

    /**
     * Helper: calculate pages
     */
    calculatePageNumbers(totalPages) {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (this.currentPage > 4) pages.push("…");
            const start = Math.max(2, this.currentPage - 2);
            const end = Math.min(totalPages - 1, this.currentPage + 2);
            for (let i = start; i <= end; i++) pages.push(i);
            if (this.currentPage < totalPages - 3) pages.push("…");
            pages.push(totalPages);
        }
        return pages;
    }

    /**
     * Render pagination buttons
     */
    renderPagination(totalPages) {
        this.pagination.innerHTML = "";
        if (totalPages <= 1) return;

        const createButton = (label, page, disabled = false, active = false) => {
            const btn = document.createElement("button");
            btn.textContent = label;
            if (active) btn.classList.add("active");
            if (disabled) btn.disabled = true;
            btn.onclick = () => {
                this.currentPage = page;
                this.render();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };
            return btn;
        };

        // Prev
        this.pagination.appendChild(
            createButton("«", this.currentPage - 1, this.currentPage === 1)
        );

        const pages = this.calculatePageNumbers(totalPages);
        pages.forEach(p => {
            if (p === "…") {
                const span = document.createElement("span");
                span.textContent = "…";
                span.className = "pagination-ellipsis";
                span.style.padding = "6px 4px";
                span.style.color = "#888";
                this.pagination.appendChild(span);
            } else {
                this.pagination.appendChild(
                    createButton(p, p, false, p === this.currentPage)
                );
            }
        });

        // Next
        this.pagination.appendChild(
            createButton("»", this.currentPage + 1, this.currentPage === totalPages)
        );
    }

    resetFilters() {
        this.filters.search.value = "";
        this.filters.difficulty.value = "all";
        this.filters.minLevel.value = "1";
        this.filters.maxLevel.value = "12";
        this.filters.pack.value = "all";
        this.handleFilterChange();
    }
}