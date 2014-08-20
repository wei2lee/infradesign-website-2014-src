window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

/* Utilities */
Filters = {};
Filters.getPixels = function(img) {
  var c = this.getCanvas(img.width, img.height);
  var ctx = c.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return {imgData:ctx.getImageData(0,0,c.width,c.height), canvas:c, context:ctx};
};

Filters.getCanvas = function(w,h) {
  var c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
};

Filters.grayscale = function(pixels, args) {
  var d = pixels.data;
  for (var i=0; i<d.length; i+=4) {
    var r = d[i];
    var g = d[i+1];
    var b = d[i+2];
    // CIE luminance for the RGB
    // The human eye is bad at seeing red and blue, so we de-emphasize them.
    var v = 0.2126*r + 0.7152*g + 0.0722*b;
    d[i] = d[i+1] = d[i+2] = v
  }
  return pixels;
};

Filters.filterImage = function(filter, image, var_args) {
  var obj = this.getPixels(image);
  var args = [obj.imgData];
  for (var i=2; i<arguments.length; i++) {
    args.push(arguments[i]);
  }
  obj.filteredImgData = filter.apply(null, args);
  obj.context.putImageData(obj.filteredImgData, 0, 0);
  return obj;
};
// Simple log
var log = function(msg) {
    console.log(msg);
};
// Default tracker mock
var track = function() {
    log('track: ' + arguments[0]);
};

// Serialization utility
var serialize = function(obj, re) {
    var result = [];
    $.each(obj, function(i, val) {
        if ((re && re.test(i)) || !re)
            result.push(i + ': ' + (typeof val == 'object' ? val.join 
                ? '\'' + val.join(', ') + '\'' : serialize(val) : '\'' + val + '\''));
    });
    return '{' + result.join(', ') + '}';
};

function modal(title,msg,msgclass) {
    $( 
                '<div class="modal fade" id="cu_Modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
                '<div class="vertical-alignment-helper">'+
                    '<div class="modal-dialog vertical-align-center">'+
                        '<div class="modal-content">'+
                            '<div class="modal-header">'+
                                '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span>'+

                                '</button>'+
                                 '<h4 class="modal-title" id="myModalLabel">'+title+'</h4>'+

                            '</div>'+
                            '<div class="modal-body"><div class="'+msgclass+'">'+msg+'</div></div>'+
                            '<div class="modal-footer">'+
                                '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'
    
    ).modal();
}