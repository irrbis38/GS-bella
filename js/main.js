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

const sections = document.querySelectorAll(".rg__column");

function initHoverReveal() {
    sections.forEach((section) => {
        // get components for animation
        section.imageBlock = section.querySelector(".rg__image");
        section.image = section.querySelector(".rg__image img");
        section.mask = section.querySelector(".rg__image--mask");
        section.text = section.querySelector(".rg__text");
        section.textCopy = section.querySelector(".rg__text--copy");
        section.textMask = section.querySelector(".rg__text--mask");
        section.textP = section.querySelector(".rg__text--copy p");

        //reset the initial position
        gsap.set([section.imageBlock, section.textMask], { yPercent: -101 });
        gsap.set([section.mask, section.textP], { yPercent: 100 });
        gsap.set(section.image, { scale: 1.2 });

        // add event listeners to each section
        section.addEventListener("mouseenter", createHoverReveal);
        section.addEventListener("mouseleave", createHoverReveal);
    });
}

function getTextHeight(textCopy) {
    return textCopy.clientHeight;
}

function createHoverReveal(e) {
    // console.log(e.type);

    const { imageBlock, mask, text, textCopy, textMask, textP, image } =
        e.target;

    let tl = gsap.timeline({
        defaults: {
            duration: 0.7,
            ease: "Power4.out",
        },
    });

    if (e.type === "mouseenter") {
        tl.to([mask, imageBlock, textMask, textP], { yPercent: 0 })
            .to(
                text,
                {
                    y: () => -getTextHeight(textCopy) / 2,
                },
                0
            )
            .to(image, { duration: 1.1, scale: 1 }, 0);
    } else if (e.type === "mouseleave") {
        tl.to([mask, textP], { yPercent: 100 })
            .to([imageBlock, textMask], { yPercent: -101 }, 0)
            .to(text, { y: 0 }, 0)
            .to(image, { scale: 1.2 }, 0);
    }

    return tl;
}

// define a breakpoint
const mq = window.matchMedia("(min-width: 768px)");

// add change listener to this breakpoint
// mq.addListener(handleWidthChange);
mq.addEventListener("change", handleWidthChange);

// first page load
// handleWidthChange(mq);

// reset all props
function resetProps(elements) {
    // console.log(elements);

    // stop all tweens
    gsap.killTweensOf("*");

    if (elements.length) {
        elements.forEach((el) => {
            el && gsap.set(el, { clearProps: "all" });
        });
    }
}

// media query change
function handleWidthChange(mq) {
    // check if we are on the right breakpoint
    if (mq.matches) {
        // setup hover animation
        initHoverReveal();
    } else {
        // width is less than 768px
        // console.log("we are on mobile");

        // remove event listener for each section
        sections.forEach((section) => {
            section.removeEventListener("mouseenter", createHoverReveal);
            section.removeEventListener("mouseleave", createHoverReveal);

            const { imageBlock, mask, text, textCopy, textMask, textP, image } =
                section;
            resetProps([
                imageBlock,
                mask,
                text,
                textCopy,
                textMask,
                textP,
                image,
            ]);
        });
    }
}

// create hover effect for each portfolio navigation item
const allLinks = gsap.utils.toArray(".portfolio__categories a");
const pageBackground = document.querySelector(".fill-background");
const largeImage = document.querySelector(".portfolio__image--l");
const smallImage = document.querySelector(".portfolio__image--s");
const lInside = document.querySelector(".portfolio__image--l .image_inside");
const sInside = document.querySelector(".portfolio__image--s .image_inside");

function initPortfolioHover() {
    allLinks.forEach((link) => {
        link.addEventListener("mouseenter", createPortfolioHover);
        link.addEventListener("mouseleave", createPortfolioHover);
        link.addEventListener("mousemove", createPortfolioMove);
    });
}

function createPortfolioHover(e) {
    if (e.type === "mouseenter") {
        const { color, imagelarge, imagesmall } = e.target.dataset;
        const allSiblings = allLinks.filter((item) => item !== e.target);
        const tl = gsap.timeline();
        tl.set(lInside, { background: `url(${imagelarge})` })
            .set(sInside, { background: `url(${imagesmall})` })
            .to([largeImage, smallImage], { autoAlpha: 1 })
            .to(allSiblings, { color: "#fff", autoAlpha: 0.2 }, 0)
            .to(e.target, { color: "#fff", autoAlpha: 1 }, 0)
            .to(pageBackground, { backgroundColor: color, ease: "none" });
    } else if (e.type === "mouseleave") {
        const tl = gsap.timeline();
        tl.to([largeImage, smallImage], { autoAlpha: 0 })
            .to(allLinks, { color: "#000", autoAlpha: 1 }, 0)
            .to(
                pageBackground,
                { backgroundColor: "#AEB7AC", ease: "none" },
                0
            );
    }
}

function createPortfolioMove(e) {
    const { clientY } = e;

    // move large image
    gsap.to(largeImage, {
        duration: 1.2,
        y: getPortfolioOffset(clientY) / 5,
        ease: "Power3.out",
    });

    // move small image
    gsap.to(smallImage, {
        duration: 1.5,
        y: getPortfolioOffset(clientY) / 12,
        ease: "Power3.out",
    });
}

function getPortfolioOffset(clientY) {
    return -(
        document.querySelector(".portfolio__categories").clientHeight - clientY
    );
}

function initImageParallax() {
    // select all section .with-parallax
    gsap.utils.toArray(".with-parallax").forEach((section) => {
        // get the image
        const image = section.querySelector("img");

        // create tween for the image
        gsap.to(image, {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top bottom",
                scrub: true,
            },
        });
    });
}

function initPinSteps() {
    ScrollTrigger.create({
        trigger: ".fixed-nav",
        start: "top center",
        endTrigger: "#stage4",
        end: "center center",
        pin: true,
        // markers: true,
    });

    const getVh = () => {
        const vh = Math.max(
            document.documentElement.clientHeight || 0,
            window.innerHeight || 0
        );
        return vh;
    };

    const updateBodyColor = (color) => {
        // gsap.to(".fill-background", { backgroundColor: color, ease: "none" });
        document.documentElement.style.setProperty("--bgc-fill-color", color);
    };

    gsap.utils.toArray(".stage").forEach((stage, index) => {
        const navLinks = gsap.utils.toArray(".fixed-nav li");

        ScrollTrigger.create({
            trigger: stage,
            start: "top center",
            end: () => `+=${stage.clientHeight + getVh() / 10}`,
            toggleClass: {
                targets: navLinks[index],
                className: "is-active",
            },
            // markers: true,
            onEnter: () => updateBodyColor(stage.dataset.color),
            onEnterBack: () => updateBodyColor(stage.dataset.color),
        });
    });
}

function initScrollTo() {
    // find all links and animate to the right position
    gsap.utils.toArray(".fixed-nav a").forEach((link) => {
        const target = link.getAttribute("href");

        link.addEventListener("click", (e) => {
            e.preventDefault();
            gsap.to(window, {
                duration: 1.5,
                scrollTo: target,
                ease: "Power2.out",
            });
        });
    });
}

function init() {
    initNavigation();
    initHeaderTilt();
    handleWidthChange(mq);
    initPortfolioHover();
    initImageParallax();
    initPinSteps();
    initScrollTo();
}

window.addEventListener("load", function () {
    init();
});
