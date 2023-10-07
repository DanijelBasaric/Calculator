let dspMainElem = document.getElementById("displayMain");
let dspHistoryElem = document.getElementById("displayHistory");
let dspCurrentElem = document.getElementById("displayCurrent");

let btnNumbers = document.querySelectorAll(".number");
let btnOperation = Array.from(document.getElementsByClassName('operation'));

let btnClearAll = document.querySelector('.clearAll');
let btnClearLast = document.querySelector('.clearLast')
let btnCalculate = document.querySelector('.btnCalculate');


let calculated = false;

let hasDecimal = false;

let firstNum = '';
let scndNum = '';
let result = ''
let lastOperation = '';
let isNegative = false;

btnNumbers.forEach(number => {
    number.addEventListener("click", (element) => {
        if (calculated) return;
        if (element.target.innerText === '.' && !hasDecimal) {
            hasDecimal = true;
        } else if (element.target.innerText === '.' && hasDecimal) {
            return;
        }
        if (isNegative) {
            scndNum = 0 - element.target.innerText;
            isNegative = false
        } else {
            scndNum += element.target.innerText;
        }
        dspMainElem.innerText = displayNumber(scndNum);
    });
});


btnOperation.map(operation => {
    operation.addEventListener('click', (element) => {
        if (element.target.innerText === '-' && !calculated) {
            isNegative = true;
            return;
        }
        if (!scndNum) return;
        hasDecimal = false;
        let operationName = element.target.innerText;
        if (operationName === '÷') operationName = '/';
        if (firstNum && scndNum && lastOperation) {
            mathOperation();
        } else {
            result = parseFloat(scndNum);
        }
        toHistory(operationName);
        lastOperation = operationName;
        calculated = false;
    })
})

btnCalculate.addEventListener('click', () => {
    if (!firstNum && !scndNum && !calculated) {

        // ! OVO DORADITI

        dspMainElem.innerText = dspCurrentElem.innerText
        return;
    }
    dspHistoryElem.innerText = firstNum + scndNum;
    mathOperation();
    dspMainElem.innerText = displayNumber(result);;
    dspCurrentElem.innerText = '0'
    firstNum = '';
    scndNum = result;
    hasDecimal = false;
    calculated = true;
});

btnClearAll.addEventListener('click', () => {
    clearAll();
})

btnClearLast.addEventListener('click', () => {
    if (scndNum.length <= 0 || calculated) return;
    scndNum = scndNum.slice(0, -1);
    dspMainElem.innerText = scndNum;
})

const toHistory = (name) => {
    firstNum += scndNum + name;
    dspHistoryElem.innerText = displayNumber(firstNum);
    scndNum = '';
    dspMainElem.innerText = ''
    dspCurrentElem.innerText = displayNumber(result);
}

const mathOperation = () => {
    let temp = parseFloat(result) + lastOperation + parseFloat(scndNum);
    result = eval(temp);
    dspCurrentElem.innerText = displayNumber(result);
}

const clearAll = () => {
    firstNum = '';
    scndNum = '';
    result = '';
    dspHistoryElem.innerText = '0'
    dspMainElem.innerText = '0'
    dspCurrentElem.innerText = '0'
    calculated = false;
}

const displayNumber = (number) => {
    const floatNumber = parseFloat(number);
    if (isNaN(floatNumber)) return '';
    return number.toLocaleString('sr');
}