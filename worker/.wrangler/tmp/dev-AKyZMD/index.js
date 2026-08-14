var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_modules_watch_stub();
  }
});

// node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// node_modules/@anthropic-ai/sdk/internal/errors.mjs
function isAbortError(err) {
  return typeof err === "object" && err !== null && // Spec-compliant fetch implementations
  ("name" in err && err.name === "AbortError" || // Expo fetch
  "message" in err && String(err.message).includes("FetchRequestCanceledException"));
}
var castToError;
var init_errors = __esm({
  "node_modules/@anthropic-ai/sdk/internal/errors.mjs"() {
    init_modules_watch_stub();
    __name(isAbortError, "isAbortError");
    castToError = /* @__PURE__ */ __name((err) => {
      if (err instanceof Error)
        return err;
      if (typeof err === "object" && err !== null) {
        try {
          if (Object.prototype.toString.call(err) === "[object Error]") {
            const error = new Error(err.message, err.cause ? { cause: err.cause } : {});
            if (err.stack)
              error.stack = err.stack;
            if (err.cause && !error.cause)
              error.cause = err.cause;
            if (err.name)
              error.name = err.name;
            return error;
          }
        } catch {
        }
        try {
          return new Error(JSON.stringify(err));
        } catch {
        }
      }
      return new Error(err);
    }, "castToError");
  }
});

// node_modules/@anthropic-ai/sdk/core/error.mjs
var AnthropicError, APIError, APIUserAbortError, APIConnectionError, APIConnectionTimeoutError, RetryableError, BadRequestError, AuthenticationError, PermissionDeniedError, NotFoundError, ConflictError, UnprocessableEntityError, RateLimitError, InternalServerError;
var init_error = __esm({
  "node_modules/@anthropic-ai/sdk/core/error.mjs"() {
    init_modules_watch_stub();
    init_errors();
    AnthropicError = class extends Error {
      static {
        __name(this, "AnthropicError");
      }
    };
    APIError = class _APIError extends AnthropicError {
      static {
        __name(this, "APIError");
      }
      constructor(status, error, message, headers, type) {
        super(`${_APIError.makeMessage(status, error, message)}`);
        this.status = status;
        this.headers = headers;
        this.requestID = headers?.get("request-id");
        this.error = error;
        this.type = type ?? null;
      }
      static makeMessage(status, error, message) {
        const msg = error?.message ? typeof error.message === "string" ? error.message : JSON.stringify(error.message) : error ? JSON.stringify(error) : message;
        if (status && msg) {
          return `${status} ${msg}`;
        }
        if (status) {
          return `${status} status code (no body)`;
        }
        if (msg) {
          return msg;
        }
        return "(no status code or body)";
      }
      static generate(status, errorResponse, message, headers) {
        if (!status || !headers) {
          return new APIConnectionError({ message, cause: castToError(errorResponse) });
        }
        const error = errorResponse;
        const type = error?.["error"]?.["type"];
        if (status === 400) {
          return new BadRequestError(status, error, message, headers, type);
        }
        if (status === 401) {
          return new AuthenticationError(status, error, message, headers, type);
        }
        if (status === 403) {
          return new PermissionDeniedError(status, error, message, headers, type);
        }
        if (status === 404) {
          return new NotFoundError(status, error, message, headers, type);
        }
        if (status === 409) {
          return new ConflictError(status, error, message, headers, type);
        }
        if (status === 422) {
          return new UnprocessableEntityError(status, error, message, headers, type);
        }
        if (status === 429) {
          return new RateLimitError(status, error, message, headers, type);
        }
        if (status >= 500) {
          return new InternalServerError(status, error, message, headers, type);
        }
        return new _APIError(status, error, message, headers, type);
      }
    };
    APIUserAbortError = class extends APIError {
      static {
        __name(this, "APIUserAbortError");
      }
      constructor({ message } = {}) {
        super(void 0, void 0, message || "Request was aborted.", void 0);
      }
    };
    APIConnectionError = class extends APIError {
      static {
        __name(this, "APIConnectionError");
      }
      constructor({ message, cause }) {
        super(void 0, void 0, message || "Connection error.", void 0);
        if (cause)
          this.cause = cause;
      }
    };
    APIConnectionTimeoutError = class extends APIConnectionError {
      static {
        __name(this, "APIConnectionTimeoutError");
      }
      constructor({ message } = {}) {
        super({ message: message ?? "Request timed out." });
      }
    };
    RetryableError = class extends AnthropicError {
      static {
        __name(this, "RetryableError");
      }
      constructor(message, { cause } = {}) {
        super(message ?? "Retryable error.");
        if (cause !== void 0)
          this.cause = cause;
      }
    };
    BadRequestError = class extends APIError {
      static {
        __name(this, "BadRequestError");
      }
    };
    AuthenticationError = class extends APIError {
      static {
        __name(this, "AuthenticationError");
      }
    };
    PermissionDeniedError = class extends APIError {
      static {
        __name(this, "PermissionDeniedError");
      }
    };
    NotFoundError = class extends APIError {
      static {
        __name(this, "NotFoundError");
      }
    };
    ConflictError = class extends APIError {
      static {
        __name(this, "ConflictError");
      }
    };
    UnprocessableEntityError = class extends APIError {
      static {
        __name(this, "UnprocessableEntityError");
      }
    };
    RateLimitError = class extends APIError {
      static {
        __name(this, "RateLimitError");
      }
    };
    InternalServerError = class extends APIError {
      static {
        __name(this, "InternalServerError");
      }
    };
  }
});

// node_modules/standardwebhooks/dist/timing_safe_equal.js
var require_timing_safe_equal = __commonJS({
  "node_modules/standardwebhooks/dist/timing_safe_equal.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.timingSafeEqual = void 0;
    function assert(expr, msg = "") {
      if (!expr) {
        throw new Error(msg);
      }
    }
    __name(assert, "assert");
    function timingSafeEqual(a, b) {
      if (a.byteLength !== b.byteLength) {
        return false;
      }
      if (!(a instanceof DataView)) {
        a = new DataView(ArrayBuffer.isView(a) ? a.buffer : a);
      }
      if (!(b instanceof DataView)) {
        b = new DataView(ArrayBuffer.isView(b) ? b.buffer : b);
      }
      assert(a instanceof DataView);
      assert(b instanceof DataView);
      const length = a.byteLength;
      let out = 0;
      let i = -1;
      while (++i < length) {
        out |= a.getUint8(i) ^ b.getUint8(i);
      }
      return out === 0;
    }
    __name(timingSafeEqual, "timingSafeEqual");
    exports.timingSafeEqual = timingSafeEqual;
  }
});

// node_modules/@stablelib/base64/lib/base64.js
var require_base64 = __commonJS({
  "node_modules/@stablelib/base64/lib/base64.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    var __extends = exports && exports.__extends || /* @__PURE__ */ (function() {
      var extendStatics = /* @__PURE__ */ __name(function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      }, "extendStatics");
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        __name(__, "__");
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    var INVALID_BYTE = 256;
    var Coder = (
      /** @class */
      (function() {
        function Coder2(_paddingCharacter) {
          if (_paddingCharacter === void 0) {
            _paddingCharacter = "=";
          }
          this._paddingCharacter = _paddingCharacter;
        }
        __name(Coder2, "Coder");
        Coder2.prototype.encodedLength = function(length) {
          if (!this._paddingCharacter) {
            return (length * 8 + 5) / 6 | 0;
          }
          return (length + 2) / 3 * 4 | 0;
        };
        Coder2.prototype.encode = function(data) {
          var out = "";
          var i = 0;
          for (; i < data.length - 2; i += 3) {
            var c = data[i] << 16 | data[i + 1] << 8 | data[i + 2];
            out += this._encodeByte(c >>> 3 * 6 & 63);
            out += this._encodeByte(c >>> 2 * 6 & 63);
            out += this._encodeByte(c >>> 1 * 6 & 63);
            out += this._encodeByte(c >>> 0 * 6 & 63);
          }
          var left = data.length - i;
          if (left > 0) {
            var c = data[i] << 16 | (left === 2 ? data[i + 1] << 8 : 0);
            out += this._encodeByte(c >>> 3 * 6 & 63);
            out += this._encodeByte(c >>> 2 * 6 & 63);
            if (left === 2) {
              out += this._encodeByte(c >>> 1 * 6 & 63);
            } else {
              out += this._paddingCharacter || "";
            }
            out += this._paddingCharacter || "";
          }
          return out;
        };
        Coder2.prototype.maxDecodedLength = function(length) {
          if (!this._paddingCharacter) {
            return (length * 6 + 7) / 8 | 0;
          }
          return length / 4 * 3 | 0;
        };
        Coder2.prototype.decodedLength = function(s) {
          return this.maxDecodedLength(s.length - this._getPaddingLength(s));
        };
        Coder2.prototype.decode = function(s) {
          if (s.length === 0) {
            return new Uint8Array(0);
          }
          var paddingLength = this._getPaddingLength(s);
          var length = s.length - paddingLength;
          var out = new Uint8Array(this.maxDecodedLength(length));
          var op = 0;
          var i = 0;
          var haveBad = 0;
          var v0 = 0, v1 = 0, v2 = 0, v3 = 0;
          for (; i < length - 4; i += 4) {
            v0 = this._decodeChar(s.charCodeAt(i + 0));
            v1 = this._decodeChar(s.charCodeAt(i + 1));
            v2 = this._decodeChar(s.charCodeAt(i + 2));
            v3 = this._decodeChar(s.charCodeAt(i + 3));
            out[op++] = v0 << 2 | v1 >>> 4;
            out[op++] = v1 << 4 | v2 >>> 2;
            out[op++] = v2 << 6 | v3;
            haveBad |= v0 & INVALID_BYTE;
            haveBad |= v1 & INVALID_BYTE;
            haveBad |= v2 & INVALID_BYTE;
            haveBad |= v3 & INVALID_BYTE;
          }
          if (i < length - 1) {
            v0 = this._decodeChar(s.charCodeAt(i));
            v1 = this._decodeChar(s.charCodeAt(i + 1));
            out[op++] = v0 << 2 | v1 >>> 4;
            haveBad |= v0 & INVALID_BYTE;
            haveBad |= v1 & INVALID_BYTE;
          }
          if (i < length - 2) {
            v2 = this._decodeChar(s.charCodeAt(i + 2));
            out[op++] = v1 << 4 | v2 >>> 2;
            haveBad |= v2 & INVALID_BYTE;
          }
          if (i < length - 3) {
            v3 = this._decodeChar(s.charCodeAt(i + 3));
            out[op++] = v2 << 6 | v3;
            haveBad |= v3 & INVALID_BYTE;
          }
          if (haveBad !== 0) {
            throw new Error("Base64Coder: incorrect characters for decoding");
          }
          return out;
        };
        Coder2.prototype._encodeByte = function(b) {
          var result = b;
          result += 65;
          result += 25 - b >>> 8 & 0 - 65 - 26 + 97;
          result += 51 - b >>> 8 & 26 - 97 - 52 + 48;
          result += 61 - b >>> 8 & 52 - 48 - 62 + 43;
          result += 62 - b >>> 8 & 62 - 43 - 63 + 47;
          return String.fromCharCode(result);
        };
        Coder2.prototype._decodeChar = function(c) {
          var result = INVALID_BYTE;
          result += (42 - c & c - 44) >>> 8 & -INVALID_BYTE + c - 43 + 62;
          result += (46 - c & c - 48) >>> 8 & -INVALID_BYTE + c - 47 + 63;
          result += (47 - c & c - 58) >>> 8 & -INVALID_BYTE + c - 48 + 52;
          result += (64 - c & c - 91) >>> 8 & -INVALID_BYTE + c - 65 + 0;
          result += (96 - c & c - 123) >>> 8 & -INVALID_BYTE + c - 97 + 26;
          return result;
        };
        Coder2.prototype._getPaddingLength = function(s) {
          var paddingLength = 0;
          if (this._paddingCharacter) {
            for (var i = s.length - 1; i >= 0; i--) {
              if (s[i] !== this._paddingCharacter) {
                break;
              }
              paddingLength++;
            }
            if (s.length < 4 || paddingLength > 2) {
              throw new Error("Base64Coder: incorrect padding");
            }
          }
          return paddingLength;
        };
        return Coder2;
      })()
    );
    exports.Coder = Coder;
    var stdCoder = new Coder();
    function encode2(data) {
      return stdCoder.encode(data);
    }
    __name(encode2, "encode");
    exports.encode = encode2;
    function decode(s) {
      return stdCoder.decode(s);
    }
    __name(decode, "decode");
    exports.decode = decode;
    var URLSafeCoder = (
      /** @class */
      (function(_super) {
        __extends(URLSafeCoder2, _super);
        function URLSafeCoder2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        __name(URLSafeCoder2, "URLSafeCoder");
        URLSafeCoder2.prototype._encodeByte = function(b) {
          var result = b;
          result += 65;
          result += 25 - b >>> 8 & 0 - 65 - 26 + 97;
          result += 51 - b >>> 8 & 26 - 97 - 52 + 48;
          result += 61 - b >>> 8 & 52 - 48 - 62 + 45;
          result += 62 - b >>> 8 & 62 - 45 - 63 + 95;
          return String.fromCharCode(result);
        };
        URLSafeCoder2.prototype._decodeChar = function(c) {
          var result = INVALID_BYTE;
          result += (44 - c & c - 46) >>> 8 & -INVALID_BYTE + c - 45 + 62;
          result += (94 - c & c - 96) >>> 8 & -INVALID_BYTE + c - 95 + 63;
          result += (47 - c & c - 58) >>> 8 & -INVALID_BYTE + c - 48 + 52;
          result += (64 - c & c - 91) >>> 8 & -INVALID_BYTE + c - 65 + 0;
          result += (96 - c & c - 123) >>> 8 & -INVALID_BYTE + c - 97 + 26;
          return result;
        };
        return URLSafeCoder2;
      })(Coder)
    );
    exports.URLSafeCoder = URLSafeCoder;
    var urlSafeCoder = new URLSafeCoder();
    function encodeURLSafe(data) {
      return urlSafeCoder.encode(data);
    }
    __name(encodeURLSafe, "encodeURLSafe");
    exports.encodeURLSafe = encodeURLSafe;
    function decodeURLSafe(s) {
      return urlSafeCoder.decode(s);
    }
    __name(decodeURLSafe, "decodeURLSafe");
    exports.decodeURLSafe = decodeURLSafe;
    exports.encodedLength = function(length) {
      return stdCoder.encodedLength(length);
    };
    exports.maxDecodedLength = function(length) {
      return stdCoder.maxDecodedLength(length);
    };
    exports.decodedLength = function(s) {
      return stdCoder.decodedLength(s);
    };
  }
});

// node_modules/fast-sha256/sha256.js
var require_sha256 = __commonJS({
  "node_modules/fast-sha256/sha256.js"(exports, module) {
    init_modules_watch_stub();
    (function(root, factory) {
      var exports2 = {};
      factory(exports2);
      var sha256 = exports2["default"];
      for (var k in exports2) {
        sha256[k] = exports2[k];
      }
      if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = sha256;
      } else if (typeof define === "function" && define.amd) {
        define(function() {
          return sha256;
        });
      } else {
        root.sha256 = sha256;
      }
    })(exports, function(exports2) {
      "use strict";
      exports2.__esModule = true;
      exports2.digestLength = 32;
      exports2.blockSize = 64;
      var K = new Uint32Array([
        1116352408,
        1899447441,
        3049323471,
        3921009573,
        961987163,
        1508970993,
        2453635748,
        2870763221,
        3624381080,
        310598401,
        607225278,
        1426881987,
        1925078388,
        2162078206,
        2614888103,
        3248222580,
        3835390401,
        4022224774,
        264347078,
        604807628,
        770255983,
        1249150122,
        1555081692,
        1996064986,
        2554220882,
        2821834349,
        2952996808,
        3210313671,
        3336571891,
        3584528711,
        113926993,
        338241895,
        666307205,
        773529912,
        1294757372,
        1396182291,
        1695183700,
        1986661051,
        2177026350,
        2456956037,
        2730485921,
        2820302411,
        3259730800,
        3345764771,
        3516065817,
        3600352804,
        4094571909,
        275423344,
        430227734,
        506948616,
        659060556,
        883997877,
        958139571,
        1322822218,
        1537002063,
        1747873779,
        1955562222,
        2024104815,
        2227730452,
        2361852424,
        2428436474,
        2756734187,
        3204031479,
        3329325298
      ]);
      function hashBlocks(w, v, p, pos, len) {
        var a, b, c, d, e, f, g, h, u, i, j, t1, t2;
        while (len >= 64) {
          a = v[0];
          b = v[1];
          c = v[2];
          d = v[3];
          e = v[4];
          f = v[5];
          g = v[6];
          h = v[7];
          for (i = 0; i < 16; i++) {
            j = pos + i * 4;
            w[i] = (p[j] & 255) << 24 | (p[j + 1] & 255) << 16 | (p[j + 2] & 255) << 8 | p[j + 3] & 255;
          }
          for (i = 16; i < 64; i++) {
            u = w[i - 2];
            t1 = (u >>> 17 | u << 32 - 17) ^ (u >>> 19 | u << 32 - 19) ^ u >>> 10;
            u = w[i - 15];
            t2 = (u >>> 7 | u << 32 - 7) ^ (u >>> 18 | u << 32 - 18) ^ u >>> 3;
            w[i] = (t1 + w[i - 7] | 0) + (t2 + w[i - 16] | 0);
          }
          for (i = 0; i < 64; i++) {
            t1 = (((e >>> 6 | e << 32 - 6) ^ (e >>> 11 | e << 32 - 11) ^ (e >>> 25 | e << 32 - 25)) + (e & f ^ ~e & g) | 0) + (h + (K[i] + w[i] | 0) | 0) | 0;
            t2 = ((a >>> 2 | a << 32 - 2) ^ (a >>> 13 | a << 32 - 13) ^ (a >>> 22 | a << 32 - 22)) + (a & b ^ a & c ^ b & c) | 0;
            h = g;
            g = f;
            f = e;
            e = d + t1 | 0;
            d = c;
            c = b;
            b = a;
            a = t1 + t2 | 0;
          }
          v[0] += a;
          v[1] += b;
          v[2] += c;
          v[3] += d;
          v[4] += e;
          v[5] += f;
          v[6] += g;
          v[7] += h;
          pos += 64;
          len -= 64;
        }
        return pos;
      }
      __name(hashBlocks, "hashBlocks");
      var Hash = (
        /** @class */
        (function() {
          function Hash2() {
            this.digestLength = exports2.digestLength;
            this.blockSize = exports2.blockSize;
            this.state = new Int32Array(8);
            this.temp = new Int32Array(64);
            this.buffer = new Uint8Array(128);
            this.bufferLength = 0;
            this.bytesHashed = 0;
            this.finished = false;
            this.reset();
          }
          __name(Hash2, "Hash");
          Hash2.prototype.reset = function() {
            this.state[0] = 1779033703;
            this.state[1] = 3144134277;
            this.state[2] = 1013904242;
            this.state[3] = 2773480762;
            this.state[4] = 1359893119;
            this.state[5] = 2600822924;
            this.state[6] = 528734635;
            this.state[7] = 1541459225;
            this.bufferLength = 0;
            this.bytesHashed = 0;
            this.finished = false;
            return this;
          };
          Hash2.prototype.clean = function() {
            for (var i = 0; i < this.buffer.length; i++) {
              this.buffer[i] = 0;
            }
            for (var i = 0; i < this.temp.length; i++) {
              this.temp[i] = 0;
            }
            this.reset();
          };
          Hash2.prototype.update = function(data, dataLength) {
            if (dataLength === void 0) {
              dataLength = data.length;
            }
            if (this.finished) {
              throw new Error("SHA256: can't update because hash was finished.");
            }
            var dataPos = 0;
            this.bytesHashed += dataLength;
            if (this.bufferLength > 0) {
              while (this.bufferLength < 64 && dataLength > 0) {
                this.buffer[this.bufferLength++] = data[dataPos++];
                dataLength--;
              }
              if (this.bufferLength === 64) {
                hashBlocks(this.temp, this.state, this.buffer, 0, 64);
                this.bufferLength = 0;
              }
            }
            if (dataLength >= 64) {
              dataPos = hashBlocks(this.temp, this.state, data, dataPos, dataLength);
              dataLength %= 64;
            }
            while (dataLength > 0) {
              this.buffer[this.bufferLength++] = data[dataPos++];
              dataLength--;
            }
            return this;
          };
          Hash2.prototype.finish = function(out) {
            if (!this.finished) {
              var bytesHashed = this.bytesHashed;
              var left = this.bufferLength;
              var bitLenHi = bytesHashed / 536870912 | 0;
              var bitLenLo = bytesHashed << 3;
              var padLength = bytesHashed % 64 < 56 ? 64 : 128;
              this.buffer[left] = 128;
              for (var i = left + 1; i < padLength - 8; i++) {
                this.buffer[i] = 0;
              }
              this.buffer[padLength - 8] = bitLenHi >>> 24 & 255;
              this.buffer[padLength - 7] = bitLenHi >>> 16 & 255;
              this.buffer[padLength - 6] = bitLenHi >>> 8 & 255;
              this.buffer[padLength - 5] = bitLenHi >>> 0 & 255;
              this.buffer[padLength - 4] = bitLenLo >>> 24 & 255;
              this.buffer[padLength - 3] = bitLenLo >>> 16 & 255;
              this.buffer[padLength - 2] = bitLenLo >>> 8 & 255;
              this.buffer[padLength - 1] = bitLenLo >>> 0 & 255;
              hashBlocks(this.temp, this.state, this.buffer, 0, padLength);
              this.finished = true;
            }
            for (var i = 0; i < 8; i++) {
              out[i * 4 + 0] = this.state[i] >>> 24 & 255;
              out[i * 4 + 1] = this.state[i] >>> 16 & 255;
              out[i * 4 + 2] = this.state[i] >>> 8 & 255;
              out[i * 4 + 3] = this.state[i] >>> 0 & 255;
            }
            return this;
          };
          Hash2.prototype.digest = function() {
            var out = new Uint8Array(this.digestLength);
            this.finish(out);
            return out;
          };
          Hash2.prototype._saveState = function(out) {
            for (var i = 0; i < this.state.length; i++) {
              out[i] = this.state[i];
            }
          };
          Hash2.prototype._restoreState = function(from, bytesHashed) {
            for (var i = 0; i < this.state.length; i++) {
              this.state[i] = from[i];
            }
            this.bytesHashed = bytesHashed;
            this.finished = false;
            this.bufferLength = 0;
          };
          return Hash2;
        })()
      );
      exports2.Hash = Hash;
      var HMAC = (
        /** @class */
        (function() {
          function HMAC2(key) {
            this.inner = new Hash();
            this.outer = new Hash();
            this.blockSize = this.inner.blockSize;
            this.digestLength = this.inner.digestLength;
            var pad = new Uint8Array(this.blockSize);
            if (key.length > this.blockSize) {
              new Hash().update(key).finish(pad).clean();
            } else {
              for (var i = 0; i < key.length; i++) {
                pad[i] = key[i];
              }
            }
            for (var i = 0; i < pad.length; i++) {
              pad[i] ^= 54;
            }
            this.inner.update(pad);
            for (var i = 0; i < pad.length; i++) {
              pad[i] ^= 54 ^ 92;
            }
            this.outer.update(pad);
            this.istate = new Uint32Array(8);
            this.ostate = new Uint32Array(8);
            this.inner._saveState(this.istate);
            this.outer._saveState(this.ostate);
            for (var i = 0; i < pad.length; i++) {
              pad[i] = 0;
            }
          }
          __name(HMAC2, "HMAC");
          HMAC2.prototype.reset = function() {
            this.inner._restoreState(this.istate, this.inner.blockSize);
            this.outer._restoreState(this.ostate, this.outer.blockSize);
            return this;
          };
          HMAC2.prototype.clean = function() {
            for (var i = 0; i < this.istate.length; i++) {
              this.ostate[i] = this.istate[i] = 0;
            }
            this.inner.clean();
            this.outer.clean();
          };
          HMAC2.prototype.update = function(data) {
            this.inner.update(data);
            return this;
          };
          HMAC2.prototype.finish = function(out) {
            if (this.outer.finished) {
              this.outer.finish(out);
            } else {
              this.inner.finish(out);
              this.outer.update(out, this.digestLength).finish(out);
            }
            return this;
          };
          HMAC2.prototype.digest = function() {
            var out = new Uint8Array(this.digestLength);
            this.finish(out);
            return out;
          };
          return HMAC2;
        })()
      );
      exports2.HMAC = HMAC;
      function hash(data) {
        var h = new Hash().update(data);
        var digest = h.digest();
        h.clean();
        return digest;
      }
      __name(hash, "hash");
      exports2.hash = hash;
      exports2["default"] = hash;
      function hmac(key, data) {
        var h = new HMAC(key).update(data);
        var digest = h.digest();
        h.clean();
        return digest;
      }
      __name(hmac, "hmac");
      exports2.hmac = hmac;
      function fillBuffer(buffer, hmac2, info, counter) {
        var num = counter[0];
        if (num === 0) {
          throw new Error("hkdf: cannot expand more");
        }
        hmac2.reset();
        if (num > 1) {
          hmac2.update(buffer);
        }
        if (info) {
          hmac2.update(info);
        }
        hmac2.update(counter);
        hmac2.finish(buffer);
        counter[0]++;
      }
      __name(fillBuffer, "fillBuffer");
      var hkdfSalt = new Uint8Array(exports2.digestLength);
      function hkdf(key, salt, info, length) {
        if (salt === void 0) {
          salt = hkdfSalt;
        }
        if (length === void 0) {
          length = 32;
        }
        var counter = new Uint8Array([1]);
        var okm = hmac(salt, key);
        var hmac_ = new HMAC(okm);
        var buffer = new Uint8Array(hmac_.digestLength);
        var bufpos = buffer.length;
        var out = new Uint8Array(length);
        for (var i = 0; i < length; i++) {
          if (bufpos === buffer.length) {
            fillBuffer(buffer, hmac_, info, counter);
            bufpos = 0;
          }
          out[i] = buffer[bufpos++];
        }
        hmac_.clean();
        buffer.fill(0);
        counter.fill(0);
        return out;
      }
      __name(hkdf, "hkdf");
      exports2.hkdf = hkdf;
      function pbkdf2(password, salt, iterations, dkLen) {
        var prf = new HMAC(password);
        var len = prf.digestLength;
        var ctr = new Uint8Array(4);
        var t = new Uint8Array(len);
        var u = new Uint8Array(len);
        var dk = new Uint8Array(dkLen);
        for (var i = 0; i * len < dkLen; i++) {
          var c = i + 1;
          ctr[0] = c >>> 24 & 255;
          ctr[1] = c >>> 16 & 255;
          ctr[2] = c >>> 8 & 255;
          ctr[3] = c >>> 0 & 255;
          prf.reset();
          prf.update(salt);
          prf.update(ctr);
          prf.finish(u);
          for (var j = 0; j < len; j++) {
            t[j] = u[j];
          }
          for (var j = 2; j <= iterations; j++) {
            prf.reset();
            prf.update(u).finish(u);
            for (var k = 0; k < len; k++) {
              t[k] ^= u[k];
            }
          }
          for (var j = 0; j < len && i * len + j < dkLen; j++) {
            dk[i * len + j] = t[j];
          }
        }
        for (var i = 0; i < len; i++) {
          t[i] = u[i] = 0;
        }
        for (var i = 0; i < 4; i++) {
          ctr[i] = 0;
        }
        prf.clean();
        return dk;
      }
      __name(pbkdf2, "pbkdf2");
      exports2.pbkdf2 = pbkdf2;
    });
  }
});

// node_modules/standardwebhooks/dist/index.js
var require_dist = __commonJS({
  "node_modules/standardwebhooks/dist/index.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Webhook = exports.WebhookVerificationError = void 0;
    var timing_safe_equal_1 = require_timing_safe_equal();
    var base64 = require_base64();
    var sha256 = require_sha256();
    var WEBHOOK_TOLERANCE_IN_SECONDS = 5 * 60;
    var ExtendableError = class _ExtendableError extends Error {
      static {
        __name(this, "ExtendableError");
      }
      constructor(message) {
        super(message);
        Object.setPrototypeOf(this, _ExtendableError.prototype);
        this.name = "ExtendableError";
        this.stack = new Error(message).stack;
      }
    };
    var WebhookVerificationError = class _WebhookVerificationError extends ExtendableError {
      static {
        __name(this, "WebhookVerificationError");
      }
      constructor(message) {
        super(message);
        Object.setPrototypeOf(this, _WebhookVerificationError.prototype);
        this.name = "WebhookVerificationError";
      }
    };
    exports.WebhookVerificationError = WebhookVerificationError;
    var Webhook2 = class _Webhook {
      static {
        __name(this, "Webhook");
      }
      constructor(secret, options) {
        if (!secret) {
          throw new Error("Secret can't be empty.");
        }
        if ((options === null || options === void 0 ? void 0 : options.format) === "raw") {
          if (secret instanceof Uint8Array) {
            this.key = secret;
          } else {
            this.key = Uint8Array.from(secret, (c) => c.charCodeAt(0));
          }
        } else {
          if (typeof secret !== "string") {
            throw new Error("Expected secret to be of type string");
          }
          if (secret.startsWith(_Webhook.prefix)) {
            secret = secret.substring(_Webhook.prefix.length);
          }
          this.key = base64.decode(secret);
        }
      }
      verify(payload, headers_) {
        const headers = {};
        for (const key of Object.keys(headers_)) {
          headers[key.toLowerCase()] = headers_[key];
        }
        const msgId = headers["webhook-id"];
        const msgSignature = headers["webhook-signature"];
        const msgTimestamp = headers["webhook-timestamp"];
        if (!msgSignature || !msgId || !msgTimestamp) {
          throw new WebhookVerificationError("Missing required headers");
        }
        const timestamp = this.verifyTimestamp(msgTimestamp);
        const computedSignature = this.sign(msgId, timestamp, payload);
        const expectedSignature = computedSignature.split(",")[1];
        const passedSignatures = msgSignature.split(" ");
        const encoder2 = new globalThis.TextEncoder();
        for (const versionedSignature of passedSignatures) {
          const [version, signature] = versionedSignature.split(",");
          if (version !== "v1") {
            continue;
          }
          if ((0, timing_safe_equal_1.timingSafeEqual)(encoder2.encode(signature), encoder2.encode(expectedSignature))) {
            return JSON.parse(payload.toString());
          }
        }
        throw new WebhookVerificationError("No matching signature found");
      }
      sign(msgId, timestamp, payload) {
        if (typeof payload === "string") {
        } else if (payload.constructor.name === "Buffer") {
          payload = payload.toString();
        } else {
          throw new Error("Expected payload to be of type string or Buffer.");
        }
        const encoder2 = new TextEncoder();
        const timestampNumber = Math.floor(timestamp.getTime() / 1e3);
        const toSign = encoder2.encode(`${msgId}.${timestampNumber}.${payload}`);
        const expectedSignature = base64.encode(sha256.hmac(this.key, toSign));
        return `v1,${expectedSignature}`;
      }
      verifyTimestamp(timestampHeader) {
        const now = Math.floor(Date.now() / 1e3);
        const timestamp = parseInt(timestampHeader, 10);
        if (isNaN(timestamp)) {
          throw new WebhookVerificationError("Invalid Signature Headers");
        }
        if (now - timestamp > WEBHOOK_TOLERANCE_IN_SECONDS) {
          throw new WebhookVerificationError("Message timestamp too old");
        }
        if (timestamp > now + WEBHOOK_TOLERANCE_IN_SECONDS) {
          throw new WebhookVerificationError("Message timestamp too new");
        }
        return new Date(timestamp * 1e3);
      }
    };
    exports.Webhook = Webhook2;
    Webhook2.prefix = "whsec_";
  }
});

// node_modules/@anthropic-ai/sdk/tools/agent-toolset/node.browser.mjs
var node_browser_exports = {};
__export(node_browser_exports, {
  BashSession: () => BashSession,
  BashTimeoutError: () => BashTimeoutError,
  betaAgentToolset20260401: () => betaAgentToolset20260401,
  betaBashTool: () => betaBashTool,
  betaEditTool: () => betaEditTool,
  betaGlobTool: () => betaGlobTool,
  betaGrepTool: () => betaGrepTool,
  betaReadTool: () => betaReadTool,
  betaWriteTool: () => betaWriteTool,
  extractSkillArchive: () => extractSkillArchive,
  resolvePath: () => resolvePath,
  resolveSkillVersion: () => resolveSkillVersion,
  setupSkills: () => setupSkills
});
function nodeOnly(name) {
  throw new AnthropicError(`${name} requires Node.js or a Node-compatible runtime`);
}
function setupSkills(_ctx) {
  return nodeOnly("setupSkills");
}
function resolveSkillVersion(_client, _skillId, _version) {
  return nodeOnly("resolveSkillVersion");
}
function extractSkillArchive(_resp, _dest) {
  return nodeOnly("extractSkillArchive");
}
function betaAgentToolset20260401(_ctx) {
  return nodeOnly("betaAgentToolset20260401");
}
function resolvePath(_ctx, _p) {
  return nodeOnly("resolvePath");
}
function betaBashTool(_ctx) {
  return nodeOnly("betaBashTool");
}
function betaReadTool(_ctx) {
  return nodeOnly("betaReadTool");
}
function betaWriteTool(_ctx) {
  return nodeOnly("betaWriteTool");
}
function betaEditTool(_ctx) {
  return nodeOnly("betaEditTool");
}
function betaGlobTool(_ctx) {
  return nodeOnly("betaGlobTool");
}
function betaGrepTool(_ctx) {
  return nodeOnly("betaGrepTool");
}
var BashTimeoutError, BashSession;
var init_node_browser = __esm({
  "node_modules/@anthropic-ai/sdk/tools/agent-toolset/node.browser.mjs"() {
    init_modules_watch_stub();
    init_error();
    __name(nodeOnly, "nodeOnly");
    __name(setupSkills, "setupSkills");
    __name(resolveSkillVersion, "resolveSkillVersion");
    __name(extractSkillArchive, "extractSkillArchive");
    __name(betaAgentToolset20260401, "betaAgentToolset20260401");
    __name(resolvePath, "resolvePath");
    BashTimeoutError = class extends AnthropicError {
      static {
        __name(this, "BashTimeoutError");
      }
      constructor(timeoutMs) {
        super(`bash command timed out after ${timeoutMs}ms`);
        this.name = "BashTimeoutError";
        this.timeoutMs = timeoutMs;
      }
    };
    BashSession = class {
      static {
        __name(this, "BashSession");
      }
      constructor(_dir, _env) {
        nodeOnly("BashSession");
      }
      get closed() {
        return nodeOnly("BashSession");
      }
      exec(_command, _opts = {}) {
        return nodeOnly("BashSession");
      }
      close() {
        nodeOnly("BashSession");
      }
    };
    __name(betaBashTool, "betaBashTool");
    __name(betaReadTool, "betaReadTool");
    __name(betaWriteTool, "betaWriteTool");
    __name(betaEditTool, "betaEditTool");
    __name(betaGlobTool, "betaGlobTool");
    __name(betaGrepTool, "betaGrepTool");
  }
});

// .wrangler/tmp/bundle-NLrDeQ/middleware-loader.entry.ts
init_modules_watch_stub();

// .wrangler/tmp/bundle-NLrDeQ/middleware-insertion-facade.js
init_modules_watch_stub();

// src/index.js
init_modules_watch_stub();

// node_modules/@anthropic-ai/sdk/index.mjs
init_modules_watch_stub();

// node_modules/@anthropic-ai/sdk/client.mjs
init_modules_watch_stub();

// node_modules/@anthropic-ai/sdk/internal/tslib.mjs
init_modules_watch_stub();
function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
__name(__classPrivateFieldSet, "__classPrivateFieldSet");
function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
__name(__classPrivateFieldGet, "__classPrivateFieldGet");

// node_modules/@anthropic-ai/sdk/internal/utils/uuid.mjs
init_modules_watch_stub();
var uuid4 = /* @__PURE__ */ __name(function() {
  const { crypto } = globalThis;
  if (crypto?.randomUUID) {
    uuid4 = crypto.randomUUID.bind(crypto);
    return crypto.randomUUID();
  }
  const u8 = new Uint8Array(1);
  const randomByte = crypto ? () => crypto.getRandomValues(u8)[0] : () => Math.random() * 255 & 255;
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) => (+c ^ randomByte() & 15 >> +c / 4).toString(16));
}, "uuid4");

// node_modules/@anthropic-ai/sdk/internal/utils/values.mjs
init_modules_watch_stub();
init_error();
var startsWithSchemeRegexp = /^[a-z][a-z0-9+.-]*:/i;
var isAbsoluteURL = /* @__PURE__ */ __name((url) => {
  return startsWithSchemeRegexp.test(url);
}, "isAbsoluteURL");
var isArray = /* @__PURE__ */ __name((val) => (isArray = Array.isArray, isArray(val)), "isArray");
var isReadonlyArray = isArray;
function maybeObj(x) {
  if (typeof x !== "object") {
    return {};
  }
  return x ?? {};
}
__name(maybeObj, "maybeObj");
function isEmptyObj(obj) {
  if (!obj)
    return true;
  for (const _k in obj)
    return false;
  return true;
}
__name(isEmptyObj, "isEmptyObj");
function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
__name(hasOwn, "hasOwn");
var validatePositiveInteger = /* @__PURE__ */ __name((name, n) => {
  if (typeof n !== "number" || !Number.isInteger(n)) {
    throw new AnthropicError(`${name} must be an integer`);
  }
  if (n < 0) {
    throw new AnthropicError(`${name} must be a positive integer`);
  }
  return n;
}, "validatePositiveInteger");
var safeJSON = /* @__PURE__ */ __name((text) => {
  try {
    return JSON.parse(text);
  } catch (err) {
    return void 0;
  }
}, "safeJSON");

// node_modules/@anthropic-ai/sdk/internal/utils/sleep.mjs
init_modules_watch_stub();
var sleep = /* @__PURE__ */ __name((ms, signal) => new Promise((resolve) => {
  if (signal?.aborted)
    return resolve();
  const onAbort = /* @__PURE__ */ __name(() => {
    clearTimeout(timer);
    resolve();
  }, "onAbort");
  const timer = setTimeout(() => {
    signal?.removeEventListener("abort", onAbort);
    resolve();
  }, ms);
  signal?.addEventListener("abort", onAbort, { once: true });
}), "sleep");

// node_modules/@anthropic-ai/sdk/client.mjs
init_errors();

// node_modules/@anthropic-ai/sdk/internal/detect-platform.mjs
init_modules_watch_stub();

// node_modules/@anthropic-ai/sdk/version.mjs
init_modules_watch_stub();
var VERSION = "0.116.0";

// node_modules/@anthropic-ai/sdk/internal/detect-platform.mjs
var isRunningInBrowser = /* @__PURE__ */ __name(() => {
  return (
    // @ts-ignore
    typeof window !== "undefined" && // @ts-ignore
    typeof window.document !== "undefined" && // @ts-ignore
    typeof navigator !== "undefined"
  );
}, "isRunningInBrowser");
function getDetectedPlatform() {
  if (typeof Deno !== "undefined" && Deno.build != null) {
    return "deno";
  }
  if (typeof EdgeRuntime !== "undefined") {
    return "edge";
  }
  if (Object.prototype.toString.call(typeof globalThis.process !== "undefined" ? globalThis.process : 0) === "[object process]") {
    return "node";
  }
  return "unknown";
}
__name(getDetectedPlatform, "getDetectedPlatform");
var getPlatformProperties = /* @__PURE__ */ __name(() => {
  const detectedPlatform = getDetectedPlatform();
  if (detectedPlatform === "deno") {
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": VERSION,
      "X-Stainless-OS": normalizePlatform(Deno.build.os),
      "X-Stainless-Arch": normalizeArch(Deno.build.arch),
      "X-Stainless-Runtime": "deno",
      "X-Stainless-Runtime-Version": typeof Deno.version === "string" ? Deno.version : Deno.version?.deno ?? "unknown"
    };
  }
  if (typeof EdgeRuntime !== "undefined") {
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": VERSION,
      "X-Stainless-OS": "Unknown",
      "X-Stainless-Arch": `other:${EdgeRuntime}`,
      "X-Stainless-Runtime": "edge",
      "X-Stainless-Runtime-Version": globalThis.process.version
    };
  }
  if (detectedPlatform === "node") {
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": VERSION,
      "X-Stainless-OS": normalizePlatform(globalThis.process.platform ?? "unknown"),
      "X-Stainless-Arch": normalizeArch(globalThis.process.arch ?? "unknown"),
      "X-Stainless-Runtime": "node",
      "X-Stainless-Runtime-Version": globalThis.process.version ?? "unknown"
    };
  }
  const browserInfo = getBrowserInfo();
  if (browserInfo) {
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": VERSION,
      "X-Stainless-OS": "Unknown",
      "X-Stainless-Arch": "unknown",
      "X-Stainless-Runtime": `browser:${browserInfo.browser}`,
      "X-Stainless-Runtime-Version": browserInfo.version
    };
  }
  return {
    "X-Stainless-Lang": "js",
    "X-Stainless-Package-Version": VERSION,
    "X-Stainless-OS": "Unknown",
    "X-Stainless-Arch": "unknown",
    "X-Stainless-Runtime": "unknown",
    "X-Stainless-Runtime-Version": "unknown"
  };
}, "getPlatformProperties");
function getBrowserInfo() {
  if (typeof navigator === "undefined" || !navigator) {
    return null;
  }
  const browserPatterns = [
    { key: "edge", pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "ie", pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "ie", pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "chrome", pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "firefox", pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "safari", pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/ }
  ];
  for (const { key, pattern } of browserPatterns) {
    const match = pattern.exec("Cloudflare-Workers");
    if (match) {
      const major = match[1] || 0;
      const minor = match[2] || 0;
      const patch = match[3] || 0;
      return { browser: key, version: `${major}.${minor}.${patch}` };
    }
  }
  return null;
}
__name(getBrowserInfo, "getBrowserInfo");
var normalizeArch = /* @__PURE__ */ __name((arch) => {
  if (arch === "x32")
    return "x32";
  if (arch === "x86_64" || arch === "x64")
    return "x64";
  if (arch === "arm")
    return "arm";
  if (arch === "aarch64" || arch === "arm64")
    return "arm64";
  if (arch)
    return `other:${arch}`;
  return "unknown";
}, "normalizeArch");
var normalizePlatform = /* @__PURE__ */ __name((platform) => {
  platform = platform.toLowerCase();
  if (platform.includes("ios"))
    return "iOS";
  if (platform === "android")
    return "Android";
  if (platform === "darwin")
    return "MacOS";
  if (platform === "win32")
    return "Windows";
  if (platform === "freebsd")
    return "FreeBSD";
  if (platform === "openbsd")
    return "OpenBSD";
  if (platform === "linux")
    return "Linux";
  if (platform)
    return `Other:${platform}`;
  return "Unknown";
}, "normalizePlatform");
var _platformHeaders;
var getPlatformHeaders = /* @__PURE__ */ __name(() => {
  return _platformHeaders ?? (_platformHeaders = getPlatformProperties());
}, "getPlatformHeaders");

// node_modules/@anthropic-ai/sdk/internal/request-signal.mjs
init_modules_watch_stub();
var cleanups = /* @__PURE__ */ new WeakMap();
var registry = typeof globalThis.FinalizationRegistry === "function" ? new globalThis.FinalizationRegistry((controller) => releaseRequestSignal(controller)) : null;
function makeCleanup(signal, listener) {
  return () => signal.removeEventListener("abort", listener);
}
__name(makeCleanup, "makeCleanup");
function registerRequestSignalCleanup(controller, signal, listener) {
  cleanups.set(controller, makeCleanup(signal, listener));
}
__name(registerRequestSignalCleanup, "registerRequestSignalCleanup");
function armAbandonmentBackstop(body, controller) {
  if (cleanups.has(controller))
    registry?.register(body, controller, controller);
}
__name(armAbandonmentBackstop, "armAbandonmentBackstop");
function releaseRequestSignal(controller) {
  const cleanup = cleanups.get(controller);
  if (cleanup) {
    cleanups.delete(controller);
    registry?.unregister(controller);
    cleanup();
  }
}
__name(releaseRequestSignal, "releaseRequestSignal");

// node_modules/@anthropic-ai/sdk/internal/shims.mjs
init_modules_watch_stub();
function getDefaultFetch() {
  if (typeof fetch !== "undefined") {
    return fetch;
  }
  throw new Error("`fetch` is not defined as a global; Either pass `fetch` to the client, `new Anthropic({ fetch })` or polyfill the global, `globalThis.fetch = fetch`");
}
__name(getDefaultFetch, "getDefaultFetch");
function makeReadableStream(...args) {
  const ReadableStream2 = globalThis.ReadableStream;
  if (typeof ReadableStream2 === "undefined") {
    throw new Error("`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`");
  }
  return new ReadableStream2(...args);
}
__name(makeReadableStream, "makeReadableStream");
function ReadableStreamFrom(iterable) {
  let iter = Symbol.asyncIterator in iterable ? iterable[Symbol.asyncIterator]() : iterable[Symbol.iterator]();
  return makeReadableStream({
    start() {
    },
    async pull(controller) {
      const { done, value } = await iter.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
    async cancel() {
      await iter.return?.();
    }
  });
}
__name(ReadableStreamFrom, "ReadableStreamFrom");
function ReadableStreamToAsyncIterable(stream) {
  if (stream[Symbol.asyncIterator])
    return stream;
  const reader = stream.getReader();
  return {
    async next() {
      try {
        const result = await reader.read();
        if (result?.done)
          reader.releaseLock();
        return result;
      } catch (e) {
        reader.releaseLock();
        throw e;
      }
    },
    async return() {
      const cancelPromise = reader.cancel();
      reader.releaseLock();
      await cancelPromise;
      return { done: true, value: void 0 };
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
__name(ReadableStreamToAsyncIterable, "ReadableStreamToAsyncIterable");
async function CancelReadableStream(stream) {
  if (stream === null || typeof stream !== "object")
    return;
  if (stream[Symbol.asyncIterator]) {
    await stream[Symbol.asyncIterator]().return?.();
    return;
  }
  const reader = stream.getReader();
  const cancelPromise = reader.cancel();
  reader.releaseLock();
  await cancelPromise;
}
__name(CancelReadableStream, "CancelReadableStream");

// node_modules/@anthropic-ai/sdk/internal/request-options.mjs
init_modules_watch_stub();
var FallbackEncoder = /* @__PURE__ */ __name(({ headers, body }) => {
  return {
    bodyHeaders: {
      "content-type": "application/json"
    },
    body: JSON.stringify(body)
  };
}, "FallbackEncoder");

// node_modules/@anthropic-ai/sdk/internal/utils/query.mjs
init_modules_watch_stub();

// node_modules/@anthropic-ai/sdk/internal/qs/stringify.mjs
init_modules_watch_stub();

// node_modules/@anthropic-ai/sdk/internal/qs/utils.mjs
init_modules_watch_stub();

// node_modules/@anthropic-ai/sdk/internal/qs/formats.mjs
init_modules_watch_stub();
var default_format = "RFC3986";
var default_formatter = /* @__PURE__ */ __name((v) => String(v), "default_formatter");
var formatters = {
  RFC1738: /* @__PURE__ */ __name((v) => String(v).replace(/%20/g, "+"), "RFC1738"),
  RFC3986: default_formatter
};
var RFC1738 = "RFC1738";

// node_modules/@anthropic-ai/sdk/internal/qs/utils.mjs
var has = /* @__PURE__ */ __name((obj, key) => (has = Object.hasOwn ?? Function.prototype.call.bind(Object.prototype.hasOwnProperty), has(obj, key)), "has");
var hex_table = /* @__PURE__ */ (() => {
  const array = [];
  for (let i = 0; i < 256; ++i) {
    array.push("%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase());
  }
  return array;
})();
var limit = 1024;
var encode = /* @__PURE__ */ __name((str, _defaultEncoder, charset, _kind, format) => {
  if (str.length === 0) {
    return str;
  }
  let string = str;
  if (typeof str === "symbol") {
    string = Symbol.prototype.toString.call(str);
  } else if (typeof str !== "string") {
    string = String(str);
  }
  if (charset === "iso-8859-1") {
    return escape(string).replace(/%u[0-9a-f]{4}/gi, function($0) {
      return "%26%23" + parseInt($0.slice(2), 16) + "%3B";
    });
  }
  let out = "";
  for (let j = 0; j < string.length; j += limit) {
    const segment = string.length >= limit ? string.slice(j, j + limit) : string;
    const arr = [];
    for (let i = 0; i < segment.length; ++i) {
      let c = segment.charCodeAt(i);
      if (c === 45 || // -
      c === 46 || // .
      c === 95 || // _
      c === 126 || // ~
      c >= 48 && c <= 57 || // 0-9
      c >= 65 && c <= 90 || // a-z
      c >= 97 && c <= 122 || // A-Z
      format === RFC1738 && (c === 40 || c === 41)) {
        arr[arr.length] = segment.charAt(i);
        continue;
      }
      if (c < 128) {
        arr[arr.length] = hex_table[c];
        continue;
      }
      if (c < 2048) {
        arr[arr.length] = hex_table[192 | c >> 6] + hex_table[128 | c & 63];
        continue;
      }
      if (c < 55296 || c >= 57344) {
        arr[arr.length] = hex_table[224 | c >> 12] + hex_table[128 | c >> 6 & 63] + hex_table[128 | c & 63];
        continue;
      }
      i += 1;
      c = 65536 + ((c & 1023) << 10 | segment.charCodeAt(i) & 1023);
      arr[arr.length] = hex_table[240 | c >> 18] + hex_table[128 | c >> 12 & 63] + hex_table[128 | c >> 6 & 63] + hex_table[128 | c & 63];
    }
    out += arr.join("");
  }
  return out;
}, "encode");
function is_buffer(obj) {
  if (!obj || typeof obj !== "object") {
    return false;
  }
  return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
}
__name(is_buffer, "is_buffer");
function maybe_map(val, fn) {
  if (isArray(val)) {
    const mapped = [];
    for (let i = 0; i < val.length; i += 1) {
      mapped.push(fn(val[i]));
    }
    return mapped;
  }
  return fn(val);
}
__name(maybe_map, "maybe_map");

// node_modules/@anthropic-ai/sdk/internal/qs/stringify.mjs
var array_prefix_generators = {
  brackets(prefix) {
    return String(prefix) + "[]";
  },
  comma: "comma",
  indices(prefix, key) {
    return String(prefix) + "[" + key + "]";
  },
  repeat(prefix) {
    return String(prefix);
  }
};
var push_to_array = /* @__PURE__ */ __name(function(arr, value_or_array) {
  Array.prototype.push.apply(arr, isArray(value_or_array) ? value_or_array : [value_or_array]);
}, "push_to_array");
var toISOString;
var defaults = {
  addQueryPrefix: false,
  allowDots: false,
  allowEmptyArrays: false,
  arrayFormat: "indices",
  charset: "utf-8",
  charsetSentinel: false,
  delimiter: "&",
  encode: true,
  encodeDotInKeys: false,
  encoder: encode,
  encodeValuesOnly: false,
  format: default_format,
  formatter: default_formatter,
  /** @deprecated */
  indices: false,
  serializeDate(date) {
    return (toISOString ?? (toISOString = Function.prototype.call.bind(Date.prototype.toISOString)))(date);
  },
  skipNulls: false,
  strictNullHandling: false
};
function is_non_nullish_primitive(v) {
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" || typeof v === "symbol" || typeof v === "bigint";
}
__name(is_non_nullish_primitive, "is_non_nullish_primitive");
var sentinel = {};
function inner_stringify(object, prefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, encoder2, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, sideChannel) {
  let obj = object;
  let tmp_sc = sideChannel;
  let step = 0;
  let find_flag = false;
  while ((tmp_sc = tmp_sc.get(sentinel)) !== void 0 && !find_flag) {
    const pos = tmp_sc.get(object);
    step += 1;
    if (typeof pos !== "undefined") {
      if (pos === step) {
        throw new RangeError("Cyclic object value");
      } else {
        find_flag = true;
      }
    }
    if (typeof tmp_sc.get(sentinel) === "undefined") {
      step = 0;
    }
  }
  if (typeof filter === "function") {
    obj = filter(prefix, obj);
  } else if (obj instanceof Date) {
    obj = serializeDate?.(obj);
  } else if (generateArrayPrefix === "comma" && isArray(obj)) {
    obj = maybe_map(obj, function(value) {
      if (value instanceof Date) {
        return serializeDate?.(value);
      }
      return value;
    });
  }
  if (obj === null) {
    if (strictNullHandling) {
      return encoder2 && !encodeValuesOnly ? (
        // @ts-expect-error
        encoder2(prefix, defaults.encoder, charset, "key", format)
      ) : prefix;
    }
    obj = "";
  }
  if (is_non_nullish_primitive(obj) || is_buffer(obj)) {
    if (encoder2) {
      const key_value = encodeValuesOnly ? prefix : encoder2(prefix, defaults.encoder, charset, "key", format);
      return [
        formatter?.(key_value) + "=" + // @ts-expect-error
        formatter?.(encoder2(obj, defaults.encoder, charset, "value", format))
      ];
    }
    return [formatter?.(prefix) + "=" + formatter?.(String(obj))];
  }
  const values = [];
  if (typeof obj === "undefined") {
    return values;
  }
  let obj_keys;
  if (generateArrayPrefix === "comma" && isArray(obj)) {
    if (encodeValuesOnly && encoder2) {
      obj = maybe_map(obj, encoder2);
    }
    obj_keys = [{ value: obj.length > 0 ? obj.join(",") || null : void 0 }];
  } else if (isArray(filter)) {
    obj_keys = filter;
  } else {
    const keys = Object.keys(obj);
    obj_keys = sort ? keys.sort(sort) : keys;
  }
  const encoded_prefix = encodeDotInKeys ? String(prefix).replace(/\./g, "%2E") : String(prefix);
  const adjusted_prefix = commaRoundTrip && isArray(obj) && obj.length === 1 ? encoded_prefix + "[]" : encoded_prefix;
  if (allowEmptyArrays && isArray(obj) && obj.length === 0) {
    return adjusted_prefix + "[]";
  }
  for (let j = 0; j < obj_keys.length; ++j) {
    const key = obj_keys[j];
    const value = (
      // @ts-ignore
      typeof key === "object" && typeof key.value !== "undefined" ? key.value : obj[key]
    );
    if (skipNulls && value === null) {
      continue;
    }
    const encoded_key = allowDots && encodeDotInKeys ? key.replace(/\./g, "%2E") : key;
    const key_prefix = isArray(obj) ? typeof generateArrayPrefix === "function" ? generateArrayPrefix(adjusted_prefix, encoded_key) : adjusted_prefix : adjusted_prefix + (allowDots ? "." + encoded_key : "[" + encoded_key + "]");
    sideChannel.set(object, step);
    const valueSideChannel = /* @__PURE__ */ new WeakMap();
    valueSideChannel.set(sentinel, sideChannel);
    push_to_array(values, inner_stringify(
      value,
      key_prefix,
      generateArrayPrefix,
      commaRoundTrip,
      allowEmptyArrays,
      strictNullHandling,
      skipNulls,
      encodeDotInKeys,
      // @ts-ignore
      generateArrayPrefix === "comma" && encodeValuesOnly && isArray(obj) ? null : encoder2,
      filter,
      sort,
      allowDots,
      serializeDate,
      format,
      formatter,
      encodeValuesOnly,
      charset,
      valueSideChannel
    ));
  }
  return values;
}
__name(inner_stringify, "inner_stringify");
function normalize_stringify_options(opts = defaults) {
  if (typeof opts.allowEmptyArrays !== "undefined" && typeof opts.allowEmptyArrays !== "boolean") {
    throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
  }
  if (typeof opts.encodeDotInKeys !== "undefined" && typeof opts.encodeDotInKeys !== "boolean") {
    throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
  }
  if (opts.encoder !== null && typeof opts.encoder !== "undefined" && typeof opts.encoder !== "function") {
    throw new TypeError("Encoder has to be a function.");
  }
  const charset = opts.charset || defaults.charset;
  if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  }
  let format = default_format;
  if (typeof opts.format !== "undefined") {
    if (!has(formatters, opts.format)) {
      throw new TypeError("Unknown format option provided.");
    }
    format = opts.format;
  }
  const formatter = formatters[format];
  let filter = defaults.filter;
  if (typeof opts.filter === "function" || isArray(opts.filter)) {
    filter = opts.filter;
  }
  let arrayFormat;
  if (opts.arrayFormat && opts.arrayFormat in array_prefix_generators) {
    arrayFormat = opts.arrayFormat;
  } else if ("indices" in opts) {
    arrayFormat = opts.indices ? "indices" : "repeat";
  } else {
    arrayFormat = defaults.arrayFormat;
  }
  if ("commaRoundTrip" in opts && typeof opts.commaRoundTrip !== "boolean") {
    throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
  }
  const allowDots = typeof opts.allowDots === "undefined" ? !!opts.encodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;
  return {
    addQueryPrefix: typeof opts.addQueryPrefix === "boolean" ? opts.addQueryPrefix : defaults.addQueryPrefix,
    // @ts-ignore
    allowDots,
    allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
    arrayFormat,
    charset,
    charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
    commaRoundTrip: !!opts.commaRoundTrip,
    delimiter: typeof opts.delimiter === "undefined" ? defaults.delimiter : opts.delimiter,
    encode: typeof opts.encode === "boolean" ? opts.encode : defaults.encode,
    encodeDotInKeys: typeof opts.encodeDotInKeys === "boolean" ? opts.encodeDotInKeys : defaults.encodeDotInKeys,
    encoder: typeof opts.encoder === "function" ? opts.encoder : defaults.encoder,
    encodeValuesOnly: typeof opts.encodeValuesOnly === "boolean" ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
    filter,
    format,
    formatter,
    serializeDate: typeof opts.serializeDate === "function" ? opts.serializeDate : defaults.serializeDate,
    skipNulls: typeof opts.skipNulls === "boolean" ? opts.skipNulls : defaults.skipNulls,
    // @ts-ignore
    sort: typeof opts.sort === "function" ? opts.sort : null,
    strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling
  };
}
__name(normalize_stringify_options, "normalize_stringify_options");
function stringify(object, opts = {}) {
  let obj = object;
  const options = normalize_stringify_options(opts);
  let obj_keys;
  let filter;
  if (typeof options.filter === "function") {
    filter = options.filter;
    obj = filter("", obj);
  } else if (isArray(options.filter)) {
    filter = options.filter;
    obj_keys = filter;
  }
  const keys = [];
  if (typeof obj !== "object" || obj === null) {
    return "";
  }
  const generateArrayPrefix = array_prefix_generators[options.arrayFormat];
  const commaRoundTrip = generateArrayPrefix === "comma" && options.commaRoundTrip;
  if (!obj_keys) {
    obj_keys = Object.keys(obj);
  }
  if (options.sort) {
    obj_keys.sort(options.sort);
  }
  const sideChannel = /* @__PURE__ */ new WeakMap();
  for (let i = 0; i < obj_keys.length; ++i) {
    const key = obj_keys[i];
    if (options.skipNulls && obj[key] === null) {
      continue;
    }
    push_to_array(keys, inner_stringify(
      obj[key],
      key,
      // @ts-expect-error
      generateArrayPrefix,
      commaRoundTrip,
      options.allowEmptyArrays,
      options.strictNullHandling,
      options.skipNulls,
      options.encodeDotInKeys,
      options.encode ? options.encoder : null,
      options.filter,
      options.sort,
      options.allowDots,
      options.serializeDate,
      options.format,
      options.formatter,
      options.encodeValuesOnly,
      options.charset,
      sideChannel
    ));
  }
  const joined = keys.join(options.delimiter);
  let prefix = options.addQueryPrefix === true ? "?" : "";
  if (options.charsetSentinel) {
    if (options.charset === "iso-8859-1") {
      prefix += "utf8=%26%2310003%3B&";
    } else {
      prefix += "utf8=%E2%9C%93&";
    }
  }
  return joined.length > 0 ? prefix + joined : "";
}
__name(stringify, "stringify");

// node_modules/@anthropic-ai/sdk/internal/utils/query.mjs
function stringifyQuery(query) {
  return stringify(query, { arrayFormat: "brackets" });
}
__name(stringifyQuery, "stringifyQuery");

// node_modules/@anthropic-ai/sdk/client.mjs
init_error();

// node_modules/@anthropic-ai/sdk/lib/credentials/types.mjs
init_modules_watch_stub();
init_error();
var GRANT_TYPE_JWT_BEARER = "urn:ietf:params:oauth:grant-type:jwt-bearer";
var GRANT_TYPE_REFRESH_TOKEN = "refresh_token";
var TOKEN_ENDPOINT = "/v1/oauth/token";
var OAUTH_API_BETA_HEADER = "oauth-2025-04-20";
var FEDERATION_BETA_HEADER = "oidc-federation-2026-04-01";
var ADVISORY_REFRESH_THRESHOLD_IN_SECONDS = 120;
var MANDATORY_REFRESH_THRESHOLD_IN_SECONDS = 30;
var ADVISORY_REFRESH_BACKOFF_IN_SECONDS = 5;
var MAX_TOKEN_RESPONSE_BYTES = 1 << 20;
function requireSecureTokenEndpoint(baseURL) {
  if (!baseURL)
    return;
  let u;
  try {
    u = new URL(baseURL);
  } catch (err) {
    throw new WorkloadIdentityError(`Invalid token endpoint base URL "${baseURL}": ${err}`);
  }
  if (u.protocol === "https:")
    return;
  const host = u.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (u.protocol === "http:" && (host === "localhost" || host === "127.0.0.1" || host === "::1")) {
    return;
  }
  throw new WorkloadIdentityError(`Refusing to send credential over non-https token endpoint "${baseURL}"`);
}
__name(requireSecureTokenEndpoint, "requireSecureTokenEndpoint");
async function parseTokenResponse(resp, requestId) {
  const text = await readLimitedText(resp);
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new WorkloadIdentityError(`Token endpoint returned non-JSON response (status ${resp.status})`, resp.status, redactSensitive(text), requestId);
  }
  if (!data.access_token) {
    throw new WorkloadIdentityError(`Token endpoint response missing access_token: ${JSON.stringify(redactSensitive(data))}`, resp.status, redactSensitive(data), requestId);
  }
  if (data.token_type && data.token_type.toLowerCase() !== "bearer") {
    throw new WorkloadIdentityError(`Token endpoint response: unsupported token_type "${data.token_type}" (want Bearer)`, resp.status, redactSensitive(data), requestId);
  }
  return data;
}
__name(parseTokenResponse, "parseTokenResponse");
var MAX_ERROR_BODY_CHARS = 2e3;
var SAFE_ERROR_KEYS = /* @__PURE__ */ new Set(["error", "error_description", "error_uri"]);
function redactSensitive(body) {
  if (body == null)
    return body;
  if (typeof body === "string") {
    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch {
      if (body.length <= MAX_ERROR_BODY_CHARS)
        return body;
      return body.slice(0, MAX_ERROR_BODY_CHARS) + `... <${body.length - MAX_ERROR_BODY_CHARS} more chars>`;
    }
    return JSON.stringify(redactSensitive(parsed));
  }
  if (typeof body === "object" && !Array.isArray(body)) {
    const out = {};
    for (const [k, v] of Object.entries(body)) {
      if (SAFE_ERROR_KEYS.has(k))
        out[k] = v;
    }
    return out;
  }
  return null;
}
__name(redactSensitive, "redactSensitive");
async function checkCredentialsFileSafety(path2, onWarn = (m) => console.warn(`anthropic-sdk: ${m}`)) {
  if (typeof process === "undefined" || process.platform === "win32")
    return;
  const fs = await import("node:fs");
  let resolved = path2;
  let st;
  try {
    resolved = await fs.promises.realpath(path2);
    st = await fs.promises.stat(resolved);
  } catch {
    return;
  }
  const mode = st.mode & 511;
  if (mode & 18) {
    throw new WorkloadIdentityError(`Credentials file at ${resolved} is group/world-writable (mode 0o${mode.toString(8)}); this allows other local users to plant tokens. Run \`chmod 600 ${resolved}\`.`);
  }
  if (mode & 36) {
    throw new WorkloadIdentityError(`Credentials file at ${resolved} is group/world-readable (mode 0o${mode.toString(8)}); run \`chmod 600 ${resolved}\` before retrying.`);
  }
  if (typeof process.getuid === "function" && st.uid !== process.getuid()) {
    onWarn(`credentials file at ${resolved} is owned by uid ${st.uid} (current process uid ${process.getuid()}); verify this is intentional.`);
  }
}
__name(checkCredentialsFileSafety, "checkCredentialsFileSafety");
async function writeCredentialsFileAtomic(targetPath, data) {
  const fs = await import("node:fs");
  const path2 = await import("node:path");
  const dir = path2.dirname(targetPath);
  await fs.promises.mkdir(dir, { recursive: true, mode: 448 });
  const tmpPath = `${targetPath}.${process.pid}.${Math.random().toString(36).slice(2)}.tmp`;
  try {
    const fh = await fs.promises.open(tmpPath, "w", 384);
    try {
      await fh.writeFile(JSON.stringify(data, null, 2));
      await fh.sync();
    } finally {
      await fh.close();
    }
    await fs.promises.rename(tmpPath, targetPath);
  } catch (err) {
    await fs.promises.unlink(tmpPath).catch(() => {
    });
    throw err;
  }
  try {
    const dirFh = await fs.promises.open(dir, "r");
    try {
      await dirFh.sync();
    } finally {
      await dirFh.close();
    }
  } catch {
  }
}
__name(writeCredentialsFileAtomic, "writeCredentialsFileAtomic");
async function readLimitedText(resp) {
  if (!resp.body) {
    return "";
  }
  const reader = resp.body.getReader();
  const chunks = [];
  let received = 0;
  for (; ; ) {
    const { done, value } = await reader.read();
    if (done)
      break;
    if (received + value.length > MAX_TOKEN_RESPONSE_BYTES) {
      const remaining = MAX_TOKEN_RESPONSE_BYTES - received;
      if (remaining > 0)
        chunks.push(value.subarray(0, remaining));
      await reader.cancel();
      break;
    }
    chunks.push(value);
    received += value.length;
  }
  let merged;
  if (chunks.length === 1) {
    merged = chunks[0];
  } else {
    merged = new Uint8Array(chunks.reduce((n, c) => n + c.length, 0));
    let offset = 0;
    for (const c of chunks) {
      merged.set(c, offset);
      offset += c.length;
    }
  }
  return new TextDecoder("utf-8").decode(merged);
}
__name(readLimitedText, "readLimitedText");
var WorkloadIdentityError = class extends AnthropicError {
  static {
    __name(this, "WorkloadIdentityError");
  }
  constructor(message, statusCode = null, body = null, requestId = null) {
    super(message);
    this.statusCode = statusCode;
    this.body = body;
    this.requestId = requestId;
  }
};

// node_modules/@anthropic-ai/sdk/lib/credentials/token-cache.mjs
init_modules_watch_stub();

// node_modules/@anthropic-ai/sdk/internal/utils/time.mjs
init_modules_watch_stub();
function nowAsSeconds() {
  return Math.floor(Date.now() / 1e3);
}
__name(nowAsSeconds, "nowAsSeconds");

// node_modules/@anthropic-ai/sdk/lib/credentials/token-cache.mjs
var TokenCache = class {
  static {
    __name(this, "TokenCache");
  }
  constructor(provider, onAdvisoryRefreshError) {
    this.cached = null;
    this.pendingRefresh = null;
    this.nextForce = false;
    this.lastAdvisoryError = 0;
    this.provider = provider;
    this.onAdvisoryRefreshError = onAdvisoryRefreshError;
  }
  async getToken() {
    const force = this.nextForce;
    this.nextForce = false;
    const cached = this.cached;
    if (force || cached == null) {
      const token2 = await this.refresh(force);
      return token2.token;
    }
    if (cached.expiresAt == null) {
      return cached.token;
    }
    const remaining = cached.expiresAt - nowAsSeconds();
    if (remaining > ADVISORY_REFRESH_THRESHOLD_IN_SECONDS) {
      return cached.token;
    }
    if (remaining > MANDATORY_REFRESH_THRESHOLD_IN_SECONDS) {
      this.backgroundRefresh();
      return cached.token;
    }
    const token = await this.refresh();
    return token.token;
  }
  /**
   * Clears the cached token and marks the next {@link getToken} as a forced
   * refresh, so the underlying provider bypasses any on-disk freshness check.
   * Called after a 401 — the server has just told us the token is bad even
   * if its `expires_at` still looks fresh.
   */
  invalidate() {
    this.cached = null;
    this.nextForce = true;
  }
  /**
   * Mandatory refresh. Joins any in-flight refresh unless forced — a forced
   * refresh must not coalesce into a non-forced one that may re-serve the
   * same stale disk token.
   */
  refresh(force = false) {
    if (this.pendingRefresh && !force) {
      return this.pendingRefresh;
    }
    return this.doRefresh(force);
  }
  /**
   * Advisory background refresh. Shares the same in-flight promise as
   * mandatory refreshes for deduplication, but swallows errors so the
   * stale cached token keeps being served. Backs off for
   * {@link ADVISORY_REFRESH_BACKOFF_IN_SECONDS} after a failure so an
   * outage during the advisory window doesn't hammer the token endpoint.
   */
  backgroundRefresh() {
    if (this.pendingRefresh) {
      return;
    }
    if (nowAsSeconds() - this.lastAdvisoryError < ADVISORY_REFRESH_BACKOFF_IN_SECONDS) {
      return;
    }
    this.doRefresh().catch((err) => {
      this.lastAdvisoryError = nowAsSeconds();
      this.onAdvisoryRefreshError?.(err);
    });
  }
  /**
   * Core refresh. Sets {@link pendingRefresh} so concurrent callers
   * (both advisory and mandatory) coalesce into a single provider call.
   */
  doRefresh(force = false) {
    this.pendingRefresh = this.provider(force ? { forceRefresh: true } : void 0).then((token) => {
      this.cached = token;
      this.pendingRefresh = null;
      return token;
    }, (err) => {
      this.pendingRefresh = null;
      throw err;
    });
    return this.pendingRefresh;
  }
};

// node_modules/@anthropic-ai/sdk/lib/credentials/credential-chain.mjs
init_modules_watch_stub();

// node_modules/@anthropic-ai/sdk/internal/utils/env.mjs
init_modules_watch_stub();
var readEnv = /* @__PURE__ */ __name((env) => {
  if (typeof globalThis.process !== "undefined") {
    return globalThis.process.env?.[env]?.trim() || void 0;
  }
  if (typeof globalThis.Deno !== "undefined") {
    return globalThis.Deno.env?.get?.(env)?.trim() || void 0;
  }
  return void 0;
}, "readEnv");

// node_modules/@anthropic-ai/sdk/core/credentials.mjs
init_modules_watch_stub();

// node_modules/@anthropic-ai/sdk/internal/utils.mjs
init_modules_watch_stub();

// node_modules/@anthropic-ai/sdk/internal/utils/base64.mjs
init_modules_watch_stub();
init_error();

// node_modules/@anthropic-ai/sdk/internal/utils/bytes.mjs
init_modules_watch_stub();
function concatBytes(buffers) {
  let length = 0;
  for (const buffer of buffers) {
    length += buffer.length;
  }
  const output = new Uint8Array(length);
  let index = 0;
  for (const buffer of buffers) {
    output.set(buffer, index);
    index += buffer.length;
  }
  return output;
}
__name(concatBytes, "concatBytes");
var encodeUTF8_;
function encodeUTF8(str) {
  let encoder2;
  return (encodeUTF8_ ?? (encoder2 = new globalThis.TextEncoder(), encodeUTF8_ = encoder2.encode.bind(encoder2)))(str);
}
__name(encodeUTF8, "encodeUTF8");
var decodeUTF8_;
function decodeUTF8(bytes) {
  let decoder;
  return (decodeUTF8_ ?? (decoder = new globalThis.TextDecoder(), decodeUTF8_ = decoder.decode.bind(decoder)))(bytes);
}
__name(decodeUTF8, "decodeUTF8");

// node_modules/@anthropic-ai/sdk/internal/utils/log.mjs
init_modules_watch_stub();
var defaultLogLevel = "warn";
var levelNumbers = {
  off: 0,
  error: 200,
  warn: 300,
  info: 400,
  debug: 500
};
var parseLogLevel = /* @__PURE__ */ __name((maybeLevel, sourceName, logger) => {
  if (!maybeLevel) {
    return void 0;
  }
  if (hasOwn(levelNumbers, maybeLevel)) {
    return maybeLevel;
  }
  logger.warn(`${sourceName} was set to ${JSON.stringify(maybeLevel)}, expected one of ${JSON.stringify(Object.keys(levelNumbers))}`);
  return void 0;
}, "parseLogLevel");
function noop() {
}
__name(noop, "noop");
function makeLogFn(fnLevel, logger, logLevel) {
  if (!logger || levelNumbers[fnLevel] > levelNumbers[logLevel]) {
    return noop;
  } else {
    return logger[fnLevel].bind(logger);
  }
}
__name(makeLogFn, "makeLogFn");
var noopLogger = {
  error: noop,
  warn: noop,
  info: noop,
  debug: noop
};
var cachedLoggers = /* @__PURE__ */ new WeakMap();
function filterLogger(logger, logLevel) {
  const cachedLogger = cachedLoggers.get(logger);
  if (cachedLogger && cachedLogger[0] === logLevel) {
    return cachedLogger[1];
  }
  const levelLogger = {
    error: makeLogFn("error", logger, logLevel),
    warn: makeLogFn("warn", logger, logLevel),
    info: makeLogFn("info", logger, logLevel),
    debug: makeLogFn("debug", logger, logLevel)
  };
  cachedLoggers.set(logger, [logLevel, levelLogger]);
  return levelLogger;
}
__name(filterLogger, "filterLogger");
function loggerFor(client) {
  const logger = client.logger;
  const logLevel = client.logLevel ?? "off";
  if (!logger) {
    return noopLogger;
  }
  return filterLogger(logger, logLevel);
}
__name(loggerFor, "loggerFor");
var lastEnvLevel;
var cachedDefaultLogger;
function defaultLogger() {
  const envLevel = readEnv("ANTHROPIC_LOG");
  if (!cachedDefaultLogger || envLevel !== lastEnvLevel) {
    lastEnvLevel = envLevel;
    cachedDefaultLogger = filterLogger(console, parseLogLevel(envLevel, "process.env['ANTHROPIC_LOG']", filterLogger(console, defaultLogLevel)) ?? defaultLogLevel);
  }
  return cachedDefaultLogger;
}
__name(defaultLogger, "defaultLogger");
var formatRequestDetails = /* @__PURE__ */ __name((details) => {
  if (details.options) {
    details.options = { ...details.options };
    delete details.options["headers"];
  }
  if (details.headers) {
    details.headers = Object.fromEntries((details.headers instanceof Headers ? [...details.headers] : Object.entries(details.headers)).map(([name, value]) => [
      name,
      name.toLowerCase() === "authorization" || name.toLowerCase() === "api-key" || name.toLowerCase() === "x-api-key" || name.toLowerCase() === "cookie" || name.toLowerCase() === "set-cookie" ? "***" : value
    ]));
  }
  if ("retryOfRequestLogID" in details) {
    if (details.retryOfRequestLogID) {
      details.retryOf = details.retryOfRequestLogID;
    }
    delete details.retryOfRequestLogID;
  }
  return details;
}, "formatRequestDetails");

// node_modules/@anthropic-ai/sdk/core/credentials.mjs
var CREDENTIALS_FILE_VERSION = "1.0";
var PROFILE_NAME_PATTERN = /^[A-Za-z0-9_.-]+$/;
function validateProfileName(name) {
  if (!name) {
    throw new Error("profile name is empty");
  }
  if (name === "." || name === "..") {
    throw new Error(`profile name "${name}" is not allowed`);
  }
  if (name.includes("/") || name.includes("\\")) {
    throw new Error(`profile name "${name}" must not contain path separators`);
  }
  if (!PROFILE_NAME_PATTERN.test(name)) {
    throw new Error(`profile name "${name}" contains disallowed characters (allowed: letters, digits, '_', '.', '-')`);
  }
}
__name(validateProfileName, "validateProfileName");
var loadConfigWithSource = /* @__PURE__ */ __name(async (profile) => {
  var _a2, _b;
  const rootConfigPath = await getRootConfigPath();
  if (rootConfigPath === null) {
    return null;
  }
  const profileName = profile ?? await getActiveProfileName();
  if (profileName === null) {
    return null;
  }
  validateProfileName(profileName);
  const fs = await import("node:fs");
  const path2 = await import("node:path");
  const configPath = path2.join(rootConfigPath, "configs", `${profileName}.json`);
  let configRaw;
  try {
    configRaw = await fs.promises.readFile(configPath, "utf-8");
  } catch (err) {
    if (err?.code !== "ENOENT") {
      throw new Error(`failed to read config file ${configPath}: ${err}`);
    }
    configRaw = null;
  }
  if (configRaw === null) {
    const organizationId = readEnv("ANTHROPIC_ORGANIZATION_ID");
    const identityTokenFile = readEnv("ANTHROPIC_IDENTITY_TOKEN_FILE");
    const federationRuleId = readEnv("ANTHROPIC_FEDERATION_RULE_ID");
    if (federationRuleId && organizationId) {
      return {
        fromFile: false,
        config: {
          organization_id: organizationId,
          // A defaulted-but-empty CI variable (`ANTHROPIC_WORKSPACE_ID=""`) is
          // treated as unset — readEnv coerces empty to undefined, and the body
          // builder's truthy check skips it — so `"workspace_id": ""` never goes
          // on the wire.
          workspace_id: readEnv("ANTHROPIC_WORKSPACE_ID"),
          base_url: readEnv("ANTHROPIC_BASE_URL"),
          authentication: {
            type: "oidc_federation",
            federation_rule_id: federationRuleId,
            service_account_id: readEnv("ANTHROPIC_SERVICE_ACCOUNT_ID"),
            identity_token: identityTokenFile ? { source: "file", path: identityTokenFile } : void 0,
            scope: readEnv("ANTHROPIC_SCOPE")
          }
        }
      };
    }
    return null;
  }
  let config;
  try {
    config = JSON.parse(configRaw);
  } catch (err) {
    throw new Error(`failed to parse config file ${configPath}: ${err}`);
  }
  if (!config.authentication) {
    throw new Error(`config file ${configPath} is missing "authentication"`);
  }
  const authType = config.authentication.type;
  if (authType !== "oidc_federation" && authType !== "user_oauth") {
    throw new Error(`authentication.type "${authType}" is not a known authentication type`);
  }
  config.organization_id ?? (config.organization_id = readEnv("ANTHROPIC_ORGANIZATION_ID"));
  config.workspace_id ?? (config.workspace_id = readEnv("ANTHROPIC_WORKSPACE_ID"));
  config.base_url ?? (config.base_url = readEnv("ANTHROPIC_BASE_URL"));
  (_a2 = config.authentication).scope ?? (_a2.scope = readEnv("ANTHROPIC_SCOPE"));
  if (config.authentication.type === "oidc_federation") {
    if (!config.authentication.identity_token) {
      const identityTokenFile = readEnv("ANTHROPIC_IDENTITY_TOKEN_FILE");
      if (identityTokenFile) {
        config.authentication.identity_token = {
          source: "file",
          path: identityTokenFile
        };
      }
    }
    if (!config.authentication.federation_rule_id) {
      config.authentication.federation_rule_id = readEnv("ANTHROPIC_FEDERATION_RULE_ID") ?? "";
    }
    (_b = config.authentication).service_account_id ?? (_b.service_account_id = readEnv("ANTHROPIC_SERVICE_ACCOUNT_ID"));
  }
  return { config, fromFile: true };
}, "loadConfigWithSource");
var getCredentialsPath = /* @__PURE__ */ __name(async (config, profile) => {
  if (config?.authentication.credentials_path) {
    return config.authentication.credentials_path;
  }
  const rootConfigPath = await getRootConfigPath();
  if (!rootConfigPath) {
    return null;
  }
  const profileName = profile ?? await getActiveProfileName();
  if (!profileName) {
    return null;
  }
  validateProfileName(profileName);
  const path2 = await import("node:path");
  return path2.join(rootConfigPath, "credentials", `${profileName}.json`);
}, "getCredentialsPath");
var getRootConfigPath = /* @__PURE__ */ __name(async () => {
  if (!supportsLocalConfigFiles()) {
    return null;
  }
  const path2 = await import("node:path");
  const configDir = readEnv("ANTHROPIC_CONFIG_DIR");
  if (configDir) {
    return configDir;
  }
  const os = getPlatformHeaders()["X-Stainless-OS"];
  if (os === "Windows") {
    const appData = readEnv("APPDATA");
    if (appData) {
      return path2.join(appData, "Anthropic");
    }
    const userProfile = readEnv("USERPROFILE");
    if (userProfile) {
      return path2.join(userProfile, "AppData", "Roaming", "Anthropic");
    }
    return null;
  }
  const xdgConfigHome = readEnv("XDG_CONFIG_HOME");
  if (xdgConfigHome) {
    return path2.join(xdgConfigHome, "anthropic");
  }
  const home = readEnv("HOME");
  if (home) {
    return path2.join(home, ".config", "anthropic");
  }
  return null;
}, "getRootConfigPath");
var supportsLocalConfigFiles = /* @__PURE__ */ __name(() => {
  const runtime = getPlatformHeaders()["X-Stainless-Runtime"];
  return runtime === "node" || runtime === "deno";
}, "supportsLocalConfigFiles");
var getActiveProfileName = /* @__PURE__ */ __name(async () => {
  const rootConfigPath = await getRootConfigPath();
  if (!rootConfigPath) {
    return null;
  }
  const profileName = readEnv("ANTHROPIC_PROFILE");
  if (profileName) {
    return profileName;
  }
  const fs = await import("node:fs");
  const path2 = await import("node:path");
  const filePath = path2.join(rootConfigPath, "active_config");
  try {
    return (await fs.promises.readFile(filePath, "utf-8")).trim() || "default";
  } catch (err) {
    if (err?.code !== "ENOENT") {
      throw new Error(`failed to read ${filePath}: ${err}`);
    }
    return "default";
  }
}, "getActiveProfileName");

// node_modules/@anthropic-ai/sdk/lib/credentials/identity-token.mjs
init_modules_watch_stub();
init_error();
function identityTokenFromFile(path2) {
  if (!path2) {
    throw new AnthropicError("Identity token file path is empty");
  }
  return async () => {
    const fs = await import("node:fs");
    let content;
    try {
      content = await fs.promises.readFile(path2, "utf-8");
    } catch (err) {
      throw new AnthropicError(`Failed to read identity token file at ${path2}: ${err}`);
    }
    const token = content.trim();
    if (!token) {
      throw new AnthropicError(`Identity token file at ${path2} is empty`);
    }
    return token;
  };
}
__name(identityTokenFromFile, "identityTokenFromFile");
function identityTokenFromValue(token) {
  if (!token) {
    throw new AnthropicError("Identity token value is empty");
  }
  return () => token;
}
__name(identityTokenFromValue, "identityTokenFromValue");

// node_modules/@anthropic-ai/sdk/lib/credentials/oidc-federation.mjs
init_modules_watch_stub();
function oidcFederationProvider(config) {
  return async () => {
    requireSecureTokenEndpoint(config.baseURL);
    const jwt = await config.identityTokenProvider();
    if (jwt.length > 16 * 1024) {
      throw new WorkloadIdentityError(`Identity token is ${Math.ceil(jwt.length / 1024)} KiB, exceeds the 16 KiB assertion limit`);
    }
    const body = {
      grant_type: GRANT_TYPE_JWT_BEARER,
      assertion: jwt,
      federation_rule_id: config.federationRuleId,
      organization_id: config.organizationId
    };
    if (config.serviceAccountId) {
      body["service_account_id"] = config.serviceAccountId;
    }
    if (config.workspaceId) {
      body["workspace_id"] = config.workspaceId;
    }
    const url = `${config.baseURL}${TOKEN_ENDPOINT}`;
    let resp;
    try {
      resp = await config.fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-beta": `${OAUTH_API_BETA_HEADER},${FEDERATION_BETA_HEADER}`,
          "User-Agent": config.userAgent || `anthropic-sdk-typescript/${VERSION} oidcFederationProvider`
        },
        body: JSON.stringify(body)
      });
    } catch (err) {
      throw new WorkloadIdentityError(`Failed to reach token endpoint ${url}: ${err}`);
    }
    const requestId = resp.headers.get("Request-Id");
    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      const redacted = redactSensitive(text);
      let hint = "";
      if (resp.status === 401) {
        const hintMiddle = config.workspaceId ? "" : "If your federation rule is scoped to multiple workspaces, set the ANTHROPIC_WORKSPACE_ID environment variable, the 'workspace_id' config key, or the `workspaceId` option. ";
        hint = ` Ensure your federation rule matches your identity token. ${hintMiddle}View your authentication events in the Workload identity page of Claude Console for more details.`;
      }
      throw new WorkloadIdentityError(`Token exchange failed with status ${resp.status}${requestId ? ` (request-id ${requestId})` : ""}: ${redacted}${hint}`, resp.status, redacted, requestId);
    }
    const data = await parseTokenResponse(resp, requestId);
    const expiresIn = Number(data.expires_in);
    if (!Number.isFinite(expiresIn)) {
      throw new WorkloadIdentityError(`Token endpoint response missing required fields: ${JSON.stringify(redactSensitive(data))}`, resp.status, redactSensitive(data), requestId);
    }
    return {
      token: data.access_token,
      expiresAt: nowAsSeconds() + expiresIn
    };
  };
}
__name(oidcFederationProvider, "oidcFederationProvider");

// node_modules/@anthropic-ai/sdk/lib/credentials/user-oauth.mjs
init_modules_watch_stub();
function userOAuthProvider(config) {
  return async (opts) => {
    const fs = await import("node:fs");
    await checkCredentialsFileSafety(config.credentialsPath, config.onSafetyWarning);
    let raw;
    try {
      raw = await fs.promises.readFile(config.credentialsPath, "utf-8");
    } catch (err) {
      throw new WorkloadIdentityError(`Credentials file not found at ${config.credentialsPath}: ${err}`);
    }
    let creds;
    try {
      creds = JSON.parse(raw);
    } catch (err) {
      throw new WorkloadIdentityError(`Credentials file at ${config.credentialsPath} is not valid JSON: ${err}`);
    }
    const accessToken = creds.access_token;
    if (!accessToken) {
      throw new WorkloadIdentityError(`Credentials file at ${config.credentialsPath} must include 'access_token'`);
    }
    const expiresAt = creds.expires_at;
    if (!opts?.forceRefresh && (expiresAt == null || nowAsSeconds() < expiresAt - MANDATORY_REFRESH_THRESHOLD_IN_SECONDS)) {
      return { token: accessToken, expiresAt: expiresAt ?? null };
    }
    const refreshToken = creds.refresh_token;
    if (!config.clientId || !refreshToken) {
      throw new WorkloadIdentityError(`Access token at ${config.credentialsPath} has expired and no refresh is available (client_id ${config.clientId ? "set" : "empty"}, refresh_token ${refreshToken ? "set" : "empty"})`);
    }
    requireSecureTokenEndpoint(config.baseURL);
    const body = {
      grant_type: GRANT_TYPE_REFRESH_TOKEN,
      refresh_token: refreshToken,
      client_id: config.clientId
    };
    const url = `${config.baseURL}${TOKEN_ENDPOINT}`;
    let resp;
    try {
      resp = await config.fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-beta": OAUTH_API_BETA_HEADER,
          "User-Agent": config.userAgent || `anthropic-sdk-typescript/${VERSION} userOAuthProvider`
        },
        body: JSON.stringify(body)
      });
    } catch (err) {
      throw new WorkloadIdentityError(`User OAuth refresh failed to reach token endpoint: ${err}`);
    }
    const requestId = resp.headers.get("Request-Id");
    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      throw new WorkloadIdentityError(`User OAuth refresh failed (HTTP ${resp.status}): ${redactSensitive(text)}`, resp.status, redactSensitive(text), requestId);
    }
    const data = await parseTokenResponse(resp, requestId);
    const expiresIn = Number(data.expires_in);
    if (!Number.isFinite(expiresIn)) {
      throw new WorkloadIdentityError(`User OAuth refresh response missing or invalid expires_in: ${JSON.stringify(redactSensitive(data))}`, resp.status, redactSensitive(data), requestId);
    }
    const newExpiresAt = nowAsSeconds() + expiresIn;
    const newRefreshToken = data.refresh_token || refreshToken;
    await writeCredentialsFileAtomic(config.credentialsPath, {
      ...creds,
      version: CREDENTIALS_FILE_VERSION,
      type: "oauth_token",
      access_token: data.access_token,
      expires_at: newExpiresAt,
      refresh_token: newRefreshToken
    });
    return { token: data.access_token, expiresAt: newExpiresAt };
  };
}
__name(userOAuthProvider, "userOAuthProvider");

// node_modules/@anthropic-ai/sdk/lib/credentials/credential-chain.mjs
function resolveCredentialsFromConfig(config, options) {
  const credentialsPath = config.authentication.credentials_path ?? null;
  const effectiveBaseURL = (config.base_url || options.baseURL).replace(/\/+$/, "");
  const provider = buildProvider(config, credentialsPath, effectiveBaseURL, options);
  const extraHeaders = {};
  if (config.workspace_id && config.authentication.type === "user_oauth") {
    extraHeaders["anthropic-workspace-id"] = config.workspace_id;
  }
  return { provider, extraHeaders, baseURL: config.base_url || void 0 };
}
__name(resolveCredentialsFromConfig, "resolveCredentialsFromConfig");
async function defaultCredentials(options, profile) {
  const loaded = await loadConfigWithSource(profile);
  if (!loaded) {
    return null;
  }
  const { config, fromFile } = loaded;
  const withPath = config.authentication.credentials_path || !fromFile ? config : {
    ...config,
    authentication: {
      ...config.authentication,
      credentials_path: await getCredentialsPath(config, profile) ?? void 0
    }
  };
  return resolveCredentialsFromConfig(withPath, options);
}
__name(defaultCredentials, "defaultCredentials");
function buildProvider(config, credentialsPath, baseURL, options) {
  switch (config.authentication.type) {
    case "oidc_federation": {
      const auth = config.authentication;
      const identityProvider = resolveIdentityTokenProvider(auth);
      if (!identityProvider) {
        throw new WorkloadIdentityError("oidc_federation config requires an identity token (set authentication.identity_token, ANTHROPIC_IDENTITY_TOKEN_FILE, or ANTHROPIC_IDENTITY_TOKEN)");
      }
      if (!auth.federation_rule_id) {
        throw new WorkloadIdentityError("oidc_federation config requires 'federation_rule_id'. Set it in authentication.federation_rule_id in your profile, or via ANTHROPIC_FEDERATION_RULE_ID (profile takes precedence).");
      }
      if (!config.organization_id) {
        throw new WorkloadIdentityError("oidc_federation config requires organization_id (set ANTHROPIC_ORGANIZATION_ID or config.organization_id)");
      }
      const exchange = oidcFederationProvider({
        identityTokenProvider: identityProvider,
        federationRuleId: auth.federation_rule_id,
        organizationId: config.organization_id,
        serviceAccountId: auth.service_account_id,
        workspaceId: config.workspace_id,
        baseURL,
        fetch: options.fetch,
        userAgent: options.userAgent
      });
      if (credentialsPath) {
        return cachedExchangeProvider(exchange, credentialsPath, options.onCacheWriteError, options.onSafetyWarning);
      }
      return exchange;
    }
    case "user_oauth": {
      if (!credentialsPath) {
        throw new WorkloadIdentityError("user_oauth config requires authentication.credentials_path (or load via a profile so it defaults to <config_dir>/credentials/<profile>.json)");
      }
      return userOAuthProvider({
        credentialsPath,
        clientId: config.authentication.client_id,
        baseURL,
        fetch: options.fetch,
        userAgent: options.userAgent,
        onSafetyWarning: options.onSafetyWarning
      });
    }
    default: {
      const t = config.authentication.type;
      throw new WorkloadIdentityError(`authentication.type "${t}" is not a known authentication type`);
    }
  }
}
__name(buildProvider, "buildProvider");
function resolveIdentityTokenProvider(auth) {
  if (auth.identity_token) {
    const source = auth.identity_token.source;
    if (source !== "file") {
      throw new WorkloadIdentityError(`identity_token.source "${source}" is not supported by this SDK version (only "file")`);
    }
    if (!auth.identity_token.path) {
      throw new WorkloadIdentityError(`identity_token.source "file" requires a non-empty path`);
    }
    return identityTokenFromFile(auth.identity_token.path);
  }
  const tokenFile = readEnv("ANTHROPIC_IDENTITY_TOKEN_FILE");
  if (tokenFile) {
    return identityTokenFromFile(tokenFile);
  }
  const tokenValue = readEnv("ANTHROPIC_IDENTITY_TOKEN");
  if (tokenValue) {
    return identityTokenFromValue(tokenValue);
  }
  return null;
}
__name(resolveIdentityTokenProvider, "resolveIdentityTokenProvider");
function cachedExchangeProvider(exchange, credentialsPath, onCacheWriteError, onSafetyWarning) {
  return async (opts) => {
    const fs = await import("node:fs");
    await checkCredentialsFileSafety(credentialsPath, onSafetyWarning);
    let existing;
    try {
      const raw = await fs.promises.readFile(credentialsPath, "utf-8");
      existing = JSON.parse(raw);
      const token = existing?.["access_token"];
      if (token && !opts?.forceRefresh) {
        const expiresAt = existing?.["expires_at"];
        if (expiresAt == null || nowAsSeconds() < expiresAt - MANDATORY_REFRESH_THRESHOLD_IN_SECONDS) {
          return { token, expiresAt: expiresAt ?? null };
        }
      }
    } catch (err) {
      const code = err?.code;
      if (code !== "ENOENT" && !(err instanceof SyntaxError)) {
        onCacheWriteError?.(err);
      }
    }
    const result = await exchange(opts);
    try {
      await writeCredentialsFileAtomic(credentialsPath, {
        ...existing ?? {},
        version: CREDENTIALS_FILE_VERSION,
        type: "oauth_token",
        access_token: result.token,
        expires_at: result.expiresAt
      });
    } catch (err) {
      onCacheWriteError?.(err);
    }
    return result;
  };
}
__name(cachedExchangeProvider, "cachedExchangeProvider");

// node_modules/@anthropic-ai/sdk/core/middleware.mjs
init_modules_watch_stub();
init_errors();

// node_modules/@anthropic-ai/sdk/internal/parse.mjs
init_modules_watch_stub();

// node_modules/@anthropic-ai/sdk/core/streaming.mjs
init_modules_watch_stub();
init_error();

// node_modules/@anthropic-ai/sdk/internal/decoders/line.mjs
init_modules_watch_stub();
var _LineDecoder_buffer;
var _LineDecoder_carriageReturnIndex;
var LineDecoder = class {
  static {
    __name(this, "LineDecoder");
  }
  constructor() {
    _LineDecoder_buffer.set(this, void 0);
    _LineDecoder_carriageReturnIndex.set(this, void 0);
    __classPrivateFieldSet(this, _LineDecoder_buffer, new Uint8Array(), "f");
    __classPrivateFieldSet(this, _LineDecoder_carriageReturnIndex, null, "f");
  }
  decode(chunk) {
    if (chunk == null) {
      return [];
    }
    const binaryChunk = chunk instanceof ArrayBuffer ? new Uint8Array(chunk) : typeof chunk === "string" ? encodeUTF8(chunk) : chunk;
    __classPrivateFieldSet(this, _LineDecoder_buffer, concatBytes([__classPrivateFieldGet(this, _LineDecoder_buffer, "f"), binaryChunk]), "f");
    const lines = [];
    let patternIndex;
    while ((patternIndex = findNewlineIndex(__classPrivateFieldGet(this, _LineDecoder_buffer, "f"), __classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f"))) != null) {
      if (patternIndex.carriage && __classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f") == null) {
        __classPrivateFieldSet(this, _LineDecoder_carriageReturnIndex, patternIndex.index, "f");
        continue;
      }
      if (__classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f") != null && (patternIndex.index !== __classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f") + 1 || patternIndex.carriage)) {
        lines.push(decodeUTF8(__classPrivateFieldGet(this, _LineDecoder_buffer, "f").subarray(0, __classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f") - 1)));
        __classPrivateFieldSet(this, _LineDecoder_buffer, __classPrivateFieldGet(this, _LineDecoder_buffer, "f").subarray(__classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f")), "f");
        __classPrivateFieldSet(this, _LineDecoder_carriageReturnIndex, null, "f");
        continue;
      }
      const endIndex = __classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f") !== null ? patternIndex.preceding - 1 : patternIndex.preceding;
      const line = decodeUTF8(__classPrivateFieldGet(this, _LineDecoder_buffer, "f").subarray(0, endIndex));
      lines.push(line);
      __classPrivateFieldSet(this, _LineDecoder_buffer, __classPrivateFieldGet(this, _LineDecoder_buffer, "f").subarray(patternIndex.index), "f");
      __classPrivateFieldSet(this, _LineDecoder_carriageReturnIndex, null, "f");
    }
    return lines;
  }
  flush() {
    if (!__classPrivateFieldGet(this, _LineDecoder_buffer, "f").length) {
      return [];
    }
    return this.decode("\n");
  }
};
_LineDecoder_buffer = /* @__PURE__ */ new WeakMap(), _LineDecoder_carriageReturnIndex = /* @__PURE__ */ new WeakMap();
LineDecoder.NEWLINE_CHARS = /* @__PURE__ */ new Set(["\n", "\r"]);
LineDecoder.NEWLINE_REGEXP = /\r\n|[\n\r]/g;
function findNewlineIndex(buffer, startIndex) {
  const newline = 10;
  const carriage = 13;
  for (let i = startIndex ?? 0; i < buffer.length; i++) {
    if (buffer[i] === newline) {
      return { preceding: i, index: i + 1, carriage: false };
    }
    if (buffer[i] === carriage) {
      return { preceding: i, index: i + 1, carriage: true };
    }
  }
  return null;
}
__name(findNewlineIndex, "findNewlineIndex");
function findDoubleNewlineIndex(buffer) {
  const newline = 10;
  const carriage = 13;
  for (let i = 0; i < buffer.length - 1; i++) {
    if (buffer[i] === newline && buffer[i + 1] === newline) {
      return i + 2;
    }
    if (buffer[i] === carriage && buffer[i + 1] === carriage) {
      return i + 2;
    }
    if (buffer[i] === carriage && buffer[i + 1] === newline && i + 3 < buffer.length && buffer[i + 2] === carriage && buffer[i + 3] === newline) {
      return i + 4;
    }
  }
  return -1;
}
__name(findDoubleNewlineIndex, "findDoubleNewlineIndex");

// node_modules/@anthropic-ai/sdk/core/streaming.mjs
init_errors();
init_error();
var _Stream_client;
var Stream = class _Stream {
  static {
    __name(this, "Stream");
  }
  constructor(iterator, controller, client) {
    this.iterator = iterator;
    _Stream_client.set(this, void 0);
    this.controller = controller;
    __classPrivateFieldSet(this, _Stream_client, client, "f");
  }
  /**
   * Iterate the raw Server-Sent Events from `response` — `{event, data, raw}`
   * objects, before any JSON parsing or event-name filtering.
   *
   * This reads `response.body` directly (not a clone), so the response is
   * consumed. Use this in middleware that fully replaces the stream body; for
   * read-only observation of parsed events, use `ctx.parse()` instead.
   */
  static rawEvents(response, controller = new AbortController()) {
    return _iterSSEMessages(response, controller);
  }
  static fromSSEResponse(response, controller, client) {
    let consumed = false;
    const logger = client ? loggerFor(client) : console;
    async function* iterator() {
      if (consumed) {
        throw new AnthropicError("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
      }
      consumed = true;
      let done = false;
      try {
        for await (const sse of _iterSSEMessages(response, controller)) {
          if (sse.event === "completion") {
            try {
              yield JSON.parse(sse.data);
            } catch (e) {
              logger.error(`Could not parse message into JSON:`, sse.data);
              logger.error(`From chunk:`, sse.raw);
              throw e;
            }
          }
          if (sse.event === "message_start" || sse.event === "message_delta" || sse.event === "message_stop" || sse.event === "content_block_start" || sse.event === "content_block_delta" || sse.event === "content_block_stop" || sse.event === "message" || sse.event === "user.message" || sse.event === "user.interrupt" || sse.event === "user.tool_confirmation" || sse.event === "user.custom_tool_result" || sse.event === "user.tool_result" || sse.event === "agent.message" || sse.event === "agent.thinking" || sse.event === "agent.tool_use" || sse.event === "agent.tool_result" || sse.event === "agent.mcp_tool_use" || sse.event === "agent.mcp_tool_result" || sse.event === "agent.custom_tool_use" || sse.event === "agent.thread_context_compacted" || sse.event === "session.status_running" || sse.event === "session.status_idle" || sse.event === "session.status_rescheduled" || sse.event === "session.status_terminated" || sse.event === "session.error" || sse.event === "session.deleted" || sse.event === "session.updated" || sse.event === "span.model_request_start" || sse.event === "span.model_request_end" || sse.event === "span.outcome_evaluation_start" || sse.event === "span.outcome_evaluation_ongoing" || sse.event === "span.outcome_evaluation_end" || sse.event === "user.define_outcome" || sse.event === "agent.thread_message_received" || sse.event === "agent.thread_message_sent" || sse.event === "agent.session_thread_message_received" || sse.event === "agent.session_thread_message_sent" || sse.event === "session.thread_created" || sse.event === "session.thread_status_created" || sse.event === "session.thread_status_running" || sse.event === "session.thread_status_idle" || sse.event === "session.thread_status_rescheduled" || sse.event === "session.thread_status_terminated" || sse.event === "event_start" || sse.event === "event_delta" || sse.event === "system.message") {
            try {
              yield JSON.parse(sse.data);
            } catch (e) {
              logger.error(`Could not parse message into JSON:`, sse.data);
              logger.error(`From chunk:`, sse.raw);
              throw e;
            }
          }
          if (sse.event === "ping") {
            continue;
          }
          if (sse.event === "error") {
            const body = safeJSON(sse.data) ?? sse.data;
            const type = body?.error?.type;
            throw new APIError(void 0, body, void 0, response.headers, type);
          }
        }
        done = true;
      } catch (e) {
        if (isAbortError(e))
          return;
        throw e;
      } finally {
        if (!done)
          controller.abort();
        releaseRequestSignal(controller);
      }
    }
    __name(iterator, "iterator");
    return new _Stream(iterator, controller, client);
  }
  /**
   * Generates a Stream from a newline-separated ReadableStream
   * where each item is a JSON value.
   */
  static fromReadableStream(readableStream, controller, client) {
    let consumed = false;
    async function* iterLines() {
      const lineDecoder = new LineDecoder();
      const iter = ReadableStreamToAsyncIterable(readableStream);
      for await (const chunk of iter) {
        for (const line of lineDecoder.decode(chunk)) {
          yield line;
        }
      }
      for (const line of lineDecoder.flush()) {
        yield line;
      }
    }
    __name(iterLines, "iterLines");
    async function* iterator() {
      if (consumed) {
        throw new AnthropicError("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
      }
      consumed = true;
      let done = false;
      try {
        for await (const line of iterLines()) {
          if (done)
            continue;
          if (line)
            yield JSON.parse(line);
        }
        done = true;
      } catch (e) {
        if (isAbortError(e))
          return;
        throw e;
      } finally {
        if (!done)
          controller.abort();
        releaseRequestSignal(controller);
      }
    }
    __name(iterator, "iterator");
    return new _Stream(iterator, controller, client);
  }
  [(_Stream_client = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
    return this.iterator();
  }
  /**
   * Splits the stream into two streams which can be
   * independently read from at different speeds.
   */
  tee() {
    const left = [];
    const right = [];
    const iterator = this.iterator();
    const teeIterator = /* @__PURE__ */ __name((queue) => {
      return {
        next: /* @__PURE__ */ __name(() => {
          if (queue.length === 0) {
            const result = iterator.next();
            left.push(result);
            right.push(result);
          }
          return queue.shift();
        }, "next")
      };
    }, "teeIterator");
    return [
      new _Stream(() => teeIterator(left), this.controller, __classPrivateFieldGet(this, _Stream_client, "f")),
      new _Stream(() => teeIterator(right), this.controller, __classPrivateFieldGet(this, _Stream_client, "f"))
    ];
  }
  /**
   * Converts this stream to a newline-separated ReadableStream of
   * JSON stringified values in the stream
   * which can be turned back into a Stream with `Stream.fromReadableStream()`.
   */
  toReadableStream() {
    const self = this;
    let iter;
    return makeReadableStream({
      async start() {
        iter = self[Symbol.asyncIterator]();
      },
      async pull(ctrl) {
        try {
          const { value, done } = await iter.next();
          if (done)
            return ctrl.close();
          const bytes = encodeUTF8(JSON.stringify(value) + "\n");
          ctrl.enqueue(bytes);
        } catch (err) {
          ctrl.error(err);
        }
      },
      async cancel() {
        await iter.return?.();
      }
    });
  }
};
async function* _iterSSEMessages(response, controller) {
  if (!response.body) {
    controller.abort();
    if (typeof globalThis.navigator !== "undefined" && globalThis.navigator.product === "ReactNative") {
      throw new AnthropicError(`The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api`);
    }
    throw new AnthropicError(`Attempted to iterate over a response with no body`);
  }
  const sseDecoder = new SSEDecoder();
  const lineDecoder = new LineDecoder();
  const iter = ReadableStreamToAsyncIterable(response.body);
  for await (const sseChunk of iterSSEChunks(iter)) {
    for (const line of lineDecoder.decode(sseChunk)) {
      const sse = sseDecoder.decode(line);
      if (sse)
        yield sse;
    }
  }
  for (const line of lineDecoder.flush()) {
    const sse = sseDecoder.decode(line);
    if (sse)
      yield sse;
  }
}
__name(_iterSSEMessages, "_iterSSEMessages");
async function* iterSSEChunks(iterator) {
  let data = new Uint8Array();
  for await (const chunk of iterator) {
    if (chunk == null) {
      continue;
    }
    const binaryChunk = chunk instanceof ArrayBuffer ? new Uint8Array(chunk) : typeof chunk === "string" ? encodeUTF8(chunk) : chunk;
    let newData = new Uint8Array(data.length + binaryChunk.length);
    newData.set(data);
    newData.set(binaryChunk, data.length);
    data = newData;
    let patternIndex;
    while ((patternIndex = findDoubleNewlineIndex(data)) !== -1) {
      yield data.slice(0, patternIndex);
      data = data.slice(patternIndex);
    }
  }
  if (data.length > 0) {
    yield data;
  }
}
__name(iterSSEChunks, "iterSSEChunks");
var SSEDecoder = class {
  static {
    __name(this, "SSEDecoder");
  }
  constructor() {
    this.event = null;
    this.data = [];
    this.chunks = [];
  }
  decode(line) {
    if (line.endsWith("\r")) {
      line = line.substring(0, line.length - 1);
    }
    if (!line) {
      if (!this.event && !this.data.length)
        return null;
      const sse = {
        event: this.event,
        data: this.data.join("\n"),
        raw: this.chunks
      };
      this.event = null;
      this.data = [];
      this.chunks = [];
      return sse;
    }
    this.chunks.push(line);
    if (line.startsWith(":")) {
      return null;
    }
    let [fieldname, _, value] = partition(line, ":");
    if (value.startsWith(" ")) {
      value = value.substring(1);
    }
    if (fieldname === "event") {
      this.event = value;
    } else if (fieldname === "data") {
      this.data.push(value);
    }
    return null;
  }
};
function partition(str, delimiter) {
  const index = str.indexOf(delimiter);
  if (index !== -1) {
    return [str.substring(0, index), delimiter, str.substring(index + delimiter.length)];
  }
  return [str, "", ""];
}
__name(partition, "partition");

// node_modules/@anthropic-ai/sdk/internal/parse.mjs
async function defaultParseResponse(client, props) {
  const { response, requestLogID, retryOfRequestLogID, startTime } = props;
  const body = await (async () => {
    if (props.options.stream) {
      loggerFor(client).debug("response", response.status, response.url, response.headers, response.body);
      return Stream.fromSSEResponse(response, props.controller);
    }
    if (response.status === 204) {
      return null;
    }
    if (props.options.__binaryResponse) {
      return response;
    }
    const contentType = response.headers.get("content-type");
    const mediaType = contentType?.split(";")[0]?.trim();
    const isJSON = mediaType?.includes("application/json") || mediaType?.endsWith("+json");
    if (isJSON) {
      const contentLength = response.headers.get("content-length");
      if (contentLength === "0") {
        return void 0;
      }
      const json2 = await response.json();
      return addRequestID(json2, response);
    }
    const text = await response.text();
    return text;
  })().finally(() => {
    if (!props.options.stream && !props.options.__binaryResponse) {
      releaseRequestSignal(props.controller);
    }
  });
  loggerFor(client).debug(`[${requestLogID}] response parsed`, formatRequestDetails({
    retryOfRequestLogID,
    url: response.url,
    status: response.status,
    body,
    durationMs: Date.now() - startTime
  }));
  return body;
}
__name(defaultParseResponse, "defaultParseResponse");
function addRequestID(value, response) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return value;
  }
  return Object.defineProperty(value, "_request_id", {
    value: response.headers.get("request-id"),
    enumerable: false
  });
}
__name(addRequestID, "addRequestID");

// node_modules/@anthropic-ai/sdk/core/middleware.mjs
init_error();
var fetchOriginErrors = /* @__PURE__ */ new WeakSet();
function isFetchOriginError(err) {
  return typeof err === "object" && err !== null && fetchOriginErrors.has(err);
}
__name(isFetchOriginError, "isFetchOriginError");
function isRetryableError(err) {
  const seen = /* @__PURE__ */ new Set();
  while (typeof err === "object" && err !== null && !seen.has(err)) {
    seen.add(err);
    if (isFetchOriginError(err) || isAbortError(err) || err instanceof APIConnectionError || err instanceof RetryableError) {
      return true;
    }
    err = err.cause;
  }
  return false;
}
__name(isRetryableError, "isRetryableError");
function wrapFetchWithMiddleware(fetchFn, middleware, options, client) {
  return async (url, init = {}) => {
    if (middleware.length === 0) {
      return fetchFn.call(void 0, url, init);
    }
    const headers = init.headers instanceof Headers ? init.headers : new Headers(init.headers);
    const response = await applyMiddleware(fetchFn, middleware, options, client)({
      ...init,
      headers,
      url: typeof url === "string" ? url : url instanceof URL ? url.href : url.url
    });
    if (response.bodyUsed || response.body?.locked) {
      throw new AnthropicError("middleware consumed the response body; use response.clone() to inspect it, or return new Response(body, response) to consume and replace it");
    }
    return response;
  };
}
__name(wrapFetchWithMiddleware, "wrapFetchWithMiddleware");
function createMiddlewareContext(options, client) {
  const cache = /* @__PURE__ */ new WeakMap();
  return {
    options,
    // Resolved per chain, so changes to the client's `logLevel`/`logger`
    // apply to subsequent requests.
    logger: client ? loggerFor(client) : defaultLogger(),
    parse(response) {
      if (options?.stream && response.ok) {
        return parseMiddlewareResponse(response, options);
      }
      let parsed = cache.get(response);
      if (!parsed) {
        parsed = parseMiddlewareResponse(response, options);
        cache.set(response, parsed);
      }
      return parsed;
    }
  };
}
__name(createMiddlewareContext, "createMiddlewareContext");
async function parseMiddlewareResponse(response, options) {
  if (response.bodyUsed || response.body?.locked) {
    throw new AnthropicError("cannot ctx.parse() a response whose body was already consumed; call ctx.parse() instead of reading the body, or read via response.clone()");
  }
  if (options?.stream && response.ok) {
    return Stream.fromSSEResponse(response.clone(), new AbortController());
  }
  if (response.status === 204) {
    return null;
  }
  if (options?.__binaryResponse) {
    return response;
  }
  const contentType = response.headers.get("content-type");
  const mediaType = contentType?.split(";")[0]?.trim();
  const isJSON = mediaType?.includes("application/json") || mediaType?.endsWith("+json");
  if (isJSON) {
    if (response.headers.get("content-length") === "0") {
      return void 0;
    }
    return addRequestID(await response.clone().json(), response);
  }
  return await response.clone().text();
}
__name(parseMiddlewareResponse, "parseMiddlewareResponse");
function applyMiddleware(fetchFn, middleware, options, client) {
  let next = /* @__PURE__ */ __name(async ({ url, ...init }) => {
    try {
      return await fetchFn.call(void 0, url, init);
    } catch (err) {
      const error = castToError(err);
      fetchOriginErrors.add(error);
      throw error;
    }
  }, "next");
  const ctx = createMiddlewareContext(options, client);
  for (let i = middleware.length - 1; i >= 0; i--) {
    const mw = middleware[i];
    const nextInner = next;
    next = /* @__PURE__ */ __name(async (request) => mw(request, nextInner, ctx), "next");
  }
  return next;
}
__name(applyMiddleware, "applyMiddleware");

// node_modules/@anthropic-ai/sdk/core/pagination.mjs
init_modules_watch_stub();
init_error();

// node_modules/@anthropic-ai/sdk/core/api-promise.mjs
init_modules_watch_stub();
var _APIPromise_client;
var APIPromise = class _APIPromise extends Promise {
  static {
    __name(this, "APIPromise");
  }
  constructor(client, responsePromise, parseResponse = defaultParseResponse) {
    super((resolve) => {
      resolve(null);
    });
    this.responsePromise = responsePromise;
    this.parseResponse = parseResponse;
    _APIPromise_client.set(this, void 0);
    __classPrivateFieldSet(this, _APIPromise_client, client, "f");
  }
  _thenUnwrap(transform) {
    return new _APIPromise(__classPrivateFieldGet(this, _APIPromise_client, "f"), this.responsePromise, async (client, props) => addRequestID(transform(await this.parseResponse(client, props), props), props.response));
  }
  /**
   * Gets the raw `Response` instance instead of parsing the response
   * data.
   *
   * If you want to parse the response body but still get the `Response`
   * instance, you can use {@link withResponse()}.
   *
   * 👋 Getting the wrong TypeScript type for `Response`?
   * Try setting `"moduleResolution": "NodeNext"` or add `"lib": ["DOM"]`
   * to your `tsconfig.json`.
   */
  asResponse() {
    return this.responsePromise.then((p) => p.response);
  }
  /**
   * Gets the parsed response data, the raw `Response` instance and the ID of the request,
   * returned via the `request-id` header which is useful for debugging requests and resporting
   * issues to Anthropic.
   *
   * If you just want to get the raw `Response` instance without parsing it,
   * you can use {@link asResponse()}.
   *
   * 👋 Getting the wrong TypeScript type for `Response`?
   * Try setting `"moduleResolution": "NodeNext"` or add `"lib": ["DOM"]`
   * to your `tsconfig.json`.
   */
  async withResponse() {
    const [data, response] = await Promise.all([this.parse(), this.asResponse()]);
    return { data, response, request_id: response.headers.get("request-id") };
  }
  parse() {
    if (!this.parsedPromise) {
      this.parsedPromise = this.responsePromise.then((data) => this.parseResponse(__classPrivateFieldGet(this, _APIPromise_client, "f"), data));
    }
    return this.parsedPromise;
  }
  then(onfulfilled, onrejected) {
    return this.parse().then(onfulfilled, onrejected);
  }
  catch(onrejected) {
    return this.parse().catch(onrejected);
  }
  finally(onfinally) {
    return this.parse().finally(onfinally);
  }
};
_APIPromise_client = /* @__PURE__ */ new WeakMap();

// node_modules/@anthropic-ai/sdk/core/pagination.mjs
var _AbstractPage_client;
var AbstractPage = class {
  static {
    __name(this, "AbstractPage");
  }
  constructor(client, response, body, options) {
    _AbstractPage_client.set(this, void 0);
    __classPrivateFieldSet(this, _AbstractPage_client, client, "f");
    this.options = options;
    this.response = response;
    this.body = body;
  }
  hasNextPage() {
    const items = this.getPaginatedItems();
    if (!items.length)
      return false;
    return this.nextPageRequestOptions() != null;
  }
  async getNextPage() {
    const nextOptions = this.nextPageRequestOptions();
    if (!nextOptions) {
      throw new AnthropicError("No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.");
    }
    return await __classPrivateFieldGet(this, _AbstractPage_client, "f").requestAPIList(this.constructor, nextOptions);
  }
  async *iterPages() {
    let page = this;
    yield page;
    while (page.hasNextPage()) {
      page = await page.getNextPage();
      yield page;
    }
  }
  async *[(_AbstractPage_client = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
    for await (const page of this.iterPages()) {
      for (const item of page.getPaginatedItems()) {
        yield item;
      }
    }
  }
};
var PagePromise = class extends APIPromise {
  static {
    __name(this, "PagePromise");
  }
  constructor(client, request, Page2) {
    super(client, request, async (client2, props) => new Page2(client2, props.response, await defaultParseResponse(client2, props), props.options));
  }
  /**
   * Allow auto-paginating iteration on an unawaited list call, eg:
   *
   *    for await (const item of client.items.list()) {
   *      console.log(item)
   *    }
   */
  async *[Symbol.asyncIterator]() {
    const page = await this;
    for await (const item of page) {
      yield item;
    }
  }
};
var Page = class extends AbstractPage {
  static {
    __name(this, "Page");
  }
  constructor(client, response, body, options) {
    super(client, response, body, options);
    this.data = body.data || [];
    this.has_more = body.has_more || false;
    this.first_id = body.first_id || null;
    this.last_id = body.last_id || null;
  }
  getPaginatedItems() {
    return this.data ?? [];
  }
  hasNextPage() {
    if (this.has_more === false) {
      return false;
    }
    return super.hasNextPage();
  }
  nextPageRequestOptions() {
    if (this.options.query?.["before_id"]) {
      const first_id = this.first_id;
      if (!first_id) {
        return null;
      }
      return {
        ...this.options,
        query: {
          ...maybeObj(this.options.query),
          before_id: first_id
        }
      };
    }
    const cursor = this.last_id;
    if (!cursor) {
      return null;
    }
    return {
      ...this.options,
      query: {
        ...maybeObj(this.options.query),
        after_id: cursor
      }
    };
  }
};
var PageCursor = class extends AbstractPage {
  static {
    __name(this, "PageCursor");
  }
  constructor(client, response, body, options) {
    super(client, response, body, options);
    this.data = body.data || [];
    this.next_page = body.next_page || null;
  }
  getPaginatedItems() {
    return this.data ?? [];
  }
  nextPageRequestOptions() {
    const cursor = this.next_page;
    if (!cursor) {
      return null;
    }
    return {
      ...this.options,
      query: {
        ...maybeObj(this.options.query),
        page: cursor
      }
    };
  }
};
var BidirectionalPageCursor = class extends AbstractPage {
  static {
    __name(this, "BidirectionalPageCursor");
  }
  constructor(client, response, body, options) {
    super(client, response, body, options);
    this.data = body.data || [];
    this.next_page = body.next_page || null;
    this.prev_page = body.prev_page || null;
  }
  getPaginatedItems() {
    return this.data ?? [];
  }
  nextPageRequestOptions() {
    const cursor = this.next_page;
    if (!cursor) {
      return null;
    }
    return {
      ...this.options,
      query: {
        ...maybeObj(this.options.query),
        page: cursor
      }
    };
  }
};

// node_modules/@anthropic-ai/sdk/core/uploads.mjs
init_modules_watch_stub();

// node_modules/@anthropic-ai/sdk/internal/to-file.mjs
init_modules_watch_stub();

// node_modules/@anthropic-ai/sdk/internal/uploads.mjs
init_modules_watch_stub();
var checkFileSupport = /* @__PURE__ */ __name(() => {
  if (typeof File === "undefined") {
    const { process: process2 } = globalThis;
    const isOldNode = typeof process2?.versions?.node === "string" && parseInt(process2.versions.node.split(".")) < 20;
    throw new Error("`File` is not defined as a global, which is required for file uploads." + (isOldNode ? " Update to Node 20 LTS or newer, or set `globalThis.File` to `import('node:buffer').File`." : ""));
  }
}, "checkFileSupport");
function makeFile(fileBits, fileName, options) {
  checkFileSupport();
  return new File(fileBits, fileName ?? "unknown_file", options);
}
__name(makeFile, "makeFile");
function getName(value, stripPath) {
  const val = typeof value === "object" && value !== null && ("name" in value && value.name && String(value.name) || "url" in value && value.url && String(value.url) || "filename" in value && value.filename && String(value.filename) || "path" in value && value.path && String(value.path)) || "";
  return stripPath ? val.split(/[\\/]/).pop() || void 0 : val;
}
__name(getName, "getName");
var isAsyncIterable = /* @__PURE__ */ __name((value) => value != null && typeof value === "object" && typeof value[Symbol.asyncIterator] === "function", "isAsyncIterable");
var multipartFormRequestOptions = /* @__PURE__ */ __name(async (opts, fetch2, stripFilenames = true) => {
  return { ...opts, body: await createForm(opts.body, fetch2, stripFilenames) };
}, "multipartFormRequestOptions");
var supportsFormDataMap = /* @__PURE__ */ new WeakMap();
function supportsFormData(fetchObject) {
  const fetch2 = typeof fetchObject === "function" ? fetchObject : fetchObject.fetch;
  const cached = supportsFormDataMap.get(fetch2);
  if (cached)
    return cached;
  const promise = (async () => {
    try {
      const FetchResponse = "Response" in fetch2 ? fetch2.Response : (await fetch2("data:,")).constructor;
      const data = new FormData();
      if (data.toString() === await new FetchResponse(data).text()) {
        return false;
      }
      return true;
    } catch {
      return true;
    }
  })();
  supportsFormDataMap.set(fetch2, promise);
  return promise;
}
__name(supportsFormData, "supportsFormData");
var createForm = /* @__PURE__ */ __name(async (body, fetch2, stripFilenames = true) => {
  if (!await supportsFormData(fetch2)) {
    throw new TypeError("The provided fetch function does not support file uploads with the current global FormData class.");
  }
  const form = new FormData();
  await Promise.all(Object.entries(body || {}).map(([key, value]) => addFormValue(form, key, value, stripFilenames)));
  return form;
}, "createForm");
var isNamedBlob = /* @__PURE__ */ __name((value) => value instanceof Blob && "name" in value, "isNamedBlob");
var addFormValue = /* @__PURE__ */ __name(async (form, key, value, stripFilenames) => {
  if (value === void 0)
    return;
  if (value == null) {
    throw new TypeError(`Received null for "${key}"; to pass null in FormData, you must use the string 'null'`);
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    form.append(key, String(value));
  } else if (value instanceof Response) {
    let options = {};
    const contentType = value.headers.get("Content-Type");
    if (contentType) {
      options = { type: contentType };
    }
    form.append(key, makeFile([await value.blob()], getName(value, stripFilenames), options));
  } else if (isAsyncIterable(value)) {
    form.append(key, makeFile([await new Response(ReadableStreamFrom(value)).blob()], getName(value, stripFilenames)));
  } else if (isNamedBlob(value)) {
    form.append(key, makeFile([value], getName(value, stripFilenames), { type: value.type }));
  } else if (Array.isArray(value)) {
    await Promise.all(value.map((entry) => addFormValue(form, key + "[]", entry, stripFilenames)));
  } else if (typeof value === "object") {
    await Promise.all(Object.entries(value).map(([name, prop]) => addFormValue(form, `${key}[${name}]`, prop, stripFilenames)));
  } else {
    throw new TypeError(`Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${value} instead`);
  }
}, "addFormValue");

// node_modules/@anthropic-ai/sdk/internal/to-file.mjs
var isBlobLike = /* @__PURE__ */ __name((value) => value != null && typeof value === "object" && typeof value.size === "number" && typeof value.type === "string" && typeof value.text === "function" && typeof value.slice === "function" && typeof value.arrayBuffer === "function", "isBlobLike");
var isFileLike = /* @__PURE__ */ __name((value) => value != null && typeof value === "object" && typeof value.name === "string" && typeof value.lastModified === "number" && isBlobLike(value), "isFileLike");
var isResponseLike = /* @__PURE__ */ __name((value) => value != null && typeof value === "object" && typeof value.url === "string" && typeof value.blob === "function", "isResponseLike");
async function toFile(value, name, options) {
  checkFileSupport();
  value = await value;
  name || (name = getName(value, true));
  if (isFileLike(value)) {
    if (value instanceof File && name == null && options == null) {
      return value;
    }
    return makeFile([await value.arrayBuffer()], name ?? value.name, {
      type: value.type,
      lastModified: value.lastModified,
      ...options
    });
  }
  if (isResponseLike(value)) {
    const blob = await value.blob();
    name || (name = new URL(value.url).pathname.split(/[\\/]/).pop());
    return makeFile(await getBytes(blob), name, options);
  }
  const parts = await getBytes(value);
  if (!options?.type) {
    const type = parts.find((part) => typeof part === "object" && "type" in part && part.type);
    if (typeof type === "string") {
      options = { ...options, type };
    }
  }
  return makeFile(parts, name, options);
}
__name(toFile, "toFile");
async function getBytes(value) {
  let parts = [];
  if (typeof value === "string" || ArrayBuffer.isView(value) || // includes Uint8Array, Buffer, etc.
  value instanceof ArrayBuffer) {
    parts.push(value);
  } else if (isBlobLike(value)) {
    parts.push(value instanceof Blob ? value : await value.arrayBuffer());
  } else if (isAsyncIterable(value)) {
    for await (const chunk of value) {
      parts.push(...await getBytes(chunk));
    }
  } else {
    const constructor = value?.constructor?.name;
    throw new Error(`Unexpected data type: ${typeof value}${constructor ? `; constructor: ${constructor}` : ""}${propsForError(value)}`);
  }
  return parts;
}
__name(getBytes, "getBytes");
function propsForError(value) {
  if (typeof value !== "object" || value === null)
    return "";
  const props = Object.getOwnPropertyNames(value);
  return `; props: [${props.map((p) => `"${p}"`).join(", ")}]`;
}
__name(propsForError, "propsForError");

// node_modules/@anthropic-ai/sdk/resources/index.mjs
init_modules_watch_stub();

// node_modules/@anthropic-ai/sdk/resources/shared.mjs
init_modules_watch_stub();

// node_modules/@anthropic-ai/sdk/resources/beta/beta.mjs
init_modules_watch_stub();

// node_modules/@anthropic-ai/sdk/core/resource.mjs
init_modules_watch_stub();
var APIResource = class {
  static {
    __name(this, "APIResource");
  }
  constructor(client) {
    this._client = client;
  }
};

// node_modules/@anthropic-ai/sdk/resources/beta/deployment-runs.mjs
init_modules_watch_stub();

// node_modules/@anthropic-ai/sdk/internal/headers.mjs
init_modules_watch_stub();
var brand_privateNullableHeaders = /* @__PURE__ */ Symbol.for("brand.privateNullableHeaders");
function* iterateHeaders(headers) {
  if (!headers)
    return;
  if (brand_privateNullableHeaders in headers) {
    const { values, nulls } = headers;
    yield* values.entries();
    for (const name of nulls) {
      yield [name, null];
    }
    return;
  }
  let shouldClear = false;
  let iter;
  if (headers instanceof Headers) {
    iter = headers.entries();
  } else if (isReadonlyArray(headers)) {
    iter = headers;
  } else {
    shouldClear = true;
    iter = Object.entries(headers ?? {});
  }
  for (let row of iter) {
    const name = row[0];
    if (typeof name !== "string")
      throw new TypeError("expected header name to be a string");
    const values = isReadonlyArray(row[1]) ? row[1] : [row[1]];
    let didClear = false;
    for (const value of values) {
      if (value === void 0)
        continue;
      if (shouldClear && !didClear) {
        didClear = true;
        yield [name, clearSentinel];
      }
      yield [name, value];
    }
  }
}
__name(iterateHeaders, "iterateHeaders");
var clearSentinel = /* @__PURE__ */ Symbol("clear");
var APPEND_HEADERS = /* @__PURE__ */ new Set(["x-stainless-helper"]);
var appendHeaderValue = /* @__PURE__ */ __name((existing, addition) => {
  const tokens2 = existing ? existing.split(",").map((t) => t.trim()).filter(Boolean) : [];
  for (const tok of addition.split(",").map((t) => t.trim())) {
    if (tok && !tokens2.includes(tok))
      tokens2.push(tok);
  }
  return tokens2.join(", ");
}, "appendHeaderValue");
var buildHeaders = /* @__PURE__ */ __name((newHeaders) => {
  const targetHeaders = new Headers();
  const nullHeaders = /* @__PURE__ */ new Set();
  for (const headers of newHeaders) {
    const seenHeaders = /* @__PURE__ */ new Set();
    for (const [name, value] of iterateHeaders(headers)) {
      const lowerName = name.toLowerCase();
      if (APPEND_HEADERS.has(lowerName)) {
        if (value === clearSentinel)
          continue;
        if (value === null) {
          targetHeaders.delete(name);
          nullHeaders.add(lowerName);
        } else {
          targetHeaders.set(name, appendHeaderValue(targetHeaders.get(name), value));
          nullHeaders.delete(lowerName);
        }
        continue;
      }
      if (value === clearSentinel || !seenHeaders.has(lowerName)) {
        targetHeaders.delete(name);
        seenHeaders.add(lowerName);
        if (value === clearSentinel)
          continue;
      }
      if (value === null) {
        targetHeaders.delete(name);
        nullHeaders.add(lowerName);
      } else {
        targetHeaders.append(name, value);
        nullHeaders.delete(lowerName);
      }
    }
  }
  return { [brand_privateNullableHeaders]: true, values: targetHeaders, nulls: nullHeaders };
}, "buildHeaders");

// node_modules/@anthropic-ai/sdk/internal/utils/path.mjs
init_modules_watch_stub();
init_error();
function encodeURIPath(str) {
  return str.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@]+/g, encodeURIComponent);
}
__name(encodeURIPath, "encodeURIPath");
var EMPTY = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.create(null));
var createPathTagFunction = /* @__PURE__ */ __name((pathEncoder = encodeURIPath) => /* @__PURE__ */ __name(function path2(statics, ...params) {
  if (statics.length === 1)
    return statics[0];
  let postPath = false;
  const invalidSegments = [];
  const path3 = statics.reduce((previousValue, currentValue, index) => {
    if (/[?#]/.test(currentValue)) {
      postPath = true;
    }
    const value = params[index];
    let encoded = (postPath ? encodeURIComponent : pathEncoder)("" + value);
    if (index !== params.length && (value == null || typeof value === "object" && // handle values from other realms
    value.toString === Object.getPrototypeOf(Object.getPrototypeOf(value.hasOwnProperty ?? EMPTY) ?? EMPTY)?.toString)) {
      encoded = value + "";
      invalidSegments.push({
        start: previousValue.length + currentValue.length,
        length: encoded.length,
        error: `Value of type ${Object.prototype.toString.call(value).slice(8, -1)} is not a valid path parameter`
      });
    }
    return previousValue + currentValue + (index === params.length ? "" : encoded);
  }, "");
  const pathOnly = path3.split(/[?#]/, 1)[0];
  const invalidSegmentPattern = /(?<=^|\/)(?:\.|%2e){1,2}(?=\/|$)/gi;
  let match;
  while ((match = invalidSegmentPattern.exec(pathOnly)) !== null) {
    invalidSegments.push({
      start: match.index,
      length: match[0].length,
      error: `Value "${match[0]}" can't be safely passed as a path parameter`
    });
  }
  invalidSegments.sort((a, b) => a.start - b.start);
  if (invalidSegments.length > 0) {
    let lastEnd = 0;
    const underline = invalidSegments.reduce((acc, segment) => {
      const spaces = " ".repeat(segment.start - lastEnd);
      const arrows = "^".repeat(segment.length);
      lastEnd = segment.start + segment.length;
      return acc + spaces + arrows;
    }, "");
    throw new AnthropicError(`Path parameters result in path with invalid segments:
${invalidSegments.map((e) => e.error).join("\n")}
${path3}
${underline}`);
  }
  return path3;
}, "path"), "createPathTagFunction");
var path = /* @__PURE__ */ createPathTagFunction(encodeURIPath);

// node_modules/@anthropic-ai/sdk/resources/beta/deployment-runs.mjs
var DeploymentRuns = class extends APIResource {
  static {
    __name(this, "DeploymentRuns");
  }
  /**
   * Get Deployment Run
   *
   * @example
   * ```ts
   * const betaManagedAgentsDeploymentRun =
   *   await client.beta.deploymentRuns.retrieve(
   *     'deployment_run_id',
   *   );
   * ```
   */
  retrieve(deploymentRunID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.get(path`/v1/deployment_runs/${deploymentRunID}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * List Deployment Runs
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const betaManagedAgentsDeploymentRun of client.beta.deploymentRuns.list()) {
   *   // ...
   * }
   * ```
   */
  list(params = {}, options) {
    const { betas, ...query } = params ?? {};
    return this._client.getAPIList("/v1/deployment_runs?beta=true", PageCursor, {
      query,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
};

// node_modules/@anthropic-ai/sdk/resources/beta/deployments.mjs
init_modules_watch_stub();
var Deployments = class extends APIResource {
  static {
    __name(this, "Deployments");
  }
  /**
   * Create Deployment
   *
   * @example
   * ```ts
   * const betaManagedAgentsDeployment =
   *   await client.beta.deployments.create({
   *     agent: 'string',
   *     environment_id: 'x',
   *     initial_events: [
   *       {
   *         content: [
   *           {
   *             text: 'Where is my order #1234?',
   *             type: 'text',
   *           },
   *         ],
   *         type: 'user.message',
   *       },
   *     ],
   *     name: 'x',
   *   });
   * ```
   */
  create(params, options) {
    const { betas, ...body } = params;
    return this._client.post("/v1/deployments?beta=true", {
      body,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Get Deployment
   *
   * @example
   * ```ts
   * const betaManagedAgentsDeployment =
   *   await client.beta.deployments.retrieve(
   *     'depl_011CZkZcDH3vPqd7xnEfwTai',
   *   );
   * ```
   */
  retrieve(deploymentID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.get(path`/v1/deployments/${deploymentID}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Update Deployment
   *
   * @example
   * ```ts
   * const betaManagedAgentsDeployment =
   *   await client.beta.deployments.update(
   *     'depl_011CZkZcDH3vPqd7xnEfwTai',
   *   );
   * ```
   */
  update(deploymentID, params, options) {
    const { betas, ...body } = params;
    return this._client.post(path`/v1/deployments/${deploymentID}?beta=true`, {
      body,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * List Deployments
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const betaManagedAgentsDeployment of client.beta.deployments.list()) {
   *   // ...
   * }
   * ```
   */
  list(params = {}, options) {
    const { betas, ...query } = params ?? {};
    return this._client.getAPIList("/v1/deployments?beta=true", PageCursor, {
      query,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Archive Deployment
   *
   * @example
   * ```ts
   * const betaManagedAgentsDeployment =
   *   await client.beta.deployments.archive(
   *     'depl_011CZkZcDH3vPqd7xnEfwTai',
   *   );
   * ```
   */
  archive(deploymentID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.post(path`/v1/deployments/${deploymentID}/archive?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Pause Deployment
   *
   * @example
   * ```ts
   * const betaManagedAgentsDeployment =
   *   await client.beta.deployments.pause(
   *     'depl_011CZkZcDH3vPqd7xnEfwTai',
   *   );
   * ```
   */
  pause(deploymentID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.post(path`/v1/deployments/${deploymentID}/pause?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Run Deployment Now
   *
   * @example
   * ```ts
   * const betaManagedAgentsDeploymentRun =
   *   await client.beta.deployments.run(
   *     'depl_011CZkZcDH3vPqd7xnEfwTai',
   *   );
   * ```
   */
  run(deploymentID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.post(path`/v1/deployments/${deploymentID}/run?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Unpause Deployment
   *
   * @example
   * ```ts
   * const betaManagedAgentsDeployment =
   *   await client.beta.deployments.unpause(
   *     'depl_011CZkZcDH3vPqd7xnEfwTai',
   *   );
   * ```
   */
  unpause(deploymentID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.post(path`/v1/deployments/${deploymentID}/unpause?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
};

// node_modules/@anthropic-ai/sdk/resources/beta/dreams.mjs
init_modules_watch_stub();
var Dreams = class extends APIResource {
  static {
    __name(this, "Dreams");
  }
  /**
   * Create a Dream
   *
   * @example
   * ```ts
   * const betaDream = await client.beta.dreams.create({
   *   inputs: [{ memory_store_id: 'x', type: 'memory_store' }],
   *   model: 'string',
   * });
   * ```
   */
  create(params, options) {
    const { betas, ...body } = params;
    return this._client.post("/v1/dreams?beta=true", {
      body,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "dreaming-2026-04-21"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Get a Dream
   *
   * @example
   * ```ts
   * const betaDream = await client.beta.dreams.retrieve(
   *   'dream_id',
   * );
   * ```
   */
  retrieve(dreamID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.get(path`/v1/dreams/${dreamID}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "dreaming-2026-04-21"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * List Dreams
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const betaDream of client.beta.dreams.list()) {
   *   // ...
   * }
   * ```
   */
  list(params = {}, options) {
    const { betas, ...query } = params ?? {};
    return this._client.getAPIList("/v1/dreams?beta=true", PageCursor, {
      query,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "dreaming-2026-04-21"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Archive a Dream
   *
   * @example
   * ```ts
   * const betaDream = await client.beta.dreams.archive(
   *   'dream_id',
   * );
   * ```
   */
  archive(dreamID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.post(path`/v1/dreams/${dreamID}/archive?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "dreaming-2026-04-21"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Cancel a Dream
   *
   * @example
   * ```ts
   * const betaDream = await client.beta.dreams.cancel(
   *   'dream_id',
   * );
   * ```
   */
  cancel(dreamID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.post(path`/v1/dreams/${dreamID}/cancel?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "dreaming-2026-04-21"].toString() },
        options?.headers
      ])
    });
  }
};

// node_modules/@anthropic-ai/sdk/resources/beta/files.mjs
init_modules_watch_stub();

// node_modules/@anthropic-ai/sdk/internal/stainless-helper-header.mjs
init_modules_watch_stub();
var STAINLESS_HELPER_HEADER = "x-stainless-helper";
var STAINLESS_HELPER_METHOD_HEADER = "x-stainless-helper-method";
function helperHeader(value) {
  return { [STAINLESS_HELPER_HEADER]: value };
}
__name(helperHeader, "helperHeader");
var SDK_HELPER_SYMBOL = /* @__PURE__ */ Symbol("anthropic.sdk.stainlessHelper");
function wasCreatedByStainlessHelper(value) {
  return typeof value === "object" && value !== null && SDK_HELPER_SYMBOL in value;
}
__name(wasCreatedByStainlessHelper, "wasCreatedByStainlessHelper");
function collectStainlessHelpers(tools, messages) {
  const helpers = /* @__PURE__ */ new Set();
  if (tools) {
    for (const tool of tools) {
      if (wasCreatedByStainlessHelper(tool)) {
        helpers.add(tool[SDK_HELPER_SYMBOL]);
      }
    }
  }
  if (messages) {
    for (const message of messages) {
      if (wasCreatedByStainlessHelper(message)) {
        helpers.add(message[SDK_HELPER_SYMBOL]);
      }
      const content = message.content;
      if (Array.isArray(content)) {
        for (const block of content) {
          if (wasCreatedByStainlessHelper(block)) {
            helpers.add(block[SDK_HELPER_SYMBOL]);
          }
        }
      }
    }
  }
  return Array.from(helpers);
}
__name(collectStainlessHelpers, "collectStainlessHelpers");
function stainlessHelperHeader(tools, messages) {
  const helpers = collectStainlessHelpers(tools, messages);
  if (helpers.length === 0)
    return {};
  return { [STAINLESS_HELPER_HEADER]: helpers.join(", ") };
}
__name(stainlessHelperHeader, "stainlessHelperHeader");
function stainlessHelperHeaderFromFile(file) {
  if (wasCreatedByStainlessHelper(file)) {
    return { [STAINLESS_HELPER_HEADER]: file[SDK_HELPER_SYMBOL] };
  }
  return {};
}
__name(stainlessHelperHeaderFromFile, "stainlessHelperHeaderFromFile");

// node_modules/@anthropic-ai/sdk/resources/beta/files.mjs
var Files = class extends APIResource {
  static {
    __name(this, "Files");
  }
  /**
   * List Files
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const fileMetadata of client.beta.files.list()) {
   *   // ...
   * }
   * ```
   */
  list(params = {}, options) {
    const { betas, ...query } = params ?? {};
    return this._client.getAPIList("/v1/files?beta=true", Page, {
      query,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "files-api-2025-04-14"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Delete File
   *
   * @example
   * ```ts
   * const deletedFile = await client.beta.files.delete(
   *   'file_id',
   * );
   * ```
   */
  delete(fileID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.delete(path`/v1/files/${fileID}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "files-api-2025-04-14"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Download File
   *
   * @example
   * ```ts
   * const response = await client.beta.files.download(
   *   'file_id',
   * );
   *
   * const content = await response.blob();
   * console.log(content);
   * ```
   */
  download(fileID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.get(path`/v1/files/${fileID}/content?beta=true`, {
      ...options,
      headers: buildHeaders([
        {
          "anthropic-beta": [...betas ?? [], "files-api-2025-04-14"].toString(),
          Accept: "application/binary"
        },
        options?.headers
      ]),
      __binaryResponse: true
    });
  }
  /**
   * Get File Metadata
   *
   * @example
   * ```ts
   * const fileMetadata =
   *   await client.beta.files.retrieveMetadata('file_id');
   * ```
   */
  retrieveMetadata(fileID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.get(path`/v1/files/${fileID}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "files-api-2025-04-14"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Upload File
   *
   * @example
   * ```ts
   * const fileMetadata = await client.beta.files.upload({
   *   file: fs.createReadStream('path/to/file'),
   * });
   * ```
   */
  upload(params, options) {
    const { betas, ...body } = params;
    return this._client.post("/v1/files?beta=true", multipartFormRequestOptions({
      body,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "files-api-2025-04-14"].toString() },
        stainlessHelperHeaderFromFile(body.file),
        options?.headers
      ])
    }, this._client));
  }
};

// node_modules/@anthropic-ai/sdk/resources/beta/models.mjs
init_modules_watch_stub();
var Models = class extends APIResource {
  static {
    __name(this, "Models");
  }
  /**
   * Get a specific model.
   *
   * The Models API response can be used to determine information about a specific
   * model or resolve a model alias to a model ID.
   *
   * @example
   * ```ts
   * const betaModelInfo = await client.beta.models.retrieve(
   *   'model_id',
   * );
   * ```
   */
  retrieve(modelID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.get(path`/v1/models/${modelID}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { ...betas?.toString() != null ? { "anthropic-beta": betas?.toString() } : void 0 },
        options?.headers
      ])
    });
  }
  /**
   * List available models.
   *
   * The Models API response can be used to determine which models are available for
   * use in the API. More recently released models are listed first.
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const betaModelInfo of client.beta.models.list()) {
   *   // ...
   * }
   * ```
   */
  list(params = {}, options) {
    const { betas, ...query } = params ?? {};
    return this._client.getAPIList("/v1/models?beta=true", Page, {
      query,
      ...options,
      headers: buildHeaders([
        { ...betas?.toString() != null ? { "anthropic-beta": betas?.toString() } : void 0 },
        options?.headers
      ])
    });
  }
};

// node_modules/@anthropic-ai/sdk/resources/beta/user-profiles.mjs
init_modules_watch_stub();
var UserProfiles = class extends APIResource {
  static {
    __name(this, "UserProfiles");
  }
  /**
   * Create User Profile
   *
   * @example
   * ```ts
   * const betaUserProfile =
   *   await client.beta.userProfiles.create();
   * ```
   */
  create(params, options) {
    const { betas, ...body } = params;
    return this._client.post("/v1/user_profiles?beta=true", {
      body,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "user-profiles-2026-03-24"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Get User Profile
   *
   * @example
   * ```ts
   * const betaUserProfile =
   *   await client.beta.userProfiles.retrieve(
   *     'uprof_011CZkZCu8hGbp5mYRQgUmz9',
   *   );
   * ```
   */
  retrieve(userProfileID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.get(path`/v1/user_profiles/${userProfileID}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "user-profiles-2026-03-24"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Update User Profile
   *
   * @example
   * ```ts
   * const betaUserProfile =
   *   await client.beta.userProfiles.update(
   *     'uprof_011CZkZCu8hGbp5mYRQgUmz9',
   *   );
   * ```
   */
  update(userProfileID, params, options) {
    const { betas, ...body } = params;
    return this._client.post(path`/v1/user_profiles/${userProfileID}?beta=true`, {
      body,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "user-profiles-2026-03-24"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * List User Profiles
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const betaUserProfile of client.beta.userProfiles.list()) {
   *   // ...
   * }
   * ```
   */
  list(params = {}, options) {
    const { betas, ...query } = params ?? {};
    return this._client.getAPIList("/v1/user_profiles?beta=true", PageCursor, {
      query,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "user-profiles-2026-03-24"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Create Enrollment URL
   *
   * @example
   * ```ts
   * const betaUserProfileEnrollmentURL =
   *   await client.beta.userProfiles.createEnrollmentURL(
   *     'uprof_011CZkZCu8hGbp5mYRQgUmz9',
   *   );
   * ```
   */
  createEnrollmentURL(userProfileID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.post(path`/v1/user_profiles/${userProfileID}/enrollment_url?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "user-profiles-2026-03-24"].toString() },
        options?.headers
      ])
    });
  }
};

// node_modules/@anthropic-ai/sdk/resources/beta/webhooks.mjs
init_modules_watch_stub();
var import_standardwebhooks = __toESM(require_dist(), 1);
var Webhooks = class extends APIResource {
  static {
    __name(this, "Webhooks");
  }
  unwrap(body, { headers, key }) {
    if (headers !== void 0) {
      const keyStr = key === void 0 ? this._client.webhookKey : key;
      if (keyStr === null)
        throw new Error("Webhook key must not be null in order to unwrap");
      const wh = new import_standardwebhooks.Webhook(keyStr);
      wh.verify(body, headers);
    }
    return JSON.parse(body);
  }
};

// node_modules/@anthropic-ai/sdk/resources/beta/agents/agents.mjs
init_modules_watch_stub();

// node_modules/@anthropic-ai/sdk/resources/beta/agents/versions.mjs
init_modules_watch_stub();
var Versions = class extends APIResource {
  static {
    __name(this, "Versions");
  }
  /**
   * List Agent Versions
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const betaManagedAgentsAgent of client.beta.agents.versions.list(
   *   'agent_011CZkYpogX7uDKUyvBTophP',
   * )) {
   *   // ...
   * }
   * ```
   */
  list(agentID, params = {}, options) {
    const { betas, ...query } = params ?? {};
    return this._client.getAPIList(path`/v1/agents/${agentID}/versions?beta=true`, PageCursor, {
      query,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
};

// node_modules/@anthropic-ai/sdk/resources/beta/agents/agents.mjs
var Agents = class extends APIResource {
  static {
    __name(this, "Agents");
  }
  constructor() {
    super(...arguments);
    this.versions = new Versions(this._client);
  }
  /**
   * Create Agent
   *
   * @example
   * ```ts
   * const betaManagedAgentsAgent =
   *   await client.beta.agents.create({
   *     model: 'claude-sonnet-4-6',
   *     name: 'My First Agent',
   *   });
   * ```
   */
  create(params, options) {
    const { betas, ...body } = params;
    return this._client.post("/v1/agents?beta=true", {
      body,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Get Agent
   *
   * @example
   * ```ts
   * const betaManagedAgentsAgent =
   *   await client.beta.agents.retrieve(
   *     'agent_011CZkYpogX7uDKUyvBTophP',
   *   );
   * ```
   */
  retrieve(agentID, params = {}, options) {
    const { betas, ...query } = params ?? {};
    return this._client.get(path`/v1/agents/${agentID}?beta=true`, {
      query,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Update Agent
   *
   * @example
   * ```ts
   * const betaManagedAgentsAgent =
   *   await client.beta.agents.update(
   *     'agent_011CZkYpogX7uDKUyvBTophP',
   *     { description: 'updated' },
   *   );
   * ```
   */
  update(agentID, params, options) {
    const { betas, ...body } = params;
    return this._client.post(path`/v1/agents/${agentID}?beta=true`, {
      body,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * List Agents
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const betaManagedAgentsAgent of client.beta.agents.list()) {
   *   // ...
   * }
   * ```
   */
  list(params = {}, options) {
    const { betas, ...query } = params ?? {};
    return this._client.getAPIList("/v1/agents?beta=true", PageCursor, {
      query,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Archive Agent
   *
   * @example
   * ```ts
   * const betaManagedAgentsAgent =
   *   await client.beta.agents.archive(
   *     'agent_011CZkYpogX7uDKUyvBTophP',
   *   );
   * ```
   */
  archive(agentID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.post(path`/v1/agents/${agentID}/archive?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
};
Agents.Versions = Versions;

// node_modules/@anthropic-ai/sdk/resources/beta/environments/environments.mjs
init_modules_watch_stub();

// node_modules/@anthropic-ai/sdk/resources/beta/environments/work.mjs
init_modules_watch_stub();

// node_modules/@anthropic-ai/sdk/lib/environments/poller.mjs
init_modules_watch_stub();
init_error();

// node_modules/@anthropic-ai/sdk/internal/utils/abort.mjs
init_modules_watch_stub();
function linkAbort(external, controller) {
  if (!external)
    return () => {
    };
  if (external.aborted) {
    controller.abort();
    return () => {
    };
  }
  const onAbort = /* @__PURE__ */ __name(() => controller.abort(), "onAbort");
  external.addEventListener("abort", onAbort);
  return () => external.removeEventListener("abort", onAbort);
}
__name(linkAbort, "linkAbort");

// node_modules/@anthropic-ai/sdk/internal/utils/backoff.mjs
init_modules_watch_stub();
init_error();
function isStatus(e, code) {
  return e instanceof APIError && e.status === code;
}
__name(isStatus, "isStatus");
function is4xx(e) {
  return e instanceof APIError && typeof e.status === "number" && e.status >= 400 && e.status < 500;
}
__name(is4xx, "is4xx");
function isFatal4xx(e) {
  return is4xx(e) && !isStatus(e, 408) && !isStatus(e, 409) && !isStatus(e, 429);
}
__name(isFatal4xx, "isFatal4xx");
function backoff(attempt, baseMs, capMs) {
  return Math.min(baseMs * 2 ** attempt, capMs);
}
__name(backoff, "backoff");
function jitter(lowMs, highMs) {
  return lowMs + Math.random() * (highMs - lowMs);
}
__name(jitter, "jitter");
function applyJitter(ms) {
  return ms * (1 - Math.random() * 0.25);
}
__name(applyJitter, "applyJitter");

// node_modules/@anthropic-ai/sdk/lib/helper-client.mjs
init_modules_watch_stub();
init_error();
function copyClientForHelper(client, { authToken, helper }) {
  if (!authToken) {
    throw new AnthropicError(`copyClientForHelper: expected a non-empty authToken but received ${JSON.stringify(authToken)}`);
  }
  const internal = client;
  const parentDefaults = internal._options.defaultHeaders;
  const parentAuthExtraHeaders = internal._authState?.extraHeaders;
  const inheritedAuthExtraHeaders = parentAuthExtraHeaders ? Object.fromEntries(Object.entries(parentAuthExtraHeaders).filter(([name]) => {
    const lower = name.toLowerCase();
    return lower !== "authorization" && lower !== "x-api-key";
  })) : void 0;
  const defaultHeaders = buildHeaders([
    inheritedAuthExtraHeaders,
    parentDefaults,
    { [STAINLESS_HELPER_HEADER]: helper }
  ]);
  return client.withOptions({
    apiKey: null,
    authToken,
    baseURL: client.baseURL,
    credentials: void 0,
    defaultHeaders
  });
}
__name(copyClientForHelper, "copyClientForHelper");

// node_modules/@anthropic-ai/sdk/lib/environments/poller.mjs
var _WorkPoller_runnerClient;
var _WorkPoller_consumed;
var _WorkPoller_controller;
var _WorkPoller_detachExternal;
var _WorkPoller_autoStop;
var _WorkPoller_drain;
var _WorkPoller_blockMs;
var _WorkPoller_reclaimOlderThanMs;
var _WorkPoller_requestOpts;
var POLL_BLOCK_MS = 999;
var POLL_BACKOFF_BASE_MS = 1e3;
var POLL_BACKOFF_CAP_MS = 6e4;
var WorkPoller = class {
  static {
    __name(this, "WorkPoller");
  }
  constructor(opts) {
    _WorkPoller_runnerClient.set(this, void 0);
    _WorkPoller_consumed.set(this, false);
    _WorkPoller_controller.set(this, void 0);
    _WorkPoller_detachExternal.set(this, void 0);
    _WorkPoller_autoStop.set(this, void 0);
    _WorkPoller_drain.set(this, void 0);
    _WorkPoller_blockMs.set(this, void 0);
    _WorkPoller_reclaimOlderThanMs.set(this, void 0);
    _WorkPoller_requestOpts.set(this, void 0);
    this.client = opts.client;
    this.environmentId = opts.environmentId;
    this.environmentKey = opts.environmentKey;
    this.workerId = opts.workerId ?? defaultWorkerId();
    __classPrivateFieldSet(this, _WorkPoller_runnerClient, copyClientForHelper(opts.client, {
      authToken: opts.environmentKey,
      helper: "environments-work-poller"
    }), "f");
    __classPrivateFieldSet(this, _WorkPoller_autoStop, opts.autoStop ?? true, "f");
    __classPrivateFieldSet(this, _WorkPoller_drain, opts.drain ?? false, "f");
    __classPrivateFieldSet(this, _WorkPoller_blockMs, opts.blockMs === void 0 ? POLL_BLOCK_MS : opts.blockMs, "f");
    __classPrivateFieldSet(this, _WorkPoller_reclaimOlderThanMs, opts.reclaimOlderThanMs ?? null, "f");
    __classPrivateFieldSet(this, _WorkPoller_requestOpts, opts.requestOptions, "f");
    __classPrivateFieldSet(this, _WorkPoller_controller, new AbortController(), "f");
    __classPrivateFieldSet(this, _WorkPoller_detachExternal, linkAbort(opts.signal, __classPrivateFieldGet(this, _WorkPoller_controller, "f")), "f");
  }
  /** Read-only view of this iterator's abort signal. */
  get signal() {
    return __classPrivateFieldGet(this, _WorkPoller_controller, "f").signal;
  }
  /** Abort the iterator. The current `for await` will exit cleanly. */
  abort() {
    __classPrivateFieldGet(this, _WorkPoller_controller, "f").abort();
  }
  async *[(_WorkPoller_runnerClient = /* @__PURE__ */ new WeakMap(), _WorkPoller_consumed = /* @__PURE__ */ new WeakMap(), _WorkPoller_controller = /* @__PURE__ */ new WeakMap(), _WorkPoller_detachExternal = /* @__PURE__ */ new WeakMap(), _WorkPoller_autoStop = /* @__PURE__ */ new WeakMap(), _WorkPoller_drain = /* @__PURE__ */ new WeakMap(), _WorkPoller_blockMs = /* @__PURE__ */ new WeakMap(), _WorkPoller_reclaimOlderThanMs = /* @__PURE__ */ new WeakMap(), _WorkPoller_requestOpts = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
    if (__classPrivateFieldGet(this, _WorkPoller_consumed, "f")) {
      throw new AnthropicError("Cannot iterate over a consumed WorkPoller");
    }
    __classPrivateFieldSet(this, _WorkPoller_consumed, true, "f");
    const log = loggerFor(this.client);
    log.info("poller starting", {
      component: "work-poller",
      environment_id: this.environmentId
    });
    try {
      let attempt = 0;
      while (!__classPrivateFieldGet(this, _WorkPoller_controller, "f").signal.aborted) {
        let work;
        try {
          work = await __classPrivateFieldGet(this, _WorkPoller_runnerClient, "f").beta.environments.work.poll(this.environmentId, {
            "Anthropic-Worker-ID": this.workerId,
            ...__classPrivateFieldGet(this, _WorkPoller_blockMs, "f") !== null ? { block_ms: __classPrivateFieldGet(this, _WorkPoller_blockMs, "f") } : {},
            ...__classPrivateFieldGet(this, _WorkPoller_reclaimOlderThanMs, "f") !== null ? { reclaim_older_than_ms: __classPrivateFieldGet(this, _WorkPoller_reclaimOlderThanMs, "f") } : {}
          }, { headers: buildHeaders([__classPrivateFieldGet(this, _WorkPoller_requestOpts, "f")?.headers]), signal: __classPrivateFieldGet(this, _WorkPoller_controller, "f").signal });
        } catch (e) {
          if (__classPrivateFieldGet(this, _WorkPoller_controller, "f").signal.aborted)
            return;
          if (isFatal4xx(e)) {
            log.error("poll failed permanently, stopping poller", { error: String(e) });
            throw e;
          }
          const wait = applyJitter(backoff2(attempt));
          log.warn("poll failed, backing off", { error: String(e), backoff_ms: wait });
          attempt++;
          await sleep(wait, __classPrivateFieldGet(this, _WorkPoller_controller, "f").signal);
          continue;
        }
        attempt = 0;
        if (work == null) {
          if (__classPrivateFieldGet(this, _WorkPoller_drain, "f"))
            return;
          await sleep(jitter(1e3, 3e3), __classPrivateFieldGet(this, _WorkPoller_controller, "f").signal);
          continue;
        }
        log.info("claimed work", {
          component: "work-poller",
          environment_id: this.environmentId,
          work_id: work.id,
          work_type: work.data.type
        });
        try {
          await __classPrivateFieldGet(this, _WorkPoller_runnerClient, "f").beta.environments.work.ack(work.id, { environment_id: work.environment_id }, { headers: buildHeaders([__classPrivateFieldGet(this, _WorkPoller_requestOpts, "f")?.headers]), signal: __classPrivateFieldGet(this, _WorkPoller_controller, "f").signal });
        } catch (e) {
          log.error("ack failed", { work_id: work.id, error: String(e) });
          continue;
        }
        try {
          yield work;
        } finally {
          if (__classPrivateFieldGet(this, _WorkPoller_autoStop, "f")) {
            try {
              await __classPrivateFieldGet(this, _WorkPoller_runnerClient, "f").beta.environments.work.stop(work.id, { environment_id: work.environment_id }, { headers: buildHeaders([__classPrivateFieldGet(this, _WorkPoller_requestOpts, "f")?.headers]) });
            } catch (e) {
              if (!isStatus(e, 409))
                log.warn("stop failed", { work_id: work.id, error: String(e) });
            }
          }
        }
      }
    } finally {
      __classPrivateFieldGet(this, _WorkPoller_detachExternal, "f").call(this);
    }
  }
};
function backoff2(attempt) {
  return backoff(attempt, POLL_BACKOFF_BASE_MS, POLL_BACKOFF_CAP_MS);
}
__name(backoff2, "backoff");
function defaultWorkerId() {
  const env = globalThis.process?.env;
  const host = env?.["HOSTNAME"];
  return host ? `${host}-${uuid4()}` : uuid4();
}
__name(defaultWorkerId, "defaultWorkerId");

// node_modules/@anthropic-ai/sdk/lib/environments/worker.mjs
init_modules_watch_stub();
init_error();

// node_modules/@anthropic-ai/sdk/lib/tools/SessionToolRunner.mjs
init_modules_watch_stub();
init_error();

// node_modules/@anthropic-ai/sdk/internal/utils/async-queue.mjs
init_modules_watch_stub();
var _AsyncQueue_items;
var _AsyncQueue_waiters;
var _AsyncQueue_closed;
var AsyncQueue = class {
  static {
    __name(this, "AsyncQueue");
  }
  constructor() {
    _AsyncQueue_items.set(this, []);
    _AsyncQueue_waiters.set(this, []);
    _AsyncQueue_closed.set(this, false);
  }
  /** Enqueue an item, or hand it directly to a waiting reader. Returns `false` once closed. */
  push(item) {
    if (__classPrivateFieldGet(this, _AsyncQueue_closed, "f"))
      return false;
    const w = __classPrivateFieldGet(this, _AsyncQueue_waiters, "f").shift();
    if (w)
      w({ done: false, value: item });
    else
      __classPrivateFieldGet(this, _AsyncQueue_items, "f").push(item);
    return true;
  }
  /** Mark the queue done. Idempotent; wakes every pending reader with `done: true`. */
  close() {
    if (__classPrivateFieldGet(this, _AsyncQueue_closed, "f"))
      return;
    __classPrivateFieldSet(this, _AsyncQueue_closed, true, "f");
    while (__classPrivateFieldGet(this, _AsyncQueue_waiters, "f").length > 0) {
      const w = __classPrivateFieldGet(this, _AsyncQueue_waiters, "f").shift();
      w({ done: true, value: void 0 });
    }
  }
  /**
   * Resolve with the next item, or `done: true` once the queue is closed and
   * drained. When `signal` is supplied, aborting it resolves a pending read
   * with `done: true` (cancellation is pushed down here rather than handled by
   * an outer `Promise.race`).
   */
  next(signal) {
    if (__classPrivateFieldGet(this, _AsyncQueue_items, "f").length > 0) {
      return Promise.resolve({ done: false, value: __classPrivateFieldGet(this, _AsyncQueue_items, "f").shift() });
    }
    if (__classPrivateFieldGet(this, _AsyncQueue_closed, "f") || signal?.aborted) {
      return Promise.resolve({ done: true, value: void 0 });
    }
    return new Promise((resolve) => {
      const waiter = /* @__PURE__ */ __name((r) => {
        signal?.removeEventListener("abort", onAbort);
        resolve(r);
      }, "waiter");
      const onAbort = /* @__PURE__ */ __name(() => {
        const idx = __classPrivateFieldGet(this, _AsyncQueue_waiters, "f").indexOf(waiter);
        if (idx >= 0)
          __classPrivateFieldGet(this, _AsyncQueue_waiters, "f").splice(idx, 1);
        resolve({ done: true, value: void 0 });
      }, "onAbort");
      __classPrivateFieldGet(this, _AsyncQueue_waiters, "f").push(waiter);
      signal?.addEventListener("abort", onAbort, { once: true });
    });
  }
  /** Synchronously remove and return the next buffered item, or `undefined` if empty. */
  tryShift() {
    return __classPrivateFieldGet(this, _AsyncQueue_items, "f").shift();
  }
};
_AsyncQueue_items = /* @__PURE__ */ new WeakMap(), _AsyncQueue_waiters = /* @__PURE__ */ new WeakMap(), _AsyncQueue_closed = /* @__PURE__ */ new WeakMap();

// node_modules/@anthropic-ai/sdk/lib/tools/BetaRunnableTool.mjs
init_modules_watch_stub();

// node_modules/@anthropic-ai/sdk/lib/tools/ToolError.mjs
init_modules_watch_stub();
var ToolError = class extends Error {
  static {
    __name(this, "ToolError");
  }
  constructor(content) {
    const message = typeof content === "string" ? content : content.map((block) => {
      if (block.type === "text")
        return block.text;
      return `[${block.type}]`;
    }).join(" ");
    super(message);
    this.name = "ToolError";
    this.content = content;
  }
};

// node_modules/@anthropic-ai/sdk/lib/tools/BetaRunnableTool.mjs
function toolName(tool) {
  return "name" in tool ? tool.name : tool.mcp_server_name;
}
__name(toolName, "toolName");
function toolErrorContent(e) {
  return e instanceof ToolError ? e.content : `Error: ${e instanceof Error ? e.message : String(e)}`;
}
__name(toolErrorContent, "toolErrorContent");
async function runRunnableTool(tool, rawInput, context) {
  try {
    const input = tool.parse ? tool.parse(rawInput) : rawInput;
    const content = await tool.run(input, context);
    return { content, isError: false };
  } catch (e) {
    return { content: toolErrorContent(e), isError: true };
  }
}
__name(runRunnableTool, "runRunnableTool");

// node_modules/@anthropic-ai/sdk/lib/tools/SessionToolRunner.mjs
var _IdleClock_maxIdleMs;
var _IdleClock_onExpire;
var _IdleClock_blockers;
var _IdleClock_armPending;
var _IdleClock_timer;
var _SessionToolRunner_instances;
var _SessionToolRunner_consumed;
var _SessionToolRunner_controller;
var _SessionToolRunner_detachExternal;
var _SessionToolRunner_requestOpts;
var _SessionToolRunner_toolByName;
var _SessionToolRunner_logger;
var _SessionToolRunner_seen;
var _SessionToolRunner_answered;
var _SessionToolRunner_confirmationVerdicts;
var _SessionToolRunner_awaitingConfirmation;
var _SessionToolRunner_results;
var _SessionToolRunner_inFlightCount;
var _SessionToolRunner_onIdle;
var _SessionToolRunner_idleClock;
var _SessionToolRunner_requestOptions;
var _SessionToolRunner_streamLoop;
var _SessionToolRunner_reconcile;
var _SessionToolRunner_ingestHistory;
var _SessionToolRunner_handleStreamEvent;
var _SessionToolRunner_routeToolEvent;
var _SessionToolRunner_noteConfirmation;
var _SessionToolRunner_applyVerdict;
var _SessionToolRunner_surfaceCall;
var _SessionToolRunner_execute;
var _SessionToolRunner_sendResult;
var _SessionToolRunner_drain;
var STREAM_BACKOFF_START_MS = 500;
var STREAM_BACKOFF_CAP_MS = 1e4;
var TOOL_TIMEOUT_MS = 12e4;
var DRAIN_TIMEOUT_MS = 3e4;
var SEND_RETRIES = 3;
var DEFAULT_MAX_IDLE_MS = 6e4;
function isEndTurnIdle(ev) {
  return ev.type === "session.status_idle" && ev.stop_reason?.type === "end_turn";
}
__name(isEndTurnIdle, "isEndTurnIdle");
var IdleClock = class {
  static {
    __name(this, "IdleClock");
  }
  constructor(maxIdleMs, onExpire) {
    _IdleClock_maxIdleMs.set(this, void 0);
    _IdleClock_onExpire.set(this, void 0);
    _IdleClock_blockers.set(this, /* @__PURE__ */ new Set());
    _IdleClock_armPending.set(this, false);
    _IdleClock_timer.set(this, void 0);
    __classPrivateFieldSet(this, _IdleClock_maxIdleMs, maxIdleMs, "f");
    __classPrivateFieldSet(this, _IdleClock_onExpire, onExpire, "f");
  }
  /**
   * Arm on `status_idle{end_turn}`; disarm otherwise. `user.tool_confirmation`
   * is neutral: it signals neither agent activity nor an idle, and its effect
   * on the clock flows through {@link block} / {@link unblock} instead —
   * disarming here would discard the pending arm the verdict is about to
   * settle.
   */
  noteEvent(ev) {
    if (ev.type === "user.tool_confirmation")
      return;
    if (isEndTurnIdle(ev))
      this.arm();
    else
      this.disarm();
  }
  /** Register gated work that must resolve before an idle countdown starts. */
  block(toolUseId) {
    __classPrivateFieldGet(this, _IdleClock_blockers, "f").add(toolUseId);
    if (__classPrivateFieldGet(this, _IdleClock_timer, "f") !== void 0) {
      __classPrivateFieldSet(this, _IdleClock_armPending, true, "f");
      clearTimeout(__classPrivateFieldGet(this, _IdleClock_timer, "f"));
      __classPrivateFieldSet(this, _IdleClock_timer, void 0, "f");
    }
  }
  /**
   * Retire gated work (a no-op for ids never blocked); applies a pending arm —
   * with a fresh full `maxIdleMs` window — once the last blocker retires.
   */
  unblock(toolUseId) {
    __classPrivateFieldGet(this, _IdleClock_blockers, "f").delete(toolUseId);
    if (__classPrivateFieldGet(this, _IdleClock_blockers, "f").size === 0 && __classPrivateFieldGet(this, _IdleClock_armPending, "f"))
      this.arm();
  }
  /**
   * (Re)start the idle countdown — or, while blockers are outstanding, hold
   * the arm pending instead. Stopping then would drop a held call when its
   * verdict later arrives, or cut the runner off before a released call's
   * result can drive the next turn.
   */
  arm() {
    if (__classPrivateFieldGet(this, _IdleClock_maxIdleMs, "f") <= 0)
      return;
    if (__classPrivateFieldGet(this, _IdleClock_blockers, "f").size > 0) {
      __classPrivateFieldSet(this, _IdleClock_armPending, true, "f");
      return;
    }
    __classPrivateFieldSet(this, _IdleClock_armPending, false, "f");
    if (__classPrivateFieldGet(this, _IdleClock_timer, "f") !== void 0)
      clearTimeout(__classPrivateFieldGet(this, _IdleClock_timer, "f"));
    __classPrivateFieldSet(this, _IdleClock_timer, setTimeout(__classPrivateFieldGet(this, _IdleClock_onExpire, "f"), __classPrivateFieldGet(this, _IdleClock_maxIdleMs, "f")), "f");
  }
  /**
   * Cancel the idle countdown and any pending arm. Blockers persist — they
   * track real outstanding work, retired only by {@link unblock}.
   */
  disarm() {
    __classPrivateFieldSet(this, _IdleClock_armPending, false, "f");
    if (__classPrivateFieldGet(this, _IdleClock_timer, "f") !== void 0) {
      clearTimeout(__classPrivateFieldGet(this, _IdleClock_timer, "f"));
      __classPrivateFieldSet(this, _IdleClock_timer, void 0, "f");
    }
  }
};
_IdleClock_maxIdleMs = /* @__PURE__ */ new WeakMap(), _IdleClock_onExpire = /* @__PURE__ */ new WeakMap(), _IdleClock_blockers = /* @__PURE__ */ new WeakMap(), _IdleClock_armPending = /* @__PURE__ */ new WeakMap(), _IdleClock_timer = /* @__PURE__ */ new WeakMap();
var SessionToolRunner = class {
  static {
    __name(this, "SessionToolRunner");
  }
  constructor(sessionId, opts) {
    _SessionToolRunner_instances.add(this);
    _SessionToolRunner_consumed.set(this, false);
    _SessionToolRunner_controller.set(this, void 0);
    _SessionToolRunner_detachExternal.set(this, void 0);
    _SessionToolRunner_requestOpts.set(this, void 0);
    _SessionToolRunner_toolByName.set(this, void 0);
    _SessionToolRunner_logger.set(this, void 0);
    _SessionToolRunner_seen.set(this, /* @__PURE__ */ new Set());
    _SessionToolRunner_answered.set(this, /* @__PURE__ */ new Set());
    _SessionToolRunner_confirmationVerdicts.set(this, /* @__PURE__ */ new Map());
    _SessionToolRunner_awaitingConfirmation.set(this, /* @__PURE__ */ new Map());
    _SessionToolRunner_results.set(this, new AsyncQueue());
    _SessionToolRunner_inFlightCount.set(this, 0);
    _SessionToolRunner_onIdle.set(this, null);
    _SessionToolRunner_idleClock.set(this, void 0);
    this.client = opts.client;
    this.sessionId = sessionId;
    this.tools = opts.tools;
    this.maxIdleMs = opts.maxIdleMs ?? DEFAULT_MAX_IDLE_MS;
    __classPrivateFieldSet(this, _SessionToolRunner_logger, loggerFor(opts.client), "f");
    __classPrivateFieldSet(this, _SessionToolRunner_toolByName, new Map(opts.tools.map((t) => [toolName(t), t])), "f");
    __classPrivateFieldSet(this, _SessionToolRunner_controller, new AbortController(), "f");
    __classPrivateFieldSet(this, _SessionToolRunner_detachExternal, linkAbort(opts.signal, __classPrivateFieldGet(this, _SessionToolRunner_controller, "f")), "f");
    __classPrivateFieldSet(this, _SessionToolRunner_requestOpts, opts.requestOptions, "f");
    __classPrivateFieldSet(this, _SessionToolRunner_idleClock, new IdleClock(this.maxIdleMs, () => {
      __classPrivateFieldGet(this, _SessionToolRunner_logger, "f").info("session idle after end_turn; stopping", {
        component: "session-tool-runner",
        session_id: this.sessionId,
        max_idle_ms: this.maxIdleMs
      });
      __classPrivateFieldGet(this, _SessionToolRunner_controller, "f").abort();
    }), "f");
  }
  /** Read-only view of this runner's abort signal. */
  get signal() {
    return __classPrivateFieldGet(this, _SessionToolRunner_controller, "f").signal;
  }
  /** Abort the runner. Background tasks will wind down and `for await` will exit cleanly. */
  abort() {
    __classPrivateFieldGet(this, _SessionToolRunner_controller, "f").abort();
  }
  async *[(_SessionToolRunner_consumed = /* @__PURE__ */ new WeakMap(), _SessionToolRunner_controller = /* @__PURE__ */ new WeakMap(), _SessionToolRunner_detachExternal = /* @__PURE__ */ new WeakMap(), _SessionToolRunner_requestOpts = /* @__PURE__ */ new WeakMap(), _SessionToolRunner_toolByName = /* @__PURE__ */ new WeakMap(), _SessionToolRunner_logger = /* @__PURE__ */ new WeakMap(), _SessionToolRunner_seen = /* @__PURE__ */ new WeakMap(), _SessionToolRunner_answered = /* @__PURE__ */ new WeakMap(), _SessionToolRunner_confirmationVerdicts = /* @__PURE__ */ new WeakMap(), _SessionToolRunner_awaitingConfirmation = /* @__PURE__ */ new WeakMap(), _SessionToolRunner_results = /* @__PURE__ */ new WeakMap(), _SessionToolRunner_inFlightCount = /* @__PURE__ */ new WeakMap(), _SessionToolRunner_onIdle = /* @__PURE__ */ new WeakMap(), _SessionToolRunner_idleClock = /* @__PURE__ */ new WeakMap(), _SessionToolRunner_instances = /* @__PURE__ */ new WeakSet(), Symbol.asyncIterator)]() {
    if (__classPrivateFieldGet(this, _SessionToolRunner_consumed, "f")) {
      throw new AnthropicError("Cannot iterate over a consumed SessionToolRunner");
    }
    __classPrivateFieldSet(this, _SessionToolRunner_consumed, true, "f");
    __classPrivateFieldGet(this, _SessionToolRunner_logger, "f").info("session tool runner starting", {
      component: "session-tool-runner",
      session_id: this.sessionId
    });
    const streamPromise = __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_streamLoop).call(this).catch((e) => {
      if (!__classPrivateFieldGet(this, _SessionToolRunner_controller, "f").signal.aborted) {
        __classPrivateFieldGet(this, _SessionToolRunner_logger, "f").error("stream loop failed", { error: String(e) });
      }
      __classPrivateFieldGet(this, _SessionToolRunner_controller, "f").abort();
    });
    try {
      while (true) {
        const next = await __classPrivateFieldGet(this, _SessionToolRunner_results, "f").next(__classPrivateFieldGet(this, _SessionToolRunner_controller, "f").signal);
        if (next.done)
          break;
        yield next.value;
      }
      await streamPromise;
      let pending;
      while ((pending = __classPrivateFieldGet(this, _SessionToolRunner_results, "f").tryShift()) !== void 0) {
        yield pending;
      }
    } finally {
      __classPrivateFieldGet(this, _SessionToolRunner_controller, "f").abort();
      __classPrivateFieldGet(this, _SessionToolRunner_idleClock, "f").disarm();
      await streamPromise;
      try {
        await __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_drain).call(this);
      } catch (e) {
        __classPrivateFieldGet(this, _SessionToolRunner_logger, "f").warn("drain failed", { error: String(e) });
      }
      __classPrivateFieldGet(this, _SessionToolRunner_results, "f").close();
      for (const t of this.tools) {
        try {
          await t.close?.();
        } catch (e) {
          __classPrivateFieldGet(this, _SessionToolRunner_logger, "f").warn("tool.close failed", { tool: toolName(t), error: String(e) });
        }
      }
      __classPrivateFieldGet(this, _SessionToolRunner_detachExternal, "f").call(this);
    }
  }
};
_SessionToolRunner_requestOptions = /* @__PURE__ */ __name(function _SessionToolRunner_requestOptions2() {
  return {
    ...__classPrivateFieldGet(this, _SessionToolRunner_requestOpts, "f"),
    headers: buildHeaders([helperHeader("session-tool-runner"), __classPrivateFieldGet(this, _SessionToolRunner_requestOpts, "f")?.headers]),
    signal: __classPrivateFieldGet(this, _SessionToolRunner_controller, "f").signal
  };
}, "_SessionToolRunner_requestOptions"), _SessionToolRunner_streamLoop = // ===== event stream =====
/* @__PURE__ */ __name(async function _SessionToolRunner_streamLoop2() {
  const ctrl = __classPrivateFieldGet(this, _SessionToolRunner_controller, "f");
  let backoff3 = STREAM_BACKOFF_START_MS;
  while (!ctrl.signal.aborted) {
    try {
      const stream = await this.client.beta.sessions.events.stream(this.sessionId, {}, __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_requestOptions).call(this));
      await __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_reconcile).call(this);
      for await (const ev of stream) {
        backoff3 = STREAM_BACKOFF_START_MS;
        if (await __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_handleStreamEvent).call(this, ev))
          return;
      }
    } catch (e) {
      ctrl.signal.throwIfAborted();
      if (isFatal4xx(e)) {
        __classPrivateFieldGet(this, _SessionToolRunner_logger, "f").error("permanent stream failure, shutting down", { error: String(e) });
        ctrl.abort();
        throw e;
      }
      __classPrivateFieldGet(this, _SessionToolRunner_logger, "f").warn("stream disconnected, reconnecting", {
        error: String(e),
        backoff_ms: backoff3
      });
    }
    ctrl.signal.throwIfAborted();
    await sleep(backoff3, ctrl.signal);
    backoff3 = Math.min(backoff3 * 2, STREAM_BACKOFF_CAP_MS);
  }
}, "_SessionToolRunner_streamLoop"), _SessionToolRunner_reconcile = /**
 * Read full history before dispatching so a `tool_use` whose result appears
 * later in the same history is not re-executed. Runs after the live stream is
 * already attached (see {@link SessionToolRunner.#streamLoop}).
 */
/* @__PURE__ */ __name(async function _SessionToolRunner_reconcile2() {
  const ctrl = __classPrivateFieldGet(this, _SessionToolRunner_controller, "f");
  const pending = [];
  let lastWasEndTurn = false;
  try {
    for await (const ev of this.client.beta.sessions.events.list(this.sessionId, { limit: 1e3 }, __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_requestOptions).call(this))) {
      __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_ingestHistory).call(this, ev, pending);
      lastWasEndTurn = isEndTurnIdle(ev);
    }
  } catch (e) {
    ctrl.signal.throwIfAborted();
    __classPrivateFieldGet(this, _SessionToolRunner_logger, "f").warn("reconcile list failed", { error: String(e) });
    for (const ev of pending)
      __classPrivateFieldGet(this, _SessionToolRunner_seen, "f").delete(ev.id);
    return;
  }
  const unanswered = pending.filter((ev) => !__classPrivateFieldGet(this, _SessionToolRunner_answered, "f").has(ev.id));
  __classPrivateFieldGet(this, _SessionToolRunner_idleClock, "f").disarm();
  for (const ev of unanswered)
    await __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_routeToolEvent).call(this, ev);
  for (const held of [...__classPrivateFieldGet(this, _SessionToolRunner_awaitingConfirmation, "f").values()]) {
    const verdict = __classPrivateFieldGet(this, _SessionToolRunner_confirmationVerdicts, "f").get(held.id);
    if (verdict !== void 0)
      await __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_applyVerdict).call(this, held, verdict);
  }
  const outstanding = unanswered.filter((ev) => !__classPrivateFieldGet(this, _SessionToolRunner_answered, "f").has(ev.id) && !__classPrivateFieldGet(this, _SessionToolRunner_awaitingConfirmation, "f").has(ev.id));
  if (lastWasEndTurn && outstanding.length === 0)
    __classPrivateFieldGet(this, _SessionToolRunner_idleClock, "f").arm();
  else
    __classPrivateFieldGet(this, _SessionToolRunner_idleClock, "f").disarm();
}, "_SessionToolRunner_reconcile"), _SessionToolRunner_ingestHistory = /* @__PURE__ */ __name(function _SessionToolRunner_ingestHistory2(ev, pending) {
  if (ev.type === "agent.tool_use" || ev.type === "agent.custom_tool_use") {
    __classPrivateFieldGet(this, _SessionToolRunner_seen, "f").add(ev.id);
    if (!__classPrivateFieldGet(this, _SessionToolRunner_answered, "f").has(ev.id))
      pending.push(ev);
  } else if (ev.type === "user.tool_result") {
    __classPrivateFieldGet(this, _SessionToolRunner_answered, "f").add(ev.tool_use_id);
  } else if (ev.type === "user.custom_tool_result") {
    __classPrivateFieldGet(this, _SessionToolRunner_answered, "f").add(ev.custom_tool_use_id);
  } else if (ev.type === "user.tool_confirmation") {
    if (!__classPrivateFieldGet(this, _SessionToolRunner_answered, "f").has(ev.tool_use_id))
      __classPrivateFieldGet(this, _SessionToolRunner_confirmationVerdicts, "f").set(ev.tool_use_id, ev.result);
  }
}, "_SessionToolRunner_ingestHistory"), _SessionToolRunner_handleStreamEvent = /** Returns true when the runner should exit. */
/* @__PURE__ */ __name(async function _SessionToolRunner_handleStreamEvent2(ev) {
  __classPrivateFieldGet(this, _SessionToolRunner_idleClock, "f").noteEvent(ev);
  switch (ev.type) {
    case "agent.tool_use":
    case "agent.custom_tool_use":
      if (!__classPrivateFieldGet(this, _SessionToolRunner_seen, "f").has(ev.id)) {
        __classPrivateFieldGet(this, _SessionToolRunner_seen, "f").add(ev.id);
        await __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_routeToolEvent).call(this, ev);
      }
      return false;
    case "user.tool_confirmation":
      await __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_noteConfirmation).call(this, ev);
      return false;
    case "user.tool_result":
      __classPrivateFieldGet(this, _SessionToolRunner_answered, "f").add(ev.tool_use_id);
      return false;
    case "user.custom_tool_result":
      __classPrivateFieldGet(this, _SessionToolRunner_answered, "f").add(ev.custom_tool_use_id);
      return false;
    case "session.status_terminated":
    case "session.deleted":
      __classPrivateFieldGet(this, _SessionToolRunner_logger, "f").info("session terminated", {
        component: "session-tool-runner",
        session_id: this.sessionId
      });
      __classPrivateFieldGet(this, _SessionToolRunner_controller, "f").abort();
      return true;
    default:
      return false;
  }
}, "_SessionToolRunner_handleStreamEvent"), _SessionToolRunner_routeToolEvent = // ===== confirmation gating (always_ask tools) =====
/**
 * Dispatch `ev`, honoring its evaluated permission. A call the server gated
 * (`evaluated_permission == "ask"`) is held until its `user.tool_confirmation`
 * arrives. Fails closed: only an explicit `allow` verdict releases a gated
 * call; a server-side `deny` overrides any recorded verdict; an unrecognized
 * permission is held like `ask` and an unrecognized verdict is denied.
 */
/* @__PURE__ */ __name(async function _SessionToolRunner_routeToolEvent2(ev) {
  const permission = ev.evaluated_permission;
  const verdict = permission === "deny" ? "deny" : __classPrivateFieldGet(this, _SessionToolRunner_confirmationVerdicts, "f").get(ev.id);
  if (verdict === void 0) {
    if (permission === void 0 || permission === "allow") {
      await __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_execute).call(this, ev, void 0);
    } else if (!__classPrivateFieldGet(this, _SessionToolRunner_awaitingConfirmation, "f").has(ev.id)) {
      __classPrivateFieldGet(this, _SessionToolRunner_logger, "f").info("tool call awaiting confirmation; holding", {
        component: "session-tool-runner",
        session_id: this.sessionId,
        tool: ev.name,
        tool_use_id: ev.id
      });
      __classPrivateFieldGet(this, _SessionToolRunner_awaitingConfirmation, "f").set(ev.id, ev);
      __classPrivateFieldGet(this, _SessionToolRunner_idleClock, "f").block(ev.id);
    }
    return;
  }
  await __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_applyVerdict).call(this, ev, verdict);
}, "_SessionToolRunner_routeToolEvent"), _SessionToolRunner_noteConfirmation = /** Record an allow/deny verdict and release the held call it gates, if any. */
/* @__PURE__ */ __name(async function _SessionToolRunner_noteConfirmation2(ev) {
  __classPrivateFieldGet(this, _SessionToolRunner_confirmationVerdicts, "f").set(ev.tool_use_id, ev.result);
  const held = __classPrivateFieldGet(this, _SessionToolRunner_awaitingConfirmation, "f").get(ev.tool_use_id);
  if (held === void 0)
    return;
  await __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_applyVerdict).call(this, held, ev.result);
}, "_SessionToolRunner_noteConfirmation"), _SessionToolRunner_applyVerdict = /**
 * Dispatch or resolve a gated call according to its verdict.
 *
 * The idle-clock blocker accounting lives here: a denial retires the held
 * call's blocker, while an allow keeps one on the call — taking it now if the
 * verdict was already known when the call was routed, so it was never held —
 * until `#execute` has finished with it. The countdown must not run over
 * gated work that is still in flight.
 */
/* @__PURE__ */ __name(async function _SessionToolRunner_applyVerdict2(ev, verdict) {
  const wasHeld = __classPrivateFieldGet(this, _SessionToolRunner_awaitingConfirmation, "f").delete(ev.id);
  if (verdict === "allow") {
    __classPrivateFieldGet(this, _SessionToolRunner_logger, "f").info("tool call confirmed", {
      component: "session-tool-runner",
      session_id: this.sessionId,
      tool: ev.name,
      tool_use_id: ev.id
    });
    if (!wasHeld)
      __classPrivateFieldGet(this, _SessionToolRunner_idleClock, "f").block(ev.id);
    try {
      await __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_execute).call(this, ev, "allow");
    } finally {
      __classPrivateFieldGet(this, _SessionToolRunner_idleClock, "f").unblock(ev.id);
    }
    return;
  }
  if (wasHeld)
    __classPrivateFieldGet(this, _SessionToolRunner_idleClock, "f").unblock(ev.id);
  __classPrivateFieldGet(this, _SessionToolRunner_answered, "f").add(ev.id);
  __classPrivateFieldGet(this, _SessionToolRunner_logger, "f").info("tool call denied; not executing", {
    component: "session-tool-runner",
    session_id: this.sessionId,
    tool: ev.name,
    tool_use_id: ev.id
  });
  __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_surfaceCall).call(this, {
    event: ev,
    toolUseId: ev.id,
    name: ev.name,
    isError: false,
    posted: false,
    confirmation: "deny"
  });
}, "_SessionToolRunner_applyVerdict"), _SessionToolRunner_surfaceCall = /* @__PURE__ */ __name(function _SessionToolRunner_surfaceCall2(call) {
  __classPrivateFieldGet(this, _SessionToolRunner_results, "f").push(call);
}, "_SessionToolRunner_surfaceCall"), _SessionToolRunner_execute = // ===== tool execution =====
/* @__PURE__ */ __name(async function _SessionToolRunner_execute2(ev, confirmation) {
  var _a2, _b;
  if (__classPrivateFieldGet(this, _SessionToolRunner_answered, "f").has(ev.id))
    return;
  __classPrivateFieldGet(this, _SessionToolRunner_logger, "f").info("executing tool", {
    component: "session-tool-runner",
    session_id: this.sessionId,
    tool: ev.name,
    tool_use_id: ev.id
  });
  __classPrivateFieldSet(this, _SessionToolRunner_inFlightCount, (_a2 = __classPrivateFieldGet(this, _SessionToolRunner_inFlightCount, "f"), _a2++, _a2), "f");
  try {
    const tool = __classPrivateFieldGet(this, _SessionToolRunner_toolByName, "f").get(ev.name);
    if (!tool) {
      __classPrivateFieldGet(this, _SessionToolRunner_logger, "f").info("tool not owned by this runner; leaving the tool_use_id pending for its owner", {
        component: "session-tool-runner",
        session_id: this.sessionId,
        tool: ev.name,
        tool_use_id: ev.id
      });
      __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_surfaceCall).call(this, {
        event: ev,
        toolUseId: ev.id,
        name: ev.name,
        isError: false,
        posted: false,
        confirmation
      });
      return;
    }
    let content;
    let isError;
    const toolCtrl = new AbortController();
    const detachTool = linkAbort(__classPrivateFieldGet(this, _SessionToolRunner_controller, "f").signal, toolCtrl);
    const timer = setTimeout(() => toolCtrl.abort(), TOOL_TIMEOUT_MS);
    try {
      const outcome = await runRunnableTool(tool, ev.input, {
        toolUse: ev,
        toolUseBlock: ev,
        signal: toolCtrl.signal
      });
      content = outcome.content;
      isError = outcome.isError;
    } finally {
      clearTimeout(timer);
      detachTool();
    }
    const result = buildResultEvent(ev, isError, toSessionContent(content));
    const posted = await __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_sendResult).call(this, result, ev.id);
    __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_surfaceCall).call(this, {
      event: ev,
      result,
      toolUseId: ev.id,
      name: ev.name,
      isError,
      posted,
      confirmation
    });
  } finally {
    __classPrivateFieldSet(this, _SessionToolRunner_inFlightCount, (_b = __classPrivateFieldGet(this, _SessionToolRunner_inFlightCount, "f"), _b--, _b), "f");
    if (__classPrivateFieldGet(this, _SessionToolRunner_inFlightCount, "f") === 0)
      __classPrivateFieldGet(this, _SessionToolRunner_onIdle, "f")?.call(this);
  }
}, "_SessionToolRunner_execute"), _SessionToolRunner_sendResult = /* @__PURE__ */ __name(async function _SessionToolRunner_sendResult2(result, toolUseId) {
  const ctrl = __classPrivateFieldGet(this, _SessionToolRunner_controller, "f");
  let lastErr;
  for (let i = 0; i < SEND_RETRIES; i++) {
    ctrl.signal.throwIfAborted();
    try {
      await this.client.beta.sessions.events.send(this.sessionId, { events: [result] }, __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_requestOptions).call(this));
      __classPrivateFieldGet(this, _SessionToolRunner_answered, "f").add(toolUseId);
      return true;
    } catch (e) {
      lastErr = e;
      if (isFatal4xx(e))
        break;
      if (i < SEND_RETRIES - 1)
        await sleep((i + 1) * 1e3, ctrl.signal);
    }
  }
  __classPrivateFieldGet(this, _SessionToolRunner_logger, "f").error("failed to send tool result", {
    tool_use_id: toolUseId,
    error: String(lastErr)
  });
  return false;
}, "_SessionToolRunner_sendResult"), _SessionToolRunner_drain = /** Wait (bounded) for in-flight tool executions to finish during teardown. */
/* @__PURE__ */ __name(async function _SessionToolRunner_drain2() {
  if (__classPrivateFieldGet(this, _SessionToolRunner_inFlightCount, "f") === 0)
    return;
  await Promise.race([new Promise((r) => __classPrivateFieldSet(this, _SessionToolRunner_onIdle, r, "f")), sleep(DRAIN_TIMEOUT_MS)]);
  __classPrivateFieldSet(this, _SessionToolRunner_onIdle, null, "f");
  if (__classPrivateFieldGet(this, _SessionToolRunner_inFlightCount, "f") > 0) {
    __classPrivateFieldGet(this, _SessionToolRunner_logger, "f").warn("drain timeout exceeded");
  }
}, "_SessionToolRunner_drain");
function buildResultEvent(ev, isError, content) {
  if (ev.type === "agent.custom_tool_use") {
    return { type: "user.custom_tool_result", custom_tool_use_id: ev.id, is_error: isError, content };
  }
  return { type: "user.tool_result", tool_use_id: ev.id, is_error: isError, content };
}
__name(buildResultEvent, "buildResultEvent");
function toSessionContent(content) {
  if (typeof content === "string")
    return [{ type: "text", text: content || "(no output)" }];
  const out = content.map((b) => {
    if (b.type === "text")
      return { type: "text", text: b.text || "(no output)" };
    if (b.type === "image" || b.type === "document")
      return b;
    if (b.type === "search_result") {
      return {
        type: "search_result",
        source: b.source,
        title: b.title,
        content: b.content.map((c) => ({ type: "text", text: c.text })),
        citations: { enabled: b.citations?.enabled ?? false }
      };
    }
    return { type: "text", text: JSON.stringify(b) };
  });
  return out.length > 0 ? out : [{ type: "text", text: "(no output)" }];
}
__name(toSessionContent, "toSessionContent");

// node_modules/@anthropic-ai/sdk/lib/environments/worker.mjs
var _EnvironmentWorker_instances;
var _EnvironmentWorker_signal;
var _EnvironmentWorker_handleItem;
var HEARTBEAT_DEFAULT_MS = 3e4;
var NO_HEARTBEAT_SENTINEL = "NO_HEARTBEAT";
var EnvironmentWorker = class {
  static {
    __name(this, "EnvironmentWorker");
  }
  constructor(opts) {
    _EnvironmentWorker_instances.add(this);
    _EnvironmentWorker_signal.set(this, void 0);
    this.client = opts.client;
    this.environmentId = opts.environmentId;
    this.environmentKey = opts.environmentKey;
    this.tools = opts.tools;
    this.workdir = opts.workdir ?? process.cwd();
    this.unrestrictedPaths = opts.unrestrictedPaths;
    this.maxFileBytes = opts.maxFileBytes;
    this.maxIdleMs = opts.maxIdleMs;
    this.workerId = opts.workerId;
    this.requestOptions = opts.requestOptions;
    __classPrivateFieldSet(this, _EnvironmentWorker_signal, opts.signal, "f");
  }
  /**
   * Poll the environment and service each claimed session until the supplied
   * signal (or the one passed to the constructor) aborts. Throws if
   * `environmentId` / `environmentKey` were not provided to the constructor.
   */
  async run(signal) {
    const { environmentId, environmentKey } = this;
    if (environmentId === void 0 || environmentKey === void 0) {
      throw new AnthropicError("EnvironmentWorker.run: environmentId and environmentKey are required to poll for work");
    }
    const externalSignal = signal ?? __classPrivateFieldGet(this, _EnvironmentWorker_signal, "f");
    const poller = new WorkPoller({
      client: this.client,
      environmentId,
      environmentKey,
      ...this.workerId !== void 0 ? { workerId: this.workerId } : {},
      ...externalSignal ? { signal: externalSignal } : {},
      ...this.requestOptions !== void 0 ? { requestOptions: this.requestOptions } : {},
      // The per-item handler force-stops every work item on exit; let it be the
      // single owner of `work.stop` rather than double-posting from the poller.
      autoStop: false
    });
    for await (const work of poller) {
      await __classPrivateFieldGet(this, _EnvironmentWorker_instances, "m", _EnvironmentWorker_handleItem).call(this, work, environmentKey, poller.signal);
    }
  }
  /**
   * Service a single, already-claimed work item without the poll loop: build the
   * per-session {@link AgentToolContext} (workdir from this worker's options),
   * download the session agent's skills (`setupSkills`), run a
   * {@link SessionToolRunner} for the session while heartbeating the work-item
   * lease in parallel, and force-stop the work item on exit (whether the runner
   * finishes normally, throws, or the heartbeat loop signals shutdown).
   *
   * Use this when something else does the claiming — e.g. a `worker poll
   * --on-work` script that hands an already-claimed item to a fresh process. The
   * work id / environment id / session id each fall back to `ANTHROPIC_WORK_ID` /
   * `ANTHROPIC_ENVIRONMENT_ID` / `ANTHROPIC_SESSION_ID` (the env vars that
   * command sets) when not passed; the environment key resolves from this
   * option, then the worker's own `environmentKey`, then
   * `ANTHROPIC_ENVIRONMENT_KEY`. With no arguments inside that command it just
   * works. Throws a clear error naming the first of the four required values
   * still missing after resolution.
   */
  async handleItem(opts) {
    const workId = opts?.workId ?? readEnv("ANTHROPIC_WORK_ID");
    const environmentId = opts?.environmentId ?? readEnv("ANTHROPIC_ENVIRONMENT_ID");
    const sessionId = opts?.sessionId ?? readEnv("ANTHROPIC_SESSION_ID");
    const environmentKey = opts?.environmentKey ?? this.environmentKey ?? readEnv("ANTHROPIC_ENVIRONMENT_KEY");
    if (!workId) {
      throw new AnthropicError("handleItem: workId is required \u2014 pass it or set ANTHROPIC_WORK_ID");
    }
    if (!environmentId) {
      throw new AnthropicError("handleItem: environmentId is required \u2014 pass it or set ANTHROPIC_ENVIRONMENT_ID");
    }
    if (!sessionId) {
      throw new AnthropicError("handleItem: sessionId is required \u2014 pass it or set ANTHROPIC_SESSION_ID");
    }
    if (!environmentKey) {
      throw new AnthropicError("handleItem: environmentKey is required \u2014 pass it, construct the worker with it, or set ANTHROPIC_ENVIRONMENT_KEY");
    }
    const work = {
      id: workId,
      environment_id: environmentId,
      data: { type: "session", id: sessionId }
    };
    await __classPrivateFieldGet(this, _EnvironmentWorker_instances, "m", _EnvironmentWorker_handleItem).call(this, work, environmentKey, opts?.signal ?? __classPrivateFieldGet(this, _EnvironmentWorker_signal, "f"));
  }
};
_EnvironmentWorker_signal = /* @__PURE__ */ new WeakMap(), _EnvironmentWorker_instances = /* @__PURE__ */ new WeakSet(), _EnvironmentWorker_handleItem = /**
 * The per-item body shared by {@link EnvironmentWorker.run}'s poll loop and
 * {@link EnvironmentWorker.handleItem}: run a {@link SessionToolRunner} for the
 * work item's session while heartbeating its lease, force-stopping on exit.
 * Non-session work items are ignored.
 */
/* @__PURE__ */ __name(async function _EnvironmentWorker_handleItem2(work, environmentKey, externalSignal) {
  const log = loggerFor(this.client);
  const sessionClient = copyClientForHelper(this.client, {
    authToken: environmentKey,
    helper: "environments-worker"
  });
  const sessionId = work.data.id;
  const ctx = {
    workdir: this.workdir,
    client: this.client,
    sessionId,
    ...this.unrestrictedPaths !== void 0 ? { unrestrictedPaths: this.unrestrictedPaths } : {},
    ...this.maxFileBytes !== void 0 ? { maxFileBytes: this.maxFileBytes } : {}
  };
  const agentToolset = await Promise.resolve().then(() => (init_node_browser(), node_browser_exports));
  let cleanupSkills = /* @__PURE__ */ __name(async () => {
  }, "cleanupSkills");
  try {
    cleanupSkills = await agentToolset.setupSkills(ctx);
  } catch (e) {
    log.warn("skill setup failed", { session_id: sessionId, work_id: work.id, error: String(e) });
  }
  const tools = typeof this.tools === "function" ? this.tools(ctx) : this.tools ?? agentToolset.betaAgentToolset20260401(ctx);
  const ctrl = new AbortController();
  const detachExternal = linkAbort(externalSignal, ctrl);
  const heartbeatPromise = heartbeatLoop(sessionClient, work, ctrl, log, this.requestOptions).catch((e) => {
    if (!ctrl.signal.aborted)
      log.error("heartbeat loop failed", { work_id: work.id, error: String(e) });
    ctrl.abort();
  });
  try {
    const runner = new SessionToolRunner(sessionId, {
      client: sessionClient,
      tools,
      ...this.maxIdleMs !== void 0 ? { maxIdleMs: this.maxIdleMs } : {},
      ...this.requestOptions !== void 0 ? { requestOptions: this.requestOptions } : {},
      signal: ctrl.signal
    });
    for await (const _ of runner) {
    }
  } finally {
    ctrl.abort();
    detachExternal();
    await heartbeatPromise;
    await cleanupSkills().catch((e) => {
      log.warn("skill cleanup failed", { session_id: sessionId, work_id: work.id, error: String(e) });
    });
    await forceStop(sessionClient, work, log, this.requestOptions);
  }
}, "_EnvironmentWorker_handleItem");
async function forceStop(client, work, log, requestOptions) {
  try {
    await client.beta.environments.work.stop(
      work.id,
      { environment_id: work.environment_id, force: true },
      // Caller's headers pass through; the helper-tag header is on the scoped
      // sub-client's default_headers via copyClientForHelper, so no per-call
      // re-stamping needed.
      { ...requestOptions, headers: buildHeaders([requestOptions?.headers]) }
    );
  } catch (e) {
    if (!isStatus(e, 409)) {
      log.error("force-stop on exit failed", { work_id: work.id, error: String(e) });
    }
  }
}
__name(forceStop, "forceStop");
async function heartbeatLoop(client, work, ctrl, logger, requestOptions) {
  let intervalMs = HEARTBEAT_DEFAULT_MS;
  let last = NO_HEARTBEAT_SENTINEL;
  const beat = /* @__PURE__ */ __name(async () => {
    try {
      const resp = await client.beta.environments.work.heartbeat(work.id, { environment_id: work.environment_id, expected_last_heartbeat: last }, { ...requestOptions, headers: buildHeaders([requestOptions?.headers]), signal: ctrl.signal });
      last = resp.last_heartbeat;
      if (resp.ttl_seconds > 0) {
        intervalMs = Math.max(1e3, Math.min(resp.ttl_seconds * 1e3 / 2, HEARTBEAT_DEFAULT_MS));
      }
      if (resp.state === "stopping" || resp.state === "stopped") {
        logger.info("heartbeat signals shutdown", { work_id: work.id, state: resp.state });
        ctrl.abort();
      }
      if (!resp.lease_extended) {
        logger.warn("lease not extended, shutting down", { work_id: work.id });
        ctrl.abort();
      }
    } catch (e) {
      ctrl.signal.throwIfAborted();
      if (isFatal4xx(e)) {
        logger.error("permanent heartbeat failure", { work_id: work.id, error: String(e) });
        ctrl.abort();
        throw e;
      }
      logger.warn("transient heartbeat failure", { work_id: work.id, error: String(e) });
    }
  }, "beat");
  await beat();
  while (!ctrl.signal.aborted) {
    await sleep(intervalMs, ctrl.signal);
    ctrl.signal.throwIfAborted();
    await beat();
  }
}
__name(heartbeatLoop, "heartbeatLoop");

// node_modules/@anthropic-ai/sdk/resources/beta/environments/work.mjs
var Work = class extends APIResource {
  static {
    __name(this, "Work");
  }
  /**
   * Note: these endpoints are called automatically by the pre-built environment
   * worker provided in the SDKs and CLI, for orchestrating sessions with self-hosted
   * sandbox environments. They are included here as a reference; you do not need to
   * invoke them directly.
   *
   * Retrieve detailed information about a specific work item.
   *
   * @example
   * ```ts
   * const betaSelfHostedWork =
   *   await client.beta.environments.work.retrieve('work_id', {
   *     environment_id: 'env_011CZkZ9X2dpNyB7HsEFoRfW',
   *   });
   * ```
   */
  retrieve(workID, params, options) {
    const { environment_id, betas } = params;
    return this._client.get(path`/v1/environments/${environment_id}/work/${workID}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Note: these endpoints are called automatically by the pre-built environment
   * worker provided in the SDKs and CLI, for orchestrating sessions with self-hosted
   * sandbox environments. They are included here as a reference; you do not need to
   * invoke them directly.
   *
   * Update work item metadata with merge semantics.
   *
   * @example
   * ```ts
   * const betaSelfHostedWork =
   *   await client.beta.environments.work.update('work_id', {
   *     environment_id: 'env_011CZkZ9X2dpNyB7HsEFoRfW',
   *     metadata: { foo: 'string' },
   *   });
   * ```
   */
  update(workID, params, options) {
    const { environment_id, betas, ...body } = params;
    return this._client.post(path`/v1/environments/${environment_id}/work/${workID}?beta=true`, {
      body,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Note: these endpoints are called automatically by the pre-built environment
   * worker provided in the SDKs and CLI, for orchestrating sessions with self-hosted
   * sandbox environments. They are included here as a reference; you do not need to
   * invoke them directly.
   *
   * List work items in an environment.
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const betaSelfHostedWork of client.beta.environments.work.list(
   *   'env_011CZkZ9X2dpNyB7HsEFoRfW',
   * )) {
   *   // ...
   * }
   * ```
   */
  list(environmentID, params = {}, options) {
    const { betas, ...query } = params ?? {};
    return this._client.getAPIList(path`/v1/environments/${environmentID}/work?beta=true`, PageCursor, {
      query,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Note: these endpoints are called automatically by the pre-built environment
   * worker provided in the SDKs and CLI, for orchestrating sessions with self-hosted
   * sandbox environments. They are included here as a reference; you do not need to
   * invoke them directly.
   *
   * Acknowledge receipt of a work item, transitioning it from 'queued' to 'starting'
   * and removing it from the queue.
   *
   * @example
   * ```ts
   * const betaSelfHostedWork =
   *   await client.beta.environments.work.ack('work_id', {
   *     environment_id: 'env_011CZkZ9X2dpNyB7HsEFoRfW',
   *   });
   * ```
   */
  ack(workID, params, options) {
    const { environment_id, betas } = params;
    return this._client.post(path`/v1/environments/${environment_id}/work/${workID}/ack?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Note: these endpoints are called automatically by the pre-built environment
   * worker provided in the SDKs and CLI, for orchestrating sessions with self-hosted
   * sandbox environments. They are included here as a reference; you do not need to
   * invoke them directly.
   *
   * Record a heartbeat for a work item to maintain the lease.
   *
   * @example
   * ```ts
   * const betaSelfHostedWorkHeartbeatResponse =
   *   await client.beta.environments.work.heartbeat('work_id', {
   *     environment_id: 'env_011CZkZ9X2dpNyB7HsEFoRfW',
   *   });
   * ```
   */
  heartbeat(workID, params, options) {
    const { environment_id, desired_ttl_seconds, expected_last_heartbeat, betas } = params;
    return this._client.post(path`/v1/environments/${environment_id}/work/${workID}/heartbeat?beta=true`, {
      query: { desired_ttl_seconds, expected_last_heartbeat },
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Note: these endpoints are called automatically by the pre-built environment
   * worker provided in the SDKs and CLI, for orchestrating sessions with self-hosted
   * sandbox environments. They are included here as a reference; you do not need to
   * invoke them directly.
   *
   * Long poll for work items in the queue.
   *
   * @example
   * ```ts
   * const betaSelfHostedWork =
   *   await client.beta.environments.work.poll(
   *     'env_011CZkZ9X2dpNyB7HsEFoRfW',
   *   );
   * ```
   */
  poll(environmentID, params = {}, options) {
    const { betas, "Anthropic-Worker-ID": anthropicWorkerID, ...query } = params ?? {};
    return this._client.get(path`/v1/environments/${environmentID}/work/poll?beta=true`, {
      query,
      ...options,
      headers: buildHeaders([
        {
          "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString(),
          ...anthropicWorkerID != null ? { "Anthropic-Worker-ID": anthropicWorkerID } : void 0
        },
        options?.headers
      ])
    });
  }
  /**
   * Get statistics about the work queue for an environment.
   *
   * @example
   * ```ts
   * const betaSelfHostedWorkQueueStats =
   *   await client.beta.environments.work.stats(
   *     'env_011CZkZ9X2dpNyB7HsEFoRfW',
   *   );
   * ```
   */
  stats(environmentID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.get(path`/v1/environments/${environmentID}/work/stats?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Note: these endpoints are called automatically by the pre-built environment
   * worker provided in the SDKs and CLI, for orchestrating sessions with self-hosted
   * sandbox environments. They are included here as a reference; you do not need to
   * invoke them directly.
   *
   * Stop a work item, initiating graceful or forced shutdown.
   *
   * @example
   * ```ts
   * const betaSelfHostedWork =
   *   await client.beta.environments.work.stop('work_id', {
   *     environment_id: 'env_011CZkZ9X2dpNyB7HsEFoRfW',
   *   });
   * ```
   */
  stop(workID, params, options) {
    const { environment_id, betas, ...body } = params;
    return this._client.post(path`/v1/environments/${environment_id}/work/${workID}/stop?beta=true`, {
      body,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Continuously claim work from a self-hosted environment, ack each item,
   * and yield it. Posts `stop` automatically when the consumer's loop body
   * returns or when iteration ends.
   *
   * @example
   * ```ts
   * for await (const work of client.beta.environments.work.poller({
   *   environmentId,
   *   environmentKey,
   * })) {
   *   if (work.data.type !== 'session') continue;
   *   // ...service the work...
   * }
   * ```
   */
  poller(opts) {
    return new WorkPoller({ ...opts, client: this._client });
  }
  /**
   * The self-hosted environment runner: poll for work, and for each claimed
   * session set up the workdir, download the agent's skills, run the tools while
   * heartbeating the lease, and force-stop on exit.
   *
   * @example
   * ```ts
   * // Long-running daemon — poll, serve each session, loop:
   * await client.beta.environments.work
   *   .worker({ environmentId, environmentKey, workdir: '/workspace' })
   *   .run();
   *
   * // Or service one already-claimed work item (e.g. inside a sandbox spawned
   * // by `ant worker poll --on-work`) — handleItem() reads the ANTHROPIC_* env vars:
   * await client.beta.environments.work.worker({ workdir: '/workspace' }).handleItem();
   * ```
   */
  worker(opts) {
    return new EnvironmentWorker({ ...opts, client: this._client });
  }
};
Work.WorkPoller = WorkPoller;
Work.EnvironmentWorker = EnvironmentWorker;

// node_modules/@anthropic-ai/sdk/resources/beta/environments/environments.mjs
var Environments = class extends APIResource {
  static {
    __name(this, "Environments");
  }
  constructor() {
    super(...arguments);
    this.work = new Work(this._client);
  }
  /**
   * Create a new environment with the specified configuration.
   *
   * @example
   * ```ts
   * const betaEnvironment =
   *   await client.beta.environments.create({
   *     name: 'python-data-analysis',
   *   });
   * ```
   */
  create(params, options) {
    const { betas, ...body } = params;
    return this._client.post("/v1/environments?beta=true", {
      body,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Retrieve a specific environment by ID.
   *
   * @example
   * ```ts
   * const betaEnvironment =
   *   await client.beta.environments.retrieve(
   *     'env_011CZkZ9X2dpNyB7HsEFoRfW',
   *   );
   * ```
   */
  retrieve(environmentID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.get(path`/v1/environments/${environmentID}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Update an existing environment's configuration.
   *
   * @example
   * ```ts
   * const betaEnvironment =
   *   await client.beta.environments.update(
   *     'env_011CZkZ9X2dpNyB7HsEFoRfW',
   *   );
   * ```
   */
  update(environmentID, params, options) {
    const { betas, ...body } = params;
    return this._client.post(path`/v1/environments/${environmentID}?beta=true`, {
      body,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * List environments with pagination support.
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const betaEnvironment of client.beta.environments.list()) {
   *   // ...
   * }
   * ```
   */
  list(params = {}, options) {
    const { betas, ...query } = params ?? {};
    return this._client.getAPIList("/v1/environments?beta=true", PageCursor, {
      query,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Delete an environment by ID. Returns a confirmation of the deletion.
   *
   * @example
   * ```ts
   * const betaEnvironmentDeleteResponse =
   *   await client.beta.environments.delete(
   *     'env_011CZkZ9X2dpNyB7HsEFoRfW',
   *   );
   * ```
   */
  delete(environmentID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.delete(path`/v1/environments/${environmentID}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Archive an environment by ID. Archived environments cannot be used to create new
   * sessions.
   *
   * @example
   * ```ts
   * const betaEnvironment =
   *   await client.beta.environments.archive(
   *     'env_011CZkZ9X2dpNyB7HsEFoRfW',
   *   );
   * ```
   */
  archive(environmentID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.post(path`/v1/environments/${environmentID}/archive?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
};
Environments.Work = Work;

// node_modules/@anthropic-ai/sdk/resources/beta/memory-stores/memory-stores.mjs
init_modules_watch_stub();

// node_modules/@anthropic-ai/sdk/resources/beta/memory-stores/memories.mjs
init_modules_watch_stub();
var Memories = class extends APIResource {
  static {
    __name(this, "Memories");
  }
  /**
   * Create a memory
   *
   * @example
   * ```ts
   * const betaManagedAgentsMemory =
   *   await client.beta.memoryStores.memories.create(
   *     'memory_store_id',
   *     { content: 'content', path: 'xx' },
   *   );
   * ```
   */
  create(memoryStoreID, params, options) {
    const { view, betas, ...body } = params;
    return this._client.post(path`/v1/memory_stores/${memoryStoreID}/memories?beta=true`, {
      query: { view },
      body,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "agent-memory-2026-07-22"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Retrieve a memory
   *
   * @example
   * ```ts
   * const betaManagedAgentsMemory =
   *   await client.beta.memoryStores.memories.retrieve(
   *     'memory_id',
   *     { memory_store_id: 'memory_store_id' },
   *   );
   * ```
   */
  retrieve(memoryID, params, options) {
    const { memory_store_id, betas, ...query } = params;
    return this._client.get(path`/v1/memory_stores/${memory_store_id}/memories/${memoryID}?beta=true`, {
      query,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "agent-memory-2026-07-22"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Update a memory
   *
   * @example
   * ```ts
   * const betaManagedAgentsMemory =
   *   await client.beta.memoryStores.memories.update(
   *     'memory_id',
   *     { memory_store_id: 'memory_store_id' },
   *   );
   * ```
   */
  update(memoryID, params, options) {
    const { memory_store_id, view, betas, ...body } = params;
    return this._client.post(path`/v1/memory_stores/${memory_store_id}/memories/${memoryID}?beta=true`, {
      query: { view },
      body,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "agent-memory-2026-07-22"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * List memories
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const betaManagedAgentsMemoryListItem of client.beta.memoryStores.memories.list(
   *   'memory_store_id',
   * )) {
   *   // ...
   * }
   * ```
   */
  list(memoryStoreID, params = {}, options) {
    const { betas, ...query } = params ?? {};
    return this._client.getAPIList(path`/v1/memory_stores/${memoryStoreID}/memories?beta=true`, PageCursor, {
      query,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "agent-memory-2026-07-22"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Delete a memory
   *
   * @example
   * ```ts
   * const betaManagedAgentsDeletedMemory =
   *   await client.beta.memoryStores.memories.delete(
   *     'memory_id',
   *     { memory_store_id: 'memory_store_id' },
   *   );
   * ```
   */
  delete(memoryID, params, options) {
    const { memory_store_id, expected_content_sha256, betas } = params;
    return this._client.delete(path`/v1/memory_stores/${memory_store_id}/memories/${memoryID}?beta=true`, {
      query: { expected_content_sha256 },
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "agent-memory-2026-07-22"].toString() },
        options?.headers
      ])
    });
  }
};

// node_modules/@anthropic-ai/sdk/resources/beta/memory-stores/memory-versions.mjs
init_modules_watch_stub();
var MemoryVersions = class extends APIResource {
  static {
    __name(this, "MemoryVersions");
  }
  /**
   * Retrieve a memory version
   *
   * @example
   * ```ts
   * const betaManagedAgentsMemoryVersion =
   *   await client.beta.memoryStores.memoryVersions.retrieve(
   *     'memory_version_id',
   *     { memory_store_id: 'memory_store_id' },
   *   );
   * ```
   */
  retrieve(memoryVersionID, params, options) {
    const { memory_store_id, betas, ...query } = params;
    return this._client.get(path`/v1/memory_stores/${memory_store_id}/memory_versions/${memoryVersionID}?beta=true`, {
      query,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "agent-memory-2026-07-22"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * List memory versions
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const betaManagedAgentsMemoryVersion of client.beta.memoryStores.memoryVersions.list(
   *   'memory_store_id',
   * )) {
   *   // ...
   * }
   * ```
   */
  list(memoryStoreID, params = {}, options) {
    const { betas, ...query } = params ?? {};
    return this._client.getAPIList(path`/v1/memory_stores/${memoryStoreID}/memory_versions?beta=true`, PageCursor, {
      query,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "agent-memory-2026-07-22"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Redact a memory version
   *
   * @example
   * ```ts
   * const betaManagedAgentsMemoryVersion =
   *   await client.beta.memoryStores.memoryVersions.redact(
   *     'memory_version_id',
   *     { memory_store_id: 'memory_store_id' },
   *   );
   * ```
   */
  redact(memoryVersionID, params, options) {
    const { memory_store_id, betas } = params;
    return this._client.post(path`/v1/memory_stores/${memory_store_id}/memory_versions/${memoryVersionID}/redact?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "agent-memory-2026-07-22"].toString() },
        options?.headers
      ])
    });
  }
};

// node_modules/@anthropic-ai/sdk/resources/beta/memory-stores/memory-stores.mjs
var MemoryStores = class extends APIResource {
  static {
    __name(this, "MemoryStores");
  }
  constructor() {
    super(...arguments);
    this.memories = new Memories(this._client);
    this.memoryVersions = new MemoryVersions(this._client);
  }
  /**
   * Create a memory store
   *
   * @example
   * ```ts
   * const betaManagedAgentsMemoryStore =
   *   await client.beta.memoryStores.create({ name: 'x' });
   * ```
   */
  create(params, options) {
    const { betas, ...body } = params;
    return this._client.post("/v1/memory_stores?beta=true", {
      body,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "agent-memory-2026-07-22"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Retrieve a memory store
   *
   * @example
   * ```ts
   * const betaManagedAgentsMemoryStore =
   *   await client.beta.memoryStores.retrieve(
   *     'memory_store_id',
   *   );
   * ```
   */
  retrieve(memoryStoreID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.get(path`/v1/memory_stores/${memoryStoreID}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "agent-memory-2026-07-22"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Update a memory store
   *
   * @example
   * ```ts
   * const betaManagedAgentsMemoryStore =
   *   await client.beta.memoryStores.update('memory_store_id');
   * ```
   */
  update(memoryStoreID, params, options) {
    const { betas, ...body } = params;
    return this._client.post(path`/v1/memory_stores/${memoryStoreID}?beta=true`, {
      body,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "agent-memory-2026-07-22"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * List memory stores
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const betaManagedAgentsMemoryStore of client.beta.memoryStores.list()) {
   *   // ...
   * }
   * ```
   */
  list(params = {}, options) {
    const { betas, ...query } = params ?? {};
    return this._client.getAPIList("/v1/memory_stores?beta=true", PageCursor, {
      query,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "agent-memory-2026-07-22"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Delete a memory store
   *
   * @example
   * ```ts
   * const betaManagedAgentsDeletedMemoryStore =
   *   await client.beta.memoryStores.delete('memory_store_id');
   * ```
   */
  delete(memoryStoreID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.delete(path`/v1/memory_stores/${memoryStoreID}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "agent-memory-2026-07-22"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Archive a memory store
   *
   * @example
   * ```ts
   * const betaManagedAgentsMemoryStore =
   *   await client.beta.memoryStores.archive('memory_store_id');
   * ```
   */
  archive(memoryStoreID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.post(path`/v1/memory_stores/${memoryStoreID}/archive?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "agent-memory-2026-07-22"].toString() },
        options?.headers
      ])
    });
  }
};
MemoryStores.Memories = Memories;
MemoryStores.MemoryVersions = MemoryVersions;

// node_modules/@anthropic-ai/sdk/resources/beta/messages/messages.mjs
init_modules_watch_stub();

// node_modules/@anthropic-ai/sdk/error.mjs
init_modules_watch_stub();
init_error();

// node_modules/@anthropic-ai/sdk/resources/beta/messages/batches.mjs
init_modules_watch_stub();

// node_modules/@anthropic-ai/sdk/internal/decoders/jsonl.mjs
init_modules_watch_stub();
init_error();
var JSONLDecoder = class _JSONLDecoder {
  static {
    __name(this, "JSONLDecoder");
  }
  constructor(iterator, controller) {
    this.iterator = iterator;
    this.controller = controller;
  }
  async *decoder() {
    const lineDecoder = new LineDecoder();
    for await (const chunk of this.iterator) {
      for (const line of lineDecoder.decode(chunk)) {
        yield JSON.parse(line);
      }
    }
    for (const line of lineDecoder.flush()) {
      yield JSON.parse(line);
    }
  }
  [Symbol.asyncIterator]() {
    return this.decoder();
  }
  static fromResponse(response, controller) {
    if (!response.body) {
      controller.abort();
      if (typeof globalThis.navigator !== "undefined" && globalThis.navigator.product === "ReactNative") {
        throw new AnthropicError(`The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api`);
      }
      throw new AnthropicError(`Attempted to iterate over a response with no body`);
    }
    return new _JSONLDecoder(ReadableStreamToAsyncIterable(response.body), controller);
  }
};

// node_modules/@anthropic-ai/sdk/resources/beta/messages/batches.mjs
var Batches = class extends APIResource {
  static {
    __name(this, "Batches");
  }
  /**
   * Send a batch of Message creation requests.
   *
   * The Message Batches API can be used to process multiple Messages API requests at
   * once. Once a Message Batch is created, it begins processing immediately. Batches
   * can take up to 24 hours to complete.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://platform.claude.com/docs/en/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const betaMessageBatch =
   *   await client.beta.messages.batches.create({
   *     requests: [
   *       {
   *         custom_id: 'my-custom-id-1',
   *         params: {
   *           max_tokens: 1024,
   *           messages: [
   *             { content: 'Hello, world', role: 'user' },
   *           ],
   *           model: 'claude-opus-4-6',
   *         },
   *       },
   *     ],
   *   });
   * ```
   */
  create(params, options) {
    const { betas, user_profile_id, ...body } = params;
    return this._client.post("/v1/messages/batches?beta=true", {
      body,
      ...options,
      headers: buildHeaders([
        {
          "anthropic-beta": [...betas ?? [], "message-batches-2024-09-24"].toString(),
          ...user_profile_id != null ? { "anthropic-user-profile-id": user_profile_id } : void 0
        },
        options?.headers
      ])
    });
  }
  /**
   * This endpoint is idempotent and can be used to poll for Message Batch
   * completion. To access the results of a Message Batch, make a request to the
   * `results_url` field in the response.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://platform.claude.com/docs/en/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const betaMessageBatch =
   *   await client.beta.messages.batches.retrieve(
   *     'message_batch_id',
   *   );
   * ```
   */
  retrieve(messageBatchID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.get(path`/v1/messages/batches/${messageBatchID}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "message-batches-2024-09-24"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * List all Message Batches within a Workspace. Most recently created batches are
   * returned first.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://platform.claude.com/docs/en/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const betaMessageBatch of client.beta.messages.batches.list()) {
   *   // ...
   * }
   * ```
   */
  list(params = {}, options) {
    const { betas, ...query } = params ?? {};
    return this._client.getAPIList("/v1/messages/batches?beta=true", Page, {
      query,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "message-batches-2024-09-24"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Delete a Message Batch.
   *
   * Message Batches can only be deleted once they've finished processing. If you'd
   * like to delete an in-progress batch, you must first cancel it.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://platform.claude.com/docs/en/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const betaDeletedMessageBatch =
   *   await client.beta.messages.batches.delete(
   *     'message_batch_id',
   *   );
   * ```
   */
  delete(messageBatchID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.delete(path`/v1/messages/batches/${messageBatchID}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "message-batches-2024-09-24"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Batches may be canceled any time before processing ends. Once cancellation is
   * initiated, the batch enters a `canceling` state, at which time the system may
   * complete any in-progress, non-interruptible requests before finalizing
   * cancellation.
   *
   * The number of canceled requests is specified in `request_counts`. To determine
   * which requests were canceled, check the individual results within the batch.
   * Note that cancellation may not result in any canceled requests if they were
   * non-interruptible.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://platform.claude.com/docs/en/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const betaMessageBatch =
   *   await client.beta.messages.batches.cancel(
   *     'message_batch_id',
   *   );
   * ```
   */
  cancel(messageBatchID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.post(path`/v1/messages/batches/${messageBatchID}/cancel?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "message-batches-2024-09-24"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Streams the results of a Message Batch as a `.jsonl` file.
   *
   * Each line in the file is a JSON object containing the result of a single request
   * in the Message Batch. Results are not guaranteed to be in the same order as
   * requests. Use the `custom_id` field to match results to requests.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://platform.claude.com/docs/en/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const betaMessageBatchIndividualResponse =
   *   await client.beta.messages.batches.results(
   *     'message_batch_id',
   *   );
   * ```
   */
  async results(messageBatchID, params = {}, options) {
    const batch = await this.retrieve(messageBatchID);
    if (!batch.results_url) {
      throw new AnthropicError(`No batch \`results_url\`; Has it finished processing? ${batch.processing_status} - ${batch.id}`);
    }
    const { betas } = params ?? {};
    return this._client.get(batch.results_url, {
      ...options,
      headers: buildHeaders([
        {
          "anthropic-beta": [...betas ?? [], "message-batches-2024-09-24"].toString(),
          Accept: "application/binary"
        },
        options?.headers
      ]),
      stream: true,
      __binaryResponse: true
    })._thenUnwrap((_, props) => JSONLDecoder.fromResponse(props.response, props.controller));
  }
};

// node_modules/@anthropic-ai/sdk/internal/constants.mjs
init_modules_watch_stub();
var MODEL_NONSTREAMING_TOKENS = {
  "claude-opus-4@20250514": 8192,
  "anthropic.claude-opus-4-1-20250805-v1:0": 8192,
  "claude-opus-4-1@20250805": 8192
};

// node_modules/@anthropic-ai/sdk/lib/beta-parser.mjs
init_modules_watch_stub();
init_error();
function getOutputFormat(params) {
  return params?.output_format ?? params?.output_config?.format;
}
__name(getOutputFormat, "getOutputFormat");
function maybeParseBetaMessage(message, params, opts) {
  const outputFormat = getOutputFormat(params);
  if (!params || !("parse" in (outputFormat ?? {}))) {
    return {
      ...message,
      content: message.content.map((block) => {
        if (block.type === "text") {
          const parsedBlock = Object.defineProperty({ ...block }, "parsed_output", {
            value: null,
            enumerable: false
          });
          return Object.defineProperty(parsedBlock, "parsed", {
            get() {
              opts.logger.warn("The `parsed` property on `text` blocks is deprecated, please use `parsed_output` instead.");
              return null;
            },
            enumerable: false
          });
        }
        return block;
      }),
      parsed_output: null
    };
  }
  return parseBetaMessage(message, params, opts);
}
__name(maybeParseBetaMessage, "maybeParseBetaMessage");
function parseBetaMessage(message, params, opts) {
  let firstParsedOutput = null;
  const content = message.content.map((block) => {
    if (block.type === "text") {
      const parsedOutput = parseBetaOutputFormat(params, block.text);
      if (firstParsedOutput === null) {
        firstParsedOutput = parsedOutput;
      }
      const parsedBlock = Object.defineProperty({ ...block }, "parsed_output", {
        value: parsedOutput,
        enumerable: false
      });
      return Object.defineProperty(parsedBlock, "parsed", {
        get() {
          opts.logger.warn("The `parsed` property on `text` blocks is deprecated, please use `parsed_output` instead.");
          return parsedOutput;
        },
        enumerable: false
      });
    }
    return block;
  });
  return {
    ...message,
    content,
    parsed_output: firstParsedOutput
  };
}
__name(parseBetaMessage, "parseBetaMessage");
function parseBetaOutputFormat(params, content) {
  const outputFormat = getOutputFormat(params);
  if (outputFormat?.type !== "json_schema") {
    return null;
  }
  try {
    if ("parse" in outputFormat) {
      return outputFormat.parse(content);
    }
    return JSON.parse(content);
  } catch (error) {
    throw new AnthropicError(`Failed to parse structured output: ${error}`);
  }
}
__name(parseBetaOutputFormat, "parseBetaOutputFormat");

// node_modules/@anthropic-ai/sdk/lib/BetaMessageStream.mjs
init_modules_watch_stub();
init_errors();

// node_modules/@anthropic-ai/sdk/streaming.mjs
init_modules_watch_stub();

// node_modules/@anthropic-ai/sdk/internal/message-stream-utils.mjs
init_modules_watch_stub();

// node_modules/@anthropic-ai/sdk/_vendor/partial-json-parser/parser.mjs
init_modules_watch_stub();
var tokenize = /* @__PURE__ */ __name((input) => {
  let current = 0;
  let tokens2 = [];
  while (current < input.length) {
    let char = input[current];
    if (char === "\\") {
      current++;
      continue;
    }
    if (char === "{") {
      tokens2.push({
        type: "brace",
        value: "{"
      });
      current++;
      continue;
    }
    if (char === "}") {
      tokens2.push({
        type: "brace",
        value: "}"
      });
      current++;
      continue;
    }
    if (char === "[") {
      tokens2.push({
        type: "paren",
        value: "["
      });
      current++;
      continue;
    }
    if (char === "]") {
      tokens2.push({
        type: "paren",
        value: "]"
      });
      current++;
      continue;
    }
    if (char === ":") {
      tokens2.push({
        type: "separator",
        value: ":"
      });
      current++;
      continue;
    }
    if (char === ",") {
      tokens2.push({
        type: "delimiter",
        value: ","
      });
      current++;
      continue;
    }
    if (char === '"') {
      let value = "";
      let danglingQuote = false;
      char = input[++current];
      while (char !== '"') {
        if (current === input.length) {
          danglingQuote = true;
          break;
        }
        if (char === "\\") {
          current++;
          if (current === input.length) {
            danglingQuote = true;
            break;
          }
          value += char + input[current];
          char = input[++current];
        } else {
          value += char;
          char = input[++current];
        }
      }
      char = input[++current];
      if (!danglingQuote) {
        tokens2.push({
          type: "string",
          value
        });
      }
      continue;
    }
    let WHITESPACE = /\s/;
    if (char && WHITESPACE.test(char)) {
      current++;
      continue;
    }
    let NUMBERS = /[0-9]/;
    if (char && NUMBERS.test(char) || char === "-" || char === ".") {
      let value = "";
      if (char === "-") {
        value += char;
        char = input[++current];
      }
      while (char && (NUMBERS.test(char) || char === "." || // exponent marker, e.g. `1e10` or `1.5E-9`
      char === "e" || char === "E" || // exponent sign, only valid immediately after the exponent marker
      (char === "-" || char === "+") && (value[value.length - 1] === "e" || value[value.length - 1] === "E"))) {
        value += char;
        char = input[++current];
      }
      tokens2.push({
        type: "number",
        value
      });
      continue;
    }
    let LETTERS = /[a-z]/i;
    if (char && LETTERS.test(char)) {
      let value = "";
      while (char && LETTERS.test(char)) {
        if (current === input.length) {
          break;
        }
        value += char;
        char = input[++current];
      }
      if (value == "true" || value == "false" || value === "null") {
        tokens2.push({
          type: "name",
          value
        });
      } else {
        current++;
        continue;
      }
      continue;
    }
    current++;
  }
  return tokens2;
}, "tokenize");
var strip = /* @__PURE__ */ __name((tokens2) => {
  if (tokens2.length === 0) {
    return tokens2;
  }
  let lastToken = tokens2[tokens2.length - 1];
  switch (lastToken.type) {
    case "separator":
      tokens2 = tokens2.slice(0, tokens2.length - 1);
      return strip(tokens2);
      break;
    case "number":
      let lastCharacterOfLastToken = lastToken.value[lastToken.value.length - 1];
      if (lastCharacterOfLastToken === "." || lastCharacterOfLastToken === "-" || lastCharacterOfLastToken === "+" || lastCharacterOfLastToken === "e" || lastCharacterOfLastToken === "E") {
        tokens2 = tokens2.slice(0, tokens2.length - 1);
        return strip(tokens2);
      }
    case "string":
      let tokenBeforeTheLastToken = tokens2[tokens2.length - 2];
      if (tokenBeforeTheLastToken?.type === "delimiter") {
        tokens2 = tokens2.slice(0, tokens2.length - 1);
        return strip(tokens2);
      } else if (tokenBeforeTheLastToken?.type === "brace" && tokenBeforeTheLastToken.value === "{") {
        tokens2 = tokens2.slice(0, tokens2.length - 1);
        return strip(tokens2);
      }
      break;
    case "delimiter":
      tokens2 = tokens2.slice(0, tokens2.length - 1);
      return strip(tokens2);
      break;
  }
  return tokens2;
}, "strip");
var unstrip = /* @__PURE__ */ __name((tokens2) => {
  let tail = [];
  tokens2.map((token) => {
    if (token.type === "brace") {
      if (token.value === "{") {
        tail.push("}");
      } else {
        tail.splice(tail.lastIndexOf("}"), 1);
      }
    }
    if (token.type === "paren") {
      if (token.value === "[") {
        tail.push("]");
      } else {
        tail.splice(tail.lastIndexOf("]"), 1);
      }
    }
  });
  if (tail.length > 0) {
    tail.reverse().map((item) => {
      if (item === "}") {
        tokens2.push({
          type: "brace",
          value: "}"
        });
      } else if (item === "]") {
        tokens2.push({
          type: "paren",
          value: "]"
        });
      }
    });
  }
  return tokens2;
}, "unstrip");
var generate = /* @__PURE__ */ __name((tokens2) => {
  let output = "";
  tokens2.map((token) => {
    switch (token.type) {
      case "string":
        output += '"' + token.value + '"';
        break;
      default:
        output += token.value;
        break;
    }
  });
  return output;
}, "generate");
var partialParse = /* @__PURE__ */ __name((input) => JSON.parse(generate(unstrip(strip(tokenize(input))))), "partialParse");

// node_modules/@anthropic-ai/sdk/internal/message-stream-utils.mjs
var JSON_BUF_PROPERTY = "__json_buf";
function withLazyInput(prev, jsonBuf) {
  const next = {};
  for (const key of Object.keys(prev)) {
    if (key !== "input")
      next[key] = prev[key];
  }
  Object.defineProperty(next, JSON_BUF_PROPERTY, { value: jsonBuf, enumerable: false, writable: true });
  let input;
  let parsed = false;
  Object.defineProperty(next, "input", {
    enumerable: true,
    configurable: true,
    get() {
      if (!parsed) {
        input = jsonBuf ? partialParse(jsonBuf) : {};
        parsed = true;
      }
      return input;
    }
  });
  return next;
}
__name(withLazyInput, "withLazyInput");

// node_modules/@anthropic-ai/sdk/lib/BetaMessageStream.mjs
var _BetaMessageStream_instances;
var _BetaMessageStream_currentMessageSnapshot;
var _BetaMessageStream_params;
var _BetaMessageStream_connectedPromise;
var _BetaMessageStream_resolveConnectedPromise;
var _BetaMessageStream_rejectConnectedPromise;
var _BetaMessageStream_endPromise;
var _BetaMessageStream_resolveEndPromise;
var _BetaMessageStream_rejectEndPromise;
var _BetaMessageStream_listeners;
var _BetaMessageStream_ended;
var _BetaMessageStream_errored;
var _BetaMessageStream_aborted;
var _BetaMessageStream_catchingPromiseCreated;
var _BetaMessageStream_response;
var _BetaMessageStream_request_id;
var _BetaMessageStream_logger;
var _BetaMessageStream_getFinalMessage;
var _BetaMessageStream_getFinalText;
var _BetaMessageStream_handleError;
var _BetaMessageStream_beginRequest;
var _BetaMessageStream_addStreamEvent;
var _BetaMessageStream_endRequest;
var _BetaMessageStream_accumulateMessage;
var _BetaMessageStream_toolInputParseError;
function tracksToolInput(content) {
  return content.type === "tool_use" || content.type === "server_tool_use" || content.type === "mcp_tool_use";
}
__name(tracksToolInput, "tracksToolInput");
var BetaMessageStream = class _BetaMessageStream {
  static {
    __name(this, "BetaMessageStream");
  }
  constructor(params, opts) {
    _BetaMessageStream_instances.add(this);
    this.messages = [];
    this.receivedMessages = [];
    _BetaMessageStream_currentMessageSnapshot.set(this, void 0);
    _BetaMessageStream_params.set(this, null);
    this.controller = new AbortController();
    _BetaMessageStream_connectedPromise.set(this, void 0);
    _BetaMessageStream_resolveConnectedPromise.set(this, () => {
    });
    _BetaMessageStream_rejectConnectedPromise.set(this, () => {
    });
    _BetaMessageStream_endPromise.set(this, void 0);
    _BetaMessageStream_resolveEndPromise.set(this, () => {
    });
    _BetaMessageStream_rejectEndPromise.set(this, () => {
    });
    _BetaMessageStream_listeners.set(this, {});
    _BetaMessageStream_ended.set(this, false);
    _BetaMessageStream_errored.set(this, false);
    _BetaMessageStream_aborted.set(this, false);
    _BetaMessageStream_catchingPromiseCreated.set(this, false);
    _BetaMessageStream_response.set(this, void 0);
    _BetaMessageStream_request_id.set(this, void 0);
    _BetaMessageStream_logger.set(this, void 0);
    _BetaMessageStream_handleError.set(this, (error) => {
      __classPrivateFieldSet(this, _BetaMessageStream_errored, true, "f");
      if (isAbortError(error)) {
        error = new APIUserAbortError();
      }
      if (error instanceof APIUserAbortError) {
        __classPrivateFieldSet(this, _BetaMessageStream_aborted, true, "f");
        return this._emit("abort", error);
      }
      if (error instanceof AnthropicError) {
        return this._emit("error", error);
      }
      if (error instanceof Error) {
        const anthropicError = new AnthropicError(error.message);
        anthropicError.cause = error;
        return this._emit("error", anthropicError);
      }
      return this._emit("error", new AnthropicError(String(error)));
    });
    __classPrivateFieldSet(this, _BetaMessageStream_connectedPromise, new Promise((resolve, reject) => {
      __classPrivateFieldSet(this, _BetaMessageStream_resolveConnectedPromise, resolve, "f");
      __classPrivateFieldSet(this, _BetaMessageStream_rejectConnectedPromise, reject, "f");
    }), "f");
    __classPrivateFieldSet(this, _BetaMessageStream_endPromise, new Promise((resolve, reject) => {
      __classPrivateFieldSet(this, _BetaMessageStream_resolveEndPromise, resolve, "f");
      __classPrivateFieldSet(this, _BetaMessageStream_rejectEndPromise, reject, "f");
    }), "f");
    __classPrivateFieldGet(this, _BetaMessageStream_connectedPromise, "f").catch(() => {
    });
    __classPrivateFieldGet(this, _BetaMessageStream_endPromise, "f").catch(() => {
    });
    __classPrivateFieldSet(this, _BetaMessageStream_params, params, "f");
    __classPrivateFieldSet(this, _BetaMessageStream_logger, opts?.logger ?? console, "f");
  }
  get response() {
    return __classPrivateFieldGet(this, _BetaMessageStream_response, "f");
  }
  get request_id() {
    return __classPrivateFieldGet(this, _BetaMessageStream_request_id, "f");
  }
  /**
   * Returns the `MessageStream` data, the raw `Response` instance and the ID of the request,
   * returned vie the `request-id` header which is useful for debugging requests and resporting
   * issues to Anthropic.
   *
   * This is the same as the `APIPromise.withResponse()` method.
   *
   * This method will raise an error if you created the stream using `MessageStream.fromReadableStream`
   * as no `Response` is available.
   */
  async withResponse() {
    __classPrivateFieldSet(this, _BetaMessageStream_catchingPromiseCreated, true, "f");
    const response = await __classPrivateFieldGet(this, _BetaMessageStream_connectedPromise, "f");
    if (!response) {
      throw new Error("Could not resolve a `Response` object");
    }
    return {
      data: this,
      response,
      request_id: response.headers.get("request-id")
    };
  }
  /**
   * Intended for use on the frontend, consuming a stream produced with
   * `.toReadableStream()` on the backend.
   *
   * Note that messages sent to the model do not appear in `.on('message')`
   * in this context.
   */
  static fromReadableStream(stream) {
    const runner = new _BetaMessageStream(null);
    runner._run(() => runner._fromReadableStream(stream));
    return runner;
  }
  static createMessage(messages, params, options, { logger } = {}) {
    const runner = new _BetaMessageStream(params, { logger });
    for (const message of params.messages) {
      runner._addMessageParam(message);
    }
    __classPrivateFieldSet(runner, _BetaMessageStream_params, { ...params, stream: true }, "f");
    runner._run(() => runner._createMessage(messages, { ...params, stream: true }, { ...options, headers: { ...options?.headers, [STAINLESS_HELPER_METHOD_HEADER]: "stream" } }));
    return runner;
  }
  _run(executor) {
    executor().then(() => {
      this._emitFinal();
      this._emit("end");
    }, __classPrivateFieldGet(this, _BetaMessageStream_handleError, "f"));
  }
  _addMessageParam(message) {
    this.messages.push(message);
  }
  _addMessage(message, emit = true) {
    this.receivedMessages.push(message);
    if (emit) {
      this._emit("message", message);
    }
  }
  async _createMessage(messages, params, options) {
    const signal = options?.signal;
    let abortHandler;
    if (signal) {
      if (signal.aborted)
        this.controller.abort();
      abortHandler = this.controller.abort.bind(this.controller);
      signal.addEventListener("abort", abortHandler);
    }
    try {
      __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_beginRequest).call(this);
      const { response, data: stream } = await messages.create({ ...params, stream: true }, { ...options, signal: this.controller.signal }).withResponse();
      this._connected(response);
      for await (const event of stream) {
        __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_addStreamEvent).call(this, event);
      }
      if (stream.controller.signal?.aborted) {
        throw new APIUserAbortError();
      }
      __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_endRequest).call(this);
    } finally {
      if (signal && abortHandler) {
        signal.removeEventListener("abort", abortHandler);
      }
    }
  }
  _connected(response) {
    if (this.ended)
      return;
    __classPrivateFieldSet(this, _BetaMessageStream_response, response, "f");
    __classPrivateFieldSet(this, _BetaMessageStream_request_id, response?.headers.get("request-id"), "f");
    __classPrivateFieldGet(this, _BetaMessageStream_resolveConnectedPromise, "f").call(this, response);
    this._emit("connect");
  }
  get ended() {
    return __classPrivateFieldGet(this, _BetaMessageStream_ended, "f");
  }
  get errored() {
    return __classPrivateFieldGet(this, _BetaMessageStream_errored, "f");
  }
  get aborted() {
    return __classPrivateFieldGet(this, _BetaMessageStream_aborted, "f");
  }
  abort() {
    this.controller.abort();
  }
  /**
   * Adds the listener function to the end of the listeners array for the event.
   * No checks are made to see if the listener has already been added. Multiple calls passing
   * the same combination of event and listener will result in the listener being added, and
   * called, multiple times.
   * @returns this MessageStream, so that calls can be chained
   */
  on(event, listener) {
    const listeners = __classPrivateFieldGet(this, _BetaMessageStream_listeners, "f")[event] || (__classPrivateFieldGet(this, _BetaMessageStream_listeners, "f")[event] = []);
    listeners.push({ listener });
    return this;
  }
  /**
   * Removes the specified listener from the listener array for the event.
   * off() will remove, at most, one instance of a listener from the listener array. If any single
   * listener has been added multiple times to the listener array for the specified event, then
   * off() must be called multiple times to remove each instance.
   * @returns this MessageStream, so that calls can be chained
   */
  off(event, listener) {
    const listeners = __classPrivateFieldGet(this, _BetaMessageStream_listeners, "f")[event];
    if (!listeners)
      return this;
    const index = listeners.findIndex((l) => l.listener === listener);
    if (index >= 0)
      listeners.splice(index, 1);
    return this;
  }
  /**
   * Adds a one-time listener function for the event. The next time the event is triggered,
   * this listener is removed and then invoked.
   * @returns this MessageStream, so that calls can be chained
   */
  once(event, listener) {
    const listeners = __classPrivateFieldGet(this, _BetaMessageStream_listeners, "f")[event] || (__classPrivateFieldGet(this, _BetaMessageStream_listeners, "f")[event] = []);
    listeners.push({ listener, once: true });
    return this;
  }
  /**
   * This is similar to `.once()`, but returns a Promise that resolves the next time
   * the event is triggered, instead of calling a listener callback.
   * @returns a Promise that resolves the next time given event is triggered,
   * or rejects if an error is emitted.  (If you request the 'error' event,
   * returns a promise that resolves with the error).
   *
   * Example:
   *
   *   const message = await stream.emitted('message') // rejects if the stream errors
   */
  emitted(event) {
    return new Promise((resolve, reject) => {
      __classPrivateFieldSet(this, _BetaMessageStream_catchingPromiseCreated, true, "f");
      if (event !== "error")
        this.once("error", reject);
      this.once(event, resolve);
    });
  }
  async done() {
    __classPrivateFieldSet(this, _BetaMessageStream_catchingPromiseCreated, true, "f");
    await __classPrivateFieldGet(this, _BetaMessageStream_endPromise, "f");
  }
  get currentMessage() {
    return __classPrivateFieldGet(this, _BetaMessageStream_currentMessageSnapshot, "f");
  }
  /**
   * @returns a promise that resolves with the the final assistant Message response,
   * or rejects if an error occurred or the stream ended prematurely without producing a Message.
   * If structured outputs were used, this will be a ParsedMessage with a `parsed` field.
   */
  async finalMessage() {
    await this.done();
    return __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_getFinalMessage).call(this);
  }
  /**
   * @returns a promise that resolves with the the final assistant Message's text response, concatenated
   * together if there are more than one text blocks.
   * Rejects if an error occurred or the stream ended prematurely without producing a Message.
   */
  async finalText() {
    await this.done();
    return __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_getFinalText).call(this);
  }
  _emit(event, ...args) {
    if (__classPrivateFieldGet(this, _BetaMessageStream_ended, "f"))
      return;
    if (event === "end") {
      __classPrivateFieldSet(this, _BetaMessageStream_ended, true, "f");
      __classPrivateFieldGet(this, _BetaMessageStream_resolveEndPromise, "f").call(this);
    }
    const listeners = __classPrivateFieldGet(this, _BetaMessageStream_listeners, "f")[event];
    if (listeners) {
      __classPrivateFieldGet(this, _BetaMessageStream_listeners, "f")[event] = listeners.filter((l) => !l.once);
      listeners.forEach(({ listener }) => listener(...args));
    }
    if (event === "abort") {
      const error = args[0];
      if (!__classPrivateFieldGet(this, _BetaMessageStream_catchingPromiseCreated, "f") && !listeners?.length) {
        Promise.reject(error);
      }
      __classPrivateFieldGet(this, _BetaMessageStream_rejectConnectedPromise, "f").call(this, error);
      __classPrivateFieldGet(this, _BetaMessageStream_rejectEndPromise, "f").call(this, error);
      this._emit("end");
      return;
    }
    if (event === "error") {
      const error = args[0];
      if (!__classPrivateFieldGet(this, _BetaMessageStream_catchingPromiseCreated, "f") && !listeners?.length) {
        Promise.reject(error);
      }
      __classPrivateFieldGet(this, _BetaMessageStream_rejectConnectedPromise, "f").call(this, error);
      __classPrivateFieldGet(this, _BetaMessageStream_rejectEndPromise, "f").call(this, error);
      this._emit("end");
    }
  }
  _emitFinal() {
    const finalMessage = this.receivedMessages.at(-1);
    if (finalMessage) {
      this._emit("finalMessage", __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_getFinalMessage).call(this));
    }
  }
  async _fromReadableStream(readableStream, options) {
    const signal = options?.signal;
    let abortHandler;
    if (signal) {
      if (signal.aborted)
        this.controller.abort();
      abortHandler = this.controller.abort.bind(this.controller);
      signal.addEventListener("abort", abortHandler);
    }
    try {
      __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_beginRequest).call(this);
      this._connected(null);
      const stream = Stream.fromReadableStream(readableStream, this.controller);
      for await (const event of stream) {
        __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_addStreamEvent).call(this, event);
      }
      if (stream.controller.signal?.aborted) {
        throw new APIUserAbortError();
      }
      __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_endRequest).call(this);
    } finally {
      if (signal && abortHandler) {
        signal.removeEventListener("abort", abortHandler);
      }
    }
  }
  [(_BetaMessageStream_currentMessageSnapshot = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_params = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_connectedPromise = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_resolveConnectedPromise = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_rejectConnectedPromise = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_endPromise = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_resolveEndPromise = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_rejectEndPromise = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_listeners = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_ended = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_errored = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_aborted = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_catchingPromiseCreated = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_response = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_request_id = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_logger = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_handleError = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_instances = /* @__PURE__ */ new WeakSet(), _BetaMessageStream_getFinalMessage = /* @__PURE__ */ __name(function _BetaMessageStream_getFinalMessage2() {
    if (this.receivedMessages.length === 0) {
      throw new AnthropicError("stream ended without producing a Message with role=assistant");
    }
    return this.receivedMessages.at(-1);
  }, "_BetaMessageStream_getFinalMessage"), _BetaMessageStream_getFinalText = /* @__PURE__ */ __name(function _BetaMessageStream_getFinalText2() {
    if (this.receivedMessages.length === 0) {
      throw new AnthropicError("stream ended without producing a Message with role=assistant");
    }
    const textBlocks = this.receivedMessages.at(-1).content.filter((block) => block.type === "text").map((block) => block.text);
    if (textBlocks.length === 0) {
      throw new AnthropicError("stream ended without producing a content block with type=text");
    }
    return textBlocks.join(" ");
  }, "_BetaMessageStream_getFinalText"), _BetaMessageStream_beginRequest = /* @__PURE__ */ __name(function _BetaMessageStream_beginRequest2() {
    if (this.ended)
      return;
    __classPrivateFieldSet(this, _BetaMessageStream_currentMessageSnapshot, void 0, "f");
  }, "_BetaMessageStream_beginRequest"), _BetaMessageStream_addStreamEvent = /* @__PURE__ */ __name(function _BetaMessageStream_addStreamEvent2(event) {
    if (this.ended)
      return;
    const messageSnapshot = __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_accumulateMessage).call(this, event);
    this._emit("streamEvent", event, messageSnapshot);
    switch (event.type) {
      case "content_block_delta": {
        const content = messageSnapshot.content.at(-1);
        switch (event.delta.type) {
          case "text_delta": {
            if (content.type === "text") {
              this._emit("text", event.delta.text, content.text || "");
            }
            break;
          }
          case "citations_delta": {
            if (content.type === "text") {
              this._emit("citation", event.delta.citation, content.citations ?? []);
            }
            break;
          }
          case "input_json_delta": {
            if (tracksToolInput(content) && __classPrivateFieldGet(this, _BetaMessageStream_listeners, "f").inputJson?.length) {
              let jsonSnapshot;
              try {
                jsonSnapshot = content.input;
              } catch (err) {
                __classPrivateFieldGet(this, _BetaMessageStream_handleError, "f").call(this, __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_toolInputParseError).call(this, content, err));
                break;
              }
              this._emit("inputJson", event.delta.partial_json, jsonSnapshot);
            }
            break;
          }
          case "thinking_delta": {
            if (content.type === "thinking") {
              this._emit("thinking", event.delta.thinking, content.thinking);
            }
            break;
          }
          case "signature_delta": {
            if (content.type === "thinking") {
              this._emit("signature", content.signature);
            }
            break;
          }
          case "compaction_delta": {
            if (content.type === "compaction" && content.content) {
              this._emit("compaction", content.content);
            }
            break;
          }
          default:
            checkNever(event.delta);
        }
        break;
      }
      case "message_stop": {
        this._addMessageParam(messageSnapshot);
        this._addMessage(maybeParseBetaMessage(messageSnapshot, __classPrivateFieldGet(this, _BetaMessageStream_params, "f"), { logger: __classPrivateFieldGet(this, _BetaMessageStream_logger, "f") }), true);
        break;
      }
      case "content_block_stop": {
        this._emit("contentBlock", messageSnapshot.content.at(-1));
        break;
      }
      case "message_start": {
        __classPrivateFieldSet(this, _BetaMessageStream_currentMessageSnapshot, messageSnapshot, "f");
        break;
      }
      case "content_block_start":
      case "message_delta":
        break;
    }
  }, "_BetaMessageStream_addStreamEvent"), _BetaMessageStream_endRequest = /* @__PURE__ */ __name(function _BetaMessageStream_endRequest2() {
    if (this.ended) {
      throw new AnthropicError(`stream has ended, this shouldn't happen`);
    }
    const snapshot = __classPrivateFieldGet(this, _BetaMessageStream_currentMessageSnapshot, "f");
    if (!snapshot) {
      throw new AnthropicError(`request ended without sending any chunks`);
    }
    __classPrivateFieldSet(this, _BetaMessageStream_currentMessageSnapshot, void 0, "f");
    return maybeParseBetaMessage(snapshot, __classPrivateFieldGet(this, _BetaMessageStream_params, "f"), { logger: __classPrivateFieldGet(this, _BetaMessageStream_logger, "f") });
  }, "_BetaMessageStream_endRequest"), _BetaMessageStream_accumulateMessage = /* @__PURE__ */ __name(function _BetaMessageStream_accumulateMessage2(event) {
    let snapshot = __classPrivateFieldGet(this, _BetaMessageStream_currentMessageSnapshot, "f");
    if (event.type === "message_start") {
      if (snapshot) {
        throw new AnthropicError(`Unexpected event order, got ${event.type} before receiving "message_stop"`);
      }
      return event.message;
    }
    if (!snapshot) {
      throw new AnthropicError(`Unexpected event order, got ${event.type} before "message_start"`);
    }
    switch (event.type) {
      case "message_stop":
        return snapshot;
      case "message_delta":
        snapshot.container = event.delta.container;
        snapshot.stop_reason = event.delta.stop_reason;
        snapshot.stop_sequence = event.delta.stop_sequence;
        if (event.delta.stop_details != null) {
          snapshot.stop_details = event.delta.stop_details;
        }
        snapshot.usage.output_tokens = event.usage.output_tokens;
        snapshot.context_management = event.context_management;
        if (event.usage.input_tokens != null) {
          snapshot.usage.input_tokens = event.usage.input_tokens;
        }
        if (event.usage.cache_creation_input_tokens != null) {
          snapshot.usage.cache_creation_input_tokens = event.usage.cache_creation_input_tokens;
        }
        if (event.usage.cache_read_input_tokens != null) {
          snapshot.usage.cache_read_input_tokens = event.usage.cache_read_input_tokens;
        }
        if (event.usage.server_tool_use != null) {
          snapshot.usage.server_tool_use = event.usage.server_tool_use;
        }
        if (event.usage.iterations != null) {
          snapshot.usage.iterations = event.usage.iterations;
        }
        if (event.usage.fallback_credit != null) {
          snapshot.usage.fallback_credit = event.usage.fallback_credit;
        }
        return snapshot;
      case "content_block_start":
        snapshot.content.push(event.content_block);
        if (event.content_block.type === "fallback") {
          snapshot.model = event.content_block.to.model;
        }
        return snapshot;
      case "content_block_delta": {
        const snapshotContent = snapshot.content.at(event.index);
        switch (event.delta.type) {
          case "text_delta": {
            if (snapshotContent?.type === "text") {
              snapshot.content[event.index] = {
                ...snapshotContent,
                text: (snapshotContent.text || "") + event.delta.text
              };
            }
            break;
          }
          case "citations_delta": {
            if (snapshotContent?.type === "text") {
              snapshot.content[event.index] = {
                ...snapshotContent,
                citations: [...snapshotContent.citations ?? [], event.delta.citation]
              };
            }
            break;
          }
          case "input_json_delta": {
            if (snapshotContent && tracksToolInput(snapshotContent)) {
              const jsonBuf = (snapshotContent[JSON_BUF_PROPERTY] || "") + event.delta.partial_json;
              snapshot.content[event.index] = withLazyInput(snapshotContent, jsonBuf);
            }
            break;
          }
          case "thinking_delta": {
            if (snapshotContent?.type === "thinking") {
              snapshot.content[event.index] = {
                ...snapshotContent,
                thinking: snapshotContent.thinking + event.delta.thinking
              };
            }
            break;
          }
          case "signature_delta": {
            if (snapshotContent?.type === "thinking") {
              snapshot.content[event.index] = {
                ...snapshotContent,
                signature: event.delta.signature
              };
            }
            break;
          }
          case "compaction_delta": {
            if (snapshotContent?.type === "compaction") {
              snapshot.content[event.index] = {
                ...snapshotContent,
                content: (snapshotContent.content || "") + event.delta.content,
                encrypted_content: event.delta.encrypted_content
              };
            }
            break;
          }
          default:
            checkNever(event.delta);
        }
        return snapshot;
      }
      case "content_block_stop": {
        const snapshotContent = snapshot.content.at(event.index);
        if (snapshotContent && tracksToolInput(snapshotContent) && JSON_BUF_PROPERTY in snapshotContent) {
          let input;
          try {
            input = snapshotContent.input;
          } catch (err) {
            input = {};
            __classPrivateFieldGet(this, _BetaMessageStream_handleError, "f").call(this, __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_toolInputParseError).call(this, snapshotContent, err));
          }
          Object.defineProperty(snapshotContent, "input", {
            value: input,
            enumerable: true,
            configurable: true,
            writable: true
          });
        }
        return snapshot;
      }
    }
  }, "_BetaMessageStream_accumulateMessage"), _BetaMessageStream_toolInputParseError = /* @__PURE__ */ __name(function _BetaMessageStream_toolInputParseError2(block, err) {
    const jsonBuf = block[JSON_BUF_PROPERTY];
    return new AnthropicError(`Unable to parse tool parameter JSON from model. Please retry your request or adjust your prompt. Error: ${err}. JSON: ${jsonBuf}`);
  }, "_BetaMessageStream_toolInputParseError"), Symbol.asyncIterator)]() {
    const pushQueue = [];
    const readQueue = [];
    let done = false;
    this.on("streamEvent", (event) => {
      const reader = readQueue.shift();
      if (reader) {
        reader.resolve(event);
      } else {
        pushQueue.push(event);
      }
    });
    this.on("end", () => {
      done = true;
      for (const reader of readQueue) {
        reader.resolve(void 0);
      }
      readQueue.length = 0;
    });
    this.on("abort", (err) => {
      done = true;
      for (const reader of readQueue) {
        reader.reject(err);
      }
      readQueue.length = 0;
    });
    this.on("error", (err) => {
      done = true;
      for (const reader of readQueue) {
        reader.reject(err);
      }
      readQueue.length = 0;
    });
    return {
      next: /* @__PURE__ */ __name(async () => {
        if (!pushQueue.length) {
          if (done) {
            return { value: void 0, done: true };
          }
          return new Promise((resolve, reject) => readQueue.push({ resolve, reject })).then((chunk2) => chunk2 ? { value: chunk2, done: false } : { value: void 0, done: true });
        }
        const chunk = pushQueue.shift();
        return { value: chunk, done: false };
      }, "next"),
      return: /* @__PURE__ */ __name(async () => {
        this.abort();
        return { value: void 0, done: true };
      }, "return")
    };
  }
  toReadableStream() {
    const stream = new Stream(this[Symbol.asyncIterator].bind(this), this.controller);
    return stream.toReadableStream();
  }
};
function checkNever(x) {
}
__name(checkNever, "checkNever");

// node_modules/@anthropic-ai/sdk/lib/tools/BetaToolRunner.mjs
init_modules_watch_stub();
init_error();

// node_modules/@anthropic-ai/sdk/internal/utils/promise.mjs
init_modules_watch_stub();
function promiseWithResolvers() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}
__name(promiseWithResolvers, "promiseWithResolvers");

// node_modules/@anthropic-ai/sdk/lib/tools/CompactionControl.mjs
init_modules_watch_stub();
var DEFAULT_TOKEN_THRESHOLD = 1e5;
var DEFAULT_SUMMARY_PROMPT = `You have been working on the task described above but have not yet completed it. Write a continuation summary that will allow you (or another instance of yourself) to resume work efficiently in a future context window where the conversation history will be replaced with this summary. Your summary should be structured, concise, and actionable. Include:
1. Task Overview
The user's core request and success criteria
Any clarifications or constraints they specified
2. Current State
What has been completed so far
Files created, modified, or analyzed (with paths if relevant)
Key outputs or artifacts produced
3. Important Discoveries
Technical constraints or requirements uncovered
Decisions made and their rationale
Errors encountered and how they were resolved
What approaches were tried that didn't work (and why)
4. Next Steps
Specific actions needed to complete the task
Any blockers or open questions to resolve
Priority order if multiple steps remain
5. Context to Preserve
User preferences or style requirements
Domain-specific details that aren't obvious
Any promises made to the user
Be concise but complete\u2014err on the side of including information that would prevent duplicate work or repeated mistakes. Write in a way that enables immediate resumption of the task.
Wrap your summary in <summary></summary> tags.`;

// node_modules/@anthropic-ai/sdk/lib/tools/BetaToolRunner.mjs
var _BetaToolRunner_instances;
var _BetaToolRunner_consumed;
var _BetaToolRunner_mutated;
var _BetaToolRunner_state;
var _BetaToolRunner_options;
var _BetaToolRunner_message;
var _BetaToolRunner_toolResponse;
var _BetaToolRunner_completion;
var _BetaToolRunner_iterationCount;
var _BetaToolRunner_checkAndCompact;
var _BetaToolRunner_generateToolResponse;
var BetaToolRunner = class {
  static {
    __name(this, "BetaToolRunner");
  }
  constructor(client, params, options) {
    _BetaToolRunner_instances.add(this);
    this.client = client;
    _BetaToolRunner_consumed.set(this, false);
    _BetaToolRunner_mutated.set(this, false);
    _BetaToolRunner_state.set(this, void 0);
    _BetaToolRunner_options.set(this, void 0);
    _BetaToolRunner_message.set(this, void 0);
    _BetaToolRunner_toolResponse.set(this, void 0);
    _BetaToolRunner_completion.set(this, void 0);
    _BetaToolRunner_iterationCount.set(this, 0);
    __classPrivateFieldSet(this, _BetaToolRunner_state, {
      params: {
        // You can't clone the entire params since there are functions as handlers.
        // You also don't really need to clone params.messages, but it probably will prevent a foot gun
        // somewhere.
        ...params,
        messages: structuredClone(params.messages)
      }
    }, "f");
    const collected = collectStainlessHelpers(params.tools, params.messages);
    __classPrivateFieldSet(this, _BetaToolRunner_options, {
      ...options,
      headers: buildHeaders([
        helperHeader("BetaToolRunner"),
        collected.length ? { [STAINLESS_HELPER_HEADER]: collected.join(", ") } : void 0,
        options?.headers
      ])
    }, "f");
    __classPrivateFieldSet(this, _BetaToolRunner_completion, promiseWithResolvers(), "f");
    if (params.compactionControl?.enabled) {
      console.warn('Anthropic: The `compactionControl` parameter is deprecated and will be removed in a future version. Use server-side compaction instead by passing `edits: [{ type: "compact_20260112" }]` in the params passed to `toolRunner()`. See https://platform.claude.com/docs/en/build-with-claude/compaction');
    }
  }
  async *[(_BetaToolRunner_consumed = /* @__PURE__ */ new WeakMap(), _BetaToolRunner_mutated = /* @__PURE__ */ new WeakMap(), _BetaToolRunner_state = /* @__PURE__ */ new WeakMap(), _BetaToolRunner_options = /* @__PURE__ */ new WeakMap(), _BetaToolRunner_message = /* @__PURE__ */ new WeakMap(), _BetaToolRunner_toolResponse = /* @__PURE__ */ new WeakMap(), _BetaToolRunner_completion = /* @__PURE__ */ new WeakMap(), _BetaToolRunner_iterationCount = /* @__PURE__ */ new WeakMap(), _BetaToolRunner_instances = /* @__PURE__ */ new WeakSet(), _BetaToolRunner_checkAndCompact = /* @__PURE__ */ __name(async function _BetaToolRunner_checkAndCompact2() {
    const compactionControl = __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params.compactionControl;
    if (!compactionControl || !compactionControl.enabled) {
      return false;
    }
    let tokensUsed = 0;
    if (__classPrivateFieldGet(this, _BetaToolRunner_message, "f") !== void 0) {
      try {
        const message = await __classPrivateFieldGet(this, _BetaToolRunner_message, "f");
        const totalInputTokens = message.usage.input_tokens + (message.usage.cache_creation_input_tokens ?? 0) + (message.usage.cache_read_input_tokens ?? 0);
        tokensUsed = totalInputTokens + message.usage.output_tokens;
      } catch {
        return false;
      }
    }
    const threshold = compactionControl.contextTokenThreshold ?? DEFAULT_TOKEN_THRESHOLD;
    if (tokensUsed < threshold) {
      return false;
    }
    const model = compactionControl.model ?? __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params.model;
    const summaryPrompt = compactionControl.summaryPrompt ?? DEFAULT_SUMMARY_PROMPT;
    const messages = __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params.messages;
    if (messages[messages.length - 1].role === "assistant") {
      const lastMessage = messages[messages.length - 1];
      if (Array.isArray(lastMessage.content)) {
        const nonToolBlocks = lastMessage.content.filter((block) => block.type !== "tool_use");
        if (nonToolBlocks.length === 0) {
          messages.pop();
        } else {
          lastMessage.content = nonToolBlocks;
        }
      }
    }
    const response = await this.client.beta.messages.create({
      model,
      messages: [
        ...messages,
        {
          role: "user",
          content: [
            {
              type: "text",
              text: summaryPrompt
            }
          ]
        }
      ],
      max_tokens: __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params.max_tokens
    }, {
      signal: __classPrivateFieldGet(this, _BetaToolRunner_options, "f").signal,
      headers: buildHeaders([__classPrivateFieldGet(this, _BetaToolRunner_options, "f").headers, helperHeader("compaction")])
    });
    if (response.content[0]?.type !== "text") {
      throw new AnthropicError("Expected text response for compaction");
    }
    __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params.messages = [
      {
        role: "user",
        content: response.content
      }
    ];
    return true;
  }, "_BetaToolRunner_checkAndCompact"), Symbol.asyncIterator)]() {
    var _a2;
    if (__classPrivateFieldGet(this, _BetaToolRunner_consumed, "f")) {
      throw new AnthropicError("Cannot iterate over a consumed stream");
    }
    __classPrivateFieldSet(this, _BetaToolRunner_consumed, true, "f");
    __classPrivateFieldSet(this, _BetaToolRunner_mutated, true, "f");
    __classPrivateFieldSet(this, _BetaToolRunner_toolResponse, void 0, "f");
    try {
      while (true) {
        let stream;
        try {
          if (__classPrivateFieldGet(this, _BetaToolRunner_state, "f").params.max_iterations && __classPrivateFieldGet(this, _BetaToolRunner_iterationCount, "f") >= __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params.max_iterations) {
            break;
          }
          __classPrivateFieldSet(this, _BetaToolRunner_mutated, false, "f");
          __classPrivateFieldSet(this, _BetaToolRunner_toolResponse, void 0, "f");
          __classPrivateFieldSet(this, _BetaToolRunner_iterationCount, (_a2 = __classPrivateFieldGet(this, _BetaToolRunner_iterationCount, "f"), _a2++, _a2), "f");
          __classPrivateFieldSet(this, _BetaToolRunner_message, void 0, "f");
          const { max_iterations, compactionControl, ...params } = __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params;
          if (params.stream) {
            stream = this.client.beta.messages.stream({ ...params }, __classPrivateFieldGet(this, _BetaToolRunner_options, "f"));
            __classPrivateFieldSet(this, _BetaToolRunner_message, stream.finalMessage(), "f");
            __classPrivateFieldGet(this, _BetaToolRunner_message, "f").catch(() => {
            });
            yield stream;
          } else {
            __classPrivateFieldSet(this, _BetaToolRunner_message, this.client.beta.messages.create({ ...params, stream: false }, __classPrivateFieldGet(this, _BetaToolRunner_options, "f")), "f");
            yield __classPrivateFieldGet(this, _BetaToolRunner_message, "f");
          }
          const isCompacted = await __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_checkAndCompact).call(this);
          if (!isCompacted) {
            if (!__classPrivateFieldGet(this, _BetaToolRunner_mutated, "f")) {
              const message = await __classPrivateFieldGet(this, _BetaToolRunner_message, "f");
              __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params.messages.push({ role: message.role, content: message.content });
              if (message.stop_reason === "refusal") {
                break;
              }
            }
            const toolMessage = await __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_generateToolResponse).call(this, __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params.messages.at(-1));
            if (toolMessage) {
              __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params.messages.push(toolMessage);
            } else if (!__classPrivateFieldGet(this, _BetaToolRunner_mutated, "f")) {
              break;
            }
          }
        } finally {
          if (stream) {
            stream.abort();
          }
        }
      }
      if (!__classPrivateFieldGet(this, _BetaToolRunner_message, "f")) {
        throw new AnthropicError("ToolRunner concluded without a message from the server");
      }
      __classPrivateFieldGet(this, _BetaToolRunner_completion, "f").resolve(await __classPrivateFieldGet(this, _BetaToolRunner_message, "f"));
    } catch (error) {
      __classPrivateFieldSet(this, _BetaToolRunner_consumed, false, "f");
      __classPrivateFieldGet(this, _BetaToolRunner_completion, "f").promise.catch(() => {
      });
      __classPrivateFieldGet(this, _BetaToolRunner_completion, "f").reject(error);
      __classPrivateFieldSet(this, _BetaToolRunner_completion, promiseWithResolvers(), "f");
      throw error;
    }
  }
  setMessagesParams(paramsOrMutator) {
    if (typeof paramsOrMutator === "function") {
      __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params = paramsOrMutator(__classPrivateFieldGet(this, _BetaToolRunner_state, "f").params);
    } else {
      __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params = paramsOrMutator;
    }
    __classPrivateFieldSet(this, _BetaToolRunner_mutated, true, "f");
    __classPrivateFieldSet(this, _BetaToolRunner_toolResponse, void 0, "f");
  }
  setRequestOptions(optionsOrMutator) {
    if (typeof optionsOrMutator === "function") {
      __classPrivateFieldSet(this, _BetaToolRunner_options, optionsOrMutator(__classPrivateFieldGet(this, _BetaToolRunner_options, "f")), "f");
    } else {
      __classPrivateFieldSet(this, _BetaToolRunner_options, { ...__classPrivateFieldGet(this, _BetaToolRunner_options, "f"), ...optionsOrMutator }, "f");
    }
  }
  /**
   * Get the tool response for the last message from the assistant.
   * Avoids redundant tool executions by caching results.
   *
   * @returns A promise that resolves to a BetaMessageParam containing tool results, or null if no tools need to be executed
   *
   * @example
   * const toolResponse = await runner.generateToolResponse();
   * if (toolResponse) {
   *   console.log('Tool results:', toolResponse.content);
   * }
   */
  async generateToolResponse(signal = __classPrivateFieldGet(this, _BetaToolRunner_options, "f").signal) {
    const message = await __classPrivateFieldGet(this, _BetaToolRunner_message, "f") ?? this.params.messages.at(-1);
    if (!message) {
      return null;
    }
    return __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_generateToolResponse).call(this, message, signal);
  }
  /**
   * Wait for the async iterator to complete. This works even if the async iterator hasn't yet started, and
   * will wait for an instance to start and go to completion.
   *
   * @returns A promise that resolves to the final BetaMessage when the iterator completes
   *
   * @example
   * // Start consuming the iterator
   * for await (const message of runner) {
   *   console.log('Message:', message.content);
   * }
   *
   * // Meanwhile, wait for completion from another part of the code
   * const finalMessage = await runner.done();
   * console.log('Final response:', finalMessage.content);
   */
  done() {
    return __classPrivateFieldGet(this, _BetaToolRunner_completion, "f").promise;
  }
  /**
   * Returns a promise indicating that the stream is done. Unlike .done(), this will eagerly read the stream:
   * * If the iterator has not been consumed, consume the entire iterator and return the final message from the
   * assistant.
   * * If the iterator has been consumed, waits for it to complete and returns the final message.
   *
   * @returns A promise that resolves to the final BetaMessage from the conversation
   * @throws {AnthropicError} If no messages were processed during the conversation
   *
   * @example
   * const finalMessage = await runner.runUntilDone();
   * console.log('Final response:', finalMessage.content);
   */
  async runUntilDone() {
    if (!__classPrivateFieldGet(this, _BetaToolRunner_consumed, "f")) {
      for await (const _ of this) {
      }
    }
    return this.done();
  }
  /**
   * Get the current parameters being used by the ToolRunner.
   *
   * @returns A readonly view of the current ToolRunnerParams
   *
   * @example
   * const currentParams = runner.params;
   * console.log('Current model:', currentParams.model);
   * console.log('Message count:', currentParams.messages.length);
   */
  get params() {
    return __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params;
  }
  /**
   * Add one or more messages to the conversation history.
   *
   * @param messages - One or more BetaMessageParam objects to add to the conversation
   *
   * @example
   * runner.pushMessages(
   *   { role: 'user', content: 'Also, what about the weather in NYC?' }
   * );
   *
   * @example
   * // Adding multiple messages
   * runner.pushMessages(
   *   { role: 'user', content: 'What about NYC?' },
   *   { role: 'user', content: 'And Boston?' }
   * );
   */
  pushMessages(...messages) {
    this.setMessagesParams((params) => ({
      ...params,
      messages: [...params.messages, ...messages]
    }));
  }
  /**
   * Makes the ToolRunner directly awaitable, equivalent to calling .runUntilDone()
   * This allows using `await runner` instead of `await runner.runUntilDone()`
   */
  then(onfulfilled, onrejected) {
    return this.runUntilDone().then(onfulfilled, onrejected);
  }
};
_BetaToolRunner_generateToolResponse = /* @__PURE__ */ __name(async function _BetaToolRunner_generateToolResponse2(lastMessage, signal = __classPrivateFieldGet(this, _BetaToolRunner_options, "f").signal) {
  if (__classPrivateFieldGet(this, _BetaToolRunner_toolResponse, "f") !== void 0) {
    return __classPrivateFieldGet(this, _BetaToolRunner_toolResponse, "f");
  }
  __classPrivateFieldSet(this, _BetaToolRunner_toolResponse, generateToolResponse(__classPrivateFieldGet(this, _BetaToolRunner_state, "f").params, lastMessage, {
    ...__classPrivateFieldGet(this, _BetaToolRunner_options, "f"),
    signal
  }), "f");
  return __classPrivateFieldGet(this, _BetaToolRunner_toolResponse, "f");
}, "_BetaToolRunner_generateToolResponse");
async function generateToolResponse(params, lastMessage = params.messages.at(-1), requestOptions) {
  if (!lastMessage || lastMessage.role !== "assistant" || !lastMessage.content || typeof lastMessage.content === "string") {
    return null;
  }
  const toolUseBlocks = lastMessage.content.filter((content) => content.type === "tool_use");
  if (toolUseBlocks.length === 0) {
    return null;
  }
  const available = availableToolNames(params);
  const toolResults = await Promise.all(toolUseBlocks.map(async (toolUse) => {
    const tool = params.tools.find((t) => ("name" in t ? t.name : t.mcp_server_name) === toolUse.name);
    if (!tool || !("run" in tool) || !available.has(toolUse.name)) {
      return toolNotFoundResult(toolUse);
    }
    try {
      let input = toolUse.input;
      if ("parse" in tool && tool.parse) {
        input = tool.parse(input);
      }
      const result = await tool.run(input, {
        toolUse,
        toolUseBlock: toolUse,
        signal: requestOptions?.signal
      });
      return {
        type: "tool_result",
        tool_use_id: toolUse.id,
        content: result
      };
    } catch (error) {
      return {
        type: "tool_result",
        tool_use_id: toolUse.id,
        content: error instanceof ToolError ? error.content : `Error: ${error instanceof Error ? error.message : String(error)}`,
        is_error: true
      };
    }
  }));
  return {
    role: "user",
    content: toolResults
  };
}
__name(generateToolResponse, "generateToolResponse");
function toolNotFoundResult(toolUse) {
  return {
    type: "tool_result",
    tool_use_id: toolUse.id,
    content: `Error: Tool '${toolUse.name}' not found`,
    is_error: true
  };
}
__name(toolNotFoundResult, "toolNotFoundResult");
function availableToolNames(params) {
  const available = /* @__PURE__ */ new Set();
  for (const tool of params.tools) {
    if ("run" in tool) {
      available.add(tool.name);
    }
  }
  for (const message of params.messages) {
    if (message.role !== "system" || typeof message.content === "string") {
      continue;
    }
    for (const block of message.content) {
      applyToolChange(block, available);
    }
  }
  return available;
}
__name(availableToolNames, "availableToolNames");
function applyToolChange(block, available) {
  switch (block.type) {
    case "tool_removal":
    case "tool_addition":
      applyToolReference(block, available);
      break;
    case "mid_conv_system":
      for (const inner of block.content) {
        if (inner.type === "tool_removal" || inner.type === "tool_addition") {
          applyToolReference(inner, available);
        }
      }
      break;
    default:
      break;
  }
}
__name(applyToolChange, "applyToolChange");
function applyToolReference(block, available) {
  const name = referencedToolName(block.tool);
  if (name === void 0)
    return;
  if (block.type === "tool_removal") {
    available.delete(name);
  } else {
    available.add(name);
  }
}
__name(applyToolReference, "applyToolReference");
function referencedToolName(ref) {
  switch (ref.type) {
    case "tool_reference":
      return ref.name;
    default:
      return void 0;
  }
}
__name(referencedToolName, "referencedToolName");

// node_modules/@anthropic-ai/sdk/resources/beta/messages/messages.mjs
var DEPRECATED_MODELS = {};
var MODELS_TO_WARN_WITH_THINKING_ENABLED = ["claude-mythos-preview", "claude-opus-4-6"];
var Messages = class extends APIResource {
  static {
    __name(this, "Messages");
  }
  constructor() {
    super(...arguments);
    this.batches = new Batches(this._client);
  }
  create(params, options) {
    const modifiedParams = transformOutputFormat(params);
    const { betas, user_profile_id, ...body } = modifiedParams;
    if (body.model in DEPRECATED_MODELS) {
      console.warn(`The model '${body.model}' is deprecated and will reach end-of-life on ${DEPRECATED_MODELS[body.model]}
Please migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.`);
    }
    if (MODELS_TO_WARN_WITH_THINKING_ENABLED.includes(body.model) && body.thinking && body.thinking.type === "enabled") {
      console.warn(`Using Claude with ${body.model} and 'thinking.type=enabled' is deprecated. Use 'thinking.type=adaptive' instead which results in better model performance in our testing: https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking`);
    }
    let timeout = this._client._options.timeout;
    if (!body.stream && timeout == null) {
      const maxNonstreamingTokens = MODEL_NONSTREAMING_TOKENS[body.model] ?? void 0;
      timeout = this._client.calculateNonstreamingTimeout(body.max_tokens, maxNonstreamingTokens);
    }
    const helperHeader2 = stainlessHelperHeader(body.tools, body.messages);
    return this._client.post("/v1/messages?beta=true", {
      body,
      timeout: timeout ?? 6e5,
      ...options,
      headers: buildHeaders([
        {
          ...betas?.toString() != null ? { "anthropic-beta": betas?.toString() } : void 0,
          ...user_profile_id != null ? { "anthropic-user-profile-id": user_profile_id } : void 0
        },
        helperHeader2,
        options?.headers
      ]),
      stream: modifiedParams.stream ?? false
    });
  }
  /**
   * Send a structured list of input messages with text and/or image content, along with an expected `output_format` and
   * the response will be automatically parsed and available in the `parsed_output` property of the message.
   *
   * @example
   * ```ts
   * const message = await client.beta.messages.parse({
   *   model: 'claude-3-5-sonnet-20241022',
   *   max_tokens: 1024,
   *   messages: [{ role: 'user', content: 'What is 2+2?' }],
   *   output_format: zodOutputFormat(z.object({ answer: z.number() }), 'math'),
   * });
   *
   * console.log(message.parsed_output?.answer); // 4
   * ```
   */
  parse(params, options) {
    options = {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...params.betas ?? [], "structured-outputs-2025-12-15"].toString() },
        options?.headers
      ])
    };
    return this.create(params, options).then((message) => parseBetaMessage(message, params, { logger: this._client.logger ?? console }));
  }
  /**
   * Create a Message stream
   */
  stream(body, options) {
    return BetaMessageStream.createMessage(this, body, options);
  }
  /**
   * Count the number of tokens in a Message.
   *
   * The Token Count API can be used to count the number of tokens in a Message,
   * including tools, images, and documents, without creating it.
   *
   * Learn more about token counting in our
   * [user guide](https://platform.claude.com/docs/en/build-with-claude/token-counting)
   *
   * @example
   * ```ts
   * const betaMessageTokensCount =
   *   await client.beta.messages.countTokens({
   *     messages: [{ content: 'Hello, world', role: 'user' }],
   *     model: 'claude-opus-4-6',
   *   });
   * ```
   */
  countTokens(params, options) {
    const modifiedParams = transformOutputFormat(params);
    const { betas, user_profile_id, ...body } = modifiedParams;
    return this._client.post("/v1/messages/count_tokens?beta=true", {
      body,
      ...options,
      headers: buildHeaders([
        {
          "anthropic-beta": [...betas ?? [], "token-counting-2024-11-01"].toString(),
          ...user_profile_id != null ? { "anthropic-user-profile-id": user_profile_id } : void 0
        },
        options?.headers
      ])
    });
  }
  toolRunner(body, options) {
    return new BetaToolRunner(this._client, body, options);
  }
};
function transformOutputFormat(params) {
  if (!params.output_format) {
    return params;
  }
  if (params.output_config?.format) {
    throw new AnthropicError("Both output_format and output_config.format were provided. Please use only output_config.format (output_format is deprecated).");
  }
  const { output_format, ...rest } = params;
  return {
    ...rest,
    output_config: {
      ...params.output_config,
      format: output_format
    }
  };
}
__name(transformOutputFormat, "transformOutputFormat");
Messages.Batches = Batches;
Messages.BetaToolRunner = BetaToolRunner;
Messages.ToolError = ToolError;

// node_modules/@anthropic-ai/sdk/resources/beta/sessions/sessions.mjs
init_modules_watch_stub();

// node_modules/@anthropic-ai/sdk/resources/beta/sessions/events.mjs
init_modules_watch_stub();
var Events = class extends APIResource {
  static {
    __name(this, "Events");
  }
  /**
   * List Events
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const betaManagedAgentsSessionEvent of client.beta.sessions.events.list(
   *   'sesn_011CZkZAtmR3yMPDzynEDxu7',
   * )) {
   *   // ...
   * }
   * ```
   */
  list(sessionID, params = {}, options) {
    const { betas, ...query } = params ?? {};
    return this._client.getAPIList(path`/v1/sessions/${sessionID}/events?beta=true`, PageCursor, {
      query,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Send Events
   *
   * @example
   * ```ts
   * const betaManagedAgentsSendSessionEvents =
   *   await client.beta.sessions.events.send(
   *     'sesn_011CZkZAtmR3yMPDzynEDxu7',
   *     {
   *       events: [
   *         {
   *           content: [
   *             {
   *               text: 'Where is my order #1234?',
   *               type: 'text',
   *             },
   *           ],
   *           type: 'user.message',
   *         },
   *       ],
   *     },
   *   );
   * ```
   */
  send(sessionID, params, options) {
    const { betas, ...body } = params;
    return this._client.post(path`/v1/sessions/${sessionID}/events?beta=true`, {
      body,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Stream Events
   *
   * @example
   * ```ts
   * const betaManagedAgentsStreamSessionEvents =
   *   await client.beta.sessions.events.stream(
   *     'sesn_011CZkZAtmR3yMPDzynEDxu7',
   *   );
   * ```
   */
  stream(sessionID, params = {}, options) {
    const { betas, ...query } = params ?? {};
    return this._client.get(path`/v1/sessions/${sessionID}/events/stream?beta=true`, {
      query,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ]),
      stream: true
    });
  }
  /**
   * Attach to a session and dispatch every incoming `agent.tool_use` and
   * `agent.custom_tool_use` event to a local tool registry, sending the matching
   * result back (`user.tool_result` / `user.custom_tool_result`). The
   * sessions-side counterpart to `client.beta.messages.toolRunner`: yields one
   * entry per completed tool call so callers can observe each dispatch (and
   * `break` to abort cleanly).
   *
   * @example
   * ```ts
   * import { betaAgentToolset20260401 } from '@anthropic-ai/sdk/tools/agent-toolset/node';
   *
   * for await (const call of client.beta.sessions.events.toolRunner(work.data.id, {
   *   tools: [...betaAgentToolset20260401({ workdir }), myTool],
   * })) {
   *   console.log(`${call.name} -> ${call.isError ? 'error' : 'ok'}`);
   * }
   * ```
   */
  toolRunner(sessionID, opts) {
    return new SessionToolRunner(sessionID, { ...opts, client: this._client });
  }
};
Events.SessionToolRunner = SessionToolRunner;

// node_modules/@anthropic-ai/sdk/resources/beta/sessions/resources.mjs
init_modules_watch_stub();
var Resources = class extends APIResource {
  static {
    __name(this, "Resources");
  }
  /**
   * Get Session Resource
   *
   * @example
   * ```ts
   * const resource =
   *   await client.beta.sessions.resources.retrieve(
   *     'sesrsc_011CZkZBJq5dWxk9fVLNcPht',
   *     { session_id: 'sesn_011CZkZAtmR3yMPDzynEDxu7' },
   *   );
   * ```
   */
  retrieve(resourceID, params, options) {
    const { session_id, betas } = params;
    return this._client.get(path`/v1/sessions/${session_id}/resources/${resourceID}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Update Session Resource
   *
   * @example
   * ```ts
   * const resource =
   *   await client.beta.sessions.resources.update(
   *     'sesrsc_011CZkZBJq5dWxk9fVLNcPht',
   *     {
   *       session_id: 'sesn_011CZkZAtmR3yMPDzynEDxu7',
   *       authorization_token: 'ghp_exampletoken',
   *     },
   *   );
   * ```
   */
  update(resourceID, params, options) {
    const { session_id, betas, ...body } = params;
    return this._client.post(path`/v1/sessions/${session_id}/resources/${resourceID}?beta=true`, {
      body,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * List Session Resources
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const betaManagedAgentsSessionResource of client.beta.sessions.resources.list(
   *   'sesn_011CZkZAtmR3yMPDzynEDxu7',
   * )) {
   *   // ...
   * }
   * ```
   */
  list(sessionID, params = {}, options) {
    const { betas, ...query } = params ?? {};
    return this._client.getAPIList(path`/v1/sessions/${sessionID}/resources?beta=true`, PageCursor, {
      query,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Delete Session Resource
   *
   * @example
   * ```ts
   * const betaManagedAgentsDeleteSessionResource =
   *   await client.beta.sessions.resources.delete(
   *     'sesrsc_011CZkZBJq5dWxk9fVLNcPht',
   *     { session_id: 'sesn_011CZkZAtmR3yMPDzynEDxu7' },
   *   );
   * ```
   */
  delete(resourceID, params, options) {
    const { session_id, betas } = params;
    return this._client.delete(path`/v1/sessions/${session_id}/resources/${resourceID}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Add Session Resource
   *
   * @example
   * ```ts
   * const betaManagedAgentsFileResource =
   *   await client.beta.sessions.resources.add(
   *     'sesn_011CZkZAtmR3yMPDzynEDxu7',
   *     {
   *       file_id: 'file_011CNha8iCJcU1wXNR6q4V8w',
   *       type: 'file',
   *     },
   *   );
   * ```
   */
  add(sessionID, params, options) {
    const { betas, ...body } = params;
    return this._client.post(path`/v1/sessions/${sessionID}/resources?beta=true`, {
      body,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
};

// node_modules/@anthropic-ai/sdk/resources/beta/sessions/threads/threads.mjs
init_modules_watch_stub();

// node_modules/@anthropic-ai/sdk/resources/beta/sessions/threads/events.mjs
init_modules_watch_stub();
var Events2 = class extends APIResource {
  static {
    __name(this, "Events");
  }
  /**
   * List Session Thread Events
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const betaManagedAgentsSessionEvent of client.beta.sessions.threads.events.list(
   *   'sthr_011CZkZVWa6oIjw0rgXZpnBt',
   *   { session_id: 'sesn_011CZkZAtmR3yMPDzynEDxu7' },
   * )) {
   *   // ...
   * }
   * ```
   */
  list(threadID, params, options) {
    const { session_id, betas, ...query } = params;
    return this._client.getAPIList(path`/v1/sessions/${session_id}/threads/${threadID}/events?beta=true`, PageCursor, {
      query,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Stream Session Thread Events
   *
   * @example
   * ```ts
   * const betaManagedAgentsStreamSessionThreadEvents =
   *   await client.beta.sessions.threads.events.stream(
   *     'sthr_011CZkZVWa6oIjw0rgXZpnBt',
   *     { session_id: 'sesn_011CZkZAtmR3yMPDzynEDxu7' },
   *   );
   * ```
   */
  stream(threadID, params, options) {
    const { session_id, betas, ...query } = params;
    return this._client.get(path`/v1/sessions/${session_id}/threads/${threadID}/stream?beta=true`, {
      query,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ]),
      stream: true
    });
  }
};

// node_modules/@anthropic-ai/sdk/resources/beta/sessions/threads/threads.mjs
var Threads = class extends APIResource {
  static {
    __name(this, "Threads");
  }
  constructor() {
    super(...arguments);
    this.events = new Events2(this._client);
  }
  /**
   * Get Session Thread
   *
   * @example
   * ```ts
   * const betaManagedAgentsSessionThread =
   *   await client.beta.sessions.threads.retrieve(
   *     'sthr_011CZkZVWa6oIjw0rgXZpnBt',
   *     { session_id: 'sesn_011CZkZAtmR3yMPDzynEDxu7' },
   *   );
   * ```
   */
  retrieve(threadID, params, options) {
    const { session_id, betas } = params;
    return this._client.get(path`/v1/sessions/${session_id}/threads/${threadID}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * List Session Threads
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const betaManagedAgentsSessionThread of client.beta.sessions.threads.list(
   *   'sesn_011CZkZAtmR3yMPDzynEDxu7',
   * )) {
   *   // ...
   * }
   * ```
   */
  list(sessionID, params = {}, options) {
    const { betas, ...query } = params ?? {};
    return this._client.getAPIList(path`/v1/sessions/${sessionID}/threads?beta=true`, PageCursor, {
      query,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Archive Session Thread
   *
   * @example
   * ```ts
   * const betaManagedAgentsSessionThread =
   *   await client.beta.sessions.threads.archive(
   *     'sthr_011CZkZVWa6oIjw0rgXZpnBt',
   *     { session_id: 'sesn_011CZkZAtmR3yMPDzynEDxu7' },
   *   );
   * ```
   */
  archive(threadID, params, options) {
    const { session_id, betas } = params;
    return this._client.post(path`/v1/sessions/${session_id}/threads/${threadID}/archive?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
};
Threads.Events = Events2;

// node_modules/@anthropic-ai/sdk/resources/beta/sessions/sessions.mjs
var Sessions = class extends APIResource {
  static {
    __name(this, "Sessions");
  }
  constructor() {
    super(...arguments);
    this.events = new Events(this._client);
    this.resources = new Resources(this._client);
    this.threads = new Threads(this._client);
  }
  /**
   * Create Session
   *
   * @example
   * ```ts
   * const betaManagedAgentsSession =
   *   await client.beta.sessions.create({
   *     agent: 'agent_011CZkYpogX7uDKUyvBTophP',
   *     environment_id: 'env_011CZkZ9X2dpNyB7HsEFoRfW',
   *   });
   * ```
   */
  create(params, options) {
    const { betas, ...body } = params;
    return this._client.post("/v1/sessions?beta=true", {
      body,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Get Session
   *
   * @example
   * ```ts
   * const betaManagedAgentsSession =
   *   await client.beta.sessions.retrieve(
   *     'sesn_011CZkZAtmR3yMPDzynEDxu7',
   *   );
   * ```
   */
  retrieve(sessionID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.get(path`/v1/sessions/${sessionID}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Update Session
   *
   * @example
   * ```ts
   * const betaManagedAgentsSession =
   *   await client.beta.sessions.update(
   *     'sesn_011CZkZAtmR3yMPDzynEDxu7',
   *   );
   * ```
   */
  update(sessionID, params, options) {
    const { betas, ...body } = params;
    return this._client.post(path`/v1/sessions/${sessionID}?beta=true`, {
      body,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * List Sessions
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const betaManagedAgentsSession of client.beta.sessions.list()) {
   *   // ...
   * }
   * ```
   */
  list(params = {}, options) {
    const { betas, ...query } = params ?? {};
    return this._client.getAPIList("/v1/sessions?beta=true", BidirectionalPageCursor, {
      query,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Delete Session
   *
   * @example
   * ```ts
   * const betaManagedAgentsDeletedSession =
   *   await client.beta.sessions.delete(
   *     'sesn_011CZkZAtmR3yMPDzynEDxu7',
   *   );
   * ```
   */
  delete(sessionID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.delete(path`/v1/sessions/${sessionID}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Archive Session
   *
   * @example
   * ```ts
   * const betaManagedAgentsSession =
   *   await client.beta.sessions.archive(
   *     'sesn_011CZkZAtmR3yMPDzynEDxu7',
   *   );
   * ```
   */
  archive(sessionID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.post(path`/v1/sessions/${sessionID}/archive?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
};
Sessions.Events = Events;
Sessions.Resources = Resources;
Sessions.Threads = Threads;

// node_modules/@anthropic-ai/sdk/resources/beta/skills/skills.mjs
init_modules_watch_stub();

// node_modules/@anthropic-ai/sdk/resources/beta/skills/versions.mjs
init_modules_watch_stub();
var Versions2 = class extends APIResource {
  static {
    __name(this, "Versions");
  }
  /**
   * Create Skill Version
   *
   * @example
   * ```ts
   * const version = await client.beta.skills.versions.create(
   *   'skill_id',
   *   { files: [fs.createReadStream('path/to/file')] },
   * );
   * ```
   */
  create(skillID, params, options) {
    const { betas, ...body } = params;
    return this._client.post(path`/v1/skills/${skillID}/versions?beta=true`, multipartFormRequestOptions({
      body,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "skills-2025-10-02"].toString() },
        options?.headers
      ])
    }, this._client, false));
  }
  /**
   * Get Skill Version
   *
   * @example
   * ```ts
   * const version = await client.beta.skills.versions.retrieve(
   *   'version',
   *   { skill_id: 'skill_id' },
   * );
   * ```
   */
  retrieve(version, params, options) {
    const { skill_id, betas } = params;
    return this._client.get(path`/v1/skills/${skill_id}/versions/${version}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "skills-2025-10-02"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * List Skill Versions
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const versionListResponse of client.beta.skills.versions.list(
   *   'skill_id',
   * )) {
   *   // ...
   * }
   * ```
   */
  list(skillID, params = {}, options) {
    const { betas, ...query } = params ?? {};
    return this._client.getAPIList(path`/v1/skills/${skillID}/versions?beta=true`, PageCursor, {
      query,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "skills-2025-10-02"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Delete Skill Version
   *
   * @example
   * ```ts
   * const version = await client.beta.skills.versions.delete(
   *   'version',
   *   { skill_id: 'skill_id' },
   * );
   * ```
   */
  delete(version, params, options) {
    const { skill_id, betas } = params;
    return this._client.delete(path`/v1/skills/${skill_id}/versions/${version}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "skills-2025-10-02"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Download a skill version's content as a zip archive.
   *
   * @example
   * ```ts
   * const response = await client.beta.skills.versions.download(
   *   'version',
   *   { skill_id: 'skill_id' },
   * );
   *
   * const content = await response.blob();
   * console.log(content);
   * ```
   */
  download(version, params, options) {
    const { skill_id, betas } = params;
    return this._client.get(path`/v1/skills/${skill_id}/versions/${version}/content?beta=true`, {
      ...options,
      headers: buildHeaders([
        {
          "anthropic-beta": [...betas ?? [], "skills-2025-10-02"].toString(),
          Accept: "application/binary"
        },
        options?.headers
      ]),
      __binaryResponse: true
    });
  }
};

// node_modules/@anthropic-ai/sdk/resources/beta/skills/skills.mjs
var Skills = class extends APIResource {
  static {
    __name(this, "Skills");
  }
  constructor() {
    super(...arguments);
    this.versions = new Versions2(this._client);
  }
  /**
   * Create Skill
   *
   * @example
   * ```ts
   * const skill = await client.beta.skills.create({
   *   files: [fs.createReadStream('path/to/file')],
   * });
   * ```
   */
  create(params, options) {
    const { betas, ...body } = params;
    return this._client.post("/v1/skills?beta=true", multipartFormRequestOptions({
      body,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "skills-2025-10-02"].toString() },
        options?.headers
      ])
    }, this._client, false));
  }
  /**
   * Get Skill
   *
   * @example
   * ```ts
   * const skill = await client.beta.skills.retrieve('skill_id');
   * ```
   */
  retrieve(skillID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.get(path`/v1/skills/${skillID}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "skills-2025-10-02"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * List Skills
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const skillListResponse of client.beta.skills.list()) {
   *   // ...
   * }
   * ```
   */
  list(params = {}, options) {
    const { betas, ...query } = params ?? {};
    return this._client.getAPIList("/v1/skills?beta=true", PageCursor, {
      query,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "skills-2025-10-02"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Delete Skill
   *
   * @example
   * ```ts
   * const skill = await client.beta.skills.delete('skill_id');
   * ```
   */
  delete(skillID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.delete(path`/v1/skills/${skillID}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "skills-2025-10-02"].toString() },
        options?.headers
      ])
    });
  }
};
Skills.Versions = Versions2;

// node_modules/@anthropic-ai/sdk/resources/beta/tunnels/tunnels.mjs
init_modules_watch_stub();

// node_modules/@anthropic-ai/sdk/resources/beta/tunnels/certificates.mjs
init_modules_watch_stub();
var Certificates = class extends APIResource {
  static {
    __name(this, "Certificates");
  }
  /**
   * The Tunnels API is in research preview. It requires the
   * `anthropic-beta: mcp-tunnels-2026-06-22` header and may change without a
   * deprecation period. It supersedes the Admin API endpoints at
   * `/v1/organizations/tunnels`, which remain available during a migration window.
   *
   * Registers a public CA certificate on a tunnel. Anthropic verifies the gateway's
   * server certificate against this CA when it terminates the inner TLS session. A
   * tunnel holds at most two non-archived certificates.
   *
   * @example
   * ```ts
   * const betaTunnelCertificate =
   *   await client.beta.tunnels.certificates.create(
   *     'tunnel_id',
   *     { ca_certificate_pem: 'ca_certificate_pem' },
   *   );
   * ```
   */
  create(tunnelID, params, options) {
    const { betas, ...body } = params;
    return this._client.post(path`/v1/tunnels/${tunnelID}/certificates?beta=true`, {
      body,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "mcp-tunnels-2026-06-22"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * The Tunnels API is in research preview. It requires the
   * `anthropic-beta: mcp-tunnels-2026-06-22` header and may change without a
   * deprecation period. It supersedes the Admin API endpoints at
   * `/v1/organizations/tunnels`, which remain available during a migration window.
   *
   * Fetches a tunnel certificate by ID.
   *
   * @example
   * ```ts
   * const betaTunnelCertificate =
   *   await client.beta.tunnels.certificates.retrieve(
   *     'certificate_id',
   *     { tunnel_id: 'tunnel_id' },
   *   );
   * ```
   */
  retrieve(certificateID, params, options) {
    const { tunnel_id, betas } = params;
    return this._client.get(path`/v1/tunnels/${tunnel_id}/certificates/${certificateID}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "mcp-tunnels-2026-06-22"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * The Tunnels API is in research preview. It requires the
   * `anthropic-beta: mcp-tunnels-2026-06-22` header and may change without a
   * deprecation period. It supersedes the Admin API endpoints at
   * `/v1/organizations/tunnels`, which remain available during a migration window.
   *
   * Lists the certificates registered on a tunnel. Archived certificates are
   * excluded unless include_archived is set.
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const betaTunnelCertificate of client.beta.tunnels.certificates.list(
   *   'tunnel_id',
   * )) {
   *   // ...
   * }
   * ```
   */
  list(tunnelID, params = {}, options) {
    const { betas, ...query } = params ?? {};
    return this._client.getAPIList(path`/v1/tunnels/${tunnelID}/certificates?beta=true`, PageCursor, {
      query,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "mcp-tunnels-2026-06-22"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * The Tunnels API is in research preview. It requires the
   * `anthropic-beta: mcp-tunnels-2026-06-22` header and may change without a
   * deprecation period. It supersedes the Admin API endpoints at
   * `/v1/organizations/tunnels`, which remain available during a migration window.
   *
   * Archives a tunnel certificate, removing it from the set Anthropic trusts for the
   * tunnel. The certificate record is retained. Archiving the last non-archived
   * certificate is permitted; the tunnel rejects MCP traffic until a new certificate
   * is added.
   *
   * @example
   * ```ts
   * const betaTunnelCertificate =
   *   await client.beta.tunnels.certificates.archive(
   *     'certificate_id',
   *     { tunnel_id: 'tunnel_id' },
   *   );
   * ```
   */
  archive(certificateID, params, options) {
    const { tunnel_id, betas } = params;
    return this._client.post(path`/v1/tunnels/${tunnel_id}/certificates/${certificateID}/archive?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "mcp-tunnels-2026-06-22"].toString() },
        options?.headers
      ])
    });
  }
};

// node_modules/@anthropic-ai/sdk/resources/beta/tunnels/tunnels.mjs
var Tunnels = class extends APIResource {
  static {
    __name(this, "Tunnels");
  }
  constructor() {
    super(...arguments);
    this.certificates = new Certificates(this._client);
  }
  /**
   * The Tunnels API is in research preview. It requires the
   * `anthropic-beta: mcp-tunnels-2026-06-22` header and may change without a
   * deprecation period. It supersedes the Admin API endpoints at
   * `/v1/organizations/tunnels`, which remain available during a migration window.
   *
   * Creates a tunnel. Creation allocates a fresh hostname and provisions the tunnel;
   * it is not idempotent. The new tunnel rejects MCP traffic until at least one CA
   * certificate is added.
   *
   * @example
   * ```ts
   * const betaTunnel = await client.beta.tunnels.create();
   * ```
   */
  create(params, options) {
    const { betas, ...body } = params;
    return this._client.post("/v1/tunnels?beta=true", {
      body,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "mcp-tunnels-2026-06-22"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * The Tunnels API is in research preview. It requires the
   * `anthropic-beta: mcp-tunnels-2026-06-22` header and may change without a
   * deprecation period. It supersedes the Admin API endpoints at
   * `/v1/organizations/tunnels`, which remain available during a migration window.
   *
   * Fetches a tunnel by ID.
   *
   * @example
   * ```ts
   * const betaTunnel = await client.beta.tunnels.retrieve(
   *   'tunnel_id',
   * );
   * ```
   */
  retrieve(tunnelID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.get(path`/v1/tunnels/${tunnelID}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "mcp-tunnels-2026-06-22"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * The Tunnels API is in research preview. It requires the
   * `anthropic-beta: mcp-tunnels-2026-06-22` header and may change without a
   * deprecation period. It supersedes the Admin API endpoints at
   * `/v1/organizations/tunnels`, which remain available during a migration window.
   *
   * Lists tunnels. Results are ordered by creation time, newest first; archived
   * tunnels are excluded unless include_archived is set.
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const betaTunnel of client.beta.tunnels.list()) {
   *   // ...
   * }
   * ```
   */
  list(params = {}, options) {
    const { betas, ...query } = params ?? {};
    return this._client.getAPIList("/v1/tunnels?beta=true", PageCursor, {
      query,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "mcp-tunnels-2026-06-22"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * The Tunnels API is in research preview. It requires the
   * `anthropic-beta: mcp-tunnels-2026-06-22` header and may change without a
   * deprecation period. It supersedes the Admin API endpoints at
   * `/v1/organizations/tunnels`, which remain available during a migration window.
   *
   * Archives a tunnel. Archival is irreversible: every non-archived certificate on
   * the tunnel is archived in the same operation, the hostname is retired and never
   * re-allocated, and the tunnel token is invalidated. Retrying against an
   * already-archived tunnel returns the existing record unchanged.
   *
   * @example
   * ```ts
   * const betaTunnel = await client.beta.tunnels.archive(
   *   'tunnel_id',
   * );
   * ```
   */
  archive(tunnelID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.post(path`/v1/tunnels/${tunnelID}/archive?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "mcp-tunnels-2026-06-22"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * The Tunnels API is in research preview. It requires the
   * `anthropic-beta: mcp-tunnels-2026-06-22` header and may change without a
   * deprecation period. It supersedes the Admin API endpoints at
   * `/v1/organizations/tunnels`, which remain available during a migration window.
   *
   * Reveals a tunnel's connector token. The value is fetched live on each call;
   * Anthropic does not store it. Repeated calls return the same value until the
   * token is rotated. Exposed as POST so the token does not appear in intermediary
   * access logs.
   *
   * @example
   * ```ts
   * const betaTunnelToken =
   *   await client.beta.tunnels.revealToken('tunnel_id');
   * ```
   */
  revealToken(tunnelID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.post(path`/v1/tunnels/${tunnelID}/reveal_token?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "mcp-tunnels-2026-06-22"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * The Tunnels API is in research preview. It requires the
   * `anthropic-beta: mcp-tunnels-2026-06-22` header and may change without a
   * deprecation period. It supersedes the Admin API endpoints at
   * `/v1/organizations/tunnels`, which remain available during a migration window.
   *
   * Rotates a tunnel's connector token. Rotation invalidates the current token for
   * new connections and returns a fresh value; established connections are not
   * severed. A connector restarted after rotation must use the new value.
   *
   * @example
   * ```ts
   * const betaTunnelToken =
   *   await client.beta.tunnels.rotateToken('tunnel_id');
   * ```
   */
  rotateToken(tunnelID, params, options) {
    const { betas, ...body } = params;
    return this._client.post(path`/v1/tunnels/${tunnelID}/rotate_token?beta=true`, {
      body,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "mcp-tunnels-2026-06-22"].toString() },
        options?.headers
      ])
    });
  }
};
Tunnels.Certificates = Certificates;

// node_modules/@anthropic-ai/sdk/resources/beta/vaults/vaults.mjs
init_modules_watch_stub();

// node_modules/@anthropic-ai/sdk/resources/beta/vaults/credentials.mjs
init_modules_watch_stub();
var Credentials = class extends APIResource {
  static {
    __name(this, "Credentials");
  }
  /**
   * Create Credential
   *
   * @example
   * ```ts
   * const betaManagedAgentsCredential =
   *   await client.beta.vaults.credentials.create(
   *     'vlt_011CZkZDLs7fYzm1hXNPeRjv',
   *     {
   *       auth: {
   *         token: 'bearer_exampletoken',
   *         mcp_server_url:
   *           'https://example-server.modelcontextprotocol.io/sse',
   *         type: 'static_bearer',
   *       },
   *     },
   *   );
   * ```
   */
  create(vaultID, params, options) {
    const { betas, ...body } = params;
    return this._client.post(path`/v1/vaults/${vaultID}/credentials?beta=true`, {
      body,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Get Credential
   *
   * @example
   * ```ts
   * const betaManagedAgentsCredential =
   *   await client.beta.vaults.credentials.retrieve(
   *     'vcrd_011CZkZEMt8gZan2iYOQfSkw',
   *     { vault_id: 'vlt_011CZkZDLs7fYzm1hXNPeRjv' },
   *   );
   * ```
   */
  retrieve(credentialID, params, options) {
    const { vault_id, betas } = params;
    return this._client.get(path`/v1/vaults/${vault_id}/credentials/${credentialID}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Update Credential
   *
   * @example
   * ```ts
   * const betaManagedAgentsCredential =
   *   await client.beta.vaults.credentials.update(
   *     'vcrd_011CZkZEMt8gZan2iYOQfSkw',
   *     { vault_id: 'vlt_011CZkZDLs7fYzm1hXNPeRjv' },
   *   );
   * ```
   */
  update(credentialID, params, options) {
    const { vault_id, betas, ...body } = params;
    return this._client.post(path`/v1/vaults/${vault_id}/credentials/${credentialID}?beta=true`, {
      body,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * List Credentials
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const betaManagedAgentsCredential of client.beta.vaults.credentials.list(
   *   'vlt_011CZkZDLs7fYzm1hXNPeRjv',
   * )) {
   *   // ...
   * }
   * ```
   */
  list(vaultID, params = {}, options) {
    const { betas, ...query } = params ?? {};
    return this._client.getAPIList(path`/v1/vaults/${vaultID}/credentials?beta=true`, PageCursor, {
      query,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Delete Credential
   *
   * @example
   * ```ts
   * const betaManagedAgentsDeletedCredential =
   *   await client.beta.vaults.credentials.delete(
   *     'vcrd_011CZkZEMt8gZan2iYOQfSkw',
   *     { vault_id: 'vlt_011CZkZDLs7fYzm1hXNPeRjv' },
   *   );
   * ```
   */
  delete(credentialID, params, options) {
    const { vault_id, betas } = params;
    return this._client.delete(path`/v1/vaults/${vault_id}/credentials/${credentialID}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Archive Credential
   *
   * @example
   * ```ts
   * const betaManagedAgentsCredential =
   *   await client.beta.vaults.credentials.archive(
   *     'vcrd_011CZkZEMt8gZan2iYOQfSkw',
   *     { vault_id: 'vlt_011CZkZDLs7fYzm1hXNPeRjv' },
   *   );
   * ```
   */
  archive(credentialID, params, options) {
    const { vault_id, betas } = params;
    return this._client.post(path`/v1/vaults/${vault_id}/credentials/${credentialID}/archive?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Validate Credential
   *
   * @example
   * ```ts
   * const betaManagedAgentsCredentialValidation =
   *   await client.beta.vaults.credentials.mcpOAuthValidate(
   *     'vcrd_011CZkZEMt8gZan2iYOQfSkw',
   *     { vault_id: 'vlt_011CZkZDLs7fYzm1hXNPeRjv' },
   *   );
   * ```
   */
  mcpOAuthValidate(credentialID, params, options) {
    const { vault_id, betas } = params;
    return this._client.post(path`/v1/vaults/${vault_id}/credentials/${credentialID}/mcp_oauth_validate?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
};

// node_modules/@anthropic-ai/sdk/resources/beta/vaults/vaults.mjs
var Vaults = class extends APIResource {
  static {
    __name(this, "Vaults");
  }
  constructor() {
    super(...arguments);
    this.credentials = new Credentials(this._client);
  }
  /**
   * Create Vault
   *
   * @example
   * ```ts
   * const betaManagedAgentsVault =
   *   await client.beta.vaults.create({
   *     display_name: 'Example vault',
   *   });
   * ```
   */
  create(params, options) {
    const { betas, ...body } = params;
    return this._client.post("/v1/vaults?beta=true", {
      body,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Get Vault
   *
   * @example
   * ```ts
   * const betaManagedAgentsVault =
   *   await client.beta.vaults.retrieve(
   *     'vlt_011CZkZDLs7fYzm1hXNPeRjv',
   *   );
   * ```
   */
  retrieve(vaultID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.get(path`/v1/vaults/${vaultID}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Update Vault
   *
   * @example
   * ```ts
   * const betaManagedAgentsVault =
   *   await client.beta.vaults.update(
   *     'vlt_011CZkZDLs7fYzm1hXNPeRjv',
   *   );
   * ```
   */
  update(vaultID, params, options) {
    const { betas, ...body } = params;
    return this._client.post(path`/v1/vaults/${vaultID}?beta=true`, {
      body,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * List Vaults
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const betaManagedAgentsVault of client.beta.vaults.list()) {
   *   // ...
   * }
   * ```
   */
  list(params = {}, options) {
    const { betas, ...query } = params ?? {};
    return this._client.getAPIList("/v1/vaults?beta=true", PageCursor, {
      query,
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Delete Vault
   *
   * @example
   * ```ts
   * const betaManagedAgentsDeletedVault =
   *   await client.beta.vaults.delete(
   *     'vlt_011CZkZDLs7fYzm1hXNPeRjv',
   *   );
   * ```
   */
  delete(vaultID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.delete(path`/v1/vaults/${vaultID}?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
  /**
   * Archive Vault
   *
   * @example
   * ```ts
   * const betaManagedAgentsVault =
   *   await client.beta.vaults.archive(
   *     'vlt_011CZkZDLs7fYzm1hXNPeRjv',
   *   );
   * ```
   */
  archive(vaultID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.post(path`/v1/vaults/${vaultID}/archive?beta=true`, {
      ...options,
      headers: buildHeaders([
        { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
        options?.headers
      ])
    });
  }
};
Vaults.Credentials = Credentials;

// node_modules/@anthropic-ai/sdk/resources/beta/beta.mjs
var Beta = class extends APIResource {
  static {
    __name(this, "Beta");
  }
  constructor() {
    super(...arguments);
    this.models = new Models(this._client);
    this.messages = new Messages(this._client);
    this.agents = new Agents(this._client);
    this.environments = new Environments(this._client);
    this.sessions = new Sessions(this._client);
    this.deployments = new Deployments(this._client);
    this.deploymentRuns = new DeploymentRuns(this._client);
    this.vaults = new Vaults(this._client);
    this.memoryStores = new MemoryStores(this._client);
    this.files = new Files(this._client);
    this.skills = new Skills(this._client);
    this.webhooks = new Webhooks(this._client);
    this.userProfiles = new UserProfiles(this._client);
    this.dreams = new Dreams(this._client);
    this.tunnels = new Tunnels(this._client);
  }
};
Beta.Models = Models;
Beta.Messages = Messages;
Beta.Agents = Agents;
Beta.Environments = Environments;
Beta.Sessions = Sessions;
Beta.Deployments = Deployments;
Beta.DeploymentRuns = DeploymentRuns;
Beta.Vaults = Vaults;
Beta.MemoryStores = MemoryStores;
Beta.Files = Files;
Beta.Skills = Skills;
Beta.Webhooks = Webhooks;
Beta.UserProfiles = UserProfiles;
Beta.Dreams = Dreams;
Beta.Tunnels = Tunnels;

// node_modules/@anthropic-ai/sdk/resources/completions.mjs
init_modules_watch_stub();
var Completions = class extends APIResource {
  static {
    __name(this, "Completions");
  }
  create(params, options) {
    const { betas, ...body } = params;
    return this._client.post("/v1/complete", {
      body,
      timeout: this._client._options.timeout ?? 6e5,
      ...options,
      headers: buildHeaders([
        { ...betas?.toString() != null ? { "anthropic-beta": betas?.toString() } : void 0 },
        options?.headers
      ]),
      stream: params.stream ?? false
    });
  }
};

// node_modules/@anthropic-ai/sdk/resources/messages/messages.mjs
init_modules_watch_stub();

// node_modules/@anthropic-ai/sdk/lib/MessageStream.mjs
init_modules_watch_stub();
init_errors();

// node_modules/@anthropic-ai/sdk/lib/parser.mjs
init_modules_watch_stub();
init_error();
function getOutputFormat2(params) {
  return params?.output_config?.format;
}
__name(getOutputFormat2, "getOutputFormat");
function maybeParseMessage(message, params, opts) {
  const outputFormat = getOutputFormat2(params);
  if (!params || !("parse" in (outputFormat ?? {}))) {
    return {
      ...message,
      content: message.content.map((block) => {
        if (block.type === "text") {
          const parsedBlock = Object.defineProperty({ ...block }, "parsed_output", {
            value: null,
            enumerable: false
          });
          return parsedBlock;
        }
        return block;
      }),
      parsed_output: null
    };
  }
  return parseMessage(message, params, opts);
}
__name(maybeParseMessage, "maybeParseMessage");
function parseMessage(message, params, opts) {
  let firstParsedOutput = null;
  const content = message.content.map((block) => {
    if (block.type === "text") {
      const parsedOutput = parseOutputFormat(params, block.text);
      if (firstParsedOutput === null) {
        firstParsedOutput = parsedOutput;
      }
      const parsedBlock = Object.defineProperty({ ...block }, "parsed_output", {
        value: parsedOutput,
        enumerable: false
      });
      return parsedBlock;
    }
    return block;
  });
  return {
    ...message,
    content,
    parsed_output: firstParsedOutput
  };
}
__name(parseMessage, "parseMessage");
function parseOutputFormat(params, content) {
  const outputFormat = getOutputFormat2(params);
  if (outputFormat?.type !== "json_schema") {
    return null;
  }
  try {
    if ("parse" in outputFormat) {
      return outputFormat.parse(content);
    }
    return JSON.parse(content);
  } catch (error) {
    throw new AnthropicError(`Failed to parse structured output: ${error}`);
  }
}
__name(parseOutputFormat, "parseOutputFormat");

// node_modules/@anthropic-ai/sdk/lib/MessageStream.mjs
var _MessageStream_instances;
var _MessageStream_currentMessageSnapshot;
var _MessageStream_params;
var _MessageStream_connectedPromise;
var _MessageStream_resolveConnectedPromise;
var _MessageStream_rejectConnectedPromise;
var _MessageStream_endPromise;
var _MessageStream_resolveEndPromise;
var _MessageStream_rejectEndPromise;
var _MessageStream_listeners;
var _MessageStream_ended;
var _MessageStream_errored;
var _MessageStream_aborted;
var _MessageStream_catchingPromiseCreated;
var _MessageStream_response;
var _MessageStream_request_id;
var _MessageStream_logger;
var _MessageStream_getFinalMessage;
var _MessageStream_getFinalText;
var _MessageStream_handleError;
var _MessageStream_beginRequest;
var _MessageStream_addStreamEvent;
var _MessageStream_endRequest;
var _MessageStream_accumulateMessage;
function tracksToolInput2(content) {
  return content.type === "tool_use" || content.type === "server_tool_use";
}
__name(tracksToolInput2, "tracksToolInput");
var MessageStream = class _MessageStream {
  static {
    __name(this, "MessageStream");
  }
  constructor(params, opts) {
    _MessageStream_instances.add(this);
    this.messages = [];
    this.receivedMessages = [];
    _MessageStream_currentMessageSnapshot.set(this, void 0);
    _MessageStream_params.set(this, null);
    this.controller = new AbortController();
    _MessageStream_connectedPromise.set(this, void 0);
    _MessageStream_resolveConnectedPromise.set(this, () => {
    });
    _MessageStream_rejectConnectedPromise.set(this, () => {
    });
    _MessageStream_endPromise.set(this, void 0);
    _MessageStream_resolveEndPromise.set(this, () => {
    });
    _MessageStream_rejectEndPromise.set(this, () => {
    });
    _MessageStream_listeners.set(this, {});
    _MessageStream_ended.set(this, false);
    _MessageStream_errored.set(this, false);
    _MessageStream_aborted.set(this, false);
    _MessageStream_catchingPromiseCreated.set(this, false);
    _MessageStream_response.set(this, void 0);
    _MessageStream_request_id.set(this, void 0);
    _MessageStream_logger.set(this, void 0);
    _MessageStream_handleError.set(this, (error) => {
      __classPrivateFieldSet(this, _MessageStream_errored, true, "f");
      if (isAbortError(error)) {
        error = new APIUserAbortError();
      }
      if (error instanceof APIUserAbortError) {
        __classPrivateFieldSet(this, _MessageStream_aborted, true, "f");
        return this._emit("abort", error);
      }
      if (error instanceof AnthropicError) {
        return this._emit("error", error);
      }
      if (error instanceof Error) {
        const anthropicError = new AnthropicError(error.message);
        anthropicError.cause = error;
        return this._emit("error", anthropicError);
      }
      return this._emit("error", new AnthropicError(String(error)));
    });
    __classPrivateFieldSet(this, _MessageStream_connectedPromise, new Promise((resolve, reject) => {
      __classPrivateFieldSet(this, _MessageStream_resolveConnectedPromise, resolve, "f");
      __classPrivateFieldSet(this, _MessageStream_rejectConnectedPromise, reject, "f");
    }), "f");
    __classPrivateFieldSet(this, _MessageStream_endPromise, new Promise((resolve, reject) => {
      __classPrivateFieldSet(this, _MessageStream_resolveEndPromise, resolve, "f");
      __classPrivateFieldSet(this, _MessageStream_rejectEndPromise, reject, "f");
    }), "f");
    __classPrivateFieldGet(this, _MessageStream_connectedPromise, "f").catch(() => {
    });
    __classPrivateFieldGet(this, _MessageStream_endPromise, "f").catch(() => {
    });
    __classPrivateFieldSet(this, _MessageStream_params, params, "f");
    __classPrivateFieldSet(this, _MessageStream_logger, opts?.logger ?? console, "f");
  }
  get response() {
    return __classPrivateFieldGet(this, _MessageStream_response, "f");
  }
  get request_id() {
    return __classPrivateFieldGet(this, _MessageStream_request_id, "f");
  }
  /**
   * Returns the `MessageStream` data, the raw `Response` instance and the ID of the request,
   * returned vie the `request-id` header which is useful for debugging requests and resporting
   * issues to Anthropic.
   *
   * This is the same as the `APIPromise.withResponse()` method.
   *
   * This method will raise an error if you created the stream using `MessageStream.fromReadableStream`
   * as no `Response` is available.
   */
  async withResponse() {
    __classPrivateFieldSet(this, _MessageStream_catchingPromiseCreated, true, "f");
    const response = await __classPrivateFieldGet(this, _MessageStream_connectedPromise, "f");
    if (!response) {
      throw new Error("Could not resolve a `Response` object");
    }
    return {
      data: this,
      response,
      request_id: response.headers.get("request-id")
    };
  }
  /**
   * Intended for use on the frontend, consuming a stream produced with
   * `.toReadableStream()` on the backend.
   *
   * Note that messages sent to the model do not appear in `.on('message')`
   * in this context.
   */
  static fromReadableStream(stream) {
    const runner = new _MessageStream(null);
    runner._run(() => runner._fromReadableStream(stream));
    return runner;
  }
  static createMessage(messages, params, options, { logger } = {}) {
    const runner = new _MessageStream(params, { logger });
    for (const message of params.messages) {
      runner._addMessageParam(message);
    }
    __classPrivateFieldSet(runner, _MessageStream_params, { ...params, stream: true }, "f");
    runner._run(() => runner._createMessage(messages, { ...params, stream: true }, { ...options, headers: { ...options?.headers, [STAINLESS_HELPER_METHOD_HEADER]: "stream" } }));
    return runner;
  }
  _run(executor) {
    executor().then(() => {
      this._emitFinal();
      this._emit("end");
    }, __classPrivateFieldGet(this, _MessageStream_handleError, "f"));
  }
  _addMessageParam(message) {
    this.messages.push(message);
  }
  _addMessage(message, emit = true) {
    this.receivedMessages.push(message);
    if (emit) {
      this._emit("message", message);
    }
  }
  async _createMessage(messages, params, options) {
    const signal = options?.signal;
    let abortHandler;
    if (signal) {
      if (signal.aborted)
        this.controller.abort();
      abortHandler = this.controller.abort.bind(this.controller);
      signal.addEventListener("abort", abortHandler);
    }
    try {
      __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_beginRequest).call(this);
      const { response, data: stream } = await messages.create({ ...params, stream: true }, { ...options, signal: this.controller.signal }).withResponse();
      this._connected(response);
      for await (const event of stream) {
        __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_addStreamEvent).call(this, event);
      }
      if (stream.controller.signal?.aborted) {
        throw new APIUserAbortError();
      }
      __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_endRequest).call(this);
    } finally {
      if (signal && abortHandler) {
        signal.removeEventListener("abort", abortHandler);
      }
    }
  }
  _connected(response) {
    if (this.ended)
      return;
    __classPrivateFieldSet(this, _MessageStream_response, response, "f");
    __classPrivateFieldSet(this, _MessageStream_request_id, response?.headers.get("request-id"), "f");
    __classPrivateFieldGet(this, _MessageStream_resolveConnectedPromise, "f").call(this, response);
    this._emit("connect");
  }
  get ended() {
    return __classPrivateFieldGet(this, _MessageStream_ended, "f");
  }
  get errored() {
    return __classPrivateFieldGet(this, _MessageStream_errored, "f");
  }
  get aborted() {
    return __classPrivateFieldGet(this, _MessageStream_aborted, "f");
  }
  abort() {
    this.controller.abort();
  }
  /**
   * Adds the listener function to the end of the listeners array for the event.
   * No checks are made to see if the listener has already been added. Multiple calls passing
   * the same combination of event and listener will result in the listener being added, and
   * called, multiple times.
   * @returns this MessageStream, so that calls can be chained
   */
  on(event, listener) {
    const listeners = __classPrivateFieldGet(this, _MessageStream_listeners, "f")[event] || (__classPrivateFieldGet(this, _MessageStream_listeners, "f")[event] = []);
    listeners.push({ listener });
    return this;
  }
  /**
   * Removes the specified listener from the listener array for the event.
   * off() will remove, at most, one instance of a listener from the listener array. If any single
   * listener has been added multiple times to the listener array for the specified event, then
   * off() must be called multiple times to remove each instance.
   * @returns this MessageStream, so that calls can be chained
   */
  off(event, listener) {
    const listeners = __classPrivateFieldGet(this, _MessageStream_listeners, "f")[event];
    if (!listeners)
      return this;
    const index = listeners.findIndex((l) => l.listener === listener);
    if (index >= 0)
      listeners.splice(index, 1);
    return this;
  }
  /**
   * Adds a one-time listener function for the event. The next time the event is triggered,
   * this listener is removed and then invoked.
   * @returns this MessageStream, so that calls can be chained
   */
  once(event, listener) {
    const listeners = __classPrivateFieldGet(this, _MessageStream_listeners, "f")[event] || (__classPrivateFieldGet(this, _MessageStream_listeners, "f")[event] = []);
    listeners.push({ listener, once: true });
    return this;
  }
  /**
   * This is similar to `.once()`, but returns a Promise that resolves the next time
   * the event is triggered, instead of calling a listener callback.
   * @returns a Promise that resolves the next time given event is triggered,
   * or rejects if an error is emitted.  (If you request the 'error' event,
   * returns a promise that resolves with the error).
   *
   * Example:
   *
   *   const message = await stream.emitted('message') // rejects if the stream errors
   */
  emitted(event) {
    return new Promise((resolve, reject) => {
      __classPrivateFieldSet(this, _MessageStream_catchingPromiseCreated, true, "f");
      if (event !== "error")
        this.once("error", reject);
      this.once(event, resolve);
    });
  }
  async done() {
    __classPrivateFieldSet(this, _MessageStream_catchingPromiseCreated, true, "f");
    await __classPrivateFieldGet(this, _MessageStream_endPromise, "f");
  }
  get currentMessage() {
    return __classPrivateFieldGet(this, _MessageStream_currentMessageSnapshot, "f");
  }
  /**
   * @returns a promise that resolves with the the final assistant Message response,
   * or rejects if an error occurred or the stream ended prematurely without producing a Message.
   * If structured outputs were used, this will be a ParsedMessage with a `parsed_output` field.
   */
  async finalMessage() {
    await this.done();
    return __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_getFinalMessage).call(this);
  }
  /**
   * @returns a promise that resolves with the the final assistant Message's text response, concatenated
   * together if there are more than one text blocks.
   * Rejects if an error occurred or the stream ended prematurely without producing a Message.
   */
  async finalText() {
    await this.done();
    return __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_getFinalText).call(this);
  }
  _emit(event, ...args) {
    if (__classPrivateFieldGet(this, _MessageStream_ended, "f"))
      return;
    if (event === "end") {
      __classPrivateFieldSet(this, _MessageStream_ended, true, "f");
      __classPrivateFieldGet(this, _MessageStream_resolveEndPromise, "f").call(this);
    }
    const listeners = __classPrivateFieldGet(this, _MessageStream_listeners, "f")[event];
    if (listeners) {
      __classPrivateFieldGet(this, _MessageStream_listeners, "f")[event] = listeners.filter((l) => !l.once);
      listeners.forEach(({ listener }) => listener(...args));
    }
    if (event === "abort") {
      const error = args[0];
      if (!__classPrivateFieldGet(this, _MessageStream_catchingPromiseCreated, "f") && !listeners?.length) {
        Promise.reject(error);
      }
      __classPrivateFieldGet(this, _MessageStream_rejectConnectedPromise, "f").call(this, error);
      __classPrivateFieldGet(this, _MessageStream_rejectEndPromise, "f").call(this, error);
      this._emit("end");
      return;
    }
    if (event === "error") {
      const error = args[0];
      if (!__classPrivateFieldGet(this, _MessageStream_catchingPromiseCreated, "f") && !listeners?.length) {
        Promise.reject(error);
      }
      __classPrivateFieldGet(this, _MessageStream_rejectConnectedPromise, "f").call(this, error);
      __classPrivateFieldGet(this, _MessageStream_rejectEndPromise, "f").call(this, error);
      this._emit("end");
    }
  }
  _emitFinal() {
    const finalMessage = this.receivedMessages.at(-1);
    if (finalMessage) {
      this._emit("finalMessage", __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_getFinalMessage).call(this));
    }
  }
  async _fromReadableStream(readableStream, options) {
    const signal = options?.signal;
    let abortHandler;
    if (signal) {
      if (signal.aborted)
        this.controller.abort();
      abortHandler = this.controller.abort.bind(this.controller);
      signal.addEventListener("abort", abortHandler);
    }
    try {
      __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_beginRequest).call(this);
      this._connected(null);
      const stream = Stream.fromReadableStream(readableStream, this.controller);
      for await (const event of stream) {
        __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_addStreamEvent).call(this, event);
      }
      if (stream.controller.signal?.aborted) {
        throw new APIUserAbortError();
      }
      __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_endRequest).call(this);
    } finally {
      if (signal && abortHandler) {
        signal.removeEventListener("abort", abortHandler);
      }
    }
  }
  [(_MessageStream_currentMessageSnapshot = /* @__PURE__ */ new WeakMap(), _MessageStream_params = /* @__PURE__ */ new WeakMap(), _MessageStream_connectedPromise = /* @__PURE__ */ new WeakMap(), _MessageStream_resolveConnectedPromise = /* @__PURE__ */ new WeakMap(), _MessageStream_rejectConnectedPromise = /* @__PURE__ */ new WeakMap(), _MessageStream_endPromise = /* @__PURE__ */ new WeakMap(), _MessageStream_resolveEndPromise = /* @__PURE__ */ new WeakMap(), _MessageStream_rejectEndPromise = /* @__PURE__ */ new WeakMap(), _MessageStream_listeners = /* @__PURE__ */ new WeakMap(), _MessageStream_ended = /* @__PURE__ */ new WeakMap(), _MessageStream_errored = /* @__PURE__ */ new WeakMap(), _MessageStream_aborted = /* @__PURE__ */ new WeakMap(), _MessageStream_catchingPromiseCreated = /* @__PURE__ */ new WeakMap(), _MessageStream_response = /* @__PURE__ */ new WeakMap(), _MessageStream_request_id = /* @__PURE__ */ new WeakMap(), _MessageStream_logger = /* @__PURE__ */ new WeakMap(), _MessageStream_handleError = /* @__PURE__ */ new WeakMap(), _MessageStream_instances = /* @__PURE__ */ new WeakSet(), _MessageStream_getFinalMessage = /* @__PURE__ */ __name(function _MessageStream_getFinalMessage2() {
    if (this.receivedMessages.length === 0) {
      throw new AnthropicError("stream ended without producing a Message with role=assistant");
    }
    return this.receivedMessages.at(-1);
  }, "_MessageStream_getFinalMessage"), _MessageStream_getFinalText = /* @__PURE__ */ __name(function _MessageStream_getFinalText2() {
    if (this.receivedMessages.length === 0) {
      throw new AnthropicError("stream ended without producing a Message with role=assistant");
    }
    const textBlocks = this.receivedMessages.at(-1).content.filter((block) => block.type === "text").map((block) => block.text);
    if (textBlocks.length === 0) {
      throw new AnthropicError("stream ended without producing a content block with type=text");
    }
    return textBlocks.join(" ");
  }, "_MessageStream_getFinalText"), _MessageStream_beginRequest = /* @__PURE__ */ __name(function _MessageStream_beginRequest2() {
    if (this.ended)
      return;
    __classPrivateFieldSet(this, _MessageStream_currentMessageSnapshot, void 0, "f");
  }, "_MessageStream_beginRequest"), _MessageStream_addStreamEvent = /* @__PURE__ */ __name(function _MessageStream_addStreamEvent2(event) {
    if (this.ended)
      return;
    const messageSnapshot = __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_accumulateMessage).call(this, event);
    this._emit("streamEvent", event, messageSnapshot);
    switch (event.type) {
      case "content_block_delta": {
        const content = messageSnapshot.content.at(-1);
        switch (event.delta.type) {
          case "text_delta": {
            if (content.type === "text") {
              this._emit("text", event.delta.text, content.text || "");
            }
            break;
          }
          case "citations_delta": {
            if (content.type === "text") {
              this._emit("citation", event.delta.citation, content.citations ?? []);
            }
            break;
          }
          case "input_json_delta": {
            if (tracksToolInput2(content) && __classPrivateFieldGet(this, _MessageStream_listeners, "f").inputJson?.length) {
              this._emit("inputJson", event.delta.partial_json, content.input);
            }
            break;
          }
          case "thinking_delta": {
            if (content.type === "thinking") {
              this._emit("thinking", event.delta.thinking, content.thinking);
            }
            break;
          }
          case "signature_delta": {
            if (content.type === "thinking") {
              this._emit("signature", content.signature);
            }
            break;
          }
          default:
            checkNever2(event.delta);
        }
        break;
      }
      case "message_stop": {
        this._addMessageParam(messageSnapshot);
        this._addMessage(maybeParseMessage(messageSnapshot, __classPrivateFieldGet(this, _MessageStream_params, "f"), { logger: __classPrivateFieldGet(this, _MessageStream_logger, "f") }), true);
        break;
      }
      case "content_block_stop": {
        this._emit("contentBlock", messageSnapshot.content.at(-1));
        break;
      }
      case "message_start": {
        __classPrivateFieldSet(this, _MessageStream_currentMessageSnapshot, messageSnapshot, "f");
        break;
      }
      case "content_block_start":
      case "message_delta":
        break;
    }
  }, "_MessageStream_addStreamEvent"), _MessageStream_endRequest = /* @__PURE__ */ __name(function _MessageStream_endRequest2() {
    if (this.ended) {
      throw new AnthropicError(`stream has ended, this shouldn't happen`);
    }
    const snapshot = __classPrivateFieldGet(this, _MessageStream_currentMessageSnapshot, "f");
    if (!snapshot) {
      throw new AnthropicError(`request ended without sending any chunks`);
    }
    __classPrivateFieldSet(this, _MessageStream_currentMessageSnapshot, void 0, "f");
    return maybeParseMessage(snapshot, __classPrivateFieldGet(this, _MessageStream_params, "f"), { logger: __classPrivateFieldGet(this, _MessageStream_logger, "f") });
  }, "_MessageStream_endRequest"), _MessageStream_accumulateMessage = /* @__PURE__ */ __name(function _MessageStream_accumulateMessage2(event) {
    let snapshot = __classPrivateFieldGet(this, _MessageStream_currentMessageSnapshot, "f");
    if (event.type === "message_start") {
      if (snapshot) {
        throw new AnthropicError(`Unexpected event order, got ${event.type} before receiving "message_stop"`);
      }
      return event.message;
    }
    if (!snapshot) {
      throw new AnthropicError(`Unexpected event order, got ${event.type} before "message_start"`);
    }
    switch (event.type) {
      case "message_stop":
        return snapshot;
      case "message_delta":
        snapshot.stop_reason = event.delta.stop_reason;
        snapshot.stop_sequence = event.delta.stop_sequence;
        if (event.delta.stop_details != null) {
          snapshot.stop_details = event.delta.stop_details;
        }
        snapshot.usage.output_tokens = event.usage.output_tokens;
        if (event.usage.input_tokens != null) {
          snapshot.usage.input_tokens = event.usage.input_tokens;
        }
        if (event.usage.cache_creation_input_tokens != null) {
          snapshot.usage.cache_creation_input_tokens = event.usage.cache_creation_input_tokens;
        }
        if (event.usage.cache_read_input_tokens != null) {
          snapshot.usage.cache_read_input_tokens = event.usage.cache_read_input_tokens;
        }
        if (event.usage.server_tool_use != null) {
          snapshot.usage.server_tool_use = event.usage.server_tool_use;
        }
        return snapshot;
      case "content_block_start":
        snapshot.content.push({ ...event.content_block });
        return snapshot;
      case "content_block_delta": {
        const snapshotContent = snapshot.content.at(event.index);
        switch (event.delta.type) {
          case "text_delta": {
            if (snapshotContent?.type === "text") {
              snapshot.content[event.index] = {
                ...snapshotContent,
                text: (snapshotContent.text || "") + event.delta.text
              };
            }
            break;
          }
          case "citations_delta": {
            if (snapshotContent?.type === "text") {
              snapshot.content[event.index] = {
                ...snapshotContent,
                citations: [...snapshotContent.citations ?? [], event.delta.citation]
              };
            }
            break;
          }
          case "input_json_delta": {
            if (snapshotContent && tracksToolInput2(snapshotContent)) {
              const jsonBuf = (snapshotContent[JSON_BUF_PROPERTY] || "") + event.delta.partial_json;
              snapshot.content[event.index] = withLazyInput(snapshotContent, jsonBuf);
            }
            break;
          }
          case "thinking_delta": {
            if (snapshotContent?.type === "thinking") {
              snapshot.content[event.index] = {
                ...snapshotContent,
                thinking: snapshotContent.thinking + event.delta.thinking
              };
            }
            break;
          }
          case "signature_delta": {
            if (snapshotContent?.type === "thinking") {
              snapshot.content[event.index] = {
                ...snapshotContent,
                signature: event.delta.signature
              };
            }
            break;
          }
          default:
            checkNever2(event.delta);
        }
        return snapshot;
      }
      case "content_block_stop": {
        const snapshotContent = snapshot.content.at(event.index);
        if (snapshotContent && tracksToolInput2(snapshotContent) && JSON_BUF_PROPERTY in snapshotContent) {
          Object.defineProperty(snapshotContent, "input", {
            value: snapshotContent.input,
            enumerable: true,
            configurable: true,
            writable: true
          });
        }
        return snapshot;
      }
    }
  }, "_MessageStream_accumulateMessage"), Symbol.asyncIterator)]() {
    const pushQueue = [];
    const readQueue = [];
    let done = false;
    this.on("streamEvent", (event) => {
      const reader = readQueue.shift();
      if (reader) {
        reader.resolve(event);
      } else {
        pushQueue.push(event);
      }
    });
    this.on("end", () => {
      done = true;
      for (const reader of readQueue) {
        reader.resolve(void 0);
      }
      readQueue.length = 0;
    });
    this.on("abort", (err) => {
      done = true;
      for (const reader of readQueue) {
        reader.reject(err);
      }
      readQueue.length = 0;
    });
    this.on("error", (err) => {
      done = true;
      for (const reader of readQueue) {
        reader.reject(err);
      }
      readQueue.length = 0;
    });
    return {
      next: /* @__PURE__ */ __name(async () => {
        if (!pushQueue.length) {
          if (done) {
            return { value: void 0, done: true };
          }
          return new Promise((resolve, reject) => readQueue.push({ resolve, reject })).then((chunk2) => chunk2 ? { value: chunk2, done: false } : { value: void 0, done: true });
        }
        const chunk = pushQueue.shift();
        return { value: chunk, done: false };
      }, "next"),
      return: /* @__PURE__ */ __name(async () => {
        this.abort();
        return { value: void 0, done: true };
      }, "return")
    };
  }
  toReadableStream() {
    const stream = new Stream(this[Symbol.asyncIterator].bind(this), this.controller);
    return stream.toReadableStream();
  }
};
function checkNever2(x) {
}
__name(checkNever2, "checkNever");

// node_modules/@anthropic-ai/sdk/resources/messages/batches.mjs
init_modules_watch_stub();
var Batches2 = class extends APIResource {
  static {
    __name(this, "Batches");
  }
  /**
   * Send a batch of Message creation requests.
   *
   * The Message Batches API can be used to process multiple Messages API requests at
   * once. Once a Message Batch is created, it begins processing immediately. Batches
   * can take up to 24 hours to complete.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://platform.claude.com/docs/en/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const messageBatch = await client.messages.batches.create({
   *   requests: [
   *     {
   *       custom_id: 'my-custom-id-1',
   *       params: {
   *         max_tokens: 1024,
   *         messages: [
   *           { content: 'Hello, world', role: 'user' },
   *         ],
   *         model: 'claude-opus-4-6',
   *       },
   *     },
   *   ],
   * });
   * ```
   */
  create(params, options) {
    const { user_profile_id, ...body } = params;
    return this._client.post("/v1/messages/batches", {
      body,
      ...options,
      headers: buildHeaders([
        { ...user_profile_id != null ? { "anthropic-user-profile-id": user_profile_id } : void 0 },
        options?.headers
      ])
    });
  }
  /**
   * This endpoint is idempotent and can be used to poll for Message Batch
   * completion. To access the results of a Message Batch, make a request to the
   * `results_url` field in the response.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://platform.claude.com/docs/en/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const messageBatch = await client.messages.batches.retrieve(
   *   'message_batch_id',
   * );
   * ```
   */
  retrieve(messageBatchID, options) {
    return this._client.get(path`/v1/messages/batches/${messageBatchID}`, options);
  }
  /**
   * List all Message Batches within a Workspace. Most recently created batches are
   * returned first.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://platform.claude.com/docs/en/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const messageBatch of client.messages.batches.list()) {
   *   // ...
   * }
   * ```
   */
  list(query = {}, options) {
    return this._client.getAPIList("/v1/messages/batches", Page, { query, ...options });
  }
  /**
   * Delete a Message Batch.
   *
   * Message Batches can only be deleted once they've finished processing. If you'd
   * like to delete an in-progress batch, you must first cancel it.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://platform.claude.com/docs/en/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const deletedMessageBatch =
   *   await client.messages.batches.delete('message_batch_id');
   * ```
   */
  delete(messageBatchID, options) {
    return this._client.delete(path`/v1/messages/batches/${messageBatchID}`, options);
  }
  /**
   * Batches may be canceled any time before processing ends. Once cancellation is
   * initiated, the batch enters a `canceling` state, at which time the system may
   * complete any in-progress, non-interruptible requests before finalizing
   * cancellation.
   *
   * The number of canceled requests is specified in `request_counts`. To determine
   * which requests were canceled, check the individual results within the batch.
   * Note that cancellation may not result in any canceled requests if they were
   * non-interruptible.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://platform.claude.com/docs/en/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const messageBatch = await client.messages.batches.cancel(
   *   'message_batch_id',
   * );
   * ```
   */
  cancel(messageBatchID, options) {
    return this._client.post(path`/v1/messages/batches/${messageBatchID}/cancel`, options);
  }
  /**
   * Streams the results of a Message Batch as a `.jsonl` file.
   *
   * Each line in the file is a JSON object containing the result of a single request
   * in the Message Batch. Results are not guaranteed to be in the same order as
   * requests. Use the `custom_id` field to match results to requests.
   *
   * Learn more about the Message Batches API in our
   * [user guide](https://platform.claude.com/docs/en/build-with-claude/batch-processing)
   *
   * @example
   * ```ts
   * const messageBatchIndividualResponse =
   *   await client.messages.batches.results('message_batch_id');
   * ```
   */
  async results(messageBatchID, options) {
    const batch = await this.retrieve(messageBatchID);
    if (!batch.results_url) {
      throw new AnthropicError(`No batch \`results_url\`; Has it finished processing? ${batch.processing_status} - ${batch.id}`);
    }
    return this._client.get(batch.results_url, {
      ...options,
      headers: buildHeaders([{ Accept: "application/binary" }, options?.headers]),
      stream: true,
      __binaryResponse: true
    })._thenUnwrap((_, props) => JSONLDecoder.fromResponse(props.response, props.controller));
  }
};

// node_modules/@anthropic-ai/sdk/resources/messages/messages.mjs
var Messages2 = class extends APIResource {
  static {
    __name(this, "Messages");
  }
  constructor() {
    super(...arguments);
    this.batches = new Batches2(this._client);
  }
  create(params, options) {
    const { user_profile_id, ...body } = params;
    if (body.model in DEPRECATED_MODELS2) {
      console.warn(`The model '${body.model}' is deprecated and will reach end-of-life on ${DEPRECATED_MODELS2[body.model]}
Please migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.`);
    }
    if (MODELS_TO_WARN_WITH_THINKING_ENABLED2.includes(body.model) && body.thinking && body.thinking.type === "enabled") {
      console.warn(`Using Claude with ${body.model} and 'thinking.type=enabled' is deprecated. Use 'thinking.type=adaptive' instead which results in better model performance in our testing: https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking`);
    }
    let timeout = this._client._options.timeout;
    if (!body.stream && timeout == null) {
      const maxNonstreamingTokens = MODEL_NONSTREAMING_TOKENS[body.model] ?? void 0;
      timeout = this._client.calculateNonstreamingTimeout(body.max_tokens, maxNonstreamingTokens);
    }
    const helperHeader2 = stainlessHelperHeader(body.tools, body.messages);
    return this._client.post("/v1/messages", {
      body,
      timeout: timeout ?? 6e5,
      ...options,
      headers: buildHeaders([
        { ...user_profile_id != null ? { "anthropic-user-profile-id": user_profile_id } : void 0 },
        helperHeader2,
        options?.headers
      ]),
      stream: params.stream ?? false
    });
  }
  /**
   * Send a structured list of input messages with text and/or image content, along with an expected `output_config.format` and
   * the response will be automatically parsed and available in the `parsed_output` property of the message.
   *
   * @example
   * ```ts
   * const message = await client.messages.parse({
   *   model: 'claude-sonnet-4-5-20250929',
   *   max_tokens: 1024,
   *   messages: [{ role: 'user', content: 'What is 2+2?' }],
   *   output_config: {
   *     format: zodOutputFormat(z.object({ answer: z.number() })),
   *   },
   * });
   *
   * console.log(message.parsed_output?.answer); // 4
   * ```
   */
  parse(params, options) {
    return this.create(params, options).then((message) => parseMessage(message, params, { logger: this._client.logger ?? console }));
  }
  /**
   * Create a Message stream.
   *
   * If `output_config.format` is provided with a parseable format (like `zodOutputFormat()`),
   * the final message will include a `parsed_output` property with the parsed content.
   *
   * @example
   * ```ts
   * const stream = client.messages.stream({
   *   model: 'claude-sonnet-4-5-20250929',
   *   max_tokens: 1024,
   *   messages: [{ role: 'user', content: 'What is 2+2?' }],
   *   output_config: {
   *     format: zodOutputFormat(z.object({ answer: z.number() })),
   *   },
   * });
   *
   * const message = await stream.finalMessage();
   * console.log(message.parsed_output?.answer); // 4
   * ```
   */
  stream(body, options) {
    return MessageStream.createMessage(this, body, options, { logger: this._client.logger ?? console });
  }
  /**
   * Count the number of tokens in a Message.
   *
   * The Token Count API can be used to count the number of tokens in a Message,
   * including tools, images, and documents, without creating it.
   *
   * Learn more about token counting in our
   * [user guide](https://platform.claude.com/docs/en/build-with-claude/token-counting)
   *
   * @example
   * ```ts
   * const messageTokensCount =
   *   await client.messages.countTokens({
   *     messages: [{ content: 'Hello, world', role: 'user' }],
   *     model: 'claude-opus-4-6',
   *   });
   * ```
   */
  countTokens(params, options) {
    const { user_profile_id, ...body } = params;
    return this._client.post("/v1/messages/count_tokens", {
      body,
      ...options,
      headers: buildHeaders([
        { ...user_profile_id != null ? { "anthropic-user-profile-id": user_profile_id } : void 0 },
        options?.headers
      ])
    });
  }
};
var DEPRECATED_MODELS2 = {};
var MODELS_TO_WARN_WITH_THINKING_ENABLED2 = ["claude-mythos-preview", "claude-opus-4-6"];
Messages2.Batches = Batches2;

// node_modules/@anthropic-ai/sdk/resources/models.mjs
init_modules_watch_stub();
var Models2 = class extends APIResource {
  static {
    __name(this, "Models");
  }
  /**
   * Get a specific model.
   *
   * The Models API response can be used to determine information about a specific
   * model or resolve a model alias to a model ID.
   */
  retrieve(modelID, params = {}, options) {
    const { betas } = params ?? {};
    return this._client.get(path`/v1/models/${modelID}`, {
      ...options,
      headers: buildHeaders([
        { ...betas?.toString() != null ? { "anthropic-beta": betas?.toString() } : void 0 },
        options?.headers
      ])
    });
  }
  /**
   * List available models.
   *
   * The Models API response can be used to determine which models are available for
   * use in the API. More recently released models are listed first.
   */
  list(params = {}, options) {
    const { betas, ...query } = params ?? {};
    return this._client.getAPIList("/v1/models", Page, {
      query,
      ...options,
      headers: buildHeaders([
        { ...betas?.toString() != null ? { "anthropic-beta": betas?.toString() } : void 0 },
        options?.headers
      ])
    });
  }
};

// node_modules/@anthropic-ai/sdk/client.mjs
var _BaseAnthropic_instances;
var _a;
var _BaseAnthropic_encoder;
var _BaseAnthropic_baseURLOverridden;
var HUMAN_PROMPT = "\\n\\nHuman:";
var AI_PROMPT = "\\n\\nAssistant:";
var BaseAnthropic = class {
  static {
    __name(this, "BaseAnthropic");
  }
  /**
   * The active credential provider. Default credential resolution runs once
   * at construction time. If it fails, the error is surfaced on every
   * request and the client must be reconstructed — there is no retry path.
   *
   * Clones returned by {@link withOptions} share the parent's auth state
   * (provider, token cache, pending resolution, and any resolution error)
   * unless the caller passes an explicit `apiKey`, `authToken`,
   * `credentials`, `config`, or `profile` override.
   */
  get credentials() {
    return this._authState.provider;
  }
  /**
   * API Client for interfacing with the Anthropic API.
   *
   * @param {string | null | undefined} [opts.apiKey=process.env['ANTHROPIC_API_KEY'] ?? null]
   * @param {string | null | undefined} [opts.authToken=process.env['ANTHROPIC_AUTH_TOKEN'] ?? null]
   * @param {string | null | undefined} [opts.webhookKey=process.env['ANTHROPIC_WEBHOOK_SIGNING_KEY'] ?? null]
   * @param {string} [opts.baseURL=process.env['ANTHROPIC_BASE_URL'] ?? https://api.anthropic.com] - Override the default base URL for the API.
   * @param {number} [opts.timeout=10 minutes] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
   * @param {MergedRequestInit} [opts.fetchOptions] - Additional `RequestInit` options to be passed to `fetch` calls.
   * @param {Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
   * @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
   * @param {HeadersLike} opts.defaultHeaders - Default headers to include with every request to the API.
   * @param {Record<string, string | undefined>} opts.defaultQuery - Default query parameters to include with every request to the API.
   * @param {boolean} [opts.dangerouslyAllowBrowser=false] - By default, client-side use of this library is not allowed, as it risks exposing your secret API credentials to attackers.
   */
  constructor({ baseURL = readEnv("ANTHROPIC_BASE_URL"), apiKey, authToken, webhookKey = readEnv("ANTHROPIC_WEBHOOK_SIGNING_KEY") ?? null, ...opts } = {}) {
    _BaseAnthropic_instances.add(this);
    this._requestAuthFlags = /* @__PURE__ */ new WeakMap();
    _BaseAnthropic_encoder.set(this, void 0);
    if (apiKey === void 0) {
      apiKey = opts.profile != null ? null : readEnv("ANTHROPIC_API_KEY") ?? null;
    }
    if (authToken === void 0) {
      authToken = opts.profile != null ? null : readEnv("ANTHROPIC_AUTH_TOKEN") ?? null;
    }
    if (opts.profile != null && (opts.credentials != null || opts.config != null)) {
      throw new TypeError("Pass at most one of `profile`, `credentials`, or `config`.");
    }
    const options = {
      apiKey,
      authToken,
      webhookKey,
      ...opts,
      baseURL: baseURL || `https://api.anthropic.com`
    };
    if (!options.dangerouslyAllowBrowser && isRunningInBrowser()) {
      throw new AnthropicError("It looks like you're running in a browser-like environment.\n\nThis is disabled by default, as it risks exposing your secret API credentials to attackers.\nIf you understand the risks and have appropriate mitigations in place,\nyou can set the `dangerouslyAllowBrowser` option to `true`, e.g.,\n\nnew Anthropic({ apiKey, dangerouslyAllowBrowser: true });\n");
    }
    this.baseURL = options.baseURL;
    this._baseURLIsExplicit = opts.__baseURLIsExplicit ?? !!baseURL;
    this.timeout = options.timeout ?? _a.DEFAULT_TIMEOUT;
    this.logger = options.logger ?? console;
    this.logLevel = defaultLogLevel;
    this.logLevel = parseLogLevel(options.logLevel, "ClientOptions.logLevel", loggerFor(this)) ?? parseLogLevel(readEnv("ANTHROPIC_LOG"), "process.env['ANTHROPIC_LOG']", loggerFor(this)) ?? defaultLogLevel;
    this.fetchOptions = options.fetchOptions;
    this.maxRetries = options.maxRetries ?? 2;
    this.fetch = options.fetch ?? getDefaultFetch();
    __classPrivateFieldSet(this, _BaseAnthropic_encoder, FallbackEncoder, "f");
    this.middleware = [...options.middleware ?? []];
    const customHeadersEnv = readEnv("ANTHROPIC_CUSTOM_HEADERS");
    if (customHeadersEnv) {
      const parsed = {};
      for (const line of customHeadersEnv.split("\n")) {
        const colon = line.indexOf(":");
        if (colon >= 0) {
          parsed[line.substring(0, colon).trim()] = line.substring(colon + 1).trim();
        }
      }
      options.defaultHeaders = { ...parsed, ...options.defaultHeaders };
    }
    const inherited = opts.__auth;
    delete options.__auth;
    delete options.__baseURLIsExplicit;
    this._options = options;
    this.apiKey = typeof apiKey === "string" ? apiKey : null;
    this.authToken = authToken;
    this.webhookKey = webhookKey;
    if (inherited) {
      this._authState = inherited;
      if (!this._baseURLIsExplicit && inherited.baseURL) {
        this.baseURL = inherited.baseURL;
      }
    } else {
      this._authState = { provider: null, tokenCache: null, resolution: null, error: null, extraHeaders: {} };
      if (this.apiKey == null && this.authToken == null) {
        const credentials = options.credentials ?? null;
        if (credentials) {
          this._authState.provider = credentials;
          this._authState.tokenCache = this._makeTokenCache(credentials);
        } else if (options.config != null) {
          const result = resolveCredentialsFromConfig(options.config, this._credentialResolverOptions());
          this._authState.provider = result.provider;
          this._authState.tokenCache = this._makeTokenCache(result.provider);
          this._authState.extraHeaders = result.extraHeaders;
          this._applyCredentialBaseURL(result.baseURL);
        } else if (options.profile != null) {
          this._authState.resolution = this._resolveDefaultCredentials(options.profile);
        } else if (this._shouldResolveDefaultCredentials()) {
          this._authState.resolution = this._resolveDefaultCredentials();
        }
      }
    }
  }
  /**
   * Whether to lazily resolve auth from the default credential chain when no
   * explicit auth is configured. Called once from the constructor, so
   * overrides must not depend on subclass instance state. Subclasses that
   * bring their own auth scheme return false so unrelated local credentials
   * are never resolved or allowed to supply a base URL.
   */
  _shouldResolveDefaultCredentials() {
    return true;
  }
  /**
   * Stores a profile/config-supplied base URL on the shared auth state and, if
   * the caller did not pin `baseURL` via constructor option or env, adopts it
   * as this client's outbound API host. Precedence: ctor opt > env > profile >
   * hardcoded default.
   */
  _applyCredentialBaseURL(baseURL) {
    if (!baseURL)
      return;
    const normalized = baseURL.replace(/\/+$/, "");
    this._authState.baseURL = normalized;
    if (!this._baseURLIsExplicit) {
      this.baseURL = normalized;
    }
  }
  /**
   * Options bag passed into the credential chain. `baseURL` here is only the
   * fallback host for the token-exchange POST when the config itself omits
   * `base_url`; the chain returns the config's own `base_url` (if any) on
   * {@link CredentialResult.baseURL}, which {@link _applyCredentialBaseURL}
   * then adopts for outbound API requests. The two are deliberately decoupled
   * so this fallback never round-trips into precedence.
   */
  _credentialResolverOptions() {
    return {
      baseURL: this.baseURL,
      fetch: this._credentialsFetch(),
      userAgent: this.getUserAgent(),
      onCacheWriteError: /* @__PURE__ */ __name((err) => {
        loggerFor(this).debug("credential cache write failed (best-effort)", err);
      }, "onCacheWriteError"),
      onSafetyWarning: /* @__PURE__ */ __name((msg) => {
        loggerFor(this).warn(msg);
      }, "onSafetyWarning")
    };
  }
  /**
   * A `Fetch` for first-party credential token-exchange requests (OIDC
   * federation jwt-bearer grants, user-OAuth refresh grants) that routes
   * through this client's middleware chain, so middleware observes token
   * traffic like any other request. Only client-level middleware applies:
   * a minted token is shared across requests, so attributing the exchange
   * to any one request's per-request middleware would be arbitrary. For the
   * same reason, `ctx.options` is undefined for these requests.
   */
  _credentialsFetch() {
    return wrapFetchWithMiddleware(this.fetch, this.middleware, void 0, this);
  }
  _makeTokenCache(provider) {
    return new TokenCache(provider, (err) => {
      loggerFor(this).debug("advisory token refresh failed; serving cached token", err);
    });
  }
  /**
   * Create a new client instance re-using the same options given to the current client with optional overriding.
   */
  withOptions(options) {
    const overridesStructuredAuth = "credentials" in options || "config" in options || "profile" in options;
    const overridesAuth = "apiKey" in options || "authToken" in options || overridesStructuredAuth;
    const internal = {
      ...this._options,
      // Only forward baseURL when the caller (or env) explicitly chose it.
      // For a non-explicit parent, this.baseURL may have been mutated to the
      // profile-resolved host; pinning that as the clone's options.baseURL
      // would make _options on the clone misreport caller intent and would
      // leave the clone stuck on the parent's host across an auth override.
      // The clone instead receives the construction-time value via
      // ...this._options above and re-adopts the profile host through the
      // shared _authState.baseURL + __baseURLIsExplicit=false path.
      ...this._baseURLIsExplicit ? { baseURL: this.baseURL } : {},
      maxRetries: this.maxRetries,
      timeout: this.timeout,
      logger: this.logger,
      logLevel: this.logLevel,
      fetch: this.fetch,
      fetchOptions: this.fetchOptions,
      middleware: this.middleware,
      apiKey: this.apiKey,
      authToken: this.authToken,
      webhookKey: this.webhookKey,
      // credentials: this.credentials is a no-op when __auth is shared (the
      // ctor takes the inherited path and ignores options.credentials); when
      // overridesAuth is true via apiKey/authToken only, it lets the clone
      // build a fresh TokenCache around the parent's provider.
      credentials: this.credentials,
      // When the caller passes a structured-credential override, drop inherited
      // structured-credential options so only `...options` supplies them —
      // otherwise an inherited `credentials`/`config`/`profile` would trip the
      // mutual-exclusion check or precedence over the override.
      ...overridesStructuredAuth ? { credentials: void 0, config: void 0, profile: void 0 } : {},
      ...options,
      // Always set __auth so any stale value from ...this._options is
      // overwritten. undefined means "build fresh auth from these options".
      __auth: overridesAuth ? void 0 : this._authState,
      __baseURLIsExplicit: "baseURL" in options ? true : this._baseURLIsExplicit
    };
    return new this.constructor(internal);
  }
  /**
   * Lazily resolves credentials from config files or environment variables.
   * Called once from the constructor when no explicit auth is provided, or
   * when an explicit `profile` was passed (in which case a missing/unresolved
   * profile is surfaced as an error instead of falling through to "no auth").
   * The returned promise is stored and awaited on the first request.
   */
  async _resolveDefaultCredentials(profile) {
    try {
      const result = await defaultCredentials(this._credentialResolverOptions(), profile);
      if (result) {
        this._authState.provider = result.provider;
        this._authState.tokenCache = this._makeTokenCache(result.provider);
        this._authState.extraHeaders = result.extraHeaders;
        this._applyCredentialBaseURL(result.baseURL);
      } else if (profile != null) {
        throw new AnthropicError(`Profile "${profile}" could not be resolved (no <config_dir>/configs/${profile}.json found).`);
      }
    } catch (err) {
      this._authState.error = err;
    } finally {
      this._authState.resolution = null;
    }
  }
  defaultQuery() {
    return this._options.defaultQuery;
  }
  validateHeaders({ values, nulls }) {
    if (values.get("x-api-key") || values.get("authorization")) {
      return;
    }
    if (this._authState.error) {
      throw this._authState.error;
    }
    if (this._authState.tokenCache || this._authState.resolution) {
      return;
    }
    if (this.apiKey && values.get("x-api-key")) {
      return;
    }
    if (nulls.has("x-api-key")) {
      return;
    }
    if (this.authToken && values.get("authorization")) {
      return;
    }
    if (nulls.has("authorization")) {
      return;
    }
    throw new Error('Could not resolve authentication method. Expected one of apiKey, authToken, credentials, config, or profile to be set. Or for one of the "X-Api-Key" or "Authorization" headers to be explicitly omitted');
  }
  _authFlags(opts) {
    let flags = this._requestAuthFlags.get(opts);
    if (!flags) {
      flags = { usedTokenCache: false, didRefreshFor401: false };
      this._requestAuthFlags.set(opts, flags);
    }
    return flags;
  }
  async authHeaders(opts) {
    if (this._authState.resolution) {
      await this._authState.resolution;
    }
    if (this._authState.error) {
      return void 0;
    }
    if (this._authState.tokenCache && this.apiKey == null) {
      const token = await this._authState.tokenCache.getToken();
      this._authFlags(opts).usedTokenCache = true;
      return buildHeaders([{ Authorization: `Bearer ${token}` }]);
    }
    return buildHeaders([await this.apiKeyAuth(opts), await this.bearerAuth(opts)]);
  }
  async apiKeyAuth(opts) {
    if (this.apiKey == null) {
      return void 0;
    }
    return buildHeaders([{ "X-Api-Key": this.apiKey }]);
  }
  async bearerAuth(opts) {
    if (this.authToken == null) {
      return void 0;
    }
    return buildHeaders([{ Authorization: `Bearer ${this.authToken}` }]);
  }
  stringifyQuery(query) {
    return stringifyQuery(query);
  }
  getUserAgent() {
    return `Anthropic/JS ${VERSION}`;
  }
  defaultIdempotencyKey() {
    return `stainless-node-retry-${uuid4()}`;
  }
  makeStatusError(status, error, message, headers) {
    return APIError.generate(status, error, message, headers);
  }
  buildURL(path2, query, defaultBaseURL) {
    const baseURL = !__classPrivateFieldGet(this, _BaseAnthropic_instances, "m", _BaseAnthropic_baseURLOverridden).call(this) && defaultBaseURL || this.baseURL;
    const url = isAbsoluteURL(path2) ? new URL(path2) : new URL(baseURL + (baseURL.endsWith("/") && path2.startsWith("/") ? path2.slice(1) : path2));
    const defaultQuery = this.defaultQuery();
    const pathQuery = Object.fromEntries(url.searchParams);
    if (!isEmptyObj(defaultQuery) || !isEmptyObj(pathQuery)) {
      query = { ...pathQuery, ...defaultQuery, ...query };
    }
    if (typeof query === "object" && query && !Array.isArray(query)) {
      url.search = this.stringifyQuery(query);
    }
    return url.toString();
  }
  _calculateNonstreamingTimeout(maxTokens) {
    const defaultTimeout = 10 * 60;
    const expectedTimeout = 60 * 60 * maxTokens / 128e3;
    if (expectedTimeout > defaultTimeout) {
      throw new AnthropicError("Streaming is required for operations that may take longer than 10 minutes. See https://github.com/anthropics/anthropic-sdk-typescript#streaming-responses for more details");
    }
    return defaultTimeout * 1e3;
  }
  /**
   * Used as a callback for mutating the given `FinalRequestOptions` object.
   */
  async prepareOptions(options) {
  }
  /**
   * Used as a callback for mutating the given `RequestInit` object.
   *
   * This is useful for cases where you want to add certain headers based off of
   * the request properties, e.g. `method` or `url`.
   *
   * Runs after all middleware (including {@link backendMiddleware}),
   * immediately before each underlying fetch call, so it sees exactly what
   * goes over the wire. Middleware may replay a request by calling `next()`
   * more than once, so this hook can run multiple times per attempt:
   * overrides must be idempotent and overwrite headers from a previous
   * invocation rather than append to them.
   */
  async prepareRequest(request, { url, options }) {
    if (this._authState.tokenCache && this.apiKey == null) {
      const headers = request.headers instanceof Headers ? request.headers : new Headers(request.headers);
      for (const [k, v] of Object.entries(this._authState.extraHeaders)) {
        if (!headers.has(k))
          headers.set(k, v);
      }
      const existing = headers.get("anthropic-beta")?.split(",").map((s) => s.trim());
      if (!existing?.includes(OAUTH_API_BETA_HEADER)) {
        headers.append("anthropic-beta", OAUTH_API_BETA_HEADER);
      }
      request.headers = headers;
    }
  }
  /**
   * Internal {@link Middleware} composed innermost in the chain — inside both
   * client-level and per-request middleware, immediately around the underlying
   * `fetch`. Subclasses for third-party backends override this to adapt the
   * canonical Anthropic-shaped request to the backend's wire shape (URL/body
   * rewriting, request signing) and to normalize the wire response back to the
   * canonical shape (e.g. AWS EventStream to SSE).
   *
   * Running inside the user's middleware means user middleware always observes
   * canonical Anthropic-shaped traffic, and the adaptation re-runs (e.g.
   * re-signs) on every `next()` invocation, covering whatever the middleware
   * mutated.
   *
   * Errors thrown here follow the middleware error policy: they propagate to
   * the caller as-is — no retries, no `APIConnectionError` wrapping — unless
   * retryable (see {@link Middleware}); throw a `RetryableError` to opt into
   * the retry path.
   */
  backendMiddleware() {
    return [];
  }
  get(path2, opts) {
    return this.methodRequest("get", path2, opts);
  }
  post(path2, opts) {
    return this.methodRequest("post", path2, opts);
  }
  patch(path2, opts) {
    return this.methodRequest("patch", path2, opts);
  }
  put(path2, opts) {
    return this.methodRequest("put", path2, opts);
  }
  delete(path2, opts) {
    return this.methodRequest("delete", path2, opts);
  }
  methodRequest(method, path2, opts) {
    return this.request(Promise.resolve(opts).then((opts2) => {
      return { method, path: path2, ...opts2 };
    }));
  }
  request(options, remainingRetries = null) {
    return new APIPromise(this, this.makeRequest(options, remainingRetries, void 0));
  }
  async makeRequest(optionsInput, retriesRemaining, retryOfRequestLogID) {
    const options = await optionsInput;
    const maxRetries = options.maxRetries ?? this.maxRetries;
    if (retriesRemaining == null) {
      retriesRemaining = maxRetries;
      this._requestAuthFlags.delete(options);
    }
    await this.prepareOptions(options);
    const { req, url, timeout } = await this.buildRequest(options, {
      retryCount: maxRetries - retriesRemaining
    });
    const requestLogID = "log_" + (Math.random() * (1 << 24) | 0).toString(16).padStart(6, "0");
    const retryLogStr = retryOfRequestLogID === void 0 ? "" : `, retryOf: ${retryOfRequestLogID}`;
    const startTime = Date.now();
    if (options.signal?.aborted) {
      throw new APIUserAbortError();
    }
    const controller = new AbortController();
    const response = await this.fetchWithTimeout(url, req, timeout, controller, options, {
      requestLogID,
      retryOfRequestLogID
    }).catch(castToError);
    const headersTime = Date.now();
    if (response instanceof globalThis.Error) {
      releaseRequestSignal(controller);
      const retryMessage = `retrying, ${retriesRemaining} attempts remaining`;
      if (options.signal?.aborted) {
        throw new APIUserAbortError();
      }
      const isTimeout = isAbortError(response) || /timed? ?out/i.test(String(response) + ("cause" in response ? String(response.cause) : ""));
      const hasMiddleware = this.middleware.length > 0 || !!options.middleware?.length || this.backendMiddleware().length > 0;
      if (hasMiddleware && !isTimeout && !isRetryableError(response)) {
        loggerFor(this).info(`[${requestLogID}] middleware error (not retryable)`);
        loggerFor(this).debug(`[${requestLogID}] middleware error (not retryable)`, formatRequestDetails({
          retryOfRequestLogID,
          url,
          durationMs: headersTime - startTime,
          message: response.message
        }));
        throw response;
      }
      if (retriesRemaining) {
        loggerFor(this).info(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} - ${retryMessage}`);
        loggerFor(this).debug(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} (${retryMessage})`, formatRequestDetails({
          retryOfRequestLogID,
          url,
          durationMs: headersTime - startTime,
          message: response.message
        }));
        return this.retryRequest(options, retriesRemaining, retryOfRequestLogID ?? requestLogID);
      }
      loggerFor(this).info(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} - error; no more retries left`);
      loggerFor(this).debug(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} (error; no more retries left)`, formatRequestDetails({
        retryOfRequestLogID,
        url,
        durationMs: headersTime - startTime,
        message: response.message
      }));
      if (isTimeout) {
        throw new APIConnectionTimeoutError();
      }
      if (hasMiddleware && !isFetchOriginError(response)) {
        throw response;
      }
      throw new APIConnectionError({ cause: response });
    }
    const specialHeaders = [...response.headers.entries()].filter(([name]) => name === "request-id").map(([name, value]) => ", " + name + ": " + JSON.stringify(value)).join("");
    const responseInfo = `[${requestLogID}${retryLogStr}${specialHeaders}] ${req.method} ${url} ${response.ok ? "succeeded" : "failed"} with status ${response.status} in ${headersTime - startTime}ms`;
    if (!response.ok) {
      const shouldRetry = await this.shouldRetry(response, options);
      if (retriesRemaining && shouldRetry) {
        const retryMessage2 = `retrying, ${retriesRemaining} attempts remaining`;
        await CancelReadableStream(response.body);
        releaseRequestSignal(controller);
        loggerFor(this).info(`${responseInfo} - ${retryMessage2}`);
        loggerFor(this).debug(`[${requestLogID}] response error (${retryMessage2})`, formatRequestDetails({
          retryOfRequestLogID,
          url: response.url,
          status: response.status,
          headers: response.headers,
          durationMs: headersTime - startTime
        }));
        return this.retryRequest(options, retriesRemaining, retryOfRequestLogID ?? requestLogID, response.headers);
      }
      const retryMessage = shouldRetry ? `error; no more retries left` : `error; not retryable`;
      loggerFor(this).info(`${responseInfo} - ${retryMessage}`);
      const errText = await response.text().catch((err2) => castToError(err2).message);
      const errJSON = safeJSON(errText);
      const errMessage = errJSON ? void 0 : errText;
      loggerFor(this).debug(`[${requestLogID}] response error (${retryMessage})`, formatRequestDetails({
        retryOfRequestLogID,
        url: response.url,
        status: response.status,
        headers: response.headers,
        message: errMessage,
        durationMs: Date.now() - startTime
      }));
      releaseRequestSignal(controller);
      const err = this.makeStatusError(response.status, errJSON, errMessage, response.headers);
      throw err;
    }
    loggerFor(this).info(responseInfo);
    loggerFor(this).debug(`[${requestLogID}] response start`, formatRequestDetails({
      retryOfRequestLogID,
      url: response.url,
      status: response.status,
      headers: response.headers,
      durationMs: headersTime - startTime
    }));
    armAbandonmentBackstop(response.body ?? response, controller);
    return { response, options, controller, requestLogID, retryOfRequestLogID, startTime };
  }
  getAPIList(path2, Page2, opts) {
    return this.requestAPIList(Page2, opts && "then" in opts ? opts.then((opts2) => ({ method: "get", path: path2, ...opts2 })) : { method: "get", path: path2, ...opts });
  }
  requestAPIList(Page2, options) {
    const request = this.makeRequest(options, null, void 0);
    return new PagePromise(this, request, Page2);
  }
  async fetchWithTimeout(url, init, ms, controller, requestOptions, logCtx) {
    const { signal, method, ...options } = init || {};
    const abort = this._makeAbort(controller);
    if (signal) {
      signal.addEventListener("abort", abort, { once: true });
      registerRequestSignalCleanup(controller, signal, abort);
    }
    const isReadableBody = globalThis.ReadableStream && options.body instanceof globalThis.ReadableStream || typeof options.body === "object" && options.body !== null && Symbol.asyncIterator in options.body;
    const fetchOptions = {
      signal: controller.signal,
      ...isReadableBody ? { duplex: "half" } : {},
      method: "GET",
      ...options
    };
    if (method) {
      fetchOptions.method = method.toUpperCase();
    }
    const baseFetch = this.fetch;
    const timedFetch = /* @__PURE__ */ __name(async (innerUrl, innerInit) => {
      const timeout = setTimeout(abort, ms);
      try {
        return await baseFetch.call(void 0, innerUrl, innerInit);
      } finally {
        clearTimeout(timeout);
      }
    }, "timedFetch");
    const innerFetch = requestOptions === void 0 ? timedFetch : (async (innerUrl, innerInit = {}) => {
      const innerUrlStr = typeof innerUrl === "string" ? innerUrl : innerUrl instanceof URL ? innerUrl.href : innerUrl.url;
      innerInit.headers = innerInit.headers instanceof Headers ? innerInit.headers : new Headers(innerInit.headers);
      await this.prepareRequest(innerInit, { url: innerUrlStr, options: requestOptions });
      if (logCtx) {
        loggerFor(this).debug(`[${logCtx.requestLogID}] sending request`, formatRequestDetails({
          retryOfRequestLogID: logCtx.retryOfRequestLogID,
          method: innerInit.method,
          url: innerUrlStr,
          options: requestOptions,
          headers: innerInit.headers
        }));
      }
      return timedFetch(innerUrl, innerInit);
    });
    const requestMiddleware = requestOptions?.middleware;
    const backendMiddleware = this.backendMiddleware();
    const allMiddleware = requestMiddleware?.length || backendMiddleware.length ? [...this.middleware, ...requestMiddleware ?? [], ...backendMiddleware] : this.middleware;
    return await wrapFetchWithMiddleware(innerFetch, allMiddleware, requestOptions, this)(url, fetchOptions);
  }
  async shouldRetry(response, options) {
    const flags = this._authFlags(options);
    if (response.status === 401 && this._authState.tokenCache && flags.usedTokenCache && !flags.didRefreshFor401) {
      flags.didRefreshFor401 = true;
      this._authState.tokenCache.invalidate();
      return true;
    }
    const shouldRetryHeader = response.headers.get("x-should-retry");
    if (shouldRetryHeader === "true")
      return true;
    if (shouldRetryHeader === "false")
      return false;
    if (response.status === 408)
      return true;
    if (response.status === 409)
      return true;
    if (response.status === 429)
      return true;
    if (response.status >= 500)
      return true;
    return false;
  }
  async retryRequest(options, retriesRemaining, requestLogID, responseHeaders) {
    let timeoutMillis;
    const retryAfterMillisHeader = responseHeaders?.get("retry-after-ms");
    if (retryAfterMillisHeader) {
      const timeoutMs = parseFloat(retryAfterMillisHeader);
      if (!Number.isNaN(timeoutMs)) {
        timeoutMillis = timeoutMs;
      }
    }
    const retryAfterHeader = responseHeaders?.get("retry-after");
    if (retryAfterHeader && !timeoutMillis) {
      const timeoutSeconds = parseFloat(retryAfterHeader);
      if (!Number.isNaN(timeoutSeconds)) {
        timeoutMillis = timeoutSeconds * 1e3;
      } else {
        timeoutMillis = Date.parse(retryAfterHeader) - Date.now();
      }
    }
    if (timeoutMillis === void 0) {
      const maxRetries = options.maxRetries ?? this.maxRetries;
      timeoutMillis = this.calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries);
    }
    await sleep(timeoutMillis);
    return this.makeRequest(options, retriesRemaining - 1, requestLogID);
  }
  calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries) {
    const initialRetryDelay = 0.5;
    const maxRetryDelay = 8;
    const numRetries = maxRetries - retriesRemaining;
    const sleepSeconds = Math.min(initialRetryDelay * Math.pow(2, numRetries), maxRetryDelay);
    const jitter2 = 1 - Math.random() * 0.25;
    return sleepSeconds * jitter2 * 1e3;
  }
  calculateNonstreamingTimeout(maxTokens, maxNonstreamingTokens) {
    const maxTime = 60 * 60 * 1e3;
    const defaultTime = 60 * 10 * 1e3;
    const expectedTime = maxTime * maxTokens / 128e3;
    if (expectedTime > defaultTime || maxNonstreamingTokens != null && maxTokens > maxNonstreamingTokens) {
      throw new AnthropicError("Streaming is required for operations that may take longer than 10 minutes. See https://github.com/anthropics/anthropic-sdk-typescript#long-requests for more details");
    }
    return defaultTime;
  }
  async buildRequest(inputOptions, { retryCount = 0 } = {}) {
    const options = { ...inputOptions };
    const { method, path: path2, query, defaultBaseURL } = options;
    if (this._authState.resolution) {
      await this._authState.resolution;
    }
    if (!this._baseURLIsExplicit && this._authState.baseURL && this.baseURL !== this._authState.baseURL) {
      this.baseURL = this._authState.baseURL;
    }
    const url = this.buildURL(path2, query, defaultBaseURL);
    if ("timeout" in options)
      validatePositiveInteger("timeout", options.timeout);
    options.timeout = options.timeout ?? this.timeout;
    const { bodyHeaders, body } = this.buildBody({ options });
    const reqHeaders = await this.buildHeaders({ options: inputOptions, method, bodyHeaders, retryCount });
    const req = {
      method,
      headers: reqHeaders,
      ...options.signal && { signal: options.signal },
      ...globalThis.ReadableStream && body instanceof globalThis.ReadableStream && { duplex: "half" },
      ...body && { body },
      ...this.fetchOptions ?? {},
      ...options.fetchOptions ?? {}
    };
    return { req, url, timeout: options.timeout };
  }
  async buildHeaders({ options, method, bodyHeaders, retryCount }) {
    let idempotencyHeaders = {};
    if (this.idempotencyHeader && method !== "get") {
      if (!options.idempotencyKey)
        options.idempotencyKey = this.defaultIdempotencyKey();
      idempotencyHeaders[this.idempotencyHeader] = options.idempotencyKey;
    }
    const headers = buildHeaders([
      idempotencyHeaders,
      {
        Accept: "application/json",
        "User-Agent": this.getUserAgent(),
        "X-Stainless-Retry-Count": String(retryCount),
        ...options.timeout ? { "X-Stainless-Timeout": String(Math.trunc(options.timeout / 1e3)) } : {},
        ...getPlatformHeaders(),
        ...this._options.dangerouslyAllowBrowser ? { "anthropic-dangerous-direct-browser-access": "true" } : void 0,
        "anthropic-version": "2023-06-01"
      },
      await this.authHeaders(options),
      this._options.defaultHeaders,
      bodyHeaders,
      options.headers
    ]);
    this.validateHeaders(headers);
    return headers.values;
  }
  _makeAbort(controller) {
    return () => controller.abort();
  }
  buildBody({ options: { body, headers: rawHeaders } }) {
    if (!body) {
      return { bodyHeaders: void 0, body: void 0 };
    }
    const headers = buildHeaders([rawHeaders]);
    if (
      // Pass raw type verbatim
      ArrayBuffer.isView(body) || body instanceof ArrayBuffer || body instanceof DataView || typeof body === "string" && // Preserve legacy string encoding behavior for now
      headers.values.has("content-type") || // `Blob` is superset of `File`
      globalThis.Blob && body instanceof globalThis.Blob || // `FormData` -> `multipart/form-data`
      body instanceof FormData || // `URLSearchParams` -> `application/x-www-form-urlencoded`
      body instanceof URLSearchParams || // Send chunked stream (each chunk has own `length`)
      globalThis.ReadableStream && body instanceof globalThis.ReadableStream
    ) {
      return { bodyHeaders: void 0, body };
    } else if (typeof body === "object" && (Symbol.asyncIterator in body || Symbol.iterator in body && "next" in body && typeof body.next === "function")) {
      return { bodyHeaders: void 0, body: ReadableStreamFrom(body) };
    } else if (typeof body === "object" && headers.values.get("content-type") === "application/x-www-form-urlencoded") {
      return {
        bodyHeaders: { "content-type": "application/x-www-form-urlencoded" },
        body: this.stringifyQuery(body)
      };
    } else {
      return __classPrivateFieldGet(this, _BaseAnthropic_encoder, "f").call(this, { body, headers });
    }
  }
};
_a = BaseAnthropic, _BaseAnthropic_encoder = /* @__PURE__ */ new WeakMap(), _BaseAnthropic_instances = /* @__PURE__ */ new WeakSet(), _BaseAnthropic_baseURLOverridden = /* @__PURE__ */ __name(function _BaseAnthropic_baseURLOverridden2() {
  return this.baseURL !== "https://api.anthropic.com";
}, "_BaseAnthropic_baseURLOverridden");
BaseAnthropic.Anthropic = _a;
BaseAnthropic.HUMAN_PROMPT = HUMAN_PROMPT;
BaseAnthropic.AI_PROMPT = AI_PROMPT;
BaseAnthropic.DEFAULT_TIMEOUT = 6e5;
BaseAnthropic.AnthropicError = AnthropicError;
BaseAnthropic.APIError = APIError;
BaseAnthropic.APIConnectionError = APIConnectionError;
BaseAnthropic.APIConnectionTimeoutError = APIConnectionTimeoutError;
BaseAnthropic.APIUserAbortError = APIUserAbortError;
BaseAnthropic.NotFoundError = NotFoundError;
BaseAnthropic.ConflictError = ConflictError;
BaseAnthropic.RateLimitError = RateLimitError;
BaseAnthropic.BadRequestError = BadRequestError;
BaseAnthropic.AuthenticationError = AuthenticationError;
BaseAnthropic.InternalServerError = InternalServerError;
BaseAnthropic.PermissionDeniedError = PermissionDeniedError;
BaseAnthropic.UnprocessableEntityError = UnprocessableEntityError;
BaseAnthropic.toFile = toFile;
var Anthropic = class extends BaseAnthropic {
  static {
    __name(this, "Anthropic");
  }
  constructor() {
    super(...arguments);
    this.completions = new Completions(this);
    this.messages = new Messages2(this);
    this.models = new Models2(this);
    this.beta = new Beta(this);
  }
};
Anthropic.Completions = Completions;
Anthropic.Messages = Messages2;
Anthropic.Models = Models2;
Anthropic.Beta = Beta;

// node_modules/@anthropic-ai/sdk/lib/middleware.mjs
init_modules_watch_stub();
init_error();
init_errors();
var encoder = new TextEncoder();

// node_modules/@anthropic-ai/sdk/index.mjs
init_error();

// src/corpus.js
init_modules_watch_stub();
var QA = '# Wiki Mazothecoach \u2014 Preguntas de coaching (Q&A)\n\nRespuestas directas, estilo Mazothecoach: honesto, t\xE9cnico antes que intenso, sin humo. Complementa las fichas de m\xFAsculos, ejercicios y articulaciones del visor 3D.\n\n## \xBFQu\xE9 m\xFAsculo deber\xEDa sentir con press de banca con barra?\n\nPrincipalmente el **pecho**: al bajar la barra el pectoral se estira bajo carga (ah\xED es donde m\xE1s lo tienes que sentir) y al empujar sigue siendo el motor principal. Cerca del bloqueo entra m\xE1s el **tr\xEDceps**. El **deltoides anterior** asiste todo el recorrido.\n\nOjo: el **core y las piernas NO son decoraci\xF3n** \u2014 generan estabilidad (leg drive y rigidez del torso) para que el pecho pueda empujar desde una base s\xF3lida. No deber\xEDas "sentirlos" como m\xFAsculo objetivo, pero s\xED deben estar activos. Si sientes el hombro por delante del pecho, revisa retracci\xF3n escapular y el ancho del agarre.\n\n## \xBFHasta d\xF3nde deber\xEDa llegar mi extensi\xF3n de pierna (leg extension)?\n\nDeber\xEDas llegar a **0\xB0 = extensi\xF3n completa** (rodilla recta, bloqueo arriba con una contracci\xF3n de un segundo) y arrancar desde unos **90\u2013100\xB0 de flexi\xF3n** en la m\xE1quina. La rodilla sana extiende hasta 0\xB0 y flexiona ~140\xB0 \u2014 la m\xE1quina usa la parte del rango donde el cu\xE1driceps trabaja mejor.\n\nClave: mant\xE9n tu **tobillo lo m\xE1s dorsiflexionado posible** ("aprieta el colch\xF3n" jalando la punta del pie hacia ti). Eso fija la pierna, evita que el gastrocnemio robe trabajo y a\xEDsla mejor el cu\xE1driceps. Si no llegas a la extensi\xF3n completa con carga, baja el peso: el rango completo vale m\xE1s que los kilos.\n\nDato de acoplamiento: si el respaldo te deja la cadera muy extendida, el recto femoral llega alargado y pierde fuerza arriba \u2014 un respaldo un poco reclinado (cadera m\xE1s flexionada) suele sentirse m\xE1s fuerte al bloqueo.\n\n## Me dijiste que mi carrying angle de los codos est\xE1 muy abierto. \xBFQu\xE9 hago en mi curl de b\xEDceps?\n\nEl carrying angle es el \xE1ngulo natural entre brazo y antebrazo con la palma al frente. Si el tuyo es muy abierto y haces curl con **barra recta**, obligas a la mu\xF1eca y al codo a una l\xEDnea que no es la tuya \u2192 torque innecesario en el codo y molestia con volumen.\n\nAjustes:\n- **Alin\xE9ate al lado de tu brazo**: deja que el antebrazo siga SU l\xEDnea natural, no la de la barra. Con mancuernas puedes dejar que la mano viaje ligeramente hacia afuera al subir.\n- **Prefiere unilaterales o mancuernas** (o barra EZ) sobre barra recta: cada brazo trabaja en su propio \xE1ngulo.\n- El objetivo no es "corregir" tu \xE1ngulo (es \xF3seo, no se corrige) \u2014 es **no pelearte con \xE9l**. Si el codo deja de molestar y el b\xEDceps trabaja, ganaste.\n\n## \xBFHasta d\xF3nde debe llegar mi sentadilla? (profundidad)\n\nHasta donde tu **cadera y tobillo** lo permitan sin que la pelvis se meta (butt wink) ni el tal\xF3n se despegue. La dorsiflexi\xF3n del tobillo decide cu\xE1nto avanza la rodilla: si est\xE1 limitada (~5\xB0 con rodilla estirada por el gastrocnemio; ~20\xB0 con rodilla flexionada), talones elevados o stance m\xE1s ancho te dan profundidad sin robarle a la lumbar. La estructura del acet\xE1bulo es individual: no hay UNA sentadilla para todos.\n\n## \xBFPor qu\xE9 no llego con la pierna estirada donde s\xED llego con la rodilla doblada?\n\nIsquios biarticulares. Con la rodilla estirada ya vienen alargados y frenan la flexi\xF3n de cadera a ~90\xB0 (el tope del straight-leg raise). Doblas la rodilla, se relajan, y la cadera llega a ~120\xB0. No es "cadera dura" \u2014 es la longitud del isquio mandando. El mismo principio aplica al rev\xE9s con el recto femoral (test de Thomas y de Ely).\n\n## \xBFD\xF3nde deber\xEDa sentir el peso muerto rumano (RDL)?\n\nEn los **isquios** (femoral) estir\xE1ndose mientras la cadera va atr\xE1s, y el **gl\xFAteo mayor** cerrando la cadera arriba. La espalda baja trabaja ISOM\xC9TRICA (sostiene, no mueve) \u2014 si la sientes "trabajar" como motor, la barra est\xE1 lejos del cuerpo o est\xE1s tirando con la espalda en vez de bisagrar. Baja hasta donde el isquio estire sin que la lumbar se redondee: ese es TU rango de hoy.\n\n## \xBFPor qu\xE9 me duele el hombro en press militar y qu\xE9 reviso?\n\nEl rango overhead necesita 3 cosas: rotaci\xF3n externa disponible, **rotaci\xF3n ascendente de la esc\xE1pula** (ritmo esc\xE1pulo-humeral ~2:1) y extensi\xF3n tor\xE1cica. Si la tor\xE1cica no extiende o la esc\xE1pula no rota, el rango se lo pide prestado al hombro \u2014 y el hombro "canta" primero. Revisa: movilidad tor\xE1cica, control escapular (serrato + trapecio inferior), y no fuerces el h\xFAmero donde la esc\xE1pula no acompa\xF1a.\n\n## \xBFEl curl inclinado y el predicador trabajan "otro b\xEDceps"?\n\nMismo m\xFAsculo, distinta **longitud**. Inclinado = hombro extendido = b\xEDceps alargado (m\xE1s tensi\xF3n en estiramiento). Predicador = hombro flexionado = b\xEDceps acortado (m\xE1s dif\xEDcil arriba). El b\xEDceps cruza hombro y codo (biarticular): la posici\xF3n del hombro decide en qu\xE9 parte de la curva de fuerza cargas. Comb\xEDnalos, no los repitas.\n\n## \xBFPor qu\xE9 el curl invertido "pesa m\xE1s" si es el mismo peso?\n\nCon agarre en pronaci\xF3n el b\xEDceps pierde su palanca de supinador y el trabajo cae en braquiorradial y braquial. No est\xE1s m\xE1s d\xE9bil \u2014 cambiaste de motor. Por eso el agarre define qu\xE9 flexor lidera: supino = b\xEDceps; neutro/prono = braquiorradial y braquial.\n\n## \xBFSirve de algo apretar el pie en ejercicios de pierna?\n\nS\xED. La dorsiflexi\xF3n activa (punta del pie hacia ti) en leg extension y leg curl fija la pierna, quita al gastrocnemio de la ecuaci\xF3n y limpia la lectura del m\xFAsculo objetivo. En sentadilla, el "tr\xEDpode" del pie (tal\xF3n + base del dedo gordo + base del me\xF1ique) es tu plataforma: si el arco colapsa, el colapso sube por la rodilla (valgo).\n\n---\n\n*Contenido educativo Mazothecoach, sin fines de lucro. Parte del contenido est\xE1 informado por el m\xE9todo Pre-Script (Dr. Jordan Shallow); el resto proviene de fuentes est\xE1ndar de anatom\xEDa (AAOS, Kapandji, Physiopedia) e interpretaci\xF3n propia. No sustituye evaluaci\xF3n individual: si algo duele, se eval\xFAa, no se adivina.*\n';
var SECTIONS = [{ "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Pectoral mayor", "text": "## Pectoral mayor\n- **Ubicaci\xF3n:** Cara anterior del t\xF3rax\n- **Origen:** Cabeza clavicular: mitad medial de la clav\xEDcula. Cabeza esternocostal: estern\xF3n y cart\xEDlagos de las costillas 1\u20136.\n- **Inserci\xF3n:** Cresta del tub\xE9rculo mayor del h\xFAmero (labio lateral del surco bicipital).\n- **Acci\xF3n:** Aducci\xF3n y rotaci\xF3n interna de hombro. La cabeza clavicular flexiona; la esternocostal extiende desde flexi\xF3n.\n- **Funci\xF3n en el entrenamiento:** Motor primario de empuje horizontal. Las dos cabezas tiran en \xE1ngulos distintos, por eso el press plano sesga la esternocostal y el inclinado la clavicular. En flexi\xF3n extrema de hombro asiste como extensor cuando el dorsal pierde rango.\n- **Curva de fuerza:** acortado \u2192 Cierre del cruce de poleas / pec deck \u2014 brazos juntos al frente, m\xE1xima aducci\xF3n.; medio \u2192 Press plano o inclinado cerca de 90\xB0 de codo.; alargado \u2192 Fondo del press inclinado con mancuernas o apertura \u2014 pec estirado con el brazo abierto.\n- **Nota de coaching:** Cuando el dorsal ya no puede sostener rotaci\xF3n externa en flexi\xF3n profunda de hombro, el cuerpo recluta el pec para extender el hombro. Por eso un pec r\xEDgido o dominante limita el rango overhead: no es solo 'movilidad de hombro', es qui\xE9n gana la pelea por esa posici\xF3n." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Pectoral menor", "text": "## Pectoral menor\n- **Ubicaci\xF3n:** Profundo al pectoral mayor, cara anterior del t\xF3rax\n- **Origen:** Caras anteriores de las costillas 3\u20135.\n- **Inserci\xF3n:** Ap\xF3fisis coracoides de la esc\xE1pula.\n- **Acci\xF3n:** Protracci\xF3n, depresi\xF3n y b\xE1scula anterior de la esc\xE1pula.\n- **Funci\xF3n en el entrenamiento:** Estabiliza la esc\xE1pula contra la caja tor\xE1cica, pero acortado tira la esc\xE1pula en b\xE1scula anterior, lo que cierra el espacio subacromial y compromete la posici\xF3n overhead.\n- **Curva de fuerza:** acortado \u2192 \u2014; medio \u2192 \u2014; alargado \u2192 Estiramiento en marco de puerta o posici\xF3n overhead con caja elevada \u2014 b\xE1scula posterior de esc\xE1pula.\n- **Nota de coaching:** No es un m\xFAsculo que se entrena directo; se gestiona. Un pec menor corto suele leerse como 'falta de movilidad de hombro' cuando el problema real est\xE1 en la b\xE1scula escapular. Antes de estirar el hombro, revisa la posici\xF3n de la esc\xE1pula." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Dorsal ancho", "text": "## Dorsal ancho\n- **Ubicaci\xF3n:** Espalda media e inferior, hasta la cintura\n- **Origen:** Ap\xF3fisis espinosas T7\u2013L5 v\xEDa fascia toracolumbar, cresta il\xEDaca, costillas inferiores 9\u201312 y \xE1ngulo inferior de la esc\xE1pula.\n- **Inserci\xF3n:** Surco intertubercular del h\xFAmero (entre las inserciones del pec mayor y el redondo mayor).\n- **Acci\xF3n:** Extensi\xF3n, aducci\xF3n y rotaci\xF3n interna de hombro.\n- **Funci\xF3n en el entrenamiento:** Extensor puro del hombro cuando se a\xEDsla. Su rango activo efectivo es donde el hombro mantiene flexi\xF3n + rotaci\xF3n externa; pasada esa zona el pec lo releva. Adem\xE1s, por su origen en la fascia toracolumbar, estabiliza la columna lumbar contra rotaci\xF3n.\n- **Curva de fuerza:** acortado \u2192 Cierre del remo o pullover \u2014 codo pasado el tronco, hombro extendido.; medio \u2192 Jal\xF3n al pecho cerca de la cara, bajo carga compuesta.; alargado \u2192 Jal\xF3n inclinado o pullover en su estiramiento con hombro en flexi\xF3n + rotaci\xF3n externa.\n- **Nota de coaching:** El dorsal es el 'canario en la mina' de la funci\xF3n del hombro: si no puedes entrenarlo en posici\xF3n alargada (overhead con rotaci\xF3n externa), eso se\xF1ala un problema de hombro a resolver antes, no algo a forzar. Para aislar acci\xF3n, cadera del lado trabajado al frente; para integrar funci\xF3n, cadera opuesta al frente como en la marcha." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Trapecio", "text": "## Trapecio\n- **Ubicaci\xF3n:** Cuello posterior y espalda alta, en forma de diamante\n- **Origen:** Protuberancia occipital, ligamento nucal y ap\xF3fisis espinosas C7\u2013T12.\n- **Inserci\xF3n:** Tercio lateral de la clav\xEDcula, acromion y espina de la esc\xE1pula.\n- **Acci\xF3n:** Fibras superiores: elevaci\xF3n y rotaci\xF3n ascendente. Medias: retracci\xF3n. Inferiores: depresi\xF3n y rotaci\xF3n ascendente.\n- **Funci\xF3n en el entrenamiento:** Las tres porciones trabajan como par de fuerzas para rotar la esc\xE1pula hacia arriba en todo movimiento overhead. Superior e inferior deben equilibrarse: si la superior domina, la esc\xE1pula eleva en vez de rotar limpiamente.\n- **Curva de fuerza:** acortado \u2192 Cierre del encogimiento (superior) o del remo retrayendo esc\xE1pulas (medio).; medio \u2192 Carga sostenida en remos y carries bajo control escapular.; alargado \u2192 Estiramiento del trapecio superior bajo carga (encogimiento con ca\xEDda controlada) o prensa overhead que demanda rotaci\xF3n ascendente desde abajo.\n- **Nota de coaching:** El trapecio superior no es el villano postural que muchos creen: necesita fuerza para rotar la esc\xE1pula overhead. El objetivo no es 'apagarlo', sino que la porci\xF3n inferior pueda competir. Programa trabajo de trapecio inferior antes de inhibir el superior." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Romboides", "text": "## Romboides\n- **Ubicaci\xF3n:** Espalda alta, profundos al trapecio, entre esc\xE1pula y columna\n- **Origen:** Ap\xF3fisis espinosas C7\u2013T5 (menor: C7\u2013T1; mayor: T2\u2013T5).\n- **Inserci\xF3n:** Borde medial de la esc\xE1pula.\n- **Acci\xF3n:** Retracci\xF3n, elevaci\xF3n y rotaci\xF3n descendente de la esc\xE1pula.\n- **Funci\xF3n en el entrenamiento:** Fijan el borde medial de la esc\xE1pula a la caja durante los jalones. Su tendencia a la rotaci\xF3n descendente los hace antagonistas del serrato y el trapecio inferior en la rotaci\xF3n ascendente.\n- **Curva de fuerza:** acortado \u2192 Cierre del remo retrayendo y bajando ligeramente la esc\xE1pula.; medio \u2192 Fase media del remo bajo control escapular.; alargado \u2192 Protracci\xF3n completa en el inicio del remo o en un wall slide.\n- **Nota de coaching:** Cambiar la posici\xF3n de la esc\xE1pula en el remo de una mancuerna (retracci\xF3n vs protracci\xF3n mantenida) decide si trabajan m\xE1s romboides o serrato sin cambiar el patr\xF3n. Es palanca de estabilidad externa: misma fila, distinto \xE9nfasis." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Serrato anterior", "text": "## Serrato anterior\n- **Ubicaci\xF3n:** Cara lateral de la caja tor\xE1cica, bajo la esc\xE1pula\n- **Origen:** Caras laterales de las costillas 1\u20139.\n- **Inserci\xF3n:** Borde medial de la esc\xE1pula, cara costal.\n- **Acci\xF3n:** Protracci\xF3n y rotaci\xF3n ascendente de la esc\xE1pula; la fija contra la caja.\n- **Funci\xF3n en el entrenamiento:** Permite que la esc\xE1pula gire alrededor de la caja para llegar al overhead. Sin un serrato competente aparece la esc\xE1pula alada y se pierde la posici\xF3n alargada del dorsal. Se puede entrenar conc\xE9ntrico (protracci\xF3n activa) en lugar de cargar al dorsal hasta su estiramiento.\n- **Curva de fuerza:** acortado \u2192 Punch o protracci\xF3n en press con la esc\xE1pula rodeando la caja al frente.; medio \u2192 Wall slide o press overhead manteniendo la esc\xE1pula pegada a la caja.; alargado \u2192 Retracci\xF3n completa en el inicio de un press, esc\xE1pula juntada hacia la columna.\n- **Nota de coaching:** Es prerrequisito para entrenar el dorsal alargado: estabilidad escapular y libertad hacia rotaci\xF3n externa. En vez de cargar exc\xE9ntricamente el dorsal para llevarlo a su posici\xF3n larga, contrae conc\xE9ntricamente el serrato llevando la esc\xE1pula alrededor de la caja." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Deltoides", "text": "## Deltoides\n- **Ubicaci\xF3n:** Tapa redondeada del hombro\n- **Origen:** Anterior: tercio lateral de la clav\xEDcula. Medio: acromion. Posterior: espina de la esc\xE1pula.\n- **Inserci\xF3n:** Tuberosidad deltoidea del h\xFAmero.\n- **Acci\xF3n:** Anterior: flexi\xF3n y rotaci\xF3n interna de hombro. Medio: abducci\xF3n. Posterior: extensi\xF3n transversa y rotaci\xF3n externa.\n- **Funci\xF3n en el entrenamiento:** Tres porciones casi independientes, cada una con su patr\xF3n: por eso requiere ejercicios distintos por cabeza. El deltoides tracciona la cabeza humeral hacia arriba (translaci\xF3n superior); el manguito y el b\xEDceps deben contrarrestarlo para centrar la articulaci\xF3n.\n- **Curva de fuerza:** acortado \u2192 Cierre de la elevaci\xF3n lateral / posterior \u2014 brazo arriba o atr\xE1s contra la polea.; medio \u2192 Press overhead pasando por la altura del o\xEDdo.; alargado \u2192 Elevaci\xF3n lateral en polea con el brazo cruzado al frente (lateral) o fondo del press (anterior).\n- **Nota de coaching:** Como las tres cabezas se mueven en planos distintos, no hay un solo ejercicio que las cubra: anterior con flexi\xF3n, medio con abducci\xF3n, posterior con extensi\xF3n transversa. El deltoides medio sesga ligera rotaci\xF3n interna en la abducci\xF3n, dato \xFAtil al elegir \xE1ngulos sin pinzar el hombro." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Supraespinoso", "text": "## Supraespinoso\n- **Ubicaci\xF3n:** Fosa supraespinosa, parte superior de la esc\xE1pula\n- **Origen:** Fosa supraespinosa de la esc\xE1pula.\n- **Inserci\xF3n:** Faceta superior del tub\xE9rculo mayor del h\xFAmero.\n- **Acci\xF3n:** Inicia la abducci\xF3n de hombro (primeros ~15\xB0) y centra la cabeza humeral.\n- **Funci\xF3n en el entrenamiento:** Miembro del manguito rotador: arranca la abducci\xF3n antes de que el deltoides tome el relevo, y mantiene la cabeza humeral comprimida en la glena durante todo el rango.\n- **Curva de fuerza:** acortado \u2192 \u2014; medio \u2192 Primeros grados de la elevaci\xF3n lateral, sin pasar de ~30\xB0.; alargado \u2192 \u2014\n- **Nota de coaching:** No se entrena por est\xE9tica sino por funci\xF3n: su trabajo real es centrar la cabeza humeral. Es el tend\xF3n del manguito m\xE1s expuesto a pinzamiento bajo el acromion, por eso la calidad de la rotaci\xF3n ascendente escapular importa m\xE1s que aislarlo." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Infraespinoso", "text": "## Infraespinoso\n- **Ubicaci\xF3n:** Fosa infraespinosa, parte posterior de la esc\xE1pula\n- **Origen:** Fosa infraespinosa de la esc\xE1pula.\n- **Inserci\xF3n:** Faceta media del tub\xE9rculo mayor del h\xFAmero.\n- **Acci\xF3n:** Rotaci\xF3n externa de hombro; centra la cabeza humeral.\n- **Funci\xF3n en el entrenamiento:** Rotador externo principal del manguito. La capacidad de mantener rotaci\xF3n externa bajo carga es justo el prerrequisito que el dorsal necesita para entrenarse en posici\xF3n alargada.\n- **Curva de fuerza:** acortado \u2192 Cierre de la rotaci\xF3n externa en polea \u2014 mano alejada de la l\xEDnea media.; medio \u2192 Rotaci\xF3n externa con codo a 90\xB0 contra banda o polea.; alargado \u2192 Inicio de la rotaci\xF3n externa desde rotaci\xF3n interna completa.\n- **Nota de coaching:** El manguito suele tratarse solo cuando ya duele. Pero la rotaci\xF3n externa que da el infraespinoso es lo que habilita posiciones overhead seguras: entr\xE9nalo como capacidad, no como rehabilitaci\xF3n reactiva." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Redondo menor", "text": "## Redondo menor\n- **Ubicaci\xF3n:** Borde lateral posterior de la esc\xE1pula\n- **Origen:** Borde lateral de la esc\xE1pula.\n- **Inserci\xF3n:** Faceta inferior del tub\xE9rculo mayor del h\xFAmero.\n- **Acci\xF3n:** Rotaci\xF3n externa de hombro; centra la cabeza humeral.\n- **Funci\xF3n en el entrenamiento:** Acompa\xF1a al infraespinoso en la rotaci\xF3n externa, con m\xE1s participaci\xF3n en rangos de abducci\xF3n mayores. Parte del freno posterior que evita la translaci\xF3n superior del h\xFAmero.\n- **Curva de fuerza:** acortado \u2192 Cierre de la rotaci\xF3n externa en abducci\xF3n de 90\xB0 (posici\xF3n de lanzador).; medio \u2192 Rotaci\xF3n externa en abducci\xF3n contra banda o polea.; alargado \u2192 \u2014\n- **Nota de coaching:** Casi nunca necesita aislamiento dedicado: se cubre con el trabajo de rotaci\xF3n externa del infraespinoso y los face pulls. Lo relevante es que su demanda crece a mayor abducci\xF3n, as\xED que entrenar rotaci\xF3n externa en distintos \xE1ngulos de brazo lo abarca mejor que un solo ejercicio." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Subescapular", "text": "## Subescapular\n- **Ubicaci\xF3n:** Cara anterior (costal) de la esc\xE1pula, entre esc\xE1pula y caja\n- **Origen:** Fosa subescapular (cara anterior de la esc\xE1pula).\n- **Inserci\xF3n:** Tub\xE9rculo menor del h\xFAmero.\n- **Acci\xF3n:** Rotaci\xF3n interna de hombro; centra la cabeza humeral.\n- **Funci\xF3n en el entrenamiento:** El \xFAnico rotador interno del manguito y el m\xE1s grande de los cuatro. Da el freno anterior a la cabeza humeral; trabaja en pareja con el infraespinoso para mantener la articulaci\xF3n centrada.\n- **Curva de fuerza:** acortado \u2192 Cierre de la rotaci\xF3n interna en polea \u2014 mano hacia el abdomen.; medio \u2192 Rotaci\xF3n interna con codo a 90\xB0 contra banda o polea.; alargado \u2192 Inicio de la rotaci\xF3n interna desde rotaci\xF3n externa completa.\n- **Nota de coaching:** Se trabaja indirectamente en todo press y jal\xF3n con rotaci\xF3n interna, as\xED que rara vez est\xE1 d\xE9bil por falta de uso; suele estar tenso. El balance con la rotaci\xF3n externa importa m\xE1s que su fuerza absoluta: un subescapular dominante limita la rotaci\xF3n externa que el overhead requiere." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Redondo mayor", "text": "## Redondo mayor\n- **Ubicaci\xF3n:** \xC1ngulo inferior posterior de la esc\xE1pula\n- **Origen:** \xC1ngulo inferior y borde lateral de la esc\xE1pula.\n- **Inserci\xF3n:** Cresta del tub\xE9rculo menor del h\xFAmero (labio medial del surco bicipital).\n- **Acci\xF3n:** Extensi\xF3n, aducci\xF3n y rotaci\xF3n interna de hombro.\n- **Funci\xF3n en el entrenamiento:** Apodado 'el peque\xF1o ayudante del dorsal': replica sus acciones de hombro pero sin cruzar la columna, por lo que no contribuye a estabilizar la regi\xF3n lumbar. Se trabaja junto al dorsal en jalones y remos.\n- **Curva de fuerza:** acortado \u2192 Cierre del jal\xF3n / remo con el codo pasado el tronco.; medio \u2192 Fase media del jal\xF3n al pecho.; alargado \u2192 Estiramiento del jal\xF3n con el brazo extendido arriba.\n- **Nota de coaching:** No requiere ejercicios propios: lo que entrena al dorsal lo entrena a \xE9l. \xDAtil saber que comparte acciones de hombro con el dorsal pero no su rol estabilizador de columna, por si buscas trabajar extensi\xF3n de hombro sin sumar demanda lumbar." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Elevador de la esc\xE1pula", "text": "## Elevador de la esc\xE1pula\n- **Ubicaci\xF3n:** Lateral del cuello, hacia el \xE1ngulo superior de la esc\xE1pula\n- **Origen:** Ap\xF3fisis transversas de C1\u2013C4.\n- **Inserci\xF3n:** \xC1ngulo superior de la esc\xE1pula.\n- **Acci\xF3n:** Elevaci\xF3n y rotaci\xF3n descendente de la esc\xE1pula; flexi\xF3n lateral del cuello.\n- **Funci\xF3n en el entrenamiento:** Eleva la esc\xE1pula y contribuye a su rotaci\xF3n descendente, lo que lo pone en oposici\xF3n a la rotaci\xF3n ascendente necesaria para el overhead. Suele sobrecargarse en posturas de cuello adelantado.\n- **Curva de fuerza:** acortado \u2192 \u2014; medio \u2192 \u2014; alargado \u2192 Estiramiento cervical contralateral con la esc\xE1pula deprimida.\n- **Nota de coaching:** Rara vez se entrena directo; su relevancia es como fuente de tensi\xF3n cervical. Si un cliente reporta tensi\xF3n en el cuello al hacer trabajo overhead, suele ser elevador y trapecio superior compensando una rotaci\xF3n ascendente escapular pobre, no un problema local del cuello." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "B\xEDceps braquial", "text": "## B\xEDceps braquial\n- **Ubicaci\xF3n:** Cara anterior del brazo\n- **Origen:** Cabeza larga: tub\xE9rculo supraglenoideo de la esc\xE1pula. Cabeza corta: ap\xF3fisis coracoides.\n- **Inserci\xF3n:** Tuberosidad del radio + aponeurosis bicipital.\n- **Acci\xF3n:** Flexi\xF3n de codo, supinaci\xF3n del antebrazo, flexi\xF3n d\xE9bil de hombro. Triarticular: act\xFAa en hombro, codo y radioulnar.\n- **Funci\xF3n en el entrenamiento:** Supinador potente con el codo flexionado. Su longitud depende de la posici\xF3n del hombro: brazo atr\xE1s del cuerpo \u2192 cabeza larga estirada. Adem\xE1s deprime la cabeza humeral junto con el manguito y el dorsal, actuando como antagonista funcional del deltoides.\n- **Curva de fuerza:** acortado \u2192 Curl en polea alta / spider curl arriba \u2014 pico de tensi\xF3n con hombro flexionado.; medio \u2192 Curl de pie con barra o mancuerna \u2014 resistencia m\xE1xima cerca de 90\xB0.; alargado \u2192 Curl inclinado (hombro extendido, b\xEDceps totalmente alargado).\n- **Nota de coaching:** Un exc\xE9ntrico lento en el curl de polea alta desperdicia tiempo en una zona que el ejercicio no carga; solo carga la posici\xF3n acortada. Ajusta el tempo a donde hay tensi\xF3n. Y una debilidad en supinaci\xF3n puede limitar el curl antes que la flexi\xF3n de codo." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Braquial", "text": "## Braquial\n- **Ubicaci\xF3n:** Cara anterior del brazo, profundo al b\xEDceps\n- **Origen:** Mitad distal de la cara anterior del h\xFAmero.\n- **Inserci\xF3n:** Tuberosidad del c\xFAbito y ap\xF3fisis coronoides.\n- **Acci\xF3n:** Flexi\xF3n de codo pura. Monoarticular.\n- **Funci\xF3n en el entrenamiento:** Flexor de codo m\xE1s constante: como inserta en el c\xFAbito, la rotaci\xF3n del antebrazo no cambia su palanca. Trabaja en todo curl sin importar el agarre.\n- **Curva de fuerza:** acortado \u2192 Curl martillo en polea baja arriba \u2014 la polea mantiene tensi\xF3n en el cierre donde la mancuerna la pierde.; medio \u2192 Curl martillo de pie con mancuerna \u2014 resistencia m\xE1xima cerca de 90\xB0.; alargado \u2192 Curl en banco predicador desde extensi\xF3n completa \u2014 carga el inicio del recorrido.\n- **Nota de coaching:** El agarre prono o neutro no 'activa m\xE1s' el braquial; lo que hace es quitarle palanca al b\xEDceps. El braquial trabaja igual en todos los curls, el agarre solo decide qui\xE9n lo acompa\xF1a." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Coracobraquial", "text": "## Coracobraquial\n- **Ubicaci\xF3n:** Cara medial proximal del brazo\n- **Origen:** Ap\xF3fisis coracoides de la esc\xE1pula (junto con la cabeza corta del b\xEDceps y el pectoral menor).\n- **Inserci\xF3n:** Cara medial del tercio medio del h\xFAmero.\n- **Acci\xF3n:** Flexi\xF3n y aducci\xF3n de hombro.\n- **Funci\xF3n en el entrenamiento:** Sinergista peque\xF1o: asiste en llevar el brazo al frente y hacia la l\xEDnea media, y aporta estabilidad anterior al hombro en presses.\n- **Curva de fuerza:** acortado \u2192 Aducci\xF3n en polea cruzando la l\xEDnea media \u2014 brazo al frente y adentro.; medio \u2192 Elevaci\xF3n frontal a media altura.; alargado \u2192 Fondo del press inclinado con mancuernas \u2014 hombro extendido y abducido.\n- **Nota de coaching:** No necesita trabajo directo: queda cubierto por presses y aducciones. Su relevancia pr\xE1ctica es anat\xF3mica: el musculocut\xE1neo lo atraviesa, punto a considerar con molestias anteriores difusas del brazo." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Tr\xEDceps braquial", "text": "## Tr\xEDceps braquial\n- **Ubicaci\xF3n:** Cara posterior del brazo\n- **Origen:** Cabeza larga: tub\xE9rculo infraglenoideo de la esc\xE1pula. Cabeza lateral: h\xFAmero posterior, proximal al surco radial. Cabeza medial: h\xFAmero posterior, distal al surco radial.\n- **Inserci\xF3n:** Ol\xE9cranon del c\xFAbito.\n- **Acci\xF3n:** Extensi\xF3n de codo (las tres cabezas). La cabeza larga cruza el hombro y adem\xE1s lo extiende.\n- **Funci\xF3n en el entrenamiento:** La cabeza larga es biarticular: su longitud depende de la posici\xF3n del hombro. Con el hombro flexionado (overhead) se alarga; con el hombro extendido se acorta y pierde protagonismo frente a lateral y medial.\n- **Curva de fuerza:** acortado \u2192 Pushdown en polea o kickback en el lockout \u2014 m\xE1xima tensi\xF3n con el codo extendido y hombro neutro/extendido.; medio \u2192 Press cerrado o fondos \u2014 el codo pasa por 90\xB0 bajo carga compuesta.; alargado \u2192 Extensi\xF3n sobre la cabeza (polea o mancuerna) \u2014 el hombro flexionado alarga la cabeza larga al m\xE1ximo.\n- **Nota de coaching:** El codo es una bisagra: solo se mueve en un plano. La posici\xF3n de la mu\xF1eca no tiene impacto directo en el reclutamiento del tr\xEDceps; cambiar el agarre no 'activa otra cabeza'. Para sesgar la cabeza larga se cambia la posici\xF3n del hombro (overhead), no la del agarre." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Braquiorradial", "text": "## Braquiorradial\n- **Ubicaci\xF3n:** Cara lateral del antebrazo, desde el codo\n- **Origen:** Cresta supracond\xEDlea lateral del h\xFAmero.\n- **Inserci\xF3n:** Ap\xF3fisis estiloides del radio.\n- **Acci\xF3n:** Flexi\xF3n de codo, m\xE1s eficiente en agarre neutro. Lleva el antebrazo hacia neutro desde pronaci\xF3n o supinaci\xF3n completas.\n- **Funci\xF3n en el entrenamiento:** Flexor de codo dominante cuando el agarre es neutro o prono y el b\xEDceps pierde palanca. Da el grosor visible del antebrazo lateral.\n- **Curva de fuerza:** acortado \u2192 Cierre del curl martillo \u2014 codo flexionado en agarre neutro.; medio \u2192 Curl martillo o curl inverso cerca de 90\xB0.; alargado \u2192 Inicio del curl inverso desde extensi\xF3n completa de codo.\n- **Nota de coaching:** En el curl inverso el peso baja porque el b\xEDceps pierde palanca en pronaci\xF3n, no porque el braquiorradial sea d\xE9bil. Es el mismo principio del agarre aplicado al rev\xE9s: el agarre decide qu\xE9 flexor lidera." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Flexores de mu\xF1eca y dedos", "text": "## Flexores de mu\xF1eca y dedos\n- **Ubicaci\xF3n:** Cara anterior (palmar) del antebrazo\n- **Origen:** Epic\xF3ndilo medial del h\xFAmero (tend\xF3n flexor com\xFAn); los flexores profundos tambi\xE9n del c\xFAbito y radio.\n- **Inserci\xF3n:** Carpo, metacarpianos y falanges.\n- **Acci\xF3n:** Flexi\xF3n de mu\xF1eca y dedos. Base del agarre.\n- **Funci\xF3n en el entrenamiento:** Sostienen todo agarre pesado: peso muerto, remos, dominadas, carries. Su trabajo principal en el gym es isom\xE9trico, no din\xE1mico.\n- **Curva de fuerza:** acortado \u2192 Cierre del wrist curl con apret\xF3n completo de dedos.; medio \u2192 Farmer carry o dead hang \u2014 isom\xE9trico pesado en rango medio.; alargado \u2192 Fondo del wrist curl dejando rodar la barra hasta los dedos.\n- **Nota de coaching:** El epic\xF3ndilo medial es el origen com\xFAn: la zona del codo de golfista. Suele irritarse por volumen de agarre acumulado (jalones, carries, curls), no por un ejercicio de mu\xF1eca en s\xED. Audita el volumen total de agarre antes de culpar a un movimiento." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Extensores de mu\xF1eca y dedos", "text": "## Extensores de mu\xF1eca y dedos\n- **Ubicaci\xF3n:** Cara posterior (dorsal) del antebrazo\n- **Origen:** Epic\xF3ndilo lateral del h\xFAmero (tend\xF3n extensor com\xFAn).\n- **Inserci\xF3n:** Bases de los metacarpianos y falanges dorsales.\n- **Acci\xF3n:** Extensi\xF3n de mu\xF1eca y dedos. Estabilizan la mu\xF1eca durante el agarre.\n- **Funci\xF3n en el entrenamiento:** Cada agarre fuerte los co-contrae para fijar la mu\xF1eca en posici\xF3n; sin extensores firmes los flexores pierden eficiencia de agarre.\n- **Curva de fuerza:** acortado \u2192 Cierre del wrist curl inverso \u2014 mu\xF1eca en extensi\xF3n completa.; medio \u2192 Isom\xE9trico estabilizando la mu\xF1eca en remos y curls pesados.; alargado \u2192 Fondo del wrist curl inverso con la mu\xF1eca en flexi\xF3n.\n- **Nota de coaching:** El epic\xF3ndilo lateral es la zona del codo de tenista. Igual que en el lado medial, la irritaci\xF3n suele venir del volumen de co-contracci\xF3n al agarrar, no de ejercicios de extensi\xF3n. Reducir volumen de agarre o usar straps temporalmente baja la carga directa en el tend\xF3n com\xFAn." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Pronador redondo", "text": "## Pronador redondo\n- **Ubicaci\xF3n:** Cara anterior proximal del antebrazo\n- **Origen:** Epic\xF3ndilo medial del h\xFAmero y ap\xF3fisis coronoides del c\xFAbito.\n- **Inserci\xF3n:** Cara lateral del tercio medio del radio.\n- **Acci\xF3n:** Pronaci\xF3n del antebrazo; asiste la flexi\xF3n de codo.\n- **Funci\xF3n en el entrenamiento:** Pronador principal en movimientos r\xE1pidos o con resistencia; en el gym trabaja sobre todo controlando la rotaci\xF3n del antebrazo bajo carga.\n- **Curva de fuerza:** acortado \u2192 Pronaci\xF3n con banda o polea llegando a pronaci\xF3n completa.; medio \u2192 Posici\xF3n de martillo (neutro) bajo resistencia rotacional.; alargado \u2192 Inicio en supinaci\xF3n completa contra banda o polea.\n- **Nota de coaching:** El nervio mediano pasa entre sus dos cabezas: punto de compresi\xF3n a considerar con s\xEDntomas tipo t\xFAnel carpiano que no mejoran tratando la mu\xF1eca. Casi nunca necesita trabajo directo." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Supinador", "text": "## Supinador\n- **Ubicaci\xF3n:** Cara posterolateral profunda del antebrazo proximal\n- **Origen:** Epic\xF3ndilo lateral del h\xFAmero y cresta supinadora del c\xFAbito.\n- **Inserci\xF3n:** Tercio proximal lateral del radio.\n- **Acci\xF3n:** Supinaci\xF3n del antebrazo en cualquier \xE1ngulo de codo.\n- **Funci\xF3n en el entrenamiento:** Supinador constante: trabaja con el codo extendido o flexionado. El b\xEDceps lo releva como supinador potente solo cuando el codo est\xE1 flexionado y la demanda es alta.\n- **Curva de fuerza:** acortado \u2192 Supinaci\xF3n completa contra banda o polea.; medio \u2192 Fase de rotaci\xF3n del curl Zottman pasando por neutro.; alargado \u2192 Inicio en pronaci\xF3n completa contra resistencia rotacional.\n- **Nota de coaching:** Si la supinaci\xF3n es el eslab\xF3n d\xE9bil, limita el curl antes que la fuerza de flexi\xF3n: el cliente 'no puede con el peso' aunque sus flexores s\xED puedan. Evaluar supinaci\xF3n resistida separa el problema de palanca del problema de fuerza." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Recto del abdomen", "text": "## Recto del abdomen\n- **Ubicaci\xF3n:** Cara anterior del abdomen, entre estern\xF3n y pubis\n- **Origen:** Cresta p\xFAbica y s\xEDnfisis del pubis.\n- **Inserci\xF3n:** Ap\xF3fisis xifoides y cart\xEDlagos costales 5\u20137.\n- **Acci\xF3n:** Flexi\xF3n del tronco; b\xE1scula p\xE9lvica posterior; resiste la extensi\xF3n lumbar (anti-extensi\xF3n).\n- **Funci\xF3n en el entrenamiento:** M\xE1s que flexionar la columna, su trabajo m\xE1s valioso en el gym es resistir que se extienda bajo carga. Es el motor de la funci\xF3n anti-extensi\xF3n: plancha, rueda abdominal, fallout. El crunch lo acorta; la plancha lo usa como debe usarse.\n- **Curva de fuerza:** acortado \u2192 Cierre del crunch en polea / m\xE1quina \u2014 costillas hacia la pelvis.; medio \u2192 Plancha o rueda abdominal a media extensi\xF3n, resistiendo la carga.; alargado \u2192 Fallout o rueda abdominal extendida \u2014 tronco abierto, recto estirado resistiendo la extensi\xF3n.\n- **Nota de coaching:** La columna lumbar no se 'fortalece' a base de flexionarla repetidamente; se estabiliza. Por eso el trabajo anti-extensi\xF3n (plancha, fallout) construye m\xE1s capacidad \xFAtil que el volumen de crunches. Carga la posici\xF3n alargada resistiendo la extensi\xF3n, ah\xED est\xE1 la tensi\xF3n real." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Oblicuo externo", "text": "## Oblicuo externo\n- **Ubicaci\xF3n:** Cara anterolateral del abdomen, capa m\xE1s superficial\n- **Origen:** Caras externas de las costillas inferiores 5\u201312.\n- **Inserci\xF3n:** Cresta il\xEDaca, l\xEDnea alba y ligamento inguinal.\n- **Acci\xF3n:** Flexi\xF3n del tronco; flexi\xF3n lateral ipsilateral; rotaci\xF3n contralateral. Resiste rotaci\xF3n y flexi\xF3n lateral.\n- **Funci\xF3n en el entrenamiento:** Pieza de la eslinga oblicua anterior: conecta con el aductor contralateral a trav\xE9s de la l\xEDnea alba. En un press de mancuerna a un brazo, el oblicuo externo se contrae para minimizar la rotaci\xF3n del tronco que provoca la carga desbalanceada. Esa es su funci\xF3n real: anti-rotaci\xF3n.\n- **Curva de fuerza:** acortado \u2192 Cierre de la rotaci\xF3n con cable / le\xF1ador \u2014 costillas hacia la cadera opuesta.; medio \u2192 Press Pallof o press a un brazo resistiendo la rotaci\xF3n.; alargado \u2192 Inicio del le\xF1ador o press a un brazo desde la posici\xF3n m\xE1s rotada/abierta.\n- **Nota de coaching:** El press de mancuerna a un brazo es trabajo de oblicuo aunque parezca de pecho: el peso descentrado obliga al externo a frenar la rotaci\xF3n. Cambiar de bilateral a unilateral convierte cualquier press en un est\xEDmulo anti-rotaci\xF3n sin cambiar el patr\xF3n." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Oblicuo interno", "text": "## Oblicuo interno\n- **Ubicaci\xF3n:** Cara anterolateral del abdomen, profundo al oblicuo externo\n- **Origen:** Cresta il\xEDaca, ligamento inguinal y fascia toracolumbar.\n- **Inserci\xF3n:** Costillas inferiores 10\u201312, l\xEDnea alba y cresta p\xFAbica.\n- **Acci\xF3n:** Flexi\xF3n del tronco; flexi\xF3n lateral ipsilateral; rotaci\xF3n ipsilateral. Resiste rotaci\xF3n.\n- **Funci\xF3n en el entrenamiento:** Sus fibras corren perpendiculares al oblicuo externo, formando con \xE9l un entramado que controla la rotaci\xF3n en ambos sentidos. Parte de la eslinga oblicua: el interno de un lado trabaja con el externo del otro para estabilizar la pelvis durante la marcha y todo movimiento unilateral.\n- **Curva de fuerza:** acortado \u2192 Cierre de la rotaci\xF3n ipsilateral con cable.; medio \u2192 Press Pallof o carry desbalanceado resistiendo la rotaci\xF3n.; alargado \u2192 Inicio de la rotaci\xF3n contralateral, oblicuo interno estirado.\n- **Nota de coaching:** No tiene sentido entrenarlo aislado del externo: trabajan como sistema en las eslingas. Los mejores est\xEDmulos son anti-rotaci\xF3n y carries desbalanceados, no giros cargados que buscan 'definir oblicuos'." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Transverso del abdomen", "text": "## Transverso del abdomen\n- **Ubicaci\xF3n:** Capa m\xE1s profunda de la pared abdominal, fibras horizontales\n- **Origen:** Cresta il\xEDaca, ligamento inguinal, fascia toracolumbar y cart\xEDlagos costales 7\u201312.\n- **Inserci\xF3n:** L\xEDnea alba, cresta p\xFAbica y aponeurosis abdominal.\n- **Acci\xF3n:** Comprime la cavidad abdominal y aumenta la presi\xF3n intraabdominal; no produce movimiento de columna.\n- **Funci\xF3n en el entrenamiento:** El 'cintur\xF3n natural': sus fibras horizontales envuelven el abdomen y, al contraerse, generan presi\xF3n intraabdominal que estabiliza la columna desde dentro. Es la base del bracing antes de levantar pesado. No se ve, pero es lo que sostiene el resto.\n- **Curva de fuerza:** acortado \u2192 Bracing m\xE1ximo / exhalaci\xF3n forzada vaciando aire con la pared tensa.; medio \u2192 Plancha, carry o sentadilla pesada sosteniendo presi\xF3n intraabdominal.; alargado \u2192 \u2014\n- **Nota de coaching:** No se 'fortalece' con repeticiones: se entrena la habilidad de generar y mantener presi\xF3n bajo carga. Por eso ense\xF1ar a respirar y bracear vale m\xE1s que cualquier ejercicio aislado de transverso. Es estabilidad, no movimiento." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Erectores de la columna", "text": "## Erectores de la columna\n- **Ubicaci\xF3n:** A ambos lados de la columna, de sacro a cr\xE1neo\n- **Origen:** Sacro, cresta il\xEDaca y ap\xF3fisis espinosas lumbares (masa com\xFAn).\n- **Inserci\xF3n:** Costillas, ap\xF3fisis transversas y espinosas a lo largo de la columna, hasta el cr\xE1neo (3 columnas: iliocostal, long\xEDsimo, espinoso).\n- **Acci\xF3n:** Extensi\xF3n de columna; flexi\xF3n lateral; resiste la flexi\xF3n del tronco (anti-flexi\xF3n).\n- **Funci\xF3n en el entrenamiento:** Su rol m\xE1s \xFAtil bajo carga no es extender la columna sino impedir que se flexione: mantener la espalda neutra en peso muerto, hip thrust y carries es trabajo isom\xE9trico de erectores. La extensi\xF3n cargada con rango completo a\xF1ade m\xE1s riesgo que beneficio en la mayor\xEDa.\n- **Curva de fuerza:** acortado \u2192 Cierre de la hiperextensi\xF3n a 45\xB0 / glute ham \u2014 tronco alineado con las caderas.; medio \u2192 Peso muerto o hip hinge manteniendo la columna neutra bajo carga.; alargado \u2192 Fondo de la hiperextensi\xF3n a 45\xB0 con la cadera flexionada y la columna neutra.\n- **Nota de coaching:** La 'fuerza de espalda baja' que mucha gente busca con superman e hiperextensiones cargadas es perseguir el fortalecimiento de algo que se debe estabilizar, no fortalecer en rango. Cuando dorsal y gl\xFAteo funcionan bien, la columna lumbar deja de tener que compensar: arreglar la disfunci\xF3n es mejor estrategia que cargar m\xE1s extensi\xF3n." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Mult\xEDfidos", "text": "## Mult\xEDfidos\n- **Ubicaci\xF3n:** Surco profundo a ambos lados de la columna, sobre todo lumbar\n- **Origen:** Sacro, ap\xF3fisis transversas vertebrales.\n- **Inserci\xF3n:** Ap\xF3fisis espinosas 2\u20134 v\xE9rtebras por encima.\n- **Acci\xF3n:** Estabilizaci\xF3n segmentaria de la columna; asiste la extensi\xF3n y la rotaci\xF3n.\n- **Funci\xF3n en el entrenamiento:** Estabilizador local profundo: controla el movimiento entre v\xE9rtebras vecinas, no la columna entera. Aporta rigidez segmentaria que ning\xFAn ejercicio a\xEDsla; se entrena a trav\xE9s de demandas de estabilidad bajo carga, no de movimientos dirigidos a \xE9l.\n- **Curva de fuerza:** acortado \u2192 \u2014; medio \u2192 Bird dog o RDL a una pierna exigiendo control segmentario.; alargado \u2192 \u2014\n- **Nota de coaching:** No es un objetivo de hipertrofia ni de fuerza directa: su valor es la estabilidad de bajo nivel y alta precisi\xF3n. Los est\xEDmulos anti-rotaci\xF3n con base inestable (bird dog, RDL a una pierna) cubren su funci\xF3n mejor que cualquier intento de aislarlo." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Cuadrado lumbar", "text": "## Cuadrado lumbar\n- **Ubicaci\xF3n:** Profundo en la espalda baja, entre la \xFAltima costilla y la pelvis\n- **Origen:** Cresta il\xEDaca y ligamento iliolumbar.\n- **Inserci\xF3n:** Duod\xE9cima costilla y ap\xF3fisis transversas lumbares L1\u2013L4.\n- **Acci\xF3n:** Flexi\xF3n lateral del tronco; eleva la cadera; resiste la flexi\xF3n lateral (anti-flexi\xF3n lateral). Estabiliza la \xFAltima costilla en la respiraci\xF3n.\n- **Funci\xF3n en el entrenamiento:** Su trabajo m\xE1s valioso es resistir la flexi\xF3n lateral, no producirla: en un suitcase carry, el QL del lado opuesto a la carga se contrae para mantener la pelvis nivelada. Junto a oblicuos y dorsal estabiliza la columna lumbar contra cargas laterales y rotacionales.\n- **Curva de fuerza:** acortado \u2192 Cierre de la hiperextensi\xF3n lateral a 45\xB0 \u2014 tronco elevado del lado trabajado.; medio \u2192 Suitcase carry o plancha lateral resistiendo la ca\xEDda de la pelvis.; alargado \u2192 Fondo de la hiperextensi\xF3n lateral a 45\xB0, tronco ca\xEDdo hacia el lado.\n- **Nota de coaching:** Suele se\xF1alarse como culpable del dolor lumbar lateral, pero casi siempre est\xE1 compensando una pelvis que no se estabiliza bien por debilidad de gl\xFAteo medio o de la eslinga. Cargar anti-flexi\xF3n lateral (suitcase carry) construye la capacidad que el QL necesita en vez de estirarlo sin m\xE1s." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Diafragma", "text": "## Diafragma\n- **Ubicaci\xF3n:** C\xFApula muscular que separa t\xF3rax y abdomen\n- **Origen:** Ap\xF3fisis xifoides, cart\xEDlagos costales inferiores 7\u201312 y v\xE9rtebras lumbares L1\u2013L3 (pilares).\n- **Inserci\xF3n:** Centro tendinoso del diafragma.\n- **Acci\xF3n:** Inspiraci\xF3n principal; modula la presi\xF3n intraabdominal junto con el transverso y el suelo p\xE9lvico.\n- **Funci\xF3n en el entrenamiento:** No solo respira: forma la tapa superior del cilindro abdominal. Para bracear de verdad, el diafragma desciende y presiona contra el transverso y el suelo p\xE9lvico, creando la presi\xF3n que estabiliza la columna. Respirar bien es la base del bracing, no un detalle aparte.\n- **Curva de fuerza:** acortado \u2192 \u2014; medio \u2192 Inhalaci\xF3n 360\xB0 contra la pared abdominal antes de una serie pesada.; alargado \u2192 \u2014\n- **Nota de coaching:** La columna se estabiliza con presi\xF3n, y esa presi\xF3n empieza en c\xF3mo respiras. Un cliente que no sabe inhalar a 360\xB0 y mantener no podr\xE1 bracear bien por m\xE1s abdominales que haga. La respiraci\xF3n es una habilidad entrenable, anterior a cualquier ejercicio de core." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Gl\xFAteo mayor", "text": "## Gl\xFAteo mayor\n- **Ubicaci\xF3n:** Cara posterior de la cadera (el gl\xFAteo visible)\n- **Origen:** Ilion, sacro y fascia toracolumbar.\n- **Inserci\xF3n:** Directa: l\xEDnea gl\xFAtea del f\xE9mur. Indirecta: banda iliotibial hacia la tibia.\n- **Acci\xF3n:** Extensi\xF3n de cadera (fibras superiores e inferiores), rotaci\xF3n externa y abducci\xF3n (sobre todo superiores); aducci\xF3n (inferiores). B\xE1scula p\xE9lvica posterior con el core.\n- **Funci\xF3n en el entrenamiento:** El m\xFAsculo m\xE1s grande del cuerpo y el extensor de cadera m\xE1s fuerte. Cambia de funci\xF3n seg\xFAn la posici\xF3n de la cadera, por eso conviene cargarlo en distintas zonas: hip thrust y extensi\xF3n a 45\xB0 cargan la posici\xF3n acortada (b\xE1scula posterior); RDL y peso muerto la posici\xF3n alargada (cadera flexionada). La b\xE1scula p\xE9lvica anterior lo vuelve mucho menos efectivo: si la pelvis descansa en anterior, el trabajo de gl\xFAteo se complica antes de empezar.\n- **Curva de fuerza:** acortado \u2192 Cierre del hip thrust o extensi\xF3n a 45\xB0 \u2014 cadera en extensi\xF3n completa con b\xE1scula posterior.; medio \u2192 Split squat con pie elevado / sentadilla con \xE9nfasis en cadera, tronco inclinado al frente.; alargado \u2192 Fondo del RDL o peso muerto \u2014 cadera en flexi\xF3n profunda, gl\xFAteo estirado.\n- **Nota de coaching:** La 'debilidad de gl\xFAteo' que se diagnostica con hip thrusts y kickbacks rara vez es terap\xE9utica: la causa de fondo suele ser inestabilidad de gl\xFAteo medio, no falta de fuerza del mayor. Entrenar el gl\xFAteo mayor por est\xE9tica y fuerza est\xE1 bien; usarlo como 'soluci\xF3n' a un dolor que viene de la estabilidad lateral, no. Para cubrir sus funciones, recorre las categor\xEDas: hinge (alargado), thrust/extensi\xF3n (acortado), split squat (medio), kickback y abducci\xF3n/rotaci\xF3n externa." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Gl\xFAteo medio", "text": "## Gl\xFAteo medio\n- **Ubicaci\xF3n:** Cara lateral de la cadera, sobre el gl\xFAteo mayor\n- **Origen:** Superficie externa del ilion.\n- **Inserci\xF3n:** Troc\xE1nter mayor del f\xE9mur.\n- **Acci\xF3n:** Fibras anteriores: rotaci\xF3n interna y abducci\xF3n. Fibras posteriores: rotaci\xF3n externa y abducci\xF3n. Funci\xF3n global: estabilizador lateral de la cadera.\n- **Funci\xF3n en el entrenamiento:** Contraste clave entre acci\xF3n y funci\xF3n: aunque puede abducir y rotar, su trabajo real es estabilizar la pelvis en apoyo monopodal, evitando que la cadera del lado libre caiga. Es el m\xFAsculo cuya inestabilidad explica la mayor\xEDa de las 'debilidades de gl\xFAteo' que en realidad son problemas de control lateral.\n- **Curva de fuerza:** acortado \u2192 Cierre de la abducci\xF3n de cadera de pie o en m\xE1quina.; medio \u2192 Step down o hip drop controlado en apoyo monopodal.; alargado \u2192 Fondo del hip drop / abducci\xF3n con la pelvis ca\xEDda hacia el lado libre.\n- **Nota de coaching:** Aqu\xED est\xE1 el cambio de paradigma: cuando alguien dice 'tengo gl\xFAteo d\xE9bil', casi siempre es inestabilidad de gl\xFAteo medio, no falta de fuerza del mayor. Por eso un step down o un hip drop con control en apoyo monopodal hacen m\xE1s que mil kickbacks. Eval\xFAa estabilidad lateral antes de programar m\xE1s hip thrust." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Gl\xFAteo menor", "text": "## Gl\xFAteo menor\n- **Ubicaci\xF3n:** Cara lateral profunda de la cadera, bajo el gl\xFAteo medio\n- **Origen:** Superficie externa del ilion (inferior al medio).\n- **Inserci\xF3n:** Troc\xE1nter mayor del f\xE9mur.\n- **Acci\xF3n:** Acortado act\xFAa como abductor y rotador interno de la cadera; estabiliza la articulaci\xF3n.\n- **Funci\xF3n en el entrenamiento:** El m\xE1s peque\xF1o de la tr\xEDada gl\xFAtea por secci\xF3n transversal. Acompa\xF1a al gl\xFAteo medio en la estabilizaci\xF3n lateral; aporta sobre todo control fino y compresi\xF3n de la cabeza femoral en el acet\xE1bulo durante el apoyo.\n- **Curva de fuerza:** acortado \u2192 Cierre de la abducci\xF3n con ligera rotaci\xF3n interna.; medio \u2192 Apoyo monopodal controlado, mismo trabajo que el gl\xFAteo medio.; alargado \u2192 \u2014\n- **Nota de coaching:** No se entrena por separado del gl\xFAteo medio: lo que estabiliza la cadera en apoyo monopodal entrena a los dos. Saberlo evita perseguir 'activaciones' aisladas que no tienen utilidad pr\xE1ctica." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Tensor de la fascia lata", "text": "## Tensor de la fascia lata\n- **Ubicaci\xF3n:** Cara anterolateral de la cadera, hacia la banda iliotibial\n- **Origen:** Espina il\xEDaca anterosuperior y cresta il\xEDaca.\n- **Inserci\xF3n:** Banda iliotibial (hacia el c\xF3ndilo lateral de la tibia).\n- **Acci\xF3n:** Flexi\xF3n, abducci\xF3n y rotaci\xF3n interna de cadera; tensa la banda iliotibial.\n- **Funci\xF3n en el entrenamiento:** Sinergista de la cadera anterior que comparte abducci\xF3n con el gl\xFAteo medio. Cuando el medio no estabiliza bien, el TFL tiende a sobreactuar y dominar la abducci\xF3n, lo que puede tensar la banda iliotibial y trasladar molestias a la rodilla lateral.\n- **Curva de fuerza:** acortado \u2192 Cierre de la abducci\xF3n de cadera en ligera flexi\xF3n y rotaci\xF3n interna.; medio \u2192 \u2014; alargado \u2192 Estiramiento de la l\xEDnea lateral con la cadera en extensi\xF3n y aducci\xF3n.\n- **Nota de coaching:** Un TFL 'tenso' suele ser s\xEDntoma, no causa: compensa una abducci\xF3n que el gl\xFAteo medio no estabiliza. Estirarlo da alivio temporal, pero entrenar la estabilidad lateral del medio resuelve el patr\xF3n. La molestia lateral de rodilla por banda iliotibial muchas veces empieza aqu\xED, en la cadera." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Piriforme", "text": "## Piriforme\n- **Ubicaci\xF3n:** Cadera profunda, posterior a la articulaci\xF3n\n- **Origen:** Cara anterior del sacro.\n- **Inserci\xF3n:** Troc\xE1nter mayor del f\xE9mur.\n- **Acci\xF3n:** Rotaci\xF3n externa de cadera en extensi\xF3n; abducci\xF3n con la cadera flexionada. Su acci\xF3n cambia con el \xE1ngulo de cadera.\n- **Funci\xF3n en el entrenamiento:** Rotador externo profundo y estabilizador de la articulaci\xF3n coxofemoral. El nervio ci\xE1tico pasa muy cerca (y a veces lo atraviesa), por eso un piriforme tenso o sobreactivo puede dar s\xEDntomas ci\xE1ticos sin que el origen est\xE9 en la columna.\n- **Curva de fuerza:** acortado \u2192 Cierre de la rotaci\xF3n externa de cadera (clamshell / banda).; medio \u2192 Apoyo monopodal controlado resistiendo rotaci\xF3n interna.; alargado \u2192 Estiramiento del piriforme con la cadera flexionada y aducida (pigeon).\n- **Nota de coaching:** Su relevancia cl\xEDnica supera con creces su valor est\xE9tico: rara vez se entrena directo, pero su relaci\xF3n con el ci\xE1tico lo vuelve sospechoso cuando hay s\xEDntomas de gl\xFAteo/pierna que no encajan con la columna. Antes de tratarlo, descarta que sea otra cosa." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Rotadores externos profundos", "text": "## Rotadores externos profundos\n- **Ubicaci\xF3n:** Cadera profunda, posterior a la articulaci\xF3n (bajo el gl\xFAteo mayor)\n- **Origen:** Pelvis: isquion, sacro y borde del agujero obturador (g\xE9melos, obturadores y cuadrado femoral).\n- **Inserci\xF3n:** Troc\xE1nter mayor y fosa trocant\xE9rica del f\xE9mur.\n- **Acci\xF3n:** Rotaci\xF3n externa de cadera; compresi\xF3n y centrado de la cabeza femoral.\n- **Funci\xF3n en el entrenamiento:** El equivalente del manguito rotador en la cadera: un grupo peque\xF1o que centra la cabeza femoral en el acet\xE1bulo durante todo el movimiento. Su trabajo es estabilidad articular fina, no producir fuerza grande de rotaci\xF3n.\n- **Curva de fuerza:** acortado \u2192 Cierre de la rotaci\xF3n externa de cadera con banda.; medio \u2192 Apoyo monopodal controlado, centrando la cadera.; alargado \u2192 \u2014\n- **Nota de coaching:** Igual que el manguito en el hombro, su funci\xF3n supera su acci\xF3n: no buscas hipertrofiarlos sino que centren la articulaci\xF3n bajo carga. El trabajo de rotaci\xF3n externa controlada y la estabilidad en apoyo monopodal los cubren mejor que cualquier aislamiento." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Iliopsoas", "text": "## Iliopsoas\n- **Ubicaci\xF3n:** Cadera anterior profunda, de la columna lumbar al f\xE9mur\n- **Origen:** Psoas mayor: cuerpos y ap\xF3fisis transversas T12\u2013L5. Il\xEDaco: fosa il\xEDaca.\n- **Inserci\xF3n:** Troc\xE1nter menor del f\xE9mur.\n- **Acci\xF3n:** Flexi\xF3n de cadera; con la cadera fija, flexi\xF3n del tronco. El psoas tambi\xE9n influye en la columna lumbar.\n- **Funci\xF3n en el entrenamiento:** Flexor de cadera principal y \xFAnico m\xFAsculo que conecta directamente columna lumbar y f\xE9mur. Por eso un psoas r\xEDgido puede traccionar la pelvis hacia b\xE1scula anterior, lo que (como vimos en el gl\xFAteo mayor) reduce la eficacia del gl\xFAteo. La cadera anterior y la posterior se condicionan mutuamente.\n- **Curva de fuerza:** acortado \u2192 Cierre de la flexi\xF3n de cadera por encima de 90\xB0 (rodilla al pecho con carga).; medio \u2192 Flexi\xF3n de cadera de pie con banda cerca de 90\xB0.; alargado \u2192 Estiramiento couch / Thomas con la cadera en extensi\xF3n.\n- **Nota de coaching:** El test de Thomas mide su flexibilidad por una raz\xF3n: un psoas corto desplaza la pelvis y compromete tanto la columna lumbar como la funci\xF3n del gl\xFAteo. Antes de cargar m\xE1s extensi\xF3n de cadera, revisa si el flexor est\xE1 limitando la posici\xF3n p\xE9lvica. Eval\xFAa solo si el resultado cambiar\xEDa tu plan." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Sartorio", "text": "## Sartorio\n- **Ubicaci\xF3n:** Banda larga que cruza el muslo de la cadera a la rodilla medial\n- **Origen:** Espina il\xEDaca anterosuperior.\n- **Inserci\xF3n:** Cara medial proximal de la tibia (pata de ganso).\n- **Acci\xF3n:** Flexi\xF3n, abducci\xF3n y rotaci\xF3n externa de cadera; flexi\xF3n de rodilla. El m\xFAsculo m\xE1s largo del cuerpo.\n- **Funci\xF3n en el entrenamiento:** Biarticular: lleva la pierna a la posici\xF3n de 'cruzar el tobillo sobre la rodilla opuesta'. M\xE1s coordinador de movimiento combinado que generador de fuerza; rara vez es el limitante en el gym.\n- **Curva de fuerza:** acortado \u2192 Posici\xF3n combinada de flexi\xF3n + abducci\xF3n + rotaci\xF3n externa de cadera.; medio \u2192 \u2014; alargado \u2192 \u2014\n- **Nota de coaching:** No requiere trabajo dedicado: queda cubierto por el entrenamiento de cadera y rodilla. Su inserci\xF3n en la pata de ganso lo vuelve relevante cuando hay molestia medial de rodilla, compartida con gracilis y semitendinoso." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Aductor mayor", "text": "## Aductor mayor\n- **Ubicaci\xF3n:** Cara interna del muslo, el aductor m\xE1s grande y profundo\n- **Origen:** Rama isquiop\xFAbica y tuberosidad isqui\xE1tica.\n- **Inserci\xF3n:** L\xEDnea \xE1spera del f\xE9mur y tub\xE9rculo aductor (cabeza isquiocond\xEDlea).\n- **Acci\xF3n:** Aducci\xF3n de cadera; su porci\xF3n posterior es adem\xE1s un potente extensor de cadera (funci\xF3n tipo isquiotibial).\n- **Funci\xF3n en el entrenamiento:** Mucho m\xE1s que un 'aductor': su cabeza posterior contribuye fuerte a la extensi\xF3n de cadera, por eso trabaja intensamente en el fondo de la sentadilla profunda y en los hinges. Es de los mayores contribuyentes a la fuerza de cadera y suele estar infravalorado.\n- **Curva de fuerza:** acortado \u2192 Cierre de la aducci\xF3n en m\xE1quina / polea \u2014 piernas juntas.; medio \u2192 Sentadilla profunda o split squat pasando por el rango medio de cadera.; alargado \u2192 Fondo de la sentadilla profunda o del cossack squat \u2014 aductor estirado al m\xE1ximo.\n- **Nota de coaching:** Si tratas la aducci\xF3n como 'm\xFAsculo de m\xE1quina interna de muslo' te pierdes su rol real: extensor de cadera en posici\xF3n alargada. Sentadillas profundas y cossacks lo entrenan donde m\xE1s importa. Una cadera que no abre bien en aducci\xF3n/abducci\xF3n puede limitar la profundidad antes que cu\xE1driceps o gl\xFAteo." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Aductor largo", "text": "## Aductor largo\n- **Ubicaci\xF3n:** Cara interna anterior del muslo\n- **Origen:** Cuerpo del pubis, inferior a la cresta p\xFAbica.\n- **Inserci\xF3n:** Tercio medio de la l\xEDnea \xE1spera del f\xE9mur.\n- **Acci\xF3n:** Aducci\xF3n de cadera; asiste flexi\xF3n y rotaci\xF3n. Parte de la eslinga oblicua anterior.\n- **Funci\xF3n en el entrenamiento:** El m\xE1s visible de los aductores anteriores. Junto con el aductor breve y el pect\xEDneo, forma con el oblicuo contralateral la eslinga oblicua anterior que estabiliza la pelvis en la marcha y en todo movimiento unilateral.\n- **Curva de fuerza:** acortado \u2192 Cierre de la aducci\xF3n en m\xE1quina / polea.; medio \u2192 Estabilizaci\xF3n p\xE9lvica en zancadas y apoyos monopodales.; alargado \u2192 Fondo del cossack squat o estiramiento en rana.\n- **Nota de coaching:** Su valor real no es 'apretar las piernas' sino estabilizar la pelvis del lado opuesto en la eslinga: en un press a un brazo, el aductor del lado contrario mantiene el f\xE9mur hacia la l\xEDnea media para que la pelvis no rote. Es trabajo de estabilidad, no de aislamiento." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Aductor breve", "text": "## Aductor breve\n- **Ubicaci\xF3n:** Cara interna del muslo, profundo al aductor largo\n- **Origen:** Cuerpo y rama inferior del pubis.\n- **Inserci\xF3n:** L\xEDnea pect\xEDnea y tercio proximal de la l\xEDnea \xE1spera del f\xE9mur.\n- **Acci\xF3n:** Aducci\xF3n de cadera; asiste flexi\xF3n. Parte de la eslinga oblicua anterior.\n- **Funci\xF3n en el entrenamiento:** Aductor profundo que acompa\xF1a al largo en la estabilizaci\xF3n p\xE9lvica. Comparte funci\xF3n con sus vecinos, por lo que no requiere est\xEDmulo espec\xEDfico aparte del trabajo de aducci\xF3n y de estabilidad unilateral.\n- **Curva de fuerza:** acortado \u2192 Cierre de la aducci\xF3n en m\xE1quina / polea.; medio \u2192 Estabilizaci\xF3n p\xE9lvica en apoyos monopodales.; alargado \u2192 Fondo del cossack squat o estiramiento en rana.\n- **Nota de coaching:** No tiene sentido programarlo por separado del aductor largo: trabajan como unidad. Lo \xFAtil es recordar que la eslinga oblicua incluye estos aductores, as\xED que el trabajo anti-rotaci\xF3n de core tambi\xE9n los entrena." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Recto interno (gr\xE1cil)", "text": "## Recto interno (gr\xE1cil)\n- **Ubicaci\xF3n:** Cara interna del muslo, banda larga y superficial hasta la rodilla\n- **Origen:** Rama inferior del pubis.\n- **Inserci\xF3n:** Cara medial proximal de la tibia (pata de ganso).\n- **Acci\xF3n:** Aducci\xF3n de cadera; flexi\xF3n y rotaci\xF3n interna de rodilla. Biarticular.\n- **Funci\xF3n en el entrenamiento:** El \xFAnico aductor que cruza la rodilla, por lo que su longitud depende de la posici\xF3n de la rodilla adem\xE1s de la cadera. Aporta poco a la fuerza de aducci\xF3n; su rol es m\xE1s de coordinaci\xF3n y estabilidad medial.\n- **Curva de fuerza:** acortado \u2192 Aducci\xF3n con la rodilla flexionada \u2014 m\xE1ximo acortamiento combinado.; medio \u2192 \u2014; alargado \u2192 Fondo del cossack squat con la rodilla extendida \u2014 gr\xE1cil estirado.\n- **Nota de coaching:** Comparte inserci\xF3n en la pata de ganso con sartorio y semitendinoso, as\xED que entra en el cuadro cuando hay molestia medial de rodilla. No se entrena aislado; el trabajo de aducci\xF3n y de cadera lo cubre." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Pect\xEDneo", "text": "## Pect\xEDneo\n- **Ubicaci\xF3n:** Cara interna superior del muslo, en el pliegue de la ingle\n- **Origen:** L\xEDnea pect\xEDnea (rama superior del pubis).\n- **Inserci\xF3n:** L\xEDnea pect\xEDnea del f\xE9mur, inferior al troc\xE1nter menor.\n- **Acci\xF3n:** Flexi\xF3n y aducci\xF3n de cadera. Parte de la eslinga oblicua anterior.\n- **Funci\xF3n en el entrenamiento:** El m\xE1s proximal de los aductores; combina flexi\xF3n y aducci\xF3n de cadera. Junto con el aductor breve es parte de los 'aductores altos' que se conectan con la eslinga oblicua anterior y estabilizan la cadera anterior en la marcha.\n- **Curva de fuerza:** acortado \u2192 Cierre de la aducci\xF3n combinada con flexi\xF3n de cadera.; medio \u2192 Estabilizaci\xF3n de la cadera anterior en apoyos monopodales.; alargado \u2192 Estiramiento en rana o fondo del cossack squat.\n- **Nota de coaching:** Forma parte de los 'aductores altos' de la eslinga oblicua anterior: en un movimiento unilateral, mantienen el f\xE9mur del lado opuesto hacia la l\xEDnea media para estabilizar la pelvis. Trabaja indirecto en todo el trabajo de cadera; no necesita aislamiento." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Recto femoral", "text": "## Recto femoral\n- **Ubicaci\xF3n:** Centro de la cara anterior del muslo\n- **Origen:** Espina il\xEDaca anteroinferior y borde superior del acet\xE1bulo.\n- **Inserci\xF3n:** Tuberosidad de la tibia v\xEDa tend\xF3n rotuliano (con el resto del cu\xE1driceps).\n- **Acci\xF3n:** Extensi\xF3n de rodilla y flexi\xF3n de cadera. Biarticular: el \xFAnico de los cuatro cu\xE1driceps que cruza la cadera.\n- **Funci\xF3n en el entrenamiento:** Por cruzar la cadera, su longitud depende de la posici\xF3n de esta: con la cadera extendida (de pie) se alarga y aporta m\xE1s a la extensi\xF3n de rodilla; con la cadera flexionada (sentado) se acorta y pierde palanca. Por eso el sissy squat o la extensi\xF3n de pierna con tronco atr\xE1s lo cargan distinto que un leg extension normal.\n- **Curva de fuerza:** acortado \u2192 Cierre de la extensi\xF3n de pierna (sentado), rodilla bloqueada.; medio \u2192 Sentadilla o prensa pasando por el rango medio de rodilla.; alargado \u2192 Sissy squat o extensi\xF3n con cadera extendida \u2014 recto femoral estirado sobre la cadera.\n- **Nota de coaching:** En la extensi\xF3n de pierna, dejar que la pelvis bascule en anterior pasa a una posici\xF3n funcionalmente inestable; el enfoque sugiere tirar de las costillas hacia abajo y sujetar el asiento para mantener la pelvis controlada. Y los aductores no son espectadores: estabilizan el f\xE9mur para que la rodilla viaje recta, evitando que la cadera se abra en el exc\xE9ntrico. Mucha gente se apoya de m\xE1s en la estabilidad externa de la m\xE1quina y se pierde la interna." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Vasto lateral", "text": "## Vasto lateral\n- **Ubicaci\xF3n:** Cara externa del muslo (el 'barrido' lateral del cu\xE1driceps)\n- **Origen:** Troc\xE1nter mayor y labio lateral de la l\xEDnea \xE1spera del f\xE9mur.\n- **Inserci\xF3n:** Tuberosidad de la tibia v\xEDa tend\xF3n rotuliano.\n- **Acci\xF3n:** Extensi\xF3n de rodilla. Monoarticular.\n- **Funci\xF3n en el entrenamiento:** El m\xE1s grande de los cu\xE1driceps y el que crea el barrido lateral del muslo. Al no cruzar la cadera, su contribuci\xF3n a la extensi\xF3n de rodilla es constante sin importar la posici\xF3n de la cadera. Trabaja en toda sentadilla, prensa y extensi\xF3n.\n- **Curva de fuerza:** acortado \u2192 Cierre de la extensi\xF3n de pierna, rodilla bloqueada.; medio \u2192 Sentadilla o prensa cerca de 90\xB0 de rodilla.; alargado \u2192 Fondo de la sentadilla profunda o hack squat \u2014 cu\xE1driceps estirado bajo carga.\n- **Nota de coaching:** Como es monoarticular, no se sesga por posici\xF3n de cadera: la \xFAnica palanca real es el rango de rodilla. Cargar la posici\xF3n alargada (fondo de sentadilla profunda, hack squat) suele dar m\xE1s est\xEDmulo que vivir en el bloqueo." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Vasto medial", "text": "## Vasto medial\n- **Ubicaci\xF3n:** Cara interna del muslo, sobre la rodilla (la 'gota' medial)\n- **Origen:** Labio medial de la l\xEDnea \xE1spera del f\xE9mur.\n- **Inserci\xF3n:** Tuberosidad de la tibia v\xEDa tend\xF3n rotuliano; sus fibras oblicuas estabilizan la r\xF3tula.\n- **Acci\xF3n:** Extensi\xF3n de rodilla; estabilizaci\xF3n medial de la r\xF3tula.\n- **Funci\xF3n en el entrenamiento:** Comparte la extensi\xF3n con los otros vastos y adem\xE1s mantiene la r\xF3tula centrada en su surco, sobre todo en los \xFAltimos grados de extensi\xF3n. Trabaja en todo el rango; la idea de que solo se activa al final est\xE1 sobredimensionada.\n- **Curva de fuerza:** acortado \u2192 Cierre de la extensi\xF3n de pierna, rodilla bloqueada.; medio \u2192 Sentadilla o prensa cerca de 90\xB0 de rodilla.; alargado \u2192 Fondo de la sentadilla profunda con la rodilla muy flexionada.\n- **Nota de coaching:** Su rol de estabilizaci\xF3n rotuliana lo hace relevante en molestias anteriores de rodilla, pero no se 'rehabilita' con extensiones de rango corto: la r\xF3tula se controla mejor con rango completo y buena alineaci\xF3n de rodilla, no aislando el \xFAltimo tramo." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Vasto intermedio", "text": "## Vasto intermedio\n- **Ubicaci\xF3n:** Profundo al recto femoral, cara anterior del muslo\n- **Origen:** Caras anterior y lateral del cuerpo del f\xE9mur.\n- **Inserci\xF3n:** Tuberosidad de la tibia v\xEDa tend\xF3n rotuliano.\n- **Acci\xF3n:** Extensi\xF3n de rodilla. Monoarticular.\n- **Funci\xF3n en el entrenamiento:** El vasto oculto, justo bajo el recto femoral. Aporta a la extensi\xF3n de rodilla igual que los otros vastos; no se ve ni se a\xEDsla, pero suma a la fuerza y el volumen del cu\xE1driceps en todo trabajo de extensi\xF3n.\n- **Curva de fuerza:** acortado \u2192 Cierre de la extensi\xF3n de pierna, rodilla bloqueada.; medio \u2192 Sentadilla o prensa cerca de 90\xB0 de rodilla.; alargado \u2192 Fondo de la sentadilla profunda o hack squat.\n- **Nota de coaching:** No hay forma de dirigir trabajo solo a \xE9l: comparte funci\xF3n con los dem\xE1s vastos. Lo que entrena la extensi\xF3n de rodilla lo entrena. \xDAtil saber que existe para entender que el grosor del cu\xE1driceps no es solo lo que se ve en superficie." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "B\xEDceps femoral", "text": "## B\xEDceps femoral\n- **Ubicaci\xF3n:** Cara posterolateral del muslo (isquiotibial externo)\n- **Origen:** Cabeza larga: tuberosidad isqui\xE1tica. Cabeza corta: l\xEDnea \xE1spera del f\xE9mur.\n- **Inserci\xF3n:** Cabeza del peron\xE9.\n- **Acci\xF3n:** Flexi\xF3n de rodilla y rotaci\xF3n externa de tibia; la cabeza larga extiende la cadera. Rotaci\xF3n externa por inserci\xF3n lateral.\n- **Funci\xF3n en el entrenamiento:** La cabeza larga es biarticular (cadera + rodilla) y la corta monoarticular (solo rodilla), por eso un mismo grupo necesita est\xEDmulos distintos: los hinges (RDL) cargan la funci\xF3n de cadera en posici\xF3n alargada; los curls de pierna cargan la flexi\xF3n de rodilla. Como el b\xEDceps brazo y el tr\xEDceps, el grupo cambia seg\xFAn qu\xE9 articulaci\xF3n gobierna.\n- **Curva de fuerza:** acortado \u2192 Cierre del curl femoral, rodilla totalmente flexionada.; medio \u2192 Curl femoral o buenos d\xEDas pasando por el rango medio.; alargado \u2192 Fondo del RDL \u2014 cadera flexionada, isquiotibial estirado al m\xE1ximo.\n- **Nota de coaching:** El enfoque compara el grupo isquiotibial con el b\xEDceps del brazo: ambos cambian de funci\xF3n seg\xFAn la articulaci\xF3n que manda. No basta con curls de pierna; la cabeza larga necesita trabajo de extensi\xF3n de cadera en posici\xF3n alargada (RDL) para entrenarse donde m\xE1s produce. Su rotaci\xF3n externa de tibia importa cuando hay valgo o molestia lateral de rodilla." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Semitendinoso", "text": "## Semitendinoso\n- **Ubicaci\xF3n:** Cara posteromedial del muslo (isquiotibial interno superficial)\n- **Origen:** Tuberosidad isqui\xE1tica.\n- **Inserci\xF3n:** Cara medial proximal de la tibia (pata de ganso).\n- **Acci\xF3n:** Flexi\xF3n de rodilla, extensi\xF3n de cadera y rotaci\xF3n interna de tibia. Biarticular.\n- **Funci\xF3n en el entrenamiento:** Isquiotibial medial que, a diferencia del b\xEDceps femoral, rota la tibia hacia dentro. Su inserci\xF3n en la pata de ganso lo vincula con sartorio y gr\xE1cil. Cubre las dos funciones del grupo (cadera y rodilla), por lo que tambi\xE9n pide hinges adem\xE1s de curls.\n- **Curva de fuerza:** acortado \u2192 Cierre del curl femoral, rodilla totalmente flexionada.; medio \u2192 Curl femoral o RDL pasando por el rango medio.; alargado \u2192 Fondo del RDL \u2014 cadera flexionada, isquiotibial estirado.\n- **Nota de coaching:** Los isquiotibiales mediales (semitendinoso y semimembranoso) rotan la tibia hacia dentro, opuesto al b\xEDceps femoral. Ese balance medial/lateral importa para el control de rodilla; entrenarlos con hinge y curl en distintos \xE1ngulos cubre ambas funciones mejor que solo una m\xE1quina." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Semimembranoso", "text": "## Semimembranoso\n- **Ubicaci\xF3n:** Cara posteromedial del muslo, profundo al semitendinoso\n- **Origen:** Tuberosidad isqui\xE1tica.\n- **Inserci\xF3n:** C\xF3ndilo medial de la tibia.\n- **Acci\xF3n:** Flexi\xF3n de rodilla, extensi\xF3n de cadera y rotaci\xF3n interna de tibia. Biarticular.\n- **Funci\xF3n en el entrenamiento:** El isquiotibial medial m\xE1s profundo y de mayor secci\xF3n transversal, fuerte contribuyente a la extensi\xF3n de cadera y la flexi\xF3n de rodilla. Comparte funci\xF3n y comportamiento con el semitendinoso: necesita los dos est\xEDmulos (hinge y curl).\n- **Curva de fuerza:** acortado \u2192 Cierre del curl femoral, rodilla totalmente flexionada.; medio \u2192 Curl femoral o RDL pasando por el rango medio.; alargado \u2192 Fondo del RDL \u2014 cadera flexionada, isquiotibial estirado.\n- **Nota de coaching:** No se programa por separado del semitendinoso: trabajan como pareja medial. Lo accionable es recordar que los isquiotibiales no son 'un m\xFAsculo': hay que cargar tanto su rol de cadera (RDL, posici\xF3n alargada) como el de rodilla (curl), y atender el balance medial/lateral por el control rotacional de la rodilla." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Gastrocnemio", "text": "## Gastrocnemio\n- **Ubicaci\xF3n:** Parte superior y visible de la pantorrilla, las dos cabezas\n- **Origen:** Cabezas medial y lateral sobre los c\xF3ndilos del f\xE9mur.\n- **Inserci\xF3n:** Calc\xE1neo v\xEDa tend\xF3n de Aquiles.\n- **Acci\xF3n:** Flexi\xF3n plantar del tobillo; asiste la flexi\xF3n de rodilla. Biarticular.\n- **Funci\xF3n en el entrenamiento:** Sus dos cabezas cruzan la rodilla, por lo que su longitud depende de la posici\xF3n de esta: con la rodilla extendida (de pie) el gastrocnemio est\xE1 alargado y contribuye al m\xE1ximo a la flexi\xF3n plantar; con la rodilla flexionada (sentado) se acorta y cede el protagonismo al s\xF3leo. Por eso las elevaciones de tal\xF3n de pie sesgan gastroc y las sentadas sesgan s\xF3leo.\n- **Curva de fuerza:** acortado \u2192 Cierre de la elevaci\xF3n de tal\xF3n de pie, en punta m\xE1xima.; medio \u2192 Elevaci\xF3n de tal\xF3n de pie pasando por el rango medio.; alargado \u2192 Fondo de la elevaci\xF3n de pie con el tal\xF3n ca\xEDdo bajo el escal\xF3n y la rodilla extendida.\n- **Nota de coaching:** Es el ejemplo cl\xE1sico de m\xFAsculo biarticular: si entrenas la pantorrilla solo sentado, dejas fuera la posici\xF3n donde el gastrocnemio produce m\xE1s. La rodilla extendida es la palanca, no m\xE1s volumen. El enfoque lo usa adem\xE1s al hablar de la extensi\xF3n de pierna: dorsiflexionar usa el estiramiento del gastroc para estabilizar la rodilla." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "S\xF3leo", "text": "## S\xF3leo\n- **Ubicaci\xF3n:** Profundo al gastrocnemio, parte baja de la pantorrilla\n- **Origen:** Cara posterior de la tibia y el peron\xE9.\n- **Inserci\xF3n:** Calc\xE1neo v\xEDa tend\xF3n de Aquiles.\n- **Acci\xF3n:** Flexi\xF3n plantar del tobillo. Monoarticular: no cruza la rodilla.\n- **Funci\xF3n en el entrenamiento:** Como no cruza la rodilla, es el flexor plantar dominante cuando esta est\xE1 flexionada, justo donde el gastrocnemio pierde palanca. De ah\xED que la elevaci\xF3n de tal\xF3n sentado sea su ejercicio: la rodilla flexionada saca al gastroc de la ecuaci\xF3n y deja al s\xF3leo al frente.\n- **Curva de fuerza:** acortado \u2192 Cierre de la elevaci\xF3n de tal\xF3n sentado, en punta m\xE1xima.; medio \u2192 Elevaci\xF3n de tal\xF3n sentado pasando por el rango medio.; alargado \u2192 Fondo de la elevaci\xF3n sentado con el tal\xF3n ca\xEDdo bajo el escal\xF3n.\n- **Nota de coaching:** El par gastroc/s\xF3leo es la demostraci\xF3n m\xE1s limpia del principio biarticular: misma flexi\xF3n plantar, distinto m\xFAsculo seg\xFAn la posici\xF3n de la rodilla. No es que el s\xF3leo 'necesite' estar sentado por capricho, es que esa posici\xF3n elimina al gastroc. Programar ambas variantes cubre la pantorrilla completa." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Tibial anterior", "text": "## Tibial anterior\n- **Ubicaci\xF3n:** Cara anterior de la espinilla, lateral a la tibia\n- **Origen:** C\xF3ndilo lateral y dos tercios superiores de la cara lateral de la tibia.\n- **Inserci\xF3n:** Primer cuneiforme y base del primer metatarsiano.\n- **Acci\xF3n:** Dorsiflexi\xF3n del tobillo e inversi\xF3n del pie.\n- **Funci\xF3n en el entrenamiento:** Antagonista de la pantorrilla: sube la punta del pie. Su capacidad de dorsiflexi\xF3n es la que se eval\xFAa en el test de tobillo a la pared y condiciona la profundidad de sentadilla. Una dorsiflexi\xF3n limitada empuja compensaciones hacia arriba en la cadena.\n- **Curva de fuerza:** acortado \u2192 Cierre de la dorsiflexi\xF3n con banda, punta del pie arriba.; medio \u2192 Caminata sobre talones o dorsiflexi\xF3n resistida en rango medio.; alargado \u2192 Inicio desde flexi\xF3n plantar completa contra resistencia.\n- **Nota de coaching:** El test de tobillo a la pared mide su rango por una raz\xF3n: la dorsiflexi\xF3n es prerrequisito de movilidad para la sentadilla. Si est\xE1 limitada, conviene saber si es bloqueo articular o tejido antes de decidir cargar o movilizar. Eval\xFAa solo si el resultado cambiar\xEDa tu plan." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Tibial posterior", "text": "## Tibial posterior\n- **Ubicaci\xF3n:** Compartimento profundo posterior de la pierna\n- **Origen:** Membrana inter\xF3sea y caras posteriores de tibia y peron\xE9.\n- **Inserci\xF3n:** Navicular y la mayor\xEDa de los huesos del tarso y metatarso medios.\n- **Acci\xF3n:** Inversi\xF3n del pie y asistencia a la flexi\xF3n plantar; sostiene el arco medial.\n- **Funci\xF3n en el entrenamiento:** Estabilizador principal del arco longitudinal medial del pie. M\xE1s que producir movimiento grande, controla la pronaci\xF3n bajo carga; su disfunci\xF3n se asocia con colapso del arco, que repercute hacia arriba en rodilla y cadera.\n- **Curva de fuerza:** acortado \u2192 Cierre de la inversi\xF3n resistida con banda, arco activo.; medio \u2192 Control del arco en apoyo monopodal bajo carga.; alargado \u2192 \u2014\n- **Nota de coaching:** Es un estabilizador silencioso del pie: rara vez se entrena directo, pero su capacidad de sostener el arco influye en c\xF3mo se alinea toda la pierna. Un colapso de arco bajo carga puede leerse arriba como valgo de rodilla; vale la pena mirar el pie antes de culpar solo a la cadera." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Peroneo largo", "text": "## Peroneo largo\n- **Ubicaci\xF3n:** Cara lateral de la pierna\n- **Origen:** Cabeza y dos tercios superiores de la cara lateral del peron\xE9.\n- **Inserci\xF3n:** Primer cuneiforme y base del primer metatarsiano (cruza la planta del pie).\n- **Acci\xF3n:** Eversi\xF3n del pie y asistencia a la flexi\xF3n plantar.\n- **Funci\xF3n en el entrenamiento:** Estabilizador lateral del tobillo: junto con el peroneo breve, frena la inversi\xF3n excesiva, el mecanismo del esguince de tobillo m\xE1s com\xFAn. Tambi\xE9n ayuda a sostener el arco transverso del pie por su trayecto bajo la planta.\n- **Curva de fuerza:** acortado \u2192 Cierre de la eversi\xF3n resistida con banda.; medio \u2192 Control lateral del tobillo en apoyo monopodal.; alargado \u2192 \u2014\n- **Nota de coaching:** Su valor es preventivo: un tobillo que no estabiliza la inversi\xF3n es un tobillo expuesto a esguinces de repetici\xF3n. El trabajo de eversi\xF3n y de equilibrio monopodal construye la capacidad lateral que importa para deportes de cambio de direcci\xF3n." }, { "doc": "Wiki Mazothecoach \u2014 M\xFAsculos (visor anat\xF3mico)", "title": "Peroneo breve", "text": "## Peroneo breve\n- **Ubicaci\xF3n:** Cara lateral de la pierna, profundo al peroneo largo\n- **Origen:** Dos tercios inferiores de la cara lateral del peron\xE9.\n- **Inserci\xF3n:** Tuberosidad del quinto metatarsiano.\n- **Acci\xF3n:** Eversi\xF3n del pie y asistencia a la flexi\xF3n plantar.\n- **Funci\xF3n en el entrenamiento:** El m\xE1s fuerte de los dos eversores en t\xE9rminos de eversi\xF3n pura. Acompa\xF1a al peroneo largo en el freno de la inversi\xF3n y la estabilidad lateral del tobillo; comparte su rol protector contra el esguince.\n- **Curva de fuerza:** acortado \u2192 Cierre de la eversi\xF3n resistida con banda.; medio \u2192 Control lateral del tobillo en apoyo monopodal.; alargado \u2192 \u2014\n- **Nota de coaching:** No se programa por separado del peroneo largo: trabajan como pareja eversora. La eversi\xF3n resistida y el equilibrio monopodal cubren ambos. Su inserci\xF3n en el quinto metatarsiano lo vuelve relevante cuando hay molestia en el borde lateral del pie tras un esguince." }, { "doc": "Wiki Mazothecoach \u2014 Ejercicios: qu\xE9 m\xFAsculo trabaja y d\xF3nde sentirlo", "title": "Pecho", "text": "## Pecho\n### Press inclinado con mancuernas\n- **M\xFAsculo objetivo:** Pectoral mayor\n- **Zona cargada:** alargado (m\xFAsculo estirado)\n- **Secundarios:** Deltoides, Tr\xEDceps braquial\n- **D\xF3nde sentirlo:** En la parte alta e interna del pecho, sobre todo en el estiramiento al bajar las mancuernas.\n\n### Press plano con mancuernas\n- **M\xFAsculo objetivo:** Pectoral mayor\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Tr\xEDceps braquial, Deltoides\n- **D\xF3nde sentirlo:** En todo el pecho, con tensi\xF3n m\xE1xima cerca del punto medio del recorrido.\n\n### Cruce de poleas\n- **M\xFAsculo objetivo:** Pectoral mayor\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Pectoral menor\n- **D\xF3nde sentirlo:** En el centro del pecho al juntar las manos al frente, en el cierre del movimiento.\n\n### Deslizamiento en pared (serrato)\n- **M\xFAsculo objetivo:** Pectoral menor\n- **Zona cargada:** alargado (m\xFAsculo estirado)\n- **Secundarios:** Serrato anterior\n- **D\xF3nde sentirlo:** Bajo la axila y el costado de las costillas al empujar la pared y subir los brazos.\n\n### Punch escapular\n- **M\xFAsculo objetivo:** Pectoral menor\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Serrato anterior\n- **D\xF3nde sentirlo:** En el costado de las costillas al empujar el hombro hacia adelante sin doblar el codo." }, { "doc": "Wiki Mazothecoach \u2014 Ejercicios: qu\xE9 m\xFAsculo trabaja y d\xF3nde sentirlo", "title": "Espalda", "text": "## Espalda\n### Jal\xF3n al pecho\n- **M\xFAsculo objetivo:** Dorsal ancho\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Redondo mayor, B\xEDceps braquial\n- **D\xF3nde sentirlo:** En el costado de la espalda, desde la axila hacia abajo, al llevar los codos hacia las costillas.\n\n### Jal\xF3n inclinado (dorsal alargado)\n- **M\xFAsculo objetivo:** Dorsal ancho\n- **Zona cargada:** alargado (m\xFAsculo estirado)\n- **Secundarios:** Redondo mayor\n- **D\xF3nde sentirlo:** En el estiramiento del dorsal con el brazo arriba y al frente, antes de tirar.\n\n### Remo a un brazo con mancuerna\n- **M\xFAsculo objetivo:** Dorsal ancho\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Romboides, Trapecio, Redondo mayor\n- **D\xF3nde sentirlo:** En el dorsal al final del tir\xF3n, con el codo pasado el tronco.\n\n### Remo con retracci\xF3n escapular\n- **M\xFAsculo objetivo:** Romboides\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Trapecio\n- **D\xF3nde sentirlo:** Entre los om\xF3platos al juntar las esc\xE1pulas al final del remo.\n\n### Wall slide con protracci\xF3n\n- **M\xFAsculo objetivo:** Romboides\n- **Zona cargada:** alargado (m\xFAsculo estirado)\n- **Secundarios:** Serrato anterior\n- **D\xF3nde sentirlo:** Entre los om\xF3platos en el estiramiento, con las esc\xE1pulas separadas al frente.\n\n### Press con protracci\xF3n (serrato)\n- **M\xFAsculo objetivo:** Serrato anterior\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Pectoral menor\n- **D\xF3nde sentirlo:** En el costado de las costillas al empujar el peso hacia el techo separando el hombro.\n\n### Deslizamiento en pared overhead\n- **M\xFAsculo objetivo:** Serrato anterior\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Trapecio\n- **D\xF3nde sentirlo:** Bajo la axila mientras subes los brazos pegados a la pared sin despegar las costillas.\n\n### Pullover en polea con brazo recto\n- **M\xFAsculo objetivo:** Redondo mayor\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Dorsal ancho\n- **D\xF3nde sentirlo:** En el borde externo de la espalda alta al bajar el brazo recto hacia el muslo.\n\n### Jal\xF3n agarre neutro\n- **M\xFAsculo objetivo:** Redondo mayor\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Dorsal ancho, B\xEDceps braquial\n- **D\xF3nde sentirlo:** En el borde externo de la espalda, junto a la axila, al tirar hacia abajo.\n\n### Hiperextensi\xF3n a 45\xB0\n- **M\xFAsculo objetivo:** Erectores de la columna\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Gl\xFAteo mayor, B\xEDceps femoral\n- **D\xF3nde sentirlo:** En la espalda baja y los gl\xFAteos al alinear el tronco con las caderas.\n\n### Peso muerto\n- **M\xFAsculo objetivo:** Erectores de la columna\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Gl\xFAteo mayor, B\xEDceps femoral, Dorsal ancho\n- **D\xF3nde sentirlo:** En la espalda baja firme y los gl\xFAteos al subir la barra manteniendo la columna neutra.\n\n### Buenos d\xEDas\n- **M\xFAsculo objetivo:** Erectores de la columna\n- **Zona cargada:** alargado (m\xFAsculo estirado)\n- **Secundarios:** B\xEDceps femoral, Gl\xFAteo mayor\n- **D\xF3nde sentirlo:** En la espalda baja y los isquiotibiales al inclinar el tronco con la columna neutra.\n\n### Bird dog\n- **M\xFAsculo objetivo:** Mult\xEDfidos\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Erectores de la columna, Gl\xFAteo mayor\n- **D\xF3nde sentirlo:** En lo profundo de la espalda baja, manteniendo la pelvis sin rotar al extender brazo y pierna opuestos.\n\n### Peso muerto a una pierna\n- **M\xFAsculo objetivo:** Mult\xEDfidos\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Gl\xFAteo medio, B\xEDceps femoral, Erectores de la columna\n- **D\xF3nde sentirlo:** En la espalda baja profunda y el gl\xFAteo, controlando que la cadera no se abra.\n\n### Plancha lateral\n- **M\xFAsculo objetivo:** Cuadrado lumbar\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Oblicuo interno, Oblicuo externo\n- **D\xF3nde sentirlo:** En el costado de la espalda baja al sostener la cadera arriba sin que caiga.\n\n### Hiperextensi\xF3n lateral a 45\xB0\n- **M\xFAsculo objetivo:** Cuadrado lumbar\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Oblicuo externo\n- **D\xF3nde sentirlo:** En el costado de la espalda baja al subir el tronco hacia el lado." }, { "doc": "Wiki Mazothecoach \u2014 Ejercicios: qu\xE9 m\xFAsculo trabaja y d\xF3nde sentirlo", "title": "Trapecios", "text": "## Trapecios\n### Encogimiento de hombros\n- **M\xFAsculo objetivo:** Trapecio\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Elevador de la esc\xE1pula\n- **D\xF3nde sentirlo:** En la parte alta del trapecio, entre el cuello y el hombro, al subir los hombros.\n\n### Face pull\n- **M\xFAsculo objetivo:** Trapecio\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Romboides, Infraespinoso, Redondo menor\n- **D\xF3nde sentirlo:** En la parte media de la espalda alta y la parte trasera del hombro al separar la cuerda.\n\n### Remo con barra\n- **M\xFAsculo objetivo:** Trapecio\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Dorsal ancho, Romboides\n- **D\xF3nde sentirlo:** En toda la espalda alta y media al llevar la barra al abdomen.\n\n### Estiramiento de cuello\n- **M\xFAsculo objetivo:** Elevador de la esc\xE1pula\n- **Zona cargada:** alargado (m\xFAsculo estirado)\n- **D\xF3nde sentirlo:** En el lateral y la parte de atr\xE1s del cuello, hacia el om\xF3plato, al inclinar la cabeza al lado opuesto.\n\n### Encogimiento isom\xE9trico (carga)\n- **M\xFAsculo objetivo:** Elevador de la esc\xE1pula\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Trapecio\n- **D\xF3nde sentirlo:** En el lateral del cuello hacia el \xE1ngulo del om\xF3plato al sostener el peso." }, { "doc": "Wiki Mazothecoach \u2014 Ejercicios: qu\xE9 m\xFAsculo trabaja y d\xF3nde sentirlo", "title": "Hombro", "text": "## Hombro\n### Elevaci\xF3n lateral en polea\n- **M\xFAsculo objetivo:** Deltoides\n- **Zona cargada:** alargado (m\xFAsculo estirado)\n- **Secundarios:** Supraespinoso\n- **D\xF3nde sentirlo:** En el costado del hombro, con tensi\xF3n desde abajo cuando el brazo cruza al frente del cuerpo.\n\n### Press militar\n- **M\xFAsculo objetivo:** Deltoides\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Tr\xEDceps braquial, Trapecio\n- **D\xF3nde sentirlo:** En la parte frontal y media del hombro al empujar la barra sobre la cabeza.\n\n### Aperturas posteriores\n- **M\xFAsculo objetivo:** Deltoides\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Infraespinoso, Romboides\n- **D\xF3nde sentirlo:** En la parte trasera del hombro al abrir los brazos hacia atr\xE1s.\n\n### Elevaci\xF3n lateral\n- **M\xFAsculo objetivo:** Supraespinoso\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Deltoides\n- **D\xF3nde sentirlo:** En la parte alta del hombro en los primeros grados de la subida del brazo.\n\n### Abducci\xF3n de hombro con banda\n- **M\xFAsculo objetivo:** Supraespinoso\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Deltoides\n- **D\xF3nde sentirlo:** En la punta del hombro al iniciar la separaci\xF3n del brazo del cuerpo.\n\n### Rotaci\xF3n externa en polea\n- **M\xFAsculo objetivo:** Infraespinoso\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Redondo menor\n- **D\xF3nde sentirlo:** En la parte trasera del hombro al girar el antebrazo hacia afuera con el codo pegado.\n\n### Rotaci\xF3n externa con banda\n- **M\xFAsculo objetivo:** Infraespinoso\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Redondo menor, Deltoides\n- **D\xF3nde sentirlo:** En la parte posterior del hombro, no en el brazo, al rotar hacia afuera.\n\n### Rotaci\xF3n externa en abducci\xF3n\n- **M\xFAsculo objetivo:** Redondo menor\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Infraespinoso, Deltoides\n- **D\xF3nde sentirlo:** En la parte trasera del hombro con el brazo a la altura del hombro (posici\xF3n de lanzador).\n\n### Face pull con rotaci\xF3n externa\n- **M\xFAsculo objetivo:** Redondo menor\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Infraespinoso, Trapecio\n- **D\xF3nde sentirlo:** En la parte trasera del hombro al separar la cuerda y girar las manos arriba.\n\n### Rotaci\xF3n interna en polea\n- **M\xFAsculo objetivo:** Subescapular\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Pectoral mayor\n- **D\xF3nde sentirlo:** En lo profundo del hombro, hacia el frente, al girar el antebrazo hacia el abdomen.\n\n### Rotaci\xF3n interna con banda\n- **M\xFAsculo objetivo:** Subescapular\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **D\xF3nde sentirlo:** En lo profundo del hombro al rotar hacia adentro con el codo pegado al costado." }, { "doc": "Wiki Mazothecoach \u2014 Ejercicios: qu\xE9 m\xFAsculo trabaja y d\xF3nde sentirlo", "title": "B\xEDceps", "text": "## B\xEDceps\n### Curl inclinado con mancuerna\n- **M\xFAsculo objetivo:** B\xEDceps braquial\n- **Zona cargada:** alargado (m\xFAsculo estirado)\n- **Secundarios:** Braquial\n- **D\xF3nde sentirlo:** En la parte baja del b\xEDceps, cerca del codo, sobre todo en el estiramiento al bajar el peso.\n\n### Curl de pie con mancuerna\n- **M\xFAsculo objetivo:** B\xEDceps braquial\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Braquial, Braquiorradial\n- **D\xF3nde sentirlo:** En el pico del b\xEDceps, con tensi\xF3n m\xE1xima cerca de los 90\xB0 del codo.\n\n### Curl en polea alta\n- **M\xFAsculo objetivo:** B\xEDceps braquial\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **D\xF3nde sentirlo:** En el pico del b\xEDceps al cerrar el codo con el brazo arriba y al frente.\n\n### Curl martillo\n- **M\xFAsculo objetivo:** Braquial\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Braquiorradial, B\xEDceps braquial\n- **D\xF3nde sentirlo:** En la parte profunda del brazo, entre b\xEDceps y antebrazo, con agarre neutro.\n\n### Curl inverso\n- **M\xFAsculo objetivo:** Braquial\n- **Zona cargada:** alargado (m\xFAsculo estirado)\n- **Secundarios:** Braquiorradial, Extensores de mu\xF1eca y dedos\n- **D\xF3nde sentirlo:** En la parte profunda del brazo y el dorso del antebrazo, con agarre prono.\n\n### Curl en banco predicador\n- **M\xFAsculo objetivo:** Braquial\n- **Zona cargada:** alargado (m\xFAsculo estirado)\n- **Secundarios:** B\xEDceps braquial\n- **D\xF3nde sentirlo:** En la parte baja del brazo al estirar desde la extensi\xF3n completa del codo.\n\n### Press inclinado (coracobraquial)\n- **M\xFAsculo objetivo:** Coracobraquial\n- **Zona cargada:** alargado (m\xFAsculo estirado)\n- **Secundarios:** Pectoral mayor, Deltoides\n- **D\xF3nde sentirlo:** En lo profundo de la parte alta interna del brazo, en el estiramiento al bajar el peso.\n\n### Aducci\xF3n de hombro en polea\n- **M\xFAsculo objetivo:** Coracobraquial\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Pectoral mayor, Dorsal ancho\n- **D\xF3nde sentirlo:** En lo profundo de la parte alta del brazo al llevar el brazo al frente y hacia la l\xEDnea media." }, { "doc": "Wiki Mazothecoach \u2014 Ejercicios: qu\xE9 m\xFAsculo trabaja y d\xF3nde sentirlo", "title": "Antebrazo", "text": "## Antebrazo\n### Curl inverso (braquiorradial)\n- **M\xFAsculo objetivo:** Braquiorradial\n- **Zona cargada:** alargado (m\xFAsculo estirado)\n- **Secundarios:** Braquial, Extensores de mu\xF1eca y dedos\n- **D\xF3nde sentirlo:** En el antebrazo, del lado del pulgar, desde la extensi\xF3n del codo.\n\n### Curl martillo (braquiorradial)\n- **M\xFAsculo objetivo:** Braquiorradial\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Braquial\n- **D\xF3nde sentirlo:** En el antebrazo superior, del lado del pulgar, al cerrar el codo en agarre neutro.\n\n### Curl de mu\xF1eca\n- **M\xFAsculo objetivo:** Flexores de mu\xF1eca y dedos\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **D\xF3nde sentirlo:** En la cara interna del antebrazo al cerrar la mu\xF1eca y los dedos.\n\n### Caminata del granjero\n- **M\xFAsculo objetivo:** Flexores de mu\xF1eca y dedos\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Trapecio, Extensores de mu\xF1eca y dedos\n- **D\xF3nde sentirlo:** En el antebrazo y la fuerza de agarre al sostener peso caminando.\n\n### Colgarse de la barra\n- **M\xFAsculo objetivo:** Flexores de mu\xF1eca y dedos\n- **Zona cargada:** alargado (m\xFAsculo estirado)\n- **Secundarios:** Dorsal ancho\n- **D\xF3nde sentirlo:** En el antebrazo y los dedos al colgarse con los brazos extendidos.\n\n### Curl de mu\xF1eca inverso\n- **M\xFAsculo objetivo:** Extensores de mu\xF1eca y dedos\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **D\xF3nde sentirlo:** En el dorso del antebrazo al subir la mu\xF1eca contra el peso.\n\n### Isom\xE9trico de extensores\n- **M\xFAsculo objetivo:** Extensores de mu\xF1eca y dedos\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Flexores de mu\xF1eca y dedos\n- **D\xF3nde sentirlo:** En el dorso del antebrazo al estabilizar la mu\xF1eca firme.\n\n### Pronaci\xF3n con banda\n- **M\xFAsculo objetivo:** Pronador redondo\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **D\xF3nde sentirlo:** En la parte interna alta del antebrazo al girar la palma hacia abajo.\n\n### Isom\xE9trico de pronaci\xF3n\n- **M\xFAsculo objetivo:** Pronador redondo\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Flexores de mu\xF1eca y dedos\n- **D\xF3nde sentirlo:** En la parte interna del antebrazo al resistir que la palma gire hacia arriba.\n\n### Supinaci\xF3n con banda\n- **M\xFAsculo objetivo:** Supinador\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** B\xEDceps braquial\n- **D\xF3nde sentirlo:** En la parte superior externa del antebrazo al girar la palma hacia arriba.\n\n### Curl Zottman\n- **M\xFAsculo objetivo:** Supinador\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** B\xEDceps braquial, Braquiorradial\n- **D\xF3nde sentirlo:** En el antebrazo durante el giro de la palma al pasar por la posici\xF3n neutra." }, { "doc": "Wiki Mazothecoach \u2014 Ejercicios: qu\xE9 m\xFAsculo trabaja y d\xF3nde sentirlo", "title": "Tr\xEDceps", "text": "## Tr\xEDceps\n### Extensi\xF3n en polea (pushdown)\n- **M\xFAsculo objetivo:** Tr\xEDceps braquial\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **D\xF3nde sentirlo:** En la parte de atr\xE1s del brazo al estirar el codo del todo, con el codo pegado al costado.\n\n### Extensi\xF3n sobre la cabeza en polea\n- **M\xFAsculo objetivo:** Tr\xEDceps braquial\n- **Zona cargada:** alargado (m\xFAsculo estirado)\n- **D\xF3nde sentirlo:** En la parte interna y larga del tr\xEDceps, estirada con el brazo arriba detr\xE1s de la cabeza.\n\n### Press de banca agarre cerrado\n- **M\xFAsculo objetivo:** Tr\xEDceps braquial\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Pectoral mayor, Deltoides\n- **D\xF3nde sentirlo:** En la parte de atr\xE1s del brazo al empujar la barra cerca del pecho con codos pegados." }, { "doc": "Wiki Mazothecoach \u2014 Ejercicios: qu\xE9 m\xFAsculo trabaja y d\xF3nde sentirlo", "title": "Abdomen", "text": "## Abdomen\n### Rueda abdominal\n- **M\xFAsculo objetivo:** Recto del abdomen\n- **Zona cargada:** alargado (m\xFAsculo estirado)\n- **Secundarios:** Transverso del abdomen, Oblicuo externo\n- **D\xF3nde sentirlo:** En todo el recto abdominal al extender el cuerpo, resistiendo que la espalda se arquee.\n\n### Crunch en polea\n- **M\xFAsculo objetivo:** Recto del abdomen\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Oblicuo externo\n- **D\xF3nde sentirlo:** En el abdomen al acercar las costillas a la pelvis, en el cierre del movimiento.\n\n### Plancha\n- **M\xFAsculo objetivo:** Recto del abdomen\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Transverso del abdomen\n- **D\xF3nde sentirlo:** En todo el abdomen al mantener el tronco firme sin dejar caer la cadera.\n\n### Press Pallof\n- **M\xFAsculo objetivo:** Oblicuo externo\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Oblicuo interno, Transverso del abdomen\n- **D\xF3nde sentirlo:** En el costado del abdomen al resistir que la polea te gire el tronco.\n\n### Press a un brazo con mancuerna\n- **M\xFAsculo objetivo:** Oblicuo externo\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Oblicuo interno, Pectoral mayor\n- **D\xF3nde sentirlo:** En el costado opuesto al brazo que empuja, frenando la rotaci\xF3n del tronco.\n\n### Le\xF1ador en polea\n- **M\xFAsculo objetivo:** Oblicuo externo\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Oblicuo interno\n- **D\xF3nde sentirlo:** En el costado del abdomen al llevar las manos en diagonal hacia la cadera opuesta.\n\n### Carry a un lado (maleta)\n- **M\xFAsculo objetivo:** Oblicuo interno\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Cuadrado lumbar, Oblicuo externo\n- **D\xF3nde sentirlo:** En el costado opuesto al peso, manteniendo el tronco recto al caminar.\n\n### Rotaci\xF3n en polea\n- **M\xFAsculo objetivo:** Oblicuo interno\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Oblicuo externo\n- **D\xF3nde sentirlo:** En el costado del abdomen al girar el tronco hacia la polea.\n\n### Dead bug\n- **M\xFAsculo objetivo:** Transverso del abdomen\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Recto del abdomen, Diafragma\n- **D\xF3nde sentirlo:** En lo profundo del abdomen, manteniendo la espalda baja pegada al suelo.\n\n### Carry pesado\n- **M\xFAsculo objetivo:** Transverso del abdomen\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Erectores de la columna, Trapecio\n- **D\xF3nde sentirlo:** En todo el cintur\xF3n abdominal al sostener presi\xF3n caminando con peso.\n\n### Respiraci\xF3n diafragm\xE1tica 360\xB0\n- **M\xFAsculo objetivo:** Diafragma\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Transverso del abdomen\n- **D\xF3nde sentirlo:** Expandiendo costillas, abdomen y espalda baja a la vez al inhalar, no solo el pecho.\n\n### Dead bug con respiraci\xF3n\n- **M\xFAsculo objetivo:** Diafragma\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Transverso del abdomen, Recto del abdomen\n- **D\xF3nde sentirlo:** Manteniendo presi\xF3n al exhalar mientras mueves brazos y piernas opuestos." }, { "doc": "Wiki Mazothecoach \u2014 Ejercicios: qu\xE9 m\xFAsculo trabaja y d\xF3nde sentirlo", "title": "Gl\xFAteos", "text": "## Gl\xFAteos\n### Hip thrust\n- **M\xFAsculo objetivo:** Gl\xFAteo mayor\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** B\xEDceps femoral, Aductor mayor\n- **D\xF3nde sentirlo:** En el gl\xFAteo, apretado al m\xE1ximo arriba con la cadera en extensi\xF3n completa.\n\n### Peso muerto rumano\n- **M\xFAsculo objetivo:** Gl\xFAteo mayor\n- **Zona cargada:** alargado (m\xFAsculo estirado)\n- **Secundarios:** B\xEDceps femoral, Semitendinoso, Erectores de la columna\n- **D\xF3nde sentirlo:** En el estiramiento del gl\xFAteo e isquiotibiales con la cadera flexionada y la barra cerca de las piernas.\n\n### Sentadilla b\xFAlgara\n- **M\xFAsculo objetivo:** Gl\xFAteo mayor\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Recto femoral, Vasto lateral, Aductor mayor\n- **D\xF3nde sentirlo:** En el gl\xFAteo de la pierna de adelante al bajar con el tronco un poco inclinado.\n\n### Abducci\xF3n de cadera\n- **M\xFAsculo objetivo:** Gl\xFAteo medio\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Gl\xFAteo menor, Tensor de la fascia lata\n- **D\xF3nde sentirlo:** En el lateral de la cadera al separar la pierna del cuerpo.\n\n### Step down\n- **M\xFAsculo objetivo:** Gl\xFAteo medio\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Gl\xFAteo mayor, Vasto medial\n- **D\xF3nde sentirlo:** En el lateral de la cadera de la pierna de apoyo, controlando que la pelvis no caiga.\n\n### Caminata lateral con banda\n- **M\xFAsculo objetivo:** Gl\xFAteo medio\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Gl\xFAteo menor, Tensor de la fascia lata\n- **D\xF3nde sentirlo:** En el lateral de la cadera al dar pasos al lado manteniendo tensi\xF3n en la banda.\n\n### Descenso de cadera (hip drop)\n- **M\xFAsculo objetivo:** Gl\xFAteo menor\n- **Zona cargada:** alargado (m\xFAsculo estirado)\n- **Secundarios:** Gl\xFAteo medio\n- **D\xF3nde sentirlo:** En el lateral profundo de la cadera al dejar caer y volver a subir la pelvis del lado libre.\n\n### Equilibrio a una pierna\n- **M\xFAsculo objetivo:** Gl\xFAteo menor\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Gl\xFAteo medio, Tibial posterior\n- **D\xF3nde sentirlo:** En el lateral profundo de la cadera al mantener la pelvis nivelada en un pie." }, { "doc": "Wiki Mazothecoach \u2014 Ejercicios: qu\xE9 m\xFAsculo trabaja y d\xF3nde sentirlo", "title": "Cadera", "text": "## Cadera\n### Estiramiento de l\xEDnea lateral\n- **M\xFAsculo objetivo:** Tensor de la fascia lata\n- **Zona cargada:** alargado (m\xFAsculo estirado)\n- **Secundarios:** Gl\xFAteo medio\n- **D\xF3nde sentirlo:** En la parte delantera y lateral de la cadera al llevar la cadera en extensi\xF3n y aducci\xF3n.\n\n### Abducci\xF3n con banda en flexi\xF3n\n- **M\xFAsculo objetivo:** Tensor de la fascia lata\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Gl\xFAteo medio, Gl\xFAteo menor\n- **D\xF3nde sentirlo:** En la parte delantera-lateral de la cadera al separar la pierna ligeramente flexionada.\n\n### Clamshell (almeja)\n- **M\xFAsculo objetivo:** Piriforme\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Rotadores externos profundos, Gl\xFAteo medio\n- **D\xF3nde sentirlo:** En lo profundo del gl\xFAteo al abrir la rodilla de arriba girando la cadera.\n\n### Estiramiento de la paloma\n- **M\xFAsculo objetivo:** Piriforme\n- **Zona cargada:** alargado (m\xFAsculo estirado)\n- **Secundarios:** Gl\xFAteo mayor\n- **D\xF3nde sentirlo:** En lo profundo del gl\xFAteo, en la cadera flexionada y cruzada al frente.\n\n### Rotaci\xF3n externa de cadera con banda\n- **M\xFAsculo objetivo:** Rotadores externos profundos\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Piriforme, Gl\xFAteo mayor\n- **D\xF3nde sentirlo:** En lo profundo del gl\xFAteo al girar el muslo hacia afuera.\n\n### Control rotacional en una pierna\n- **M\xFAsculo objetivo:** Rotadores externos profundos\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Gl\xFAteo medio, Gl\xFAteo menor\n- **D\xF3nde sentirlo:** En lo profundo de la cadera al mantenerla centrada y sin rotar en apoyo monopodal.\n\n### Flexi\xF3n de cadera con banda\n- **M\xFAsculo objetivo:** Iliopsoas\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Recto femoral, Sartorio\n- **D\xF3nde sentirlo:** En lo profundo del pliegue de la cadera al subir la rodilla por encima de 90\xB0.\n\n### Elevaci\xF3n de piernas colgado\n- **M\xFAsculo objetivo:** Iliopsoas\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Recto del abdomen, Recto femoral\n- **D\xF3nde sentirlo:** En el pliegue de la cadera y el bajo abdomen al subir las piernas colgado.\n\n### Estiramiento de sof\xE1\n- **M\xFAsculo objetivo:** Iliopsoas\n- **Zona cargada:** alargado (m\xFAsculo estirado)\n- **Secundarios:** Recto femoral\n- **D\xF3nde sentirlo:** En la parte delantera de la cadera y el muslo de la pierna de atr\xE1s, en extensi\xF3n.\n\n### Sentadilla cosaca\n- **M\xFAsculo objetivo:** Sartorio\n- **Zona cargada:** alargado (m\xFAsculo estirado)\n- **Secundarios:** Aductor mayor, Recto interno (gr\xE1cil), Recto femoral\n- **D\xF3nde sentirlo:** En la parte interna del muslo y la cadera al bajar a un lado con la otra pierna extendida.\n\n### Flexi\xF3n + abducci\xF3n + rotaci\xF3n externa\n- **M\xFAsculo objetivo:** Sartorio\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Iliopsoas, Tensor de la fascia lata\n- **D\xF3nde sentirlo:** Cruzando la cadera al frente, llevando el tobillo hacia la rodilla opuesta." }, { "doc": "Wiki Mazothecoach \u2014 Ejercicios: qu\xE9 m\xFAsculo trabaja y d\xF3nde sentirlo", "title": "Aductores", "text": "## Aductores\n### Aducci\xF3n de cadera\n- **M\xFAsculo objetivo:** Aductor mayor\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Aductor largo, Recto interno (gr\xE1cil), Pect\xEDneo\n- **D\xF3nde sentirlo:** En la parte interna del muslo al juntar las piernas contra la resistencia.\n\n### Sentadilla profunda\n- **M\xFAsculo objetivo:** Aductor mayor\n- **Zona cargada:** alargado (m\xFAsculo estirado)\n- **Secundarios:** Gl\xFAteo mayor, Vasto lateral\n- **D\xF3nde sentirlo:** En la parte interna y posterior del muslo en el fondo de la sentadilla.\n\n### Plancha de Copenhague\n- **M\xFAsculo objetivo:** Aductor largo\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Aductor breve, Pect\xEDneo, Oblicuo interno\n- **D\xF3nde sentirlo:** En la parte interna del muslo al sostener la pierna de arriba contra el banco.\n\n### Aducci\xF3n en polea baja\n- **M\xFAsculo objetivo:** Aductor largo\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Aductor breve, Pect\xEDneo\n- **D\xF3nde sentirlo:** En la parte interna alta del muslo al cruzar la pierna hacia la l\xEDnea media.\n\n### M\xE1quina de aductores\n- **M\xFAsculo objetivo:** Aductor breve\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Aductor largo, Pect\xEDneo\n- **D\xF3nde sentirlo:** En la parte interna alta del muslo al cerrar las piernas.\n\n### Estiramiento de rana\n- **M\xFAsculo objetivo:** Aductor breve\n- **Zona cargada:** alargado (m\xFAsculo estirado)\n- **Secundarios:** Aductor largo, Recto interno (gr\xE1cil)\n- **D\xF3nde sentirlo:** En la parte interna del muslo con las rodillas abiertas y las caderas hacia atr\xE1s.\n\n### Aducci\xF3n con rodilla flexionada\n- **M\xFAsculo objetivo:** Recto interno (gr\xE1cil)\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Aductor mayor, Semitendinoso\n- **D\xF3nde sentirlo:** En la parte interna del muslo, hacia la rodilla, al juntar la pierna doblada.\n\n### Cosaca con pierna extendida\n- **M\xFAsculo objetivo:** Recto interno (gr\xE1cil)\n- **Zona cargada:** alargado (m\xFAsculo estirado)\n- **Secundarios:** Aductor mayor, Sartorio\n- **D\xF3nde sentirlo:** En la parte interna del muslo de la pierna extendida al bajar al lado opuesto.\n\n### Flexi\xF3n con aducci\xF3n (pect\xEDneo)\n- **M\xFAsculo objetivo:** Pect\xEDneo\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Aductor breve, Iliopsoas\n- **D\xF3nde sentirlo:** En la parte alta interna de la cadera al subir y cruzar la pierna al frente.\n\n### Copenhague (aductores altos)\n- **M\xFAsculo objetivo:** Pect\xEDneo\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Aductor breve, Aductor largo\n- **D\xF3nde sentirlo:** En el pliegue interno de la cadera al estabilizar la pierna contra el banco." }, { "doc": "Wiki Mazothecoach \u2014 Ejercicios: qu\xE9 m\xFAsculo trabaja y d\xF3nde sentirlo", "title": "Cu\xE1driceps", "text": "## Cu\xE1driceps\n### Extensi\xF3n de pierna\n- **M\xFAsculo objetivo:** Recto femoral\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Vasto lateral, Vasto medial, Vasto intermedio\n- **D\xF3nde sentirlo:** En el centro y la parte alta del muslo al estirar la rodilla del todo, sin dejar bascular la pelvis.\n\n### Sissy squat\n- **M\xFAsculo objetivo:** Recto femoral\n- **Zona cargada:** alargado (m\xFAsculo estirado)\n- **Secundarios:** Vasto lateral, Vasto medial\n- **D\xF3nde sentirlo:** En el estiramiento del muslo central al inclinarte atr\xE1s con la cadera extendida.\n\n### Sentadilla\n- **M\xFAsculo objetivo:** Recto femoral\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Vasto lateral, Vasto medial, Gl\xFAteo mayor\n- **D\xF3nde sentirlo:** En todo el muslo al bajar y subir manteniendo la rodilla alineada con el pie.\n\n### Hack squat\n- **M\xFAsculo objetivo:** Vasto lateral\n- **Zona cargada:** alargado (m\xFAsculo estirado)\n- **Secundarios:** Vasto medial, Vasto intermedio, Gl\xFAteo mayor\n- **D\xF3nde sentirlo:** En la parte externa del muslo en el fondo, con la rodilla muy flexionada.\n\n### Prensa de pierna\n- **M\xFAsculo objetivo:** Vasto lateral\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Vasto medial, Gl\xFAteo mayor, Aductor mayor\n- **D\xF3nde sentirlo:** En toda la parte externa y frontal del muslo al empujar la plataforma.\n\n### Extensi\xF3n enfocada al vasto medial\n- **M\xFAsculo objetivo:** Vasto medial\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Vasto lateral, Recto femoral\n- **D\xF3nde sentirlo:** En la gota interna sobre la rodilla en los \xFAltimos grados de la extensi\xF3n.\n\n### Sentadilla profunda (vasto medial)\n- **M\xFAsculo objetivo:** Vasto medial\n- **Zona cargada:** alargado (m\xFAsculo estirado)\n- **Secundarios:** Vasto lateral, Aductor mayor\n- **D\xF3nde sentirlo:** En la parte interna del muslo sobre la rodilla en el fondo de la sentadilla.\n\n### Prensa (vasto intermedio)\n- **M\xFAsculo objetivo:** Vasto intermedio\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Vasto lateral, Vasto medial\n- **D\xF3nde sentirlo:** En lo profundo del muslo frontal, bajo el recto femoral, al empujar la plataforma.\n\n### Extensi\xF3n (vasto intermedio)\n- **M\xFAsculo objetivo:** Vasto intermedio\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Vasto lateral, Recto femoral\n- **D\xF3nde sentirlo:** En lo profundo del muslo frontal al estirar la rodilla del todo." }, { "doc": "Wiki Mazothecoach \u2014 Ejercicios: qu\xE9 m\xFAsculo trabaja y d\xF3nde sentirlo", "title": "Femoral", "text": "## Femoral\n### Curl femoral\n- **M\xFAsculo objetivo:** B\xEDceps femoral\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Semitendinoso, Semimembranoso\n- **D\xF3nde sentirlo:** En la parte de atr\xE1s del muslo, hacia afuera, al doblar la rodilla del todo.\n\n### Peso muerto rumano (isquios)\n- **M\xFAsculo objetivo:** B\xEDceps femoral\n- **Zona cargada:** alargado (m\xFAsculo estirado)\n- **Secundarios:** Semitendinoso, Semimembranoso, Gl\xFAteo mayor\n- **D\xF3nde sentirlo:** En el estiramiento de la parte de atr\xE1s del muslo con la cadera flexionada.\n\n### Curl n\xF3rdico\n- **M\xFAsculo objetivo:** B\xEDceps femoral\n- **Zona cargada:** alargado (m\xFAsculo estirado)\n- **Secundarios:** Semitendinoso, Semimembranoso\n- **D\xF3nde sentirlo:** En toda la parte de atr\xE1s del muslo al frenar el descenso del cuerpo.\n\n### Curl femoral sentado\n- **M\xFAsculo objetivo:** Semitendinoso\n- **Zona cargada:** alargado (m\xFAsculo estirado)\n- **Secundarios:** Semimembranoso, B\xEDceps femoral\n- **D\xF3nde sentirlo:** En la parte de atr\xE1s del muslo, hacia adentro, estirada con la cadera flexionada.\n\n### Curl femoral (isquios mediales)\n- **M\xFAsculo objetivo:** Semitendinoso\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Semimembranoso\n- **D\xF3nde sentirlo:** En la parte de atr\xE1s e interna del muslo al cerrar la rodilla.\n\n### RDL (isquios mediales)\n- **M\xFAsculo objetivo:** Semimembranoso\n- **Zona cargada:** alargado (m\xFAsculo estirado)\n- **Secundarios:** Semitendinoso, Gl\xFAteo mayor\n- **D\xF3nde sentirlo:** En el estiramiento de la parte de atr\xE1s e interna del muslo en el hinge.\n\n### Curl femoral profundo (semimembranoso)\n- **M\xFAsculo objetivo:** Semimembranoso\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Semitendinoso, B\xEDceps femoral\n- **D\xF3nde sentirlo:** En lo profundo de la parte de atr\xE1s e interna del muslo al doblar la rodilla." }, { "doc": "Wiki Mazothecoach \u2014 Ejercicios: qu\xE9 m\xFAsculo trabaja y d\xF3nde sentirlo", "title": "Pantorrilla", "text": "## Pantorrilla\n### Elevaci\xF3n de tal\xF3n de pie\n- **M\xFAsculo objetivo:** Gastrocnemio\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** S\xF3leo\n- **D\xF3nde sentirlo:** En la parte alta y abultada de la pantorrilla, con la rodilla estirada, al subir a la punta.\n\n### Elevaci\xF3n de tal\xF3n en prensa\n- **M\xFAsculo objetivo:** Gastrocnemio\n- **Zona cargada:** alargado (m\xFAsculo estirado)\n- **Secundarios:** S\xF3leo\n- **D\xF3nde sentirlo:** En el estiramiento de la pantorrilla cuando el tal\xF3n cae bajo la plataforma con la rodilla casi recta.\n\n### Elevaci\xF3n de tal\xF3n sentado\n- **M\xFAsculo objetivo:** S\xF3leo\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Gastrocnemio\n- **D\xF3nde sentirlo:** En la parte baja y profunda de la pantorrilla, con la rodilla doblada, al subir a la punta.\n\n### Elevaci\xF3n sentado en estiramiento\n- **M\xFAsculo objetivo:** S\xF3leo\n- **Zona cargada:** alargado (m\xFAsculo estirado)\n- **D\xF3nde sentirlo:** En la parte baja de la pantorrilla cuando el tal\xF3n cae con la rodilla doblada." }, { "doc": "Wiki Mazothecoach \u2014 Ejercicios: qu\xE9 m\xFAsculo trabaja y d\xF3nde sentirlo", "title": "Tobillo/Espinilla", "text": "## Tobillo/Espinilla\n### Elevaci\xF3n de tibial anterior\n- **M\xFAsculo objetivo:** Tibial anterior\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **D\xF3nde sentirlo:** En la parte delantera de la espinilla al subir la punta del pie hacia ti.\n\n### Dorsiflexi\xF3n con banda\n- **M\xFAsculo objetivo:** Tibial anterior\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **D\xF3nde sentirlo:** En la parte delantera de la espinilla al jalar el pie hacia arriba contra la banda.\n\n### Inversi\xF3n con banda\n- **M\xFAsculo objetivo:** Tibial posterior\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **D\xF3nde sentirlo:** En la parte interna del tobillo y el arco al girar la planta hacia adentro.\n\n### Equilibrio a una pierna (arco)\n- **M\xFAsculo objetivo:** Tibial posterior\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Peroneo largo\n- **D\xF3nde sentirlo:** En el arco del pie y el tobillo interno al sostener el equilibrio sin colapsar el arco.\n\n### Eversi\xF3n con banda\n- **M\xFAsculo objetivo:** Peroneo largo\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Peroneo breve\n- **D\xF3nde sentirlo:** En la parte externa de la pierna y el tobillo al girar la planta hacia afuera.\n\n### Equilibrio a una pierna (lateral)\n- **M\xFAsculo objetivo:** Peroneo largo\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Peroneo breve, Tibial posterior\n- **D\xF3nde sentirlo:** En el lateral del tobillo al estabilizar el pie y evitar que ruede hacia afuera.\n\n### Eversi\xF3n con banda (peroneo breve)\n- **M\xFAsculo objetivo:** Peroneo breve\n- **Zona cargada:** acortado (m\xFAsculo contra\xEDdo)\n- **Secundarios:** Peroneo largo\n- **D\xF3nde sentirlo:** En la parte externa baja de la pierna, hacia el borde del pie, al evertir.\n\n### Control de salto lateral\n- **M\xFAsculo objetivo:** Peroneo breve\n- **Zona cargada:** medio (tensi\xF3n pico)\n- **Secundarios:** Peroneo largo, Gl\xFAteo medio\n- **D\xF3nde sentirlo:** En el lateral del tobillo al aterrizar y estabilizar tras un salto al lado." }, { "doc": "Wiki Mazothecoach \u2014 Articulaciones: rangos de movimiento y acoplamientos", "title": "Hombro (glenohumeral)", "text": "## Hombro (glenohumeral)\n**Tipo:** Esf\xE9rica (enartrosis)\n\n- **Flexi\xF3n** \u2014 180\xB0 (plano sagittal). **Acoplado:** codo estirado: 180\xB0 / codo flexionado: 160\xB0. Con el codo flexionado, la cabeza larga del tr\xEDceps (biarticular) ya est\xE1 alargada y frena un poco la flexi\xF3n completa del hombro por insuficiencia pasiva; con el codo estirado el brazo llega m\xE1s arriba (~180\xB0).\n- **Extensi\xF3n** \u2014 60\xB0 (plano sagittal). **Acoplado:** codo flexionado: 60\xB0 / codo estirado: 40\xB0. Con el codo estirado, el b\xEDceps (biarticular) se tensa por delante del hombro y frena la extensi\xF3n; doblar el codo lo relaja y el brazo va m\xE1s atr\xE1s. Base de por qu\xE9 el curl inclinado estira m\xE1s el b\xEDceps.\n- **Abducci\xF3n** \u2014 180\xB0 (plano frontal)\n- **Aducci\xF3n** \u2014 45\xB0 (plano frontal)\n- **Rotaci\xF3n interna** \u2014 90\xB0 (plano transverse)\n- **Rotaci\xF3n externa** \u2014 90\xB0 (plano transverse)\n\n**Movimiento acoplado:** La articulaci\xF3n m\xE1s m\xF3vil del cuerpo y la menos estable: la cabeza humeral apenas se apoya en una glena poco profunda. Por cada ~2\xB0 de elevaci\xF3n del brazo, ~1\xB0 viene del h\xFAmero y ~1\xB0 de la rotaci\xF3n ascendente de la esc\xE1pula (ritmo esc\xE1pulo-humeral 2:1). El deltoides empuja la cabeza hacia arriba y el manguito la recentra: sin esa pareja, la cabeza migra y se pierde la posici\xF3n.\n\n**Nota de coaching:** Para entrenar el rango overhead seguro se necesita rotaci\xF3n externa disponible y control escapular; el hombro 'canta' primero cuando algo de la cadena falla. No se gana rango forzando el h\xFAmero si la esc\xE1pula no rota." }, { "doc": "Wiki Mazothecoach \u2014 Articulaciones: rangos de movimiento y acoplamientos", "title": "Escapulotor\xE1cica", "text": "## Escapulotor\xE1cica\n**Tipo:** Articulaci\xF3n funcional (deslizamiento sobre la caja)\n\n- **Elevaci\xF3n** \u2014 60\xB0 (plano frontal)\n- **Depresi\xF3n** \u2014 10\xB0 (plano frontal)\n- **Protracci\xF3n** \u2014 40\xB0 (plano transverse)\n- **Retracci\xF3n** \u2014 25\xB0 (plano transverse)\n- **Rotaci\xF3n ascendente** \u2014 60\xB0 (plano frontal)\n- **Rotaci\xF3n descendente** \u2014 30\xB0 (plano frontal)\n\n**Movimiento acoplado:** No es una articulaci\xF3n verdadera: la esc\xE1pula flota sobre la caja sujeta por m\xFAsculos. Su movimiento se acopla obligatoriamente al del h\xFAmero (ritmo esc\xE1pulo-humeral): al elevar el brazo, la esc\xE1pula debe rotar hacia arriba o el rango se trunca. El serrato y el trapecio inferior la rotan arriba; romboides y elevador tiran al otro lado.\n\n**Nota de coaching:** La estabilidad y libertad escapular son prerrequisito para entrenar el dorsal alargado. Reparentar el brazo sin mover la esc\xE1pula en el modelo se ve antinatural: el par debe animarse junto." }, { "doc": "Wiki Mazothecoach \u2014 Articulaciones: rangos de movimiento y acoplamientos", "title": "Codo", "text": "## Codo\n**Tipo:** Bisagra (g\xEDnglimo)\n\n- **Flexi\xF3n** \u2014 145\xB0 (plano sagittal)\n- **Extensi\xF3n** \u2014 0\xB0 (plano sagittal)\n\n**Movimiento acoplado:** Bisagra de un solo plano: solo flexiona y extiende. La posici\xF3n de la mu\xF1eca no cambia su mec\xE1nica, por eso cambiar el agarre no 'activa otra cabeza' del tr\xEDceps. Lo que s\xED var\xEDa con el agarre es qu\xE9 flexor lidera, porque eso ocurre en la articulaci\xF3n radioulnar, no aqu\xED.\n\n**Nota de coaching:** En el modelo, el codo solo debe rotar en un eje; cualquier desviaci\xF3n lateral se ver\xEDa como error. El ol\xE9cranon del c\xFAbito es el tope de extensi\xF3n." }, { "doc": "Wiki Mazothecoach \u2014 Articulaciones: rangos de movimiento y acoplamientos", "title": "Radioulnar (prono-supinaci\xF3n)", "text": "## Radioulnar (prono-supinaci\xF3n)\n**Tipo:** Trocoide (pivote)\n\n- **Pronaci\xF3n** \u2014 80\xB0 (plano transverse)\n- **Supinaci\xF3n** \u2014 85\xB0 (plano transverse)\n\n**Movimiento acoplado:** Aqu\xED el radio rota sobre el c\xFAbito fijo: es el giro del antebrazo. Esta rotaci\xF3n decide la palanca de los flexores de codo: en supinaci\xF3n el b\xEDceps tiene ventaja; en pronaci\xF3n la pierde y el braquiorradial y el braquial lideran. Por eso el curl invertido 'pesa menos' sin que el m\xFAsculo sea m\xE1s d\xE9bil.\n\n**Nota de coaching:** El b\xEDceps es supinador potente solo con el codo flexionado; el supinador trabaja en cualquier \xE1ngulo. En el modelo, prono-supinaci\xF3n es rotaci\xF3n del radio cruzando sobre el c\xFAbito, no del codo." }, { "doc": "Wiki Mazothecoach \u2014 Articulaciones: rangos de movimiento y acoplamientos", "title": "Mu\xF1eca", "text": "## Mu\xF1eca\n**Tipo:** Cond\xEDlea (elipsoidea)\n\n- **Flexi\xF3n** \u2014 80\xB0 (plano sagittal)\n- **Extensi\xF3n** \u2014 70\xB0 (plano sagittal)\n- **Desviaci\xF3n radial** \u2014 20\xB0 (plano frontal)\n- **Desviaci\xF3n cubital** \u2014 30\xB0 (plano frontal)\n\n**Movimiento acoplado:** Articulaci\xF3n de dos planos cuyo control es sobre todo muscular. En posiciones de carga sobre la mano, la mu\xF1eca se co-contrae (flexores y extensores juntos) para fijarse en extensi\xF3n; ese apilamiento estable es lo que permite transmitir fuerza sin molestia.\n\n**Nota de coaching:** El epic\xF3ndilo medial (flexores) y lateral (extensores) son las zonas de codo de golfista/tenista; la molestia suele venir de volumen de agarre acumulado, no de un ejercicio de mu\xF1eca aislado." }, { "doc": "Wiki Mazothecoach \u2014 Articulaciones: rangos de movimiento y acoplamientos", "title": "Cadera", "text": "## Cadera\n**Tipo:** Esf\xE9rica (enartrosis)\n\n- **Flexi\xF3n** \u2014 120\xB0 (plano sagittal). **Acoplado:** rodilla flexionada: 120\xB0 / rodilla estirada: 90\xB0. Con la rodilla estirada los isquios (biarticulares) se tensan y la flexi\xF3n de cadera se frena a ~90\xB0 \u2014 es el tope del straight-leg raise. Doblar la rodilla los relaja y la cadera llega a ~120\xB0. (AAOS / Kapandji)\n- **Extensi\xF3n** \u2014 20\xB0 (plano sagittal). **Acoplado:** rodilla estirada: 20\xB0 / rodilla flexionada: 5\xB0. Doblar la rodilla alarga el recto femoral (biarticular) sobre la rodilla; al extender la cadera se tensa y la frena hacia ~0\xB0 (base del test de Thomas). Con la rodilla estirada la cadera extiende ~20\xB0.\n- **Abducci\xF3n** \u2014 45\xB0 (plano frontal)\n- **Aducci\xF3n** \u2014 30\xB0 (plano frontal). **Acoplado:** rodilla estirada: 30\xB0 / rodilla flexionada: 20\xB0. Con la rodilla flexionada aumenta la tensi\xF3n del TFL / banda iliotibial sobre la cara lateral de la rodilla y se aduce menos (test de Ober cl\xE1sico); con la rodilla estirada la cadera aduce m\xE1s (Ober modificado).\n- **Rotaci\xF3n interna** \u2014 40\xB0 (plano transverse). **Acoplado:** cadera flexionada: 40\xB0 / cadera extendida: 30\xB0. Con la cadera flexionada ~90\xB0 el piriforme cambia de palanca y pasa a rotar internamente, as\xED que hay m\xE1s rotaci\xF3n interna sentado que de pie. Por eso se valora la RI con la cadera a 90\xB0.\n- **Rotaci\xF3n externa** \u2014 45\xB0 (plano transverse). **Acoplado:** cadera extendida: 45\xB0 / cadera flexionada: 35\xB0. Al flexionar la cadera, los rotadores externos profundos (piriforme y compa\xF1\xEDa) pierden brazo de palanca rotador externo, as\xED que la rotaci\xF3n externa disponible baja un poco respecto a la cadera extendida.\n\n**Movimiento acoplado:** Esf\xE9rica como el hombro pero hecha para carga, no para rango: el acet\xE1bulo es profundo y estable. La b\xE1scula p\xE9lvica acopla la cadera con la columna lumbar; en flexi\xF3n profunda de cadera, si la pelvis bascula en posterior, la lumbar se flexiona (el 'butt wink'). La estructura individual del acet\xE1bulo decide el mejor stance, por eso no hay una sentadilla \xFAnica para todos.\n\n**Nota de coaching:** La 'debilidad de gl\xFAteo' suele ser inestabilidad de gl\xFAteo medio, no falta de fuerza del mayor. La b\xE1scula anterior excesiva resta eficacia al gl\xFAteo mayor." }, { "doc": "Wiki Mazothecoach \u2014 Articulaciones: rangos de movimiento y acoplamientos", "title": "Rodilla", "text": "## Rodilla\n**Tipo:** Bisagra modificada\n\n- **Flexi\xF3n** \u2014 140\xB0 (plano sagittal). **Acoplado:** cadera flexionada: 140\xB0 / cadera extendida: 120\xB0. Con la cadera flexionada el recto femoral est\xE1 relajado y la rodilla flexiona completo (~140\xB0, tal\xF3n al gl\xFAteo). Con la cadera extendida (boca abajo) el recto femoral ya est\xE1 alargado y frena la flexi\xF3n hacia ~120\xB0 \u2014 es el test de Ely.\n- **Extensi\xF3n** \u2014 0\xB0 (plano sagittal)\n- **Rotaci\xF3n interna (rodilla flexionada)** \u2014 10\xB0 (plano transverse)\n- **Rotaci\xF3n externa (rodilla flexionada)** \u2014 30\xB0 (plano transverse)\n\n**Movimiento acoplado:** La r\xF3tula se desliza por el surco femoral aumentando la palanca del cu\xE1driceps; en extensi\xF3n terminal la tibia rota externamente unos grados para 'bloquear' la rodilla (mecanismo de screw-home), y debe rotar adentro para desbloquearla antes de flexionar. La rotaci\xF3n de la tibia solo est\xE1 disponible con la rodilla flexionada.\n\n**Nota de coaching:** El control rotacional de la tibia depende del balance isquiotibial: mediales la rotan adentro, b\xEDceps femoral afuera. El valgo bajo carga suele originarse arriba (cadera) o abajo (pie), no en la rodilla misma." }, { "doc": "Wiki Mazothecoach \u2014 Articulaciones: rangos de movimiento y acoplamientos", "title": "Tobillo", "text": "## Tobillo\n**Tipo:** Bisagra (g\xEDnglimo)\n\n- **Dorsiflexi\xF3n** \u2014 20\xB0 (plano sagittal). **Acoplado:** rodilla flexionada: 20\xB0 / rodilla estirada: 5\xB0. Con la rodilla estirada el gastrocnemio (biarticular) est\xE1 tenso y limita la dorsiflexi\xF3n a ~5\xB0; doblar la rodilla lo relaja y sube a ~20\xB0 (queda el s\xF3leo). Es el principio del test de Silfverski\xF6ld.\n- **Flexi\xF3n plantar** \u2014 50\xB0 (plano sagittal)\n- **Inversi\xF3n** \u2014 35\xB0 (plano frontal)\n- **Eversi\xF3n** \u2014 15\xB0 (plano frontal)\n\n**Movimiento acoplado:** La dorsiflexi\xF3n decide cu\xE1nto avanza la rodilla sobre el pie, y con ello la profundidad de sentadilla. La inversi\xF3n/eversi\xF3n se acopla con el resto del pie (la pronaci\xF3n combina dorsiflexi\xF3n, eversi\xF3n y abducci\xF3n); el mal\xE9olo del peron\xE9 es el tope \xF3seo lateral que frena la inversi\xF3n, y los peroneos el freno activo.\n\n**Nota de coaching:** La dorsiflexi\xF3n limitada empuja compensaciones arriba en la cadena; talones elevados o stance m\xE1s amplio dan rango funcional. Antes de forzar, distinguir bloqueo articular de tejido. Eval\xFAa solo si cambiar\xEDa tu plan." }, { "doc": "Wiki Mazothecoach \u2014 Articulaciones: rangos de movimiento y acoplamientos", "title": "Columna cervical", "text": "## Columna cervical\n**Tipo:** Conjunto de articulaciones vertebrales\n\n- **Flexi\xF3n** \u2014 50\xB0 (plano sagittal)\n- **Extensi\xF3n** \u2014 60\xB0 (plano sagittal)\n- **Flexi\xF3n lateral** \u2014 45\xB0 (plano frontal)\n- **Rotaci\xF3n** \u2014 80\xB0 (plano transverse)\n\n**Movimiento acoplado:** El segmento m\xE1s m\xF3vil de la columna, pero dise\xF1ado para orientar la cabeza, no para cargar. Su posici\xF3n se acopla a la tor\xE1cica: una tor\xE1cica flexionada empuja la cabeza adelante y obliga a la cervical a extenderse para compensar. Buena extensi\xF3n tor\xE1cica descarga al cuello.\n\n**Nota de coaching:** La tensi\xF3n cervical en trabajo overhead suele ser elevador y trapecio superior compensando rotaci\xF3n ascendente escapular pobre. 'Mirada al horizonte' ordena mejor que pensar en el cuello." }, { "doc": "Wiki Mazothecoach \u2014 Articulaciones: rangos de movimiento y acoplamientos", "title": "Columna tor\xE1cica", "text": "## Columna tor\xE1cica\n**Tipo:** Conjunto de articulaciones vertebrales\n\n- **Flexi\xF3n** \u2014 35\xB0 (plano sagittal)\n- **Extensi\xF3n** \u2014 25\xB0 (plano sagittal)\n- **Flexi\xF3n lateral** \u2014 25\xB0 (plano frontal)\n- **Rotaci\xF3n** \u2014 35\xB0 (plano transverse)\n\n**Movimiento acoplado:** El segmento de la columna hecho para rotar. Su rotaci\xF3n es prerrequisito del alcance overhead: si la tor\xE1cica no gira ni extiende, el rango se pide prestado a la lumbar (que no debe darlo) o al hombro. La caja tor\xE1cica articula aqu\xED, as\xED que la respiraci\xF3n y la posici\xF3n costal se acoplan a este segmento.\n\n**Nota de coaching:** La movilidad tor\xE1cica habilita entrenar el dorsal alargado y protege a cuello y lumbar de compensar. Es de los primeros sitios a revisar cuando falta rango overhead." }, { "doc": "Wiki Mazothecoach \u2014 Articulaciones: rangos de movimiento y acoplamientos", "title": "Columna lumbar", "text": "## Columna lumbar\n**Tipo:** Conjunto de articulaciones vertebrales\n\n- **Flexi\xF3n** \u2014 50\xB0 (plano sagittal)\n- **Extensi\xF3n** \u2014 25\xB0 (plano sagittal)\n- **Flexi\xF3n lateral** \u2014 20\xB0 (plano frontal)\n- **Rotaci\xF3n** \u2014 5\xB0 (plano transverse)\n\n**Movimiento acoplado:** El segmento de carga: robusto pero con muy poca rotaci\xF3n de dise\xF1o (de ah\xED los ~5\xB0). Se acopla con la pelvis por la b\xE1scula: extensi\xF3n lumbar acompa\xF1a b\xE1scula anterior, flexi\xF3n lumbar acompa\xF1a b\xE1scula posterior. Su trabajo bajo carga es resistir el movimiento, no producirlo: estabilizar, no fortalecer.\n\n**Nota de coaching:** Buscar 'fuerza de espalda baja' con extensiones cargadas fortalece algo que debe estabilizarse. Cuando dorsal y gl\xFAteo funcionan, la lumbar deja de compensar. En el modelo, la rotaci\xF3n lumbar debe ser m\xEDnima: forzarla se ve y se siente mal." }, { "doc": "Wiki Mazothecoach \u2014 Zonas de molestia y morfolog\xEDa individual", "title": "Zonas de molestia: qu\xE9 reforzar y por qu\xE9", "text": "## Zonas de molestia: qu\xE9 reforzar y por qu\xE9\n### Rodilla\n- **Reforzar:** Vasto medial, Recto femoral, Gl\xFAteo medio, Gl\xFAteo menor, Tibial posterior\n- **Por qu\xE9:** En este enfoque la rodilla se gobierna desde el plano frontal: la estabilidad la dan el control del f\xE9mur (gl\xFAteo medio/m\xEDnimo durante la marcha, por el \xE1ngulo Q) y el seguimiento de la r\xF3tula (vasto medial), no solo la fuerza del cu\xE1driceps. Se refuerzan los m\xFAsculos que sostienen el seguimiento y la estabilidad frontal, com\xFAnmente poco entrenados alrededor de la articulaci\xF3n.\n\n### Hombro\n- **Reforzar:** Supraespinoso, Infraespinoso, Redondo menor, Subescapular, Serrato anterior, Trapecio\n- **Por qu\xE9:** El manguito rotador (SITS) funciona como estabilizador din\xE1mico de la cabeza humeral m\xE1s que por sus acciones aisladas, y el serrato anterior es el rotador ascendente subvalorado de la esc\xE1pula. Se refuerzan estos estabilizadores m\xE1s las fibras bajas del trapecio, que sostienen la articulaci\xF3n y suelen estar poco entrenados.\n\n### Zona lumbar baja\n- **Reforzar:** Mult\xEDfidos, Transverso del abdomen, Cuadrado lumbar, Erectores de la columna, Dorsal ancho, Gl\xFAteo mayor\n- **Por qu\xE9:** En este enfoque la lumbar no se moviliza: se protege su rigidez funcional. Se refuerzan los estabilizadores profundos (mult\xEDfidos, transverso, cuadrado lumbar, erectores) y la cadena fascial dorsal-gl\xFAteo mayor, que cruza la fascia toracolumbar y sostiene la columna durante bisagras y empujes.\n\n### Cadera\n- **Reforzar:** Gl\xFAteo medio, Gl\xFAteo menor, Rotadores externos profundos, Gl\xFAteo mayor, Iliopsoas\n- **Por qu\xE9:** La cadera prioriza estabilidad y rotaci\xF3n interna sobre rango: el fallo t\xEDpico es la estabilidad del gl\xFAteo medio en la marcha, no la fuerza del gl\xFAteo mayor. Se refuerzan gl\xFAteo medio/m\xEDnimo y rotadores externos profundos (control + RI, predictor de dolor lumbar seg\xFAn Cibulka), com\xFAnmente poco entrenados.\n\n### Codo\n- **Reforzar:** Flexores de mu\xF1eca y dedos, Extensores de mu\xF1eca y dedos, Braquiorradial, Pronador redondo, Supinador\n- **Por qu\xE9:** Las molestias del codo suelen vivir en los epic\xF3ndilos, donde se anclan los flexores y extensores de mu\xF1eca y dedos; el braquiorradial integra el agarre y la posici\xF3n del antebrazo. Se refuerzan estos m\xFAsculos del agarre y de pronosupinaci\xF3n que sostienen la articulaci\xF3n y suelen estar poco entrenados." }, { "doc": "Wiki Mazothecoach \u2014 Zonas de molestia y morfolog\xEDa individual", "title": "Morfolog\xEDa: c\xF3mo cambia el entrenamiento seg\xFAn tu estructura", "text": "## Morfolog\xEDa: c\xF3mo cambia el entrenamiento seg\xFAn tu estructura\n### F\xE9mur largo vs corto\nLa longitud del f\xE9mur respecto al torso cambia las palancas de la sentadilla: define cu\xE1nto debe inclinarse el tronco para mantener la barra sobre el medio del pie.\n- **F\xE9mur largo:** M\xE1s inclinaci\xF3n de tronco al sentar para no irse hacia atr\xE1s, lo que sesga la sentadilla hacia dominancia de cadera. Suele rendir mejor en hinge y peso muerto. Ajustar stance m\xE1s amplio o usar talones elevados ayuda a mantener profundidad sin perder equilibrio.\n- **F\xE9mur corto:** Permite una sentadilla m\xE1s vertical y dominante de rodilla, con menos inclinaci\xF3n. Suele sentirse c\xF3moda y profunda con stance estrecho. Ventaja relativa en sentadilla, menos palanca en peso muerto convencional.\n\n### Torso largo vs corto\nLa proporci\xF3n torso/piernas decide qu\xE9 levantamiento te favorece y cu\xE1nto te inclinas en la sentadilla, porque cambia d\xF3nde cae el centro de masa.\n- **Torso largo (piernas cortas):** Favorece la sentadilla: el tronco m\xE1s largo con f\xE9mures cortos permite mantenerse vertical y profundo. En peso muerto la barra recorre m\xE1s distancia y el tronco largo es m\xE1s dif\xEDcil de sostener neutro, as\xED que suele ser el levantamiento menos ventajoso.\n- **Torso corto (piernas largas):** Favorece el peso muerto: tronco corto y brazos/piernas largas acortan el recorrido y dan buena palanca. En sentadilla obliga a m\xE1s inclinaci\xF3n de tronco y dominancia de cadera; conviene trabajar movilidad de tobillo y stance para no quedar demasiado adelante.\n\n### Brazos largos vs cortos\nLa longitud de los brazos cambia el recorrido de las barras: m\xE1s rango en los empujes y mejor o peor palanca en los jalones y el peso muerto.\n- **Brazos largos:** Ventaja clara en peso muerto y dominadas: la barra recorre menos distancia. En press de banca el rango es mayor y el bloqueo m\xE1s exigente; agarre un poco m\xE1s amplio y trabajo de tr\xEDceps ayudan. En curls, m\xE1s rango de estiramiento disponible.\n- **Brazos cortos:** Ventaja en press de banca y fondos: recorrido m\xE1s corto, bloqueo m\xE1s f\xE1cil. En peso muerto la barra recorre m\xE1s y el tronco se inclina m\xE1s, as\xED que t\xE9cnica y movilidad de cadera importan m\xE1s. En dominadas, algo m\xE1s de rango por repetici\xF3n.\n\n### Clav\xEDculas anchas vs estrechas\nEl ancho de las clav\xEDculas marca el ancho \xF3seo de los hombros: la base de la ilusi\xF3n en V y el punto de partida del agarre en los empujes.\n- **Clav\xEDculas anchas:** Hombros naturalmente m\xE1s anchos y mejor ilusi\xF3n en V con menos esfuerzo. En press de banca, un poco m\xE1s de recorrido y a veces m\xE1s estr\xE9s en el hombro con agarres muy amplios; controlar la posici\xF3n escapular protege la articulaci\xF3n.\n- **Clav\xEDculas estrechas:** Hombros m\xE1s estrechos de base; el ancho visual se construye sobre todo con deltoides medio (la cintura m\xE1s estrecha ayuda al contraste). En press, recorrido algo menor. La cintura suele verse proporcionalmente m\xE1s peque\xF1a, lo que tambi\xE9n favorece la V.\n\n### \xC1ngulo Q amplio vs estrecho\nEl \xE1ngulo Q (c\xF3mo sale el f\xE9mur del acet\xE1bulo hacia la rodilla) influye en la tendencia a valgo de rodilla y en la demanda de estabilidad frontal de la cadera. El manual insiste en identificarlo por individuo.\n- **\xC1ngulo Q amplio:** Mayor tendencia a que la rodilla colapse hacia dentro (valgo) bajo carga, sobre todo en sentadilla y aterrizajes. La prioridad es estabilidad lateral de cadera (gl\xFAteo medio) y control de rodilla, no solo 'empujar rodillas afuera'. Frecuente, no patol\xF3gico por s\xED mismo.\n- **\xC1ngulo Q estrecho:** Menos tendencia natural al valgo; la l\xEDnea de tracci\xF3n del cu\xE1driceps es m\xE1s recta. No exime de trabajar estabilidad, pero el control frontal suele costar menos. Permite stances m\xE1s variados sin que la rodilla se desv\xEDe.\n\n### Tobillo m\xF3vil vs r\xEDgido\nLa dorsiflexi\xF3n del tobillo (cu\xE1nto avanza la rodilla sobre el pie) condiciona la profundidad de sentadilla y el stance; se mide con el test de tobillo a la pared.\n- **Tobillo m\xF3vil:** Permite sentadilla profunda con torso m\xE1s vertical y stance estrecho, dejando que la rodilla avance. M\xE1s opciones de variantes (sentadilla a fondo, frontal). Mucha movilidad sin estabilidad puede pedir trabajo de control del pie.\n- **Tobillo r\xEDgido:** Limita cu\xE1nto avanza la rodilla, as\xED que la sentadilla pide stance m\xE1s amplio, punteras algo abiertas o talones elevados para llegar a profundidad sin compensar arriba. Antes de forzar, conviene saber si la limitaci\xF3n es articular o de tejido (CH movilidad). Eval\xFAa solo si cambiar\xEDa tu plan.\n\n### Cadera profunda/anteversi\xF3n vs poco profunda\nLa forma del acet\xE1bulo y la orientaci\xF3n del cuello femoral deciden cu\xE1nto puede abrir y bajar la cadera: explican por qu\xE9 cada cliente tiene su mejor stance de sentadilla.\n- **Cadera profunda / retroversi\xF3n:** El acet\xE1bulo profundo da m\xE1s estabilidad pero menos rango: el choque \xF3seo aparece antes, as\xED que la profundidad y la apertura son m\xE1s limitadas. Suele ir mejor con stance m\xE1s estrecho y punteras al frente. Forzar rango aqu\xED choca con hueso, no con tejido.\n- **Cadera poco profunda / anteversi\xF3n:** El acet\xE1bulo m\xE1s somero da m\xE1s rango y permite stances m\xE1s amplios y profundos, a cambio de pedir m\xE1s estabilidad activa. Suele tolerar bien sentadillas abiertas. La estabilidad de gl\xFAteo medio importa m\xE1s para suplir lo que la estructura no fija.\n\n### \xC1ngulo de carga amplio vs estrecho (codo)\nEl \xE1ngulo de carga es la desviaci\xF3n natural del antebrazo respecto al brazo con el codo extendido; afecta la trayectoria c\xF3moda del curl y del press y la posici\xF3n de agarre.\n- **\xC1ngulo de carga amplio:** El antebrazo se desv\xEDa m\xE1s hacia afuera; el agarre c\xF3modo en barra recta tiende a forzar mu\xF1eca y codo. Una barra EZ o mancuernas (que dejan rotar el antebrazo) suelen sentirse mejor en curls y press. M\xE1s com\xFAn en estructuras con caderas/hombros de cierta proporci\xF3n.\n- **\xC1ngulo de carga estrecho:** El antebrazo queda m\xE1s en l\xEDnea con el brazo; la barra recta suele ser c\xF3moda y el agarre se siente natural. Menos necesidad de implementos que liberen la rotaci\xF3n del antebrazo. Permite trayectorias de press y curl m\xE1s directas.\n\n### Pie plano vs cavo\nLa altura del arco cambia c\xF3mo el pie absorbe carga y reparte el peso: influye en la pronaci\xF3n, la base de apoyo y la elecci\xF3n de calzado para levantar.\n- **Pie cavo (arco alto):** Arco r\xEDgido que absorbe menos impacto y tiende a la supinaci\xF3n (peso al borde externo). Base de apoyo algo menos adaptable; conviene asegurar contacto del primer dedo para no perder el lado interno en sentadilla. Suele preferir algo de amortiguaci\xF3n en trabajo de impacto.\n- **Pie plano (arco bajo):** Arco que colapsa m\xE1s bajo carga, con tendencia a pronaci\xF3n; eso puede leerse arriba como valgo de rodilla. El trabajo de tibial posterior y control del arco en apoyo monopodal ayuda. Un calzado plano y firme da mejor base para levantar que uno muy amortiguado." }];

// src/index.js
var ALLOWED_ORIGINS = [
  "https://mazothecoach.github.io",
  "http://localhost:5174",
  "http://localhost:4173"
];
var MODEL = "claude-opus-5";
var SYSTEM_INTRO = `Eres la Wiki de Mazothecoach: asistente educativo del visor anat\xF3mico 3D (https://mazothecoach.github.io/anatomy-viewer/) para clientas y clientes de coaching.

Reglas:
- Responde SOLO con el contenido de la wiki que te paso abajo. Si la pregunta no est\xE1 cubierta, dilo honesto y sugiere preguntarle directo a Mazo (@mazothecoach).
- Tono Mazothecoach: honesto, t\xE9cnico pero claro, sin humo motivacional. Directo y compacto (3-6 oraciones normalmente, listas cortas si ayudan).
- Responde en el idioma de la pregunta (espa\xF1ol por defecto).
- No es consejo m\xE9dico: si describen dolor agudo, lesi\xF3n o algo cl\xEDnico, recomienda evaluaci\xF3n profesional en vez de adivinar.
- No inventes rangos, or\xEDgenes ni inserciones que no est\xE9n en el corpus.`;
async function checkLimits(env, ip) {
  const now = /* @__PURE__ */ new Date();
  const hourKey = `ip:${ip}:${now.toISOString().slice(0, 13)}`;
  const dayKey = `day:${now.toISOString().slice(0, 10)}`;
  const [ipCount, dayCount] = await Promise.all([env.RATE.get(hourKey), env.RATE.get(dayKey)]);
  const ipLimit = parseInt(env.RATE_LIMIT_IP_HOUR || "10", 10);
  const dayLimit = parseInt(env.RATE_LIMIT_GLOBAL_DAY || "300", 10);
  if (parseInt(dayCount || "0", 10) >= dayLimit) {
    return { ok: false, retryAfter: 86400 - (now.getUTCHours() * 3600 + now.getUTCMinutes() * 60) };
  }
  if (parseInt(ipCount || "0", 10) >= ipLimit) {
    return { ok: false, retryAfter: 3600 - (now.getUTCMinutes() * 60 + now.getUTCSeconds()) };
  }
  await Promise.all([
    env.RATE.put(hourKey, String(parseInt(ipCount || "0", 10) + 1), { expirationTtl: 3700 }),
    env.RATE.put(dayKey, String(parseInt(dayCount || "0", 10) + 1), { expirationTtl: 9e4 })
  ]);
  return { ok: true };
}
__name(checkLimits, "checkLimits");
var STOP = /* @__PURE__ */ new Set(["que", "como", "donde", "cual", "para", "con", "los", "las", "una", "del", "por", "mis", "the", "and", "for", "what", "how", "where", "should", "debo", "deberia", "hasta", "hago", "esta", "este", "when", "why"]);
var norm = /* @__PURE__ */ __name((s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""), "norm");
var tokens = /* @__PURE__ */ __name((s) => norm(s).split(/[^a-z0-9]+/).filter((w) => w.length >= 3 && !STOP.has(w)), "tokens");
function pickSections(question, budget = 14e3) {
  const q = tokens(question);
  if (!q.length) return [];
  const scored = SECTIONS.map((sec) => {
    const title = norm(sec.title), text = norm(sec.text);
    let score = 0;
    for (const w of q) {
      if (title.includes(w)) score += 5;
      let i = 0, hits = 0;
      while ((i = text.indexOf(w, i)) !== -1 && hits < 4) {
        hits++;
        i += w.length;
      }
      score += hits;
    }
    return { sec, score };
  }).filter((x) => x.score > 2).sort((a, b) => b.score - a.score);
  const picked = [];
  let total = 0;
  for (const { sec } of scored) {
    if (total + sec.text.length > budget) continue;
    picked.push(sec);
    total += sec.text.length;
    if (picked.length >= 10) break;
  }
  return picked;
}
__name(pickSections, "pickSections");
function cors(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8"
  };
}
__name(cors, "cors");
var json = /* @__PURE__ */ __name((obj, status, headers) => new Response(JSON.stringify(obj), { status, headers }), "json");
var src_default = {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const headers = cors(origin);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (request.method === "GET") return json({ ok: true, service: "mazowiki" }, 200, headers);
    if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405, headers);
    if (origin && !ALLOWED_ORIGINS.includes(origin)) return json({ error: "forbidden_origin" }, 403, headers);
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "bad_json" }, 400, headers);
    }
    const msgs = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
    if (!msgs.length || msgs[msgs.length - 1].role !== "user") return json({ error: "bad_messages" }, 400, headers);
    for (const m of msgs) {
      if (m.role !== "user" && m.role !== "assistant" || typeof m.content !== "string" || m.content.length > 800) {
        return json({ error: "bad_messages" }, 400, headers);
      }
    }
    if (!env.ANTHROPIC_API_KEY) return json({ error: "not_configured" }, 503, headers);
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const limit2 = await checkLimits(env, ip);
    if (!limit2.ok) return json({ error: "rate_limited", retryAfter: limit2.retryAfter }, 429, headers);
    const question = msgs[msgs.length - 1].content;
    const picked = pickSections(question);
    const dynamicContext = picked.length ? `

# Secciones relevantes de la wiki

${picked.map((s) => `(${s.doc})
${s.text}`).join("\n\n")}` : "";
    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
    try {
      const resp = await client.messages.create({
        model: MODEL,
        max_tokens: 1500,
        output_config: { effort: "low" },
        system: [
          // Bloque estable (intro + Q&A completo) con cache — se reusa entre mensajes
          { type: "text", text: `${SYSTEM_INTRO}

# Q&A de coaching (voz de Mazo)

${QA}`, cache_control: { type: "ephemeral" } },
          // Bloque dinámico: secciones elegidas para ESTA pregunta
          ...dynamicContext ? [{ type: "text", text: dynamicContext }] : []
        ],
        messages: msgs.map((m) => ({ role: m.role, content: m.content }))
      });
      if (resp.stop_reason === "refusal") {
        return json({ reply: "Esa pregunta no la puedo responder aqu\xED. Preg\xFAntale directo a Mazo (@mazothecoach)." }, 200, headers);
      }
      const reply = resp.content.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
      return json({ reply: reply || "\u2026" }, 200, headers);
    } catch (err) {
      const status = err && err.status;
      if (status === 429 || status >= 500) return json({ error: "upstream_busy" }, 503, headers);
      console.error("anthropic error", status, err && err.message);
      return json({ error: "upstream_error" }, 502, headers);
    }
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_modules_watch_stub();
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_modules_watch_stub();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    const body = JSON.stringify(error);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-NLrDeQ/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
init_modules_watch_stub();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-NLrDeQ/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
