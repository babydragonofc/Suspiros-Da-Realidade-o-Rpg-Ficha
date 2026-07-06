const debug = false
// :D

const siteVersion = "1.1.3.1"

const F = false;
const T = true;

const maxLevel = 6
const levelsRules = [
    {
        map: [
            [F,F,F,F,F],
            [F,F,F,F,F],
            [T,F,F,F,F],
            [T,T,F,F,F],
            [T,T,T,F,F],
        ],
        max: 6,
        min: 6,
    },
    {
        map: [
            [F,F,F,F,F],
            [T,F,F,F,F],
            [T,T,F,F,F],
            [T,T,T,F,F],
            [T,T,T,T,F],
        ],
        max: 10,
        min: 10,
    },
    {
        map: [
            [F,F,F,F,F],
            [T,F,F,F,F],
            [T,T,F,F,F],
            [T,T,T,F,F],
            [T,T,T,T,T],
        ],
        max: 11,
        min: 11,
    },
    {
        map: [
            [F,F,F,F,F],
            [T,F,F,F,F],
            [T,T,F,F,F],
            [T,T,T,T,F],
            [T,T,T,T,F],
        ],
        max: 12,
        min: 11, 
    },
    {
        map: [
            [F,F,F,F,F],
            [T,F,F,F,F],
            [T,T,T,F,F],
            [T,T,T,T,F],
            [T,T,T,T,T]
        ],
        max: 12,
        min: 11,
    },
    {
        map: [
            [F,F,F,F,F],
            [T,T,F,F,F],
            [T,T,F,F,F],
            [T,T,T,T,F],
            [T,T,T,T,T]
        ],
        max: 12,
        min: 11,
    },
    {
        map: [
            [T,F,F,F,F],
            [T,T,F,F,F],
            [T,T,T,F,F],
            [T,T,T,T,F],
            [T,T,T,T,T]
        ],
        max: 12,
        min: 11,
    }
]

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}