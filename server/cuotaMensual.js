let term= 20;
async function abc(url) {
    var resp = await fetch(url);
    var jobj = await resp.json();
    return jobj.value;
}
let interestComparable= abc('https://rates-dev.herokuapp.com/rates/getRateBank')/100;
let globalInterestRate = abc('https://rates-dev.herokuapp.com/rates/getRateBank')/100;
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
    let interestRate = globalInterestRate;
    console.log("interestRate", interestRate);
    let downpayment= cuantoTengoAhorrado/transactionValue;
    console.log("downpayment", downpayment);
   
    let monthlyMinimumPayment = (1-downpayment)*apartmentValue*interestRate/12;
    console.log("monthlyMinimumPayment", monthlyMinimumPayment);
    
    let fiduciaria = Math.min(fiduciariaRate*apartmentValue/12,lowerBoundFiduciaria)
    console.log("fiduciaria", fiduciaria);
    let seguro = seguroRate*apartmentValue/12;
    console.log("seguro", seguro);
    let impuestos = impuestosRate*apartmentValue/12;
    console.log("impuestos", impuestos);
    let administracion = Math.min(adminInmuebleRate*monthlyMinimumPayment,lowerBoundAdmin)
    console.log("administracion", administracion);
    let capex = capexRate*apartmentValue/12;
    console.log("capex", capex);
    let maintenance = maintainanceRate*monthlyMinimumPayment
    console.log("maintenance", maintenance);
    
    let totalCostosNuestro = fiduciaria + seguro + impuestos + administracion+capex+maintenance;
    console.log("totalCostosNuestro", totalCostosNuestro);
    let ahorro;
    calculoSavingRate.forEach((el,i)=>{

        if(Math.floor(downpayment*100)==el.cuotaInicial*100)
            ahorro = el.ahorro/100;
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

    console.log(suggestedSavingsToReach25+ totalMinimumPayment, suggestedSavingsToReach25, totalMinimumPayment)
    let totalSuggestedPayment = suggestedSavingsToReach25 +totalMinimumPayment;
    console.log("totalSuggestedPayment", totalSuggestedPayment);
    let totalSuggestedPaymentCostsIncl= costsOutsideFinancing + totalSuggestedPayment;
    console.log("totalSuggestedPaymentCostsIncl", totalSuggestedPaymentCostsIncl);

    //comparison 
    let seguroApto= apartmentValue*seguroAptoRate/12;
    console.log("seguroApto", seguroApto);
    let seguroVida= (apartmentValue-cuantoTengoAhorrado)*seguroVidaRate/12;
    console.log("seguroVida", seguroVida);
    console.log("IRM", Math.pow(1+interest,1/12)-1)
    console.log("TERM*12", term * 12)
    console.log("PV",apartmentValue - cuantoTengoAhorrado)
    let cuotaTotalHip = -PMT(Math.pow(1+interest,1/12)-1, term * 12, apartmentValue - cuantoTengoAhorrado, 0, 1 )

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

// function PMT (ir, np, pv, fv ) {
//     /*
//     ir - interest rate per month
//     np - number of periods (months)
//     pv - present value
//     fv - future value (residual value)
//     */

    
//     var pmt = ( 0.010978851950173452 * ( 328000000 * Math.pow( (0.010978851950173452+1)  , 240 ) ) ) / ( ( 0.010978851950173452 + 1 ) * ( Math.pow ( (0.010978851950173452+1), 240) -1 ) );
//     return pmt;
//    }
function PMT(ir, np, pv, fv, type) {
    /*
     * ir   - interest rate per month
     * np   - number of periods (months)
     * pv   - present value
     * fv   - future value
     * type - when the payments are due:
     *        0: end of the period, e.g. end of month (default)
     *        1: beginning of period
     */
    var pmt, pvif;

    fv || (fv = 0);
    type || (type = 0);

    if (ir === 0)
        return -(pv + fv)/np;

    pvif = Math.pow(1 + ir, np);
    pmt = - ir * (pv * pvif + fv) / (pvif - 1);

    if (type === 1)
        pmt /= (1 + ir);

    return pmt;
}

calculateGastosMensuales(400000000, 72000000, interestComparable, term)
