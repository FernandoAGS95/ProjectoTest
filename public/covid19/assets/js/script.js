// Llamando a la api total
let url = "http://localhost:3000/api/total";



fetch(url)
  .then((response) => response.json())
  .then((data) => mostrarData(data))
  .catch((error) => console.log(error));

const mostrarData = (data) => {
  console.log(data);


// Datatable

$(document).ready( function () {
  $('#example').DataTable( {
    // cambia el lenguaje de la interface de la tabla
    language: {
        lengthMenu: "Mostrar _MENU_ registros",
        info: "Mostrando _START_ de _END_ de un total de _TOTAL_ registros",
        search: "Buscar:",
        paginate: {
          first: "Inicio",
          last: "Final",
          next: "Siguiente",
          previous: "Anterior"
        }
    }
} );
})


// Creando y recorriendo la tabla
//1.Cada fila(row) tiene que poseer un boton que apunte al modal que esta en el html, para que asi solo un modal nos muestres de cualquier pais
//2.Como ya tengo todo el html que me genera la fila, dentro de la variable, lo voy a insertar dentro del tbody que tiene por id "paisEnTabla"
//3.COmo ya tengo en el HTML los botones que necesito para mostrar el mostrar uso un querySelector('.tabla .bontoncito')
//4. COmo querySelectorAll me retorna un arreglo yo puedo iterar su contenido
//5. Al iterar cada elemento ( por cada elemento me refiero al boton que estoy capturando segun el punto 3), como es un elemento HTML puedo hacer uso de las propiedades de estos
// en este caso addEventListener
//6.Estare escuchanbdo el evento click y por cada uno de estos realizare la funcion que obtiene la data del pais especifico y la muestra en un grafico
//7.Hago uso del argumento "event"o en este "e" que viene en la funcion que se ejecuta al dar click
//8.Del evento yo puedo obtener el targe y este es quien ejecuta el evento ( click lo genera el boton)
//9.Del target y obtengo al padre pero en este el padre es td y no me sirve, tengo que ir mas arriba al tr por eso 
// e.target.parentElement.parentElement
//10. A partir del padre procedo a obtener los valores que enviare al chart para asi renderizarlo 
//11. lo que obtengo de los hijos es un string y lo que me pide el grafico es un int asi que debo parsear
  let body = "";
  for (let i = 0; i <data.length; i++)
    body += `<tr class="tabla">
                    <td>${data[i].country}</td>
                    <td>${data[i].active}</td>
                    <td>${data[i].confirmed}</td>
                    <td>${data[i].deaths}</td>
                    <td>${data[i].recovered}</td>
                   <td><button type="button" class=" bontoncito btn-close" data-toggle="modal" data-target="#myModal">Ver detalle</button></td>
                    </tr>`;

  document.getElementById("paisEnTabla").innerHTML = body;

  document.querySelectorAll('.tabla .bontoncito').forEach((b) => b.addEventListener('click', function (e) {

    const padre = e.target.parentElement.parentElement;
    // Variables que captan la info de los hijos de la constante padre.
    let pais = padre.childNodes[1].innerHTML;
    let activos = padre.childNodes[3].innerHTML;
    let confirmados = padre.childNodes[5].innerHTML;
    let muertos = padre.childNodes[7].innerHTML;
    let recuperados = padre.childNodes[9].innerHTML;
    console.log('TEST BOTOn',pais)
    // Grafico Torta.
    var chart = new CanvasJS.Chart("chartContainerDos", {
        theme: "light2", // "light1", "light2", "dark1", "dark2"
        exportEnabled: true,
        animationEnabled: true,
        title: {
            text: pais
        },
        data: [{
            type: "pie",
            startAngle: 25,
            toolTipContent: "<b>{label}</b>: {y}%",
            showInLegend: "true",
            legendText: "{label}",
            indexLabelFontSize: 16,
            indexLabel: "{label} - {y}%",
            dataPoints: [
                { y: parseInt(activos), label: "Casos Activos" },
                { y: parseInt(confirmados), label: "Casos Confirmados" },
                { y: parseInt(muertos), label: "Casos Muertos" },
                { y: parseInt(recuperados), label: "Casos Recuperados" }
            ]
        }]
    });
    chart.render();
}));
};

// Otro Bloque Fetch para llamar y crear el grafico

async function fetchData() {
  const response = await fetch(url);
  // esperar hasta que la solicitud se complete
  const datapoints = await response.json();
  console.log(datapoints);
  // me retorna los datos de la api pero con el metodo splice, empieza desde el indice 0 y solo me mostrara 10 en el grafico
  return datapoints;
}

