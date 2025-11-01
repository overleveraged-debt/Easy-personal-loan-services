/**
 * Common JavaScript for loading reusable components
 * This file handles dynamic loading of header and footer components
 */

class ComponentLoader {
    constructor() {
        this.loadedComponents = new Map();
        this.basePath = this.determineBasePath();
        this.init();
    }

    determineBasePath() {
        // Check if we're in the root directory or pages subdirectory
        const currentPath = window.location.pathname;
        if (currentPath.includes('/pages/') || currentPath.endsWith('/pages')) {
            return '../'; // We're in pages directory, need to go up one level
        } else {
            return ''; // We're in root directory
        }
    }

    async init() {
        await this.loadComponent('header', this.basePath + 'components/header.html', 'header-placeholder');
        await this.loadComponent('footer', this.basePath + 'components/footer.html', 'footer-placeholder');

        // Initialize mobile menu functionality after header is loaded
        this.initMobileMenu();

        // Dispatch event when all components are loaded
        document.dispatchEvent(new CustomEvent('componentsLoaded'));
    }

    async loadComponent(name, path, placeholderId) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Failed to load ${name} component: ${response.status}`);
            }

            const html = await response.text();
            const placeholder = document.getElementById(placeholderId);

            if (placeholder) {
                placeholder.innerHTML = html;
                this.loadedComponents.set(name, html);
            } else {
                console.warn(`Placeholder element '${placeholderId}' not found for ${name} component`);
            }
        } catch (error) {
            console.error(`Error loading ${name} component:`, error);
        }
    }

    initMobileMenu() {
        // Define global toggle functions
        window.toggleMobileMenu = () => {
            const mobileMenu = document.getElementById('mobile-menu');
            const menuBtn = document.getElementById('mobile-menu-btn');
            if (mobileMenu && menuBtn) {
                mobileMenu.classList.toggle('hidden');
                // Toggle icon
                const icon = menuBtn.querySelector('i');
                if (mobileMenu.classList.contains('hidden')) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                } else {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                }
            }
        };

        window.toggleMobileProducts = () => {
            const mobileProductsMenu = document.getElementById('mobile-products-menu');
            const icon = document.getElementById('mobile-products-icon');
            if (mobileProductsMenu && icon) {
                mobileProductsMenu.classList.toggle('hidden');
                if (mobileProductsMenu.classList.contains('hidden')) {
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                } else {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                }
            }
        };

        // Mobile menu event listeners (for both onclick and programmatic)
        const menuBtn = document.getElementById('mobile-menu-btn');
        if (menuBtn) {
            menuBtn.addEventListener('click', window.toggleMobileMenu);
            menuBtn.addEventListener('touchstart', window.toggleMobileMenu, { passive: true });
        }

        // Mobile products menu toggle
        const mobileProductsToggle = document.getElementById('mobile-products-toggle');
        const mobileProductsMenu = document.getElementById('mobile-products-menu');

        if (mobileProductsToggle && mobileProductsMenu) {
            mobileProductsToggle.addEventListener('click', () => {
                mobileProductsMenu.classList.toggle('hidden');
                const icon = document.getElementById('mobile-products-icon');
                if (mobileProductsMenu.classList.contains('hidden')) {
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                } else {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                }
            });
        }
    }

    updateNavigation(currentPage) {
        // This method can be used to highlight the current page in navigation
        // Future enhancement for active page indication
    }
}

// Initialize component loader when document is ready
document.addEventListener('DOMContentLoaded', () => {
    window.componentLoader = new ComponentLoader();
});
