class Viewport {
    constructor(canvas) {
        this.canvas = canvas;

        /** @type {CanvasRenderingContext2D} */
        this.ctx = canvas.getContext("2d");

        this.zoom = 1;
        this.center = new Point(canvas.width / 2, canvas.height / 2);
        this.offset = scale(this.center, -1);

        this.drag = {
            start: new Point(0, 0),
            end: new Point(0, 0),
            offset: new Point(0, 0),
            active: false
        };

        this.#addEventListeners();
    }

    reset() {
        this.ctx.restore();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(this.center.x, this.center.y);
        this.ctx.scale(1 / this.zoom, 1 / this.zoom);
        const offset = this.getOffset();
        this.ctx.translate(offset.x, offset.y);
    }

    getMouse(event, subtractDragOffset = false) {
        const p = new Point(
            (event.offsetX - this.center.x) * this.zoom - this.offset.x,
            (event.offsetY - this.center.y) * this.zoom - this.offset.y
        );

        return subtractDragOffset ? subtract(p, this.drag.offset) : p;
    }

    getOffset() {
        return add(this.offset, this.drag.offset);
    }

    #addEventListeners() {
        this.canvas.addEventListener("mousewheel", (event) => {
            this.#handleMouseWheel(event);
        });

        this.canvas.addEventListener("mousedown", (event) => {
            this.#handleMouseDown(event);
        });

        this.canvas.addEventListener("mousemove", (event) => {
            this.#handleMouseMove(event);
        });

        this.canvas.addEventListener("mouseup", (event) => {
            this.#handleMouseUp(event);
        });

    }

    #handleMouseWheel(event) {
        const dir = Math.sign(event.deltaY);
        const step = 0.1;
        this.zoom += dir * step;
        this.zoom = Math.max(1, Math.min(5, this.zoom));
    }

    #handleMouseDown(event) {
        if (event.button == 1) { //middle button
            this.drag.start = this.getMouse(event);
            this.drag.active = true;
        }
    }

    #handleMouseMove(event) {
        if (this.drag.active) {
            this.drag.end = this.getMouse(event);
            this.drag.offset = subtract(this.drag.end, this.drag.start);
        }
    }

    #handleMouseUp(event) {
        if (this.drag.active) {
            this.offset = add(this.offset, this.drag.offset);

            this.drag = {
                start: new Point(0, 0),
                end: new Point(0, 0),
                offset: new Point(0, 0),
                active: false
            };
        }
    }
}