fetchData().then((datapoints) => {

// constante que ordena los paises de mayor a menos en los casos activos
  const orden = datapoints.sort(function(a, b){
    if (a.active > b.active){
      return -1
    }
  })

  // Paises
  const country = datapoints.map(function (index) {
    return index.country
  });

  // Casos activos
  const active = datapoints.map(function (index) {
    return index.active;
  });

  // Casos de muertes
  const deaths = datapoints.map(function (index) {
    return index.deaths;
  });



  console.log(orden);

  console.log(country);
  console.log(active);
  console.log(deaths);

  // Pinta en labels del grafico los paises en horizontal, se utiliza el splice para solo mostrar 10 resultados en el grafico
  myChart.config.data.labels = country.splice(0,10)

  // Pinta en data del grafico los casos activos en vertical, la funcion sort me ordena los casos activos de mayor a menor
  myChart.config.data.datasets[0].data = active.sort(function(a,b){return b- a});

  // Pinta en data del grafico las muertes en vertical
  myChart.config.data.datasets[1].data = deaths;

  myChart.update();
});
fetchData();


// Grafico chartJs

const data = {
  // etiqueta "labels" por defecto que viene con el grafico, la linea 82 reemplaza esta con los paises
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [

    // Indice 0 del datasets
    {
      // etiqueta con el titulo del grafico, se puede clickear para tacharla y que no se muestre en el grafico
      label: "Casos activos",
      // data de los numeros del grafico por defecto, la linea 85 la reemplaza por los numeros de los casos activos
      data: [18, 12, 6, 9, 12, 3, 9],
      backgroundColor: ["rgba(255, 26, 104, 0.2)"],
      borderColor: ["rgba(255, 26, 104, 1)"],
      borderWidth: 2,
    },

    // Indice 1 del datasets
    {
      // etiqueta con el titulo del grafico, se puede clickear para tacharla y que no se muestre en el grafico
      label: "Muertes",
      // data de los numeros del grafico por defecto, la linea 88 la reemplaza por los numeros de las muertes
      data: [18, 12, 6, 9, 12, 3, 9],
      backgroundColor: ["rgba(54, 162, 235, 0.2)"],
      borderColor: ["rgba(54, 162, 235, 1)"],
      borderWidth: 2,
    },
  ],
};

// config
const config = {
  type: "bar",
  data,
  options: {
    scales: {
      y: {},
    },
  },
};

// render init block, que seria que muestre la tabla
const myChart = new Chart(document.getElementById("myChart"), config);

let verDetalle = []
let paisEnTabla = document.getElementById("paisEnTabla")
                let modal = document.getElementById("myModal1")
                
                for (let i = 0; i < data.length; i++) {        
                    
                    verDetalle.push(data[i].location)

                    let pais = data[i].location
                    let muertes = data[i].deaths
                    let confirmados = data[i].confirmed
                    verDetalle.push(data2[i].location) 
                    paisEnTabla.innerHTML +=  
                        `
                        <tr>                    
                        <th>${pais}</th> 
                        <td>${muertes}</td>
                        <td>${confirmados}</td>
                        </tr>
                         `
                        }
                         

                        $('ver').click(function(event){
   
                            let paisSeleccionado = $(this).attr("Ver Detalle");
                            event.preventDefault();
                            
                            console.log(paisSeleccionado)
                            $.ajax({ url: paisSeleccionado, success: function (data) {

                                let pais1 = data.data.location
                                let muertes1 = data.data.deaths
                                let confirmados1 = data.data.confirmed

                                modal.innerHTML =                               
                                `
                                
                                <div class="modal-header">
                                  <h4 class="modal-title">Datos covid19 en: ${pais1}</h4>
                                  <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                </div>                          
                               
                                <div class="modal-body">
                                <div class="row  text-center container-fluid " >                                
                                <div class=" col-12 col-sm-6 mt-5 position-absolute top-40 start-50 translate-middle-x " 
                                  id="chartContainer2">
                                </div>
                                <div class="col-12 col-sm-6"id="stats" style="height: 300px; width:50%">
                                </div>
                            </div>
                                 

                    
                                </div>
                          
                               
                                <div class="modal-footer">
                                  <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                                </div>`;

                                let chart = new CanvasJS.Chart("chartContainer2", {
                                    theme: "light2", // "light1", "light2", "dark1", "dark2"
                                    exportEnabled: true,
                                    animationEnabled: true,
                                    title: {
                                        text: "Cifras covid19"
                                    },
                                    data: [{
                                        type: "pie",
                                        startAngle: 25,
                                        toolTipContent: "<b>{label}</b>: {y}",
                                        showInLegend: "true",
                                        legendText: "{label}",
                                        indexLabelFontSize: 16,
                                        indexLabel: "{label} - {y}",
                                        dataPoints: [
                                            { y: confirmados1, label: "Casos Confirmados" },
                                            { y: muertes1, label: "Muertes" },
                                            
                                        ]
                                    }]
                                });
                                chart.render();
                                          
                                
                                




























                                
                            }
                        })
                    })