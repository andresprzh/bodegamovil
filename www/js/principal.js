/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
// url del api
var api_url='http://192.168.1.54/BodegaDrogueria/api/';
// var api_url='http://192.168.0.11/BodegaDrogueria/api/';
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
        // this.receivedEvent('deviceready');
        // Keyboard.shrinkView(true);
        // INICIA MENU DE SELECCION
        $('select').formSelect();
    
        if (localStorage.session==1) {
    
            
            $.get('modulos/navbar.html', function(data){
                $('body').append(data);
            });
            // $('#nav').load('modulos/navbar.html');
    
            ;(function($) {
                var app = $.sammy(function() {
            
                    this.get('#/salir', function() {
                    
                    // localStorage.session=0;
                    localStorage.clear();
                    // location.reload();
                    window.location = '#/';
                    location.reload();
                    
                    });
                    
                    this.get('/', function() { 
                        // $('body').html('');
                        
                        // $('#main').load('modulos/inicio.html');
                        $('main').remove();
                        $.get('modulos/inicio.html', function(data){
                            $('body').append(data);
                        });
                    });
    
                    this.get('#/inicio', function() {
                        // $('#main').load('modulos/inicio.html');
                        $('main').remove();
                        $.get('modulos/inicio.html', function(data){
                            $('body').append(data);
                        });
                    });
            
                    this.get('#/alistar', function() {
                        $('main').remove();
    
                        // solo muestra si el usuario es alistador o admin
                        if (localStorage.perfil==3 || localStorage.perfil==1 ) {
                            $.get('modulos/alistar.html', function(data){
                                $('body').append(data);
                            });
                        }else{
                            $.get('modulos/404.html', function(data){
                                $('body').append(data);
                            }); 
                        }
                        
                        
                    });
    
                    this.get('#/transportador', function() {
                        $('main').remove();
    
                        // solo muestra si el usuario es transportador o admin
                        if (localStorage.perfil==6 || localStorage.perfil==1 ) {
                            $.get('modulos/transportador.html', function(data){
                                $('body').append(data);
                            });
                        }else{
                            $.get('modulos/404.html', function(data){
                                $('body').append(data);
                            }); 
                        }
                        
                        
                    });
            
                });
            
                $(function() {
                    app.run()
                });
                })(jQuery);
            
            // $('#footer').load('modulos/footer.html');
            
        }else{
            $('body').html('');
            $.get('modulos/login.html', function(data){
                $('body').append(data);
            });
        }


        
    },

};

app.initialize();