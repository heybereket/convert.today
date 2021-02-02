function gbr_ink(sourceID, resultID) {
    var canvas = fx.canvas();
    var texture = canvas.texture(document.getElementById(sourceID));
    canvas.draw(texture).ink(0.35).update();
    var image = new Image;
    document.getElementById(resultID).src = canvas.toDataURL();
    //document.getElementById(sourceID).parentNode.insertBefore(canvas, document.getElementById(sourceID)); //jika disimpan di canvas
};

function gbr_denoise(sourceID, resultID) {
    var canvas = fx.canvas();
    var texture = canvas.texture(document.getElementById(sourceID));
    canvas.draw(texture).denoise(50).update();
    var image = new Image;
    document.getElementById(resultID).src = canvas.toDataURL();
};

function gbr_contrast(sourceID, resultID) {
    var canvas = fx.canvas();
    var texture = canvas.texture(document.getElementById(sourceID));
    canvas.draw(texture).brightnessContrast(0.1, 0.2).update();
    var image = new Image;
    document.getElementById(resultID).src = canvas.toDataURL();

    setTimeout(function() {
        gbr_denoise('image2', 'image3')
    }, 2);

    setTimeout(function() {
        gbr_ink('image3', 'image')
    }, 4);

    setTimeout(function() {
        hapus_atr('#image1', 'src');
        hapus_atr('#image2', 'src');
        hapus_atr('#image3', 'src');
    }, 6);
};

function hapus_atr(elem, att) {
    var els = document.querySelectorAll(elem);
    for (var i = 0; i < els.length; i++) {
        els[i].removeAttribute(att);
    }
}

document.body.addEventListener("mouseover", function(event) {
    document.body.style.backgroundColor = '#fff';

    document.body.onpaste = function(event) {
        hapus_atr('image', 'src');
        // use event.originalEvent.clipboard for newer chrome versions
        var items = (event.clipboardData || event.originalEvent.clipboardData).items;
        //console.log(JSON.stringify(items)); // will give you the mime types
        // find pasted image among pasted items
        var blob = null;
        for (var i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") === 0) {
                blob = items[i].getAsFile();
            }
        }
        // load image if there is a pasted image
        if (blob !== null) {
            var reader = new FileReader();
            reader.onload = function(event) {
                //console.log(event.target.result); // data url!
                var lgbr = event.target.result;
                document.getElementById("image1").src = lgbr;

                setTimeout(function() {
                    gbr_contrast('image1', 'image2');
                }, 2);
                //addNote(lgbr);
            };
            reader.readAsDataURL(blob);
        }
    }
});
document.body.addEventListener("mouseout", function(event) {
    //document.body.style.backgroundColor = '#ddd';
});

document.addEventListener('DOMContentLoaded', function() {
    var handleDrag = function(e) {
        hapus_atr('image', 'src');
        //kill any default behavior
        e.stopPropagation();
        e.preventDefault();
    };
    var handleDrop = function(e) {
        //kill any default behavior
        e.stopPropagation();
        e.preventDefault();
        //console.log(e);
        //get x and y coordinates of the dropped item
        x = e.clientX;
        y = e.clientY;
        //drops are treated as multiple files. Only dealing with single files right now, so assume its the first object you're interested in
        var file = e.dataTransfer.files[0];
        //don't try to mess with non-image files
        if (file.type.match('image.*')) {
            //then we have an image,

            //we have a file handle, need to read it with file reader!
            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function(theFile) {
                //get the data uri
                var dataURI = theFile.target.result;
                //make a new image element with the dataURI as the source
                // var img = document.createElement("img");
                // img.src = dataURI;

                var img = document.getElementById('image1');
                img.src = dataURI;

                //Insert the image at the carat

                // Try the standards-based way first. This works in FF
                if (document.caretPositionFromPoint) {
                    var pos = document.caretPositionFromPoint(x, y);
                    range = document.createRange();
                    range.setStart(pos.offsetNode, pos.offset);
                    range.collapse();
                    range.insertNode(img);
                }
                // Next, the WebKit way. This works in Chrome.
                else if (document.caretRangeFromPoint) {
                    range = document.caretRangeFromPoint(x, y);
                    range.insertNode(img);
                } else {
                    //not supporting IE right now.
                    console.log('could not find carat');
                }

                setTimeout(function() {
                    gbr_contrast('image1', 'image2');
                }, 2);

            });
            //this reads in the file, and the onload event triggers, which adds the image to the div at the carat
            reader.readAsDataURL(file);
        }
    };

    var dropZone = document.body;
    dropZone.addEventListener('dragover', handleDrag, false);
    dropZone.addEventListener('drop', handleDrop, false);

    //Fungsi tombol upload			    
    var readURL = function(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function(e) {
              var img = new Image();

              img.onload = function() {
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                canvas.width = 640;
                canvas.height = canvas.width * (img.height / img.width);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                var data = canvas.toDataURL('image/png');
                
                                document.getElementById('image1').src = data;

                                setTimeout(function() {
                                    gbr_contrast('image1', 'image2');
                                }, 2);
                            }
              img.src = e.target.result;
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    document.getElementById('file-upload').addEventListener('change', function() {
        readURL(this);
        //filesChanged(this.files)
    });
    /*document.getElementById('upload-button').addEventListener('click', function () {
readURL(this);
});*/
});

function filesChanged(files){
for (var i = 0; i < files.length; i++) {
downscale(files[i], 720, 0).
then(function(dataURL) {
                document.getElementById('image1').src = dataURL;

                setTimeout(function() {
                    gbr_contrast('image1', 'image2');
                }, 2);

})
}
}