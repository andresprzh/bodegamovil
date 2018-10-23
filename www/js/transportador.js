
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        /* ============================================================================================================================
                                                        INICIAN  COMPONENTE DE LA PAGINA
        ============================================================================================================================*/
        $('.collapsible').collapsible();

        /* ============================================================================================================================
                                                    EVENTOS   
        ============================================================================================================================*/

        cargarpedidos();
    }

};

app.initialize();

/* ============================================================================================================================
                                                FUNCIONES   
============================================================================================================================*/

function entregar(cajas) {
    $.ajax({
        url: api_url+'transporte/entregar',
        method: 'POST',
        data: { 'cajas': cajas },
        dataType: 'JSON',
        success: function (res) {
    
            if (res) {
                swal("¡Cajas entregadas!", {
                    icon: "success",
                })
                    .then((event) => {

                        cargarpedidos();

                    });
            }
        }
    });

}

function cargarpedidos() {


    return $.ajax({
        url: api_url+'transporte/pedidos',
        method: 'GET',
        data: { 'usuario': id_usuario },
        dataType: 'JSON',
        success: function (res) {
    
            // borra datos de la lista para recargarla
            $("#pedidos").html("");

            if (res['estado']) {


                var destinos = res['contenido'];

                for (var i in destinos) {
                    // almacena el array de cajas en un string
                    var cajas = '[' + destinos[i]['cajas'].toString() + ']';

                    var lista = `<li>
                                <div class="collapsible-header">
                                    <i class="fas fa-truck collapsible-primary" ></i>${destinos[i]["descripcion"]}
                                    
                                    <button 
                                     class="collapsible-secondary not-collapse btn green"
                                     onclick="entregar(${cajas})"
                                     >Entregar</button>
                                </div>
                                <div class="collapsible-body">
                                    <b>Dir: ${destinos[i]['direccion']}</b>
                                    
                                    <ul class="collection with-header">
                                        <li class="collection-header"><h5>Cajas</h5></li>`;
                    for (var j in destinos[i]['tipo_cajas']) {
                        lista += `<li class="collection-item"> ${j} X ${destinos[i]['tipo_cajas'][j]}</li>`;
                    }
                    lista += `<li class="collection-item"><b>Total<b> = ${destinos[i]['cantidad']}</li>
                            </ul></div></li>`
                    $("#pedidos").append($(lista));


                }
            } else {
                $("#pedidos").append($(`<li>${res['contenido']}</li>`));
            }

        }
    });
}