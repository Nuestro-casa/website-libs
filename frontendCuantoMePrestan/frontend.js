document.querySelectorAll(".calculadora-container").forEach((el) => {
  el.innerHTML =
    `<div class="select-wrapper">
      <select class="select-nuestro" onchange="if (this.value) window.location.href=this.value">
      <option value="/nuestro-calculadora-cuando-puedo-comprar">Calculadora ¿cuando puedo comprar?</option>
      <option value="/nuestro-calculadora">Calculadora Couta mensual</option>
      <option value="/nuestro-calculadora-cuanto-puedo-comprar">Calculadora ¿cuanto me prestan?</option>
      </select>
    </div>
   ` + el.innerHTML;
});

var currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});
var option = {
  style: "percent",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
};
var percentageFormatter = new Intl.NumberFormat("en-US", option);

function regresar() {
  document.getElementById("form").style.display = "block";
  document.getElementById("resultados").style.display = "none";
}
var consulta;
var resultado;
var resultado2;
document.getElementById("form").addEventListener("submit", fetchValues);
function fetchValues(e) {
  e.preventDefault();
  document.getElementById("submitBtn").innerText = "Cargando...";
  document.getElementById("submitBtn").disabled = true;
  document.getElementById("submitBtn").style.background =
    "rgba(253, 218, 197, 1)";
  consulta = {
    monthlyIncomeObject: +removeCommas(
      document.getElementById("ingresosInput").value
    ),
    initialFeeObject: +removeCommas(
      document.getElementById("cuotaInicialInput").value
    ),
  };
  let url = "https://nuestro-calculadoras-live.herokuapp.com/cuantoMePrestan";

  fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(consulta),
  })
    .then((el) => el.json())
    .then((el) => {
      resultado = el.result;
      console.log(el);
      let url =
        "https://nuestro-calculadoras-live.herokuapp.com/costosMensuales";

      return fetch(url, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          precio: resultado.nuestro.value,
          ahorro: consulta.initialFeeObject,
        }),
      });
    })
    .then((el) => el.json())
    .then((el) => {
      document.getElementById("submitBtn").innerText = "CALCULAR";
      document.getElementById("submitBtn").disabled = false;
      document.getElementById("submitBtn").style.background = "#E27758";
      resultado2 = el.result;

      var options = {
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },

        series: [
          {
            name: "Valor de la vivienda",
            data: [
              {
                x: "Nuestro",
                y: Math.round(resultado.nuestro.value),
                fillColor: "#0ACF83",
              },
              {
                x: "Hipoteca",
                y: Math.round(resultado.banco.value),
                fillColor: "#5051F9",
              },
            ],
          },
        ],
        chart: {
          type: "bar",
          height: 350,
          toolbar: {
            show: true,
            tools: {
              download: false,
            },
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            borderRadius: 10,
          },
        },
        yaxis: {
          title: {
            text: "$ (Millones de pesos)",
          },
          labels: {
            formatter: function (value) {
              return value / 1000000;
            },
          },
        },
        fill: {
          opacity: 1,
        },

        tooltip: {
          y: {
            formatter: function (value) {
              var currencyFormatter = new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",

                // These options are needed to round to whole numbers if that's what you want.
                //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
                maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
              });
              return currencyFormatter.format(value) + " COP";
            },
          },
        },
      };

      var chart = new ApexCharts(document.querySelector("#chart"), options);

      chart.render();

      console.log(el);
      document.getElementById("viviendaAComprar").innerText =
        currencyFormatter.format(Math.floor(resultado.nuestro.value));

      document.getElementById("cuotaMensualNS").innerText =
        currencyFormatter.format(
          Math.floor(resultado2.nuestro.totalMinimumPayment)
        );
      document.getElementById("cuotaMensualHip").innerText =
        currencyFormatter.format(Math.floor(resultado2.hip.cuotaHip));

      document.getElementById("form").style.display = "none";
      document.getElementById("resultados").style.display = "flex";

      document.getElementById("necesitasHip").innerText =
        currencyFormatter.format(Math.floor(resultado.nuestro.value * 0.33));
      //(1 - initialFee / price)*100
      document.getElementById("financiamientoPercentage").innerText =
        percentageFormatter.format(
          1 - consulta.initialFeeObject / resultado.nuestro.value
        );
      document.getElementById("tasa").innerText = percentageFormatter.format(
        resultado2.interestComparable
      );
      document.getElementById("term").innerText = resultado2.term;
    });
}

window.onload = () => {
  //SINCRONIZAR RANGE y INPUT
  const form = document.getElementById("form");
  form.addEventListener("change", () => {
    document.getElementById("submitBtn").disabled = !form.checkValidity();
  });
  document.querySelectorAll("input").forEach((el) => {
    el.addEventListener("blur", () => {
      document.getElementById("submitBtn").disabled = !form.checkValidity();
    });
  });
};

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
