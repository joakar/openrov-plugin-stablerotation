(function (window, $, undefined) {
    'use strict';

    var stablerotation;
    var smoothReading = 3;
    var readings = [];
    var total = 0;
    var index = 0;                 
    var average = 0;
    var isDisabled = false;   

    stablerotation = function stablerotation(cockpit) {
      console.log("Loading stablerotation plugin in the browser.");
      for (var thisReading = 0; thisReading < smoothReading; thisReading++){
        readings[thisReading] = 0; 
      }
      // Instance variables
      this.cockpit = cockpit;
      // for plugin management:
      this.name = 'stablerotation';   // for the settings
      this.viewName = 'Stable camera rotation'; // for the UI
      this.canBeDisabled = true; //allow enable/disable
      this.enable = function () {
        isDisabled = false;
      };
      this.disable = function () {
        isDisabled = true;
        document.getElementById('video-canvas').style.webkitTransform = 'rotate(0deg)';
      };
    };
    var canvas = document.getElementById('video-canvas');
    
    
    stablerotation.prototype.listen = function listen() {
      var rov = this;
      setTimeout(function() {
        rov.cockpit.socket.on('navdata', function (data) {
          if(!isDisabled){
            total = total - readings[index];   
            readings[index] = parseFloat(data.roll);
            total = total + readings[index];        
            index = index + 1;                    
            if (index >= smoothReading){     
              index = 0;  
            }
            average = total / smoothReading; 
            document.getElementById('video-canvas').style.webkitTransform = 'rotate(' + -average + 'deg)';
          }
        });
      }, 500);
    };
    
   
    var rotation = 0;
    

    window.Cockpit.plugins.push(stablerotation);

}(window, jQuery));
