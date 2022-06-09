// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        } else {
          event.preventDefault();
          event.stopPropagation();
          clean();
          calculate();
          myalert();
          scrollToAnchor("#myanchor");
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

document.addEventListener("DOMContentLoaded", function (event) {
  let priceInput = document.getElementById("price");
  let rateInput = document.getElementById("rate");
  let initialFee = document.getElementById("intialfee");
  rateInput.innerHTML = GLOBAL_VARS.rates
    .map((el) => {
      return `<option value="${el}">${el}</option>`;
    })
    .join("");
  // Comienza calculadora
  //fifteenPercent()

  /*
    //código a ejecutar cuando el DOM está listo para recibir acciones
var options = {
          series: [{
          name: 'Marine Sprite',
          data: [44, 55, 41, 37, 22, 43, 21]
        }, {
          name: 'Striking Calf',
          data: [53, 32, 33, 52, 13, 43, 32]
        }, {
          name: 'Tank Picture',
          data: [12, 17, 11, 9, 15, 11, 20]
        }, {
          name: 'Bucket Slope',
          data: [9, 7, 5, 8, 6, 9, 4]
        }, {
          name: 'Reborn Kid',
          data: [25, 12, 19, 32, 25, 24, 10]
        }],
          chart: {
          type: 'bar',
          height: 350,
          stacked: true,
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        stroke: {
          width: 1,
          colors: ['#fff']
        },
        title: {
          text: 'Fiction Books Sales'
        },
        xaxis: {
          categories: [2008, 2009, 2010, 2011, 2012, 2013, 2014],
          labels: {
            formatter: function (val) {
              return val + "K"
            }
          }
        },
        yaxis: {
          title: {
            text: undefined
          },
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + "K"
            }
          }
        },
        fill: {
          opacity: 1
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left',
          offsetX: 40
        }
        };

        var chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();
      //código a ejecutar cuando el DOM está listo para recibir acciones



      // Comienza calculadora

        var priceObject=document.getElementById("price");
        var rateObject=document.getElementById("rate");
        var initialFeeObject=document.getElementById("initialfee");

        priceObject.addEventListener("blur", fifteenPercent);

        function fifteenPercent() {
            var price = priceObject.value

            if(price)
            {
              initialFeeObject.placeholder="Minimo: "+((price*15)/100);
              initialFeeObject.min=((price*15)/100);
            }
            else
            {
              initialFeeObject.min="";
              initialFeeObject.placeholder="Coloca la cuota aqui"
            }
            
        }
        */
});

////////////////

