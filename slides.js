const slides = [
    {src:"images/slides/smallDetroit.webp", fullSrc:"images/slides/6FA0BD10-4F03-470C-B87D-8A55DAB4F962_1_105_c.jpeg", caption:"Great time speaking at AAMAS 2025 in Detroit MA."},
    {src:"images/slides/smallPoster.webp", fullSrc:"images/slides/5A58F3AA-B6D7-477E-A06D-19F789E72495_4_5005_c.jpeg", caption:"Presenting a poster at AAMAS 2025."},
    {src:"images/slides/smallIFM.webp", fullSrc:"images/slides/62C827E9-29B4-4146-A830-E58639CC20A3_1_105_c.jpeg", caption:"Banquet at IFM 2024. I was a local organiser for the FMAS workshop."},
    {src:"images/slides/smallCA.webp", fullSrc:"images/slides/16B39A9A-2AD5-4B91-AEE1-52D058F192A5_1_105_c.jpeg", caption:"Lightning talk at SMC-IT/SCC 2024 in Mountain View, California."},
    {src:"images/slides/smallTracks.webp", fullSrc:"images/slides/331B4747-CC4C-49A3-8C68-7C657A2B9333_1_102_a.jpeg", caption:"Wintery train tracks outside Stockport."},
    {src:"images/slides/smallDog.webp", fullSrc:"images/slides/1DCF56A7-11DA-42D1-8F71-704D6C2C12C3_1_105_c.jpeg", caption:"A small dog!"}
];
let lastImg = slides.length-1;
let currImg = 0;
let nextImg = 1;
let isSlideShowMode = false;

const imgEle = document.getElementById('img');
const capEle = document.getElementById('caption');
function nextSlide(direction) {
    lastImg += direction;
    nextImg += direction;
    currImg+=direction;
    if (currImg>=slides.length) {
        lastImg = slides.length-1;
        currImg=0;
        nextImg = 1;
    }
    if (currImg < 0) {
        lastImg = slides.length-2;
        currImg= slides.length-1;
        nextImg = 0
    }
    if (isSlideShowMode) {
        lightboxImage.src = slides[currImg].fullSrc;
        lightboxCaption.innerText = slides[currImg].caption;
    }
    imgEle.setAttribute("src", slides[currImg].src);
    imgEle.setAttribute("alt", slides[currImg].caption);
    capEle.innerText = slides[currImg].caption;
    
    // preloading images either side
    const img = new Image();
    img.src = slides[nextImg].src;
    const img_ = new Image();
    img_.src = slides[lastImg].src;
}
nextSlide(0);

const lightboxModal = document.getElementById('lightboxModal');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxOverlay = document.querySelector('.lightbox-overlay');

imgEle.addEventListener('click', (e) => {
    openLightbox();
});

function openLightbox() {
    isSlideShowMode = true;
    lightboxImage.src = slides[currImg].fullSrc;
    lightboxCaption.innerText = slides[currImg].caption;
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    isSlideShowMode = false;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxOverlay.addEventListener('click', closeLightbox);

window.addEventListener('keydown', (e) => {
    if (lightboxModal.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    }
});
