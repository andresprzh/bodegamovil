
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
                                                            INICIALIZACION   
        ============================================================================================================================*/
        
        // INICIAR TABS
        // alert("hola mundo")
        $('.tabs').tabs({ 'swipeable': false });
        // INICIAR MODAL
        $('.modal').modal({
            // ending_top: '50%', 
            dismissible: true, // Modal can be dismissed by clicking outside of the modal
            // ready: function(modal) {modal.css('transform', 'translateY(-10%)'); },
            onOpenEnd: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
                $("#cantidad").focus();
            }
        });
        
        // pone requisiciones en el input select
        $.ajax({
            url: api_url+'alistar/requisiciones',
            method: "GET",
            data: '',
            contentType: false,
            processData: false,
            dataType: "JSON",
            success: function (res) {
                
                if (res) {
                    // SE MUESTRAN LAS REQUISICIONES EN EL MENU DE SELECCION
                    for (var i in res) {
        
                        $("#requeridos").append($('<option value="' + res[i]['no_req'] + '">' + res[i]['no_req'].substr(4) + res[i]['descripcion'] + '</option>'));
        
                    }
                    if (i==0) {
                        $("#requeridos").val(res[i]['no_req']);
                        cambiarRequeridos();
                    }
                }
            }
        });
    
        // /* ============================================================================================================================
        //                                                     EVENTOS   
        // ============================================================================================================================*/
    
        //EVENTO AL CAMBIAR ENTRADA REQUERIDOS
        // $(".requeridos").change(function (e) {
            
        //     $.when(mostrarItems()).done(function () {
    
        //         $.when(mostrarCaja()).done(function () {
        //             $("#codbarras").focus();
                    
        //         });
        //     });
    
        // });
    
        // FUNCION QUE FILTRA ITEMS POR UBICACION
        $("#ubicacion").change(function (e) {
    
            cambiarUbicacion();
            
            $("#codbarras").focus();
        });
    
        // EVENTO INPUT  CODIGO DE BARRAS
        $("#codbarras").keyup(function (e) {
            // Keyboard.hide();
            //si se presiona enter busca el item y lo pone en la pagina
            if (e.which == 13) {
                buscarCodbar();
            }
            
        });
    
        $("#codbarras").focus(function (e) { 
            e.preventDefault();
            setTimeout(function() {
                Keyboard.hide();
            }, 50);
            // alert(Keyboard.isVisible);
        });
    
        // EVENTO CUANDO SE ESCRIBE EN EL INPUT DE LA TABLA EDITABLE(EVITA QUE SE DIGITEN LETRAS)
        $('#tablaeditable').on('keydown', 'input', function (e) {
    
            // permite: spacio, eliminar , tab, escape, enter y  .
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                // permite: Ctrl+letra, Command+letra
                ((e.keyCode >= 0) && (e.ctrlKey === true || e.metaKey === true)) ||
                // permite: home, fin, izquierda, derecha, abajo, arriba
                (e.keyCode >= 35 && e.keyCode <= 40)) {
                // no hace nada si cumple la condicion
                return;
            }
            // solo acepta numeros
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                //previene mandar los datos al input
                e.preventDefault();
            }
        });
    
        // EVENTO CUANDO SE CAMBIA  EL INPUT DE LA TABLA EDITABLE(VALIDA EL VALOR DIGITADO)
        $('#tablaeditable').on('change', 'input', function (e) {
            var alistados = $(this).val();
            
            const pedido = $('td:nth(1)', $(this).parents('tr')).text();
    
            // consigue el valor maximo en decenas que puede valer la cantidad de alistados
            // EJ: entre 0 y 10 maximo valor=10, entre 11 y 100 maximo valor 100
            var a = 0;
            var pot = pedido;
            do {
                a++;
                pot = pot / 10
            } while (pot > 1);
            var maxvalue = Math.pow(10, a)
    
            if (alistados > maxvalue * 10) {
                var toastHTML = `<p class="truncate black-text"><i class="fas fa-exclamation-circle"></i> Revisar cantidad alistada</span></p>`;
                M.toast({
                    html: toastHTML, classes: "red lighten-2'",
                    //  displayLength: 500 
                });
                $('#cerrar').attr('disabled', 'disabled');
                $(this).parents('tr').removeClass('yellow lighten-2');
                $(this).parents('tr').addClass('red lighten-2');
    
            } else if (alistados > maxvalue) {
                var toastHTML = `<p class="truncate black-text"><i class="fas fa-exclamation-circle"></i> Revisar cantidad alistada</span></p>`;
                M.toast({
                    html: toastHTML, classes: "yellow lighten-2'",
                    //  displayLength: 500 
                });
                $('#cerrar').removeAttr('disabled');
                $(this).parents('tr').removeClass('red lighten-3');
                $(this).parents('tr').addClass('yellow lighten-2');
                $(this).parents('tr').attr('title', 'Revisar Cantidad Alistada');
            } else {
                
                $('#cerrar').removeAttr('disabled');
                $(this).parents('tr').removeClass('yellow lighten-2');
                $(this).parents('tr').removeClass('red lighten-3');
                $(this).parents('tr').attr('title', '');
            }
    
        });
            
        
        // EVENTO SI SE PRESIONA 1 BOTON EN LA TABLA EDITABLE(ELIMINAR ITEM)
        $('#tablaeditable').on('click', 'button', function (e) {
            //consigue el numero de requerido
            e.preventDefault();
            var requeridos = $(".requeridos").val();
            //id usuario es obtenida de las variables de sesion
            var req = [requeridos, id_usuario];
    
            // se consigue el id del item y el nombre se quita la primera letra del id que representa en que tabla esta
            var iditem = $(this).closest('tr').attr('id').substr(1);
    
    
            const nomitem = $('td:first', $(this).parents('tr')).text();;
    
            // Pregunta si se elimina el item
            swal({
                title: `¿Quitar item ${nomitem}?`,
                icon: "warning",
                buttons: ['Cancelar', 'Quitar']
            })
                .then((Quitar) => {
    
                    if (Quitar) {
    
                        // elimina el item y vuelve a cargar la tabla de vista
                        var ubicacion = $('#ubicacion').val();
                        $.when(eliminarItem(iditem, req)).done(function () {
                            $.when(mostrarItems()).done(function () {
                                $('#ubicacion').val(ubicacion);
                                cambiarUbicacion();
                            });
                        });
    
                    }
    
                });
        });
    
        // EVENTO SI SE ENVIA EL FORMULARIO DE LA TABLA EDITABLE
        $('#cerrar').on('click',function (e) {
            
            e.preventDefault();
            
            //consigue el numero de requerido
            var requeridos = $('.requeridos').val();
            //id usuario es obtenida de las variables de sesion
            var req = [requeridos, id_usuario];
            // Busca los datos en la tabla
            var table = document.getElementById('tablaeditable');
            var tr = table.getElementsByTagName('tr');
            var items = new Array;
    
            // valida los datos
            for (var i = 0; i < tr.length; i++) {
    
                items[i] = {
                    'iditem': tr[i].id.substr(1),
                    'alistados': $(tr[i]).find('input').val(),
                };
                if (!items[i]['alistados']) {
                    var toastHTML = `<p class='truncate black-text'><i class='fas fa-exclamation-circle'></i> Asignar cantidad a todos los items</span></p>`;
                    M.toast({
                        html: toastHTML, classes: 'yellow lighten-2',
                    });
                    return 0;
                }
            }
            //guarda el tipo de caja en una variable
            var tipocaja = $('#caja').val();
            var pesocaja = $('#peso').val();
    
            // valida si se ingreso el peso03201
            if (!pesocaja) {
                var toastHTML = `<p class='truncate black-text'><i class='fas fa-exclamation-circle'></i> Asignar el peso a la caja</span></p>`;
                M.toast({
                    html: toastHTML, classes: 'yellow lighten-2',
                });
                return 0;
            }
            //si se presiona aceptar se continua con el proceso
            swal({
                title: '¿Cerrar caja?',
                icon: 'warning',
                buttons: ['Cancelar', 'Cerrar']
            }).then((Cerrar) => {
    
                //si se le da click en cerrar procede a pasar los items a la caja y a cerrarla
                if (Cerrar) {
    
                    $.ajax({
                        url: api_url+'alistar/empacar',//url de la funcion
                        method: 'post',//metodo post para mandar datos
                        data: { 'req': req, 'tipocaja': tipocaja, 'pesocaja': pesocaja, 'items': items },//datos que se enviaran 
                        dataType: 'JSON',
                        success: function (res) {
                            
                            if (res) {
    
                                swal('¡Caja cerrada exitosamente!', {
                                    icon: 'success',
                                }).then((event) => {
    
                                    // location.reload(true);
                                    // vuelve a cargar las tablas
                                    recargarItems();
                                    var table = document.getElementById('tablavista');
                                    var tr = table.getElementsByTagName('tr');
                                    
                                    if (tr.length<1) {
                                        swal('¡Requisicion Terminada!', {
                                            icon: 'warning',
                                        }).then((event) => {
                                            location.reload();
                                        })
                                    }
                                    $('.tabs').tabs('select', 'TablaV');
                                });
    
                            } else {
    
                                swal("¡Error al cerrar la caja!", {
                                    icon: "error",
                                });
    
                            }
    
                        }
                    });
                }
            });
    
        });

        $('#modalform').on('click','button', function () {
            var boton=$(this).attr('id');
            
            if (boton=='modalac') {
                
                agregarItem(); 
            }else{

                $('.modal').modal('close')
            }
        });
        
        $('#modalform').on('keydown', 'input', function (e) {
            //previene enviar formulario si se presiona enter
            // alert(e.which);
            $('.validacion-input').css('display', 'none');
            $('#cantidad').css('border-bottom', '1px solid gray');
            if (e.which == 9) {
                
                agregarItem(); 
            }
        });
        
        
        
    },

};

