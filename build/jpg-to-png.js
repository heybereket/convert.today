var y = 0;
function x(a) {
  if (FileReader && a && a.length) {
    var c = document.querySelectorAll(".box")[0];
    c.classList.add("is-uploading");
    y += a.length;
    for (var b = 0; b < a.length; b++)
      (function (a) {
        var b = new FileReader();
        b.onload = function () {
          var d = document.createElement("canvas"),
            f = d.getContext("2d"),
            e = new Image();
          e.onload = function () {
            d.width = e.width;
            d.height = e.height;
            f.drawImage(e, 0, 0);
            var b = a.name.replace(/\.\w{1,}$/, ".png");
            d.msToBlob
              ? window.navigator.msSaveBlob(d.msToBlob(), b)
              : d.toBlob(
                  function (a) {
                    var c = document.createElement("a");
                    c.href = URL.createObjectURL(a);
                    c.download = b;
                    c.style = "display:none";
                    document.body.appendChild(c);
                    c.click();
                    c.remove();
                  },
                  "image/png",
                  1
                );
            --y;
            0 >= y &&
              (c.classList.remove("is-uploading"),
              c.classList.add("is-success"));
          };
          e.src = b.result;
        };
        b.readAsDataURL(a);
      })(a[b]);
  }
}
function z() {
  var a = document.createElement("div");
  return (
    ("draggable" in a || ("ondragstart" in a && "ondrop" in a)) &&
    "FormData" in window &&
    "FileReader" in window
  );
}
var forms = document.querySelectorAll(".box");
Array.prototype.forEach.call(forms, function (a) {
  var c = a.querySelector(".box_file");
  c.addEventListener("change", function (a) {
    x(a.target.files);
  });
  z &&
    (a.classList.add("has-advanced-upload"),
    "drag dragstart dragend dragover dragenter dragleave drop"
      .split(" ")
      .forEach(function (b) {
        a.addEventListener(b, function (a) {
          a.preventDefault();
          a.stopPropagation();
        });
      }),
    ["dragover", "dragenter"].forEach(function (b) {
      a.addEventListener(b, function () {
        a.classList.add("is-dragover");
      });
    }),
    ["dragleave", "dragend", "drop"].forEach(function (b) {
      a.addEventListener(b, function () {
        a.classList.remove("is-dragover");
      });
    }),
    a.addEventListener("drop", function (a) {
      x(a.dataTransfer.files);
    }),
    a.addEventListener("click", function () {
      c.click();
    }));
});
