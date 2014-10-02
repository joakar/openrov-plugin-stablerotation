(function (window, $, undefined) {
    'use strict';

    var stablerotation;
    var smoothReading = 3;
    var readings = [];
    var total = 0;
    var index = 0;                 
    var average = 0;
    var isDisabled = false; 
    var lastRoll = 0;  

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
    jQuery(function(){
      setInterval(function(){
        if(!isDisabled){
          total = total - readings[index];   
          readings[index] = lastRoll;
          total = total + readings[index];        
          index = index + 1;                    
          if (index >= smoothReading){     
            index = 0;  
          }
          average = total / smoothReading; 
          document.getElementById('video-canvas').style.webkitTransform = 'rotate(' + -average + 'deg)';
        }
      },64);
    });
    
    stablerotation.prototype.listen = function listen() {
      var rov = this;
        rov.cockpit.socket.on('navdata', function (data) {
            lastRoll = parseFloat(data.roll);
        });
    };
    window.Cockpit.plugins.push(stablerotation);

}(window, jQuery));
