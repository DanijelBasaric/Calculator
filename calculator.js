let dspMainElem = document.getElementById("displayMain");
let dspHistoryElem = document.getElementById("displayHistory");
let dspCurrentElem = document.getElementById("displayCurrent");

let btnNumbers = document.querySelectorAll(".number");
let btnOperation = Array.from(document.getElementsByClassName('operation'));

let btnClearAll = document.querySelector('.clearAll');
let btnClearLast = document.querySelector('.clearLast')
let btnCalculate = document.querySelector('.btnCalculate');

let firstNum = '';
let scndNum = '';
let result = '';
let lastOperation = '';

let calculated = false;
let hasDecimal = false;
let isNegative = false;

btnNumbers.forEach(number => {                                                  //? upisivanje brojeva
    number.addEventListener("click", (element) => {
        if (calculated) return;
        if (element.target.innerText === '.' && !hasDecimal) {                  //* provera da li je upotrebljena decimalna tacka
            hasDecimal = true;
        } else if (element.target.innerText === '.' && hasDecimal) {
            return;
        }
        if (isNegative) {                                                       //* provera da li je prvi broj negativan
            scndNum = 0 - element.target.innerText;
            isNegative = false;
        } else {
            scndNum += element.target.innerText;
        }
        dspMainElem.innerText = displayNumber(scndNum);                         //? upisivanje prvog broja na displey-u
    });
});


btnOperation.map(operation => {                                                 //? upisavanje matematicke operacije
    operation.addEventListener('click', (element) => {
        if (element.target.innerText === '-' && !calculated &&!scndNum) {       //*ako prvi broj nije negativan i nije vec izracunat i nema broja
            isNegative = true;
            return;
        }
        if (!scndNum) return;                                                   //*ako nije unet broj 
        hasDecimal = false;                                                     //? ponistavanje vrednosti za decimalni tacku za drugi broj
        let operationName = element.target.innerText;
        if (operationName === '÷') operationName = '/';                         //* prebacivanje znaka za deljenje u "/"
        if (firstNum && scndNum && lastOperation) {                             //* provera da li su data dva broja i znak operacije
            mathOperation();                                                    //! pozivanje funckije za racunanje    
            dspCurrentElem.innerText = displayNumber(result);                   //? ispis rezultata na displey
        } else {
            result = parseFloat(scndNum);
        }
        
        toHistory(operationName);                                               //! pozivanje funkcije ispis izraza u "history deo"
        lastOperation = operationName;
        calculated = false;
    })
})

btnCalculate.addEventListener('click', () => {                                  //todo  izracunavanje vrednosti izraza
    if (calculated) return;                                                     //* ispitivanje da li je vec izracunata vrednost
    dspHistoryElem.innerText = firstNum + scndNum;
    validateExpression();                                                       //* ispitivanje matematickog izraza (da li poslednje uneta neka mat oepracija)
    mathOperation();
    dspCurrentElem.innerText = displayNumber(result);
    console.log(`result je ${result}`);
    console.log(typeof(result));
    dspMainElem.innerText = result;
    dspCurrentElem.innerText = '0'
    firstNum = '';
    scndNum = result;
    hasDecimal = false;
    calculated = true;
});

btnClearAll.addEventListener('click', () => {                               //? brisanje svih vrednosti pozivanjem funkcije
    clearAll();
})

btnClearLast.addEventListener('click', () => {                              //? brisanje poslednje unete cifre ako postoji broj i
    if (scndNum.length <= 0 || calculated) return;                          //* ako broj nije rezultat prethodne operacije    
    scndNum = scndNum.slice(0, -1);
    dspMainElem.innerText = scndNum;            
})

const toHistory = (name) => {                                               //! ispis History dela 
    firstNum += scndNum + name;                                             //* broj1 je uneti broj i matematicka operacija
    dspHistoryElem.innerText = displayNumber(firstNum);                     //? prikaz broja 1
    scndNum = '';                                                           //* ponistavanje unetog broja
    dspMainElem.innerText = ''                                              //* brisanje unetog broja sa displeya
    dspCurrentElem.innerText = displayNumber(result);                       //? ispisivanje medjurezultata
}

const mathOperation = () => {                                               //! racunanje vrednosti unetog izraza
    console.log(`novi firstNum ${firstNum}`);
    console.log(`novi lastOperation ${lastOperation}`);
    console.log(`novi scndNum ${scndNum}`);
    let temp = parseFloat(result) + lastOperation + parseFloat(scndNum);
    console.log(temp);
    result = eval(temp);
}

const clearAll = () => {                                                    //! funkcija brisanja svih vrednosti
    firstNum = '';
    scndNum = '';
    result = '';
    dspHistoryElem.innerText = '0'
    dspMainElem.innerText = '0'
    dspCurrentElem.innerText = '0'
    calculated = false;
}

const displayNumber = (number) => {                                         //! prikaz broja sa tackom za hiljade i decimalnim zarezom umesto tacke
    const floatNumber = parseFloat(number);
    if (isNaN(floatNumber)) return '';
    return number.toLocaleString('sr');
}


const validateExpression = () => {
    let temp=dspHistoryElem.innerText
    let lastchar= temp.substring(temp.length - 1)
    if (lastchar!=NaN && !scndNum) {
        console.log(`lastchar`);
        firstNum=temp.slice(0,-1);
        lastOperation='+'
        scndNum='0'
    }
}