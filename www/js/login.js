
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
        $('#login').submit(function (e) {
            e.preventDefault();
            const username = $('#usuario').val();
            const passowrd = $('#password').val();
    
            
            // return 0;
            $.ajax({
                type: 'POST',
                url: api_url+'usuarios/login',
                dataType: 'JSON',
                data: { 'username': username, 'password': passowrd },
                success: function (res) {
                    
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
    
                }
            });
        });
        
    },

};

app.initialize();

