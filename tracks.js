const trackOnePeople = document.getElementsByClassName("per_t1");
const trackTwoPer = document.getElementById("per6");

const path1 = document.getElementById("path1");
const path1_base = document.getElementById("path1_base");
const path2 = document.getElementById("path2");
const path2_base = document.getElementById("path2_base");

const page = document.getElementsByClassName("page")[0];
const pageHeight = page.offsetHeight;
console.log(pageHeight);
path1_base.setAttribute("d", `M 2.9224995,5 V ${pageHeight * (250/1268)} v 125`);
path1.setAttribute("d", `M 2.9224995,5 V ${pageHeight * (250/1268)} v 125`);

let path_2_path = `m 2.9226142,5
    v ${pageHeight * (264/1268)}
    c 0,3 1,7 7,13
    2,2 8,8 8,21
    v 16.79129
    c 0,3 -1,7 -7,13
    -2,2 -8,8 -8,21
    v 17`;

path2_base.setAttribute("d", path_2_path);
path2.setAttribute("d", path_2_path);
                    
document.getElementById("svg").setAttribute("viewBox", `0 0 48 ${pageHeight * (250/1268) + 130}`);

const pathLenRatio = (path1.getTotalLength() / path2.getTotalLength());
const swchG = document.getElementById("switchG");
const swchMsg = document.getElementById("switchMsg");
let msgOn = false;
let curr = 0;
let currPath = path1;
path2.style.opacity=0;

const train = document.getElementById("train");
const per1 = document.getElementById("per1");

// Distances of objects along the path.
const personDist = [0,1,2,3,4,5].map((i) => {
    return i===5 ? path2.getTotalLength() - 70 : path1.getTotalLength() - 85 + (i*7)
});
const switchDist = path1.getTotalLength() - 115;

// initial position
for (let i = 0; i < trackOnePeople.length; i++) {
    let point = path1.getPointAtLength(personDist[i]);
    let p = trackOnePeople[i];
    p.setAttribute('transform', `translate(${point.x - 3}, ${point.y})`);
}
let point = path1.getPointAtLength(switchDist);
let switchX = point.x + 8;
let switchY = point.y;
swchG.setAttribute('transform', `translate(${switchX}, ${switchY}) scale(-1,1)`);

swchMsg.setAttribute('transform', `translate(${switchX + 4}, ${switchY+2.5})`);

point = path2.getPointAtLength(personDist[5])
per6.setAttribute('transform', `translate(${point.x - 3}, ${point.y})`);


let updateCallbacks = [];

// Set train position
updateCallbacks.push((pathLength, scrollPercent, drawLength) => {
    const endPoint = currPath.getPointAtLength(Math.min(Math.max(drawLength, 0), pathLength));
    train.setAttribute('transform', `translate(${endPoint.x}, ${endPoint.y})`);
});
console.log(trackOnePeople);
// Call back for every person emotion update.
for (let i = 0; i <= trackOnePeople.length; i++) {
    const p = i===5 ? trackTwoPer : trackOnePeople[i];
    const personPos = personDist[i]
    const onTrack = i===5 ? curr===1 : curr===0;
    updateCallbacks.push((pathLength, scrollPercent, drawLength) => {
        if (personPos > drawLength) {
            p.setAttribute('href', "images/Concern.svg")                    
        }
        if ((personPos - drawLength) / personPos < 0.05 ) {
            p.setAttribute('href', "images/Worried.svg")                    
        }
        if (personPos <= drawLength) {
            if (onTrack) {
                p.setAttribute('href', "images/Hurt.svg")
            } else {
                p.setAttribute('href', "images/Relief.svg")
            }
        }
    });
}

updateCallbacks.push((pathLength, scrollPercent, drawLength) => {
    document.getElementById("debug").innerText = 
    `scrollPercent: ${scrollPercent.toFixed(2)}, drawLength: ${drawLength.toFixed(2)} Debug text left in for fun.
    Hit F to hide.`;
});

const heading = document.getElementById("heading");
const explainers = [document.getElementById("e1"), document.getElementById("e2"), document.getElementById("e3"), document.getElementById("e4")];

updateCallbacks.push((pathLength, scrollPercent, drawLength) => {
    if (scrollPercent > 0.75) {
        heading.innerText = curr === 0 ? "UTILITARIAN" : "DEONTOLOGICAL";
        explainers[0].innerText = curr === 0 ? 
            "By remaining a bystander, you have not directly caused harm, though you may have allowed it to occur."
            : "By pulling the switch, you have prevented harm to the five, though you have directly harmed one.";
        heading.style.opacity = (scrollPercent - 0.75) * 4;
        for (let i = 0; i < explainers.length; i++) {
            let per =  0.76 + (i * 0.05);
            let rec = 1 - per;
            explainers[i].style.opacity = (scrollPercent - per) * (1/rec);
        }
    } else {
        heading.style.opacity = 0;
        for (let i = 0; i < explainers.length; i++) {
            explainers[i].style.opacity = 0;
        }
    }
});


function update() {
    // Get scroll percentage and corresponding length along the path
    let pathLength = currPath.getTotalLength();
    currPath.style.strokeDasharray = pathLength + ' ' + pathLength;
    currPath.style.strokeDashoffset = pathLength;
    var scrollPercent = (document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight);
    var drawLength = pathLength * scrollPercent;
    if (curr===1) {
        if (scrollPercent>0.9) {
            drawLength = pathLength * (pathLenRatio / (1 - (scrollPercent - 0.9))) * scrollPercent;
        } else {
            drawLength = pathLength * pathLenRatio * scrollPercent;
        }
    }
    currPath.style.strokeDashoffset = pathLength - drawLength;
    // Update any callbacks (e.g. for updating emotion)
    for (let cb of updateCallbacks) {
        cb(pathLength, scrollPercent, drawLength)
    }
}


window.addEventListener("scroll", update);
window.addEventListener("resize", update);
update();
//
// Switch track on click and make message (re-)appear
//
document.getElementById("switch").onclick = () => {
    var scrollPercent = (document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight);
    var drawLength = currPath.getTotalLength() * scrollPercent;
    if (curr === 0) {
        if (switchDist < drawLength) {
            swchMsg.setAttribute("opacity", 1);
            return;
        } else {
            swchMsg.setAttribute("opacity", 0);
        }
        currPath = path2;
        path2.style.opacity = 1;
        path1.style.opacity = 0;
        curr = 1;
        swchG.setAttribute('transform', `translate(${switchX}, ${switchY})`);
    } else {
        if (switchDist < drawLength) {
            swchMsg.setAttribute("opacity", 1);
            return;
        } else {
            swchMsg.setAttribute("opacity", 0);
        }
        currPath = path1;
        path2.style.opacity = 0;
        path1.style.opacity = 1;
        curr = 0;
        swchG.setAttribute('transform', `translate(${switchX}, ${switchY}) scale(-1,1)`);
    }
    update();
};

window.addEventListener("keydown", (e) => {
    if (e.key === "d") {
        document.getElementById("debug").style.display = "block";
    }
    if (e.key === "f") {
        document.getElementById("debug").style.display = "none";
    }
});