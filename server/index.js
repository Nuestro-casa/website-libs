const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();


let nsDiscuntPercentage = 10/100;
let nsSavingsPercentage = 15/100;
let nsComissionPercentage = 10/100;


let lsSavingsPercentage = 20/100;
let lsInitialEstructation = 0.16/100;
let lsFinalWriting = 3.2/100;

let hiDiscuntPercentage = 30/100;
let hiSavingsPercentage = 3.2/100;
let hiComissionPercentage = 0.16/100;

let howMuchSavingsPercentage = 20/100;




const { PORT = 3000 } = process.env;
app.use(express.json());
app.use(cors());
app.use(morgan());
app.use(
    express.urlencoded({
        extended: false,
    })
);
app.get("/", (req, res) => {
    res.send("Hola");
});

app.post("/cuantoMePrestan", (req, res, next) => {
    const { monthlyIncomeObject, rateObject, termObject, initialFeeObject } =
        req.body;
    let result = calculateCuantoMePrestan(
        monthlyIncomeObject,
        rateObject,
        termObject,
        initialFeeObject
    );
    res.send({ success: true, result });
});

app.post("/cuandoPuedoComprar", (req, res, next) => {
    const { propertyValue, monthlyIncome, savingsAvailable, monthlySavings, inWhenToBuy } =
        req.body;
    let inWhenToBuyDate = new Date( inWhenToBuy);
    let result = calculateCuandoPuedoComprar(
        propertyValue, monthlyIncome, savingsAvailable, monthlySavings, inWhenToBuyDate
    );
    res.send({ success: true, result });
});
function calculateCuandoPuedoComprar(propertyValue, monthlyIncome, savingsAvailable, monthlySavings, inWhenToBuy) {
    let ahorroOptimo = monthlyIncome * howMuchSavingsPercentage;
    const diffTime = Math.abs(inWhenToBuy - new Date());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    //+MAX(($C$4*(1-H5)*(1+H7)*H6-$C$9)/((C28-HOY())/30),0)
    let nuestroAhorro = Math.round(Math.max((propertyValue * (1 - nsDiscuntPercentage) * (1 + nsComissionPercentage) * nsSavingsPercentage - savingsAvailable) / (diffDays / 30), 0));
    //+REDONDEAR(MAX(($C$4*(1-H5)*(1+H7)*H6-$C$9)/$C$11,0),0)
    let nuestroMesAhorroActual = Math.round(Math.max((propertyValue * (1 - nsDiscuntPercentage) * (1 + nsComissionPercentage) * nsSavingsPercentage - savingsAvailable) / monthlySavings, 0));
    // +REDONDEAR(MAX(($C$4*(1-H5)*(1+H7)*H6-$C$9)/($C$7*$H$17),0),0)
    let nuestroMesesAhorroOptimo = Math.round(Math.max((propertyValue * (1 - nsDiscuntPercentage) * (1 + nsComissionPercentage) * nsSavingsPercentage - savingsAvailable) / (ahorroOptimo), 0));

    console.log("NUESTRO:", nuestroAhorro, nuestroMesAhorroActual, nuestroMesesAhorroOptimo)

    //+MAX(($C$4*(H13+H14+H15)-$C$9)/(($C$28-HOY())/30),0)
    let hipotecaAhorro = Math.round(Math.max((propertyValue * (hiComissionPercentage + hiDiscuntPercentage + hiSavingsPercentage) - savingsAvailable) / (diffDays / 30), 0));
    //+REDONDEAR(MAX(($C$4*(H13+H14+H15)-$C$9)/$C$11,0),0)
    let hipotecaMesAhorroActual = Math.round(Math.max((propertyValue * (hiComissionPercentage + hiDiscuntPercentage + hiSavingsPercentage) - savingsAvailable) / monthlySavings, 0));
    //+REDONDEAR(MAX(($C$4*(H13+H14+H15)-$C$9)/($C$7*$H$17),0),0)
    let hipotecaMesesAhorroOptimo = Math.round(Math.max((propertyValue * (hiComissionPercentage + hiDiscuntPercentage + hiSavingsPercentage) - savingsAvailable) / ahorroOptimo, 0));;

    console.log("HIPOTECA:", hipotecaAhorro, hipotecaMesAhorroActual, hipotecaMesesAhorroOptimo)


    //+MAX(($C$4*H9-$C$9)/((C28-HOY())/30),0)
    let leasingAhorro = Math.round(Math.max((propertyValue * lsSavingsPercentage - savingsAvailable) / (diffDays / 30), 0));
    //MAX(($C$4*(H9+H10)-$C$9)/$C$11,0)
    let leasingMesAhorroActual = Math.round(Math.max((propertyValue * (lsSavingsPercentage + lsInitialEstructation) - savingsAvailable) / monthlySavings, 0));
    //+REDONDEAR(MAX(($C$4*(H9+H10)-$C$9)/($C$7*$H$17),0),0)
    let leasingMesesAhorroOptimo = Math.round(Math.max((propertyValue * (lsSavingsPercentage + lsInitialEstructation) - savingsAvailable) / ahorroOptimo, 0));

    console.log("LEASING:", leasingAhorro, leasingMesAhorroActual, leasingMesesAhorroOptimo)


    let resultado = [
        {
            name: "Nuestro",
            nuestroAhorro,
            nuestroMesAhorroActual,
            nuestroMesesAhorroOptimo,
        },
        {
            name: "Hipoteca",
            hipotecaAhorro,
            hipotecaMesAhorroActual,
            hipotecaMesesAhorroOptimo,
        },
        {
            name: "Leasing",
            leasingAhorro,
            leasingMesAhorroActual,
            leasingMesesAhorroOptimo,
        }
    ]

    return resultado;
}



