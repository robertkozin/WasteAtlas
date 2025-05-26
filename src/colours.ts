
let D = {
    name: "domestic",
    sub: "#9967C9",
    banner: "#9B67CC",
}

let C = {
    name: "construction",
    sub: "#FD4109",
    banner: "#FC4008",
}

let A = {
    name: "agricultural",
    sub: "#979C35",
    banner: "#979C35",
}

let I = {
    name: "industrial",
    sub: "#B6B4BF",
    banner: "#A1A1A1",
}

export let types: object = [D, C, A, I].reduce((acc, curr) => {acc[curr.name] = curr; return acc}, {})
