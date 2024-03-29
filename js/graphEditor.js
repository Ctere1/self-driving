class GraphEditor {
    constructor(viewport, graph) {
        this.viewport = viewport;
        this.canvas = viewport.canvas;
        this.graph = graph;

        /** @type {CanvasRenderingContext2D} */
        this.ctx = this.canvas.getContext("2d");
        this.selected = null;
        this.hovered = null;
        this.dragging = false;
        this.mouse = null;

        this.#addEventListeners();
    }

    #addEventListeners() {
        this.canvas.addEventListener("mousedown", (event) => {
            this.#handleMouseDown(event);
        });

        this.canvas.addEventListener("mousemove", (event) => {
            this.#handleMouseMove(event);
        });

        this.canvas.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });

        this.canvas.addEventListener("mouseup", (event) => {
            event.preventDefault();
            this.dragging = false;
        });
    }

    #handleMouseMove(event) {
        this.mouse = this.viewport.getMouse(event, true);
        this.hovered = getNearestPoint(this.mouse, this.graph.points, 10 * this.viewport.zoom);
        if (this.dragging == true) {
            this.selected.x = this.mouse.x;
            this.selected.y = this.mouse.y;
        }
    }

    #handleMouseDown(event) {
        if (event.button == 2) { //right click
            if (this.selected) {
                this.selected = null;
            } else {
                this.#removePoint(this.hovered);
            }
        }
        if (event.button == 0) { //left click
            if (this.hovered) {
                this.#select(this.hovered);
                this.dragging = true;
                return;
            }
            this.graph.addPoint(this.mouse);
            this.#select(this.mouse);
            this.hovered = this.mouse;
        }
    }

    #select(point) {
        if (this.selected) {
            this.graph.tryAddSegment(new Segment(this.selected, point));
        }
        this.selected = point;
    }


    #removePoint(point) {
        this.graph.removePoint(point)
        if (this.selected == point) {
            this.selected = null;
        }
        this.hovered = null;
    }

    dispose() {
        this.graph.dispose();
        this.selected = null;
        this.hovered = null;
        this.dragging = false;
        this.mouse = null;
    }

    display() {
        this.graph.draw(this.ctx);
        if (this.selected) {
            const intent = this.hovered ? this.hovered : this.mouse;
            new Segment(this.selected, intent).draw(ctx, { dash: [3, 3] });
            this.selected.draw(this.ctx, { outline: true });
        }

        if (this.hovered) {
            this.hovered.draw(this.ctx, { fill: true });
        }

    }
}