app.initialize();

/* ============================================================================================================================
                                                FUNCIONES   
============================================================================================================================*/

// funcion que se ejecuta al cambiar requeridos
function cambiarRequeridos() {
    $.when(mostrarItems()).done(function () {
        $.when(mostrarCaja()).done(function () {
            $("#codbarras").focus();
            // obtiene las ubicaciones al recargar tabla
            var options = $('#ubicacion option');
            
            var values = $.map(options ,function(option) {
                return option.value;
            });
            $('#ubicacion').val(values[0]);
            cambiarUbicacion();
        });
    });
}

// FUNCION QUE BUSCA EL CODIGO DE BARRAS
function buscarCodbar() {

    //consigue el codigo de barras
    var codigo = $('#codbarras').val();
    //consigue el numero de requerido
    var requeridos = $(".requeridos").val();
    //id usuario es obtenida de las variables de sesion
    var req = [requeridos, id_usuario];

    // ajax para ejecutar un script php mandando los datos
    return $.ajax({
        // url: 'ajax/alistar.items.ajax.php',//url de la funcion
        url: api_url+'alistar/items',//url de la funcion
        type: 'GET',//metodo post para mandar datos
        data: { "codigo": codigo, "req": req },//datos que se enviaran
        dataType: 'JSON',
        success: function (res) {

            // agregarItem(res, req);
            $('#codbarras').val("");
            $("#codbarras").focus();
            if (res['estado'] == 'encontrado') {
                var item = res['contenido'];
                if (item) {
                    
                    // abre ventana modal par cantidad de items
                    $('.modal').modal('open');

                    // muestra datos del item
                    $('#modalitem').html(item['descripcion']);
                    $('#modalitem').attr('name', item['iditem']);

                    $('#modalpedido').html(item['pedido']);
                    $('#modaldisponible').html(item['disponibilidad']);
                    $('#modalpendiente').html(item['pendientes']);


                }else {
                    swal('Item ya fue alistado en otra caja', {
                        icon: 'warning',
                    }).then((value) => {
                        $('#codbarras').focus();
                    });
        
                }
                //si no encontro el item regresa el contenido del error(razon por la que no lo encontro)
            } else {
                swal(res['contenido'], {
                    icon: 'warning',
                }).then((value) => {
                    $('#codbarras').focus();
                });
            }
        }
    });


}

