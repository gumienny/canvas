(function (){
    "use strict";
    
    const R       = 70;
    const RR      = 170;
    const AMOUNT  = 90;
    const PI      = Math.PI;
    const FPS     = 30;
    const COLOR_1 = "#ff0b1d";
    const COLOR_2 = "#310050";
    const SIDES   = 8;
    const BEND    = 3;
    const X       = 0.95;
    const WIDTH   = window.innerWidth;
    const HEIGHT  = window.innerHeight;

    let angle     = 0;

    function create_canvas() {
        const canvas = document.createElement("canvas");
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        canvas.style.position = "absolute";
        canvas.style.top = 0;
        canvas.style.left = 0;
        document.body.append(canvas);

        return canvas.getContext("2d");
    }

    function draw_slice(ctx, i) {
        ctx.save();
        ctx.rotate(i / AMOUNT * PI * 2);
        ctx.translate(RR, 0);
        ctx.rotate(angle + BEND * (i / AMOUNT) * (PI / 3));

        ctx.fillStyle = (i % 2 == 0) ? COLOR_1 : COLOR_2;
        ctx.beginPath();
        ctx.moveTo(R, 0);
        ctx.lineTo(R * X, 0);
        for (let j = 1; j < SIDES; j++) {
            ctx.lineTo(R * Math.cos(j / SIDES * PI * 2), R * Math.sin(j / SIDES * PI * 2));
            ctx.lineTo(R * X * Math.cos(j / SIDES * PI * 2), R * X * Math.sin(j / SIDES * PI * 2));
        }

        ctx.globalCompositeOperation = i >= AMOUNT + 2 ? "destination-out" : "source-over";
        ctx.fill();
        ctx.restore();
    }

    document.body.innerHTML = "";

    const c = create_canvas();
    const m = create_canvas();

    function draw() {
        c.fillRect(0, 0, WIDTH, HEIGHT);
        m.clearRect(0, 0, WIDTH, HEIGHT);

        c.save();
        m.save();

        c.translate(WIDTH / 2, HEIGHT / 2);
        m.translate(WIDTH / 2, HEIGHT / 2);

        for (let i = 0; i < AMOUNT + 15; i++) {
            if (i < AMOUNT - 15) {
                draw_slice(c, i);
            } else {
                draw_slice(m, i);
            }
        }
        
        c.restore();
        m.restore();
    }

    let fps, fpsInterval, startTime, now, then, elapsed;

    function animate() {
        requestAnimationFrame(animate);

        now = Date.now();
        elapsed = now - then;

        if (elapsed > fpsInterval) {
            then = now - (elapsed % fpsInterval);
            angle += 0.04;
            draw();
        }
    }

    fpsInterval = 1000 / FPS;
    then = Date.now();
    startTime = then;

    animate();

})();
