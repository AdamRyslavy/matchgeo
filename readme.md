#### syntaxe:

```javascript
const geo = new MatchGeometry({})
```

## atributy instance
- **el** => je element ze kterého má okno vyjít, spouštěč(povinný)
- **elTo** => je samotné okno, do kterého se chceme dostat, ze spouštěče
(*pokud nespecifikuji elTo, MatchGeometry bude považovat jako elTo, první přímé díťě, vychazejícíhé elementu*)
- **speed** => rychlost přechodu v milisekundách [nepovinné, přednastaveno: 350ms]
- **bezier** => specifikování bezierovi křivky pro typ přechodu [nepovinné, přednastaveno: easeOutQuart(cubic-bezier(0.25, 1, 0.5, 1))]
- **closeEl** => element, který slouží jako tlačítko pro zavření okna(nepovinný). MatchGeometry automaticky vytvoří zatmavené pozadí za daným oknem, 
pozadí je možno stylovat, pomocí metody styleBg(). Okno se automaticky zavírá, pokud uživatel klikne mimo něj

#### syntaxe:

```javascript
const geo = new MatchGeometry({
    el: '.vyjit',
    elTo: '.okno',
    closeEl: '.zavritBtn',
    speed: 400,
    bezier: 'ease-in',
})
```

metoda **styleBg** akceptuje jakoukoliv validní syntaxi CSS. Průhlednost pozadí zásadně specifikovat pomocí alpha hodnoty, než-li opacitou, jelikož by to 
zabraňovalo plynulému přechodu pozadí

#### syntaxe:

```javascript
geo.styleBg({
    backgroundColor: 'blue',
    backdropFilter: 'blur(10px)'
})
```

## Výkon
- všechny přechody se transformují, tudíž nezasahují do paint layoutu a nezpůsobují layout shift(stránka nepřepočítává každou změněnou souřadnici).
- používají se vlastnosti, které donutí engine vykreslovat pomocí GPU.

## Vykreslování textu
Jelikož, dané okna se škálují pomocí vlastností transform, u které může dojít, k rozmazaní textu,
po dokončení animace, se oknu nastaví pevné souřadnice[x,y]. Nemá vliv na výkon
x -> vzdálenost prostředku od vrcholu viewportu
y -> vzdálenost prostředku od levého kraje viewportu
