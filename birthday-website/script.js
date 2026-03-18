document.addEventListener('DOMContentLoaded', () => {
    // ---- Configuration ----
    const config = {
        herName: "Nidhi", // Can be customized
    };

    // ---- DOM Elements ----
    const landingScreen = document.getElementById('landing-screen');
    const cakeScreen = document.getElementById('cake-screen');
    const wishScreen = document.getElementById('wish-screen');
    const galleryScreen = document.getElementById('gallery-screen');
    const messageScreen = document.getElementById('message-screen');
    const finalScreen = document.getElementById('final-screen');
    
    const enterBtn = document.getElementById('enter-btn');
    const cutCakeBtn = document.getElementById('cut-cake-btn');
    const nextToGalleryBtn = document.getElementById('next-to-gallery-btn');
    const nextToMsgBtn = document.getElementById('next-to-msg-btn');
    const surpriseBtn = document.getElementById('surprise-btn');
    
    const audioToggle = document.getElementById('audio-toggle');
    // Note: Audio file updated to "Tainu Khabar Nahi"
    const bgMusic = document.getElementById('bg-music');
    let isPlaying = false;
    
    const nameSpan = document.getElementById('her-name-intro');
    
    // Set custom name
    if (nameSpan) {
        nameSpan.textContent = config.herName;
    }

    // ---- Heart Animation System ----
    function createHearts(containerId, count = 15) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.classList.add('heart');
                heart.innerHTML = '💖';
                
                // Randomize position, size, and animation duration
                heart.style.left = Math.random() * 100 + 'vw';
                heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
                heart.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
                
                container.appendChild(heart);
                
                // Remove heart after animation
                setTimeout(() => {
                    heart.remove();
                }, 6000);
            }, i * 300); // Stagger creation
        }
    }

    // Start background effect for landing
    setInterval(() => createHearts('landing-bg', 3), 1000);

    // ---- Audio Handling ----
    audioToggle.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            audioToggle.innerHTML = '🔇 Music Off';
        } else {
            bgMusic.volume = 0.5;
            let playPromise = bgMusic.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => console.log('Audio playback prevented by browser.', e));
            }
            audioToggle.innerHTML = '🎵 Music On';
        }
        isPlaying = !isPlaying;
    });

    // ---- Transitions ----
    enterBtn.addEventListener('click', () => {
        landingScreen.classList.remove('active');
        landingScreen.classList.add('hidden');
        
        cakeScreen.classList.remove('hidden');
        cakeScreen.classList.add('active');

        // Play music implicitly if not already playing
        if (!isPlaying) {
            bgMusic.volume = 0.5;
            let playPromise = bgMusic.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    isPlaying = true;
                    audioToggle.innerHTML = '🎵 Music On';
                }).catch(() => { /* Autoplay blocked, wait for manual toggle */ });
            }
        }
    });

    cutCakeBtn.addEventListener('click', () => {
        // Disable button so we don't click it twice
        cutCakeBtn.style.pointerEvents = 'none';

        // Stop the bounce animation so we can cut cleanly
        document.querySelectorAll('.cake-emoji').forEach(el => el.style.animation = 'none');

        // Setup the knife's starting rotation and center alignment using GSAP
        gsap.set('#knife', { xPercent: -50, y: -50, rotation: 180, opacity: 0 });

        const tl = gsap.timeline();

        // 1. Knife appears and hovers
        tl.to('#knife', { y: 0, opacity: 1, rotation: 220, duration: 0.5, ease: "back.out(1.5)" })
          // 2. Knife pulls back slightly to prepare for strike
          .to('#knife', { y: -30, rotation: 200, duration: 0.3, ease: "power1.inOut" })
          // 3. Knife slices down HARD and FAST
          .to('#knife', { y: 250, rotation: 240, duration: 0.2, ease: "power4.in" })
          // 4. Cake halves fly outwards and downwards violently
          .to('.left-half', { x: -250, y: 300, rotation: -60, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.1")
          .to('.right-half', { x: 250, y: 300, rotation: 60, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.8")
          // 5. Knife follows through and falls away
          .to('#knife', { y: 600, opacity: 0, duration: 0.5, ease: "power2.in" }, "-=0.6")
          // 6. Massive confetti explosion right at the slice moment
          .call(() => {
              confetti({
                  particleCount: 300,
                  spread: 160,
                  origin: { y: 0.5 },
                  startVelocity: 45,
                  colors: ['#FFC0CB', '#E6E6FA', '#ff8fa3', '#FFFFFF', '#ffd6a5']
              });
          }, null, "-=0.8")
          // 7. Transition to next screen
          .call(() => {
              setTimeout(() => {
                  cakeScreen.classList.remove('active');
                  cakeScreen.classList.add('hidden');
                  
                  wishScreen.classList.remove('hidden');
                  wishScreen.classList.add('active');

                  setTimeout(() => {
                      new Typed('#typed-wish', {
                          strings: [`Happy Birthday ${config.herName} 🎉💖`],
                          typeSpeed: 60,
                          showCursor: true,
                          cursorChar: '|',
                          onComplete: () => {
                              gsap.fromTo(nextToGalleryBtn, 
                                  { opacity: 0, display: 'block' },
                                  { opacity: 1, duration: 1, delay: 1 }
                              );
                          }
                      });
                      
                      fireConfetti();
                      createBalloons();
                      
                  }, 500);
              }, 400); // Slight delay for the pieces to fly away before transitioning
          });
    });

    nextToGalleryBtn.addEventListener('click', () => {
        wishScreen.classList.remove('active');
        wishScreen.classList.add('hidden');
        
        galleryScreen.classList.remove('hidden');
        galleryScreen.classList.add('active');

        // Start background effect for gallery
        setInterval(() => createHearts('gallery-bg', 3), 1000);
    });

    nextToMsgBtn.addEventListener('click', () => {
        galleryScreen.classList.remove('active');
        galleryScreen.classList.add('hidden');
        
        messageScreen.classList.remove('hidden');
        messageScreen.classList.add('active');
        
        gsap.from("#personal-message", { opacity: 0, y: 30, duration: 1.5, delay: 0.5 });
    });

    surpriseBtn.addEventListener('click', () => {
        fireFireworks();
        
        // Wait for fireworks, then show final screen
        setTimeout(() => {
            messageScreen.classList.remove('active');
            messageScreen.classList.add('hidden');
            
            finalScreen.classList.remove('hidden');
            finalScreen.classList.add('active');
            
            // Start heart shower for final screen
            setInterval(() => createHearts('final-bg', 5), 800);
        }, 3500);
    });

    // ---- Balloon System ----
    function createBalloons() {
        const container = document.getElementById('balloons');
        if (!container) return;
        const colors = ['#FFC0CB', '#E6E6FA', '#ff8fa3', '#a2d2ff', '#ffd6a5'];
        for(let i = 0; i < 12; i++) {
            const balloon = document.createElement('div');
            balloon.classList.add('balloon');
            balloon.style.background = colors[Math.floor(Math.random() * colors.length)];
            balloon.style.left = (Math.random() * 80 + 10) + '%';
            balloon.style.animationDuration = (Math.random() * 4 + 7) + 's';
            balloon.style.animationDelay = (Math.random() * 3) + 's';
            
            // Randomly scale balloons
            const scale = Math.random() * 0.4 + 0.8;
            balloon.style.transform = `scale(${scale})`;

            container.appendChild(balloon);
        }
    }

    // ---- Confetti System ----
    function fireConfetti() {
        var duration = 3 * 1000;
        var end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#FFC0CB', '#E6E6FA', '#FFFFFF', '#ff8fa3']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#FFC0CB', '#E6E6FA', '#FFFFFF', '#ff8fa3']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }

    // ---- Fireworks System ----
    function fireFireworks() {
        var duration = 3 * 1000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        var interval = setInterval(function() {
            var timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            var particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }
});