// FUNCIONQ UE QUITA UN ITEM DE LA CAJA
function eliminarItem(iditem, req) {

    return $.ajax({
        type: "POST",
        url: api_url+'alistar/eliminaritem',
        data: { "iditem": iditem, "req": req },
        dataType: "JSON",
        success: function (res) {

            if (res != false) {
                $(`#E${iditem}`).remove();
            } else {
                var toastHTML = '<p class="truncate">No se pudo eliminar el item</span></p>';
                M.toast({ html: toastHTML, classes: "red darken-4" });
            }
        }
    });

}

// FUNCION QUE RECARGA LAS TABLAS
function recargarItems() {

    // se recarga tablas y ubicacion
    var ubicacion = $('#ubicacion').val();
    $.when(mostrarItems()).done(function () {
        $.when(mostrarCaja()).done(function () {
            // obtiene las ubicaciones al recargar tabla
            var options = $('#ubicacion option');
            
            var values = $.map(options ,function(option) {
                return option.value;
            });

            // si la ubicacion en la que se estaba trabajando no tiene items , se cambia a otra ubicacion
            if (!values.includes(ubicacion)) {
                ubicacion=$('#ubicacion option').eq(0).val();
            }
            $('#ubicacion').val(ubicacion);
            cambiarUbicacion();
        });
    });
}

