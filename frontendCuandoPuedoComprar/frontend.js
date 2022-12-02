document.querySelectorAll(".calculadora-container").forEach((el) => {
  el.innerHTML =
    `<div class="select-wrapper">
      <select class="select-nuestro" onchange="if (this.value) window.location.href=this.value">
      <option value="/calculadoracuandopuedocomprar">Calculadora ¿Cuándo puedo comprar?</option>
      <option value="/calculadorasduppla">Calculadora Couta mensual</option>
      <option value="/calculadoracuantomeprestan">Calculadora ¿Cuánto me prestan?</option>
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
const monthNames = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];
var percentageFormatter = new Intl.NumberFormat("en-US", option);

// const elem = document.querySelector('input[data-type="date"]');
// const datepicker = new Datepicker(elem, {
//   language: "es",
//   minDate: new Date(),
//   autohide: true,
// });

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
    propertyValue: +removeCommas(
      document.getElementById("progressNumber").value
    ),
    savingsAvailable: +removeCommas(
      document.getElementById("cuotaInicialInput").value
    ),
    monthlySavings: +removeCommas(
      document.getElementById("ahorroMensualInput").value
    ),
    // inWhenToBuy: datepicker.getDate("m/dd/yyyy"),
  };

  let url =
    "https://duppla-app.herokuapp.com/cuandoPuedoComprar";

  fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(consulta),
  })
    .then((el) => el.json())
    .then((el) => {
      document.getElementById("submitBtn").innerText = "CALCULAR";
      document.getElementById("submitBtn").disabled = false;
      document.getElementById("submitBtn").style.background = "#E27758";
      resultado = el.result;

      document.getElementById("resumenPrecioApto").innerText =
        currencyFormatter.format(consulta.propertyValue);
      document.getElementById("resumenAhorro").innerText =
        currencyFormatter.format(consulta.savingsAvailable);
      document.getElementById("resumenAhorroMensual").innerText =
        currencyFormatter.format(consulta.monthlySavings);

      document.getElementById("viviendaAComprar").innerText =
        resultado.nuestro.nuestroMesAhorroActual <= 0
          ? "¡YA! Estás listo para comprar vivienda con Nuestro"
          : resultado.nuestro.nuestroMesAhorroActual + " Meses";

      document.getElementById("temporalidadNS").innerText =
        resultado.nuestro.nuestroMesAhorroActual <= 0
          ? "¡Ahora mismo!"
          : resultado.nuestro.nuestroMesAhorroActual + " Meses";
      document.getElementById("teHaceFaltaNS").innerText =
        resultado.nuestro.nuestroAhorro <= 0
          ? "No te hace falta nada"
          : currencyFormatter.format(resultado.nuestro.nuestroAhorro);
      document.getElementById("temporalidadHip").innerText =
        resultado.hipoteca.hipotecaMesAhorroActual <= 0
          ? "Listo para comprar"
          : resultado.hipoteca.hipotecaMesAhorroActual + " Meses";
      document.getElementById("teHaceFaltaHip").innerText =
        resultado.hipoteca.hipotecaAhorro <= 0
          ? "$0"
          : currencyFormatter.format(resultado.hipoteca.hipotecaAhorro);
      let today = new Date();
      let nsDate = new Date(
        today.setMonth(
          today.getMonth() + resultado.nuestro.nuestroMesAhorroActual
        )
      );
      let hipDate = new Date(
        today.setMonth(
          today.getMonth() + resultado.hipoteca.hipotecaMesAhorroActual
        )
      );

      //Check si ambos son para el mismo periodo
      if (
        nsDate.getMonth() == hipDate.getMonth() &&
        nsDate.getFullYear() == hipDate.getFullYear()
      ) {
        document.getElementById("nsContainer").style.width = "100%";
      }

      document.getElementById("nuestroTime").innerText =
        monthNames[nsDate.getMonth()] + " " + nsDate.getFullYear();
      document.getElementById("hipTime").innerText =
        monthNames[hipDate.getMonth()] + " " + hipDate.getFullYear();

      document.getElementById("form").style.display = "none";
      document.getElementById("resultados").style.display = "flex";
    });
}

window.onload = () => {
  //SINCRONIZAR RANGE y INPUT
  const rangeInputsPrecio = document.querySelectorAll("#rangeNumber");
  const numberInputPrecio = document.querySelector("#progressNumber");

  const rangeInputsCuotaInicial =
    document.querySelectorAll("#rangeCuotaInicial");
  const numberInputCuotaInicial = document.querySelector("#cuotaInicialInput");

  const rangeInputsAhorroMensual = document.querySelectorAll(
    "#rangeAhorroMensualInput"
  );
  const numberInputAhorroMensual = document.querySelector(
    "#ahorroMensualInput"
  );

  function handleInputChangePrecio(e) {
    let target = e.target;
    if (e.target.type !== "range") {
      target = document.getElementById("rangeNumber");
    }
    const min = target.min;
    const max = target.max;
    const val = removeCommas(target.value);
    target.style.backgroundSize = ((val - min) * 100) / (max - min) + "% 100%";
  }

  function handleInputChangeCuotaInicial(e) {
    let target = e.target;
    if (e.target.type !== "range") {
      target = document.getElementById("rangeCuotaInicial");
    }
    const min = target.min;
    const max = target.max;
    const val = removeCommas(target.value);
    target.style.backgroundSize = ((val - min) * 100) / (max - min) + "% 100%";
  }

  function handleInputChangeAhorroMensual(e) {
    let target = e.target;
    if (e.target.type !== "range") {
      target = document.getElementById("rangeAhorroMensualInput");
    }
    const min = target.min;
    const max = target.max;
    const val = removeCommas(target.value);
    target.style.backgroundSize = ((val - min) * 100) / (max - min) + "% 100%";
  }

  rangeInputsPrecio.forEach((input) => {
    input.addEventListener("input", handleInputChangePrecio);
  });
  rangeInputsCuotaInicial.forEach((input) => {
    input.addEventListener("input", handleInputChangeCuotaInicial);
  });
  rangeInputsAhorroMensual.forEach((input) => {
    input.addEventListener("input", handleInputChangeAhorroMensual);
  });

  numberInputPrecio.addEventListener("input", handleInputChangePrecio);
  numberInputCuotaInicial.addEventListener(
    "input",
    handleInputChangeCuotaInicial
  );
  numberInputAhorroMensual.addEventListener(
    "input",
    handleInputChangeAhorroMensual
  );

  const form = document.getElementById("form");
  form.addEventListener("change", () => {
    document.getElementById("submitBtn").disabled = !form.checkValidity();
  });
  document.querySelectorAll("input").forEach((el) => {
    el.addEventListener("blur", () => {
      document.getElementById("submitBtn").disabled = !form.checkValidity();
    });
  });
  // datepicker.addEventListener("change", (e) => {
  //   if (datepicker.getDate()) {
  //     document.getElementById("submitBtn").disabled = !form.checkValidity();
  //   }
  // });
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
