gsap.registerPlugin(ScrollTrigger);

function initNavigation() {
    const mainNavLinks = gsap.utils.toArray(".main-nav a");
    const mainNavLinksRev = mainNavLinks.reverse();

    mainNavLinks.forEach((link) => {
        link.addEventListener("mouseleave", () => {
            // add class
            link.classList.add("animate-out");
            // remove class
            setTimeout(() => {
                link.classList.remove("animate-out");
            }, 300);
        });
    });

    function navAnimation({ direction }) {
        const isScrollingDown = direction === 1;
        const links = isScrollingDown ? mainNavLinks : mainNavLinksRev;
        return gsap.to(links, {
            duration: 0.3,
            stagger: 0.05,
            autoAlpha: () => (isScrollingDown ? 0 : 1),
            y: () => (isScrollingDown ? 20 : 0),
            ease: "Power4.out",
        });
    }

    ScrollTrigger.create({
        start: 100,
        end: "bottom bottom-=20",
        toggleClass: {
            targets: "body",
            className: "has-scrolled",
        },
        onEnter: (scrollObject) => navAnimation(scrollObject),
        onLeaveBack: (scrollObject) => navAnimation(scrollObject),
        // markers: true,
    });
}

function initHeaderTilt() {
    document.querySelector("header").addEventListener("mousemove", moveImages);
}

function moveImages(e) {
    const { target, offsetX, offsetY } = e;
    const { clientWidth, clientHeight } = target;
    // console.log(offsetX, offsetY, clientWidth, clientHeight);

    // get 0 0 in the center

    const xPos = offsetX / clientWidth - 0.5;
    const yPos = offsetY / clientHeight - 0.5;

    const leftImages = gsap.utils.toArray(".hg__left .hg__image");
    const rightImages = gsap.utils.toArray(".hg__right .hg__image");

    const modifier = (index) => index * 1.2 + 0.5;

    // move leeft 3 images

    leftImages.forEach((image, index) => {
        gsap.to(image, {
            duration: 1.2,
            x: xPos * 20 * modifier(index),
            y: yPos * 30 * modifier(index),
            rotationY: xPos * 40,
            rotationX: yPos * 10,
            ease: "Power3.out",
        });
    });

    // move right 3 images

    rightImages.forEach((image, index) => {
        gsap.to(image, {
            duration: 1.2,
            x: xPos * 20 * modifier(index),
            y: -yPos * 30 * modifier(index),
            rotationY: xPos * 40,
            rotationX: yPos * 10,
            ease: "Power3.out",
        });
    });

    gsap.to(".decor__circle", {
        duration: 1.7,
        x: 100 * xPos,
        y: 120 * yPos,
        ease: "Power4.out",
    });
}

function init() {
    initNavigation();
    initHeaderTilt();
}

window.addEventListener("load", function () {
    init();
});
