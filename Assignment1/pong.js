"use strict";
function pong() {
    const svg = document.getElementById("canvas"), my_net = new Elem(svg, 'line')
        .attr('x1', "300").attr('y1', "40")
        .attr('x2', "300").attr('y2', "560")
        .attr('stroke-dasharray', '10 5')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', "0.2rem");
    function dragPaddle(svg) {
        const mousemove = Observable.fromEvent(svg, 'mousemove'), mouseup = Observable.fromEvent(svg, 'mouseup');
        const rect = new Elem(svg, 'rect')
            .attr('x', 100).attr('y', 300)
            .attr('width', 10).attr('height', 50)
            .attr('fill', 'white');
        rect.observe('mousedown')
            .map(({ clientY }) => ({ yOffset: Number(rect.attr('y')) - clientY }))
            .flatMap(({ yOffset }) => mousemove
            .takeUntil(mouseup)
            .map(({ clientY }) => ({ y: clientY + yOffset })))
            .subscribe(({ y }) => rect
            .attr('y', y));
        return rect;
    }
    const rect = dragPaddle(svg);
    let speedX = 3, speedY = 3, scoreA = 0, scoreB = 0;
    const maxX = 600, maxY = 560, minY = 40;
    function setAI() {
        const rectAI = new Elem(svg, 'rect')
            .attr('x', 500).attr('y', 300)
            .attr('width', 10).attr('height', 50)
            .attr('fill', 'white');
        return rectAI;
    }
    const rectAI = setAI();
    const a_ball = new Elem(svg, 'circle')
        .attr('cx', 300)
        .attr('cy', 500)
        .attr('r', 5)
        .attr('fill', "white");
    const o = Observable.interval(10)
        .map(() => ({ x: speedX + Number(a_ball.attr('cx')),
        y: speedY + Number(a_ball.attr('cy')) }));
    o.subscribe(({ x, y }) => {
        a_ball.attr('cx', x);
        a_ball.attr('cy', y);
    });
    o.map(({ x, y }) => ({ x, y: y * 0.86 }))
        .filter(({ x }) => x > 120 && x < 550)
        .subscribe(({ y }) => rectAI.attr('y', y));
    o.filter(({ x }) => x >= maxX && scoreA < 11)
        .subscribe(() => {
        scoreA += 1;
        const s = document.getElementById("player");
        s.innerHTML = "player:" + String(scoreA);
        a_ball.attr('cx', 300);
        a_ball.attr('cy', 500);
    });
    o.filter(({ x }) => x <= 0 && scoreB < 11)
        .subscribe(() => {
        scoreB += 1;
        const s = document.getElementById("player AI");
        s.innerHTML = "AI:" + String(scoreB);
        a_ball.attr('cx', 300);
        a_ball.attr('cy', 500);
    });
    o.filter(() => scoreA == 11)
        .subscribe(() => {
        const my_text = document.getElementById("text");
        my_text.textContent = "You Win!!";
    });
    o.filter(() => scoreB == 11)
        .subscribe(() => {
        const my_text = document.getElementById("text");
        my_text.textContent = "Game Over!!";
    });
    o.filter(({ y }) => y >= maxY)
        .subscribe(() => speedY *= -1);
    o.filter(({ y }) => y <= minY)
        .subscribe(() => speedY *= -1);
    o.filter(({ x }) => x <= Number(rect.attr('x')) + Number(rect.attr('width')) && x >= Number(rect.attr('x')))
        .filter(({ y }) => y >= Number(rect.attr('y'))
        && y <= Number(rect.attr('y')) + Number(rect.attr('height')))
        .subscribe(() => speedX *= -1);
    o.filter(({ x }) => x >= Number(rectAI.attr('x')) && x <= Number(rectAI.attr('x')) + Number(rectAI.attr('width')))
        .filter(({ y }) => y >= Number(rectAI.attr('y'))
        && y <= Number(rectAI.attr('y')) + Number(rectAI.attr('height')))
        .subscribe(() => speedX *= -1);
}
if (typeof window != 'undefined')
    window.onload = () => {
        pong();
    };
//# sourceMappingURL=pong.js.map