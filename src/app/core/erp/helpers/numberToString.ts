export function Unite(nombre) {
    let unite;
    switch (nombre) {
        case 0:
            unite = 'zéro';
            break;
        case 1:
            unite = 'un';
            break;
        case 2:
            unite = 'deux';
            break;
        case 3:
            unite = 'trois';
            break;
        case 4:
            unite = 'quatre';
            break;
        case 5:
            unite = 'cinq';
            break;
        case 6:
            unite = 'six';
            break;
        case 7:
            unite = 'sept';
            break;
        case 8:
            unite = 'huit';
            break;
        case 9:
            unite = 'neuf';
            break;
    }
    return unite;
}

export function Dizaine(nombre) {
    let dizaine;
    switch (nombre) {
        case 10:
            dizaine = 'dix';
            break;
        case 11:
            dizaine = 'onze';
            break;
        case 12:
            dizaine = 'douze';
            break;
        case 13:
            dizaine = 'treize';
            break;
        case 14:
            dizaine = 'quatorze';
            break;
        case 15:
            dizaine = 'quinze';
            break;
        case 16:
            dizaine = 'seize';
            break;
        case 17:
            dizaine = 'dix-sept';
            break;
        case 18:
            dizaine = 'dix-huit';
            break;
        case 19:
            dizaine = 'dix-neuf';
            break;
        case 20:
            dizaine = 'vingt';
            break;
        case 30:
            dizaine = 'trente';
            break;
        case 40:
            dizaine = 'quarante';
            break;
        case 50:
            dizaine = 'cinquante';
            break;
        case 60:
            dizaine = 'soixante';
            break;
        case 70:
            dizaine = 'soixante-dix';
            break;
        case 80:
            dizaine = 'quatre-vingt';
            break;
        case 90:
            dizaine = 'quatre-vingt-dix';
            break;
    }
    return dizaine;
} // -----------------------------------------------------------------------

