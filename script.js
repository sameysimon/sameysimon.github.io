const path1 = document.getElementById("path1");
const path2 = document.getElementById("path2");
const currPath = path1;
path2.style.opacity=0;

const train = document.getElementById("train");
const per1 = document.getElementById("per1");

let pathLength= currPath.getTotalLength();
currPath.style.strokeDasharray = pathLength + ' ' + pathLength;
currPath.style.strokeDashoffset = pathLength;
function update() {
    var scrollPercent = (document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight);
    var drawLength = pathLength * scrollPercent;
    
    // Change blue length
    currPath.style.strokeDashoffset = pathLength - drawLength;

    // Set train position
    const endPoint = currPath.getPointAtLength(Math.min(Math.max(drawLength, 0), pathLength));
    train.setAttribute('transform', `translate(${endPoint.x - 3}, ${endPoint.y-3})`);

    // Set person 1
    const per1Point = currPath.getPointAtLength(pathLength * 0.7);
    per1.setAttribute('transform', `translate(${per1Point.x - 2}, ${per1Point.y-2})`);

}
window.addEventListener("scroll", update);
window.addEventListener("resize", update);
update();