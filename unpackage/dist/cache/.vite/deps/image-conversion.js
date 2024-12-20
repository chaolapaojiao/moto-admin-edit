import {
  __commonJS
} from "./chunk-JFD4OJSJ.js";

// ../../../../../../Users/yuan/Desktop/study_ materials/moto-edit/node_modules/image-conversion/build/conversion.js
var require_conversion = __commonJS({
  "../../../../../../Users/yuan/Desktop/study_ materials/moto-edit/node_modules/image-conversion/build/conversion.js"(exports, module) {
    !function(t, e) {
      "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.imageConversion = e() : t.imageConversion = e();
    }(exports, function() {
      return function(t) {
        var e = {};
        function n(r) {
          if (e[r])
            return e[r].exports;
          var o = e[r] = { i: r, l: false, exports: {} };
          return t[r].call(o.exports, o, o.exports, n), o.l = true, o.exports;
        }
        return n.m = t, n.c = e, n.d = function(t2, e2, r) {
          n.o(t2, e2) || Object.defineProperty(t2, e2, { enumerable: true, get: r });
        }, n.r = function(t2) {
          "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t2, "__esModule", { value: true });
        }, n.t = function(t2, e2) {
          if (1 & e2 && (t2 = n(t2)), 8 & e2)
            return t2;
          if (4 & e2 && "object" == typeof t2 && t2 && t2.__esModule)
            return t2;
          var r = /* @__PURE__ */ Object.create(null);
          if (n.r(r), Object.defineProperty(r, "default", { enumerable: true, value: t2 }), 2 & e2 && "string" != typeof t2)
            for (var o in t2)
              n.d(r, o, (function(e3) {
                return t2[e3];
              }).bind(null, o));
          return r;
        }, n.n = function(t2) {
          var e2 = t2 && t2.__esModule ? function() {
            return t2.default;
          } : function() {
            return t2;
          };
          return n.d(e2, "a", e2), e2;
        }, n.o = function(t2, e2) {
          return Object.prototype.hasOwnProperty.call(t2, e2);
        }, n.p = "", n(n.s = 0);
      }([function(t, e, n) {
        "use strict";
        var r;
        function o(t2) {
          return ["image/png", "image/jpeg", "image/gif"].some((e2) => e2 === t2);
        }
        n.r(e), n.d(e, "canvastoDataURL", function() {
          return a;
        }), n.d(e, "canvastoFile", function() {
          return c;
        }), n.d(e, "dataURLtoFile", function() {
          return s;
        }), n.d(e, "dataURLtoImage", function() {
          return l;
        }), n.d(e, "downloadFile", function() {
          return d;
        }), n.d(e, "filetoDataURL", function() {
          return f;
        }), n.d(e, "imagetoCanvas", function() {
          return g;
        }), n.d(e, "urltoBlob", function() {
          return w;
        }), n.d(e, "urltoImage", function() {
          return m;
        }), n.d(e, "compress", function() {
          return p;
        }), n.d(e, "compressAccurately", function() {
          return b;
        }), n.d(e, "EImageType", function() {
          return r;
        }), function(t2) {
          t2.PNG = "image/png", t2.JPEG = "image/jpeg", t2.GIF = "image/gif";
        }(r || (r = {}));
        var i = function(t2, e2, n2, r2) {
          return new (n2 || (n2 = Promise))(function(o2, i2) {
            function a2(t3) {
              try {
                u2(r2.next(t3));
              } catch (t4) {
                i2(t4);
              }
            }
            function c2(t3) {
              try {
                u2(r2.throw(t3));
              } catch (t4) {
                i2(t4);
              }
            }
            function u2(t3) {
              var e3;
              t3.done ? o2(t3.value) : (e3 = t3.value, e3 instanceof n2 ? e3 : new n2(function(t4) {
                t4(e3);
              })).then(a2, c2);
            }
            u2((r2 = r2.apply(t2, e2 || [])).next());
          });
        };
        function a(t2, e2 = 0.92, n2 = r.JPEG) {
          return i(this, void 0, void 0, function* () {
            return o(n2) || (n2 = r.JPEG), t2.toDataURL(n2, e2);
          });
        }
        function c(t2, e2 = 0.92, n2 = r.JPEG) {
          return new Promise((r2) => t2.toBlob((t3) => r2(t3), n2, e2));
        }
        var u = function(t2, e2, n2, r2) {
          return new (n2 || (n2 = Promise))(function(o2, i2) {
            function a2(t3) {
              try {
                u2(r2.next(t3));
              } catch (t4) {
                i2(t4);
              }
            }
            function c2(t3) {
              try {
                u2(r2.throw(t3));
              } catch (t4) {
                i2(t4);
              }
            }
            function u2(t3) {
              var e3;
              t3.done ? o2(t3.value) : (e3 = t3.value, e3 instanceof n2 ? e3 : new n2(function(t4) {
                t4(e3);
              })).then(a2, c2);
            }
            u2((r2 = r2.apply(t2, e2 || [])).next());
          });
        };
        function s(t2, e2) {
          return u(this, void 0, void 0, function* () {
            const n2 = t2.split(",");
            let r2 = n2[0].match(/:(.*?);/)[1];
            const i2 = atob(n2[1]);
            let a2 = i2.length;
            const c2 = new Uint8Array(a2);
            for (; a2--; )
              c2[a2] = i2.charCodeAt(a2);
            return o(e2) && (r2 = e2), new Blob([c2], { type: r2 });
          });
        }
        function l(t2) {
          return new Promise((e2, n2) => {
            const r2 = new Image();
            r2.onload = () => e2(r2), r2.onerror = () => n2(new Error("dataURLtoImage(): dataURL is illegal")), r2.src = t2;
          });
        }
        function d(t2, e2) {
          const n2 = document.createElement("a");
          n2.href = window.URL.createObjectURL(t2), n2.download = e2 || Date.now().toString(36), document.body.appendChild(n2);
          const r2 = document.createEvent("MouseEvents");
          r2.initEvent("click", false, false), n2.dispatchEvent(r2), document.body.removeChild(n2);
        }
        function f(t2) {
          return new Promise((e2) => {
            const n2 = new FileReader();
            n2.onloadend = (t3) => e2(t3.target.result), n2.readAsDataURL(t2);
          });
        }
        var h = function(t2, e2, n2, r2) {
          return new (n2 || (n2 = Promise))(function(o2, i2) {
            function a2(t3) {
              try {
                u2(r2.next(t3));
              } catch (t4) {
                i2(t4);
              }
            }
            function c2(t3) {
              try {
                u2(r2.throw(t3));
              } catch (t4) {
                i2(t4);
              }
            }
            function u2(t3) {
              var e3;
              t3.done ? o2(t3.value) : (e3 = t3.value, e3 instanceof n2 ? e3 : new n2(function(t4) {
                t4(e3);
              })).then(a2, c2);
            }
            u2((r2 = r2.apply(t2, e2 || [])).next());
          });
        };
        function g(t2, e2 = {}) {
          return h(this, void 0, void 0, function* () {
            const n2 = Object.assign({}, e2), r2 = document.createElement("canvas"), o2 = r2.getContext("2d");
            let i2, a2;
            for (const t3 in n2)
              Object.prototype.hasOwnProperty.call(n2, t3) && (n2[t3] = Number(n2[t3]));
            if (n2.scale) {
              const e3 = n2.scale > 0 && n2.scale < 10 ? n2.scale : 1;
              a2 = t2.width * e3, i2 = t2.height * e3;
            } else
              a2 = n2.width || n2.height * t2.width / t2.height || t2.width, i2 = n2.height || n2.width * t2.height / t2.width || t2.height;
            switch ([5, 6, 7, 8].some((t3) => t3 === n2.orientation) ? (r2.height = a2, r2.width = i2) : (r2.height = i2, r2.width = a2), n2.orientation) {
              case 3:
                o2.rotate(180 * Math.PI / 180), o2.drawImage(t2, -r2.width, -r2.height, r2.width, r2.height);
                break;
              case 6:
                o2.rotate(90 * Math.PI / 180), o2.drawImage(t2, 0, -r2.width, r2.height, r2.width);
                break;
              case 8:
                o2.rotate(270 * Math.PI / 180), o2.drawImage(t2, -r2.height, 0, r2.height, r2.width);
                break;
              case 2:
                o2.translate(r2.width, 0), o2.scale(-1, 1), o2.drawImage(t2, 0, 0, r2.width, r2.height);
                break;
              case 4:
                o2.translate(r2.width, 0), o2.scale(-1, 1), o2.rotate(180 * Math.PI / 180), o2.drawImage(t2, -r2.width, -r2.height, r2.width, r2.height);
                break;
              case 5:
                o2.translate(r2.width, 0), o2.scale(-1, 1), o2.rotate(90 * Math.PI / 180), o2.drawImage(t2, 0, -r2.width, r2.height, r2.width);
                break;
              case 7:
                o2.translate(r2.width, 0), o2.scale(-1, 1), o2.rotate(270 * Math.PI / 180), o2.drawImage(t2, -r2.height, 0, r2.height, r2.width);
                break;
              default:
                o2.drawImage(t2, 0, 0, r2.width, r2.height);
            }
            return r2;
          });
        }
        function w(t2) {
          return fetch(t2).then((t3) => t3.blob());
        }
        function m(t2) {
          return new Promise((e2, n2) => {
            const r2 = new Image();
            r2.onload = () => e2(r2), r2.onerror = () => n2(new Error("urltoImage(): Image failed to load, please check the image URL")), r2.src = t2;
          });
        }
        var y = function(t2, e2, n2, r2) {
          return new (n2 || (n2 = Promise))(function(o2, i2) {
            function a2(t3) {
              try {
                u2(r2.next(t3));
              } catch (t4) {
                i2(t4);
              }
            }
            function c2(t3) {
              try {
                u2(r2.throw(t3));
              } catch (t4) {
                i2(t4);
              }
            }
            function u2(t3) {
              var e3;
              t3.done ? o2(t3.value) : (e3 = t3.value, e3 instanceof n2 ? e3 : new n2(function(t4) {
                t4(e3);
              })).then(a2, c2);
            }
            u2((r2 = r2.apply(t2, e2 || [])).next());
          });
        };
        function p(t2, e2 = {}) {
          return y(this, void 0, void 0, function* () {
            if (!(t2 instanceof Blob))
              throw new Error("compress(): First arg must be a Blob object or a File object.");
            if ("object" != typeof e2 && (e2 = Object.assign({ quality: e2 })), e2.quality = Number(e2.quality), Number.isNaN(e2.quality))
              return t2;
            const n2 = yield f(t2);
            let i2 = n2.split(",")[0].match(/:(.*?);/)[1], c2 = r.JPEG;
            o(e2.type) && (c2 = e2.type, i2 = e2.type);
            const u2 = yield l(n2), d2 = yield g(u2, Object.assign({}, e2)), h2 = yield a(d2, e2.quality, c2), w2 = yield s(h2, i2);
            return w2.size > t2.size ? t2 : w2;
          });
        }
        function b(t2, e2 = {}) {
          return y(this, void 0, void 0, function* () {
            if (!(t2 instanceof Blob))
              throw new Error("compressAccurately(): First arg must be a Blob object or a File object.");
            if ("object" != typeof e2 && (e2 = Object.assign({ size: e2 })), e2.size = Number(e2.size), Number.isNaN(e2.size))
              return t2;
            if (1024 * e2.size > t2.size)
              return t2;
            e2.accuracy = Number(e2.accuracy), (!e2.accuracy || e2.accuracy < 0.8 || e2.accuracy > 0.99) && (e2.accuracy = 0.95);
            const n2 = e2.size * (2 - e2.accuracy) * 1024, i2 = 1024 * e2.size, c2 = e2.size * e2.accuracy * 1024, u2 = yield f(t2);
            let d2 = u2.split(",")[0].match(/:(.*?);/)[1], h2 = r.JPEG;
            o(e2.type) && (h2 = e2.type, d2 = e2.type);
            const w2 = yield l(u2), m2 = yield g(w2, Object.assign({}, e2));
            let y2, p2 = 0.5;
            const b2 = [null, null];
            for (let t3 = 1; t3 <= 7; t3++) {
              y2 = yield a(m2, p2, h2);
              const e3 = 0.75 * y2.length;
              if (7 === t3) {
                (n2 < e3 || c2 > e3) && (y2 = [y2, ...b2].filter((t4) => t4).sort((t4, e4) => Math.abs(0.75 * t4.length - i2) - Math.abs(0.75 * e4.length - i2))[0]);
                break;
              }
              if (n2 < e3)
                b2[1] = y2, p2 -= Math.pow(0.5, t3 + 1);
              else {
                if (!(c2 > e3))
                  break;
                b2[0] = y2, p2 += Math.pow(0.5, t3 + 1);
              }
            }
            const v = yield s(y2, d2);
            return v.size > t2.size ? t2 : v;
          });
        }
      }]);
    });
  }
});

// ../../../../../../Users/yuan/Desktop/study_ materials/moto-edit/node_modules/image-conversion/index.js
var require_image_conversion = __commonJS({
  "../../../../../../Users/yuan/Desktop/study_ materials/moto-edit/node_modules/image-conversion/index.js"(exports, module) {
    module.exports = require_conversion();
  }
});
export default require_image_conversion();
//# sourceMappingURL=image-conversion.js.map
