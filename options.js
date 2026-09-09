// Sistema de Imagem de player

const imageField = document.getElementById("image-field")
const playerImg = document.getElementById("playerImg")

imageField.addEventListener('change', function() {
    RenderPlayerImage()
}); 

function RenderPlayerImage() {
    ficha.imagem = imageField.value
    playerImg.style.backgroundImage = "url(" + imageField.value + ")";
    verifyAutoSave()
}

// Sistema de Background

const backgrounds = [
    "wallpaperMedo.png",
    "wallpaperRealidade.png",
    "wallpaperEnergia.png",
    "wallpaperSangue.png",
]

const backgroundsRoots = [
    {
        "main":"white",
        "sec": "black",
        "btnBg": "rgb(239, 239, 239)",
        "btnHvr": "rgb(205, 205, 205)",
        "btnTx": "black",
        "ter": "#929292",
        "uTb": "",
        "sc": "#333333"
    },
    {
        "main":"black",
        "sec": "black",
        "btnBg": "rgb(17, 2, 2)",
        "btnHvr": "rgb(40, 3, 3)",
        "btnTx": "white",
        "ter": "#160f0f",
        "uTb": "#0000007a",
        "sc": "#333333"

    },
    {
        "main":"white",
        "sec": "black",
        "btnBg": "rgb(239, 239, 239)",
        "btnHvr": "rgb(205, 205, 205)",
        "btnTx": "black",
        "ter": "#555",
        "uTb": "",
        "sc": "#5E13CF"

    },
    {
        "main":"white",
        "sec": "black",
        "btnBg": "rgb(239, 239, 239)",
        "btnHvr": "rgb(205, 205, 205)",
        "btnTx": "black",
        "ter": "#c1c1c1",
        "uTb": "",
        "sc": "#CB0E09"
    },
]

function setWallpaper(value) {

    if (value == 'custom') {
        setCustomWallpaper(ficha.customWallpaper)
        return;
    }

    if (!(0 < value <= backgrounds.length)) return;

    ficha.options.wallpaper = value
    if(window.innerWidth < 500 && ficha.options.translucidPer) {
        periciasDisplayer.style.backgroundImage = 'url(img/backgrounds/'+backgrounds[value]+')'
    }
    document.querySelector('body').style.backgroundImage = 'url(img/backgrounds/'+backgrounds[value]+')'
    const root = document.documentElement;
    const bgr =  backgroundsRoots[value]
    root.style.setProperty ('--main-clr', bgr.main);
    root.style.setProperty ('--sec-clr', bgr.sec);
    root.style.setProperty ('--btn-bg', bgr.btnBg);
    root.style.setProperty ('--btn-hvr', bgr.btnHvr);
    root.style.setProperty ('--btn-tx', bgr.btnTx);
    root.style.setProperty ('--ter-clr', bgr.ter);
    root.style.setProperty ('--un-tab-clr', bgr.uTb);
    root.style.setProperty ('--slider-clr', bgr.sc);
    
    verifyAutoSave()
}

function setCustomWallpaper(settings) {

    ficha.options.wallpaper = 'custom';
    ficha.customWallpaper = settings;

    if(window.innerWidth < 500 && ficha.options.translucidPer) {
        periciasDisplayer.style.backgroundImage = 'url('+backgrounds[value]+')'
    }
    document.querySelector('body').style.backgroundImage = 'url(' + settings.bg + ')'

    const root = document.documentElement;

    root.style.setProperty ('--main-clr', settings.main);
    root.style.setProperty ('--sec-clr', settings.sec);
    root.style.setProperty ('--btn-bg', settings.btnBg);
    root.style.setProperty ('--btn-hvr', settings.btnHvr);
    root.style.setProperty ('--btn-tx', settings.btnTx);
    root.style.setProperty ('--ter-clr', settings.ter);
    root.style.setProperty ('--un-tab-clr', settings.uTb);
    root.style.setProperty ('--slider-clr', settings.sc);

    verifyAutoSave()
}

setWallpaper(ficha.options.wallpaper) //init

// Opções

const statusModifierEdit = document.getElementById('statusModifierEdit')

function changestatusModifier(value) {

function turnStatusModifier() {
    ficha.options.statusModifier = !ficha.options.statusModifier 
    statusModifier.style.display = ficha.options.statusModifier? "flex": "none"
    verifyAutoSave()
}

    statusModifierValue = value

    if(document.getElementsByClassName('on').length == 1) document.getElementsByClassName('on')[0].classList.remove('on');
    document.getElementById(value+"-dM").classList.add('on')
}

function turnPerTranslucid() {
    ficha.options.translucidPer = !ficha.options.translucidPer
    document.getElementById('periciasDisplayer').classList.toggle('translucid')
    if (!ficha.options.translucidPer) periciasDisplayer.style.backgroundImage = "" ;
    const translucidPerOp = ficha.options.translucidPer? "(on)": "(off)"
    document.getElementById('translucidPerBtn').innerHTML = "Pericias translucidas " + translucidPerOp;
    verifyAutoSave()
}