function calculate() {
  var priceObject = document.getElementById("price");
  var rateObject = document.getElementById("rate");
  var initialFeeObject = document.getElementById("initialfee");

  var inflation = GLOBAL_VARS.inflation; // C2
  var realAppreciation = 4 / 100; // C4
  var contractualAppreciation = 1.5 / 100; // C6
  var discount = GLOBAL_VARS.discount; // C8
  var capRate = GLOBAL_VARS.capRate; // C10
  var PrincipalSavingPremium = GLOBAL_VARS.PrincipalSavingPremium; // C12
  var fee = GLOBAL_VARS.fee; // C14
  var canonExpenses = GLOBAL_VARS.canonExpenses; // C16
  var accountingLegal = GLOBAL_VARS.accountingLegal; // C18
  var sellCommission = 3 / 100; // C20
  var administration = 1.2 / 100; // C22
  var propertyInsurance = GLOBAL_VARS.propertyInsurance; // C24
  var propertyTax = GLOBAL_VARS.propertyTax; // C26
  var extraordinaryExpenses = GLOBAL_VARS.extraordinaryExpenses; // C28
  var paymentsMonths = 3; // C30
  var mortgageTerm = GLOBAL_VARS.mortgageTerm; // C32
  var price = removeCommas(priceObject.value); // C36
  var initialFee = removeCommas(initialFeeObject.value); // C38
  var rate = rateObject.value / 100; // C40
  var monthlyPaymentYearOne = GLOBAL_VARS.monthlyPaymentYearOne; // D42

  var OurfullRent = -price * (1 - discount) * (capRate / 12); // D59

  var OurexpensesOnCannon =
    (-(canonExpenses + accountingLegal) * capRate * price * (1 - discount)) /
    12; // D60

  var OurFee = (price * (1 - discount) * -fee) / 12; //D61

  //fix results
  OurfullRent = -OurfullRent;
  OurfullRent = Math.round(OurfullRent);

  OurexpensesOnCannon = OurexpensesOnCannon;
  OurexpensesOnCannon = -Math.round(OurexpensesOnCannon);

  OurFee = -OurFee;
  OurFee = Math.round(OurFee);
  //fix results

  var rent =
    +OurfullRent * (1 - initialFee / price) +
    ((OurexpensesOnCannon + OurFee) * initialFee) / price; // D58

  //fix results
  rent = -Math.round(rent);
  //fix results

  /*
            console.log("OurfullRent "+OurfullRent)
            console.log("OurexpensesOnCannon "+OurexpensesOnCannon)
            console.log("OurFee "+OurFee)
            */
  console.log("rent " + rent);

  ////////////////////////////////////////////////////
  var agreedAnnualSavings = +PrincipalSavingPremium * (1 - discount) * price; // D64
  var annualNOI =
    +price *
    (1 - discount) *
    (capRate * (1 - canonExpenses - accountingLegal)) *
    Math.pow(1 + inflation, monthlyPaymentYearOne - 1); // D65
  var housingExpenses =
    +price *
    (1 - discount) *
    (-fee - propertyInsurance - propertyTax - extraordinaryExpenses); // D66
  var ownership = +initialFee / price; // D56
  var savings =
    +(agreedAnnualSavings + (annualNOI + housingExpenses) * ownership) / 12; // D63

  //fix results
  agreedAnnualSavings = Math.round(agreedAnnualSavings);
  annualNOI = Math.round(annualNOI);
  housingExpenses = Math.round(housingExpenses);
  // ownership=Math.round(ownership)
  savings = Math.round(savings);
  //fix results

  /*
            console.log("agreedAnnualSavings "+agreedAnnualSavings)
            console.log("annualNOI "+annualNOI)
            console.log("housingExpenses "+housingExpenses)
            console.log("ownership "+ownership)
            
            */
  console.log("savings " + savings);

  //////////////////////////////////////////////////////////

  var propertyInsurance2 = (-price * propertyInsurance) / 12; // D70
  var propertyTax2 = (-price * propertyTax * (1 - discount)) / 12; // D71
  var extraordinaryExpenses2 = (-price * extraordinaryExpenses) / 12; // D72
  var expenses =
    (propertyInsurance2 + propertyTax2 + extraordinaryExpenses2) * ownership; // D69

  //fix results
  propertyInsurance2 = Math.round(propertyInsurance2);
  propertyTax2 = Math.round(propertyTax2);
  extraordinaryExpenses2 = Math.round(extraordinaryExpenses2);
  expenses = Math.round(expenses);
  //fix results

  /*
          console.log("propertyInsurance2 "+propertyInsurance2)  
          console.log("propertyTax2 "+propertyTax2)    
          console.log("extraordinaryExpenses2 "+extraordinaryExpenses2)     
              
          */

  console.log("expenses " + expenses);

  ///////////////////////////////////////////////7

  var interest =
    IPMT(rate, monthlyPaymentYearOne, mortgageTerm, price - initialFee) / 12; // D76

  //fix results
  interest = -Math.round(interest);
  //fix results

  console.log("interest " + interest);

  ///////////////////////////////////////////////

  var capitalContributions =
    +-+ExcelFormulas.PPMT(
      rate,
      monthlyPaymentYearOne,
      mortgageTerm,
      price - initialFee
    ) / 12; // D75

  //fix results
  capitalContributions = Math.round(capitalContributions);
  //fix results

  console.log("capitalContributions " + capitalContributions);

  ///////////////////////////////////////////////////

  var opex = propertyTax2; // D77
  var extraordinaryExpenses3 = extraordinaryExpenses2; // D78
  var expenses2 = (opex + extraordinaryExpenses3) / -1; // D48

  //fix results
  expenses2 = Math.round(expenses2);
  //fix results

  console.log("expenses2 " + expenses2);

  /////////////////////////////////////////////////

  var interest2 =
    -+IPMT(rate, monthlyPaymentYearOne, mortgageTerm, price - initialFee) / 12; // D82

  //fix results
  interest2 = Math.round(interest2);
  //fix results

  console.log("interest2 " + interest2);

  //////////////////////////////////////////////////

  capitalContributions2 =
    +-+ExcelFormulas.PPMT(
      rate,
      monthlyPaymentYearOne,
      mortgageTerm,
      price - initialFee
    ) / 12;

  //fix results
  capitalContributions2 = Math.round(capitalContributions2);
  //fix results

  console.log("capitalContributions2 " + capitalContributions2);

  ////////////////////////////////////////////////////////////////

  var opex2 = propertyTax2; // D77
  var extraordinaryExpenses4 = extraordinaryExpenses2; // D78
  var expenses3 = (opex2 + extraordinaryExpenses4) / -1; // D48

  //fix results
  expenses3 = Math.round(expenses3);
  //fix results

  console.log("expenses3 " + expenses3);

  // Comenzamos a graficar
  var name = "Nuestro";
  var data = [
    {
      name: "Arriendo/Intereses",
      value: -rent,
    },
    {
      name: "Ahorro",
      value: savings,
    },
    {
      name: "Gastos",
      value: -expenses,
    },
  ];

  /*
       
         var name = "Leasing"
         var data = [{
                      name: 'Intereses',
                      value: interest
        },
        {
                      name: 'Reduccion',
                      value: capitalContributions
        },
        {
                      name: 'Gastos',
                      value: expenses2
        }];

 

*/

  var name2 = "Hipoteca";
  var data2 = [
    {
      name: "Arriendo/Intereses",
      value: interest2,
    },
    {
      name: "Reduccion",
      value: capitalContributions2,
    },
    {
      name: "Gastos",
      value: expenses3,
    },
  ];

  var div = "graphic";
  graphResults(div, name, data, name2, data2);

  // Generamos resultados generales
  createResult(data, data2);

  createFinePrint();
}

