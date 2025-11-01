// Component Loader Script
// Loads header and footer components dynamically

document.addEventListener('DOMContentLoaded', function() {
    loadComponents();
});

async function loadComponents() {
    try {
        // Determine base path based on current location
        const basePath = window.location.pathname.includes('/pages/') ? '../' : '';

        // Load header
        const headerResponse = await fetch(`${basePath}components/header.html`);
        if (!headerResponse.ok) {
            throw new Error(`Failed to load header: ${headerResponse.status}`);
        }
        const headerHtml = await headerResponse.text();

        // Load footer
        const footerResponse = await fetch(`${basePath}components/footer.html`);
        if (!footerResponse.ok) {
            throw new Error(`Failed to load footer: ${footerResponse.status}`);
        }
        const footerHtml = await footerResponse.text();

        // Load sticky bar
        const stickyBarResponse = await fetch(`${basePath}components/sticky-bar.html`);
        if (!stickyBarResponse.ok) {
            throw new Error(`Failed to load sticky-bar: ${stickyBarResponse.status}`);
        }
        const stickyBarHtml = await stickyBarResponse.text();

        // Adjust paths based on current location
        const isInPages = window.location.pathname.includes('/pages/');
        const adjustedHeaderHtml = adjustPaths(headerHtml, isInPages);
        const adjustedFooterHtml = adjustPaths(footerHtml, isInPages);

        // Insert into placeholders
        const headerPlaceholder = document.getElementById('header-placeholder');
        const footerPlaceholder = document.getElementById('footer-placeholder');

        if (headerPlaceholder) {
            headerPlaceholder.innerHTML = adjustedHeaderHtml;
        }
        if (footerPlaceholder) {
            footerPlaceholder.innerHTML = adjustedFooterHtml;
        }

        // Append sticky bar to body
        const stickyBarDiv = document.createElement('div');
        stickyBarDiv.innerHTML = stickyBarHtml;  // No adjusted since we skipped
        const stickyBarElement = stickyBarDiv.querySelector('#sticky-bar');
        console.log('Sticky bar element:', stickyBarElement);
        document.body.appendChild(stickyBarElement);

        // Set correct href for sticky apply button
        const applyBtn = document.getElementById('sticky-apply-btn');
        if (applyBtn) {
            if (isInPages) {
                applyBtn.href = 'apply-now.html';
            } else {
                applyBtn.href = 'pages/apply-now.html';
            }
        }

        // Initialize mobile menu after loading
        initializeMobileMenu();

    } catch (error) {
        console.error('Error loading components:', error);
    }
}

function adjustPaths(html, isInPages) {
    if (!isInPages) {
        return html;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const base = document.createElement('base');
    base.href = '../';
    doc.head.append(base);

    return new XMLSerializer().serializeToString(doc);
}

function initializeMobileMenu() {
    // Mobile menu toggle functionality
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileProductsToggle = document.getElementById('mobile-products-toggle');
    const mobileProductsMenu = document.getElementById('mobile-products-menu');
    const mobileProductsIcon = document.getElementById('mobile-products-icon');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    if (mobileProductsToggle && mobileProductsMenu && mobileProductsIcon) {
        mobileProductsToggle.addEventListener('click', function() {
            mobileProductsMenu.classList.toggle('hidden');
            mobileProductsIcon.classList.toggle('fa-chevron-down');
            mobileProductsIcon.classList.toggle('fa-chevron-up');
        });
    }
}
