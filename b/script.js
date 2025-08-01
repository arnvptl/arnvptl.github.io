﻿// YouTube video data
const videoData = [
    {
        id: 'heihZR83RWA',
        title: 'Puja Khedkar Case: Retired IAS Officer Bhatia Questions Modi Government\'s Inaction',
        category: 'Recent Interviews'
    },
    {
        id: 'dA6nFK2p41k',
        title: '\'IAS Is One Of The Most Corrupt Organizations In India\' : Arun Bhatia, Former IAS Officer',
        category: 'Recent Interviews'
    },
    {
        id: 'BtrZa7qV8TI',
        title: 'Arun Bhatia On Pooja Khedkar | \'पूजा खेडकरांना अटक करा\' माजी सनदी अधिकारी अरुण भाटियांची मागणी',
        category: 'Recent Interviews'
    },
    {
        id: 'hNo1C9Zgx9k',
        title: 'IAS Pooja Khedkar वर अद्याप गुन्हा का नाही? माजी सनदी अधिकारी IAS Arun Bhatia यांची रोखठोक मुलाखत',
        category: 'Recent Interviews'
    },
    {
        id: 'sX__lVQbQGY',
        title: 'Arun Bhatia Exclusive | "सेवेतील सनदी अधिकारी भ्रष्ट", माजी सनदी अधिकारी अरुण भाटिया NDTV मराठीवर',
        category: 'Recent Interviews'
    },
    {
        id: 'NAyLIsqC7cc',
        title: 'Pudhari News | पुणे पोलिस आयुक्त अमितेश कुमारांची बदली करा - अरुण भाटिया | Arun Bhatia| PM modi|',
        category: 'Recent Interviews'
    },
    {
        id: 'mmh__OwDEDg',
        title: 'The Newshour Debate: Honesty Punished - Part 1',
        category: 'Major Debates'
    },
    {
        id: 'bCG-ehU6jt4',
        title: 'The Newshour Debate: Honesty Punished - Part 2',
        category: 'Major Debates'
    },
    {
        id: '3Mdvp88hzp8',
        title: 'The Newshour Debate: Honesty Punished - Part 3',
        category: 'Major Debates'
    },
    {
        id: '7ppGjJnwQgU',
        title: 'The Newshour Debate: Honesty Punished - Part 4',
        category: 'Major Debates'
    },
    {
        id: 'O2y_r8Cs6u4',
        title: 'The Newshour Debate: Honesty Punished - Full Debate',
        category: 'Major Debates'
    },
    {
        id: 'uPH7PDvczQc',
        title: 'Arun Bhatia, Independent || Pune, Maharashtra',
        category: 'Political Campaign'
    },
    {
        id: 'RSAat1SjRg4',
        title: 'Pune Arun Bhatia To Fight Election',
        category: 'Political Campaign'
    },
    {
        id: 'gMEJscBWm0Y',
        title: 'Pune : Arun Bhatia to contest Lok Sabha elections',
        category: 'Political Campaign'
    },
    {
        id: 'sh8OJo_OmFQ',
        title: 'Arun Bhatia on "Anna Hazare\'s Campaign Against Corruption"',
        category: 'Anti-Corruption Campaign'
    },
    {
        id: 'bSr58uGqP04',
        title: 'AAP Voices of Dissent Ex IAS officer Arun Bhatia',
        category: 'Anti-Corruption Campaign'
    },
    {
        id: 'OMMZX91dqEA',
        title: 'Arun Bhatia promises to eradicate corruption from Pune city in 60 days!',
        category: 'Achievements and Promises'
    },
    {
        id: 'p_iv5q-vzJs',
        title: 'Arun Bhatia\'s achievements for pune during his stint in various positions in Pune.',
        category: 'Achievements and Promises'
    },
    {
        id: 'PsS1RZAoQ7Y',
        title: 'Former IAS officer Arun Bhatia elaborates How to Prosecute Bureaucrats despite Section 197',
        category: 'Expert Opinions'
    },
    {
        id: '9fvRZZN8vGo',
        title: 'Arun Bhatia on How to Prevent Abuse of Power by Bureaucrats part 1 of 2',
        category: 'Expert Opinions'
    },
    {
        id: 'mQvG-4b2nhk',
        title: 'Arun Bhatia speaks on Democracy',
        category: 'Expert Opinions'
    }
];

// Function to create video card
function createVideoCard(video, index) {
    const isEven = index % 2 === 0;
    const bgClass = isEven ? 'media-navy' : 'media-yellow';
    
    return `
        <div class="col-md-4 mb-4">
            <div class="media-item ${bgClass} fade-in" onclick="openVideo('${video.id}')">
                <div class="media-thumbnail">
                    <i class="fas fa-play-circle play-icon"></i>
                </div>
                <div class="media-title">
                    ${video.title}
                </div>
            </div>
        </div>
    `;
}

// Function to organize videos by category
function organizeVideosByCategory() {
    const categories = {};
    videoData.forEach(video => {
        if (!categories[video.category]) {
            categories[video.category] = [];
        }
        categories[video.category].push(video);
    });
    return categories;
}

// Function to render videos
function renderVideos() {
    const mediaGrid = document.getElementById('mediaGrid');
    if (!mediaGrid) return;

    const categories = organizeVideosByCategory();
    let html = '';

    Object.entries(categories).forEach(([category, videos]) => {
        html += `
            <div class="col-12 mb-5">
                <h2 class="section-title">${category}</h2>
                <div class="row">
                    ${videos.map((video, index) => createVideoCard(video, index)).join('')}
                </div>
            </div>
        `;
    });

    mediaGrid.innerHTML = html;
    observeElements(); // Re-initialize fade-in animations
}

// Function to open video
function openVideo(videoId) {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
}

// Function to observe elements for fade-in animation
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    observeElements();
    renderVideos();
});
console.log(`
  ┓     ┏┓┳┓┳┓┏┓┓┏
━━┣┓┓┏  ┣┫┣┫┃┃┣┫┃┃
  ┗┛┗┫  ┛┗┛┗┛┗┛┗┗┛
     ┛
https://rnv.is-a.dev`);
