/**
 * The following code handles toTop button
 */
window.onscroll = function() {
    const checkOne = document.body.scrollTop > 20;
    const checkTwo = document.documentElement.scrollTop > 20;

    if (checkOne || checkTwo) {
        document.getElementById("toTop").style.display = "block";
    } else {
        document.getElementById("toTop").style.display = "none";
    }
};

function toTop() {
    document.body.scrollTo({ top: 0, behavior: "smooth" });
    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * The following code applies scrambling effect to all h1 elements on page load
 */
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("h1:not(.no-scramble)").forEach((header) => {
        const target = header.querySelector(".name") || header;
        ScrambleText(target, target.textContent);
    });
});

function ScrambleText(element, text, { speed = 4, scramble = 10, intenseStart = 4 } = {}) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const originalText = text.split('');
    let scrambled = [...originalText];
    let frame = 0;
    let frameCounter = 0;

    const scrambleEffect = () => {
        if (frameCounter++ % speed !== 0) {
            requestAnimationFrame(scrambleEffect);
            return;
        }

        if (frame < originalText.length) {
            scrambled[frame] = originalText[frame];
        }
        for (let i = frame + 1; i < scrambled.length; i++) {
            if (originalText[i] === ' ') continue;
            let intensity = i < intenseStart ? scramble * 2 : scramble;
            scrambled[i] = Math.random() < intensity / scrambled.length
                ? chars[Math.floor(Math.random() * chars.length)]
                : originalText[i];
        }
        element.textContent = scrambled.join('');
        frame++;

        if (frame < scrambled.length) {
            requestAnimationFrame(scrambleEffect);
        } else {
            element.textContent = text;
        }
    };

    scrambleEffect();
}
