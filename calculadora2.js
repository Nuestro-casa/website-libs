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
  // Comienza calculadora 2 - Cuanto me prestan
 
function calculate(monthlyIncomeObject, initialFeeObject) {
  ////Initial Variables
  var usableSalary = 0.9;
  var salaryForRent = 0.35;
  var salaryForSavings = 0.1;
  var estimateTxCost = 0.0323;
  var maximunFeePercentage = (salaryForRent + salaryForSavings) * usableSalary;
  var maximunFee = maximunFeePercentage * monthlyIncomeObject;
  var bankMaximunAparmentValue = initialFeeObject / (0.3 + estimateTxCost);
  var nuestroMaximunAparmentValue = 0;
  var rate = 0.15;
  var difference = 1;
  var totalTxValue = 0;
  var valorApto = 0;
  var rentaMinima = 0;
  var leaseRate = 0.1153;
  var savePercentage = 0;
  var save = 0;
  var cuotaTotal;
  var salarioRequerido = 0;
  while (difference > 0) {
    totalTxValue = initialFeeObject / rate;
    valorApto = totalTxValue / 1.1;
    rentaMinima = leaseRate * (valorApto * (1 - rate)) / 12;
    savePercentage = (rate == 0.15) ? 0.001878 : (roundToTwo(rate) == 0.16) ? 0.001689 : (roundToTwo(rate) == 0.17) ? 0.001502 : (roundToTwo(rate) == 0.18) ? 0.001315 : (roundToTwo(rate) == 0.19) ? 0.001126 : (roundToTwo(rate) == 0.20) ? 0.000939 : (roundToTwo(rate) == 0.21) ? 0.000752 : (roundToTwo(rate) == 0.22) ? 0.000563 : (roundToTwo(rate) == 0.23) ? 0.000375 : (roundToTwo(rate) == 0.24) ? 0.000187 : (roundToTwo(rate) >= 0.25) ? 0.00 : 0.00;
    save = valorApto * savePercentage;
    cuotaTotal = save + rentaMinima;
    salarioRequerido = cuotaTotal / maximunFeePercentage;
    difference = salarioRequerido - monthlyIncomeObject;
    nuestroMaximunAparmentValue = valorApto;
    rate += 0.01;
  }

  console.log("Cuanto me prestan BANCO: " + bankMaximunAparmentValue);
  console.log("Cuanto me prestan NUESTRO: " + nuestroMaximunAparmentValue);

  
  // Comenzamos a graficar
  var name = "Cuanto me prestan";
  var data = [
    {
      name: "NUESTRO",
      value: nuestroMaximunAparmentValue,
    },
    {
      name: "BANCO",
      value: bankMaximunAparmentValue,
    },
  ];

  

  var div = "graphic";
  graphResults(div, name, data);

  // Generamos resultados generalesroundToTwo(rate)
  createResult(data);

  createFinePrint();
}

function roundToTwo(num) {
  return +(Math.round(num + "e+2")  + "e-2");
}

function calculate(monthlyIncomeObject, rateObject, termObject, initialFeeObject) {
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

  

  var div = "graphic";
  graphResults(div, name, data);

  // Generamos resultados generales
  createResult(data);

  createFinePrint();
}

function createFinePrint() {
  var html =
    "<p>*este calculo tiene en cuenta un financiamiento de (x%) con una tasa y% a z años</p>";
  $("#myfinePrint").html(html);
}

function createResult(data) {
  var result1 = data[0].value;
  var result2 = data[1].value;

  var html =
    "<p>¿Cuanto me prestan?</p>" +
    addCommas(result2) +
    "</p><p>El pago mensual seria de: " +
    addCommas(result1) +
    "</p>";

  $("#myresult").html(html);
}

function graphResults(div, name, data) {
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
