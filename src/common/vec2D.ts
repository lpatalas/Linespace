interface Vec2D {
    x: number;
    y: number;
}

function vec(x: any, y: number): Vec2D {
    return { x, y };
}

function vcopy(v: Vec2D): Vec2D {
    return { x: v.x, y: v.y };
}

function vadd(a: Vec2D, b: Vec2D): Vec2D {
    return { x: a.x + b.x, y: a.y + b.y };
}

function vsub(a: Vec2D, b: Vec2D): Vec2D {
    return vec(a.x - b.x, a.y - b.y);
}

function vmul(a: Vec2D, b: Vec2D): Vec2D {
    return { x: a.x * b.x, y: a.y * b.y };
}

function vsqrt(v: Vec2D): Vec2D {
    return { x: Math.sqrt(v.x), y: Math.sqrt(v.y) };
}

function vdist(a: Vec2D, b: Vec2D): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx*dx + dy*dy);
}