function calculateCuantoMePrestan(
    monthlyIncomeObject,
    rateObject,
    termObject,
    initialFeeObject
) {
    ////Initial Variables
    // var monthlyIncomeObject = document.getElementById("monthlyIncome");
    // var rateObject = document.getElementById("rate");
    // var termObject = document.getElementById("term");
    // var initialFeeObject = document.getElementById("initialFee");
    var maximumValueMortgagePaymentObject = monthlyIncomeObject * (30 / 100);
    var va = 0;
    var nuestro = 0;
    var hipoteca = 0;
    var leasing = 0;
  
    termObject = termObject * 12;
  
    rateObject = rateObject / 12;
  
    for (var i = 1; i <= termObject; i++) {
      va += (maximumValueMortgagePaymentObject)/(Math.pow((1 + rateObject),i));
    }
  
    nuestro = Math.min(Math.max(va + initialFeeObject, va / (1 - 0.15)), initialFeeObject / 0.15);
    console.log("Nuestro: " + Math.round(nuestro));
  
    leasing = Math.min(Math.max(va + initialFeeObject, va / (1 - 0.2)), initialFeeObject / 0.2);
    console.log("Leasing: " + Math.round(leasing));
  
    hipoteca = Math.min(Math.max(va + initialFeeObject, va / (1 - 0.3)), initialFeeObject / 0.3);
    console.log("Hipoteca: " + Math.round(hipoteca));
  
    console.log("Cuanto me prestan " + va);
  
    
    // Comenzamos a graficar
    var name = "Cuanto me prestan";
    var data = [
      {
        name: "Valor Maximo Hipoteca",
        value: maximumValueMortgagePaymentObject,
      },
      {
        name: "NUESTRO",
        value: nuestro,
      },
      {
        name: "Hipoteca",
        value: hipoteca,
      },
      {
        name: "Leasing",
        value: leasing,
      },
    ];
  

    return data;

    // var div = "graphic";
    // graphResults(div, name, data);

    // // Generamos resultados generales
    // createResult(data);

    // createFinePrint();
}

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        errors: {
            message: err.message,
        },
    });
});

app.listen(PORT, () => console.log(`App Listening on port ${PORT}`));