function createFinePrint() {
  var html =
    "<p>*este calculo tiene en cuenta un financiamiento de (x%) con una tasa y% a z años</p>";
  $("#myfinePrint").html(html);
}

function createResult(data, data2) {
  var result1 = data[0].value + data[1].value + data[2].value;
  var result2 = data2[0].value + data2[1].value + data2[2].value;

  var html =
    "<p>¿Cuanto vas a pagar al mes?</p><p>Con nuestro tu pago mensual es: $" +
    addCommas(result1) +
    "</p><p>Con la hipoteca(*) tu pago mensual es: $" +
    addCommas(result2) +
    "</p>";

  if (result1 < result2) {
    var result3 = result2 - result1;
    var html2 = "<p>Con nuestro ahorra $" + addCommas(result3) + " al mes</p>";
    html = html + html2;
  }

  $("#myresult").html(html);
}

function graphResults(div, name, data, name2, data2) {
  var options = {
    colors: ["#6b6768", "#04213e", "#f2704f"],
    series: [
      {
        name: data[0].name,
        data: [data[0].value, data2[0].value],
      },
      {
        name: data[1].name,
        data: [data[1].value, data2[1].value],
      },
      {
        name: data[2].name,
        data: [data[2].value, data2[2].value],
      },
    ],
    chart: {
      type: "bar",
      height: 215,
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ["#fff"],
        fontSize: "11px",
      },
      textAnchor: "middle",
      formatter: function (val, opt) {
        return "$" + addCommas(val);
      },
      offsetX: 0,
      dropShadow: {
        enabled: true,
      },
    },
    stroke: {
      width: 1,
      colors: ["#fff"],
    },
    xaxis: {
      categories: [name, name2],
      labels: {
        formatter: function (val) {
          return "$" + addCommas(val);
        },
        stroke: {
          width: 1,
          colors: ["#fff"],
        },
      },
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$" + addCommas(val);
        },
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      offsetX: 40,
    },
  };

  var chart = new ApexCharts(document.querySelector("#" + div), options);
  chart.render();
}

