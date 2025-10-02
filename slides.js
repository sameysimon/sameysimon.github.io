const slides = [
    {src:"images/slides/smallDetroit.webp", caption:"Great time speaking at AAMAS 2025 in Detroit MA."},
    {src:"images/slides/smallPoster.webp", caption:"Presenting a poster at AAMAS 2025."},
    {src:"images/slides/smallIFM.webp", caption:"Banquet at IFM 2025. I was a local organiser for the FMAS workshop."},
    {src:"images/slides/smallCA.webp", caption:"Lightning talk at SMC-IT/SCC 2025 in Mountain View, California."},
    {src:"images/slides/smallTracks.webp", caption:"Wintery train tracks outside Stockport."},
    {src:"images/slides/smallDog.webp", caption:"A small dog!"}
];
let currImg = 0;
const imgEle = document.getElementById('img');
const capEle = document.getElementById('caption');
function nextSlide(direction) {
    currImg+=direction;
    if (currImg>=slides.length) {
        currImg=0;
    }
    if (currImg< 0) {
        currImg= slides.length-1;
    }
    imgEle.setAttribute("src", slides[currImg].src);
    imgEle.setAttribute("alt", slides[currImg].caption);
    capEle.innerText = slides[currImg].caption;
}
nextSlide(0);