import {
  __commonJS
} from "./chunk-MNTBHR2J.js";

// ../../../../../../Users/yuan/Desktop/study_ materials/moto-edit/node_modules/image-compressor/dist/image-compressor.js
var require_image_compressor = __commonJS({
  "../../../../../../Users/yuan/Desktop/study_ materials/moto-edit/node_modules/image-compressor/dist/image-compressor.js"(exports, module) {
    !function(t, e) {
      "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.ImageCompressor = e() : t.ImageCompressor = e();
    }(window, function() {
      return function(t) {
        var e = {};
        function s(i) {
          if (e[i])
            return e[i].exports;
          var a = e[i] = { i, l: false, exports: {} };
          return t[i].call(a.exports, a, a.exports, s), a.l = true, a.exports;
        }
        return s.m = t, s.c = e, s.d = function(t2, e2, i) {
          s.o(t2, e2) || Object.defineProperty(t2, e2, { enumerable: true, get: i });
        }, s.r = function(t2) {
          "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t2, "__esModule", { value: true });
        }, s.t = function(t2, e2) {
          if (1 & e2 && (t2 = s(t2)), 8 & e2)
            return t2;
          if (4 & e2 && "object" == typeof t2 && t2 && t2.__esModule)
            return t2;
          var i = /* @__PURE__ */ Object.create(null);
          if (s.r(i), Object.defineProperty(i, "default", { enumerable: true, value: t2 }), 2 & e2 && "string" != typeof t2)
            for (var a in t2)
              s.d(i, a, (function(e3) {
                return t2[e3];
              }).bind(null, a));
          return i;
        }, s.n = function(t2) {
          var e2 = t2 && t2.__esModule ? function() {
            return t2.default;
          } : function() {
            return t2;
          };
          return s.d(e2, "a", e2), e2;
        }, s.o = function(t2, e2) {
          return Object.prototype.hasOwnProperty.call(t2, e2);
        }, s.p = "", s(s.s = 0);
      }([function(t, e, s) {
        "use strict";
        s.r(e), s.d(e, "ImageCompressor", function() {
          return a;
        });
        const i = { toWidth: null, toHeight: null, mimeType: "image/png", speed: "low", mode: "strict", grayScale: false, sepia: false, threshold: false, vReverse: false, hReverse: false, quality: 1 };
        class a {
          constructor() {
            this.settings = JSON.parse(JSON.stringify(i)), this.canvas = document.createElement("canvas"), this.image = document.createElement("img"), this.context = this.canvas.getContext("2d"), this.listenEvents();
          }
          listenEvents() {
            this.image.addEventListener("load", this.imageLoaded.bind(this), false), this.image.addEventListener("error", this.imageFault, false);
          }
          imageLoaded() {
            this.checkSizes(), this.compress();
          }
          imageFault() {
            throw new Error("Source can not be loaded");
          }
          run(t2, e2, s2) {
            this.settings = JSON.parse(JSON.stringify(i)), this.settings.toWidth = e2.toWidth, this.settings.toHeight = e2.toHeight, this.settings.mimeType = e2.mimeType || this.settings.mimeType, this.settings.mode = "strict" === e2.mode || "stretch" === e2.mode ? e2.mode : this.settings.mode, this.settings.speed = e2.speed || this.settings.speed, this.settings.grayScale = e2.hasOwnProperty("grayScale") ? e2.grayScale : this.settings.grayScale, this.settings.sepia = e2.hasOwnProperty("sepia") ? e2.sepia : this.settings.sepia, this.settings.threshold = e2.hasOwnProperty("threshold") ? e2.threshold : this.settings.threshold, this.settings.hReverse = e2.hasOwnProperty("hReverse") ? e2.hReverse : this.settings.hReverse, this.settings.vReverse = e2.hasOwnProperty("vReverse") ? e2.vReverse : this.settings.vReverse, this.imageReceiver = s2, this.image.src = t2;
          }
          compress() {
            "high" !== this.settings.speed && this.compressWithQuality(), this.compressAddOn();
          }
          compressAddOn() {
            this.naturalAR = this.image.naturalWidth / this.image.naturalHeight, this.compressedAR = this.settings.toWidth / this.settings.toHeight, this.canvas.width = this.settings.toWidth, this.canvas.height = this.settings.toHeight, this.context.fillStyle = "image/png" === this.settings.mimeType ? "rgba(255, 255, 255, 0)" : "#FFFFFF", this.context.fillRect(0, 0, this.settings.toWidth, this.settings.toHeight), "strict" === this.settings.mode && this.strictResize(), "stretch" === this.settings.mode && this.stretchResize(), this.imageFilters(), this.imageReverse(), this.imageReceiver(this.canvas.toDataURL(this.settings.mimeType, this.settings.quality)), this.compressedCanv = null;
          }
          compressWithQuality() {
            this.image.naturalWidth <= this.settings.toWidth && this.image.naturalHeight <= this.settings.toHeight ? this.compressAddOn() : this.firstCompress();
          }
          firstCompress() {
            const t2 = document.createElement("canvas"), e2 = t2.getContext("2d");
            let s2 = this.image.naturalWidth / 2, i2 = this.image.naturalHeight / 2, a2 = this.settings.toWidth, h = this.settings.toHeight;
            if (!(s2 < a2 || i2 < h)) {
              for (t2.width = s2, t2.height = i2, e2.drawImage(this.image, 0, 0, s2, i2), s2 /= 2, i2 /= 2; s2 > a2 && i2 > h; )
                e2.drawImage(t2, 0, 0, 2 * s2, 2 * i2, 0, 0, s2, i2), s2 /= 2, i2 /= 2;
              this.compressedCanv = t2, this.compressedW = 2 * s2, this.compressedH = 2 * i2;
            }
          }
          strictResize() {
            this.naturalAR >= this.compressedAR ? this.fitWidth() : this.fitHeight();
          }
          stretchResize() {
            this.compressedCanv ? this.context.drawImage(this.compressedCanv, 0, 0, this.compressedW, this.compressedH, 0, 0, this.settings.toWidth, this.settings.toHeight) : this.context.drawImage(this.image, 0, 0, this.settings.toWidth, this.settings.toHeight);
          }
          fitWidth() {
            const t2 = this.settings.toWidth / this.naturalAR, e2 = (this.settings.toHeight - t2) / 2;
            this.compressedCanv ? this.context.drawImage(this.compressedCanv, 0, 0, this.compressedW, this.compressedH, 0, e2, this.settings.toWidth, t2) : this.context.drawImage(this.image, 0, e2, this.settings.toWidth, t2);
          }
          fitHeight() {
            const t2 = this.settings.toHeight * this.naturalAR, e2 = (this.settings.toWidth - t2) / 2;
            this.compressedCanv ? this.context.drawImage(this.compressedCanv, 0, 0, this.compressedW, this.compressedH, e2, 0, t2, this.settings.toHeight) : this.context.drawImage(this.image, e2, 0, t2, this.settings.toHeight);
          }
          checkSizes() {
            const t2 = this.image.naturalWidth / this.image.naturalHeight;
            if (!this.settings.toWidth && !this.settings.toHeight)
              return this.settings.toWidth = this.image.naturalWidth, void (this.settings.toHeight = this.image.naturalHeight);
            this.settings.toWidth ? this.settings.toHeight || (this.settings.toHeight = this.settings.toWidth / t2) : this.settings.toWidth = this.settings.toHeight * t2;
          }
          grayScale() {
            const t2 = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            let e2;
            for (let s2 = 0, i2 = t2.data.length; s2 < i2; s2 += 4)
              0 !== t2.data[s2 + 3] && (e2 = (t2.data[s2] + t2.data[s2 + 1] + t2.data[s2 + 2]) / 3, t2.data[s2] = e2, t2.data[s2 + 1] = e2, t2.data[s2 + 2] = e2);
            this.context.putImageData(t2, 0, 0);
          }
          sepia() {
            const t2 = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            for (let e2 = 0, s2 = t2.data.length; e2 < s2; e2 += 4)
              0 !== t2.data[e2 + 3] && (t2.data[e2] = 0.393 * t2.data[e2] + 0.769 * t2.data[e2 + 1] + 0.189 * t2.data[e2 + 2], t2.data[e2 + 1] = 0.349 * t2.data[e2] + 0.686 * t2.data[e2 + 1] + 0.168 * t2.data[e2 + 2], t2.data[e2 + 2] = 0.272 * t2.data[e2] + 0.534 * t2.data[e2 + 1] + 0.131 * t2.data[e2 + 2]);
            this.context.putImageData(t2, 0, 0);
          }
          threshold() {
            const t2 = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            let e2, s2;
            for (let i2 = 0, a2 = t2.data.length; i2 < a2; i2 += 4)
              0 !== t2.data[i2 + 3] && (e2 = (t2.data[i2] + t2.data[i2 + 1] + t2.data[i2 + 2]) / 3, s2 = e2 > this.settings.threshold ? 255 : 0, t2.data[i2] = s2, t2.data[i2 + 1] = s2, t2.data[i2 + 2] = s2);
            this.context.putImageData(t2, 0, 0);
          }
          imageFilters() {
            this.settings.grayScale ? this.grayScale() : this.settings.sepia ? this.sepia() : this.settings.threshold && this.threshold();
          }
          imageReverse() {
            this.settings.vReverse && this.vReverse(), this.settings.hReverse && this.hReverse();
          }
          vReverse() {
            const t2 = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height).data, e2 = this.context.createImageData(this.canvas.width, this.canvas.height), s2 = this.canvas.height;
            let i2 = 0, a2 = 0;
            const h = 4 * this.canvas.width;
            for (var n = s2 - 1; n >= 0; n--) {
              i2 = n * h;
              for (var r = 0; r < h; r += 4)
                e2.data[a2] = t2[i2 + r], e2.data[a2 + 1] = t2[i2 + r + 1], e2.data[a2 + 2] = t2[i2 + r + 2], e2.data[a2 + 3] = t2[i2 + r + 3], a2 += 4;
            }
            this.context.putImageData(e2, 0, 0, 0, 0, this.canvas.width, this.canvas.height);
          }
          hReverse() {
            const t2 = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height).data, e2 = this.context.createImageData(this.canvas.width, this.canvas.height), s2 = this.canvas.height;
            let i2 = 0, a2 = 0, h = 0, n = 4 * this.canvas.width;
            for (let r = n - 4; r > 0; r -= 4)
              for (let o = 0; o < s2; o++)
                a2 = o * n, i2 = a2 + r, h = a2 + n - r, e2.data[h] = t2[i2], e2.data[h + 1] = t2[i2 + 1], e2.data[h + 2] = t2[i2 + 2], e2.data[h + 3] = t2[i2 + 3];
            this.context.putImageData(e2, 0, 0, 0, 0, this.canvas.width, this.canvas.height);
          }
        }
        window.ImageCompressor = a;
      }]);
    });
  }
});
export default require_image_compressor();
//# sourceMappingURL=image-compressor.js.map