function clean() {
  //remove div de imagen
  $("#graphic").html("");
  $("#imagenDiv").remove();
  $("#myalert").html("");
  $("#myresult").html("");
}

function fifteenPercent() {
  var priceObject = document.getElementById("price");
  var rateObject = document.getElementById("rate");
  var initialFeeObject = document.getElementById("initialfee");
  var result = 0;

  var price = removeCommas(priceObject.value);

  if (price) {
    result = (price * GLOBAL_VARS.intialFeePercentage) / 100;
    initialFeeObject.placeholder = "Minimo: $" + addCommas(result);
    initialFeeObject.min = (price * GLOBAL_VARS.intialFeePercentage) / 100;
  } else {
    removeFifteenPercent();
  }
}

function removeFifteenPercent() {
  var initialFeeObject = document.getElementById("initialfee");
  initialFeeObject.min = "";
  initialFeeObject.placeholder = "Coloca el ahorro aquí";
}

function scrollToAnchor(div) {
  location.href = div;
  /*

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 location.href=div
}
*/
}

function addCommas(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0]
    .replace(/^0+/, "")
    .replace(/\D/g, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

function removeCommas(str) {
  my_str_without_comma = str.toString().replaceAll(",", "");
  return parseInt(my_str_without_comma);
}

function myInputFormat(evtobj, id) {
  /*
       if (evtobj.keyCode == 75 && evtobj.ctrlKey) {

    }
    */
  var val = document.getElementById(id).value;
  document.getElementById(id).value = addCommas(val);
}

function validateMinimumInitialFee() {
  var initialFeeObject = document.getElementById("initialfee");
  var min = initialFeeObject.min;
  var value = removeCommas(initialFeeObject.value);

  if (value < min) {
    //alert("la cuota minima es: "+min)
    initialFeeObject.value = "";
  }
}

function validateMaximumInitialFee() {
  var priceObject = document.getElementById("price");
  var rateObject = document.getElementById("rate");
  var initialFeeObject = document.getElementById("initialfee");
  var price = removeCommas(priceObject.value); // C36
  var initialFee = removeCommas(initialFeeObject.value); // C38
  var rate = rateObject.value / 100; // C40

  porcentage = (price * GLOBAL_VARS.maxIntialFeePercentage) / 100;

  if (initialFee > porcentage) {
    //alert("la cuota minima es: "+min)
    initialFeeObject.value = "";
  }
}

function validateMinimumPrice() {
  var priceObject = document.getElementById("price");
  var value = removeCommas(priceObject.value);
  var min = GLOBAL_VARS.min;

  if (value < min) {
    $("#price").addClass("is-invalid");
    alert("El precio mínimo es: $" + addCommas(min));
    priceObject.value = "";
    return false;
  }
  return true;
}
function validateMaximumPrice() {
  var priceObject = document.getElementById("price");
  var value = removeCommas(priceObject.value);
  var max = GLOBAL_VARS.max;

  if (value > max) {
    $("#price").addClass("is-invalid");
    alert("El precio máximo es: $" + addCommas(max));
    priceObject.value = "";
    return false;
  }
  return true;
}

function validateInitialFee() {
  validateMinimumInitialFee();
  validateMaximumInitialFee();
}

function validatePrice() {
  if (validateMinimumPrice() && validateMaximumPrice()) {
    fifteenPercent();
  } else {
    removeFifteenPercent();
  }
}

function myalert() {
  var priceObject = document.getElementById("price");
  var rateObject = document.getElementById("rate");
  var initialFeeObject = document.getElementById("initialfee");
  var price = removeCommas(priceObject.value); // C36
  var initialFee = removeCommas(initialFeeObject.value); // C38
  var rate = rateObject.value / 100; // C40

  porcentage = (price * 33) / 100;

  if (initialFee < porcentage) {
    $("#myalert").html(
      "Recuerda, en Colombia los bancos exigen una cuota inicial del 33% mas los costos de escrituración, Necesitas  $" +
        addCommas(porcentage) +
        " ahorrados"
    );
  }
}
