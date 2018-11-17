var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    
    onDeviceReady: function() {
    
        // Keyboard.shrinkView(true);
        // INICIA MENU DE SELECCION
        $('select').formSelect();
        $('#api_url').val(localStorage.api_url);
        this.receivedEvent('deviceready');
        
    },
    receivedEvent: function(id){

        $('#guardar').click(function (e) { 
            e.preventDefault();
            localStorage.api_url=$('#api_url').val()
            api_url=localStorage.api_url;
            var toastHTML = '<span>Opciones guardadas</span>';
            M.toast({html: toastHTML,classes: "green darken-4"});
        });
    },

    // sqliteconection: function(){
    //     window.sqlitePlugin.echoTest(function(){
    //        alert('conexion correcta') ;
    //     });
    // },
};

app.initialize();