
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
        $('.modal').modal();

        $('#login').submit(function (e) {
            e.preventDefault();
            const username = $('#usuario').val();
            const passowrd = $('#password').val();
    
            $('#usuario').prop("disabled", true)
            $('#password').prop("disabled", true)
            $('#login button').prop("disabled", true)

            // return 0;
            $.ajax({
                type: 'POST',
                url: api_url+'usuarios/login',
                dataType: 'JSON',
                timeout:5000,
                data: { 'username': username, 'password': passowrd },
                success: function (res) {
                    
                    $('#usuario').prop("disabled", false)
                    $('#password').prop("disabled", false)
                    $('#login button').prop("disabled", false)
                    if (res) {
                        localStorage.session=1;
    
                        localStorage.id=res['id'];
                        localStorage.usuario=res['usuario'];
                        localStorage.nombre=res['nombre'];
                        localStorage.perfil=res['perfil'];
    
                        window.location = '#/';
                        location.reload();
                        
                    } else {
                        
                        $('#error').removeClass('hide');
                    }
    
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    $('#usuario').prop("disabled", false)
                    $('#password').prop("disabled", false)
                    $('#login button').prop("disabled", false)
                    alert('Error conexion ' + XMLHttpRequest.readyState);
                }
            });
        });
        
        $('#settings').click(function (e) { 
            e.preventDefault();
            $('#editaritem').html('');
            $.get('modulos/settings.html', function(data){
                $('#editaritem').append(data);
            });
            $('.modal').modal('open');
        });
    },

};

app.initialize();

