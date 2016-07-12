export interface Vec2D {
    x: number;
    y: number;
}

export function vec(x: any, y: number): Vec2D {
    return { x, y };
}

export function vcopy(v: Vec2D): Vec2D {
    return { x: v.x, y: v.y };
}

export function vadd(a: Vec2D, b: Vec2D): Vec2D {
    return { x: a.x + b.x, y: a.y + b.y };
}

export function vsub(a: Vec2D, b: Vec2D): Vec2D {
    return vec(a.x - b.x, a.y - b.y);
}

export function vmul(a: Vec2D, b: Vec2D): Vec2D {
    return { x: a.x * b.x, y: a.y * b.y };
}

export function vsqrt(v: Vec2D): Vec2D {
    return { x: Math.sqrt(v.x), y: Math.sqrt(v.y) };
}