// Gallery Data for Landing Page
const galleries = {
    landing: [
        { src: 'content/spiritual/soul.jpg', caption: 'Spiritual', meta: 'Mind & Cosmos', link: 'spiritual.html' },
        { src: 'content/technology/circuits.jpg', caption: 'Technology', meta: 'Future Unveiled', link: 'technology.html' },
        { src: 'content/biomedical/cells.jpg', caption: 'Biomedical', meta: 'Life Rewritten', link: 'biomedical.html' },
        { src: 'content/sciences/galaxy.jpg', caption: 'Sciences', meta: 'Reality Decoded', link: 'sciences.html' }
    ]
};

/// Determine Current Page and Path
const currentPage = document.body.dataset.page || 'landing';
const pathSegments = window.location.pathname.split('/').filter(Boolean);
const currentSection = pathSegments[0] || currentPage;
const currentSubpath = window.location.hash.slice(1) || ''; // Use hash for subpath

async function getCurrentContent() {
    if (currentPage === 'landing') return Promise.resolve(galleries.landing);

    const response = await fetch('/index.json');
    const contentData = await response.json();
    let sectionContent = contentData[currentSection] || [];

    // Filter by subpath if present
    if (currentSubpath) {
        sectionContent = sectionContent.filter(item => item.name === currentSubpath);
        if (sectionContent.length > 0 && sectionContent[0].type === 'folder') {
            // Simulate subfolder content (for static site, assumes flat structure or manual subfolder JSON)
            return sectionContent[0].subtopics || sectionContent;
        }
    }

    const enrichedContent = await Promise.all(sectionContent.map(async item => {
        if (item.type === 'text') {
            const textResponse = await fetch(item.content);
            return { ...item, content: await textResponse.text() };
        }
        return item;
    }));

    return enrichedContent;
}

// Load content dynamically
let galleryImages = [];
getCurrentContent().then(data => {
    galleryImages = data;
    if (currentPage === 'landing') {
        createHorizontalGallery();
    } else {
        createSubpageContent();
    }
}).catch(err => console.error('Error loading content:', err));

// Background with Enhanced Depth
const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
for (let i = 0; i < 100; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        speedX: Math.random() * (currentPage === 'technology' ? 0.4 : 0.2) - (currentPage === 'spiritual' ? 0.3 : 0.1),
        speedY: Math.random() * (currentPage === 'spiritual' ? 0.4 : 0.2) - (currentPage === 'technology' ? 0.1 : 0.1),
        color: currentPage === 'spiritual' ? '#9B59B6' : currentPage === 'technology' ? '#00FFB9' : currentPage === 'biomedical' ? '#00D4A0' : '#1E90FF'
    });
}

function drawHexGrid() {
    const hexSize = currentPage === 'technology' ? 30 : 50;
    ctx.strokeStyle = 'rgba(0, 255, 185, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += hexSize * 1.5) {
        for (let y = 0; y < canvas.height; y += hexSize * Math.sqrt(3)) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + hexSize, y);
            ctx.lineTo(x + hexSize * 1.5, y + hexSize * Math.sqrt(3) / 2);
            ctx.lineTo(x + hexSize, y + hexSize * Math.sqrt(3));
            ctx.lineTo(x, y + hexSize * Math.sqrt(3));
            ctx.lineTo(x - hexSize * 0.5, y + hexSize * Math.sqrt(3) / 2);
            ctx.closePath();
            ctx.stroke();
        }
    }
}

