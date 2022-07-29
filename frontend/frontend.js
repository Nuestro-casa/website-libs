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

document.getElementById("toggle").addEventListener("change", (e) => {
  document.getElementById("label-aporte").style.display = e.target.checked
    ? "flex"
    : "none";

  document.getElementById("aporteCapitalNS").style.display = e.target.checked
    ? "block"
    : "none";
  aporteCapitalNS;
});

function regresar() {
  document.getElementById("form").style.display = "block";
  document.getElementById("resultados").style.display = "none";
}
var consulta;
var resultado;
document.getElementById("form").addEventListener("submit", fetchValues);
function fetchValues(e) {
  e.preventDefault();
  document.getElementById("submitBtn").innerText = "Cargando...";
  document.getElementById("submitBtn").disabled = true;
  document.getElementById("submitBtn").style.background =
    "rgba(253, 218, 197, 1)";
  consulta = {
    precio: +document.getElementById("progressNumber").value,
    ahorro: +document.getElementById("ahorroInput").value,
  };
  let url = "https://nuestro-calculadoras-live.herokuapp.com/costosMensuales";
  fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      precio: +document.getElementById("progressNumber").value,
      ahorro: +document.getElementById("ahorroInput").value,
    }),
  })
    .then((el) => el.json())
    .then((el) => {
      document.getElementById("submitBtn").innerText = "CALCULAR";
      document.getElementById("submitBtn").disabled = false;
      document.getElementById("submitBtn").style.background = "#E27758";
      resultado = el.result;
      console.log(el);
      document.getElementById("pagoMensualFijo").innerText =
        currencyFormatter.format(
          Math.floor(resultado.nuestro.totalMinimumPayment)
        );
      // document.getElementById("ahorroSugeridoOpcional").innerText =
      //   Math.floor(resultado.nuestro.suggestedSavingsToReach25);
      document.getElementById("costoFinancieroNSValue").innerText =
        currencyFormatter.format(
          Math.floor(resultado.nuestro.totalMinimumPayment)
        );
      document.getElementById("aporteACapitalNSValue").innerText =
        currencyFormatter.format(
          Math.floor(resultado.nuestro.suggestedSavingsToReach25)
        ); //96
      document.getElementById("gastosNSValue").innerText =
        currencyFormatter.format(
          Math.floor(
            resultado.nuestro.costsOutsideFinancing //98
          )
        );
      document.getElementById("pagoMensualFijoHip").innerText =
        currencyFormatter.format(Math.floor(resultado.hip.cuotaTotalHip));
      document.getElementById("costoFinancieroHipValue").innerText =
        currencyFormatter.format(
          Math.floor(resultado.hip.interesHip + resultado.hip.segurosHip)
        );
      document.getElementById("aporteACapitalHipValue").innerText =
        currencyFormatter.format(Math.floor(resultado.hip.amortizacionHip));
      document.getElementById("gastosHipValue").innerText =
        currencyFormatter.format(Math.floor(resultado.hip.costosHip));

      document.getElementById("form").style.display = "none";
      document.getElementById("resultados").style.display = "flex";

      let hipoteca = [
        resultado.hip.interesHip + resultado.hip.segurosHip,
        resultado.hip.amortizacionHip,
        resultado.hip.costosHip,
      ];

      let nuestro = [
        resultado.nuestro.totalMinimumPayment,
        resultado.nuestro.suggestedSavingsToReach25,
        resultado.nuestro.costsOutsideFinancing,
      ];
      let totHipoteca = hipoteca[0] + hipoteca[1] + hipoteca[2];
      let diferencia = totHipoteca - (nuestro[0] + nuestro[1] + nuestro[2]);
      //Grafica Nuestro
      let totNuestro = nuestro[0] + nuestro[1] + nuestro[2] + diferencia;
      let costoFinancieroPercentageNS = (nuestro[0] / totNuestro) * 100;
      let aporteCapitalPercentageNS = (nuestro[1] / totNuestro) * 100;
      let gastosPercentageNS = (nuestro[2] / totNuestro) * 100;
      let grisPercentageNS = (diferencia / totNuestro) * 100;

      let costoFinancieroPercentageHip = (hipoteca[0] / totHipoteca) * 100;
      console.log(costoFinancieroPercentageHip);
      let aporteCapitalPercentageHip = (hipoteca[1] / totHipoteca) * 100;
      console.log(aporteCapitalPercentageHip);
      let gastosPercentageHip = (hipoteca[2] / totHipoteca) * 100;
      console.log(gastosPercentageHip);

      document.getElementById("costoFinancieroNS").style.width =
        costoFinancieroPercentageNS + "%";
      document.getElementById("gastosNS").style.width =
        costoFinancieroPercentageNS + gastosPercentageNS + "%";
      document.getElementById("aporteCapitalNS").style.width =
        costoFinancieroPercentageNS +
        aporteCapitalPercentageNS +
        gastosPercentageNS +
        "%";
      document.getElementById("grisNS").style.width =
        costoFinancieroPercentageNS +
        gastosPercentageNS +
        aporteCapitalPercentageNS +
        grisPercentageNS +
        "%";
      //Grafica Hipoteca
      document.getElementById("costoFinancieroHip").style.width =
        costoFinancieroPercentageHip + "%";
      document.getElementById("gastosHip").style.width =
        costoFinancieroPercentageHip + gastosPercentageHip + "%";
      document.getElementById("aporteCapitalHip").style.width =
        gastosPercentageHip +
        aporteCapitalPercentageHip +
        costoFinancieroPercentageHip +
        "%";

      document.getElementById("ahoorroConNuestro").innerText =
        currencyFormatter.format(
          Math.floor(
            resultado.hip.cuotaTotalHip - resultado.nuestro.totalMinimumPayment
          )
        );

      document.getElementById("necesitasHip").innerText =
        currencyFormatter.format(Math.floor(consulta.precio * 0.33));
      //(1 - initialFee / price)*100
      document.getElementById("financiamientoPercentage").innerText =
        percentageFormatter.format(1 - consulta.ahorro / consulta.precio);
      document.getElementById("tasa").innerText = percentageFormatter.format(
        resultado.interestComparable
      );
      document.getElementById("term").innerText = resultado.term;
    });
}

window.onload = () => {
  //SINCRONIZAR RANGE y INPUT
  const rangeInputs = document.querySelectorAll('input[type="range"]');
  const numberInput = document.querySelector("#progressNumber");

  function handleInputChange(e) {
    let target = e.target;
    if (e.target.type !== "range") {
      target = document.getElementById("range");
    }
    const min = target.min;
    const max = target.max;
    const val = target.value;

    target.style.backgroundSize = ((val - min) * 100) / (max - min) + "% 100%";
  }

  rangeInputs.forEach((input) => {
    input.addEventListener("input", handleInputChange);
  });

  numberInput.addEventListener("input", handleInputChange);
  const form = document.getElementById("form");
  form.addEventListener("change", () => {
    document.getElementById("submitBtn").disabled = !form.checkValidity();
  });
};