export function NumberToLetter(nombre) {
    let i;
    let j;
    let n;
    let quotient;
    let reste;
    let nb;
    let nbs;
    let ch;
    let numberToLetter = '';
    // __________________________________

    if (isNaN(nombre.toString().replace(/ /gi, ''))) { return 'Nombre non valide'; }

    nb = parseFloat(nombre.toString().replace(/ /gi, ''));
    /*if (Math.ceil(nb) !== nb) {
        nbs = nombre.toString().split('.');
        console.log("kamel", nbs[1].length, nbs[1])
        if (nbs[1].length<= 1) { nbs[1] = nbs[1] * 10}

       // return NumberToLetter(parseFloat(nbs[0])) + ' Dinars Algérien' + ' et ' + NumberToLetter(parseFloat(nbs[1])) + ' Centimes' ;
       return NumberToLetter(parseFloat(nbs[0])) + ' Dinars Algérien' + ' et ' + NumberToLetter(parseFloat(nbs[1])) + ' Centimes' ;
    }*/

    n = nb.toString().length;
    switch (n) {
        case 1:
            numberToLetter = Unite(nb);
            break;
        case 2:
            if (nb > 19) {
                quotient = Math.floor(nb / 10);
                reste = nb % 10;
                if (nb < 71 || (nb > 79 && nb < 91)) {
                    if (reste === 0) { numberToLetter = Dizaine(quotient * 10); }
                    if (reste === 1) { numberToLetter = Dizaine(quotient * 10) + ' et ' + Unite(reste); }
                    if (reste > 1) { numberToLetter = Dizaine(quotient * 10) + ' ' + Unite(reste); }
                } else { numberToLetter = Dizaine((quotient - 1) * 10) + ' ' + Dizaine(10 + reste); }
            } else { numberToLetter = Dizaine(nb); }
            break;
        case 3:
            quotient = Math.floor(nb / 100);
            reste = nb % 100;
            if (quotient === 1 && reste === 0) { numberToLetter = 'cent'; }
            if (quotient === 1 && reste !== 0) { numberToLetter = 'cent' + ' ' + NumberToLetter(reste); }
            if (quotient > 1 && reste === 0) { numberToLetter = Unite(quotient) + ' cents'; }
            if (quotient > 1 && reste !== 0) { numberToLetter = Unite(quotient) + ' cent ' + NumberToLetter(reste); }
            break;
        case 4:
            quotient = Math.floor(nb / 1000);
            reste = nb - quotient * 1000;
            if (quotient === 1 && reste === 0) { numberToLetter = 'mille'; }
            if (quotient === 1 && reste !== 0) { numberToLetter = 'mille' + ' ' + NumberToLetter(reste); }
            if (quotient > 1 && reste === 0) { numberToLetter = NumberToLetter(quotient) + ' mille'; }
            if (quotient > 1 && reste !== 0) { numberToLetter = NumberToLetter(quotient) + ' mille ' + NumberToLetter(reste); }
            break;
        case 5:
            quotient = Math.floor(nb / 1000);
            reste = nb - quotient * 1000;
            if (quotient === 1 && reste === 0) { numberToLetter = 'mille'; }
            if (quotient === 1 && reste !== 0) { numberToLetter = 'mille' + ' ' + NumberToLetter(reste); }
            if (quotient > 1 && reste === 0) { numberToLetter = NumberToLetter(quotient) + ' mille'; }
            if (quotient > 1 && reste !== 0) { numberToLetter = NumberToLetter(quotient) + ' mille ' + NumberToLetter(reste); }
            break;
        case 6:
            quotient = Math.floor(nb / 1000);
            reste = nb - quotient * 1000;
            if (quotient === 1 && reste === 0) { numberToLetter = 'mille'; }
            if (quotient === 1 && reste !== 0) { numberToLetter = 'mille' + ' ' + NumberToLetter(reste); }
            if (quotient > 1 && reste === 0) { numberToLetter = NumberToLetter(quotient) + ' mille'; }
            if (quotient > 1 && reste !== 0) { numberToLetter = NumberToLetter(quotient) + ' mille ' + NumberToLetter(reste); }
            break;
        case 7:
            quotient = Math.floor(nb / 1000000);
            reste = nb % 1000000;
            if (quotient === 1 && reste === 0) { numberToLetter = 'un million'; }
            if (quotient === 1 && reste !== 0) { numberToLetter = 'un million' + ' ' + NumberToLetter(reste); }
            if (quotient > 1 && reste === 0) { numberToLetter = NumberToLetter(quotient) + ' millions'; }
            if (quotient > 1 && reste !== 0) { numberToLetter = NumberToLetter(quotient) + ' millions ' + NumberToLetter(reste); }
            break;
        case 8:
            quotient = Math.floor(nb / 1000000);
            reste = nb % 1000000;
            if (quotient === 1 && reste === 0) { numberToLetter = 'un million'; }
            if (quotient === 1 && reste !== 0) { numberToLetter = 'un million' + ' ' + NumberToLetter(reste); }
            if (quotient > 1 && reste === 0) { numberToLetter = NumberToLetter(quotient) + ' millions'; }
            if (quotient > 1 && reste !== 0) { numberToLetter = NumberToLetter(quotient) + ' millions ' + NumberToLetter(reste); }
            break;
        case 9:
            quotient = Math.floor(nb / 1000000);
            reste = nb % 1000000;
            if (quotient === 1 && reste === 0) { numberToLetter = 'un million'; }
            if (quotient === 1 && reste !== 0) { numberToLetter = 'un million' + ' ' + NumberToLetter(reste); }
            if (quotient > 1 && reste === 0) { numberToLetter = NumberToLetter(quotient) + ' millions'; }
            if (quotient > 1 && reste !== 0) { numberToLetter = NumberToLetter(quotient) + ' millions ' + NumberToLetter(reste); }
            break;
        case 10:
            quotient = Math.floor(nb / 1000000000);
            reste = nb - quotient * 1000000000;
            if (quotient === 1 && reste === 0) { numberToLetter = 'un milliard'; }
            if (quotient === 1 && reste !== 0) { numberToLetter = 'un milliard' + ' ' + NumberToLetter(reste); }
            if (quotient > 1 && reste === 0) { numberToLetter = NumberToLetter(quotient) + ' milliards'; }
            if (quotient > 1 && reste !== 0) { numberToLetter = NumberToLetter(quotient) + ' milliards ' + NumberToLetter(reste); }
            break;
        case 11:
            quotient = Math.floor(nb / 1000000000);
            reste = nb - quotient * 1000000000;
            if (quotient === 1 && reste === 0) { numberToLetter = 'un milliard'; }
            if (quotient === 1 && reste !== 0) { numberToLetter = 'un milliard' + ' ' + NumberToLetter(reste); }
            if (quotient > 1 && reste === 0) { numberToLetter = NumberToLetter(quotient) + ' milliards'; }
            if (quotient > 1 && reste !== 0) { numberToLetter = NumberToLetter(quotient) + ' milliards ' + NumberToLetter(reste); }
            break;
        case 12:
            quotient = Math.floor(nb / 1000000000);
            reste = nb - quotient * 1000000000;
            if (quotient === 1 && reste === 0) { numberToLetter = 'un milliard'; }
            if (quotient === 1 && reste !== 0) { numberToLetter = 'un milliard' + ' ' + NumberToLetter(reste); }
            if (quotient > 1 && reste === 0) { numberToLetter = NumberToLetter(quotient) + ' milliards'; }
            if (quotient > 1 && reste !== 0) { numberToLetter = NumberToLetter(quotient) + ' milliards ' + NumberToLetter(reste); }
            break;
        case 13:
            quotient = Math.floor(nb / 1000000000000);
            reste = nb - quotient * 1000000000000;
            if (quotient === 1 && reste === 0) { numberToLetter = 'un billion'; }
            if (quotient === 1 && reste !== 0) { numberToLetter = 'un billion' + ' ' + NumberToLetter(reste); }
            if (quotient > 1 && reste === 0) { numberToLetter = NumberToLetter(quotient) + ' billions'; }
            if (quotient > 1 && reste !== 0) { numberToLetter = NumberToLetter(quotient) + ' billions ' + NumberToLetter(reste); }
            break;
        case 14:
            quotient = Math.floor(nb / 1000000000000);
            reste = nb - quotient * 1000000000000;
            if (quotient === 1 && reste === 0) { numberToLetter = 'un billion'; }
            if (quotient === 1 && reste !== 0) { numberToLetter = 'un billion' + ' ' + NumberToLetter(reste); }
            if (quotient > 1 && reste === 0) { numberToLetter = NumberToLetter(quotient) + ' billions'; }
            if (quotient > 1 && reste !== 0) { numberToLetter = NumberToLetter(quotient) + ' billions ' + NumberToLetter(reste); }
            break;
        case 15:
            quotient = Math.floor(nb / 1000000000000);
            reste = nb - quotient * 1000000000000;
            if (quotient === 1 && reste === 0) { numberToLetter = 'un billion'; }
            if (quotient === 1 && reste !== 0) { numberToLetter = 'un billion' + ' ' + NumberToLetter(reste); }
            if (quotient > 1 && reste === 0) { numberToLetter = NumberToLetter(quotient) + ' billions'; }
            if (quotient > 1 && reste !== 0) { numberToLetter = NumberToLetter(quotient) + ' billions ' + NumberToLetter(reste); }
            break;
    } // fin switch
    /*respect de l'accord de quatre-vingt*/
    // tslint:disable-next-line:max-line-length
    
    if (numberToLetter.substr(numberToLetter.length - 'quatre-vingt'.length, 'quatre-vingt'.length) === 'quatre-vingt') { numberToLetter = numberToLetter + 's'; }
    //numberToLetter = numberToLetter + ' Dinars Algérien'
    return numberToLetter;
}
export function NumberToLetters(nombre,curr) {
   
    let nb;
    let nbs;
    
    if (isNaN(nombre.toString().replace(/ /gi, ''))) { return 'Nombre non valide'; }

    nb = parseFloat(nombre.toString().replace(/ /gi, ''));
    if (Math.ceil(nb) !== nb) {
        nbs = nombre.toString().split('.');
        console.log("kamel", nbs[1].length, nbs[1])
        if (nbs[1].length<= 1) { nbs[1] = nbs[1] * 10}
        console.log("hhhhhhhhhhhhhhhhh",NumberToLetter(parseFloat(nbs[0])) + ' ' + curr )

       // return NumberToLetter(parseFloat(nbs[0])) + ' Dinars Algérien' + ' et ' + NumberToLetter(parseFloat(nbs[1])) + ' Centimes' ;
       return NumberToLetter(parseFloat(nbs[0])) + ' ' + curr + ' et ' + NumberToLetter(parseFloat(nbs[1])) + ' Cts' ;
      
    }
    else {
        return NumberToLetter(parseFloat(nb)) + ' ' + curr 
    }
}