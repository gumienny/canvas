/*
 * 22.05.2016
 * Paste this script into browser console.
*/

(function() {
    "use strict";

    const MAX_LIMIT = 12;

    const min   = Math.min;
    const max   = Math.max;
    const abs   = Math.abs;
    const floor = Math.floor;
    const pi    = Math.PI;

    const canvas = document.createElement("canvas");
    const c = canvas.getContext("2d");

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    canvas.style.position = "absolute";
    canvas.style.top = 0;
    canvas.style.left = 0;

    document.body.innerHTML = "";
    document.body.appendChild(canvas);

    let limit = 7;
    let cos_ratio = 0;
    let sin_ratio = 0;
    let global_angle = 0.2 * pi;
    
    const rgb_1 = [71,  242, 232];
    const rgb_2 = [247, 131, 254];
    let colors = get_gradient(rgb_1, rgb_2, limit);

    function set_angle(y) {
        return (pi / 2) * (y / height);
    }

    function get_gradient(from, to, steps = limit) {
        const colors = [];

        steps = max(steps, 2);

        for (let i = 0; i < steps; i++) {
            colors[i] = "rgb("
                + abs(from[0] + i * floor((to[0] - from[0]) / steps)) + ","
                + abs(from[1] + i * floor((to[1] - from[1]) / steps)) + ","
                + abs(from[2] + i * floor((to[2] - from[2]) / steps)) + ")";
        }

        return colors;
    }

    function rec(params) {
        let {left, right, angle, level} = params;

        c.rotate(angle);

        if (left >= 1) {
            c.fillStyle = colors[level - 1];
            c.fillRect(-left / 2, -left - right / 2, left, left);
        }

        if (level < limit) {
            c.translate(0, -left - right / 2);
            c.save();

            right = left * sin_ratio;
            left = left * cos_ratio;

            rec({"angle": -global_angle, left, right, "level": level + 1});
            rec({"angle": pi / 2 - global_angle, "right": left, "left": right, "level": level + 1});

        } else {
            c.restore();
        }
    }

    function tree() {
        cos_ratio = Math.cos(global_angle);
        sin_ratio = Math.sin(global_angle);

        c.save();
        c.fillStyle = "black";
        c.fillRect(0, 0, width, height);
        c.translate(width / 2, height);
        c.save();
        rec({"angle": 0, "left": height / 5, "right": 0, "level": 1});
        c.restore();
    }

    
    ["touchmove", "touchstart"].forEach(event_name => {
        canvas.addEventListener(event_name, evt => {
            evt.preventDefault();
            global_angle = set_angle(evt.changedTouches[0].pageY - canvas.getBoundingClientRect().top);

            tree();
        } );
    } );

    canvas.addEventListener("mousemove", evt => {
        evt.preventDefault();
        global_angle = set_angle(evt.clientY - canvas.getBoundingClientRect().top);
        tree();
    });

    window.addEventListener("keydown", evt => {
        let c = evt.keyCode;

        if (c === 38 || c === 39) {
            limit = min(++limit, MAX_LIMIT);
        } else if (c === 37 || c === 40) {
            limit = max(--limit, 1);
        }

        colors = get_gradient(rgb_1, rgb_2, limit);
        tree();
    });

    window.addEventListener("resize", () => {
        width  = canvas.width  = window.innerWidth;
        height = canvas.height = window.innerHeight;
        tree();
    });

    tree();
})();
