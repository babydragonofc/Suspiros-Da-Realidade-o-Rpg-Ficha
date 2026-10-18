const debug = false;
// :D

const siteVersion = "1.1.4.3"

const PASSOS_DE_DADOS = [
    '',
    '1d4',
    '1d6',
    '1d8',
    '1d10',
    '1d12',
    '1d20'
];

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

function happi() {
    panelOpen("Happi")
    createItem({
        name: "Carta Mêko",
        description: "Heitor, nn te conheço há tanto tempo assim, mas você demonstrou ser uma pessoa muito legal e engraçada. Você é esforçado, e eu sei que vai conseguir alcançar o IFCE, mesmo que seja uma jornada difícil, sei que você é capaz e seguirá forte. Feliz aniversário e parabéns pelos seus 15 anos! Muita coisa ainda está por vir.",
        weight: 0,
        type: "item",
        data: {
          "dice": "",
          "type": "documento"
        }
    }, 'content')
    createItem({
        name: "Carta Sara",
        description: "Feliz aniversário Heitor!! te conheço a tempo suficiente pra saber que você é uma pessoa incrível (e continue sendo). Enfim, parabéns!!! thanks a você for the momentos 👏🏻👏🏻",
        weight: 0,
        type: "item",
        data: {
          "dice": "",
          "type": "documento"
        }
    }, 'content')
    createItem({
        name: "Carta Vodka (Luk)",
        description: "Eae Heitor, feliz aniversário mano, eu sei que nem você me conhece muito e nem eu te conheço muito, mas mesmo assim, você demonstrou ser uma pessoa legal, e eu desejo o melhor pra você, muitos anos de vida, e não só de vida, de felicidade blz? Se cuida ae",
        weight: 0,
        type: "item",
        data: {
          dice: "",
          type: "documento"
        }
    }, 'content')
    createItem({
        name: "Carta Emilly",
        description: "4 anos, 4 anos que a gente é autista junto, 4 anos desde que a gente começou a conversar, incrível pensar que a gente já passou por tanta coisa junto. Minha segunda casa foi, por muito tempo, a sua. Todas as vezes que eu não conseguia fazer algo sozinha e você estava lá para me ajudar ou motivar. Te devo muita coisa. De todas as pessoas desse mundo, você é a mais especial e pura que eu conheço. Continue crescendo, continue aprendendo, errando, falhando, descobrindo e sendo você. Você tem um futuro do caralho, eu quero muito estar lá para ver. Feliz aniversário, Heitor.\n\n++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.++++++++++++..----.+++.---------------------------------------------------------.-----------..++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++...-------------------------------------------------------------------------.+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.----------.++++++.-.+.-------------------.+++.-------------------------------------------------------.+++++++++++++++++++++++++++++++++++++++++++++++++++++.++++++++++++.--.--------------------------------------------------------------.++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.----------------------.+++++++++++++++++++.-----------------.+++++.-----------------------------------------.+++++++++++++++++++++++++++++++++++++++++++++++++++++++.---------------------------------------------------------.+++++++++++++++++++++++++++++++++++++++.-------------------.++++++++++++++++++++++++++++++++++++++.-------------------------------------------------------------------.+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.--------------------------------------------------------------.++++++++++++++++++++++++++++++.++++++++++++++++.---------------.+++++++++++.------------------.-------------------------------------------.++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.-------------------------------------------------------.------------.++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.",
        weight: 0,
        type: "item",
        data: {
          dice: "",
          type: "documento"
        }
    }, 'content')
    createItem({
        name: "Leia por ultimo",
        description: "clique na imagem de player",
        weight: 0,
        type: "item",
        data: {
          dice: "",
          type: "documento"
        }
    }, 'content')


    document.getElementById('image-field').value = "https://miro.medium.com/v2/resize:fit:640/format:webp/0*BxwKYXDC_iv1vjlo";
    RenderPlayerImage()

    playerImg.addEventListener('click', function() {
        window.location.href = "https://www.youtube.com/watch?v=QpTrYnE9sWY";

    })
}

