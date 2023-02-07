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
        console.log(direction);
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
        markers: true,
    });
}

function init() {
    initNavigation();
}

window.addEventListener("load", function () {
    init();
});
