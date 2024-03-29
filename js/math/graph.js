class Graph {
    constructor(points = [], segments = []) {
        this.points = points;
        this.segments = segments;
    }

    static load(info) {
        const points = [];
        const segments = [];

        for (const point of info.points) {
            points.push(new Point(point.x, point.y));
        }

        for (const segment of info.segments) {
            segments.push(new Segment(
                points.find((p) => p.equals(segment.p1)),
                points.find((p) => p.equals(segment.p2))
            ));
        }

        return new Graph(points, segments);
    }

    addPoint(point) {
        this.points.push(point);
    }

    tryAddPoint(point) {
        if (!this.containsPoint(point)) {
            this.addPoint(point);
            return true;
        }
        return false;
    }

    addSegment(segment) {
        this.segments.push(segment);
    }

    tryAddSegment(segment) {
        if (!this.containsSegment(segment) && !segment.p1.equals(segment.p2)) {
            this.addSegment(segment);
            return true;
        }
        return false;
    }

    containsPoint(point) {
        return this.points.find((p) => p.equals(point));
    }

    containsSegment(segment) {
        return this.segments.find((s) => s.equals(segment));
    }

    removeSegment(segment) {
        this.segments.splice(this.segments.indexOf(segment), 1);
    }

    removePoint(point) {
        const segments = this.getSegmentsWithPoint(point);
        for (const seg of segments) {
            this.removeSegment(seg);
        }
        this.points.splice(this.points.indexOf(point), 1);
    }

    getSegmentsWithPoint(point) {
        const segments = [];
        for (const segment of this.segments) {
            if (segment.includes(point)) {
                segments.push(segment);
            }
        }
        return segments;
    }

    dispose() {
        this.points.length = 0;
        this.segments.length = 0;
    }

    draw(ctx) {
        for (const seg of this.segments) {
            seg.draw(ctx);
        }

        for (const point of this.points) {
            point.draw(ctx);
        }
    }
}