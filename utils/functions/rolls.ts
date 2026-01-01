export function rolld6(): number {
    return Math.floor(Math.random() * 6) + 1;
}

export function rolld66(): number {
    const first = Math.floor(Math.random() * 6) + 1;
    const second = Math.floor(Math.random() * 6) + 1;
    return parseInt(`${first}${second}`);
}

export function rolld2(): number {
    return Math.floor(Math.random() * 2) + 1;
}

export function rolld3(): number {
    return Math.floor(Math.random() * 3) + 1;
}

export function rolld4(): number {
    return Math.floor(Math.random() * 4) + 1;
}

export function rolld8(): number {
    return Math.floor(Math.random() * 8) + 1;
}

export function rolld10(): number {
    return Math.floor(Math.random() * 10) + 1;
}

export function rolld12(): number {
    return Math.floor(Math.random() * 12) + 1;
}

export function rolld20(): number {
    return Math.floor(Math.random() * 20) + 1;
}

export function rolld100(): number {
    return Math.floor(Math.random() * 100) + 1;
}

export function roll2d6(): number {
    const first = rolld6();
    const second =rolld6();
    return first + second;
}