function drawNebula() {
    if (currentPage === 'biomedical') return;
    const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
    const color = currentPage === 'spiritual' ? '#9B59B6' : currentPage === 'technology' ? '#00FFB9' : '#1E90FF';
    gradient.addColorStop(0, `${color}20`);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawDNA() {
    if (currentPage !== 'biomedical') return;

    const dnaStrands = [
        { x: canvas.width * 0.3, height: canvas.height * 0.5, width: 40 },
        { x: canvas.width * 0.5, height: canvas.height * 0.7, width: 60 },
        { x: canvas.width * 0.7, height: canvas.height * 0.4, width: 30 }
    ];

    dnaStrands.forEach(strand => {
        ctx.strokeStyle = 'rgba(0, 212, 160, 0.2)';
        ctx.lineWidth = 2;
        const centerX = strand.x;
        const helixHeight = strand.height;
        const helixWidth = strand.width;

        for (let y = canvas.height / 2 - helixHeight / 2; y < canvas.height / 2 + helixHeight / 2; y += 10) {
            const angle = (y - canvas.height / 2) * 0.05;
            const x1 = centerX + Math.sin(angle) * helixWidth;
            const x2 = centerX - Math.sin(angle) * helixWidth;

            ctx.beginPath();
            ctx.moveTo(x1, y);
            ctx.lineTo(x2, y);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(x1, y, 2, 0, Math.PI * 2);
            ctx.arc(x2, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 212, 160, ${0.3 + Math.sin(Date.now() * 0.002) * 0.1})`;
            ctx.fill();
        }
    });
}

function animateBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawNebula();
    drawHexGrid();
    drawDNA();

    particles.forEach((p, i) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < 100) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(${currentPage === 'spiritual' ? '155, 89, 182' : currentPage === 'technology' ? '0, 255, 185' : currentPage === 'biomedical' ? '0, 212, 160' : '30, 144, 255'}, ${1 - dist / 100})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }

        if (currentPage === 'biomedical') {
            p.radius = Math.sin(Date.now() * 0.001 + i) * 1.5 + 1.5;
        }
        if (currentPage === 'sciences' && Math.random() < 0.01) {
            p.radius += 2;
            setTimeout(() => p.radius = Math.random() * 2 + 1, 200);
        }
    });

    requestAnimationFrame(animateBackground);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

animateBackground();

// Horizontal Scroll Gallery (Landing Page)
function createHorizontalGallery() {
    const gallery = document.querySelector('.horizontal-gallery');
    if (!gallery) return;

    gallery.innerHTML = '';
    galleryImages.forEach(image => {
        const div = document.createElement('div');
        div.classList.add('gallery-item');
        div.innerHTML = `
            <a href="${image.link}">
                <img src="${image.src}" alt="${image.caption}" loading="lazy" data-full="${image.src}">
                <span>${image.caption}</span>
                <div class="metadata">${image.meta}</div>
            </a>
        `;
        gallery.appendChild(div);
    });

    let isDown = false;
    let startX;
    let scrollLeft;

    gallery.addEventListener('mousedown', (e) => {
        isDown = true;
        gallery.style.cursor = 'grabbing';
        startX = e.pageX - gallery.offsetLeft;
        scrollLeft = gallery.scrollLeft;
    });

    gallery.addEventListener('mouseleave', () => {
        isDown = false;
        gallery.style.cursor = 'grab';
    });

    gallery.addEventListener('mouseup', () => {
        isDown = false;
        gallery.style.cursor = 'grab';
    });

    gallery.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - gallery.offsetLeft;
        const walk = (x - startX) * 2;
        gallery.scrollLeft = scrollLeft - walk;
    });

    gallery.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - gallery.offsetLeft;
        scrollLeft = gallery.scrollLeft;
    });

    gallery.addEventListener('touchend', () => {
        isDown = false;
    });

    gallery.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.touches[0].pageX - gallery.offsetLeft;
        const walk = (x - startX) * 2;
        gallery.scrollLeft = scrollLeft - walk;
    });
}

// Subpage Content (Thought Nodes & Sub-Content)
function createSubpageContent() {
    const nodesContainer = document.getElementById('thought-nodes');
    const subContent = document.getElementById('sub-content');
    if (!nodesContainer || !subContent) return;

    // If no subpath, show nodes
    if (!currentSubpath) {
        nodesContainer.style.display = 'block';
        subContent.classList.remove('active');
        nodesContainer.innerHTML = '';

        // Radial layout for nodes
        const radius = 150;
        const centerX = nodesContainer.offsetWidth / 2;
        const centerY = nodesContainer.offsetHeight / 2;
        galleryImages.forEach((item, index) => {
            const angle = (index / galleryImages.length) * 2 * Math.PI;
            const x = centerX + radius * Math.cos(angle) - 50; // Offset by half node width
            const y = centerY + radius * Math.sin(angle) - 50; // Offset by half node height

            const node = document.createElement('a');
            node.classList.add('node');
            node.href = `${currentSection}.html#${item.name}`;
            node.style.left = `${x}px`;
            node.style.top = `${y}px`;
            node.innerHTML = `${item.name.replace(/\.(md|pdf|jpg)$/, '')}<span>${item.type === 'folder' ? 'Subtopics' : item.type}</span>`;
            nodesContainer.appendChild(node);

            setTimeout(() => node.classList.add('visible'), index * 100); // Staggered reveal
        });
    } else {
        // Show sub-content for clicked node
        nodesContainer.style.display = 'none';
        subContent.classList.add('active');
        subContent.innerHTML = `<h2>${currentSubpath}</h2>`;

        galleryImages.forEach(item => {
            if (item.type !== 'folder') {
                const card = document.createElement('div');
                card.classList.add('content-card');
                let contentHTML = `
                    <h3>${item.name.replace(/\.(md|pdf|jpg)$/, '')}</h3>
                    <div class="metadata">Type: ${item.type}</div>
                    <div class="content">
                `;
                if (item.type === 'text') {
                    contentHTML += `<p>${item.content}</p>`;
                } else if (item.type === 'pdf') {
                    contentHTML += `<embed src="${item.content}" type="application/pdf" width="100%" height="300px">`;
                } else if (item.type === 'image') {
                    contentHTML += `<img src="${item.content}" alt="${item.name}">`;
                }
                contentHTML += `</div>`;
                card.innerHTML = contentHTML;

                card.addEventListener('click', () => {
                    card.classList.toggle('active');
                });

                subContent.appendChild(card);
                setTimeout(() => card.classList.add('visible'), 100);
            }
        });
    }
}

// Gentle Reveal Scroll Effect
function revealItems() {
    const items = document.querySelectorAll('.gallery-item, .intro, .about, .contact, .node, .content-card');
    items.forEach(item => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50 && rect.bottom > 0) {
            item.classList.add('visible');
        }
    });

    const backToTop = document.querySelector('.back-to-top');
    if (backToTop && window.scrollY > 200) backToTop.classList.add('visible');
    else if (backToTop) backToTop.classList.remove('visible');
}

// Scroll Progress
function updateScrollProgress() {
    const scrollProgress = document.querySelector('.scroll-progress');
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = `${progress}%`;
}

// Scroll Direction Detection for Header
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const currentScroll = window.scrollY;

    if (currentScroll > lastScroll && currentScroll > 50) {
        header.classList.add('scrolled-down');
        header.classList.remove('scrolled-up');
    } else if (currentScroll < lastScroll) {
        header.classList.add('scrolled-up');
        header.classList.remove('scrolled-down');
    }
    lastScroll = currentScroll;

    revealItems();
    updateScrollProgress();
});

// Back to Top
const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Initial Load
if (currentPage === 'landing') {
    createHorizontalGallery();
} else {
    createSubpageContent();
}

window.addEventListener('resize', () => {
    if (currentPage === 'landing') {
        createHorizontalGallery();
    } else {
        createSubpageContent();
    }
});

window.addEventListener('load', () => {
    revealItems();
    updateScrollProgress();
});

// Lazy Loading Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loaded');
            observer.unobserve(img);
        }
    });
}, { rootMargin: '100px' });

document.querySelectorAll('img[loading="lazy"]').forEach(img => observer.observe(img));