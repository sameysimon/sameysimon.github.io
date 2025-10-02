const trackOnePeople = document.getElementsByClassName("per_t1");
        const trackTwoPer = document.getElementById("per6");
        const path1 = document.getElementById("path1");
        const path2 = document.getElementById("path2");
        const pathLenRatio = (path1.getTotalLength() / path2.getTotalLength());
        const swchG = document.getElementById("switchG");
        const swchMsg = document.getElementById("switchMsg");
        let msgOn = false;
        let curr = 0;
        let currPath = path1;
        path2.style.opacity=0;
        
        const train = document.getElementById("train");
        const per1 = document.getElementById("per1");
        
        // initial position
        for (let i = 0; i < trackOnePeople.length; i++) {
            let point = path1.getPointAtLength(path1.getTotalLength() * 0.76 + (i*7));
            let p = trackOnePeople[i];
            p.setAttribute('transform', `translate(${point.x - 3}, ${point.y})`);
        }
        let point = path1.getPointAtLength(path1.getTotalLength() * 0.7);
        let switchX = point.x + 8;
        let switchY = point.y;
        swchG.setAttribute('transform', `translate(${switchX}, ${switchY}) scale(-1,1)`);

        swchMsg.setAttribute('transform', `translate(${switchX + 4}, ${switchY+2.5})`);

        point = path2.getPointAtLength(path2.getTotalLength() * 0.785);
        per6.setAttribute('transform', `translate(${point.x - 3}, ${point.y})`);



        
        function update() {
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
            
            // Change blue length
            currPath.style.strokeDashoffset = pathLength - drawLength;

            // Set train position
            const endPoint = currPath.getPointAtLength(Math.min(Math.max(drawLength, 0), pathLength));
            train.setAttribute('transform', `translate(${endPoint.x}, ${endPoint.y})`);
            
            function updateEmote(p, personPos, drawLength, onTrack) {
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
            }
            // Update people emotion
            for (let i = 0; i < trackOnePeople.length; i++) {
                let p = trackOnePeople[i];
                let personPos = path1.getTotalLength() * 0.77 + (i*7);
                updateEmote(p, personPos, drawLength, curr===0);
            }
            // Update single person emotion
            let p = trackTwoPer;
            let personPos = path2.getTotalLength() * 0.785;
            updateEmote(p, personPos, drawLength, curr===1);

        }
        window.addEventListener("scroll", update);
        window.addEventListener("resize", update);
        update();
        
        document.getElementById("switch").onclick = () => {
            var scrollPercent = (document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight);
            var drawLength = currPath.getTotalLength() * scrollPercent;
            if (curr === 0) {
                if (288 < drawLength) {
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
                if (296 < drawLength) {
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