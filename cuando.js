var inPropertyValue = 500000;
var inMonthlyIncome = 200000;
var inSavingsAvailable= 20000;
var inMonthlySavings = 15000;

var inWhenToBuy = new Date("6/30/2023");


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

function cuandoPuedoComprar(propertyValue, monthlyIncome, savingsAvailable, monthlySavings, inWhenToBuy){
    let ahorroOptimo =monthlyIncome*howMuchSavingsPercentage;
    const diffTime = Math.abs(inWhenToBuy - new Date());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    //+MAX(($C$4*(1-H5)*(1+H7)*H6-$C$9)/((C28-HOY())/30),0)
    let nuestroAhorro = Math.round(Math.max((propertyValue*(1-nsDiscuntPercentage)*(1+nsComissionPercentage)*nsSavingsPercentage-savingsAvailable)/(diffDays/30), 0)) ;
    //+REDONDEAR(MAX(($C$4*(1-H5)*(1+H7)*H6-$C$9)/$C$11,0),0)
    let nuestroMesAhorroActual =Math.round(Math.max((propertyValue*(1-nsDiscuntPercentage)*(1+nsComissionPercentage)*nsSavingsPercentage-savingsAvailable)/monthlySavings, 0));
    // +REDONDEAR(MAX(($C$4*(1-H5)*(1+H7)*H6-$C$9)/($C$7*$H$17),0),0)
    let nuestroMesesAhorroOptimo = Math.round(Math.max((propertyValue*(1-nsDiscuntPercentage)*(1+nsComissionPercentage)*nsSavingsPercentage-savingsAvailable)/(ahorroOptimo), 0));

    console.log("NUESTRO:",nuestroAhorro, nuestroMesAhorroActual, nuestroMesesAhorroOptimo)

    //+MAX(($C$4*(H13+H14+H15)-$C$9)/(($C$28-HOY())/30),0)
    let hipotecaAhorro = Math.round(Math.max((propertyValue*(hiComissionPercentage+hiDiscuntPercentage+hiSavingsPercentage)-savingsAvailable)/(diffDays/30),0));
    //+REDONDEAR(MAX(($C$4*(H13+H14+H15)-$C$9)/$C$11,0),0)
    let hipotecaMesAhorroActual = Math.round(Math.max((propertyValue*(hiComissionPercentage+hiDiscuntPercentage+hiSavingsPercentage)-savingsAvailable)/monthlySavings,0));
    //+REDONDEAR(MAX(($C$4*(H13+H14+H15)-$C$9)/($C$7*$H$17),0),0)
    let hipotecaMesesAhorroOptimo =Math.round(Math.max((propertyValue*(hiComissionPercentage+hiDiscuntPercentage+hiSavingsPercentage)-savingsAvailable)/ahorroOptimo,0));;

    console.log("HIPOTECA:",hipotecaAhorro, hipotecaMesAhorroActual, hipotecaMesesAhorroOptimo)


    //+MAX(($C$4*H9-$C$9)/((C28-HOY())/30),0)
    let leasingAhorro = Math.round(Math.max((propertyValue*lsSavingsPercentage-savingsAvailable)/(diffDays/30),0));
    //MAX(($C$4*(H9+H10)-$C$9)/$C$11,0)
    let leasingMesAhorroActual =Math.round(Math.max((propertyValue*(lsSavingsPercentage+lsInitialEstructation)-savingsAvailable)/monthlySavings,0));
    //+REDONDEAR(MAX(($C$4*(H9+H10)-$C$9)/($C$7*$H$17),0),0)
    let leasingMesesAhorroOptimo = Math.round(Math.max((propertyValue*(lsSavingsPercentage+lsInitialEstructation)-savingsAvailable)/ahorroOptimo,0));

    console.log("LEASING:",leasingAhorro,leasingMesAhorroActual, leasingMesesAhorroOptimo)

}

cuandoPuedoComprar(inPropertyValue, inMonthlyIncome, inSavingsAvailable, inMonthlySavings, inWhenToBuy);