"use strict";

const screen = document.getElementById("screen");
const xmlns = "http://www.w3.org/2000/svg";
const xlinkns = "http://www.w3.org/1999/xlink";
const RAD_TO_DEG = 180 / Math.PI; 

const canvas = document.getElementById("fireSparks");
const ctx = canvas.getContext("2d", { alpha: true });

let width, height;
const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
};
window.addEventListener("resize", resize, { passive: true });
resize();

const pointer = {
    x: width / 2,
    y: height / 2,
    isIdle: true,
    idleTimer: null
};

const updatePointer = (x, y) => {
    pointer.x = x;
    pointer.y = y;
    pointer.isIdle = false;
    clearTimeout(pointer.idleTimer);
    pointer.idleTimer = setTimeout(() => { pointer.isIdle = true; }, 2000); 
};

window.addEventListener("pointermove", (e) => updatePointer(e.clientX, e.clientY), { passive: true });
window.addEventListener("touchstart", (e) => updatePointer(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
window.addEventListener("touchmove", (e) => updatePointer(e.touches[0].clientX, e.touches[0].clientY), { passive: true });

class Spark {
    constructor(x, y) {
        this.x = x + (Math.random() - 0.5) * 40;
        this.y = y + (Math.random() - 0.5) * 40;
        this.vx = (Math.random() - 0.5) * 3;
        this.vy = -(Math.random() * 3 + 1);
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        this.size = Math.random() * 4 + 1;
        
        const hue = Math.floor(Math.random() * 50); 
        this.color = `hsl(${hue}, 100%, 60%)`;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        this.size *= 0.96;
    }

    draw() {
        if (this.life <= 0) return;
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const sparks = [];

const N = 40; 
const WING_SEGMENTS = [8, 14]; 

class DragonSegment {
    constructor(index) {
        this.index = index;
        this.x = width / 2;
        this.y = height / 2;
        this.use = null;
        this.scale = (162 + 4 * (1 - index)) / 50;
        this.isWing = WING_SEGMENTS.includes(index);
    }

    initDOM() {
        if (this.index === 0) return; 

        const elem = document.createElementNS(xmlns, "use");
        this.use = elem;

        let useId = "Espina"; 
        if (this.index === 1) useId = "Cabeza"; 
        else if (this.isWing) useId = "Aletas"; 

        elem.setAttributeNS(xlinkns, "xlink:href", "#" + useId);
        screen.prepend(elem);
    }

    update(prevSegment, frame) {
        const dx = this.x - prevSegment.x;
        const dy = this.y - prevSegment.y;
        const angle = Math.atan2(dy, dx);

        const targetX = prevSegment.x + (Math.cos(angle) * (100 - this.index)) / 5;
        const targetY = prevSegment.y + (Math.sin(angle) * (100 - this.index)) / 5;

        this.x += (targetX - this.x) / 4;
        this.y += (targetY - this.y) / 4;

        if (this.use) {
            let flap = 0;
            let scaleFlap = 1;

            if (this.isWing) {
                flap = Math.sin(frame * 20) * 15;
                scaleFlap = 1 + Math.sin(frame * 20) * 0.1;
                
                if (Math.random() < 0.3) {
                    sparks.push(new Spark(this.x, this.y));
                }
            }
            
            if (this.index === 1 && Math.random() < 0.15) {
                sparks.push(new Spark(this.x, this.y));
            }

            const renderX = (prevSegment.x + this.x) / 2;
            const renderY = (prevSegment.y + this.y) / 2;
            const renderAngle = angle * RAD_TO_DEG + flap;

            this.use.setAttributeNS(
                null,
                "transform",
                `translate(${renderX},${renderY}) rotate(${renderAngle}) scale(${this.scale * scaleFlap},${this.scale})`
            );
        }
    }
}

const segments = Array.from({ length: N }, (_, i) => {
    const seg = new DragonSegment(i);
    seg.initDOM();
    return seg;
});

let frm = Math.random();
let idleAngle = 0;

const run = () => {
    ctx.clearRect(0, 0, width, height);

    frm += 0.003;

    if (pointer.isIdle) {
        idleAngle += 0.015;
        const idleRadiusX = width * 0.35;
        const idleRadiusY = height * 0.25;
        const autoTargetX = width / 2 + Math.cos(idleAngle) * idleRadiusX;
        const autoTargetY = height / 2 + Math.sin(idleAngle * 2) * idleRadiusY;
        
        pointer.x += (autoTargetX - pointer.x) * 0.05;
        pointer.y += (autoTargetY - pointer.y) * 0.05;
    }

    const headNode = segments[0];
    const ax = Math.cos(3 * frm) * 20 * (width / height);
    const ay = Math.sin(4 * frm) * 20 * (height / width);

    headNode.x += (ax + pointer.x - headNode.x) / 10;
    headNode.y += (ay + pointer.y - headNode.y) / 10;

    for (let i = 1; i < N; i++) {
        segments[i].update(segments[i - 1], frm);
    }

    for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.update();
        p.draw();
        if (p.life <= 0 || p.size <= 0.5) {
            sparks.splice(i, 1);
        }
    }

    requestAnimationFrame(run);
};

run();