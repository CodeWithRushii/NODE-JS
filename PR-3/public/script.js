// Create floating particles
const particlesContainer = document.getElementById('particles');
for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 8 + 's';
    particle.style.animationDuration = (Math.random() * 5 + 5) + 's';
    particlesContainer.appendChild(particle);
}

// Interactive light show
function createLightShow(color) {
    const lightShow = document.getElementById('lightShow');
    lightShow.innerHTML = '';
    
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const orb = document.createElement('div');
            orb.className = 'light-orb active';
            orb.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
            orb.style.left = Math.random() * 80 + 10 + '%';
            orb.style.top = Math.random() * 60 + 20 + '%';
            orb.style.boxShadow = `0 0 60px ${color}`;
            lightShow.appendChild(orb);
            
            setTimeout(() => {
                orb.remove();
            }, 2000);
        }, i * 200);
    }
}