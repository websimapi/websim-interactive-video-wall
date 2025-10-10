import interact from 'interactjs';

const videoWall = document.getElementById('video-wall-container');
const infoOverlay = document.getElementById('info-overlay');

const videos = [
    'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-ocean-1164-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-under-a-blue-sky-with-a-tree-and-the-sun-8371-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-white-sand-beach-with-people-in-the-water-34598-large.mp4',
];

function createVideoItem(src, index) {
    const item = document.createElement('div');
    item.classList.add('video-item');

    const video = document.createElement('video');
    video.src = src;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;

    item.appendChild(video);
    videoWall.appendChild(item);

    // Initial position
    const x = (index % 2) * 350 + 50;
    const y = Math.floor(index / 2) * 220 + 50;
    item.style.transform = `translate(${x}px, ${y}px)`;
    item.setAttribute('data-x', x);
    item.setAttribute('data-y', y);
    item.setAttribute('data-angle', 0);
}

videos.forEach(createVideoItem);

// Hide info overlay after a few seconds
setTimeout(() => {
    if (infoOverlay) {
        infoOverlay.style.transition = 'opacity 1s';
        infoOverlay.style.opacity = '0';
    }
}, 5000);


interact('.video-item')
    .draggable({
        listeners: {
            move(event) {
                const target = event.target;
                const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                const angle = parseFloat(target.getAttribute('data-angle')) || 0;

                target.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            }
        },
        inertia: true,
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: 'parent',
                endOnly: true
            })
        ]
    })
    .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
            move: function (event) {
                let { x, y } = event.target.dataset;
                x = (parseFloat(x) || 0) + event.deltaRect.left;
                y = (parseFloat(y) || 0) + event.deltaRect.top;

                Object.assign(event.target.style, {
                    width: `${event.rect.width}px`,
                    height: `${event.rect.height}px`,
                });

                const angle = parseFloat(event.target.getAttribute('data-angle')) || 0;
                event.target.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;

                Object.assign(event.target.dataset, { x, y });
            }
        },
        inertia: true,
    })
    .gesturable({
        listeners: {
            move (event) {
                const target = event.target
                const angle = (parseFloat(target.getAttribute('data-angle')) || 0) + event.da

                const { x, y } = target.dataset;
                target.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
                target.setAttribute('data-angle', angle)
            }
        }
    });

// Prevent browser context menu
window.addEventListener('contextmenu', function (e) {
  e.preventDefault();
}, false);