// FUNCION QUE AGREGA ITEM A LA TABLA EDITABLE
function agregarItem() {
    
    var value = $("#cantidad").val();
    $("#cantidad").val('');
    //consigue el numero de requerido
    var requeridos = $(".requeridos").val();
    //id usuario es obtenida de las variables de sesion
    var req = [requeridos, id_usuario];
    var item=new Array();
    item={
        'pedido':$('#modalpedido').html(),
        'pendientes':$('#modalpendiente').html(),
        'iditem':$('#modalitem').attr('name')
    }

    // alista el item si se presiona en alistar o se da en enter
    if ((value.toString().length>=13 && value.toString()!='65743328329379842953') || value<0 ) {
        
        // $('.validacion-input').removeClass('hide');
        $('.validacion-input').css('display', 'flex');
        $('#cantidad').css('border-bottom', '1px solid red');
    }
    else {
        $('.modal').modal('close')
        $('#cantidad').css('border-bottom', '1px solid gray');
        // $('.validacion-input').addClass('hide');

        $('.validacion-input').css('display', 'none');
        // consigue el valor maximo en decenas que puede valer la cantidad de alistados
        // EJ: entre 0 y 10 maximo valor=100, entre 11 y 100 maximo valor 1000
        var a = 0;
        var pot = item['pedido'];
        do {
            a++;
            pot = pot / 10;
        } while (pot > 1);
        var maxvalue = Math.pow(10, a);

        if (value === '' || value.toString().length==20  || value==0) {
            value = item['pendientes'];
        }
        ;
        if (value < maxvalue * 10) {

            if (value > maxvalue) {

                var toastHTML = `<p class='truncate black-text'><i class='fas fa-exclamation-circle'></i> Revisar cantidad alistada</span></p>`;
                M.toast({
                    html: toastHTML, classes: 'yellow lighten-2',
                });
            }

        } else {

            var toastHTML = `<p class="truncate black-text"><i class="fas fa-exclamation-circle"></i>Cantidad alistada es muy grande</span></p>`;
            M.toast({
                html: toastHTML, classes: "red lighten-2'",
            });
            value = 1;

        }
        
        item['alistados'] = value;

        return $.ajax({
            // url: 'ajax/alistar.items.ajax.php',//url de la funcion
            url: api_url+'alistar/items',//url de la funcion
            type: 'POST',//metodo post para mandar datos
            data: { 'item': item, 'req': req },//datos que se enviaran
            dataType: 'JSON',
            success: function (res) {
                
                if (res) {
                    //se recargan los datos en las tablas
                    recargarItems();
                    $('#codbarras').focus();
                } else {
                    swal('Error al alistar el item', {
                        icon: 'error',
                    }).then((value) => {
                        $('#codbarras').focus();
                    });
                }
            }
        });
    }

}

// FUNCION QUE PONE LOS ITEMS  EN LA TABLA
function mostrarItems() {

    //consigue el numero de requerido
    var requeridos = $('.requeridos').val();
    //id usuario es obtenida de las variables de sesion
    var req = [requeridos, id_usuario];

    return $.ajax({

        url: api_url+'alistar/items',//url de la funcion
        method: 'GET',
        data: { 'req': req },
        dataType: 'JSON',
        success: function (res) {
            
            //si encuentra el item mostrarlo en la tabla
            if (res['estado'] != 'error') {


                var items = res['contenido'];

                $('#tablavista').html('');


                for (var i in items) {

                    // se guarda el id del item en el id de la fila
                    $('#tablavista').append($(`<tr id='V${i}'>
                                            <td>${items[i]['descripcion']}</td>
                                            <td>${items[i]['disponibilidad']}</td>
                                            <td>${items[i]['pendientes']}</td>
                                            <td>${items[i]['ubicacion']}</td>
                                        </tr>`));

                }

                // se carga el menu seleccion de ubicaciones
                var ubicaciones = res['ubicaciones'];
                $('#ubicacion').html('');
                
                for (var i in ubicaciones) {

                    $('#ubicacion').append($(`<option value="${ubicaciones[i]}"> ${ubicaciones[i]}</option>`));

                }
                cambiarUbicacion();
                // ssdfsdf
                $('.entradas').removeClass('hide');

            } else {
                //oculta las entradas
                $('.entradas').addClass('hide');
            }

        }

    });

}