function turnPerBlur() {
    ficha.options.blurPer = !ficha.options.blurPer
    document.getElementById('periciasDisplayer').classList.toggle('blur')
    const blurPerOp = ficha.options.blurPer? "(on)": "(off)"
    document.getElementById('blurPerBtn').innerHTML = "Blur nas pericias " + blurPerOp;
 
    verifyAutoSave()
}

document.getElementById('perBlurInput').addEventListener('change', function() {
    console.log(this.value)
    ficha.options.blurPerValue = this.value
    const root = document.documentElement;
    root.style.setProperty ('--blur-per', ficha.options.blurPerValue + "px");
    verifyAutoSave()
})

function changeAutoSave() {
    const changeAutoSaveBtn = document.getElementById("changeAutoSaveBtn")
    ficha.options.autoSave = !ficha.options.autoSave;
    verifyAutoSave()

    if (ficha.options.autoSave) {
        changeAutoSaveBtn.innerHTML = "Salvamento Automatico Ligado"
    } else {
        changeAutoSaveBtn.innerHTML = "Salvamento Automatico Desligado"
    }
}

function changeFastLogin() {
    const changeFastLoginBtn = document.getElementById("changeFastLoginBtn")

    localStorage.setItem('fastLogin', !localStorage.getItem('fastLogin')||false)
    verifyAutoSave()

    if (localStorage.getItem('fastLogin')) {
        changeFastLoginBtn.innerHTML = "Carregamento Rápido Ligado"
    } else {
        changeFastLoginBtn.innerHTML = "Carregamento Rápido Desligado"
    }
}

// TODAS NOVAS FUNÇÕES VÃO EM CIMA DESSA
function loadUserOptions() {
    if(!ficha.options.blurPer) ficha.options.blurPer = 5

    document.getElementById('perBlurInput').value = ficha.options.blurPerValue;
    const blurPerOp = ficha.options.blurPer? "(on)": "(off)"
    document.getElementById('blurPerBtn').innerHTML = "Blur nas pericias " + blurPerOp
    const translucidPerOp = ficha.options.translucidPer? "(on)": "(off)"
    document.getElementById('translucidPerBtn').innerHTML = "Pericias translucidas " + translucidPerOp;

    const root = document.documentElement;
    root.style.setProperty ('--blur-per', ficha.options.blurPerValue + "px");

    if (ficha.options.statusModifier) {
        statusModifierEdit.style.display = 'flex'
    }else {
        statusModifierEdit.style.display = "none"
    }
    if(ficha.options.translucidPer) {
        periciasDisplayer.style.backgroundImage = document.querySelector('body').style.backgroundImage ;
        document.getElementById('periciasDisplayer').classList.add('translucid')
    }
    else {
        periciasDisplayer.style.backgroundImage = "" ;
    }
    if(ficha.options.blurPer) {
        document.getElementById('periciasDisplayer').classList.add('blur')
    }
    const changeAutoSaveBtn = document.getElementById("changeAutoSaveBtn")
    if (ficha.options.autoSave) {
        changeAutoSaveBtn.innerHTML = "Salvamento Automatico Ligado"
    } else {
        changeAutoSaveBtn.innerHTML = "Salvamento Automatico Desligado"
    }
    

    const changeFastLoginBtn = document.getElementById("changeFastLoginBtn")
    if (localStorage.getItem('fastLogin')) {
        changeFastLoginBtn.innerHTML = "Carregamento Rápido Ligado"
    } else {
        changeFastLoginBtn.innerHTML = "Carregamento Rápido Desligado"
    }
    verifyAutoSave()
}

//Vai pra parte de saves
function verifyAutoSave() {
    if (!ficha.options.autoSave) return;
    save(false)
}

/**
 *     const exampleMod = {

        id: "example_magic",

        name: "Example Magic Mod",

        author: 'Babydragon',

        version: "1.0",

        description:
            "MOD OFICIAL DA CAMPANHA Eternal Midnight Trip.",

        skills: [

            {

                name: "Shadow Bolt",

                description:
                    "MOD OFICIAL DA CAMPANHA Eternal Midnight Trip.",

                dice: "2d8+4"

            }

        ],

        statuses: [

            {
                id: "cm",
                name: "Calma",
                max: 100,
                value: 50,
                background:"https://i.imgur.com/KjoMoq3.png",
                fillColor: "#57e389ff"
            },
            {
                id: "en",
                name: "Energia",
                max: 100,
                value: 50,
                background:"https://i.imgur.com/ykWerrn.png",
                fillColor: "#c061cbff"
            }

        ],

        options: {

            enableCorruption: true,

            damageMultiplier: 2

        }

    };
 */
