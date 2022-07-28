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

let term= 20;
let interestComparable=14/100;
let interestRate = 11.53/100;
let calculoSavingRate=[
    {
        cuotaInicial:15/100,
        ahorro:0.19
    },
    {
        cuotaInicial:16/100,
        ahorro:0.17
    },
    {
        cuotaInicial:17/100,
        ahorro:0.15
    },
    {
        cuotaInicial:18/100,
        ahorro:0.13
    },
    {
        cuotaInicial:19/100,
        ahorro:0.11
    },
    {
        cuotaInicial:20/100,
        ahorro:0.09
    },
    {
        cuotaInicial:21/100,
        ahorro:0.08
    },
    {
        cuotaInicial:22/100,
        ahorro:0.06
    },
    {
        cuotaInicial:23/100,
        ahorro:0.04
    },
    {
        cuotaInicial:24/100,
        ahorro:0.02
    },
    {
        cuotaInicial:25/100,
        ahorro:0.00
    },
    {
        cuotaInicial:26/100,
        ahorro:0.00
    },
    {
        cuotaInicial:27/100,
        ahorro:0.00
    },
    {
        cuotaInicial:28/100,
        ahorro:0.00
    },
    {
        cuotaInicial:29/100,
        ahorro:0.00
    },
    {
        cuotaInicial:30/100,
        ahorro:0.00
    },
]

let fiduciariaRate = 1.20/100;
let seguroRate = 0.20/100;
let impuestosRate  = 0.63/100;
let adminInmuebleRate = 8/100;
let capexRate = 0.25/100;
let maintainanceRate = 2.5/100;

let seguroVidaRate = 0.5/100;
let seguroAptoRate = 0.2/100;

let lowerBoundFiduciaria = 300000;
let lowerBoundAdmin= 170000;

function calculateGastosMensuales(precioApto, cuantoTengoAhorrado, interest, term){
    let transactionValue = 1.1 * precioApto;
    console.log("transactionValue", transactionValue)
    let apartmentValue = precioApto;
    console.log("apartmentValue", apartmentValue);

    let financing = transactionValue-cuantoTengoAhorrado;
    console.log("financing", financing);
    let interestRate = interestRate;
    console.log("interestRate", interestRate);
    let downpayment= transactionValue/cuantoTengoAhorrado;
    console.log("downpayment", downpayment);
   
    let monthlyMinimumPayment = (1-downpayment)*apartmentValue*interest/12;
    console.log("monthlyMinimumPayment", monthlyMinimumPayment);
    
    let fiduciaria = Math.min(fiduciariaRate*apartmentValue/12,lowerBoundFiduciaria)
    console.log("fiduciaria", fiduciaria);
    let seguro = seguroRate*apartmentValue/12;
    console.log("seguro", seguro);
    let impuestos = impuestosRate*apartmentValue/12;
    console.log("impuestos", impuestos);
    let administracion = Math.min(adminInmuebleRate*monthlyMinimumPayment/12,lowerBoundAdmin)
    console.log("administracion", administracion);
    let capex = capexRate*apartmentValue/12;
    console.log("capex", capex);
    let maintenance = maintainanceRate*monthlyMinimumPayment/12
    console.log("maintenance", maintenance);
    
    let totalCostosNuestro = fiduciaria + seguro + impuestos + administracion+capex+maintenance;
    console.log("totalCostosNuestro", totalCostosNuestro);
    let ahorro;
    calculoSavingRate.forEach((el,i)=>{
        if(Math.floor(downpayment)==el.cuotaInicial)
        ahorro = el.ahorro;
    })
    console.log("ahorro", ahorro);

    
    let suggestedSavingsToReach25= apartmentValue*ahorro;
    console.log("suggestedSavingsToReach25", suggestedSavingsToReach25);
    let financingCosts = (fiduciaria+seguro+administracion)* downpayment;
    console.log("financingCosts", financingCosts);
    let costsOutsideFinancing = (impuestos+capex+maintenance)* downpayment;
    console.log("costsOutsideFinancing", costsOutsideFinancing);

    let totalMinimumPayment = monthlyMinimumPayment + financingCosts;
    console.log("totalMinimumPayment", totalMinimumPayment);
    let totalSuggestedPayment = suggestedSavingsToReach25 +totalMinimumPayment;
    console.log("totalSuggestedPayment", totalSuggestedPayment);
    let totalSuggestedPaymentCostsIncl= costs + totalSuggestedPayment;
    console.log("totalSuggestedPaymentCostsIncl", totalSuggestedPaymentCostsIncl);

    //comparison 
    let seguroApto= apartmentValue*seguroAptoRate/12;
    console.log("seguroApto", seguroApto);
    let seguroVida= apartmentValue*seguroVidaRate/12;
    console.log("seguroVida", seguroVida);
    let cuotaTotalHip = -PMT(Math.pow(1+interest,1/12)-1, term * 12, apartmentValue - cuantoTengoAhorrado, 0 )
    console.log("cuotaTotalHip", cuotaTotalHip);
    let interesHip = (Math.pow(1+interest,1/12)-1)*(apartmentValue - cuantoTengoAhorrado)
    console.log("interesHip", interesHip);
    let amotizacionHip = cuotaTotalHip - interesHip;
    console.log("amotizacionHip", amotizacionHip);
    let segurosHip = seguroApto+seguroVida;
    console.log("segurosHip", segurosHip);
    let costosHip = capex + impuestos + maintenance;
    console.log("costosHip", costosHip);
    let cuotaHip = interesHip+ amotizacionHip + segurosHip;
    console.log("cuotaHip", cuotaHip);
    let totalHip = cuotaHip + costosHip;
    console.log("totalHip", totalHip);

}

function PMT (ir, np, pv, fv ) {
    /*
    ir - interest rate per month
    np - number of periods (months)
    pv - present value
    fv - future value (residual value)
    */
    pmt = ( ir * ( pv * Math.pow ( (ir+1), np ) + fv ) ) / ( ( ir + 1 ) * ( Math.pow ( (ir+1), np) -1 ) );
    return pmt;
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
  
    //TODO Cambiar a Variables globales 
    //Nuestro fee con escrituracion se financia PROBLEMA 1
    //
    let nstroFee = 0.15
    let leasingFee = 0.225
    let hipotecaFee = 0.325


    termObject = termObject * 12;
  
    rateObject = rateObject / 12;
  
    for (var i = 1; i <= termObject; i++) {
      va += (maximumValueMortgagePaymentObject)/(Math.pow((1 + rateObject),i));
    }
  
    nuestro = Math.min(Math.max(va + initialFeeObject, va / (1 - nstroFee)), initialFeeObject / nstroFee);
    console.log("Nuestro: " + Math.round(nuestro));
  
    leasing = Math.min(Math.max(va + initialFeeObject, va / (1 - leasingFee)), initialFeeObject / leasingFee);
    console.log("Leasing: " + Math.round(leasing));
  
    hipoteca = Math.min(Math.max(va + initialFeeObject, va / (1 - hipotecaFee)), initialFeeObject / hipotecaFee);
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