// FUNCION QUE CREA O MUESTRA UNA CAJA
function mostrarCaja() {

    //consigue el numero de requerido
    var requeridos = $('.requeridos').val();
    //id usuario es obtenida de las variables de sesion
    var req = [requeridos, id_usuario];
    return $.ajax({

        // url: 'ajax/alistar.cajas.ajax.php',
        url: api_url+'alistar/cajas',
        method: 'POST',
        data: { 'req': req },
        dataType: 'JSON',
        success: function (res) {
            
            //refresca las tablas, para volver a cargar los datos
            $('#tablaeditable').html('');
            $('#TablaE').addClass('hide');
            // si la caja ya esta creada muestra los items en la tabla de alistar
            if (res['estadocaja'] == 'yacreada') {
                //si encontro el codigo de barras muestar el contenido de la busqueda
                if (res['estado'] == 'encontrado') {

                    //refresca las tablas, para volver a cargar los datos
                    $('#tablaeditable').html('');

                    var items = res['contenido'];

                    var maxvalue;
                    for (var i in items) {
                        // consigue el valor maximo en decenas que puede valer la cantidad de alistados
                        // EJ: entre 0 y 10 maximo valor=100, entre 11 y 100 maximo valor 1000
                        var a = 0;
                        var pot = items[i]['pedido'];
                        do {
                            a++;
                            pot = pot / 10
                        } while (pot > 1);
                        maxvalue = Math.pow(10, a);
                        colorwarning = '';
                        titlewarning = '';
                        if (items[i]['alistado'] > maxvalue) {
                            colorwarning = 'yellow lighten-2';
                            titlewarning = 'Revisar cantidad alistada';
                        }
                        // se guerda el id del item en el id de la fila 
                        $('#tablaeditable').append($(`<tr
                                                    id='E${items[i]['iditem']}'
                                                    class='${colorwarning}'
                                                    title='${titlewarning}'
                                                    >
                                                        <td>${items[i]['descripcion']}</td>
                                                        <td>${items[i]['pedido']}</td>
                                                        <td><input type= 'number' min='1' class='alistados eliminaritem' min=1 max=${maxvalue * 10} required value='${items[i]['alistado']}'></td>
                                                        <td><button  title='Eliminar Item' class='btn-floating btn-small waves-effect waves-light red darken-3 ' > 
                                                            <i class='fas fa-times'></i>
                                                        </button></tr></td>
                                                    </tr>`));

                    }

                    $('#TablaE').removeClass('hide');
                    // si hay una caja sin cerrar en otra requisicion muestra mensaje adventencia y recarga la pagina          
                } else if (res['estado'] == 'error2') {
                    swal({
                        title: '!No se puede generar caja¡',
                        text: `Caja sin cerrar en la requisicion ${res['contenido']}`,
                        icon: 'warning',
                    })
                        .then((ok) => {
                            // location.reload();
                            $('.requeridos').val(res['contenido']);
                            recargarItems();
                        });
                }

            }

        }

    });
}

// FUNCION QUE CAMBIA DE UBICACION LOS ITEMS MOSTRADOS
function cambiarUbicacion() {
    var ubicacion = $('#ubicacion').val(); //dato de ubicacion del menu de seleccion 

    $('#TablaVi').removeClass('hide');
    // evita que alistadores vean todos los items
    if (perfil == 3 && (ubicacion == '' || !ubicacion)) {
        ubicacion = '---';
    }

    var filter, table, tr, td, i;

    filter = ubicacion.toUpperCase();
    table = document.getElementById('tablavista');
    tr = table.getElementsByTagName('tr');
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName('td')[3];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = '';
            } else {
                tr[i].style.display = 'none';
            }
        }
    }

}
