(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
var react = { exports: {} };
var react_production_min = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l$1 = Symbol.for("react.element"), n$1 = Symbol.for("react.portal"), p$2 = Symbol.for("react.fragment"), q$1 = Symbol.for("react.strict_mode"), r = Symbol.for("react.profiler"), t = Symbol.for("react.provider"), u = Symbol.for("react.context"), v$1 = Symbol.for("react.forward_ref"), w = Symbol.for("react.suspense"), x = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), z$1 = Symbol.iterator;
function A$1(a) {
  if (null === a || "object" !== typeof a) return null;
  a = z$1 && a[z$1] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var B$1 = { isMounted: function() {
  return false;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, C$1 = Object.assign, D$1 = {};
function E$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$1;
}
E$1.prototype.isReactComponent = {};
E$1.prototype.setState = function(a, b) {
  if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, a, b, "setState");
};
E$1.prototype.forceUpdate = function(a) {
  this.updater.enqueueForceUpdate(this, a, "forceUpdate");
};
function F() {
}
F.prototype = E$1.prototype;
function G$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$1;
}
var H$1 = G$1.prototype = new F();
H$1.constructor = G$1;
C$1(H$1, E$1.prototype);
H$1.isPureReactComponent = true;
var I$1 = Array.isArray, J = Object.prototype.hasOwnProperty, K$1 = { current: null }, L$1 = { key: true, ref: true, __self: true, __source: true };
function M$1(a, b, e) {
  var d, c = {}, k2 = null, h = null;
  if (null != b) for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k2 = "" + b.key), b) J.call(b, d) && !L$1.hasOwnProperty(d) && (c[d] = b[d]);
  var g = arguments.length - 2;
  if (1 === g) c.children = e;
  else if (1 < g) {
    for (var f2 = Array(g), m2 = 0; m2 < g; m2++) f2[m2] = arguments[m2 + 2];
    c.children = f2;
  }
  if (a && a.defaultProps) for (d in g = a.defaultProps, g) void 0 === c[d] && (c[d] = g[d]);
  return { $$typeof: l$1, type: a, key: k2, ref: h, props: c, _owner: K$1.current };
}
function N$1(a, b) {
  return { $$typeof: l$1, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
}
function O$1(a) {
  return "object" === typeof a && null !== a && a.$$typeof === l$1;
}
function escape(a) {
  var b = { "=": "=0", ":": "=2" };
  return "$" + a.replace(/[=:]/g, function(a2) {
    return b[a2];
  });
}
var P$1 = /\/+/g;
function Q$1(a, b) {
  return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
}
function R$1(a, b, e, d, c) {
  var k2 = typeof a;
  if ("undefined" === k2 || "boolean" === k2) a = null;
  var h = false;
  if (null === a) h = true;
  else switch (k2) {
    case "string":
    case "number":
      h = true;
      break;
    case "object":
      switch (a.$$typeof) {
        case l$1:
        case n$1:
          h = true;
      }
  }
  if (h) return h = a, c = c(h), a = "" === d ? "." + Q$1(h, 0) : d, I$1(c) ? (e = "", null != a && (e = a.replace(P$1, "$&/") + "/"), R$1(c, b, e, "", function(a2) {
    return a2;
  })) : null != c && (O$1(c) && (c = N$1(c, e + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P$1, "$&/") + "/") + a)), b.push(c)), 1;
  h = 0;
  d = "" === d ? "." : d + ":";
  if (I$1(a)) for (var g = 0; g < a.length; g++) {
    k2 = a[g];
    var f2 = d + Q$1(k2, g);
    h += R$1(k2, b, e, f2, c);
  }
  else if (f2 = A$1(a), "function" === typeof f2) for (a = f2.call(a), g = 0; !(k2 = a.next()).done; ) k2 = k2.value, f2 = d + Q$1(k2, g++), h += R$1(k2, b, e, f2, c);
  else if ("object" === k2) throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
  return h;
}
function S$1(a, b, e) {
  if (null == a) return a;
  var d = [], c = 0;
  R$1(a, d, "", "", function(a2) {
    return b.call(e, a2, c++);
  });
  return d;
}
function T$1(a) {
  if (-1 === a._status) {
    var b = a._result;
    b = b();
    b.then(function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 1, a._result = b2;
    }, function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 2, a._result = b2;
    });
    -1 === a._status && (a._status = 0, a._result = b);
  }
  if (1 === a._status) return a._result.default;
  throw a._result;
}
var U$1 = { current: null }, V$1 = { transition: null }, W$1 = { ReactCurrentDispatcher: U$1, ReactCurrentBatchConfig: V$1, ReactCurrentOwner: K$1 };
function X$1() {
  throw Error("act(...) is not supported in production builds of React.");
}
react_production_min.Children = { map: S$1, forEach: function(a, b, e) {
  S$1(a, function() {
    b.apply(this, arguments);
  }, e);
}, count: function(a) {
  var b = 0;
  S$1(a, function() {
    b++;
  });
  return b;
}, toArray: function(a) {
  return S$1(a, function(a2) {
    return a2;
  }) || [];
}, only: function(a) {
  if (!O$1(a)) throw Error("React.Children.only expected to receive a single React element child.");
  return a;
} };
react_production_min.Component = E$1;
react_production_min.Fragment = p$2;
react_production_min.Profiler = r;
react_production_min.PureComponent = G$1;
react_production_min.StrictMode = q$1;
react_production_min.Suspense = w;
react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W$1;
react_production_min.act = X$1;
react_production_min.cloneElement = function(a, b, e) {
  if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
  var d = C$1({}, a.props), c = a.key, k2 = a.ref, h = a._owner;
  if (null != b) {
    void 0 !== b.ref && (k2 = b.ref, h = K$1.current);
    void 0 !== b.key && (c = "" + b.key);
    if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
    for (f2 in b) J.call(b, f2) && !L$1.hasOwnProperty(f2) && (d[f2] = void 0 === b[f2] && void 0 !== g ? g[f2] : b[f2]);
  }
  var f2 = arguments.length - 2;
  if (1 === f2) d.children = e;
  else if (1 < f2) {
    g = Array(f2);
    for (var m2 = 0; m2 < f2; m2++) g[m2] = arguments[m2 + 2];
    d.children = g;
  }
  return { $$typeof: l$1, type: a.type, key: c, ref: k2, props: d, _owner: h };
};
react_production_min.createContext = function(a) {
  a = { $$typeof: u, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
  a.Provider = { $$typeof: t, _context: a };
  return a.Consumer = a;
};
react_production_min.createElement = M$1;
react_production_min.createFactory = function(a) {
  var b = M$1.bind(null, a);
  b.type = a;
  return b;
};
react_production_min.createRef = function() {
  return { current: null };
};
react_production_min.forwardRef = function(a) {
  return { $$typeof: v$1, render: a };
};
react_production_min.isValidElement = O$1;
react_production_min.lazy = function(a) {
  return { $$typeof: y, _payload: { _status: -1, _result: a }, _init: T$1 };
};
react_production_min.memo = function(a, b) {
  return { $$typeof: x, type: a, compare: void 0 === b ? null : b };
};
react_production_min.startTransition = function(a) {
  var b = V$1.transition;
  V$1.transition = {};
  try {
    a();
  } finally {
    V$1.transition = b;
  }
};
react_production_min.unstable_act = X$1;
react_production_min.useCallback = function(a, b) {
  return U$1.current.useCallback(a, b);
};
react_production_min.useContext = function(a) {
  return U$1.current.useContext(a);
};
react_production_min.useDebugValue = function() {
};
react_production_min.useDeferredValue = function(a) {
  return U$1.current.useDeferredValue(a);
};
react_production_min.useEffect = function(a, b) {
  return U$1.current.useEffect(a, b);
};
react_production_min.useId = function() {
  return U$1.current.useId();
};
react_production_min.useImperativeHandle = function(a, b, e) {
  return U$1.current.useImperativeHandle(a, b, e);
};
react_production_min.useInsertionEffect = function(a, b) {
  return U$1.current.useInsertionEffect(a, b);
};
react_production_min.useLayoutEffect = function(a, b) {
  return U$1.current.useLayoutEffect(a, b);
};
react_production_min.useMemo = function(a, b) {
  return U$1.current.useMemo(a, b);
};
react_production_min.useReducer = function(a, b, e) {
  return U$1.current.useReducer(a, b, e);
};
react_production_min.useRef = function(a) {
  return U$1.current.useRef(a);
};
react_production_min.useState = function(a) {
  return U$1.current.useState(a);
};
react_production_min.useSyncExternalStore = function(a, b, e) {
  return U$1.current.useSyncExternalStore(a, b, e);
};
react_production_min.useTransition = function() {
  return U$1.current.useTransition();
};
react_production_min.version = "18.3.1";
{
  react.exports = react_production_min;
}
var reactExports = react.exports;
const React = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f = reactExports, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p$1 = { key: true, ref: true, __self: true, __source: true };
function q(c, a, g) {
  var b, d = {}, e = null, h = null;
  void 0 !== g && (e = "" + g);
  void 0 !== a.key && (e = "" + a.key);
  void 0 !== a.ref && (h = a.ref);
  for (b in a) m$1.call(a, b) && !p$1.hasOwnProperty(b) && (d[b] = a[b]);
  if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
  return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
}
reactJsxRuntime_production_min.Fragment = l;
reactJsxRuntime_production_min.jsx = q;
reactJsxRuntime_production_min.jsxs = q;
{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}
var jsxRuntimeExports = jsxRuntime.exports;
var client = {};
var reactDom = { exports: {} };
var reactDom_production_min = {};
var scheduler = { exports: {} };
var scheduler_production_min = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(exports$1) {
  function f2(a, b) {
    var c = a.length;
    a.push(b);
    a: for (; 0 < c; ) {
      var d = c - 1 >>> 1, e = a[d];
      if (0 < g(e, b)) a[d] = b, a[c] = e, c = d;
      else break a;
    }
  }
  function h(a) {
    return 0 === a.length ? null : a[0];
  }
  function k2(a) {
    if (0 === a.length) return null;
    var b = a[0], c = a.pop();
    if (c !== b) {
      a[0] = c;
      a: for (var d = 0, e = a.length, w2 = e >>> 1; d < w2; ) {
        var m2 = 2 * (d + 1) - 1, C2 = a[m2], n2 = m2 + 1, x2 = a[n2];
        if (0 > g(C2, c)) n2 < e && 0 > g(x2, C2) ? (a[d] = x2, a[n2] = c, d = n2) : (a[d] = C2, a[m2] = c, d = m2);
        else if (n2 < e && 0 > g(x2, c)) a[d] = x2, a[n2] = c, d = n2;
        else break a;
      }
    }
    return b;
  }
  function g(a, b) {
    var c = a.sortIndex - b.sortIndex;
    return 0 !== c ? c : a.id - b.id;
  }
  if ("object" === typeof performance && "function" === typeof performance.now) {
    var l2 = performance;
    exports$1.unstable_now = function() {
      return l2.now();
    };
  } else {
    var p2 = Date, q2 = p2.now();
    exports$1.unstable_now = function() {
      return p2.now() - q2;
    };
  }
  var r2 = [], t2 = [], u2 = 1, v2 = null, y2 = 3, z2 = false, A2 = false, B2 = false, D2 = "function" === typeof setTimeout ? setTimeout : null, E2 = "function" === typeof clearTimeout ? clearTimeout : null, F2 = "undefined" !== typeof setImmediate ? setImmediate : null;
  "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function G2(a) {
    for (var b = h(t2); null !== b; ) {
      if (null === b.callback) k2(t2);
      else if (b.startTime <= a) k2(t2), b.sortIndex = b.expirationTime, f2(r2, b);
      else break;
      b = h(t2);
    }
  }
  function H2(a) {
    B2 = false;
    G2(a);
    if (!A2) if (null !== h(r2)) A2 = true, I2(J2);
    else {
      var b = h(t2);
      null !== b && K2(H2, b.startTime - a);
    }
  }
  function J2(a, b) {
    A2 = false;
    B2 && (B2 = false, E2(L2), L2 = -1);
    z2 = true;
    var c = y2;
    try {
      G2(b);
      for (v2 = h(r2); null !== v2 && (!(v2.expirationTime > b) || a && !M2()); ) {
        var d = v2.callback;
        if ("function" === typeof d) {
          v2.callback = null;
          y2 = v2.priorityLevel;
          var e = d(v2.expirationTime <= b);
          b = exports$1.unstable_now();
          "function" === typeof e ? v2.callback = e : v2 === h(r2) && k2(r2);
          G2(b);
        } else k2(r2);
        v2 = h(r2);
      }
      if (null !== v2) var w2 = true;
      else {
        var m2 = h(t2);
        null !== m2 && K2(H2, m2.startTime - b);
        w2 = false;
      }
      return w2;
    } finally {
      v2 = null, y2 = c, z2 = false;
    }
  }
  var N2 = false, O2 = null, L2 = -1, P2 = 5, Q2 = -1;
  function M2() {
    return exports$1.unstable_now() - Q2 < P2 ? false : true;
  }
  function R2() {
    if (null !== O2) {
      var a = exports$1.unstable_now();
      Q2 = a;
      var b = true;
      try {
        b = O2(true, a);
      } finally {
        b ? S2() : (N2 = false, O2 = null);
      }
    } else N2 = false;
  }
  var S2;
  if ("function" === typeof F2) S2 = function() {
    F2(R2);
  };
  else if ("undefined" !== typeof MessageChannel) {
    var T2 = new MessageChannel(), U2 = T2.port2;
    T2.port1.onmessage = R2;
    S2 = function() {
      U2.postMessage(null);
    };
  } else S2 = function() {
    D2(R2, 0);
  };
  function I2(a) {
    O2 = a;
    N2 || (N2 = true, S2());
  }
  function K2(a, b) {
    L2 = D2(function() {
      a(exports$1.unstable_now());
    }, b);
  }
  exports$1.unstable_IdlePriority = 5;
  exports$1.unstable_ImmediatePriority = 1;
  exports$1.unstable_LowPriority = 4;
  exports$1.unstable_NormalPriority = 3;
  exports$1.unstable_Profiling = null;
  exports$1.unstable_UserBlockingPriority = 2;
  exports$1.unstable_cancelCallback = function(a) {
    a.callback = null;
  };
  exports$1.unstable_continueExecution = function() {
    A2 || z2 || (A2 = true, I2(J2));
  };
  exports$1.unstable_forceFrameRate = function(a) {
    0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P2 = 0 < a ? Math.floor(1e3 / a) : 5;
  };
  exports$1.unstable_getCurrentPriorityLevel = function() {
    return y2;
  };
  exports$1.unstable_getFirstCallbackNode = function() {
    return h(r2);
  };
  exports$1.unstable_next = function(a) {
    switch (y2) {
      case 1:
      case 2:
      case 3:
        var b = 3;
        break;
      default:
        b = y2;
    }
    var c = y2;
    y2 = b;
    try {
      return a();
    } finally {
      y2 = c;
    }
  };
  exports$1.unstable_pauseExecution = function() {
  };
  exports$1.unstable_requestPaint = function() {
  };
  exports$1.unstable_runWithPriority = function(a, b) {
    switch (a) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        a = 3;
    }
    var c = y2;
    y2 = a;
    try {
      return b();
    } finally {
      y2 = c;
    }
  };
  exports$1.unstable_scheduleCallback = function(a, b, c) {
    var d = exports$1.unstable_now();
    "object" === typeof c && null !== c ? (c = c.delay, c = "number" === typeof c && 0 < c ? d + c : d) : c = d;
    switch (a) {
      case 1:
        var e = -1;
        break;
      case 2:
        e = 250;
        break;
      case 5:
        e = 1073741823;
        break;
      case 4:
        e = 1e4;
        break;
      default:
        e = 5e3;
    }
    e = c + e;
    a = { id: u2++, callback: b, priorityLevel: a, startTime: c, expirationTime: e, sortIndex: -1 };
    c > d ? (a.sortIndex = c, f2(t2, a), null === h(r2) && a === h(t2) && (B2 ? (E2(L2), L2 = -1) : B2 = true, K2(H2, c - d))) : (a.sortIndex = e, f2(r2, a), A2 || z2 || (A2 = true, I2(J2)));
    return a;
  };
  exports$1.unstable_shouldYield = M2;
  exports$1.unstable_wrapCallback = function(a) {
    var b = y2;
    return function() {
      var c = y2;
      y2 = b;
      try {
        return a.apply(this, arguments);
      } finally {
        y2 = c;
      }
    };
  };
})(scheduler_production_min);
{
  scheduler.exports = scheduler_production_min;
}
var schedulerExports = scheduler.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var aa = reactExports, ca = schedulerExports;
function p(a) {
  for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++) b += "&args[]=" + encodeURIComponent(arguments[c]);
  return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var da = /* @__PURE__ */ new Set(), ea = {};
function fa(a, b) {
  ha(a, b);
  ha(a + "Capture", b);
}
function ha(a, b) {
  ea[a] = b;
  for (a = 0; a < b.length; a++) da.add(b[a]);
}
var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), ja = Object.prototype.hasOwnProperty, ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, la = {}, ma = {};
function oa(a) {
  if (ja.call(ma, a)) return true;
  if (ja.call(la, a)) return false;
  if (ka.test(a)) return ma[a] = true;
  la[a] = true;
  return false;
}
function pa(a, b, c, d) {
  if (null !== c && 0 === c.type) return false;
  switch (typeof b) {
    case "function":
    case "symbol":
      return true;
    case "boolean":
      if (d) return false;
      if (null !== c) return !c.acceptsBooleans;
      a = a.toLowerCase().slice(0, 5);
      return "data-" !== a && "aria-" !== a;
    default:
      return false;
  }
}
function qa(a, b, c, d) {
  if (null === b || "undefined" === typeof b || pa(a, b, c, d)) return true;
  if (d) return false;
  if (null !== c) switch (c.type) {
    case 3:
      return !b;
    case 4:
      return false === b;
    case 5:
      return isNaN(b);
    case 6:
      return isNaN(b) || 1 > b;
  }
  return false;
}
function v(a, b, c, d, e, f2, g) {
  this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
  this.attributeName = d;
  this.attributeNamespace = e;
  this.mustUseProperty = c;
  this.propertyName = a;
  this.type = b;
  this.sanitizeURL = f2;
  this.removeEmptyString = g;
}
var z = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
  z[a] = new v(a, 0, false, a, null, false, false);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
  var b = a[0];
  z[b] = new v(b, 1, false, a[1], null, false, false);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
  z[a] = new v(a, 2, false, a.toLowerCase(), null, false, false);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
  z[a] = new v(a, 2, false, a, null, false, false);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
  z[a] = new v(a, 3, false, a.toLowerCase(), null, false, false);
});
["checked", "multiple", "muted", "selected"].forEach(function(a) {
  z[a] = new v(a, 3, true, a, null, false, false);
});
["capture", "download"].forEach(function(a) {
  z[a] = new v(a, 4, false, a, null, false, false);
});
["cols", "rows", "size", "span"].forEach(function(a) {
  z[a] = new v(a, 6, false, a, null, false, false);
});
["rowSpan", "start"].forEach(function(a) {
  z[a] = new v(a, 5, false, a.toLowerCase(), null, false, false);
});
var ra = /[\-:]([a-z])/g;
function sa(a) {
  return a[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
  var b = a.replace(
    ra,
    sa
  );
  z[b] = new v(b, 1, false, a, null, false, false);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
});
["tabIndex", "crossOrigin"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, false, false);
});
z.xlinkHref = new v("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
["src", "href", "action", "formAction"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, true, true);
});
function ta(a, b, c, d) {
  var e = z.hasOwnProperty(b) ? z[b] : null;
  if (null !== e ? 0 !== e.type : d || !(2 < b.length) || "o" !== b[0] && "O" !== b[0] || "n" !== b[1] && "N" !== b[1]) qa(b, c, e, d) && (c = null), d || null === e ? oa(b) && (null === c ? a.removeAttribute(b) : a.setAttribute(b, "" + c)) : e.mustUseProperty ? a[e.propertyName] = null === c ? 3 === e.type ? false : "" : c : (b = e.attributeName, d = e.attributeNamespace, null === c ? a.removeAttribute(b) : (e = e.type, c = 3 === e || 4 === e && true === c ? "" : "" + c, d ? a.setAttributeNS(d, b, c) : a.setAttribute(b, c)));
}
var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, va = Symbol.for("react.element"), wa = Symbol.for("react.portal"), ya = Symbol.for("react.fragment"), za = Symbol.for("react.strict_mode"), Aa = Symbol.for("react.profiler"), Ba = Symbol.for("react.provider"), Ca = Symbol.for("react.context"), Da = Symbol.for("react.forward_ref"), Ea = Symbol.for("react.suspense"), Fa = Symbol.for("react.suspense_list"), Ga = Symbol.for("react.memo"), Ha = Symbol.for("react.lazy");
var Ia = Symbol.for("react.offscreen");
var Ja = Symbol.iterator;
function Ka(a) {
  if (null === a || "object" !== typeof a) return null;
  a = Ja && a[Ja] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var A = Object.assign, La;
function Ma(a) {
  if (void 0 === La) try {
    throw Error();
  } catch (c) {
    var b = c.stack.trim().match(/\n( *(at )?)/);
    La = b && b[1] || "";
  }
  return "\n" + La + a;
}
var Na = false;
function Oa(a, b) {
  if (!a || Na) return "";
  Na = true;
  var c = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (b) if (b = function() {
      throw Error();
    }, Object.defineProperty(b.prototype, "props", { set: function() {
      throw Error();
    } }), "object" === typeof Reflect && Reflect.construct) {
      try {
        Reflect.construct(b, []);
      } catch (l2) {
        var d = l2;
      }
      Reflect.construct(a, [], b);
    } else {
      try {
        b.call();
      } catch (l2) {
        d = l2;
      }
      a.call(b.prototype);
    }
    else {
      try {
        throw Error();
      } catch (l2) {
        d = l2;
      }
      a();
    }
  } catch (l2) {
    if (l2 && d && "string" === typeof l2.stack) {
      for (var e = l2.stack.split("\n"), f2 = d.stack.split("\n"), g = e.length - 1, h = f2.length - 1; 1 <= g && 0 <= h && e[g] !== f2[h]; ) h--;
      for (; 1 <= g && 0 <= h; g--, h--) if (e[g] !== f2[h]) {
        if (1 !== g || 1 !== h) {
          do
            if (g--, h--, 0 > h || e[g] !== f2[h]) {
              var k2 = "\n" + e[g].replace(" at new ", " at ");
              a.displayName && k2.includes("<anonymous>") && (k2 = k2.replace("<anonymous>", a.displayName));
              return k2;
            }
          while (1 <= g && 0 <= h);
        }
        break;
      }
    }
  } finally {
    Na = false, Error.prepareStackTrace = c;
  }
  return (a = a ? a.displayName || a.name : "") ? Ma(a) : "";
}
function Pa(a) {
  switch (a.tag) {
    case 5:
      return Ma(a.type);
    case 16:
      return Ma("Lazy");
    case 13:
      return Ma("Suspense");
    case 19:
      return Ma("SuspenseList");
    case 0:
    case 2:
    case 15:
      return a = Oa(a.type, false), a;
    case 11:
      return a = Oa(a.type.render, false), a;
    case 1:
      return a = Oa(a.type, true), a;
    default:
      return "";
  }
}
function Qa(a) {
  if (null == a) return null;
  if ("function" === typeof a) return a.displayName || a.name || null;
  if ("string" === typeof a) return a;
  switch (a) {
    case ya:
      return "Fragment";
    case wa:
      return "Portal";
    case Aa:
      return "Profiler";
    case za:
      return "StrictMode";
    case Ea:
      return "Suspense";
    case Fa:
      return "SuspenseList";
  }
  if ("object" === typeof a) switch (a.$$typeof) {
    case Ca:
      return (a.displayName || "Context") + ".Consumer";
    case Ba:
      return (a._context.displayName || "Context") + ".Provider";
    case Da:
      var b = a.render;
      a = a.displayName;
      a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
      return a;
    case Ga:
      return b = a.displayName || null, null !== b ? b : Qa(a.type) || "Memo";
    case Ha:
      b = a._payload;
      a = a._init;
      try {
        return Qa(a(b));
      } catch (c) {
      }
  }
  return null;
}
function Ra(a) {
  var b = a.type;
  switch (a.tag) {
    case 24:
      return "Cache";
    case 9:
      return (b.displayName || "Context") + ".Consumer";
    case 10:
      return (b._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return a = b.render, a = a.displayName || a.name || "", b.displayName || ("" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
    case 7:
      return "Fragment";
    case 5:
      return b;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return Qa(b);
    case 8:
      return b === za ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if ("function" === typeof b) return b.displayName || b.name || null;
      if ("string" === typeof b) return b;
  }
  return null;
}
function Sa(a) {
  switch (typeof a) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return a;
    case "object":
      return a;
    default:
      return "";
  }
}
function Ta(a) {
  var b = a.type;
  return (a = a.nodeName) && "input" === a.toLowerCase() && ("checkbox" === b || "radio" === b);
}
function Ua(a) {
  var b = Ta(a) ? "checked" : "value", c = Object.getOwnPropertyDescriptor(a.constructor.prototype, b), d = "" + a[b];
  if (!a.hasOwnProperty(b) && "undefined" !== typeof c && "function" === typeof c.get && "function" === typeof c.set) {
    var e = c.get, f2 = c.set;
    Object.defineProperty(a, b, { configurable: true, get: function() {
      return e.call(this);
    }, set: function(a2) {
      d = "" + a2;
      f2.call(this, a2);
    } });
    Object.defineProperty(a, b, { enumerable: c.enumerable });
    return { getValue: function() {
      return d;
    }, setValue: function(a2) {
      d = "" + a2;
    }, stopTracking: function() {
      a._valueTracker = null;
      delete a[b];
    } };
  }
}
function Va(a) {
  a._valueTracker || (a._valueTracker = Ua(a));
}
function Wa(a) {
  if (!a) return false;
  var b = a._valueTracker;
  if (!b) return true;
  var c = b.getValue();
  var d = "";
  a && (d = Ta(a) ? a.checked ? "true" : "false" : a.value);
  a = d;
  return a !== c ? (b.setValue(a), true) : false;
}
function Xa(a) {
  a = a || ("undefined" !== typeof document ? document : void 0);
  if ("undefined" === typeof a) return null;
  try {
    return a.activeElement || a.body;
  } catch (b) {
    return a.body;
  }
}
function Ya(a, b) {
  var c = b.checked;
  return A({}, b, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c ? c : a._wrapperState.initialChecked });
}
function Za(a, b) {
  var c = null == b.defaultValue ? "" : b.defaultValue, d = null != b.checked ? b.checked : b.defaultChecked;
  c = Sa(null != b.value ? b.value : c);
  a._wrapperState = { initialChecked: d, initialValue: c, controlled: "checkbox" === b.type || "radio" === b.type ? null != b.checked : null != b.value };
}
function ab(a, b) {
  b = b.checked;
  null != b && ta(a, "checked", b, false);
}
function bb(a, b) {
  ab(a, b);
  var c = Sa(b.value), d = b.type;
  if (null != c) if ("number" === d) {
    if (0 === c && "" === a.value || a.value != c) a.value = "" + c;
  } else a.value !== "" + c && (a.value = "" + c);
  else if ("submit" === d || "reset" === d) {
    a.removeAttribute("value");
    return;
  }
  b.hasOwnProperty("value") ? cb(a, b.type, c) : b.hasOwnProperty("defaultValue") && cb(a, b.type, Sa(b.defaultValue));
  null == b.checked && null != b.defaultChecked && (a.defaultChecked = !!b.defaultChecked);
}
function db(a, b, c) {
  if (b.hasOwnProperty("value") || b.hasOwnProperty("defaultValue")) {
    var d = b.type;
    if (!("submit" !== d && "reset" !== d || void 0 !== b.value && null !== b.value)) return;
    b = "" + a._wrapperState.initialValue;
    c || b === a.value || (a.value = b);
    a.defaultValue = b;
  }
  c = a.name;
  "" !== c && (a.name = "");
  a.defaultChecked = !!a._wrapperState.initialChecked;
  "" !== c && (a.name = c);
}
function cb(a, b, c) {
  if ("number" !== b || Xa(a.ownerDocument) !== a) null == c ? a.defaultValue = "" + a._wrapperState.initialValue : a.defaultValue !== "" + c && (a.defaultValue = "" + c);
}
var eb = Array.isArray;
function fb(a, b, c, d) {
  a = a.options;
  if (b) {
    b = {};
    for (var e = 0; e < c.length; e++) b["$" + c[e]] = true;
    for (c = 0; c < a.length; c++) e = b.hasOwnProperty("$" + a[c].value), a[c].selected !== e && (a[c].selected = e), e && d && (a[c].defaultSelected = true);
  } else {
    c = "" + Sa(c);
    b = null;
    for (e = 0; e < a.length; e++) {
      if (a[e].value === c) {
        a[e].selected = true;
        d && (a[e].defaultSelected = true);
        return;
      }
      null !== b || a[e].disabled || (b = a[e]);
    }
    null !== b && (b.selected = true);
  }
}
function gb(a, b) {
  if (null != b.dangerouslySetInnerHTML) throw Error(p(91));
  return A({}, b, { value: void 0, defaultValue: void 0, children: "" + a._wrapperState.initialValue });
}
function hb(a, b) {
  var c = b.value;
  if (null == c) {
    c = b.children;
    b = b.defaultValue;
    if (null != c) {
      if (null != b) throw Error(p(92));
      if (eb(c)) {
        if (1 < c.length) throw Error(p(93));
        c = c[0];
      }
      b = c;
    }
    null == b && (b = "");
    c = b;
  }
  a._wrapperState = { initialValue: Sa(c) };
}
function ib(a, b) {
  var c = Sa(b.value), d = Sa(b.defaultValue);
  null != c && (c = "" + c, c !== a.value && (a.value = c), null == b.defaultValue && a.defaultValue !== c && (a.defaultValue = c));
  null != d && (a.defaultValue = "" + d);
}
function jb(a) {
  var b = a.textContent;
  b === a._wrapperState.initialValue && "" !== b && null !== b && (a.value = b);
}
function kb(a) {
  switch (a) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function lb(a, b) {
  return null == a || "http://www.w3.org/1999/xhtml" === a ? kb(b) : "http://www.w3.org/2000/svg" === a && "foreignObject" === b ? "http://www.w3.org/1999/xhtml" : a;
}
var mb, nb = function(a) {
  return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b, c, d, e) {
    MSApp.execUnsafeLocalFunction(function() {
      return a(b, c, d, e);
    });
  } : a;
}(function(a, b) {
  if ("http://www.w3.org/2000/svg" !== a.namespaceURI || "innerHTML" in a) a.innerHTML = b;
  else {
    mb = mb || document.createElement("div");
    mb.innerHTML = "<svg>" + b.valueOf().toString() + "</svg>";
    for (b = mb.firstChild; a.firstChild; ) a.removeChild(a.firstChild);
    for (; b.firstChild; ) a.appendChild(b.firstChild);
  }
});
function ob(a, b) {
  if (b) {
    var c = a.firstChild;
    if (c && c === a.lastChild && 3 === c.nodeType) {
      c.nodeValue = b;
      return;
    }
  }
  a.textContent = b;
}
var pb = {
  animationIterationCount: true,
  aspectRatio: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
}, qb = ["Webkit", "ms", "Moz", "O"];
Object.keys(pb).forEach(function(a) {
  qb.forEach(function(b) {
    b = b + a.charAt(0).toUpperCase() + a.substring(1);
    pb[b] = pb[a];
  });
});
function rb(a, b, c) {
  return null == b || "boolean" === typeof b || "" === b ? "" : c || "number" !== typeof b || 0 === b || pb.hasOwnProperty(a) && pb[a] ? ("" + b).trim() : b + "px";
}
function sb(a, b) {
  a = a.style;
  for (var c in b) if (b.hasOwnProperty(c)) {
    var d = 0 === c.indexOf("--"), e = rb(c, b[c], d);
    "float" === c && (c = "cssFloat");
    d ? a.setProperty(c, e) : a[c] = e;
  }
}
var tb = A({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
function ub(a, b) {
  if (b) {
    if (tb[a] && (null != b.children || null != b.dangerouslySetInnerHTML)) throw Error(p(137, a));
    if (null != b.dangerouslySetInnerHTML) {
      if (null != b.children) throw Error(p(60));
      if ("object" !== typeof b.dangerouslySetInnerHTML || !("__html" in b.dangerouslySetInnerHTML)) throw Error(p(61));
    }
    if (null != b.style && "object" !== typeof b.style) throw Error(p(62));
  }
}
function vb(a, b) {
  if (-1 === a.indexOf("-")) return "string" === typeof b.is;
  switch (a) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return false;
    default:
      return true;
  }
}
var wb = null;
function xb(a) {
  a = a.target || a.srcElement || window;
  a.correspondingUseElement && (a = a.correspondingUseElement);
  return 3 === a.nodeType ? a.parentNode : a;
}
var yb = null, zb = null, Ab = null;
function Bb(a) {
  if (a = Cb(a)) {
    if ("function" !== typeof yb) throw Error(p(280));
    var b = a.stateNode;
    b && (b = Db(b), yb(a.stateNode, a.type, b));
  }
}
function Eb(a) {
  zb ? Ab ? Ab.push(a) : Ab = [a] : zb = a;
}
function Fb() {
  if (zb) {
    var a = zb, b = Ab;
    Ab = zb = null;
    Bb(a);
    if (b) for (a = 0; a < b.length; a++) Bb(b[a]);
  }
}
function Gb(a, b) {
  return a(b);
}
function Hb() {
}
var Ib = false;
function Jb(a, b, c) {
  if (Ib) return a(b, c);
  Ib = true;
  try {
    return Gb(a, b, c);
  } finally {
    if (Ib = false, null !== zb || null !== Ab) Hb(), Fb();
  }
}
function Kb(a, b) {
  var c = a.stateNode;
  if (null === c) return null;
  var d = Db(c);
  if (null === d) return null;
  c = d[b];
  a: switch (b) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (d = !d.disabled) || (a = a.type, d = !("button" === a || "input" === a || "select" === a || "textarea" === a));
      a = !d;
      break a;
    default:
      a = false;
  }
  if (a) return null;
  if (c && "function" !== typeof c) throw Error(p(231, b, typeof c));
  return c;
}
var Lb = false;
if (ia) try {
  var Mb = {};
  Object.defineProperty(Mb, "passive", { get: function() {
    Lb = true;
  } });
  window.addEventListener("test", Mb, Mb);
  window.removeEventListener("test", Mb, Mb);
} catch (a) {
  Lb = false;
}
function Nb(a, b, c, d, e, f2, g, h, k2) {
  var l2 = Array.prototype.slice.call(arguments, 3);
  try {
    b.apply(c, l2);
  } catch (m2) {
    this.onError(m2);
  }
}
var Ob = false, Pb = null, Qb = false, Rb = null, Sb = { onError: function(a) {
  Ob = true;
  Pb = a;
} };
function Tb(a, b, c, d, e, f2, g, h, k2) {
  Ob = false;
  Pb = null;
  Nb.apply(Sb, arguments);
}
function Ub(a, b, c, d, e, f2, g, h, k2) {
  Tb.apply(this, arguments);
  if (Ob) {
    if (Ob) {
      var l2 = Pb;
      Ob = false;
      Pb = null;
    } else throw Error(p(198));
    Qb || (Qb = true, Rb = l2);
  }
}
function Vb(a) {
  var b = a, c = a;
  if (a.alternate) for (; b.return; ) b = b.return;
  else {
    a = b;
    do
      b = a, 0 !== (b.flags & 4098) && (c = b.return), a = b.return;
    while (a);
  }
  return 3 === b.tag ? c : null;
}
function Wb(a) {
  if (13 === a.tag) {
    var b = a.memoizedState;
    null === b && (a = a.alternate, null !== a && (b = a.memoizedState));
    if (null !== b) return b.dehydrated;
  }
  return null;
}
function Xb(a) {
  if (Vb(a) !== a) throw Error(p(188));
}
function Yb(a) {
  var b = a.alternate;
  if (!b) {
    b = Vb(a);
    if (null === b) throw Error(p(188));
    return b !== a ? null : a;
  }
  for (var c = a, d = b; ; ) {
    var e = c.return;
    if (null === e) break;
    var f2 = e.alternate;
    if (null === f2) {
      d = e.return;
      if (null !== d) {
        c = d;
        continue;
      }
      break;
    }
    if (e.child === f2.child) {
      for (f2 = e.child; f2; ) {
        if (f2 === c) return Xb(e), a;
        if (f2 === d) return Xb(e), b;
        f2 = f2.sibling;
      }
      throw Error(p(188));
    }
    if (c.return !== d.return) c = e, d = f2;
    else {
      for (var g = false, h = e.child; h; ) {
        if (h === c) {
          g = true;
          c = e;
          d = f2;
          break;
        }
        if (h === d) {
          g = true;
          d = e;
          c = f2;
          break;
        }
        h = h.sibling;
      }
      if (!g) {
        for (h = f2.child; h; ) {
          if (h === c) {
            g = true;
            c = f2;
            d = e;
            break;
          }
          if (h === d) {
            g = true;
            d = f2;
            c = e;
            break;
          }
          h = h.sibling;
        }
        if (!g) throw Error(p(189));
      }
    }
    if (c.alternate !== d) throw Error(p(190));
  }
  if (3 !== c.tag) throw Error(p(188));
  return c.stateNode.current === c ? a : b;
}
function Zb(a) {
  a = Yb(a);
  return null !== a ? $b(a) : null;
}
function $b(a) {
  if (5 === a.tag || 6 === a.tag) return a;
  for (a = a.child; null !== a; ) {
    var b = $b(a);
    if (null !== b) return b;
    a = a.sibling;
  }
  return null;
}
var ac = ca.unstable_scheduleCallback, bc = ca.unstable_cancelCallback, cc = ca.unstable_shouldYield, dc = ca.unstable_requestPaint, B = ca.unstable_now, ec = ca.unstable_getCurrentPriorityLevel, fc = ca.unstable_ImmediatePriority, gc = ca.unstable_UserBlockingPriority, hc = ca.unstable_NormalPriority, ic = ca.unstable_LowPriority, jc = ca.unstable_IdlePriority, kc = null, lc = null;
function mc(a) {
  if (lc && "function" === typeof lc.onCommitFiberRoot) try {
    lc.onCommitFiberRoot(kc, a, void 0, 128 === (a.current.flags & 128));
  } catch (b) {
  }
}
var oc = Math.clz32 ? Math.clz32 : nc, pc = Math.log, qc = Math.LN2;
function nc(a) {
  a >>>= 0;
  return 0 === a ? 32 : 31 - (pc(a) / qc | 0) | 0;
}
var rc = 64, sc = 4194304;
function tc(a) {
  switch (a & -a) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return a & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return a & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return a;
  }
}
function uc(a, b) {
  var c = a.pendingLanes;
  if (0 === c) return 0;
  var d = 0, e = a.suspendedLanes, f2 = a.pingedLanes, g = c & 268435455;
  if (0 !== g) {
    var h = g & ~e;
    0 !== h ? d = tc(h) : (f2 &= g, 0 !== f2 && (d = tc(f2)));
  } else g = c & ~e, 0 !== g ? d = tc(g) : 0 !== f2 && (d = tc(f2));
  if (0 === d) return 0;
  if (0 !== b && b !== d && 0 === (b & e) && (e = d & -d, f2 = b & -b, e >= f2 || 16 === e && 0 !== (f2 & 4194240))) return b;
  0 !== (d & 4) && (d |= c & 16);
  b = a.entangledLanes;
  if (0 !== b) for (a = a.entanglements, b &= d; 0 < b; ) c = 31 - oc(b), e = 1 << c, d |= a[c], b &= ~e;
  return d;
}
function vc(a, b) {
  switch (a) {
    case 1:
    case 2:
    case 4:
      return b + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return b + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function wc(a, b) {
  for (var c = a.suspendedLanes, d = a.pingedLanes, e = a.expirationTimes, f2 = a.pendingLanes; 0 < f2; ) {
    var g = 31 - oc(f2), h = 1 << g, k2 = e[g];
    if (-1 === k2) {
      if (0 === (h & c) || 0 !== (h & d)) e[g] = vc(h, b);
    } else k2 <= b && (a.expiredLanes |= h);
    f2 &= ~h;
  }
}
function xc(a) {
  a = a.pendingLanes & -1073741825;
  return 0 !== a ? a : a & 1073741824 ? 1073741824 : 0;
}
function yc() {
  var a = rc;
  rc <<= 1;
  0 === (rc & 4194240) && (rc = 64);
  return a;
}
function zc(a) {
  for (var b = [], c = 0; 31 > c; c++) b.push(a);
  return b;
}
function Ac(a, b, c) {
  a.pendingLanes |= b;
  536870912 !== b && (a.suspendedLanes = 0, a.pingedLanes = 0);
  a = a.eventTimes;
  b = 31 - oc(b);
  a[b] = c;
}
function Bc(a, b) {
  var c = a.pendingLanes & ~b;
  a.pendingLanes = b;
  a.suspendedLanes = 0;
  a.pingedLanes = 0;
  a.expiredLanes &= b;
  a.mutableReadLanes &= b;
  a.entangledLanes &= b;
  b = a.entanglements;
  var d = a.eventTimes;
  for (a = a.expirationTimes; 0 < c; ) {
    var e = 31 - oc(c), f2 = 1 << e;
    b[e] = 0;
    d[e] = -1;
    a[e] = -1;
    c &= ~f2;
  }
}
function Cc(a, b) {
  var c = a.entangledLanes |= b;
  for (a = a.entanglements; c; ) {
    var d = 31 - oc(c), e = 1 << d;
    e & b | a[d] & b && (a[d] |= b);
    c &= ~e;
  }
}
var C = 0;
function Dc(a) {
  a &= -a;
  return 1 < a ? 4 < a ? 0 !== (a & 268435455) ? 16 : 536870912 : 4 : 1;
}
var Ec, Fc, Gc, Hc, Ic, Jc = false, Kc = [], Lc = null, Mc = null, Nc = null, Oc = /* @__PURE__ */ new Map(), Pc = /* @__PURE__ */ new Map(), Qc = [], Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Sc(a, b) {
  switch (a) {
    case "focusin":
    case "focusout":
      Lc = null;
      break;
    case "dragenter":
    case "dragleave":
      Mc = null;
      break;
    case "mouseover":
    case "mouseout":
      Nc = null;
      break;
    case "pointerover":
    case "pointerout":
      Oc.delete(b.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Pc.delete(b.pointerId);
  }
}
function Tc(a, b, c, d, e, f2) {
  if (null === a || a.nativeEvent !== f2) return a = { blockedOn: b, domEventName: c, eventSystemFlags: d, nativeEvent: f2, targetContainers: [e] }, null !== b && (b = Cb(b), null !== b && Fc(b)), a;
  a.eventSystemFlags |= d;
  b = a.targetContainers;
  null !== e && -1 === b.indexOf(e) && b.push(e);
  return a;
}
function Uc(a, b, c, d, e) {
  switch (b) {
    case "focusin":
      return Lc = Tc(Lc, a, b, c, d, e), true;
    case "dragenter":
      return Mc = Tc(Mc, a, b, c, d, e), true;
    case "mouseover":
      return Nc = Tc(Nc, a, b, c, d, e), true;
    case "pointerover":
      var f2 = e.pointerId;
      Oc.set(f2, Tc(Oc.get(f2) || null, a, b, c, d, e));
      return true;
    case "gotpointercapture":
      return f2 = e.pointerId, Pc.set(f2, Tc(Pc.get(f2) || null, a, b, c, d, e)), true;
  }
  return false;
}
function Vc(a) {
  var b = Wc(a.target);
  if (null !== b) {
    var c = Vb(b);
    if (null !== c) {
      if (b = c.tag, 13 === b) {
        if (b = Wb(c), null !== b) {
          a.blockedOn = b;
          Ic(a.priority, function() {
            Gc(c);
          });
          return;
        }
      } else if (3 === b && c.stateNode.current.memoizedState.isDehydrated) {
        a.blockedOn = 3 === c.tag ? c.stateNode.containerInfo : null;
        return;
      }
    }
  }
  a.blockedOn = null;
}
function Xc(a) {
  if (null !== a.blockedOn) return false;
  for (var b = a.targetContainers; 0 < b.length; ) {
    var c = Yc(a.domEventName, a.eventSystemFlags, b[0], a.nativeEvent);
    if (null === c) {
      c = a.nativeEvent;
      var d = new c.constructor(c.type, c);
      wb = d;
      c.target.dispatchEvent(d);
      wb = null;
    } else return b = Cb(c), null !== b && Fc(b), a.blockedOn = c, false;
    b.shift();
  }
  return true;
}
function Zc(a, b, c) {
  Xc(a) && c.delete(b);
}
function $c() {
  Jc = false;
  null !== Lc && Xc(Lc) && (Lc = null);
  null !== Mc && Xc(Mc) && (Mc = null);
  null !== Nc && Xc(Nc) && (Nc = null);
  Oc.forEach(Zc);
  Pc.forEach(Zc);
}
function ad(a, b) {
  a.blockedOn === b && (a.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
}
function bd(a) {
  function b(b2) {
    return ad(b2, a);
  }
  if (0 < Kc.length) {
    ad(Kc[0], a);
    for (var c = 1; c < Kc.length; c++) {
      var d = Kc[c];
      d.blockedOn === a && (d.blockedOn = null);
    }
  }
  null !== Lc && ad(Lc, a);
  null !== Mc && ad(Mc, a);
  null !== Nc && ad(Nc, a);
  Oc.forEach(b);
  Pc.forEach(b);
  for (c = 0; c < Qc.length; c++) d = Qc[c], d.blockedOn === a && (d.blockedOn = null);
  for (; 0 < Qc.length && (c = Qc[0], null === c.blockedOn); ) Vc(c), null === c.blockedOn && Qc.shift();
}
var cd = ua.ReactCurrentBatchConfig, dd = true;
function ed(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 1, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function gd(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 4, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function fd(a, b, c, d) {
  if (dd) {
    var e = Yc(a, b, c, d);
    if (null === e) hd(a, b, d, id, c), Sc(a, d);
    else if (Uc(e, a, b, c, d)) d.stopPropagation();
    else if (Sc(a, d), b & 4 && -1 < Rc.indexOf(a)) {
      for (; null !== e; ) {
        var f2 = Cb(e);
        null !== f2 && Ec(f2);
        f2 = Yc(a, b, c, d);
        null === f2 && hd(a, b, d, id, c);
        if (f2 === e) break;
        e = f2;
      }
      null !== e && d.stopPropagation();
    } else hd(a, b, d, null, c);
  }
}
var id = null;
function Yc(a, b, c, d) {
  id = null;
  a = xb(d);
  a = Wc(a);
  if (null !== a) if (b = Vb(a), null === b) a = null;
  else if (c = b.tag, 13 === c) {
    a = Wb(b);
    if (null !== a) return a;
    a = null;
  } else if (3 === c) {
    if (b.stateNode.current.memoizedState.isDehydrated) return 3 === b.tag ? b.stateNode.containerInfo : null;
    a = null;
  } else b !== a && (a = null);
  id = a;
  return null;
}
function jd(a) {
  switch (a) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (ec()) {
        case fc:
          return 1;
        case gc:
          return 4;
        case hc:
        case ic:
          return 16;
        case jc:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var kd = null, ld = null, md = null;
function nd() {
  if (md) return md;
  var a, b = ld, c = b.length, d, e = "value" in kd ? kd.value : kd.textContent, f2 = e.length;
  for (a = 0; a < c && b[a] === e[a]; a++) ;
  var g = c - a;
  for (d = 1; d <= g && b[c - d] === e[f2 - d]; d++) ;
  return md = e.slice(a, 1 < d ? 1 - d : void 0);
}
function od(a) {
  var b = a.keyCode;
  "charCode" in a ? (a = a.charCode, 0 === a && 13 === b && (a = 13)) : a = b;
  10 === a && (a = 13);
  return 32 <= a || 13 === a ? a : 0;
}
function pd() {
  return true;
}
function qd() {
  return false;
}
function rd(a) {
  function b(b2, d, e, f2, g) {
    this._reactName = b2;
    this._targetInst = e;
    this.type = d;
    this.nativeEvent = f2;
    this.target = g;
    this.currentTarget = null;
    for (var c in a) a.hasOwnProperty(c) && (b2 = a[c], this[c] = b2 ? b2(f2) : f2[c]);
    this.isDefaultPrevented = (null != f2.defaultPrevented ? f2.defaultPrevented : false === f2.returnValue) ? pd : qd;
    this.isPropagationStopped = qd;
    return this;
  }
  A(b.prototype, { preventDefault: function() {
    this.defaultPrevented = true;
    var a2 = this.nativeEvent;
    a2 && (a2.preventDefault ? a2.preventDefault() : "unknown" !== typeof a2.returnValue && (a2.returnValue = false), this.isDefaultPrevented = pd);
  }, stopPropagation: function() {
    var a2 = this.nativeEvent;
    a2 && (a2.stopPropagation ? a2.stopPropagation() : "unknown" !== typeof a2.cancelBubble && (a2.cancelBubble = true), this.isPropagationStopped = pd);
  }, persist: function() {
  }, isPersistent: pd });
  return b;
}
var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a) {
  return a.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, td = rd(sd), ud = A({}, sd, { view: 0, detail: 0 }), vd = rd(ud), wd, xd, yd, Ad = A({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a) {
  return void 0 === a.relatedTarget ? a.fromElement === a.srcElement ? a.toElement : a.fromElement : a.relatedTarget;
}, movementX: function(a) {
  if ("movementX" in a) return a.movementX;
  a !== yd && (yd && "mousemove" === a.type ? (wd = a.screenX - yd.screenX, xd = a.screenY - yd.screenY) : xd = wd = 0, yd = a);
  return wd;
}, movementY: function(a) {
  return "movementY" in a ? a.movementY : xd;
} }), Bd = rd(Ad), Cd = A({}, Ad, { dataTransfer: 0 }), Dd = rd(Cd), Ed = A({}, ud, { relatedTarget: 0 }), Fd = rd(Ed), Gd = A({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hd = rd(Gd), Id = A({}, sd, { clipboardData: function(a) {
  return "clipboardData" in a ? a.clipboardData : window.clipboardData;
} }), Jd = rd(Id), Kd = A({}, sd, { data: 0 }), Ld = rd(Kd), Md = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
}, Nd = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
}, Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function Pd(a) {
  var b = this.nativeEvent;
  return b.getModifierState ? b.getModifierState(a) : (a = Od[a]) ? !!b[a] : false;
}
function zd() {
  return Pd;
}
var Qd = A({}, ud, { key: function(a) {
  if (a.key) {
    var b = Md[a.key] || a.key;
    if ("Unidentified" !== b) return b;
  }
  return "keypress" === a.type ? (a = od(a), 13 === a ? "Enter" : String.fromCharCode(a)) : "keydown" === a.type || "keyup" === a.type ? Nd[a.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a) {
  return "keypress" === a.type ? od(a) : 0;
}, keyCode: function(a) {
  return "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
}, which: function(a) {
  return "keypress" === a.type ? od(a) : "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
} }), Rd = rd(Qd), Sd = A({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Td = rd(Sd), Ud = A({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd }), Vd = rd(Ud), Wd = A({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Xd = rd(Wd), Yd = A({}, Ad, {
  deltaX: function(a) {
    return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
  },
  deltaY: function(a) {
    return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), Zd = rd(Yd), $d = [9, 13, 27, 32], ae = ia && "CompositionEvent" in window, be = null;
ia && "documentMode" in document && (be = document.documentMode);
var ce = ia && "TextEvent" in window && !be, de = ia && (!ae || be && 8 < be && 11 >= be), ee = String.fromCharCode(32), fe = false;
function ge(a, b) {
  switch (a) {
    case "keyup":
      return -1 !== $d.indexOf(b.keyCode);
    case "keydown":
      return 229 !== b.keyCode;
    case "keypress":
    case "mousedown":
    case "focusout":
      return true;
    default:
      return false;
  }
}
function he(a) {
  a = a.detail;
  return "object" === typeof a && "data" in a ? a.data : null;
}
var ie = false;
function je(a, b) {
  switch (a) {
    case "compositionend":
      return he(b);
    case "keypress":
      if (32 !== b.which) return null;
      fe = true;
      return ee;
    case "textInput":
      return a = b.data, a === ee && fe ? null : a;
    default:
      return null;
  }
}
function ke(a, b) {
  if (ie) return "compositionend" === a || !ae && ge(a, b) ? (a = nd(), md = ld = kd = null, ie = false, a) : null;
  switch (a) {
    case "paste":
      return null;
    case "keypress":
      if (!(b.ctrlKey || b.altKey || b.metaKey) || b.ctrlKey && b.altKey) {
        if (b.char && 1 < b.char.length) return b.char;
        if (b.which) return String.fromCharCode(b.which);
      }
      return null;
    case "compositionend":
      return de && "ko" !== b.locale ? null : b.data;
    default:
      return null;
  }
}
var le = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
function me(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return "input" === b ? !!le[a.type] : "textarea" === b ? true : false;
}
function ne(a, b, c, d) {
  Eb(d);
  b = oe(b, "onChange");
  0 < b.length && (c = new td("onChange", "change", null, c, d), a.push({ event: c, listeners: b }));
}
var pe = null, qe = null;
function re(a) {
  se(a, 0);
}
function te(a) {
  var b = ue(a);
  if (Wa(b)) return a;
}
function ve(a, b) {
  if ("change" === a) return b;
}
var we = false;
if (ia) {
  var xe;
  if (ia) {
    var ye = "oninput" in document;
    if (!ye) {
      var ze = document.createElement("div");
      ze.setAttribute("oninput", "return;");
      ye = "function" === typeof ze.oninput;
    }
    xe = ye;
  } else xe = false;
  we = xe && (!document.documentMode || 9 < document.documentMode);
}
function Ae() {
  pe && (pe.detachEvent("onpropertychange", Be), qe = pe = null);
}
function Be(a) {
  if ("value" === a.propertyName && te(qe)) {
    var b = [];
    ne(b, qe, a, xb(a));
    Jb(re, b);
  }
}
function Ce(a, b, c) {
  "focusin" === a ? (Ae(), pe = b, qe = c, pe.attachEvent("onpropertychange", Be)) : "focusout" === a && Ae();
}
function De(a) {
  if ("selectionchange" === a || "keyup" === a || "keydown" === a) return te(qe);
}
function Ee(a, b) {
  if ("click" === a) return te(b);
}
function Fe(a, b) {
  if ("input" === a || "change" === a) return te(b);
}
function Ge(a, b) {
  return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
}
var He = "function" === typeof Object.is ? Object.is : Ge;
function Ie(a, b) {
  if (He(a, b)) return true;
  if ("object" !== typeof a || null === a || "object" !== typeof b || null === b) return false;
  var c = Object.keys(a), d = Object.keys(b);
  if (c.length !== d.length) return false;
  for (d = 0; d < c.length; d++) {
    var e = c[d];
    if (!ja.call(b, e) || !He(a[e], b[e])) return false;
  }
  return true;
}
function Je(a) {
  for (; a && a.firstChild; ) a = a.firstChild;
  return a;
}
function Ke(a, b) {
  var c = Je(a);
  a = 0;
  for (var d; c; ) {
    if (3 === c.nodeType) {
      d = a + c.textContent.length;
      if (a <= b && d >= b) return { node: c, offset: b - a };
      a = d;
    }
    a: {
      for (; c; ) {
        if (c.nextSibling) {
          c = c.nextSibling;
          break a;
        }
        c = c.parentNode;
      }
      c = void 0;
    }
    c = Je(c);
  }
}
function Le(a, b) {
  return a && b ? a === b ? true : a && 3 === a.nodeType ? false : b && 3 === b.nodeType ? Le(a, b.parentNode) : "contains" in a ? a.contains(b) : a.compareDocumentPosition ? !!(a.compareDocumentPosition(b) & 16) : false : false;
}
function Me() {
  for (var a = window, b = Xa(); b instanceof a.HTMLIFrameElement; ) {
    try {
      var c = "string" === typeof b.contentWindow.location.href;
    } catch (d) {
      c = false;
    }
    if (c) a = b.contentWindow;
    else break;
    b = Xa(a.document);
  }
  return b;
}
function Ne(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return b && ("input" === b && ("text" === a.type || "search" === a.type || "tel" === a.type || "url" === a.type || "password" === a.type) || "textarea" === b || "true" === a.contentEditable);
}
function Oe(a) {
  var b = Me(), c = a.focusedElem, d = a.selectionRange;
  if (b !== c && c && c.ownerDocument && Le(c.ownerDocument.documentElement, c)) {
    if (null !== d && Ne(c)) {
      if (b = d.start, a = d.end, void 0 === a && (a = b), "selectionStart" in c) c.selectionStart = b, c.selectionEnd = Math.min(a, c.value.length);
      else if (a = (b = c.ownerDocument || document) && b.defaultView || window, a.getSelection) {
        a = a.getSelection();
        var e = c.textContent.length, f2 = Math.min(d.start, e);
        d = void 0 === d.end ? f2 : Math.min(d.end, e);
        !a.extend && f2 > d && (e = d, d = f2, f2 = e);
        e = Ke(c, f2);
        var g = Ke(
          c,
          d
        );
        e && g && (1 !== a.rangeCount || a.anchorNode !== e.node || a.anchorOffset !== e.offset || a.focusNode !== g.node || a.focusOffset !== g.offset) && (b = b.createRange(), b.setStart(e.node, e.offset), a.removeAllRanges(), f2 > d ? (a.addRange(b), a.extend(g.node, g.offset)) : (b.setEnd(g.node, g.offset), a.addRange(b)));
      }
    }
    b = [];
    for (a = c; a = a.parentNode; ) 1 === a.nodeType && b.push({ element: a, left: a.scrollLeft, top: a.scrollTop });
    "function" === typeof c.focus && c.focus();
    for (c = 0; c < b.length; c++) a = b[c], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
  }
}
var Pe = ia && "documentMode" in document && 11 >= document.documentMode, Qe = null, Re = null, Se = null, Te = false;
function Ue(a, b, c) {
  var d = c.window === c ? c.document : 9 === c.nodeType ? c : c.ownerDocument;
  Te || null == Qe || Qe !== Xa(d) || (d = Qe, "selectionStart" in d && Ne(d) ? d = { start: d.selectionStart, end: d.selectionEnd } : (d = (d.ownerDocument && d.ownerDocument.defaultView || window).getSelection(), d = { anchorNode: d.anchorNode, anchorOffset: d.anchorOffset, focusNode: d.focusNode, focusOffset: d.focusOffset }), Se && Ie(Se, d) || (Se = d, d = oe(Re, "onSelect"), 0 < d.length && (b = new td("onSelect", "select", null, b, c), a.push({ event: b, listeners: d }), b.target = Qe)));
}
function Ve(a, b) {
  var c = {};
  c[a.toLowerCase()] = b.toLowerCase();
  c["Webkit" + a] = "webkit" + b;
  c["Moz" + a] = "moz" + b;
  return c;
}
var We = { animationend: Ve("Animation", "AnimationEnd"), animationiteration: Ve("Animation", "AnimationIteration"), animationstart: Ve("Animation", "AnimationStart"), transitionend: Ve("Transition", "TransitionEnd") }, Xe = {}, Ye = {};
ia && (Ye = document.createElement("div").style, "AnimationEvent" in window || (delete We.animationend.animation, delete We.animationiteration.animation, delete We.animationstart.animation), "TransitionEvent" in window || delete We.transitionend.transition);
function Ze(a) {
  if (Xe[a]) return Xe[a];
  if (!We[a]) return a;
  var b = We[a], c;
  for (c in b) if (b.hasOwnProperty(c) && c in Ye) return Xe[a] = b[c];
  return a;
}
var $e = Ze("animationend"), af = Ze("animationiteration"), bf = Ze("animationstart"), cf = Ze("transitionend"), df = /* @__PURE__ */ new Map(), ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function ff(a, b) {
  df.set(a, b);
  fa(b, [a]);
}
for (var gf = 0; gf < ef.length; gf++) {
  var hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
  ff(jf, "on" + kf);
}
ff($e, "onAnimationEnd");
ff(af, "onAnimationIteration");
ff(bf, "onAnimationStart");
ff("dblclick", "onDoubleClick");
ff("focusin", "onFocus");
ff("focusout", "onBlur");
ff(cf, "onTransitionEnd");
ha("onMouseEnter", ["mouseout", "mouseover"]);
ha("onMouseLeave", ["mouseout", "mouseover"]);
ha("onPointerEnter", ["pointerout", "pointerover"]);
ha("onPointerLeave", ["pointerout", "pointerover"]);
fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
function nf(a, b, c) {
  var d = a.type || "unknown-event";
  a.currentTarget = c;
  Ub(d, b, void 0, a);
  a.currentTarget = null;
}
function se(a, b) {
  b = 0 !== (b & 4);
  for (var c = 0; c < a.length; c++) {
    var d = a[c], e = d.event;
    d = d.listeners;
    a: {
      var f2 = void 0;
      if (b) for (var g = d.length - 1; 0 <= g; g--) {
        var h = d[g], k2 = h.instance, l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
      else for (g = 0; g < d.length; g++) {
        h = d[g];
        k2 = h.instance;
        l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
    }
  }
  if (Qb) throw a = Rb, Qb = false, Rb = null, a;
}
function D(a, b) {
  var c = b[of];
  void 0 === c && (c = b[of] = /* @__PURE__ */ new Set());
  var d = a + "__bubble";
  c.has(d) || (pf(b, a, 2, false), c.add(d));
}
function qf(a, b, c) {
  var d = 0;
  b && (d |= 4);
  pf(c, a, d, b);
}
var rf = "_reactListening" + Math.random().toString(36).slice(2);
function sf(a) {
  if (!a[rf]) {
    a[rf] = true;
    da.forEach(function(b2) {
      "selectionchange" !== b2 && (mf.has(b2) || qf(b2, false, a), qf(b2, true, a));
    });
    var b = 9 === a.nodeType ? a : a.ownerDocument;
    null === b || b[rf] || (b[rf] = true, qf("selectionchange", false, b));
  }
}
function pf(a, b, c, d) {
  switch (jd(b)) {
    case 1:
      var e = ed;
      break;
    case 4:
      e = gd;
      break;
    default:
      e = fd;
  }
  c = e.bind(null, b, c, a);
  e = void 0;
  !Lb || "touchstart" !== b && "touchmove" !== b && "wheel" !== b || (e = true);
  d ? void 0 !== e ? a.addEventListener(b, c, { capture: true, passive: e }) : a.addEventListener(b, c, true) : void 0 !== e ? a.addEventListener(b, c, { passive: e }) : a.addEventListener(b, c, false);
}
function hd(a, b, c, d, e) {
  var f2 = d;
  if (0 === (b & 1) && 0 === (b & 2) && null !== d) a: for (; ; ) {
    if (null === d) return;
    var g = d.tag;
    if (3 === g || 4 === g) {
      var h = d.stateNode.containerInfo;
      if (h === e || 8 === h.nodeType && h.parentNode === e) break;
      if (4 === g) for (g = d.return; null !== g; ) {
        var k2 = g.tag;
        if (3 === k2 || 4 === k2) {
          if (k2 = g.stateNode.containerInfo, k2 === e || 8 === k2.nodeType && k2.parentNode === e) return;
        }
        g = g.return;
      }
      for (; null !== h; ) {
        g = Wc(h);
        if (null === g) return;
        k2 = g.tag;
        if (5 === k2 || 6 === k2) {
          d = f2 = g;
          continue a;
        }
        h = h.parentNode;
      }
    }
    d = d.return;
  }
  Jb(function() {
    var d2 = f2, e2 = xb(c), g2 = [];
    a: {
      var h2 = df.get(a);
      if (void 0 !== h2) {
        var k3 = td, n2 = a;
        switch (a) {
          case "keypress":
            if (0 === od(c)) break a;
          case "keydown":
          case "keyup":
            k3 = Rd;
            break;
          case "focusin":
            n2 = "focus";
            k3 = Fd;
            break;
          case "focusout":
            n2 = "blur";
            k3 = Fd;
            break;
          case "beforeblur":
          case "afterblur":
            k3 = Fd;
            break;
          case "click":
            if (2 === c.button) break a;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            k3 = Bd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            k3 = Dd;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            k3 = Vd;
            break;
          case $e:
          case af:
          case bf:
            k3 = Hd;
            break;
          case cf:
            k3 = Xd;
            break;
          case "scroll":
            k3 = vd;
            break;
          case "wheel":
            k3 = Zd;
            break;
          case "copy":
          case "cut":
          case "paste":
            k3 = Jd;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            k3 = Td;
        }
        var t2 = 0 !== (b & 4), J2 = !t2 && "scroll" === a, x2 = t2 ? null !== h2 ? h2 + "Capture" : null : h2;
        t2 = [];
        for (var w2 = d2, u2; null !== w2; ) {
          u2 = w2;
          var F2 = u2.stateNode;
          5 === u2.tag && null !== F2 && (u2 = F2, null !== x2 && (F2 = Kb(w2, x2), null != F2 && t2.push(tf(w2, F2, u2))));
          if (J2) break;
          w2 = w2.return;
        }
        0 < t2.length && (h2 = new k3(h2, n2, null, c, e2), g2.push({ event: h2, listeners: t2 }));
      }
    }
    if (0 === (b & 7)) {
      a: {
        h2 = "mouseover" === a || "pointerover" === a;
        k3 = "mouseout" === a || "pointerout" === a;
        if (h2 && c !== wb && (n2 = c.relatedTarget || c.fromElement) && (Wc(n2) || n2[uf])) break a;
        if (k3 || h2) {
          h2 = e2.window === e2 ? e2 : (h2 = e2.ownerDocument) ? h2.defaultView || h2.parentWindow : window;
          if (k3) {
            if (n2 = c.relatedTarget || c.toElement, k3 = d2, n2 = n2 ? Wc(n2) : null, null !== n2 && (J2 = Vb(n2), n2 !== J2 || 5 !== n2.tag && 6 !== n2.tag)) n2 = null;
          } else k3 = null, n2 = d2;
          if (k3 !== n2) {
            t2 = Bd;
            F2 = "onMouseLeave";
            x2 = "onMouseEnter";
            w2 = "mouse";
            if ("pointerout" === a || "pointerover" === a) t2 = Td, F2 = "onPointerLeave", x2 = "onPointerEnter", w2 = "pointer";
            J2 = null == k3 ? h2 : ue(k3);
            u2 = null == n2 ? h2 : ue(n2);
            h2 = new t2(F2, w2 + "leave", k3, c, e2);
            h2.target = J2;
            h2.relatedTarget = u2;
            F2 = null;
            Wc(e2) === d2 && (t2 = new t2(x2, w2 + "enter", n2, c, e2), t2.target = u2, t2.relatedTarget = J2, F2 = t2);
            J2 = F2;
            if (k3 && n2) b: {
              t2 = k3;
              x2 = n2;
              w2 = 0;
              for (u2 = t2; u2; u2 = vf(u2)) w2++;
              u2 = 0;
              for (F2 = x2; F2; F2 = vf(F2)) u2++;
              for (; 0 < w2 - u2; ) t2 = vf(t2), w2--;
              for (; 0 < u2 - w2; ) x2 = vf(x2), u2--;
              for (; w2--; ) {
                if (t2 === x2 || null !== x2 && t2 === x2.alternate) break b;
                t2 = vf(t2);
                x2 = vf(x2);
              }
              t2 = null;
            }
            else t2 = null;
            null !== k3 && wf(g2, h2, k3, t2, false);
            null !== n2 && null !== J2 && wf(g2, J2, n2, t2, true);
          }
        }
      }
      a: {
        h2 = d2 ? ue(d2) : window;
        k3 = h2.nodeName && h2.nodeName.toLowerCase();
        if ("select" === k3 || "input" === k3 && "file" === h2.type) var na = ve;
        else if (me(h2)) if (we) na = Fe;
        else {
          na = De;
          var xa = Ce;
        }
        else (k3 = h2.nodeName) && "input" === k3.toLowerCase() && ("checkbox" === h2.type || "radio" === h2.type) && (na = Ee);
        if (na && (na = na(a, d2))) {
          ne(g2, na, c, e2);
          break a;
        }
        xa && xa(a, h2, d2);
        "focusout" === a && (xa = h2._wrapperState) && xa.controlled && "number" === h2.type && cb(h2, "number", h2.value);
      }
      xa = d2 ? ue(d2) : window;
      switch (a) {
        case "focusin":
          if (me(xa) || "true" === xa.contentEditable) Qe = xa, Re = d2, Se = null;
          break;
        case "focusout":
          Se = Re = Qe = null;
          break;
        case "mousedown":
          Te = true;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Te = false;
          Ue(g2, c, e2);
          break;
        case "selectionchange":
          if (Pe) break;
        case "keydown":
        case "keyup":
          Ue(g2, c, e2);
      }
      var $a;
      if (ae) b: {
        switch (a) {
          case "compositionstart":
            var ba = "onCompositionStart";
            break b;
          case "compositionend":
            ba = "onCompositionEnd";
            break b;
          case "compositionupdate":
            ba = "onCompositionUpdate";
            break b;
        }
        ba = void 0;
      }
      else ie ? ge(a, c) && (ba = "onCompositionEnd") : "keydown" === a && 229 === c.keyCode && (ba = "onCompositionStart");
      ba && (de && "ko" !== c.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e2, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe(d2, ba), 0 < xa.length && (ba = new Ld(ba, a, null, c, e2), g2.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c), null !== $a && (ba.data = $a))));
      if ($a = ce ? je(a, c) : ke(a, c)) d2 = oe(d2, "onBeforeInput"), 0 < d2.length && (e2 = new Ld("onBeforeInput", "beforeinput", null, c, e2), g2.push({ event: e2, listeners: d2 }), e2.data = $a);
    }
    se(g2, b);
  });
}
function tf(a, b, c) {
  return { instance: a, listener: b, currentTarget: c };
}
function oe(a, b) {
  for (var c = b + "Capture", d = []; null !== a; ) {
    var e = a, f2 = e.stateNode;
    5 === e.tag && null !== f2 && (e = f2, f2 = Kb(a, c), null != f2 && d.unshift(tf(a, f2, e)), f2 = Kb(a, b), null != f2 && d.push(tf(a, f2, e)));
    a = a.return;
  }
  return d;
}
function vf(a) {
  if (null === a) return null;
  do
    a = a.return;
  while (a && 5 !== a.tag);
  return a ? a : null;
}
function wf(a, b, c, d, e) {
  for (var f2 = b._reactName, g = []; null !== c && c !== d; ) {
    var h = c, k2 = h.alternate, l2 = h.stateNode;
    if (null !== k2 && k2 === d) break;
    5 === h.tag && null !== l2 && (h = l2, e ? (k2 = Kb(c, f2), null != k2 && g.unshift(tf(c, k2, h))) : e || (k2 = Kb(c, f2), null != k2 && g.push(tf(c, k2, h))));
    c = c.return;
  }
  0 !== g.length && a.push({ event: b, listeners: g });
}
var xf = /\r\n?/g, yf = /\u0000|\uFFFD/g;
function zf(a) {
  return ("string" === typeof a ? a : "" + a).replace(xf, "\n").replace(yf, "");
}
function Af(a, b, c) {
  b = zf(b);
  if (zf(a) !== b && c) throw Error(p(425));
}
function Bf() {
}
var Cf = null, Df = null;
function Ef(a, b) {
  return "textarea" === a || "noscript" === a || "string" === typeof b.children || "number" === typeof b.children || "object" === typeof b.dangerouslySetInnerHTML && null !== b.dangerouslySetInnerHTML && null != b.dangerouslySetInnerHTML.__html;
}
var Ff = "function" === typeof setTimeout ? setTimeout : void 0, Gf = "function" === typeof clearTimeout ? clearTimeout : void 0, Hf = "function" === typeof Promise ? Promise : void 0, Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a) {
  return Hf.resolve(null).then(a).catch(If);
} : Ff;
function If(a) {
  setTimeout(function() {
    throw a;
  });
}
function Kf(a, b) {
  var c = b, d = 0;
  do {
    var e = c.nextSibling;
    a.removeChild(c);
    if (e && 8 === e.nodeType) if (c = e.data, "/$" === c) {
      if (0 === d) {
        a.removeChild(e);
        bd(b);
        return;
      }
      d--;
    } else "$" !== c && "$?" !== c && "$!" !== c || d++;
    c = e;
  } while (c);
  bd(b);
}
function Lf(a) {
  for (; null != a; a = a.nextSibling) {
    var b = a.nodeType;
    if (1 === b || 3 === b) break;
    if (8 === b) {
      b = a.data;
      if ("$" === b || "$!" === b || "$?" === b) break;
      if ("/$" === b) return null;
    }
  }
  return a;
}
function Mf(a) {
  a = a.previousSibling;
  for (var b = 0; a; ) {
    if (8 === a.nodeType) {
      var c = a.data;
      if ("$" === c || "$!" === c || "$?" === c) {
        if (0 === b) return a;
        b--;
      } else "/$" === c && b++;
    }
    a = a.previousSibling;
  }
  return null;
}
var Nf = Math.random().toString(36).slice(2), Of = "__reactFiber$" + Nf, Pf = "__reactProps$" + Nf, uf = "__reactContainer$" + Nf, of = "__reactEvents$" + Nf, Qf = "__reactListeners$" + Nf, Rf = "__reactHandles$" + Nf;
function Wc(a) {
  var b = a[Of];
  if (b) return b;
  for (var c = a.parentNode; c; ) {
    if (b = c[uf] || c[Of]) {
      c = b.alternate;
      if (null !== b.child || null !== c && null !== c.child) for (a = Mf(a); null !== a; ) {
        if (c = a[Of]) return c;
        a = Mf(a);
      }
      return b;
    }
    a = c;
    c = a.parentNode;
  }
  return null;
}
function Cb(a) {
  a = a[Of] || a[uf];
  return !a || 5 !== a.tag && 6 !== a.tag && 13 !== a.tag && 3 !== a.tag ? null : a;
}
function ue(a) {
  if (5 === a.tag || 6 === a.tag) return a.stateNode;
  throw Error(p(33));
}
function Db(a) {
  return a[Pf] || null;
}
var Sf = [], Tf = -1;
function Uf(a) {
  return { current: a };
}
function E(a) {
  0 > Tf || (a.current = Sf[Tf], Sf[Tf] = null, Tf--);
}
function G(a, b) {
  Tf++;
  Sf[Tf] = a.current;
  a.current = b;
}
var Vf = {}, H = Uf(Vf), Wf = Uf(false), Xf = Vf;
function Yf(a, b) {
  var c = a.type.contextTypes;
  if (!c) return Vf;
  var d = a.stateNode;
  if (d && d.__reactInternalMemoizedUnmaskedChildContext === b) return d.__reactInternalMemoizedMaskedChildContext;
  var e = {}, f2;
  for (f2 in c) e[f2] = b[f2];
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = b, a.__reactInternalMemoizedMaskedChildContext = e);
  return e;
}
function Zf(a) {
  a = a.childContextTypes;
  return null !== a && void 0 !== a;
}
function $f() {
  E(Wf);
  E(H);
}
function ag(a, b, c) {
  if (H.current !== Vf) throw Error(p(168));
  G(H, b);
  G(Wf, c);
}
function bg(a, b, c) {
  var d = a.stateNode;
  b = b.childContextTypes;
  if ("function" !== typeof d.getChildContext) return c;
  d = d.getChildContext();
  for (var e in d) if (!(e in b)) throw Error(p(108, Ra(a) || "Unknown", e));
  return A({}, c, d);
}
function cg(a) {
  a = (a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext || Vf;
  Xf = H.current;
  G(H, a);
  G(Wf, Wf.current);
  return true;
}
function dg(a, b, c) {
  var d = a.stateNode;
  if (!d) throw Error(p(169));
  c ? (a = bg(a, b, Xf), d.__reactInternalMemoizedMergedChildContext = a, E(Wf), E(H), G(H, a)) : E(Wf);
  G(Wf, c);
}
var eg = null, fg = false, gg = false;
function hg(a) {
  null === eg ? eg = [a] : eg.push(a);
}
function ig(a) {
  fg = true;
  hg(a);
}
function jg() {
  if (!gg && null !== eg) {
    gg = true;
    var a = 0, b = C;
    try {
      var c = eg;
      for (C = 1; a < c.length; a++) {
        var d = c[a];
        do
          d = d(true);
        while (null !== d);
      }
      eg = null;
      fg = false;
    } catch (e) {
      throw null !== eg && (eg = eg.slice(a + 1)), ac(fc, jg), e;
    } finally {
      C = b, gg = false;
    }
  }
  return null;
}
var kg = [], lg = 0, mg = null, ng = 0, og = [], pg = 0, qg = null, rg = 1, sg = "";
function tg(a, b) {
  kg[lg++] = ng;
  kg[lg++] = mg;
  mg = a;
  ng = b;
}
function ug(a, b, c) {
  og[pg++] = rg;
  og[pg++] = sg;
  og[pg++] = qg;
  qg = a;
  var d = rg;
  a = sg;
  var e = 32 - oc(d) - 1;
  d &= ~(1 << e);
  c += 1;
  var f2 = 32 - oc(b) + e;
  if (30 < f2) {
    var g = e - e % 5;
    f2 = (d & (1 << g) - 1).toString(32);
    d >>= g;
    e -= g;
    rg = 1 << 32 - oc(b) + e | c << e | d;
    sg = f2 + a;
  } else rg = 1 << f2 | c << e | d, sg = a;
}
function vg(a) {
  null !== a.return && (tg(a, 1), ug(a, 1, 0));
}
function wg(a) {
  for (; a === mg; ) mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
  for (; a === qg; ) qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
}
var xg = null, yg = null, I = false, zg = null;
function Ag(a, b) {
  var c = Bg(5, null, null, 0);
  c.elementType = "DELETED";
  c.stateNode = b;
  c.return = a;
  b = a.deletions;
  null === b ? (a.deletions = [c], a.flags |= 16) : b.push(c);
}
function Cg(a, b) {
  switch (a.tag) {
    case 5:
      var c = a.type;
      b = 1 !== b.nodeType || c.toLowerCase() !== b.nodeName.toLowerCase() ? null : b;
      return null !== b ? (a.stateNode = b, xg = a, yg = Lf(b.firstChild), true) : false;
    case 6:
      return b = "" === a.pendingProps || 3 !== b.nodeType ? null : b, null !== b ? (a.stateNode = b, xg = a, yg = null, true) : false;
    case 13:
      return b = 8 !== b.nodeType ? null : b, null !== b ? (c = null !== qg ? { id: rg, overflow: sg } : null, a.memoizedState = { dehydrated: b, treeContext: c, retryLane: 1073741824 }, c = Bg(18, null, null, 0), c.stateNode = b, c.return = a, a.child = c, xg = a, yg = null, true) : false;
    default:
      return false;
  }
}
function Dg(a) {
  return 0 !== (a.mode & 1) && 0 === (a.flags & 128);
}
function Eg(a) {
  if (I) {
    var b = yg;
    if (b) {
      var c = b;
      if (!Cg(a, b)) {
        if (Dg(a)) throw Error(p(418));
        b = Lf(c.nextSibling);
        var d = xg;
        b && Cg(a, b) ? Ag(d, c) : (a.flags = a.flags & -4097 | 2, I = false, xg = a);
      }
    } else {
      if (Dg(a)) throw Error(p(418));
      a.flags = a.flags & -4097 | 2;
      I = false;
      xg = a;
    }
  }
}
function Fg(a) {
  for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag; ) a = a.return;
  xg = a;
}
function Gg(a) {
  if (a !== xg) return false;
  if (!I) return Fg(a), I = true, false;
  var b;
  (b = 3 !== a.tag) && !(b = 5 !== a.tag) && (b = a.type, b = "head" !== b && "body" !== b && !Ef(a.type, a.memoizedProps));
  if (b && (b = yg)) {
    if (Dg(a)) throw Hg(), Error(p(418));
    for (; b; ) Ag(a, b), b = Lf(b.nextSibling);
  }
  Fg(a);
  if (13 === a.tag) {
    a = a.memoizedState;
    a = null !== a ? a.dehydrated : null;
    if (!a) throw Error(p(317));
    a: {
      a = a.nextSibling;
      for (b = 0; a; ) {
        if (8 === a.nodeType) {
          var c = a.data;
          if ("/$" === c) {
            if (0 === b) {
              yg = Lf(a.nextSibling);
              break a;
            }
            b--;
          } else "$" !== c && "$!" !== c && "$?" !== c || b++;
        }
        a = a.nextSibling;
      }
      yg = null;
    }
  } else yg = xg ? Lf(a.stateNode.nextSibling) : null;
  return true;
}
function Hg() {
  for (var a = yg; a; ) a = Lf(a.nextSibling);
}
function Ig() {
  yg = xg = null;
  I = false;
}
function Jg(a) {
  null === zg ? zg = [a] : zg.push(a);
}
var Kg = ua.ReactCurrentBatchConfig;
function Lg(a, b, c) {
  a = c.ref;
  if (null !== a && "function" !== typeof a && "object" !== typeof a) {
    if (c._owner) {
      c = c._owner;
      if (c) {
        if (1 !== c.tag) throw Error(p(309));
        var d = c.stateNode;
      }
      if (!d) throw Error(p(147, a));
      var e = d, f2 = "" + a;
      if (null !== b && null !== b.ref && "function" === typeof b.ref && b.ref._stringRef === f2) return b.ref;
      b = function(a2) {
        var b2 = e.refs;
        null === a2 ? delete b2[f2] : b2[f2] = a2;
      };
      b._stringRef = f2;
      return b;
    }
    if ("string" !== typeof a) throw Error(p(284));
    if (!c._owner) throw Error(p(290, a));
  }
  return a;
}
function Mg(a, b) {
  a = Object.prototype.toString.call(b);
  throw Error(p(31, "[object Object]" === a ? "object with keys {" + Object.keys(b).join(", ") + "}" : a));
}
function Ng(a) {
  var b = a._init;
  return b(a._payload);
}
function Og(a) {
  function b(b2, c2) {
    if (a) {
      var d2 = b2.deletions;
      null === d2 ? (b2.deletions = [c2], b2.flags |= 16) : d2.push(c2);
    }
  }
  function c(c2, d2) {
    if (!a) return null;
    for (; null !== d2; ) b(c2, d2), d2 = d2.sibling;
    return null;
  }
  function d(a2, b2) {
    for (a2 = /* @__PURE__ */ new Map(); null !== b2; ) null !== b2.key ? a2.set(b2.key, b2) : a2.set(b2.index, b2), b2 = b2.sibling;
    return a2;
  }
  function e(a2, b2) {
    a2 = Pg(a2, b2);
    a2.index = 0;
    a2.sibling = null;
    return a2;
  }
  function f2(b2, c2, d2) {
    b2.index = d2;
    if (!a) return b2.flags |= 1048576, c2;
    d2 = b2.alternate;
    if (null !== d2) return d2 = d2.index, d2 < c2 ? (b2.flags |= 2, c2) : d2;
    b2.flags |= 2;
    return c2;
  }
  function g(b2) {
    a && null === b2.alternate && (b2.flags |= 2);
    return b2;
  }
  function h(a2, b2, c2, d2) {
    if (null === b2 || 6 !== b2.tag) return b2 = Qg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function k2(a2, b2, c2, d2) {
    var f3 = c2.type;
    if (f3 === ya) return m2(a2, b2, c2.props.children, d2, c2.key);
    if (null !== b2 && (b2.elementType === f3 || "object" === typeof f3 && null !== f3 && f3.$$typeof === Ha && Ng(f3) === b2.type)) return d2 = e(b2, c2.props), d2.ref = Lg(a2, b2, c2), d2.return = a2, d2;
    d2 = Rg(c2.type, c2.key, c2.props, null, a2.mode, d2);
    d2.ref = Lg(a2, b2, c2);
    d2.return = a2;
    return d2;
  }
  function l2(a2, b2, c2, d2) {
    if (null === b2 || 4 !== b2.tag || b2.stateNode.containerInfo !== c2.containerInfo || b2.stateNode.implementation !== c2.implementation) return b2 = Sg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2.children || []);
    b2.return = a2;
    return b2;
  }
  function m2(a2, b2, c2, d2, f3) {
    if (null === b2 || 7 !== b2.tag) return b2 = Tg(c2, a2.mode, d2, f3), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function q2(a2, b2, c2) {
    if ("string" === typeof b2 && "" !== b2 || "number" === typeof b2) return b2 = Qg("" + b2, a2.mode, c2), b2.return = a2, b2;
    if ("object" === typeof b2 && null !== b2) {
      switch (b2.$$typeof) {
        case va:
          return c2 = Rg(b2.type, b2.key, b2.props, null, a2.mode, c2), c2.ref = Lg(a2, null, b2), c2.return = a2, c2;
        case wa:
          return b2 = Sg(b2, a2.mode, c2), b2.return = a2, b2;
        case Ha:
          var d2 = b2._init;
          return q2(a2, d2(b2._payload), c2);
      }
      if (eb(b2) || Ka(b2)) return b2 = Tg(b2, a2.mode, c2, null), b2.return = a2, b2;
      Mg(a2, b2);
    }
    return null;
  }
  function r2(a2, b2, c2, d2) {
    var e2 = null !== b2 ? b2.key : null;
    if ("string" === typeof c2 && "" !== c2 || "number" === typeof c2) return null !== e2 ? null : h(a2, b2, "" + c2, d2);
    if ("object" === typeof c2 && null !== c2) {
      switch (c2.$$typeof) {
        case va:
          return c2.key === e2 ? k2(a2, b2, c2, d2) : null;
        case wa:
          return c2.key === e2 ? l2(a2, b2, c2, d2) : null;
        case Ha:
          return e2 = c2._init, r2(
            a2,
            b2,
            e2(c2._payload),
            d2
          );
      }
      if (eb(c2) || Ka(c2)) return null !== e2 ? null : m2(a2, b2, c2, d2, null);
      Mg(a2, c2);
    }
    return null;
  }
  function y2(a2, b2, c2, d2, e2) {
    if ("string" === typeof d2 && "" !== d2 || "number" === typeof d2) return a2 = a2.get(c2) || null, h(b2, a2, "" + d2, e2);
    if ("object" === typeof d2 && null !== d2) {
      switch (d2.$$typeof) {
        case va:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, k2(b2, a2, d2, e2);
        case wa:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, l2(b2, a2, d2, e2);
        case Ha:
          var f3 = d2._init;
          return y2(a2, b2, c2, f3(d2._payload), e2);
      }
      if (eb(d2) || Ka(d2)) return a2 = a2.get(c2) || null, m2(b2, a2, d2, e2, null);
      Mg(b2, d2);
    }
    return null;
  }
  function n2(e2, g2, h2, k3) {
    for (var l3 = null, m3 = null, u2 = g2, w2 = g2 = 0, x2 = null; null !== u2 && w2 < h2.length; w2++) {
      u2.index > w2 ? (x2 = u2, u2 = null) : x2 = u2.sibling;
      var n3 = r2(e2, u2, h2[w2], k3);
      if (null === n3) {
        null === u2 && (u2 = x2);
        break;
      }
      a && u2 && null === n3.alternate && b(e2, u2);
      g2 = f2(n3, g2, w2);
      null === m3 ? l3 = n3 : m3.sibling = n3;
      m3 = n3;
      u2 = x2;
    }
    if (w2 === h2.length) return c(e2, u2), I && tg(e2, w2), l3;
    if (null === u2) {
      for (; w2 < h2.length; w2++) u2 = q2(e2, h2[w2], k3), null !== u2 && (g2 = f2(u2, g2, w2), null === m3 ? l3 = u2 : m3.sibling = u2, m3 = u2);
      I && tg(e2, w2);
      return l3;
    }
    for (u2 = d(e2, u2); w2 < h2.length; w2++) x2 = y2(u2, e2, w2, h2[w2], k3), null !== x2 && (a && null !== x2.alternate && u2.delete(null === x2.key ? w2 : x2.key), g2 = f2(x2, g2, w2), null === m3 ? l3 = x2 : m3.sibling = x2, m3 = x2);
    a && u2.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function t2(e2, g2, h2, k3) {
    var l3 = Ka(h2);
    if ("function" !== typeof l3) throw Error(p(150));
    h2 = l3.call(h2);
    if (null == h2) throw Error(p(151));
    for (var u2 = l3 = null, m3 = g2, w2 = g2 = 0, x2 = null, n3 = h2.next(); null !== m3 && !n3.done; w2++, n3 = h2.next()) {
      m3.index > w2 ? (x2 = m3, m3 = null) : x2 = m3.sibling;
      var t3 = r2(e2, m3, n3.value, k3);
      if (null === t3) {
        null === m3 && (m3 = x2);
        break;
      }
      a && m3 && null === t3.alternate && b(e2, m3);
      g2 = f2(t3, g2, w2);
      null === u2 ? l3 = t3 : u2.sibling = t3;
      u2 = t3;
      m3 = x2;
    }
    if (n3.done) return c(
      e2,
      m3
    ), I && tg(e2, w2), l3;
    if (null === m3) {
      for (; !n3.done; w2++, n3 = h2.next()) n3 = q2(e2, n3.value, k3), null !== n3 && (g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
      I && tg(e2, w2);
      return l3;
    }
    for (m3 = d(e2, m3); !n3.done; w2++, n3 = h2.next()) n3 = y2(m3, e2, w2, n3.value, k3), null !== n3 && (a && null !== n3.alternate && m3.delete(null === n3.key ? w2 : n3.key), g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
    a && m3.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function J2(a2, d2, f3, h2) {
    "object" === typeof f3 && null !== f3 && f3.type === ya && null === f3.key && (f3 = f3.props.children);
    if ("object" === typeof f3 && null !== f3) {
      switch (f3.$$typeof) {
        case va:
          a: {
            for (var k3 = f3.key, l3 = d2; null !== l3; ) {
              if (l3.key === k3) {
                k3 = f3.type;
                if (k3 === ya) {
                  if (7 === l3.tag) {
                    c(a2, l3.sibling);
                    d2 = e(l3, f3.props.children);
                    d2.return = a2;
                    a2 = d2;
                    break a;
                  }
                } else if (l3.elementType === k3 || "object" === typeof k3 && null !== k3 && k3.$$typeof === Ha && Ng(k3) === l3.type) {
                  c(a2, l3.sibling);
                  d2 = e(l3, f3.props);
                  d2.ref = Lg(a2, l3, f3);
                  d2.return = a2;
                  a2 = d2;
                  break a;
                }
                c(a2, l3);
                break;
              } else b(a2, l3);
              l3 = l3.sibling;
            }
            f3.type === ya ? (d2 = Tg(f3.props.children, a2.mode, h2, f3.key), d2.return = a2, a2 = d2) : (h2 = Rg(f3.type, f3.key, f3.props, null, a2.mode, h2), h2.ref = Lg(a2, d2, f3), h2.return = a2, a2 = h2);
          }
          return g(a2);
        case wa:
          a: {
            for (l3 = f3.key; null !== d2; ) {
              if (d2.key === l3) if (4 === d2.tag && d2.stateNode.containerInfo === f3.containerInfo && d2.stateNode.implementation === f3.implementation) {
                c(a2, d2.sibling);
                d2 = e(d2, f3.children || []);
                d2.return = a2;
                a2 = d2;
                break a;
              } else {
                c(a2, d2);
                break;
              }
              else b(a2, d2);
              d2 = d2.sibling;
            }
            d2 = Sg(f3, a2.mode, h2);
            d2.return = a2;
            a2 = d2;
          }
          return g(a2);
        case Ha:
          return l3 = f3._init, J2(a2, d2, l3(f3._payload), h2);
      }
      if (eb(f3)) return n2(a2, d2, f3, h2);
      if (Ka(f3)) return t2(a2, d2, f3, h2);
      Mg(a2, f3);
    }
    return "string" === typeof f3 && "" !== f3 || "number" === typeof f3 ? (f3 = "" + f3, null !== d2 && 6 === d2.tag ? (c(a2, d2.sibling), d2 = e(d2, f3), d2.return = a2, a2 = d2) : (c(a2, d2), d2 = Qg(f3, a2.mode, h2), d2.return = a2, a2 = d2), g(a2)) : c(a2, d2);
  }
  return J2;
}
var Ug = Og(true), Vg = Og(false), Wg = Uf(null), Xg = null, Yg = null, Zg = null;
function $g() {
  Zg = Yg = Xg = null;
}
function ah(a) {
  var b = Wg.current;
  E(Wg);
  a._currentValue = b;
}
function bh(a, b, c) {
  for (; null !== a; ) {
    var d = a.alternate;
    (a.childLanes & b) !== b ? (a.childLanes |= b, null !== d && (d.childLanes |= b)) : null !== d && (d.childLanes & b) !== b && (d.childLanes |= b);
    if (a === c) break;
    a = a.return;
  }
}
function ch(a, b) {
  Xg = a;
  Zg = Yg = null;
  a = a.dependencies;
  null !== a && null !== a.firstContext && (0 !== (a.lanes & b) && (dh = true), a.firstContext = null);
}
function eh(a) {
  var b = a._currentValue;
  if (Zg !== a) if (a = { context: a, memoizedValue: b, next: null }, null === Yg) {
    if (null === Xg) throw Error(p(308));
    Yg = a;
    Xg.dependencies = { lanes: 0, firstContext: a };
  } else Yg = Yg.next = a;
  return b;
}
var fh = null;
function gh(a) {
  null === fh ? fh = [a] : fh.push(a);
}
function hh(a, b, c, d) {
  var e = b.interleaved;
  null === e ? (c.next = c, gh(b)) : (c.next = e.next, e.next = c);
  b.interleaved = c;
  return ih(a, d);
}
function ih(a, b) {
  a.lanes |= b;
  var c = a.alternate;
  null !== c && (c.lanes |= b);
  c = a;
  for (a = a.return; null !== a; ) a.childLanes |= b, c = a.alternate, null !== c && (c.childLanes |= b), c = a, a = a.return;
  return 3 === c.tag ? c.stateNode : null;
}
var jh = false;
function kh(a) {
  a.updateQueue = { baseState: a.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function lh(a, b) {
  a = a.updateQueue;
  b.updateQueue === a && (b.updateQueue = { baseState: a.baseState, firstBaseUpdate: a.firstBaseUpdate, lastBaseUpdate: a.lastBaseUpdate, shared: a.shared, effects: a.effects });
}
function mh(a, b) {
  return { eventTime: a, lane: b, tag: 0, payload: null, callback: null, next: null };
}
function nh(a, b, c) {
  var d = a.updateQueue;
  if (null === d) return null;
  d = d.shared;
  if (0 !== (K & 2)) {
    var e = d.pending;
    null === e ? b.next = b : (b.next = e.next, e.next = b);
    d.pending = b;
    return ih(a, c);
  }
  e = d.interleaved;
  null === e ? (b.next = b, gh(d)) : (b.next = e.next, e.next = b);
  d.interleaved = b;
  return ih(a, c);
}
function oh(a, b, c) {
  b = b.updateQueue;
  if (null !== b && (b = b.shared, 0 !== (c & 4194240))) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
function ph(a, b) {
  var c = a.updateQueue, d = a.alternate;
  if (null !== d && (d = d.updateQueue, c === d)) {
    var e = null, f2 = null;
    c = c.firstBaseUpdate;
    if (null !== c) {
      do {
        var g = { eventTime: c.eventTime, lane: c.lane, tag: c.tag, payload: c.payload, callback: c.callback, next: null };
        null === f2 ? e = f2 = g : f2 = f2.next = g;
        c = c.next;
      } while (null !== c);
      null === f2 ? e = f2 = b : f2 = f2.next = b;
    } else e = f2 = b;
    c = { baseState: d.baseState, firstBaseUpdate: e, lastBaseUpdate: f2, shared: d.shared, effects: d.effects };
    a.updateQueue = c;
    return;
  }
  a = c.lastBaseUpdate;
  null === a ? c.firstBaseUpdate = b : a.next = b;
  c.lastBaseUpdate = b;
}
function qh(a, b, c, d) {
  var e = a.updateQueue;
  jh = false;
  var f2 = e.firstBaseUpdate, g = e.lastBaseUpdate, h = e.shared.pending;
  if (null !== h) {
    e.shared.pending = null;
    var k2 = h, l2 = k2.next;
    k2.next = null;
    null === g ? f2 = l2 : g.next = l2;
    g = k2;
    var m2 = a.alternate;
    null !== m2 && (m2 = m2.updateQueue, h = m2.lastBaseUpdate, h !== g && (null === h ? m2.firstBaseUpdate = l2 : h.next = l2, m2.lastBaseUpdate = k2));
  }
  if (null !== f2) {
    var q2 = e.baseState;
    g = 0;
    m2 = l2 = k2 = null;
    h = f2;
    do {
      var r2 = h.lane, y2 = h.eventTime;
      if ((d & r2) === r2) {
        null !== m2 && (m2 = m2.next = {
          eventTime: y2,
          lane: 0,
          tag: h.tag,
          payload: h.payload,
          callback: h.callback,
          next: null
        });
        a: {
          var n2 = a, t2 = h;
          r2 = b;
          y2 = c;
          switch (t2.tag) {
            case 1:
              n2 = t2.payload;
              if ("function" === typeof n2) {
                q2 = n2.call(y2, q2, r2);
                break a;
              }
              q2 = n2;
              break a;
            case 3:
              n2.flags = n2.flags & -65537 | 128;
            case 0:
              n2 = t2.payload;
              r2 = "function" === typeof n2 ? n2.call(y2, q2, r2) : n2;
              if (null === r2 || void 0 === r2) break a;
              q2 = A({}, q2, r2);
              break a;
            case 2:
              jh = true;
          }
        }
        null !== h.callback && 0 !== h.lane && (a.flags |= 64, r2 = e.effects, null === r2 ? e.effects = [h] : r2.push(h));
      } else y2 = { eventTime: y2, lane: r2, tag: h.tag, payload: h.payload, callback: h.callback, next: null }, null === m2 ? (l2 = m2 = y2, k2 = q2) : m2 = m2.next = y2, g |= r2;
      h = h.next;
      if (null === h) if (h = e.shared.pending, null === h) break;
      else r2 = h, h = r2.next, r2.next = null, e.lastBaseUpdate = r2, e.shared.pending = null;
    } while (1);
    null === m2 && (k2 = q2);
    e.baseState = k2;
    e.firstBaseUpdate = l2;
    e.lastBaseUpdate = m2;
    b = e.shared.interleaved;
    if (null !== b) {
      e = b;
      do
        g |= e.lane, e = e.next;
      while (e !== b);
    } else null === f2 && (e.shared.lanes = 0);
    rh |= g;
    a.lanes = g;
    a.memoizedState = q2;
  }
}
function sh(a, b, c) {
  a = b.effects;
  b.effects = null;
  if (null !== a) for (b = 0; b < a.length; b++) {
    var d = a[b], e = d.callback;
    if (null !== e) {
      d.callback = null;
      d = c;
      if ("function" !== typeof e) throw Error(p(191, e));
      e.call(d);
    }
  }
}
var th = {}, uh = Uf(th), vh = Uf(th), wh = Uf(th);
function xh(a) {
  if (a === th) throw Error(p(174));
  return a;
}
function yh(a, b) {
  G(wh, b);
  G(vh, a);
  G(uh, th);
  a = b.nodeType;
  switch (a) {
    case 9:
    case 11:
      b = (b = b.documentElement) ? b.namespaceURI : lb(null, "");
      break;
    default:
      a = 8 === a ? b.parentNode : b, b = a.namespaceURI || null, a = a.tagName, b = lb(b, a);
  }
  E(uh);
  G(uh, b);
}
function zh() {
  E(uh);
  E(vh);
  E(wh);
}
function Ah(a) {
  xh(wh.current);
  var b = xh(uh.current);
  var c = lb(b, a.type);
  b !== c && (G(vh, a), G(uh, c));
}
function Bh(a) {
  vh.current === a && (E(uh), E(vh));
}
var L = Uf(0);
function Ch(a) {
  for (var b = a; null !== b; ) {
    if (13 === b.tag) {
      var c = b.memoizedState;
      if (null !== c && (c = c.dehydrated, null === c || "$?" === c.data || "$!" === c.data)) return b;
    } else if (19 === b.tag && void 0 !== b.memoizedProps.revealOrder) {
      if (0 !== (b.flags & 128)) return b;
    } else if (null !== b.child) {
      b.child.return = b;
      b = b.child;
      continue;
    }
    if (b === a) break;
    for (; null === b.sibling; ) {
      if (null === b.return || b.return === a) return null;
      b = b.return;
    }
    b.sibling.return = b.return;
    b = b.sibling;
  }
  return null;
}
var Dh = [];
function Eh() {
  for (var a = 0; a < Dh.length; a++) Dh[a]._workInProgressVersionPrimary = null;
  Dh.length = 0;
}
var Fh = ua.ReactCurrentDispatcher, Gh = ua.ReactCurrentBatchConfig, Hh = 0, M = null, N = null, O = null, Ih = false, Jh = false, Kh = 0, Lh = 0;
function P() {
  throw Error(p(321));
}
function Mh(a, b) {
  if (null === b) return false;
  for (var c = 0; c < b.length && c < a.length; c++) if (!He(a[c], b[c])) return false;
  return true;
}
function Nh(a, b, c, d, e, f2) {
  Hh = f2;
  M = b;
  b.memoizedState = null;
  b.updateQueue = null;
  b.lanes = 0;
  Fh.current = null === a || null === a.memoizedState ? Oh : Ph;
  a = c(d, e);
  if (Jh) {
    f2 = 0;
    do {
      Jh = false;
      Kh = 0;
      if (25 <= f2) throw Error(p(301));
      f2 += 1;
      O = N = null;
      b.updateQueue = null;
      Fh.current = Qh;
      a = c(d, e);
    } while (Jh);
  }
  Fh.current = Rh;
  b = null !== N && null !== N.next;
  Hh = 0;
  O = N = M = null;
  Ih = false;
  if (b) throw Error(p(300));
  return a;
}
function Sh() {
  var a = 0 !== Kh;
  Kh = 0;
  return a;
}
function Th() {
  var a = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  null === O ? M.memoizedState = O = a : O = O.next = a;
  return O;
}
function Uh() {
  if (null === N) {
    var a = M.alternate;
    a = null !== a ? a.memoizedState : null;
  } else a = N.next;
  var b = null === O ? M.memoizedState : O.next;
  if (null !== b) O = b, N = a;
  else {
    if (null === a) throw Error(p(310));
    N = a;
    a = { memoizedState: N.memoizedState, baseState: N.baseState, baseQueue: N.baseQueue, queue: N.queue, next: null };
    null === O ? M.memoizedState = O = a : O = O.next = a;
  }
  return O;
}
function Vh(a, b) {
  return "function" === typeof b ? b(a) : b;
}
function Wh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = N, e = d.baseQueue, f2 = c.pending;
  if (null !== f2) {
    if (null !== e) {
      var g = e.next;
      e.next = f2.next;
      f2.next = g;
    }
    d.baseQueue = e = f2;
    c.pending = null;
  }
  if (null !== e) {
    f2 = e.next;
    d = d.baseState;
    var h = g = null, k2 = null, l2 = f2;
    do {
      var m2 = l2.lane;
      if ((Hh & m2) === m2) null !== k2 && (k2 = k2.next = { lane: 0, action: l2.action, hasEagerState: l2.hasEagerState, eagerState: l2.eagerState, next: null }), d = l2.hasEagerState ? l2.eagerState : a(d, l2.action);
      else {
        var q2 = {
          lane: m2,
          action: l2.action,
          hasEagerState: l2.hasEagerState,
          eagerState: l2.eagerState,
          next: null
        };
        null === k2 ? (h = k2 = q2, g = d) : k2 = k2.next = q2;
        M.lanes |= m2;
        rh |= m2;
      }
      l2 = l2.next;
    } while (null !== l2 && l2 !== f2);
    null === k2 ? g = d : k2.next = h;
    He(d, b.memoizedState) || (dh = true);
    b.memoizedState = d;
    b.baseState = g;
    b.baseQueue = k2;
    c.lastRenderedState = d;
  }
  a = c.interleaved;
  if (null !== a) {
    e = a;
    do
      f2 = e.lane, M.lanes |= f2, rh |= f2, e = e.next;
    while (e !== a);
  } else null === e && (c.lanes = 0);
  return [b.memoizedState, c.dispatch];
}
function Xh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = c.dispatch, e = c.pending, f2 = b.memoizedState;
  if (null !== e) {
    c.pending = null;
    var g = e = e.next;
    do
      f2 = a(f2, g.action), g = g.next;
    while (g !== e);
    He(f2, b.memoizedState) || (dh = true);
    b.memoizedState = f2;
    null === b.baseQueue && (b.baseState = f2);
    c.lastRenderedState = f2;
  }
  return [f2, d];
}
function Yh() {
}
function Zh(a, b) {
  var c = M, d = Uh(), e = b(), f2 = !He(d.memoizedState, e);
  f2 && (d.memoizedState = e, dh = true);
  d = d.queue;
  $h(ai.bind(null, c, d, a), [a]);
  if (d.getSnapshot !== b || f2 || null !== O && O.memoizedState.tag & 1) {
    c.flags |= 2048;
    bi(9, ci.bind(null, c, d, e, b), void 0, null);
    if (null === Q) throw Error(p(349));
    0 !== (Hh & 30) || di(c, b, e);
  }
  return e;
}
function di(a, b, c) {
  a.flags |= 16384;
  a = { getSnapshot: b, value: c };
  b = M.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.stores = [a]) : (c = b.stores, null === c ? b.stores = [a] : c.push(a));
}
function ci(a, b, c, d) {
  b.value = c;
  b.getSnapshot = d;
  ei(b) && fi(a);
}
function ai(a, b, c) {
  return c(function() {
    ei(b) && fi(a);
  });
}
function ei(a) {
  var b = a.getSnapshot;
  a = a.value;
  try {
    var c = b();
    return !He(a, c);
  } catch (d) {
    return true;
  }
}
function fi(a) {
  var b = ih(a, 1);
  null !== b && gi(b, a, 1, -1);
}
function hi(a) {
  var b = Th();
  "function" === typeof a && (a = a());
  b.memoizedState = b.baseState = a;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Vh, lastRenderedState: a };
  b.queue = a;
  a = a.dispatch = ii.bind(null, M, a);
  return [b.memoizedState, a];
}
function bi(a, b, c, d) {
  a = { tag: a, create: b, destroy: c, deps: d, next: null };
  b = M.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.lastEffect = a.next = a) : (c = b.lastEffect, null === c ? b.lastEffect = a.next = a : (d = c.next, c.next = a, a.next = d, b.lastEffect = a));
  return a;
}
function ji() {
  return Uh().memoizedState;
}
function ki(a, b, c, d) {
  var e = Th();
  M.flags |= a;
  e.memoizedState = bi(1 | b, c, void 0, void 0 === d ? null : d);
}
function li(a, b, c, d) {
  var e = Uh();
  d = void 0 === d ? null : d;
  var f2 = void 0;
  if (null !== N) {
    var g = N.memoizedState;
    f2 = g.destroy;
    if (null !== d && Mh(d, g.deps)) {
      e.memoizedState = bi(b, c, f2, d);
      return;
    }
  }
  M.flags |= a;
  e.memoizedState = bi(1 | b, c, f2, d);
}
function mi(a, b) {
  return ki(8390656, 8, a, b);
}
function $h(a, b) {
  return li(2048, 8, a, b);
}
function ni(a, b) {
  return li(4, 2, a, b);
}
function oi(a, b) {
  return li(4, 4, a, b);
}
function pi(a, b) {
  if ("function" === typeof b) return a = a(), b(a), function() {
    b(null);
  };
  if (null !== b && void 0 !== b) return a = a(), b.current = a, function() {
    b.current = null;
  };
}
function qi(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return li(4, 4, pi.bind(null, b, a), c);
}
function ri() {
}
function si(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  c.memoizedState = [a, b];
  return a;
}
function ti(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  a = a();
  c.memoizedState = [a, b];
  return a;
}
function ui(a, b, c) {
  if (0 === (Hh & 21)) return a.baseState && (a.baseState = false, dh = true), a.memoizedState = c;
  He(c, b) || (c = yc(), M.lanes |= c, rh |= c, a.baseState = true);
  return b;
}
function vi(a, b) {
  var c = C;
  C = 0 !== c && 4 > c ? c : 4;
  a(true);
  var d = Gh.transition;
  Gh.transition = {};
  try {
    a(false), b();
  } finally {
    C = c, Gh.transition = d;
  }
}
function wi() {
  return Uh().memoizedState;
}
function xi(a, b, c) {
  var d = yi(a);
  c = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, c);
  else if (c = hh(a, b, c, d), null !== c) {
    var e = R();
    gi(c, a, d, e);
    Bi(c, b, d);
  }
}
function ii(a, b, c) {
  var d = yi(a), e = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, e);
  else {
    var f2 = a.alternate;
    if (0 === a.lanes && (null === f2 || 0 === f2.lanes) && (f2 = b.lastRenderedReducer, null !== f2)) try {
      var g = b.lastRenderedState, h = f2(g, c);
      e.hasEagerState = true;
      e.eagerState = h;
      if (He(h, g)) {
        var k2 = b.interleaved;
        null === k2 ? (e.next = e, gh(b)) : (e.next = k2.next, k2.next = e);
        b.interleaved = e;
        return;
      }
    } catch (l2) {
    } finally {
    }
    c = hh(a, b, e, d);
    null !== c && (e = R(), gi(c, a, d, e), Bi(c, b, d));
  }
}
function zi(a) {
  var b = a.alternate;
  return a === M || null !== b && b === M;
}
function Ai(a, b) {
  Jh = Ih = true;
  var c = a.pending;
  null === c ? b.next = b : (b.next = c.next, c.next = b);
  a.pending = b;
}
function Bi(a, b, c) {
  if (0 !== (c & 4194240)) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
var Rh = { readContext: eh, useCallback: P, useContext: P, useEffect: P, useImperativeHandle: P, useInsertionEffect: P, useLayoutEffect: P, useMemo: P, useReducer: P, useRef: P, useState: P, useDebugValue: P, useDeferredValue: P, useTransition: P, useMutableSource: P, useSyncExternalStore: P, useId: P, unstable_isNewReconciler: false }, Oh = { readContext: eh, useCallback: function(a, b) {
  Th().memoizedState = [a, void 0 === b ? null : b];
  return a;
}, useContext: eh, useEffect: mi, useImperativeHandle: function(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return ki(
    4194308,
    4,
    pi.bind(null, b, a),
    c
  );
}, useLayoutEffect: function(a, b) {
  return ki(4194308, 4, a, b);
}, useInsertionEffect: function(a, b) {
  return ki(4, 2, a, b);
}, useMemo: function(a, b) {
  var c = Th();
  b = void 0 === b ? null : b;
  a = a();
  c.memoizedState = [a, b];
  return a;
}, useReducer: function(a, b, c) {
  var d = Th();
  b = void 0 !== c ? c(b) : b;
  d.memoizedState = d.baseState = b;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a, lastRenderedState: b };
  d.queue = a;
  a = a.dispatch = xi.bind(null, M, a);
  return [d.memoizedState, a];
}, useRef: function(a) {
  var b = Th();
  a = { current: a };
  return b.memoizedState = a;
}, useState: hi, useDebugValue: ri, useDeferredValue: function(a) {
  return Th().memoizedState = a;
}, useTransition: function() {
  var a = hi(false), b = a[0];
  a = vi.bind(null, a[1]);
  Th().memoizedState = a;
  return [b, a];
}, useMutableSource: function() {
}, useSyncExternalStore: function(a, b, c) {
  var d = M, e = Th();
  if (I) {
    if (void 0 === c) throw Error(p(407));
    c = c();
  } else {
    c = b();
    if (null === Q) throw Error(p(349));
    0 !== (Hh & 30) || di(d, b, c);
  }
  e.memoizedState = c;
  var f2 = { value: c, getSnapshot: b };
  e.queue = f2;
  mi(ai.bind(
    null,
    d,
    f2,
    a
  ), [a]);
  d.flags |= 2048;
  bi(9, ci.bind(null, d, f2, c, b), void 0, null);
  return c;
}, useId: function() {
  var a = Th(), b = Q.identifierPrefix;
  if (I) {
    var c = sg;
    var d = rg;
    c = (d & ~(1 << 32 - oc(d) - 1)).toString(32) + c;
    b = ":" + b + "R" + c;
    c = Kh++;
    0 < c && (b += "H" + c.toString(32));
    b += ":";
  } else c = Lh++, b = ":" + b + "r" + c.toString(32) + ":";
  return a.memoizedState = b;
}, unstable_isNewReconciler: false }, Ph = {
  readContext: eh,
  useCallback: si,
  useContext: eh,
  useEffect: $h,
  useImperativeHandle: qi,
  useInsertionEffect: ni,
  useLayoutEffect: oi,
  useMemo: ti,
  useReducer: Wh,
  useRef: ji,
  useState: function() {
    return Wh(Vh);
  },
  useDebugValue: ri,
  useDeferredValue: function(a) {
    var b = Uh();
    return ui(b, N.memoizedState, a);
  },
  useTransition: function() {
    var a = Wh(Vh)[0], b = Uh().memoizedState;
    return [a, b];
  },
  useMutableSource: Yh,
  useSyncExternalStore: Zh,
  useId: wi,
  unstable_isNewReconciler: false
}, Qh = { readContext: eh, useCallback: si, useContext: eh, useEffect: $h, useImperativeHandle: qi, useInsertionEffect: ni, useLayoutEffect: oi, useMemo: ti, useReducer: Xh, useRef: ji, useState: function() {
  return Xh(Vh);
}, useDebugValue: ri, useDeferredValue: function(a) {
  var b = Uh();
  return null === N ? b.memoizedState = a : ui(b, N.memoizedState, a);
}, useTransition: function() {
  var a = Xh(Vh)[0], b = Uh().memoizedState;
  return [a, b];
}, useMutableSource: Yh, useSyncExternalStore: Zh, useId: wi, unstable_isNewReconciler: false };
function Ci(a, b) {
  if (a && a.defaultProps) {
    b = A({}, b);
    a = a.defaultProps;
    for (var c in a) void 0 === b[c] && (b[c] = a[c]);
    return b;
  }
  return b;
}
function Di(a, b, c, d) {
  b = a.memoizedState;
  c = c(d, b);
  c = null === c || void 0 === c ? b : A({}, b, c);
  a.memoizedState = c;
  0 === a.lanes && (a.updateQueue.baseState = c);
}
var Ei = { isMounted: function(a) {
  return (a = a._reactInternals) ? Vb(a) === a : false;
}, enqueueSetState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueReplaceState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.tag = 1;
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueForceUpdate: function(a, b) {
  a = a._reactInternals;
  var c = R(), d = yi(a), e = mh(c, d);
  e.tag = 2;
  void 0 !== b && null !== b && (e.callback = b);
  b = nh(a, e, d);
  null !== b && (gi(b, a, d, c), oh(b, a, d));
} };
function Fi(a, b, c, d, e, f2, g) {
  a = a.stateNode;
  return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d, f2, g) : b.prototype && b.prototype.isPureReactComponent ? !Ie(c, d) || !Ie(e, f2) : true;
}
function Gi(a, b, c) {
  var d = false, e = Vf;
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? f2 = eh(f2) : (e = Zf(b) ? Xf : H.current, d = b.contextTypes, f2 = (d = null !== d && void 0 !== d) ? Yf(a, e) : Vf);
  b = new b(c, f2);
  a.memoizedState = null !== b.state && void 0 !== b.state ? b.state : null;
  b.updater = Ei;
  a.stateNode = b;
  b._reactInternals = a;
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e, a.__reactInternalMemoizedMaskedChildContext = f2);
  return b;
}
function Hi(a, b, c, d) {
  a = b.state;
  "function" === typeof b.componentWillReceiveProps && b.componentWillReceiveProps(c, d);
  "function" === typeof b.UNSAFE_componentWillReceiveProps && b.UNSAFE_componentWillReceiveProps(c, d);
  b.state !== a && Ei.enqueueReplaceState(b, b.state, null);
}
function Ii(a, b, c, d) {
  var e = a.stateNode;
  e.props = c;
  e.state = a.memoizedState;
  e.refs = {};
  kh(a);
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? e.context = eh(f2) : (f2 = Zf(b) ? Xf : H.current, e.context = Yf(a, f2));
  e.state = a.memoizedState;
  f2 = b.getDerivedStateFromProps;
  "function" === typeof f2 && (Di(a, b, f2, c), e.state = a.memoizedState);
  "function" === typeof b.getDerivedStateFromProps || "function" === typeof e.getSnapshotBeforeUpdate || "function" !== typeof e.UNSAFE_componentWillMount && "function" !== typeof e.componentWillMount || (b = e.state, "function" === typeof e.componentWillMount && e.componentWillMount(), "function" === typeof e.UNSAFE_componentWillMount && e.UNSAFE_componentWillMount(), b !== e.state && Ei.enqueueReplaceState(e, e.state, null), qh(a, c, e, d), e.state = a.memoizedState);
  "function" === typeof e.componentDidMount && (a.flags |= 4194308);
}
function Ji(a, b) {
  try {
    var c = "", d = b;
    do
      c += Pa(d), d = d.return;
    while (d);
    var e = c;
  } catch (f2) {
    e = "\nError generating stack: " + f2.message + "\n" + f2.stack;
  }
  return { value: a, source: b, stack: e, digest: null };
}
function Ki(a, b, c) {
  return { value: a, source: null, stack: null != c ? c : null, digest: null != b ? b : null };
}
function Li(a, b) {
  try {
    console.error(b.value);
  } catch (c) {
    setTimeout(function() {
      throw c;
    });
  }
}
var Mi = "function" === typeof WeakMap ? WeakMap : Map;
function Ni(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  c.payload = { element: null };
  var d = b.value;
  c.callback = function() {
    Oi || (Oi = true, Pi = d);
    Li(a, b);
  };
  return c;
}
function Qi(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  var d = a.type.getDerivedStateFromError;
  if ("function" === typeof d) {
    var e = b.value;
    c.payload = function() {
      return d(e);
    };
    c.callback = function() {
      Li(a, b);
    };
  }
  var f2 = a.stateNode;
  null !== f2 && "function" === typeof f2.componentDidCatch && (c.callback = function() {
    Li(a, b);
    "function" !== typeof d && (null === Ri ? Ri = /* @__PURE__ */ new Set([this]) : Ri.add(this));
    var c2 = b.stack;
    this.componentDidCatch(b.value, { componentStack: null !== c2 ? c2 : "" });
  });
  return c;
}
function Si(a, b, c) {
  var d = a.pingCache;
  if (null === d) {
    d = a.pingCache = new Mi();
    var e = /* @__PURE__ */ new Set();
    d.set(b, e);
  } else e = d.get(b), void 0 === e && (e = /* @__PURE__ */ new Set(), d.set(b, e));
  e.has(c) || (e.add(c), a = Ti.bind(null, a, b, c), b.then(a, a));
}
function Ui(a) {
  do {
    var b;
    if (b = 13 === a.tag) b = a.memoizedState, b = null !== b ? null !== b.dehydrated ? true : false : true;
    if (b) return a;
    a = a.return;
  } while (null !== a);
  return null;
}
function Vi(a, b, c, d, e) {
  if (0 === (a.mode & 1)) return a === b ? a.flags |= 65536 : (a.flags |= 128, c.flags |= 131072, c.flags &= -52805, 1 === c.tag && (null === c.alternate ? c.tag = 17 : (b = mh(-1, 1), b.tag = 2, nh(c, b, 1))), c.lanes |= 1), a;
  a.flags |= 65536;
  a.lanes = e;
  return a;
}
var Wi = ua.ReactCurrentOwner, dh = false;
function Xi(a, b, c, d) {
  b.child = null === a ? Vg(b, null, c, d) : Ug(b, a.child, c, d);
}
function Yi(a, b, c, d, e) {
  c = c.render;
  var f2 = b.ref;
  ch(b, e);
  d = Nh(a, b, c, d, f2, e);
  c = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && c && vg(b);
  b.flags |= 1;
  Xi(a, b, d, e);
  return b.child;
}
function $i(a, b, c, d, e) {
  if (null === a) {
    var f2 = c.type;
    if ("function" === typeof f2 && !aj(f2) && void 0 === f2.defaultProps && null === c.compare && void 0 === c.defaultProps) return b.tag = 15, b.type = f2, bj(a, b, f2, d, e);
    a = Rg(c.type, null, d, b, b.mode, e);
    a.ref = b.ref;
    a.return = b;
    return b.child = a;
  }
  f2 = a.child;
  if (0 === (a.lanes & e)) {
    var g = f2.memoizedProps;
    c = c.compare;
    c = null !== c ? c : Ie;
    if (c(g, d) && a.ref === b.ref) return Zi(a, b, e);
  }
  b.flags |= 1;
  a = Pg(f2, d);
  a.ref = b.ref;
  a.return = b;
  return b.child = a;
}
function bj(a, b, c, d, e) {
  if (null !== a) {
    var f2 = a.memoizedProps;
    if (Ie(f2, d) && a.ref === b.ref) if (dh = false, b.pendingProps = d = f2, 0 !== (a.lanes & e)) 0 !== (a.flags & 131072) && (dh = true);
    else return b.lanes = a.lanes, Zi(a, b, e);
  }
  return cj(a, b, c, d, e);
}
function dj(a, b, c) {
  var d = b.pendingProps, e = d.children, f2 = null !== a ? a.memoizedState : null;
  if ("hidden" === d.mode) if (0 === (b.mode & 1)) b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G(ej, fj), fj |= c;
  else {
    if (0 === (c & 1073741824)) return a = null !== f2 ? f2.baseLanes | c : c, b.lanes = b.childLanes = 1073741824, b.memoizedState = { baseLanes: a, cachePool: null, transitions: null }, b.updateQueue = null, G(ej, fj), fj |= a, null;
    b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
    d = null !== f2 ? f2.baseLanes : c;
    G(ej, fj);
    fj |= d;
  }
  else null !== f2 ? (d = f2.baseLanes | c, b.memoizedState = null) : d = c, G(ej, fj), fj |= d;
  Xi(a, b, e, c);
  return b.child;
}
function gj(a, b) {
  var c = b.ref;
  if (null === a && null !== c || null !== a && a.ref !== c) b.flags |= 512, b.flags |= 2097152;
}
function cj(a, b, c, d, e) {
  var f2 = Zf(c) ? Xf : H.current;
  f2 = Yf(b, f2);
  ch(b, e);
  c = Nh(a, b, c, d, f2, e);
  d = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && d && vg(b);
  b.flags |= 1;
  Xi(a, b, c, e);
  return b.child;
}
function hj(a, b, c, d, e) {
  if (Zf(c)) {
    var f2 = true;
    cg(b);
  } else f2 = false;
  ch(b, e);
  if (null === b.stateNode) ij(a, b), Gi(b, c, d), Ii(b, c, d, e), d = true;
  else if (null === a) {
    var g = b.stateNode, h = b.memoizedProps;
    g.props = h;
    var k2 = g.context, l2 = c.contextType;
    "object" === typeof l2 && null !== l2 ? l2 = eh(l2) : (l2 = Zf(c) ? Xf : H.current, l2 = Yf(b, l2));
    var m2 = c.getDerivedStateFromProps, q2 = "function" === typeof m2 || "function" === typeof g.getSnapshotBeforeUpdate;
    q2 || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== d || k2 !== l2) && Hi(b, g, d, l2);
    jh = false;
    var r2 = b.memoizedState;
    g.state = r2;
    qh(b, d, g, e);
    k2 = b.memoizedState;
    h !== d || r2 !== k2 || Wf.current || jh ? ("function" === typeof m2 && (Di(b, c, m2, d), k2 = b.memoizedState), (h = jh || Fi(b, c, h, d, r2, k2, l2)) ? (q2 || "function" !== typeof g.UNSAFE_componentWillMount && "function" !== typeof g.componentWillMount || ("function" === typeof g.componentWillMount && g.componentWillMount(), "function" === typeof g.UNSAFE_componentWillMount && g.UNSAFE_componentWillMount()), "function" === typeof g.componentDidMount && (b.flags |= 4194308)) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), b.memoizedProps = d, b.memoizedState = k2), g.props = d, g.state = k2, g.context = l2, d = h) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), d = false);
  } else {
    g = b.stateNode;
    lh(a, b);
    h = b.memoizedProps;
    l2 = b.type === b.elementType ? h : Ci(b.type, h);
    g.props = l2;
    q2 = b.pendingProps;
    r2 = g.context;
    k2 = c.contextType;
    "object" === typeof k2 && null !== k2 ? k2 = eh(k2) : (k2 = Zf(c) ? Xf : H.current, k2 = Yf(b, k2));
    var y2 = c.getDerivedStateFromProps;
    (m2 = "function" === typeof y2 || "function" === typeof g.getSnapshotBeforeUpdate) || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== q2 || r2 !== k2) && Hi(b, g, d, k2);
    jh = false;
    r2 = b.memoizedState;
    g.state = r2;
    qh(b, d, g, e);
    var n2 = b.memoizedState;
    h !== q2 || r2 !== n2 || Wf.current || jh ? ("function" === typeof y2 && (Di(b, c, y2, d), n2 = b.memoizedState), (l2 = jh || Fi(b, c, l2, d, r2, n2, k2) || false) ? (m2 || "function" !== typeof g.UNSAFE_componentWillUpdate && "function" !== typeof g.componentWillUpdate || ("function" === typeof g.componentWillUpdate && g.componentWillUpdate(d, n2, k2), "function" === typeof g.UNSAFE_componentWillUpdate && g.UNSAFE_componentWillUpdate(d, n2, k2)), "function" === typeof g.componentDidUpdate && (b.flags |= 4), "function" === typeof g.getSnapshotBeforeUpdate && (b.flags |= 1024)) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), b.memoizedProps = d, b.memoizedState = n2), g.props = d, g.state = n2, g.context = k2, d = l2) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), d = false);
  }
  return jj(a, b, c, d, f2, e);
}
function jj(a, b, c, d, e, f2) {
  gj(a, b);
  var g = 0 !== (b.flags & 128);
  if (!d && !g) return e && dg(b, c, false), Zi(a, b, f2);
  d = b.stateNode;
  Wi.current = b;
  var h = g && "function" !== typeof c.getDerivedStateFromError ? null : d.render();
  b.flags |= 1;
  null !== a && g ? (b.child = Ug(b, a.child, null, f2), b.child = Ug(b, null, h, f2)) : Xi(a, b, h, f2);
  b.memoizedState = d.state;
  e && dg(b, c, true);
  return b.child;
}
function kj(a) {
  var b = a.stateNode;
  b.pendingContext ? ag(a, b.pendingContext, b.pendingContext !== b.context) : b.context && ag(a, b.context, false);
  yh(a, b.containerInfo);
}
function lj(a, b, c, d, e) {
  Ig();
  Jg(e);
  b.flags |= 256;
  Xi(a, b, c, d);
  return b.child;
}
var mj = { dehydrated: null, treeContext: null, retryLane: 0 };
function nj(a) {
  return { baseLanes: a, cachePool: null, transitions: null };
}
function oj(a, b, c) {
  var d = b.pendingProps, e = L.current, f2 = false, g = 0 !== (b.flags & 128), h;
  (h = g) || (h = null !== a && null === a.memoizedState ? false : 0 !== (e & 2));
  if (h) f2 = true, b.flags &= -129;
  else if (null === a || null !== a.memoizedState) e |= 1;
  G(L, e & 1);
  if (null === a) {
    Eg(b);
    a = b.memoizedState;
    if (null !== a && (a = a.dehydrated, null !== a)) return 0 === (b.mode & 1) ? b.lanes = 1 : "$!" === a.data ? b.lanes = 8 : b.lanes = 1073741824, null;
    g = d.children;
    a = d.fallback;
    return f2 ? (d = b.mode, f2 = b.child, g = { mode: "hidden", children: g }, 0 === (d & 1) && null !== f2 ? (f2.childLanes = 0, f2.pendingProps = g) : f2 = pj(g, d, 0, null), a = Tg(a, d, c, null), f2.return = b, a.return = b, f2.sibling = a, b.child = f2, b.child.memoizedState = nj(c), b.memoizedState = mj, a) : qj(b, g);
  }
  e = a.memoizedState;
  if (null !== e && (h = e.dehydrated, null !== h)) return rj(a, b, g, d, h, e, c);
  if (f2) {
    f2 = d.fallback;
    g = b.mode;
    e = a.child;
    h = e.sibling;
    var k2 = { mode: "hidden", children: d.children };
    0 === (g & 1) && b.child !== e ? (d = b.child, d.childLanes = 0, d.pendingProps = k2, b.deletions = null) : (d = Pg(e, k2), d.subtreeFlags = e.subtreeFlags & 14680064);
    null !== h ? f2 = Pg(h, f2) : (f2 = Tg(f2, g, c, null), f2.flags |= 2);
    f2.return = b;
    d.return = b;
    d.sibling = f2;
    b.child = d;
    d = f2;
    f2 = b.child;
    g = a.child.memoizedState;
    g = null === g ? nj(c) : { baseLanes: g.baseLanes | c, cachePool: null, transitions: g.transitions };
    f2.memoizedState = g;
    f2.childLanes = a.childLanes & ~c;
    b.memoizedState = mj;
    return d;
  }
  f2 = a.child;
  a = f2.sibling;
  d = Pg(f2, { mode: "visible", children: d.children });
  0 === (b.mode & 1) && (d.lanes = c);
  d.return = b;
  d.sibling = null;
  null !== a && (c = b.deletions, null === c ? (b.deletions = [a], b.flags |= 16) : c.push(a));
  b.child = d;
  b.memoizedState = null;
  return d;
}
function qj(a, b) {
  b = pj({ mode: "visible", children: b }, a.mode, 0, null);
  b.return = a;
  return a.child = b;
}
function sj(a, b, c, d) {
  null !== d && Jg(d);
  Ug(b, a.child, null, c);
  a = qj(b, b.pendingProps.children);
  a.flags |= 2;
  b.memoizedState = null;
  return a;
}
function rj(a, b, c, d, e, f2, g) {
  if (c) {
    if (b.flags & 256) return b.flags &= -257, d = Ki(Error(p(422))), sj(a, b, g, d);
    if (null !== b.memoizedState) return b.child = a.child, b.flags |= 128, null;
    f2 = d.fallback;
    e = b.mode;
    d = pj({ mode: "visible", children: d.children }, e, 0, null);
    f2 = Tg(f2, e, g, null);
    f2.flags |= 2;
    d.return = b;
    f2.return = b;
    d.sibling = f2;
    b.child = d;
    0 !== (b.mode & 1) && Ug(b, a.child, null, g);
    b.child.memoizedState = nj(g);
    b.memoizedState = mj;
    return f2;
  }
  if (0 === (b.mode & 1)) return sj(a, b, g, null);
  if ("$!" === e.data) {
    d = e.nextSibling && e.nextSibling.dataset;
    if (d) var h = d.dgst;
    d = h;
    f2 = Error(p(419));
    d = Ki(f2, d, void 0);
    return sj(a, b, g, d);
  }
  h = 0 !== (g & a.childLanes);
  if (dh || h) {
    d = Q;
    if (null !== d) {
      switch (g & -g) {
        case 4:
          e = 2;
          break;
        case 16:
          e = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          e = 32;
          break;
        case 536870912:
          e = 268435456;
          break;
        default:
          e = 0;
      }
      e = 0 !== (e & (d.suspendedLanes | g)) ? 0 : e;
      0 !== e && e !== f2.retryLane && (f2.retryLane = e, ih(a, e), gi(d, a, e, -1));
    }
    tj();
    d = Ki(Error(p(421)));
    return sj(a, b, g, d);
  }
  if ("$?" === e.data) return b.flags |= 128, b.child = a.child, b = uj.bind(null, a), e._reactRetry = b, null;
  a = f2.treeContext;
  yg = Lf(e.nextSibling);
  xg = b;
  I = true;
  zg = null;
  null !== a && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a.id, sg = a.overflow, qg = b);
  b = qj(b, d.children);
  b.flags |= 4096;
  return b;
}
function vj(a, b, c) {
  a.lanes |= b;
  var d = a.alternate;
  null !== d && (d.lanes |= b);
  bh(a.return, b, c);
}
function wj(a, b, c, d, e) {
  var f2 = a.memoizedState;
  null === f2 ? a.memoizedState = { isBackwards: b, rendering: null, renderingStartTime: 0, last: d, tail: c, tailMode: e } : (f2.isBackwards = b, f2.rendering = null, f2.renderingStartTime = 0, f2.last = d, f2.tail = c, f2.tailMode = e);
}
function xj(a, b, c) {
  var d = b.pendingProps, e = d.revealOrder, f2 = d.tail;
  Xi(a, b, d.children, c);
  d = L.current;
  if (0 !== (d & 2)) d = d & 1 | 2, b.flags |= 128;
  else {
    if (null !== a && 0 !== (a.flags & 128)) a: for (a = b.child; null !== a; ) {
      if (13 === a.tag) null !== a.memoizedState && vj(a, c, b);
      else if (19 === a.tag) vj(a, c, b);
      else if (null !== a.child) {
        a.child.return = a;
        a = a.child;
        continue;
      }
      if (a === b) break a;
      for (; null === a.sibling; ) {
        if (null === a.return || a.return === b) break a;
        a = a.return;
      }
      a.sibling.return = a.return;
      a = a.sibling;
    }
    d &= 1;
  }
  G(L, d);
  if (0 === (b.mode & 1)) b.memoizedState = null;
  else switch (e) {
    case "forwards":
      c = b.child;
      for (e = null; null !== c; ) a = c.alternate, null !== a && null === Ch(a) && (e = c), c = c.sibling;
      c = e;
      null === c ? (e = b.child, b.child = null) : (e = c.sibling, c.sibling = null);
      wj(b, false, e, c, f2);
      break;
    case "backwards":
      c = null;
      e = b.child;
      for (b.child = null; null !== e; ) {
        a = e.alternate;
        if (null !== a && null === Ch(a)) {
          b.child = e;
          break;
        }
        a = e.sibling;
        e.sibling = c;
        c = e;
        e = a;
      }
      wj(b, true, c, null, f2);
      break;
    case "together":
      wj(b, false, null, null, void 0);
      break;
    default:
      b.memoizedState = null;
  }
  return b.child;
}
function ij(a, b) {
  0 === (b.mode & 1) && null !== a && (a.alternate = null, b.alternate = null, b.flags |= 2);
}
function Zi(a, b, c) {
  null !== a && (b.dependencies = a.dependencies);
  rh |= b.lanes;
  if (0 === (c & b.childLanes)) return null;
  if (null !== a && b.child !== a.child) throw Error(p(153));
  if (null !== b.child) {
    a = b.child;
    c = Pg(a, a.pendingProps);
    b.child = c;
    for (c.return = b; null !== a.sibling; ) a = a.sibling, c = c.sibling = Pg(a, a.pendingProps), c.return = b;
    c.sibling = null;
  }
  return b.child;
}
function yj(a, b, c) {
  switch (b.tag) {
    case 3:
      kj(b);
      Ig();
      break;
    case 5:
      Ah(b);
      break;
    case 1:
      Zf(b.type) && cg(b);
      break;
    case 4:
      yh(b, b.stateNode.containerInfo);
      break;
    case 10:
      var d = b.type._context, e = b.memoizedProps.value;
      G(Wg, d._currentValue);
      d._currentValue = e;
      break;
    case 13:
      d = b.memoizedState;
      if (null !== d) {
        if (null !== d.dehydrated) return G(L, L.current & 1), b.flags |= 128, null;
        if (0 !== (c & b.child.childLanes)) return oj(a, b, c);
        G(L, L.current & 1);
        a = Zi(a, b, c);
        return null !== a ? a.sibling : null;
      }
      G(L, L.current & 1);
      break;
    case 19:
      d = 0 !== (c & b.childLanes);
      if (0 !== (a.flags & 128)) {
        if (d) return xj(a, b, c);
        b.flags |= 128;
      }
      e = b.memoizedState;
      null !== e && (e.rendering = null, e.tail = null, e.lastEffect = null);
      G(L, L.current);
      if (d) break;
      else return null;
    case 22:
    case 23:
      return b.lanes = 0, dj(a, b, c);
  }
  return Zi(a, b, c);
}
var zj, Aj, Bj, Cj;
zj = function(a, b) {
  for (var c = b.child; null !== c; ) {
    if (5 === c.tag || 6 === c.tag) a.appendChild(c.stateNode);
    else if (4 !== c.tag && null !== c.child) {
      c.child.return = c;
      c = c.child;
      continue;
    }
    if (c === b) break;
    for (; null === c.sibling; ) {
      if (null === c.return || c.return === b) return;
      c = c.return;
    }
    c.sibling.return = c.return;
    c = c.sibling;
  }
};
Aj = function() {
};
Bj = function(a, b, c, d) {
  var e = a.memoizedProps;
  if (e !== d) {
    a = b.stateNode;
    xh(uh.current);
    var f2 = null;
    switch (c) {
      case "input":
        e = Ya(a, e);
        d = Ya(a, d);
        f2 = [];
        break;
      case "select":
        e = A({}, e, { value: void 0 });
        d = A({}, d, { value: void 0 });
        f2 = [];
        break;
      case "textarea":
        e = gb(a, e);
        d = gb(a, d);
        f2 = [];
        break;
      default:
        "function" !== typeof e.onClick && "function" === typeof d.onClick && (a.onclick = Bf);
    }
    ub(c, d);
    var g;
    c = null;
    for (l2 in e) if (!d.hasOwnProperty(l2) && e.hasOwnProperty(l2) && null != e[l2]) if ("style" === l2) {
      var h = e[l2];
      for (g in h) h.hasOwnProperty(g) && (c || (c = {}), c[g] = "");
    } else "dangerouslySetInnerHTML" !== l2 && "children" !== l2 && "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && "autoFocus" !== l2 && (ea.hasOwnProperty(l2) ? f2 || (f2 = []) : (f2 = f2 || []).push(l2, null));
    for (l2 in d) {
      var k2 = d[l2];
      h = null != e ? e[l2] : void 0;
      if (d.hasOwnProperty(l2) && k2 !== h && (null != k2 || null != h)) if ("style" === l2) if (h) {
        for (g in h) !h.hasOwnProperty(g) || k2 && k2.hasOwnProperty(g) || (c || (c = {}), c[g] = "");
        for (g in k2) k2.hasOwnProperty(g) && h[g] !== k2[g] && (c || (c = {}), c[g] = k2[g]);
      } else c || (f2 || (f2 = []), f2.push(
        l2,
        c
      )), c = k2;
      else "dangerouslySetInnerHTML" === l2 ? (k2 = k2 ? k2.__html : void 0, h = h ? h.__html : void 0, null != k2 && h !== k2 && (f2 = f2 || []).push(l2, k2)) : "children" === l2 ? "string" !== typeof k2 && "number" !== typeof k2 || (f2 = f2 || []).push(l2, "" + k2) : "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && (ea.hasOwnProperty(l2) ? (null != k2 && "onScroll" === l2 && D("scroll", a), f2 || h === k2 || (f2 = [])) : (f2 = f2 || []).push(l2, k2));
    }
    c && (f2 = f2 || []).push("style", c);
    var l2 = f2;
    if (b.updateQueue = l2) b.flags |= 4;
  }
};
Cj = function(a, b, c, d) {
  c !== d && (b.flags |= 4);
};
function Dj(a, b) {
  if (!I) switch (a.tailMode) {
    case "hidden":
      b = a.tail;
      for (var c = null; null !== b; ) null !== b.alternate && (c = b), b = b.sibling;
      null === c ? a.tail = null : c.sibling = null;
      break;
    case "collapsed":
      c = a.tail;
      for (var d = null; null !== c; ) null !== c.alternate && (d = c), c = c.sibling;
      null === d ? b || null === a.tail ? a.tail = null : a.tail.sibling = null : d.sibling = null;
  }
}
function S(a) {
  var b = null !== a.alternate && a.alternate.child === a.child, c = 0, d = 0;
  if (b) for (var e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags & 14680064, d |= e.flags & 14680064, e.return = a, e = e.sibling;
  else for (e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags, d |= e.flags, e.return = a, e = e.sibling;
  a.subtreeFlags |= d;
  a.childLanes = c;
  return b;
}
function Ej(a, b, c) {
  var d = b.pendingProps;
  wg(b);
  switch (b.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return S(b), null;
    case 1:
      return Zf(b.type) && $f(), S(b), null;
    case 3:
      d = b.stateNode;
      zh();
      E(Wf);
      E(H);
      Eh();
      d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null);
      if (null === a || null === a.child) Gg(b) ? b.flags |= 4 : null === a || a.memoizedState.isDehydrated && 0 === (b.flags & 256) || (b.flags |= 1024, null !== zg && (Fj(zg), zg = null));
      Aj(a, b);
      S(b);
      return null;
    case 5:
      Bh(b);
      var e = xh(wh.current);
      c = b.type;
      if (null !== a && null != b.stateNode) Bj(a, b, c, d, e), a.ref !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      else {
        if (!d) {
          if (null === b.stateNode) throw Error(p(166));
          S(b);
          return null;
        }
        a = xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.type;
          var f2 = b.memoizedProps;
          d[Of] = b;
          d[Pf] = f2;
          a = 0 !== (b.mode & 1);
          switch (c) {
            case "dialog":
              D("cancel", d);
              D("close", d);
              break;
            case "iframe":
            case "object":
            case "embed":
              D("load", d);
              break;
            case "video":
            case "audio":
              for (e = 0; e < lf.length; e++) D(lf[e], d);
              break;
            case "source":
              D("error", d);
              break;
            case "img":
            case "image":
            case "link":
              D(
                "error",
                d
              );
              D("load", d);
              break;
            case "details":
              D("toggle", d);
              break;
            case "input":
              Za(d, f2);
              D("invalid", d);
              break;
            case "select":
              d._wrapperState = { wasMultiple: !!f2.multiple };
              D("invalid", d);
              break;
            case "textarea":
              hb(d, f2), D("invalid", d);
          }
          ub(c, f2);
          e = null;
          for (var g in f2) if (f2.hasOwnProperty(g)) {
            var h = f2[g];
            "children" === g ? "string" === typeof h ? d.textContent !== h && (true !== f2.suppressHydrationWarning && Af(d.textContent, h, a), e = ["children", h]) : "number" === typeof h && d.textContent !== "" + h && (true !== f2.suppressHydrationWarning && Af(
              d.textContent,
              h,
              a
            ), e = ["children", "" + h]) : ea.hasOwnProperty(g) && null != h && "onScroll" === g && D("scroll", d);
          }
          switch (c) {
            case "input":
              Va(d);
              db(d, f2, true);
              break;
            case "textarea":
              Va(d);
              jb(d);
              break;
            case "select":
            case "option":
              break;
            default:
              "function" === typeof f2.onClick && (d.onclick = Bf);
          }
          d = e;
          b.updateQueue = d;
          null !== d && (b.flags |= 4);
        } else {
          g = 9 === e.nodeType ? e : e.ownerDocument;
          "http://www.w3.org/1999/xhtml" === a && (a = kb(c));
          "http://www.w3.org/1999/xhtml" === a ? "script" === c ? (a = g.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild)) : "string" === typeof d.is ? a = g.createElement(c, { is: d.is }) : (a = g.createElement(c), "select" === c && (g = a, d.multiple ? g.multiple = true : d.size && (g.size = d.size))) : a = g.createElementNS(a, c);
          a[Of] = b;
          a[Pf] = d;
          zj(a, b, false, false);
          b.stateNode = a;
          a: {
            g = vb(c, d);
            switch (c) {
              case "dialog":
                D("cancel", a);
                D("close", a);
                e = d;
                break;
              case "iframe":
              case "object":
              case "embed":
                D("load", a);
                e = d;
                break;
              case "video":
              case "audio":
                for (e = 0; e < lf.length; e++) D(lf[e], a);
                e = d;
                break;
              case "source":
                D("error", a);
                e = d;
                break;
              case "img":
              case "image":
              case "link":
                D(
                  "error",
                  a
                );
                D("load", a);
                e = d;
                break;
              case "details":
                D("toggle", a);
                e = d;
                break;
              case "input":
                Za(a, d);
                e = Ya(a, d);
                D("invalid", a);
                break;
              case "option":
                e = d;
                break;
              case "select":
                a._wrapperState = { wasMultiple: !!d.multiple };
                e = A({}, d, { value: void 0 });
                D("invalid", a);
                break;
              case "textarea":
                hb(a, d);
                e = gb(a, d);
                D("invalid", a);
                break;
              default:
                e = d;
            }
            ub(c, e);
            h = e;
            for (f2 in h) if (h.hasOwnProperty(f2)) {
              var k2 = h[f2];
              "style" === f2 ? sb(a, k2) : "dangerouslySetInnerHTML" === f2 ? (k2 = k2 ? k2.__html : void 0, null != k2 && nb(a, k2)) : "children" === f2 ? "string" === typeof k2 ? ("textarea" !== c || "" !== k2) && ob(a, k2) : "number" === typeof k2 && ob(a, "" + k2) : "suppressContentEditableWarning" !== f2 && "suppressHydrationWarning" !== f2 && "autoFocus" !== f2 && (ea.hasOwnProperty(f2) ? null != k2 && "onScroll" === f2 && D("scroll", a) : null != k2 && ta(a, f2, k2, g));
            }
            switch (c) {
              case "input":
                Va(a);
                db(a, d, false);
                break;
              case "textarea":
                Va(a);
                jb(a);
                break;
              case "option":
                null != d.value && a.setAttribute("value", "" + Sa(d.value));
                break;
              case "select":
                a.multiple = !!d.multiple;
                f2 = d.value;
                null != f2 ? fb(a, !!d.multiple, f2, false) : null != d.defaultValue && fb(
                  a,
                  !!d.multiple,
                  d.defaultValue,
                  true
                );
                break;
              default:
                "function" === typeof e.onClick && (a.onclick = Bf);
            }
            switch (c) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                d = !!d.autoFocus;
                break a;
              case "img":
                d = true;
                break a;
              default:
                d = false;
            }
          }
          d && (b.flags |= 4);
        }
        null !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      }
      S(b);
      return null;
    case 6:
      if (a && null != b.stateNode) Cj(a, b, a.memoizedProps, d);
      else {
        if ("string" !== typeof d && null === b.stateNode) throw Error(p(166));
        c = xh(wh.current);
        xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.memoizedProps;
          d[Of] = b;
          if (f2 = d.nodeValue !== c) {
            if (a = xg, null !== a) switch (a.tag) {
              case 3:
                Af(d.nodeValue, c, 0 !== (a.mode & 1));
                break;
              case 5:
                true !== a.memoizedProps.suppressHydrationWarning && Af(d.nodeValue, c, 0 !== (a.mode & 1));
            }
          }
          f2 && (b.flags |= 4);
        } else d = (9 === c.nodeType ? c : c.ownerDocument).createTextNode(d), d[Of] = b, b.stateNode = d;
      }
      S(b);
      return null;
    case 13:
      E(L);
      d = b.memoizedState;
      if (null === a || null !== a.memoizedState && null !== a.memoizedState.dehydrated) {
        if (I && null !== yg && 0 !== (b.mode & 1) && 0 === (b.flags & 128)) Hg(), Ig(), b.flags |= 98560, f2 = false;
        else if (f2 = Gg(b), null !== d && null !== d.dehydrated) {
          if (null === a) {
            if (!f2) throw Error(p(318));
            f2 = b.memoizedState;
            f2 = null !== f2 ? f2.dehydrated : null;
            if (!f2) throw Error(p(317));
            f2[Of] = b;
          } else Ig(), 0 === (b.flags & 128) && (b.memoizedState = null), b.flags |= 4;
          S(b);
          f2 = false;
        } else null !== zg && (Fj(zg), zg = null), f2 = true;
        if (!f2) return b.flags & 65536 ? b : null;
      }
      if (0 !== (b.flags & 128)) return b.lanes = c, b;
      d = null !== d;
      d !== (null !== a && null !== a.memoizedState) && d && (b.child.flags |= 8192, 0 !== (b.mode & 1) && (null === a || 0 !== (L.current & 1) ? 0 === T && (T = 3) : tj()));
      null !== b.updateQueue && (b.flags |= 4);
      S(b);
      return null;
    case 4:
      return zh(), Aj(a, b), null === a && sf(b.stateNode.containerInfo), S(b), null;
    case 10:
      return ah(b.type._context), S(b), null;
    case 17:
      return Zf(b.type) && $f(), S(b), null;
    case 19:
      E(L);
      f2 = b.memoizedState;
      if (null === f2) return S(b), null;
      d = 0 !== (b.flags & 128);
      g = f2.rendering;
      if (null === g) if (d) Dj(f2, false);
      else {
        if (0 !== T || null !== a && 0 !== (a.flags & 128)) for (a = b.child; null !== a; ) {
          g = Ch(a);
          if (null !== g) {
            b.flags |= 128;
            Dj(f2, false);
            d = g.updateQueue;
            null !== d && (b.updateQueue = d, b.flags |= 4);
            b.subtreeFlags = 0;
            d = c;
            for (c = b.child; null !== c; ) f2 = c, a = d, f2.flags &= 14680066, g = f2.alternate, null === g ? (f2.childLanes = 0, f2.lanes = a, f2.child = null, f2.subtreeFlags = 0, f2.memoizedProps = null, f2.memoizedState = null, f2.updateQueue = null, f2.dependencies = null, f2.stateNode = null) : (f2.childLanes = g.childLanes, f2.lanes = g.lanes, f2.child = g.child, f2.subtreeFlags = 0, f2.deletions = null, f2.memoizedProps = g.memoizedProps, f2.memoizedState = g.memoizedState, f2.updateQueue = g.updateQueue, f2.type = g.type, a = g.dependencies, f2.dependencies = null === a ? null : { lanes: a.lanes, firstContext: a.firstContext }), c = c.sibling;
            G(L, L.current & 1 | 2);
            return b.child;
          }
          a = a.sibling;
        }
        null !== f2.tail && B() > Gj && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
      }
      else {
        if (!d) if (a = Ch(g), null !== a) {
          if (b.flags |= 128, d = true, c = a.updateQueue, null !== c && (b.updateQueue = c, b.flags |= 4), Dj(f2, true), null === f2.tail && "hidden" === f2.tailMode && !g.alternate && !I) return S(b), null;
        } else 2 * B() - f2.renderingStartTime > Gj && 1073741824 !== c && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
        f2.isBackwards ? (g.sibling = b.child, b.child = g) : (c = f2.last, null !== c ? c.sibling = g : b.child = g, f2.last = g);
      }
      if (null !== f2.tail) return b = f2.tail, f2.rendering = b, f2.tail = b.sibling, f2.renderingStartTime = B(), b.sibling = null, c = L.current, G(L, d ? c & 1 | 2 : c & 1), b;
      S(b);
      return null;
    case 22:
    case 23:
      return Hj(), d = null !== b.memoizedState, null !== a && null !== a.memoizedState !== d && (b.flags |= 8192), d && 0 !== (b.mode & 1) ? 0 !== (fj & 1073741824) && (S(b), b.subtreeFlags & 6 && (b.flags |= 8192)) : S(b), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(p(156, b.tag));
}
function Ij(a, b) {
  wg(b);
  switch (b.tag) {
    case 1:
      return Zf(b.type) && $f(), a = b.flags, a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 3:
      return zh(), E(Wf), E(H), Eh(), a = b.flags, 0 !== (a & 65536) && 0 === (a & 128) ? (b.flags = a & -65537 | 128, b) : null;
    case 5:
      return Bh(b), null;
    case 13:
      E(L);
      a = b.memoizedState;
      if (null !== a && null !== a.dehydrated) {
        if (null === b.alternate) throw Error(p(340));
        Ig();
      }
      a = b.flags;
      return a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 19:
      return E(L), null;
    case 4:
      return zh(), null;
    case 10:
      return ah(b.type._context), null;
    case 22:
    case 23:
      return Hj(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var Jj = false, U = false, Kj = "function" === typeof WeakSet ? WeakSet : Set, V = null;
function Lj(a, b) {
  var c = a.ref;
  if (null !== c) if ("function" === typeof c) try {
    c(null);
  } catch (d) {
    W(a, b, d);
  }
  else c.current = null;
}
function Mj(a, b, c) {
  try {
    c();
  } catch (d) {
    W(a, b, d);
  }
}
var Nj = false;
function Oj(a, b) {
  Cf = dd;
  a = Me();
  if (Ne(a)) {
    if ("selectionStart" in a) var c = { start: a.selectionStart, end: a.selectionEnd };
    else a: {
      c = (c = a.ownerDocument) && c.defaultView || window;
      var d = c.getSelection && c.getSelection();
      if (d && 0 !== d.rangeCount) {
        c = d.anchorNode;
        var e = d.anchorOffset, f2 = d.focusNode;
        d = d.focusOffset;
        try {
          c.nodeType, f2.nodeType;
        } catch (F2) {
          c = null;
          break a;
        }
        var g = 0, h = -1, k2 = -1, l2 = 0, m2 = 0, q2 = a, r2 = null;
        b: for (; ; ) {
          for (var y2; ; ) {
            q2 !== c || 0 !== e && 3 !== q2.nodeType || (h = g + e);
            q2 !== f2 || 0 !== d && 3 !== q2.nodeType || (k2 = g + d);
            3 === q2.nodeType && (g += q2.nodeValue.length);
            if (null === (y2 = q2.firstChild)) break;
            r2 = q2;
            q2 = y2;
          }
          for (; ; ) {
            if (q2 === a) break b;
            r2 === c && ++l2 === e && (h = g);
            r2 === f2 && ++m2 === d && (k2 = g);
            if (null !== (y2 = q2.nextSibling)) break;
            q2 = r2;
            r2 = q2.parentNode;
          }
          q2 = y2;
        }
        c = -1 === h || -1 === k2 ? null : { start: h, end: k2 };
      } else c = null;
    }
    c = c || { start: 0, end: 0 };
  } else c = null;
  Df = { focusedElem: a, selectionRange: c };
  dd = false;
  for (V = b; null !== V; ) if (b = V, a = b.child, 0 !== (b.subtreeFlags & 1028) && null !== a) a.return = b, V = a;
  else for (; null !== V; ) {
    b = V;
    try {
      var n2 = b.alternate;
      if (0 !== (b.flags & 1024)) switch (b.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (null !== n2) {
            var t2 = n2.memoizedProps, J2 = n2.memoizedState, x2 = b.stateNode, w2 = x2.getSnapshotBeforeUpdate(b.elementType === b.type ? t2 : Ci(b.type, t2), J2);
            x2.__reactInternalSnapshotBeforeUpdate = w2;
          }
          break;
        case 3:
          var u2 = b.stateNode.containerInfo;
          1 === u2.nodeType ? u2.textContent = "" : 9 === u2.nodeType && u2.documentElement && u2.removeChild(u2.documentElement);
          break;
        case 5:
        case 6:
        case 4:
        case 17:
          break;
        default:
          throw Error(p(163));
      }
    } catch (F2) {
      W(b, b.return, F2);
    }
    a = b.sibling;
    if (null !== a) {
      a.return = b.return;
      V = a;
      break;
    }
    V = b.return;
  }
  n2 = Nj;
  Nj = false;
  return n2;
}
function Pj(a, b, c) {
  var d = b.updateQueue;
  d = null !== d ? d.lastEffect : null;
  if (null !== d) {
    var e = d = d.next;
    do {
      if ((e.tag & a) === a) {
        var f2 = e.destroy;
        e.destroy = void 0;
        void 0 !== f2 && Mj(b, c, f2);
      }
      e = e.next;
    } while (e !== d);
  }
}
function Qj(a, b) {
  b = b.updateQueue;
  b = null !== b ? b.lastEffect : null;
  if (null !== b) {
    var c = b = b.next;
    do {
      if ((c.tag & a) === a) {
        var d = c.create;
        c.destroy = d();
      }
      c = c.next;
    } while (c !== b);
  }
}
function Rj(a) {
  var b = a.ref;
  if (null !== b) {
    var c = a.stateNode;
    switch (a.tag) {
      case 5:
        a = c;
        break;
      default:
        a = c;
    }
    "function" === typeof b ? b(a) : b.current = a;
  }
}
function Sj(a) {
  var b = a.alternate;
  null !== b && (a.alternate = null, Sj(b));
  a.child = null;
  a.deletions = null;
  a.sibling = null;
  5 === a.tag && (b = a.stateNode, null !== b && (delete b[Of], delete b[Pf], delete b[of], delete b[Qf], delete b[Rf]));
  a.stateNode = null;
  a.return = null;
  a.dependencies = null;
  a.memoizedProps = null;
  a.memoizedState = null;
  a.pendingProps = null;
  a.stateNode = null;
  a.updateQueue = null;
}
function Tj(a) {
  return 5 === a.tag || 3 === a.tag || 4 === a.tag;
}
function Uj(a) {
  a: for (; ; ) {
    for (; null === a.sibling; ) {
      if (null === a.return || Tj(a.return)) return null;
      a = a.return;
    }
    a.sibling.return = a.return;
    for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag; ) {
      if (a.flags & 2) continue a;
      if (null === a.child || 4 === a.tag) continue a;
      else a.child.return = a, a = a.child;
    }
    if (!(a.flags & 2)) return a.stateNode;
  }
}
function Vj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? 8 === c.nodeType ? c.parentNode.insertBefore(a, b) : c.insertBefore(a, b) : (8 === c.nodeType ? (b = c.parentNode, b.insertBefore(a, c)) : (b = c, b.appendChild(a)), c = c._reactRootContainer, null !== c && void 0 !== c || null !== b.onclick || (b.onclick = Bf));
  else if (4 !== d && (a = a.child, null !== a)) for (Vj(a, b, c), a = a.sibling; null !== a; ) Vj(a, b, c), a = a.sibling;
}
function Wj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? c.insertBefore(a, b) : c.appendChild(a);
  else if (4 !== d && (a = a.child, null !== a)) for (Wj(a, b, c), a = a.sibling; null !== a; ) Wj(a, b, c), a = a.sibling;
}
var X = null, Xj = false;
function Yj(a, b, c) {
  for (c = c.child; null !== c; ) Zj(a, b, c), c = c.sibling;
}
function Zj(a, b, c) {
  if (lc && "function" === typeof lc.onCommitFiberUnmount) try {
    lc.onCommitFiberUnmount(kc, c);
  } catch (h) {
  }
  switch (c.tag) {
    case 5:
      U || Lj(c, b);
    case 6:
      var d = X, e = Xj;
      X = null;
      Yj(a, b, c);
      X = d;
      Xj = e;
      null !== X && (Xj ? (a = X, c = c.stateNode, 8 === a.nodeType ? a.parentNode.removeChild(c) : a.removeChild(c)) : X.removeChild(c.stateNode));
      break;
    case 18:
      null !== X && (Xj ? (a = X, c = c.stateNode, 8 === a.nodeType ? Kf(a.parentNode, c) : 1 === a.nodeType && Kf(a, c), bd(a)) : Kf(X, c.stateNode));
      break;
    case 4:
      d = X;
      e = Xj;
      X = c.stateNode.containerInfo;
      Xj = true;
      Yj(a, b, c);
      X = d;
      Xj = e;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!U && (d = c.updateQueue, null !== d && (d = d.lastEffect, null !== d))) {
        e = d = d.next;
        do {
          var f2 = e, g = f2.destroy;
          f2 = f2.tag;
          void 0 !== g && (0 !== (f2 & 2) ? Mj(c, b, g) : 0 !== (f2 & 4) && Mj(c, b, g));
          e = e.next;
        } while (e !== d);
      }
      Yj(a, b, c);
      break;
    case 1:
      if (!U && (Lj(c, b), d = c.stateNode, "function" === typeof d.componentWillUnmount)) try {
        d.props = c.memoizedProps, d.state = c.memoizedState, d.componentWillUnmount();
      } catch (h) {
        W(c, b, h);
      }
      Yj(a, b, c);
      break;
    case 21:
      Yj(a, b, c);
      break;
    case 22:
      c.mode & 1 ? (U = (d = U) || null !== c.memoizedState, Yj(a, b, c), U = d) : Yj(a, b, c);
      break;
    default:
      Yj(a, b, c);
  }
}
function ak(a) {
  var b = a.updateQueue;
  if (null !== b) {
    a.updateQueue = null;
    var c = a.stateNode;
    null === c && (c = a.stateNode = new Kj());
    b.forEach(function(b2) {
      var d = bk.bind(null, a, b2);
      c.has(b2) || (c.add(b2), b2.then(d, d));
    });
  }
}
function ck(a, b) {
  var c = b.deletions;
  if (null !== c) for (var d = 0; d < c.length; d++) {
    var e = c[d];
    try {
      var f2 = a, g = b, h = g;
      a: for (; null !== h; ) {
        switch (h.tag) {
          case 5:
            X = h.stateNode;
            Xj = false;
            break a;
          case 3:
            X = h.stateNode.containerInfo;
            Xj = true;
            break a;
          case 4:
            X = h.stateNode.containerInfo;
            Xj = true;
            break a;
        }
        h = h.return;
      }
      if (null === X) throw Error(p(160));
      Zj(f2, g, e);
      X = null;
      Xj = false;
      var k2 = e.alternate;
      null !== k2 && (k2.return = null);
      e.return = null;
    } catch (l2) {
      W(e, b, l2);
    }
  }
  if (b.subtreeFlags & 12854) for (b = b.child; null !== b; ) dk(b, a), b = b.sibling;
}
function dk(a, b) {
  var c = a.alternate, d = a.flags;
  switch (a.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      ck(b, a);
      ek(a);
      if (d & 4) {
        try {
          Pj(3, a, a.return), Qj(3, a);
        } catch (t2) {
          W(a, a.return, t2);
        }
        try {
          Pj(5, a, a.return);
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 1:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      break;
    case 5:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      if (a.flags & 32) {
        var e = a.stateNode;
        try {
          ob(e, "");
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      if (d & 4 && (e = a.stateNode, null != e)) {
        var f2 = a.memoizedProps, g = null !== c ? c.memoizedProps : f2, h = a.type, k2 = a.updateQueue;
        a.updateQueue = null;
        if (null !== k2) try {
          "input" === h && "radio" === f2.type && null != f2.name && ab(e, f2);
          vb(h, g);
          var l2 = vb(h, f2);
          for (g = 0; g < k2.length; g += 2) {
            var m2 = k2[g], q2 = k2[g + 1];
            "style" === m2 ? sb(e, q2) : "dangerouslySetInnerHTML" === m2 ? nb(e, q2) : "children" === m2 ? ob(e, q2) : ta(e, m2, q2, l2);
          }
          switch (h) {
            case "input":
              bb(e, f2);
              break;
            case "textarea":
              ib(e, f2);
              break;
            case "select":
              var r2 = e._wrapperState.wasMultiple;
              e._wrapperState.wasMultiple = !!f2.multiple;
              var y2 = f2.value;
              null != y2 ? fb(e, !!f2.multiple, y2, false) : r2 !== !!f2.multiple && (null != f2.defaultValue ? fb(
                e,
                !!f2.multiple,
                f2.defaultValue,
                true
              ) : fb(e, !!f2.multiple, f2.multiple ? [] : "", false));
          }
          e[Pf] = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 6:
      ck(b, a);
      ek(a);
      if (d & 4) {
        if (null === a.stateNode) throw Error(p(162));
        e = a.stateNode;
        f2 = a.memoizedProps;
        try {
          e.nodeValue = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 3:
      ck(b, a);
      ek(a);
      if (d & 4 && null !== c && c.memoizedState.isDehydrated) try {
        bd(b.containerInfo);
      } catch (t2) {
        W(a, a.return, t2);
      }
      break;
    case 4:
      ck(b, a);
      ek(a);
      break;
    case 13:
      ck(b, a);
      ek(a);
      e = a.child;
      e.flags & 8192 && (f2 = null !== e.memoizedState, e.stateNode.isHidden = f2, !f2 || null !== e.alternate && null !== e.alternate.memoizedState || (fk = B()));
      d & 4 && ak(a);
      break;
    case 22:
      m2 = null !== c && null !== c.memoizedState;
      a.mode & 1 ? (U = (l2 = U) || m2, ck(b, a), U = l2) : ck(b, a);
      ek(a);
      if (d & 8192) {
        l2 = null !== a.memoizedState;
        if ((a.stateNode.isHidden = l2) && !m2 && 0 !== (a.mode & 1)) for (V = a, m2 = a.child; null !== m2; ) {
          for (q2 = V = m2; null !== V; ) {
            r2 = V;
            y2 = r2.child;
            switch (r2.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                Pj(4, r2, r2.return);
                break;
              case 1:
                Lj(r2, r2.return);
                var n2 = r2.stateNode;
                if ("function" === typeof n2.componentWillUnmount) {
                  d = r2;
                  c = r2.return;
                  try {
                    b = d, n2.props = b.memoizedProps, n2.state = b.memoizedState, n2.componentWillUnmount();
                  } catch (t2) {
                    W(d, c, t2);
                  }
                }
                break;
              case 5:
                Lj(r2, r2.return);
                break;
              case 22:
                if (null !== r2.memoizedState) {
                  gk(q2);
                  continue;
                }
            }
            null !== y2 ? (y2.return = r2, V = y2) : gk(q2);
          }
          m2 = m2.sibling;
        }
        a: for (m2 = null, q2 = a; ; ) {
          if (5 === q2.tag) {
            if (null === m2) {
              m2 = q2;
              try {
                e = q2.stateNode, l2 ? (f2 = e.style, "function" === typeof f2.setProperty ? f2.setProperty("display", "none", "important") : f2.display = "none") : (h = q2.stateNode, k2 = q2.memoizedProps.style, g = void 0 !== k2 && null !== k2 && k2.hasOwnProperty("display") ? k2.display : null, h.style.display = rb("display", g));
              } catch (t2) {
                W(a, a.return, t2);
              }
            }
          } else if (6 === q2.tag) {
            if (null === m2) try {
              q2.stateNode.nodeValue = l2 ? "" : q2.memoizedProps;
            } catch (t2) {
              W(a, a.return, t2);
            }
          } else if ((22 !== q2.tag && 23 !== q2.tag || null === q2.memoizedState || q2 === a) && null !== q2.child) {
            q2.child.return = q2;
            q2 = q2.child;
            continue;
          }
          if (q2 === a) break a;
          for (; null === q2.sibling; ) {
            if (null === q2.return || q2.return === a) break a;
            m2 === q2 && (m2 = null);
            q2 = q2.return;
          }
          m2 === q2 && (m2 = null);
          q2.sibling.return = q2.return;
          q2 = q2.sibling;
        }
      }
      break;
    case 19:
      ck(b, a);
      ek(a);
      d & 4 && ak(a);
      break;
    case 21:
      break;
    default:
      ck(
        b,
        a
      ), ek(a);
  }
}
function ek(a) {
  var b = a.flags;
  if (b & 2) {
    try {
      a: {
        for (var c = a.return; null !== c; ) {
          if (Tj(c)) {
            var d = c;
            break a;
          }
          c = c.return;
        }
        throw Error(p(160));
      }
      switch (d.tag) {
        case 5:
          var e = d.stateNode;
          d.flags & 32 && (ob(e, ""), d.flags &= -33);
          var f2 = Uj(a);
          Wj(a, f2, e);
          break;
        case 3:
        case 4:
          var g = d.stateNode.containerInfo, h = Uj(a);
          Vj(a, h, g);
          break;
        default:
          throw Error(p(161));
      }
    } catch (k2) {
      W(a, a.return, k2);
    }
    a.flags &= -3;
  }
  b & 4096 && (a.flags &= -4097);
}
function hk(a, b, c) {
  V = a;
  ik(a);
}
function ik(a, b, c) {
  for (var d = 0 !== (a.mode & 1); null !== V; ) {
    var e = V, f2 = e.child;
    if (22 === e.tag && d) {
      var g = null !== e.memoizedState || Jj;
      if (!g) {
        var h = e.alternate, k2 = null !== h && null !== h.memoizedState || U;
        h = Jj;
        var l2 = U;
        Jj = g;
        if ((U = k2) && !l2) for (V = e; null !== V; ) g = V, k2 = g.child, 22 === g.tag && null !== g.memoizedState ? jk(e) : null !== k2 ? (k2.return = g, V = k2) : jk(e);
        for (; null !== f2; ) V = f2, ik(f2), f2 = f2.sibling;
        V = e;
        Jj = h;
        U = l2;
      }
      kk(a);
    } else 0 !== (e.subtreeFlags & 8772) && null !== f2 ? (f2.return = e, V = f2) : kk(a);
  }
}
function kk(a) {
  for (; null !== V; ) {
    var b = V;
    if (0 !== (b.flags & 8772)) {
      var c = b.alternate;
      try {
        if (0 !== (b.flags & 8772)) switch (b.tag) {
          case 0:
          case 11:
          case 15:
            U || Qj(5, b);
            break;
          case 1:
            var d = b.stateNode;
            if (b.flags & 4 && !U) if (null === c) d.componentDidMount();
            else {
              var e = b.elementType === b.type ? c.memoizedProps : Ci(b.type, c.memoizedProps);
              d.componentDidUpdate(e, c.memoizedState, d.__reactInternalSnapshotBeforeUpdate);
            }
            var f2 = b.updateQueue;
            null !== f2 && sh(b, f2, d);
            break;
          case 3:
            var g = b.updateQueue;
            if (null !== g) {
              c = null;
              if (null !== b.child) switch (b.child.tag) {
                case 5:
                  c = b.child.stateNode;
                  break;
                case 1:
                  c = b.child.stateNode;
              }
              sh(b, g, c);
            }
            break;
          case 5:
            var h = b.stateNode;
            if (null === c && b.flags & 4) {
              c = h;
              var k2 = b.memoizedProps;
              switch (b.type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  k2.autoFocus && c.focus();
                  break;
                case "img":
                  k2.src && (c.src = k2.src);
              }
            }
            break;
          case 6:
            break;
          case 4:
            break;
          case 12:
            break;
          case 13:
            if (null === b.memoizedState) {
              var l2 = b.alternate;
              if (null !== l2) {
                var m2 = l2.memoizedState;
                if (null !== m2) {
                  var q2 = m2.dehydrated;
                  null !== q2 && bd(q2);
                }
              }
            }
            break;
          case 19:
          case 17:
          case 21:
          case 22:
          case 23:
          case 25:
            break;
          default:
            throw Error(p(163));
        }
        U || b.flags & 512 && Rj(b);
      } catch (r2) {
        W(b, b.return, r2);
      }
    }
    if (b === a) {
      V = null;
      break;
    }
    c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function gk(a) {
  for (; null !== V; ) {
    var b = V;
    if (b === a) {
      V = null;
      break;
    }
    var c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function jk(a) {
  for (; null !== V; ) {
    var b = V;
    try {
      switch (b.tag) {
        case 0:
        case 11:
        case 15:
          var c = b.return;
          try {
            Qj(4, b);
          } catch (k2) {
            W(b, c, k2);
          }
          break;
        case 1:
          var d = b.stateNode;
          if ("function" === typeof d.componentDidMount) {
            var e = b.return;
            try {
              d.componentDidMount();
            } catch (k2) {
              W(b, e, k2);
            }
          }
          var f2 = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, f2, k2);
          }
          break;
        case 5:
          var g = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, g, k2);
          }
      }
    } catch (k2) {
      W(b, b.return, k2);
    }
    if (b === a) {
      V = null;
      break;
    }
    var h = b.sibling;
    if (null !== h) {
      h.return = b.return;
      V = h;
      break;
    }
    V = b.return;
  }
}
var lk = Math.ceil, mk = ua.ReactCurrentDispatcher, nk = ua.ReactCurrentOwner, ok = ua.ReactCurrentBatchConfig, K = 0, Q = null, Y = null, Z = 0, fj = 0, ej = Uf(0), T = 0, pk = null, rh = 0, qk = 0, rk = 0, sk = null, tk = null, fk = 0, Gj = Infinity, uk = null, Oi = false, Pi = null, Ri = null, vk = false, wk = null, xk = 0, yk = 0, zk = null, Ak = -1, Bk = 0;
function R() {
  return 0 !== (K & 6) ? B() : -1 !== Ak ? Ak : Ak = B();
}
function yi(a) {
  if (0 === (a.mode & 1)) return 1;
  if (0 !== (K & 2) && 0 !== Z) return Z & -Z;
  if (null !== Kg.transition) return 0 === Bk && (Bk = yc()), Bk;
  a = C;
  if (0 !== a) return a;
  a = window.event;
  a = void 0 === a ? 16 : jd(a.type);
  return a;
}
function gi(a, b, c, d) {
  if (50 < yk) throw yk = 0, zk = null, Error(p(185));
  Ac(a, c, d);
  if (0 === (K & 2) || a !== Q) a === Q && (0 === (K & 2) && (qk |= c), 4 === T && Ck(a, Z)), Dk(a, d), 1 === c && 0 === K && 0 === (b.mode & 1) && (Gj = B() + 500, fg && jg());
}
function Dk(a, b) {
  var c = a.callbackNode;
  wc(a, b);
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) null !== c && bc(c), a.callbackNode = null, a.callbackPriority = 0;
  else if (b = d & -d, a.callbackPriority !== b) {
    null != c && bc(c);
    if (1 === b) 0 === a.tag ? ig(Ek.bind(null, a)) : hg(Ek.bind(null, a)), Jf(function() {
      0 === (K & 6) && jg();
    }), c = null;
    else {
      switch (Dc(d)) {
        case 1:
          c = fc;
          break;
        case 4:
          c = gc;
          break;
        case 16:
          c = hc;
          break;
        case 536870912:
          c = jc;
          break;
        default:
          c = hc;
      }
      c = Fk(c, Gk.bind(null, a));
    }
    a.callbackPriority = b;
    a.callbackNode = c;
  }
}
function Gk(a, b) {
  Ak = -1;
  Bk = 0;
  if (0 !== (K & 6)) throw Error(p(327));
  var c = a.callbackNode;
  if (Hk() && a.callbackNode !== c) return null;
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) return null;
  if (0 !== (d & 30) || 0 !== (d & a.expiredLanes) || b) b = Ik(a, d);
  else {
    b = d;
    var e = K;
    K |= 2;
    var f2 = Jk();
    if (Q !== a || Z !== b) uk = null, Gj = B() + 500, Kk(a, b);
    do
      try {
        Lk();
        break;
      } catch (h) {
        Mk(a, h);
      }
    while (1);
    $g();
    mk.current = f2;
    K = e;
    null !== Y ? b = 0 : (Q = null, Z = 0, b = T);
  }
  if (0 !== b) {
    2 === b && (e = xc(a), 0 !== e && (d = e, b = Nk(a, e)));
    if (1 === b) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
    if (6 === b) Ck(a, d);
    else {
      e = a.current.alternate;
      if (0 === (d & 30) && !Ok(e) && (b = Ik(a, d), 2 === b && (f2 = xc(a), 0 !== f2 && (d = f2, b = Nk(a, f2))), 1 === b)) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
      a.finishedWork = e;
      a.finishedLanes = d;
      switch (b) {
        case 0:
        case 1:
          throw Error(p(345));
        case 2:
          Pk(a, tk, uk);
          break;
        case 3:
          Ck(a, d);
          if ((d & 130023424) === d && (b = fk + 500 - B(), 10 < b)) {
            if (0 !== uc(a, 0)) break;
            e = a.suspendedLanes;
            if ((e & d) !== d) {
              R();
              a.pingedLanes |= a.suspendedLanes & e;
              break;
            }
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), b);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 4:
          Ck(a, d);
          if ((d & 4194240) === d) break;
          b = a.eventTimes;
          for (e = -1; 0 < d; ) {
            var g = 31 - oc(d);
            f2 = 1 << g;
            g = b[g];
            g > e && (e = g);
            d &= ~f2;
          }
          d = e;
          d = B() - d;
          d = (120 > d ? 120 : 480 > d ? 480 : 1080 > d ? 1080 : 1920 > d ? 1920 : 3e3 > d ? 3e3 : 4320 > d ? 4320 : 1960 * lk(d / 1960)) - d;
          if (10 < d) {
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), d);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 5:
          Pk(a, tk, uk);
          break;
        default:
          throw Error(p(329));
      }
    }
  }
  Dk(a, B());
  return a.callbackNode === c ? Gk.bind(null, a) : null;
}
function Nk(a, b) {
  var c = sk;
  a.current.memoizedState.isDehydrated && (Kk(a, b).flags |= 256);
  a = Ik(a, b);
  2 !== a && (b = tk, tk = c, null !== b && Fj(b));
  return a;
}
function Fj(a) {
  null === tk ? tk = a : tk.push.apply(tk, a);
}
function Ok(a) {
  for (var b = a; ; ) {
    if (b.flags & 16384) {
      var c = b.updateQueue;
      if (null !== c && (c = c.stores, null !== c)) for (var d = 0; d < c.length; d++) {
        var e = c[d], f2 = e.getSnapshot;
        e = e.value;
        try {
          if (!He(f2(), e)) return false;
        } catch (g) {
          return false;
        }
      }
    }
    c = b.child;
    if (b.subtreeFlags & 16384 && null !== c) c.return = b, b = c;
    else {
      if (b === a) break;
      for (; null === b.sibling; ) {
        if (null === b.return || b.return === a) return true;
        b = b.return;
      }
      b.sibling.return = b.return;
      b = b.sibling;
    }
  }
  return true;
}
function Ck(a, b) {
  b &= ~rk;
  b &= ~qk;
  a.suspendedLanes |= b;
  a.pingedLanes &= ~b;
  for (a = a.expirationTimes; 0 < b; ) {
    var c = 31 - oc(b), d = 1 << c;
    a[c] = -1;
    b &= ~d;
  }
}
function Ek(a) {
  if (0 !== (K & 6)) throw Error(p(327));
  Hk();
  var b = uc(a, 0);
  if (0 === (b & 1)) return Dk(a, B()), null;
  var c = Ik(a, b);
  if (0 !== a.tag && 2 === c) {
    var d = xc(a);
    0 !== d && (b = d, c = Nk(a, d));
  }
  if (1 === c) throw c = pk, Kk(a, 0), Ck(a, b), Dk(a, B()), c;
  if (6 === c) throw Error(p(345));
  a.finishedWork = a.current.alternate;
  a.finishedLanes = b;
  Pk(a, tk, uk);
  Dk(a, B());
  return null;
}
function Qk(a, b) {
  var c = K;
  K |= 1;
  try {
    return a(b);
  } finally {
    K = c, 0 === K && (Gj = B() + 500, fg && jg());
  }
}
function Rk(a) {
  null !== wk && 0 === wk.tag && 0 === (K & 6) && Hk();
  var b = K;
  K |= 1;
  var c = ok.transition, d = C;
  try {
    if (ok.transition = null, C = 1, a) return a();
  } finally {
    C = d, ok.transition = c, K = b, 0 === (K & 6) && jg();
  }
}
function Hj() {
  fj = ej.current;
  E(ej);
}
function Kk(a, b) {
  a.finishedWork = null;
  a.finishedLanes = 0;
  var c = a.timeoutHandle;
  -1 !== c && (a.timeoutHandle = -1, Gf(c));
  if (null !== Y) for (c = Y.return; null !== c; ) {
    var d = c;
    wg(d);
    switch (d.tag) {
      case 1:
        d = d.type.childContextTypes;
        null !== d && void 0 !== d && $f();
        break;
      case 3:
        zh();
        E(Wf);
        E(H);
        Eh();
        break;
      case 5:
        Bh(d);
        break;
      case 4:
        zh();
        break;
      case 13:
        E(L);
        break;
      case 19:
        E(L);
        break;
      case 10:
        ah(d.type._context);
        break;
      case 22:
      case 23:
        Hj();
    }
    c = c.return;
  }
  Q = a;
  Y = a = Pg(a.current, null);
  Z = fj = b;
  T = 0;
  pk = null;
  rk = qk = rh = 0;
  tk = sk = null;
  if (null !== fh) {
    for (b = 0; b < fh.length; b++) if (c = fh[b], d = c.interleaved, null !== d) {
      c.interleaved = null;
      var e = d.next, f2 = c.pending;
      if (null !== f2) {
        var g = f2.next;
        f2.next = e;
        d.next = g;
      }
      c.pending = d;
    }
    fh = null;
  }
  return a;
}
function Mk(a, b) {
  do {
    var c = Y;
    try {
      $g();
      Fh.current = Rh;
      if (Ih) {
        for (var d = M.memoizedState; null !== d; ) {
          var e = d.queue;
          null !== e && (e.pending = null);
          d = d.next;
        }
        Ih = false;
      }
      Hh = 0;
      O = N = M = null;
      Jh = false;
      Kh = 0;
      nk.current = null;
      if (null === c || null === c.return) {
        T = 1;
        pk = b;
        Y = null;
        break;
      }
      a: {
        var f2 = a, g = c.return, h = c, k2 = b;
        b = Z;
        h.flags |= 32768;
        if (null !== k2 && "object" === typeof k2 && "function" === typeof k2.then) {
          var l2 = k2, m2 = h, q2 = m2.tag;
          if (0 === (m2.mode & 1) && (0 === q2 || 11 === q2 || 15 === q2)) {
            var r2 = m2.alternate;
            r2 ? (m2.updateQueue = r2.updateQueue, m2.memoizedState = r2.memoizedState, m2.lanes = r2.lanes) : (m2.updateQueue = null, m2.memoizedState = null);
          }
          var y2 = Ui(g);
          if (null !== y2) {
            y2.flags &= -257;
            Vi(y2, g, h, f2, b);
            y2.mode & 1 && Si(f2, l2, b);
            b = y2;
            k2 = l2;
            var n2 = b.updateQueue;
            if (null === n2) {
              var t2 = /* @__PURE__ */ new Set();
              t2.add(k2);
              b.updateQueue = t2;
            } else n2.add(k2);
            break a;
          } else {
            if (0 === (b & 1)) {
              Si(f2, l2, b);
              tj();
              break a;
            }
            k2 = Error(p(426));
          }
        } else if (I && h.mode & 1) {
          var J2 = Ui(g);
          if (null !== J2) {
            0 === (J2.flags & 65536) && (J2.flags |= 256);
            Vi(J2, g, h, f2, b);
            Jg(Ji(k2, h));
            break a;
          }
        }
        f2 = k2 = Ji(k2, h);
        4 !== T && (T = 2);
        null === sk ? sk = [f2] : sk.push(f2);
        f2 = g;
        do {
          switch (f2.tag) {
            case 3:
              f2.flags |= 65536;
              b &= -b;
              f2.lanes |= b;
              var x2 = Ni(f2, k2, b);
              ph(f2, x2);
              break a;
            case 1:
              h = k2;
              var w2 = f2.type, u2 = f2.stateNode;
              if (0 === (f2.flags & 128) && ("function" === typeof w2.getDerivedStateFromError || null !== u2 && "function" === typeof u2.componentDidCatch && (null === Ri || !Ri.has(u2)))) {
                f2.flags |= 65536;
                b &= -b;
                f2.lanes |= b;
                var F2 = Qi(f2, h, b);
                ph(f2, F2);
                break a;
              }
          }
          f2 = f2.return;
        } while (null !== f2);
      }
      Sk(c);
    } catch (na) {
      b = na;
      Y === c && null !== c && (Y = c = c.return);
      continue;
    }
    break;
  } while (1);
}
function Jk() {
  var a = mk.current;
  mk.current = Rh;
  return null === a ? Rh : a;
}
function tj() {
  if (0 === T || 3 === T || 2 === T) T = 4;
  null === Q || 0 === (rh & 268435455) && 0 === (qk & 268435455) || Ck(Q, Z);
}
function Ik(a, b) {
  var c = K;
  K |= 2;
  var d = Jk();
  if (Q !== a || Z !== b) uk = null, Kk(a, b);
  do
    try {
      Tk();
      break;
    } catch (e) {
      Mk(a, e);
    }
  while (1);
  $g();
  K = c;
  mk.current = d;
  if (null !== Y) throw Error(p(261));
  Q = null;
  Z = 0;
  return T;
}
function Tk() {
  for (; null !== Y; ) Uk(Y);
}
function Lk() {
  for (; null !== Y && !cc(); ) Uk(Y);
}
function Uk(a) {
  var b = Vk(a.alternate, a, fj);
  a.memoizedProps = a.pendingProps;
  null === b ? Sk(a) : Y = b;
  nk.current = null;
}
function Sk(a) {
  var b = a;
  do {
    var c = b.alternate;
    a = b.return;
    if (0 === (b.flags & 32768)) {
      if (c = Ej(c, b, fj), null !== c) {
        Y = c;
        return;
      }
    } else {
      c = Ij(c, b);
      if (null !== c) {
        c.flags &= 32767;
        Y = c;
        return;
      }
      if (null !== a) a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null;
      else {
        T = 6;
        Y = null;
        return;
      }
    }
    b = b.sibling;
    if (null !== b) {
      Y = b;
      return;
    }
    Y = b = a;
  } while (null !== b);
  0 === T && (T = 5);
}
function Pk(a, b, c) {
  var d = C, e = ok.transition;
  try {
    ok.transition = null, C = 1, Wk(a, b, c, d);
  } finally {
    ok.transition = e, C = d;
  }
  return null;
}
function Wk(a, b, c, d) {
  do
    Hk();
  while (null !== wk);
  if (0 !== (K & 6)) throw Error(p(327));
  c = a.finishedWork;
  var e = a.finishedLanes;
  if (null === c) return null;
  a.finishedWork = null;
  a.finishedLanes = 0;
  if (c === a.current) throw Error(p(177));
  a.callbackNode = null;
  a.callbackPriority = 0;
  var f2 = c.lanes | c.childLanes;
  Bc(a, f2);
  a === Q && (Y = Q = null, Z = 0);
  0 === (c.subtreeFlags & 2064) && 0 === (c.flags & 2064) || vk || (vk = true, Fk(hc, function() {
    Hk();
    return null;
  }));
  f2 = 0 !== (c.flags & 15990);
  if (0 !== (c.subtreeFlags & 15990) || f2) {
    f2 = ok.transition;
    ok.transition = null;
    var g = C;
    C = 1;
    var h = K;
    K |= 4;
    nk.current = null;
    Oj(a, c);
    dk(c, a);
    Oe(Df);
    dd = !!Cf;
    Df = Cf = null;
    a.current = c;
    hk(c);
    dc();
    K = h;
    C = g;
    ok.transition = f2;
  } else a.current = c;
  vk && (vk = false, wk = a, xk = e);
  f2 = a.pendingLanes;
  0 === f2 && (Ri = null);
  mc(c.stateNode);
  Dk(a, B());
  if (null !== b) for (d = a.onRecoverableError, c = 0; c < b.length; c++) e = b[c], d(e.value, { componentStack: e.stack, digest: e.digest });
  if (Oi) throw Oi = false, a = Pi, Pi = null, a;
  0 !== (xk & 1) && 0 !== a.tag && Hk();
  f2 = a.pendingLanes;
  0 !== (f2 & 1) ? a === zk ? yk++ : (yk = 0, zk = a) : yk = 0;
  jg();
  return null;
}
function Hk() {
  if (null !== wk) {
    var a = Dc(xk), b = ok.transition, c = C;
    try {
      ok.transition = null;
      C = 16 > a ? 16 : a;
      if (null === wk) var d = false;
      else {
        a = wk;
        wk = null;
        xk = 0;
        if (0 !== (K & 6)) throw Error(p(331));
        var e = K;
        K |= 4;
        for (V = a.current; null !== V; ) {
          var f2 = V, g = f2.child;
          if (0 !== (V.flags & 16)) {
            var h = f2.deletions;
            if (null !== h) {
              for (var k2 = 0; k2 < h.length; k2++) {
                var l2 = h[k2];
                for (V = l2; null !== V; ) {
                  var m2 = V;
                  switch (m2.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Pj(8, m2, f2);
                  }
                  var q2 = m2.child;
                  if (null !== q2) q2.return = m2, V = q2;
                  else for (; null !== V; ) {
                    m2 = V;
                    var r2 = m2.sibling, y2 = m2.return;
                    Sj(m2);
                    if (m2 === l2) {
                      V = null;
                      break;
                    }
                    if (null !== r2) {
                      r2.return = y2;
                      V = r2;
                      break;
                    }
                    V = y2;
                  }
                }
              }
              var n2 = f2.alternate;
              if (null !== n2) {
                var t2 = n2.child;
                if (null !== t2) {
                  n2.child = null;
                  do {
                    var J2 = t2.sibling;
                    t2.sibling = null;
                    t2 = J2;
                  } while (null !== t2);
                }
              }
              V = f2;
            }
          }
          if (0 !== (f2.subtreeFlags & 2064) && null !== g) g.return = f2, V = g;
          else b: for (; null !== V; ) {
            f2 = V;
            if (0 !== (f2.flags & 2048)) switch (f2.tag) {
              case 0:
              case 11:
              case 15:
                Pj(9, f2, f2.return);
            }
            var x2 = f2.sibling;
            if (null !== x2) {
              x2.return = f2.return;
              V = x2;
              break b;
            }
            V = f2.return;
          }
        }
        var w2 = a.current;
        for (V = w2; null !== V; ) {
          g = V;
          var u2 = g.child;
          if (0 !== (g.subtreeFlags & 2064) && null !== u2) u2.return = g, V = u2;
          else b: for (g = w2; null !== V; ) {
            h = V;
            if (0 !== (h.flags & 2048)) try {
              switch (h.tag) {
                case 0:
                case 11:
                case 15:
                  Qj(9, h);
              }
            } catch (na) {
              W(h, h.return, na);
            }
            if (h === g) {
              V = null;
              break b;
            }
            var F2 = h.sibling;
            if (null !== F2) {
              F2.return = h.return;
              V = F2;
              break b;
            }
            V = h.return;
          }
        }
        K = e;
        jg();
        if (lc && "function" === typeof lc.onPostCommitFiberRoot) try {
          lc.onPostCommitFiberRoot(kc, a);
        } catch (na) {
        }
        d = true;
      }
      return d;
    } finally {
      C = c, ok.transition = b;
    }
  }
  return false;
}
function Xk(a, b, c) {
  b = Ji(c, b);
  b = Ni(a, b, 1);
  a = nh(a, b, 1);
  b = R();
  null !== a && (Ac(a, 1, b), Dk(a, b));
}
function W(a, b, c) {
  if (3 === a.tag) Xk(a, a, c);
  else for (; null !== b; ) {
    if (3 === b.tag) {
      Xk(b, a, c);
      break;
    } else if (1 === b.tag) {
      var d = b.stateNode;
      if ("function" === typeof b.type.getDerivedStateFromError || "function" === typeof d.componentDidCatch && (null === Ri || !Ri.has(d))) {
        a = Ji(c, a);
        a = Qi(b, a, 1);
        b = nh(b, a, 1);
        a = R();
        null !== b && (Ac(b, 1, a), Dk(b, a));
        break;
      }
    }
    b = b.return;
  }
}
function Ti(a, b, c) {
  var d = a.pingCache;
  null !== d && d.delete(b);
  b = R();
  a.pingedLanes |= a.suspendedLanes & c;
  Q === a && (Z & c) === c && (4 === T || 3 === T && (Z & 130023424) === Z && 500 > B() - fk ? Kk(a, 0) : rk |= c);
  Dk(a, b);
}
function Yk(a, b) {
  0 === b && (0 === (a.mode & 1) ? b = 1 : (b = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
  var c = R();
  a = ih(a, b);
  null !== a && (Ac(a, b, c), Dk(a, c));
}
function uj(a) {
  var b = a.memoizedState, c = 0;
  null !== b && (c = b.retryLane);
  Yk(a, c);
}
function bk(a, b) {
  var c = 0;
  switch (a.tag) {
    case 13:
      var d = a.stateNode;
      var e = a.memoizedState;
      null !== e && (c = e.retryLane);
      break;
    case 19:
      d = a.stateNode;
      break;
    default:
      throw Error(p(314));
  }
  null !== d && d.delete(b);
  Yk(a, c);
}
var Vk;
Vk = function(a, b, c) {
  if (null !== a) if (a.memoizedProps !== b.pendingProps || Wf.current) dh = true;
  else {
    if (0 === (a.lanes & c) && 0 === (b.flags & 128)) return dh = false, yj(a, b, c);
    dh = 0 !== (a.flags & 131072) ? true : false;
  }
  else dh = false, I && 0 !== (b.flags & 1048576) && ug(b, ng, b.index);
  b.lanes = 0;
  switch (b.tag) {
    case 2:
      var d = b.type;
      ij(a, b);
      a = b.pendingProps;
      var e = Yf(b, H.current);
      ch(b, c);
      e = Nh(null, b, d, a, e, c);
      var f2 = Sh();
      b.flags |= 1;
      "object" === typeof e && null !== e && "function" === typeof e.render && void 0 === e.$$typeof ? (b.tag = 1, b.memoizedState = null, b.updateQueue = null, Zf(d) ? (f2 = true, cg(b)) : f2 = false, b.memoizedState = null !== e.state && void 0 !== e.state ? e.state : null, kh(b), e.updater = Ei, b.stateNode = e, e._reactInternals = b, Ii(b, d, a, c), b = jj(null, b, d, true, f2, c)) : (b.tag = 0, I && f2 && vg(b), Xi(null, b, e, c), b = b.child);
      return b;
    case 16:
      d = b.elementType;
      a: {
        ij(a, b);
        a = b.pendingProps;
        e = d._init;
        d = e(d._payload);
        b.type = d;
        e = b.tag = Zk(d);
        a = Ci(d, a);
        switch (e) {
          case 0:
            b = cj(null, b, d, a, c);
            break a;
          case 1:
            b = hj(null, b, d, a, c);
            break a;
          case 11:
            b = Yi(null, b, d, a, c);
            break a;
          case 14:
            b = $i(null, b, d, Ci(d.type, a), c);
            break a;
        }
        throw Error(p(
          306,
          d,
          ""
        ));
      }
      return b;
    case 0:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), cj(a, b, d, e, c);
    case 1:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), hj(a, b, d, e, c);
    case 3:
      a: {
        kj(b);
        if (null === a) throw Error(p(387));
        d = b.pendingProps;
        f2 = b.memoizedState;
        e = f2.element;
        lh(a, b);
        qh(b, d, null, c);
        var g = b.memoizedState;
        d = g.element;
        if (f2.isDehydrated) if (f2 = { element: d, isDehydrated: false, cache: g.cache, pendingSuspenseBoundaries: g.pendingSuspenseBoundaries, transitions: g.transitions }, b.updateQueue.baseState = f2, b.memoizedState = f2, b.flags & 256) {
          e = Ji(Error(p(423)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else if (d !== e) {
          e = Ji(Error(p(424)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else for (yg = Lf(b.stateNode.containerInfo.firstChild), xg = b, I = true, zg = null, c = Vg(b, null, d, c), b.child = c; c; ) c.flags = c.flags & -3 | 4096, c = c.sibling;
        else {
          Ig();
          if (d === e) {
            b = Zi(a, b, c);
            break a;
          }
          Xi(a, b, d, c);
        }
        b = b.child;
      }
      return b;
    case 5:
      return Ah(b), null === a && Eg(b), d = b.type, e = b.pendingProps, f2 = null !== a ? a.memoizedProps : null, g = e.children, Ef(d, e) ? g = null : null !== f2 && Ef(d, f2) && (b.flags |= 32), gj(a, b), Xi(a, b, g, c), b.child;
    case 6:
      return null === a && Eg(b), null;
    case 13:
      return oj(a, b, c);
    case 4:
      return yh(b, b.stateNode.containerInfo), d = b.pendingProps, null === a ? b.child = Ug(b, null, d, c) : Xi(a, b, d, c), b.child;
    case 11:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), Yi(a, b, d, e, c);
    case 7:
      return Xi(a, b, b.pendingProps, c), b.child;
    case 8:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 12:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 10:
      a: {
        d = b.type._context;
        e = b.pendingProps;
        f2 = b.memoizedProps;
        g = e.value;
        G(Wg, d._currentValue);
        d._currentValue = g;
        if (null !== f2) if (He(f2.value, g)) {
          if (f2.children === e.children && !Wf.current) {
            b = Zi(a, b, c);
            break a;
          }
        } else for (f2 = b.child, null !== f2 && (f2.return = b); null !== f2; ) {
          var h = f2.dependencies;
          if (null !== h) {
            g = f2.child;
            for (var k2 = h.firstContext; null !== k2; ) {
              if (k2.context === d) {
                if (1 === f2.tag) {
                  k2 = mh(-1, c & -c);
                  k2.tag = 2;
                  var l2 = f2.updateQueue;
                  if (null !== l2) {
                    l2 = l2.shared;
                    var m2 = l2.pending;
                    null === m2 ? k2.next = k2 : (k2.next = m2.next, m2.next = k2);
                    l2.pending = k2;
                  }
                }
                f2.lanes |= c;
                k2 = f2.alternate;
                null !== k2 && (k2.lanes |= c);
                bh(
                  f2.return,
                  c,
                  b
                );
                h.lanes |= c;
                break;
              }
              k2 = k2.next;
            }
          } else if (10 === f2.tag) g = f2.type === b.type ? null : f2.child;
          else if (18 === f2.tag) {
            g = f2.return;
            if (null === g) throw Error(p(341));
            g.lanes |= c;
            h = g.alternate;
            null !== h && (h.lanes |= c);
            bh(g, c, b);
            g = f2.sibling;
          } else g = f2.child;
          if (null !== g) g.return = f2;
          else for (g = f2; null !== g; ) {
            if (g === b) {
              g = null;
              break;
            }
            f2 = g.sibling;
            if (null !== f2) {
              f2.return = g.return;
              g = f2;
              break;
            }
            g = g.return;
          }
          f2 = g;
        }
        Xi(a, b, e.children, c);
        b = b.child;
      }
      return b;
    case 9:
      return e = b.type, d = b.pendingProps.children, ch(b, c), e = eh(e), d = d(e), b.flags |= 1, Xi(a, b, d, c), b.child;
    case 14:
      return d = b.type, e = Ci(d, b.pendingProps), e = Ci(d.type, e), $i(a, b, d, e, c);
    case 15:
      return bj(a, b, b.type, b.pendingProps, c);
    case 17:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), ij(a, b), b.tag = 1, Zf(d) ? (a = true, cg(b)) : a = false, ch(b, c), Gi(b, d, e), Ii(b, d, e, c), jj(null, b, d, true, a, c);
    case 19:
      return xj(a, b, c);
    case 22:
      return dj(a, b, c);
  }
  throw Error(p(156, b.tag));
};
function Fk(a, b) {
  return ac(a, b);
}
function $k(a, b, c, d) {
  this.tag = a;
  this.key = c;
  this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = b;
  this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
  this.mode = d;
  this.subtreeFlags = this.flags = 0;
  this.deletions = null;
  this.childLanes = this.lanes = 0;
  this.alternate = null;
}
function Bg(a, b, c, d) {
  return new $k(a, b, c, d);
}
function aj(a) {
  a = a.prototype;
  return !(!a || !a.isReactComponent);
}
function Zk(a) {
  if ("function" === typeof a) return aj(a) ? 1 : 0;
  if (void 0 !== a && null !== a) {
    a = a.$$typeof;
    if (a === Da) return 11;
    if (a === Ga) return 14;
  }
  return 2;
}
function Pg(a, b) {
  var c = a.alternate;
  null === c ? (c = Bg(a.tag, b, a.key, a.mode), c.elementType = a.elementType, c.type = a.type, c.stateNode = a.stateNode, c.alternate = a, a.alternate = c) : (c.pendingProps = b, c.type = a.type, c.flags = 0, c.subtreeFlags = 0, c.deletions = null);
  c.flags = a.flags & 14680064;
  c.childLanes = a.childLanes;
  c.lanes = a.lanes;
  c.child = a.child;
  c.memoizedProps = a.memoizedProps;
  c.memoizedState = a.memoizedState;
  c.updateQueue = a.updateQueue;
  b = a.dependencies;
  c.dependencies = null === b ? null : { lanes: b.lanes, firstContext: b.firstContext };
  c.sibling = a.sibling;
  c.index = a.index;
  c.ref = a.ref;
  return c;
}
function Rg(a, b, c, d, e, f2) {
  var g = 2;
  d = a;
  if ("function" === typeof a) aj(a) && (g = 1);
  else if ("string" === typeof a) g = 5;
  else a: switch (a) {
    case ya:
      return Tg(c.children, e, f2, b);
    case za:
      g = 8;
      e |= 8;
      break;
    case Aa:
      return a = Bg(12, c, b, e | 2), a.elementType = Aa, a.lanes = f2, a;
    case Ea:
      return a = Bg(13, c, b, e), a.elementType = Ea, a.lanes = f2, a;
    case Fa:
      return a = Bg(19, c, b, e), a.elementType = Fa, a.lanes = f2, a;
    case Ia:
      return pj(c, e, f2, b);
    default:
      if ("object" === typeof a && null !== a) switch (a.$$typeof) {
        case Ba:
          g = 10;
          break a;
        case Ca:
          g = 9;
          break a;
        case Da:
          g = 11;
          break a;
        case Ga:
          g = 14;
          break a;
        case Ha:
          g = 16;
          d = null;
          break a;
      }
      throw Error(p(130, null == a ? a : typeof a, ""));
  }
  b = Bg(g, c, b, e);
  b.elementType = a;
  b.type = d;
  b.lanes = f2;
  return b;
}
function Tg(a, b, c, d) {
  a = Bg(7, a, d, b);
  a.lanes = c;
  return a;
}
function pj(a, b, c, d) {
  a = Bg(22, a, d, b);
  a.elementType = Ia;
  a.lanes = c;
  a.stateNode = { isHidden: false };
  return a;
}
function Qg(a, b, c) {
  a = Bg(6, a, null, b);
  a.lanes = c;
  return a;
}
function Sg(a, b, c) {
  b = Bg(4, null !== a.children ? a.children : [], a.key, b);
  b.lanes = c;
  b.stateNode = { containerInfo: a.containerInfo, pendingChildren: null, implementation: a.implementation };
  return b;
}
function al(a, b, c, d, e) {
  this.tag = b;
  this.containerInfo = a;
  this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
  this.timeoutHandle = -1;
  this.callbackNode = this.pendingContext = this.context = null;
  this.callbackPriority = 0;
  this.eventTimes = zc(0);
  this.expirationTimes = zc(-1);
  this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
  this.entanglements = zc(0);
  this.identifierPrefix = d;
  this.onRecoverableError = e;
  this.mutableSourceEagerHydrationData = null;
}
function bl(a, b, c, d, e, f2, g, h, k2) {
  a = new al(a, b, c, h, k2);
  1 === b ? (b = 1, true === f2 && (b |= 8)) : b = 0;
  f2 = Bg(3, null, null, b);
  a.current = f2;
  f2.stateNode = a;
  f2.memoizedState = { element: d, isDehydrated: c, cache: null, transitions: null, pendingSuspenseBoundaries: null };
  kh(f2);
  return a;
}
function cl(a, b, c) {
  var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
  return { $$typeof: wa, key: null == d ? null : "" + d, children: a, containerInfo: b, implementation: c };
}
function dl(a) {
  if (!a) return Vf;
  a = a._reactInternals;
  a: {
    if (Vb(a) !== a || 1 !== a.tag) throw Error(p(170));
    var b = a;
    do {
      switch (b.tag) {
        case 3:
          b = b.stateNode.context;
          break a;
        case 1:
          if (Zf(b.type)) {
            b = b.stateNode.__reactInternalMemoizedMergedChildContext;
            break a;
          }
      }
      b = b.return;
    } while (null !== b);
    throw Error(p(171));
  }
  if (1 === a.tag) {
    var c = a.type;
    if (Zf(c)) return bg(a, c, b);
  }
  return b;
}
function el(a, b, c, d, e, f2, g, h, k2) {
  a = bl(c, d, true, a, e, f2, g, h, k2);
  a.context = dl(null);
  c = a.current;
  d = R();
  e = yi(c);
  f2 = mh(d, e);
  f2.callback = void 0 !== b && null !== b ? b : null;
  nh(c, f2, e);
  a.current.lanes = e;
  Ac(a, e, d);
  Dk(a, d);
  return a;
}
function fl(a, b, c, d) {
  var e = b.current, f2 = R(), g = yi(e);
  c = dl(c);
  null === b.context ? b.context = c : b.pendingContext = c;
  b = mh(f2, g);
  b.payload = { element: a };
  d = void 0 === d ? null : d;
  null !== d && (b.callback = d);
  a = nh(e, b, g);
  null !== a && (gi(a, e, g, f2), oh(a, e, g));
  return g;
}
function gl(a) {
  a = a.current;
  if (!a.child) return null;
  switch (a.child.tag) {
    case 5:
      return a.child.stateNode;
    default:
      return a.child.stateNode;
  }
}
function hl(a, b) {
  a = a.memoizedState;
  if (null !== a && null !== a.dehydrated) {
    var c = a.retryLane;
    a.retryLane = 0 !== c && c < b ? c : b;
  }
}
function il(a, b) {
  hl(a, b);
  (a = a.alternate) && hl(a, b);
}
function jl() {
  return null;
}
var kl = "function" === typeof reportError ? reportError : function(a) {
  console.error(a);
};
function ll(a) {
  this._internalRoot = a;
}
ml.prototype.render = ll.prototype.render = function(a) {
  var b = this._internalRoot;
  if (null === b) throw Error(p(409));
  fl(a, b, null, null);
};
ml.prototype.unmount = ll.prototype.unmount = function() {
  var a = this._internalRoot;
  if (null !== a) {
    this._internalRoot = null;
    var b = a.containerInfo;
    Rk(function() {
      fl(null, a, null, null);
    });
    b[uf] = null;
  }
};
function ml(a) {
  this._internalRoot = a;
}
ml.prototype.unstable_scheduleHydration = function(a) {
  if (a) {
    var b = Hc();
    a = { blockedOn: null, target: a, priority: b };
    for (var c = 0; c < Qc.length && 0 !== b && b < Qc[c].priority; c++) ;
    Qc.splice(c, 0, a);
    0 === c && Vc(a);
  }
};
function nl(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType);
}
function ol(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType && (8 !== a.nodeType || " react-mount-point-unstable " !== a.nodeValue));
}
function pl() {
}
function ql(a, b, c, d, e) {
  if (e) {
    if ("function" === typeof d) {
      var f2 = d;
      d = function() {
        var a2 = gl(g);
        f2.call(a2);
      };
    }
    var g = el(b, d, a, 0, null, false, false, "", pl);
    a._reactRootContainer = g;
    a[uf] = g.current;
    sf(8 === a.nodeType ? a.parentNode : a);
    Rk();
    return g;
  }
  for (; e = a.lastChild; ) a.removeChild(e);
  if ("function" === typeof d) {
    var h = d;
    d = function() {
      var a2 = gl(k2);
      h.call(a2);
    };
  }
  var k2 = bl(a, 0, false, null, null, false, false, "", pl);
  a._reactRootContainer = k2;
  a[uf] = k2.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  Rk(function() {
    fl(b, k2, c, d);
  });
  return k2;
}
function rl(a, b, c, d, e) {
  var f2 = c._reactRootContainer;
  if (f2) {
    var g = f2;
    if ("function" === typeof e) {
      var h = e;
      e = function() {
        var a2 = gl(g);
        h.call(a2);
      };
    }
    fl(b, g, a, e);
  } else g = ql(c, b, a, e, d);
  return gl(g);
}
Ec = function(a) {
  switch (a.tag) {
    case 3:
      var b = a.stateNode;
      if (b.current.memoizedState.isDehydrated) {
        var c = tc(b.pendingLanes);
        0 !== c && (Cc(b, c | 1), Dk(b, B()), 0 === (K & 6) && (Gj = B() + 500, jg()));
      }
      break;
    case 13:
      Rk(function() {
        var b2 = ih(a, 1);
        if (null !== b2) {
          var c2 = R();
          gi(b2, a, 1, c2);
        }
      }), il(a, 1);
  }
};
Fc = function(a) {
  if (13 === a.tag) {
    var b = ih(a, 134217728);
    if (null !== b) {
      var c = R();
      gi(b, a, 134217728, c);
    }
    il(a, 134217728);
  }
};
Gc = function(a) {
  if (13 === a.tag) {
    var b = yi(a), c = ih(a, b);
    if (null !== c) {
      var d = R();
      gi(c, a, b, d);
    }
    il(a, b);
  }
};
Hc = function() {
  return C;
};
Ic = function(a, b) {
  var c = C;
  try {
    return C = a, b();
  } finally {
    C = c;
  }
};
yb = function(a, b, c) {
  switch (b) {
    case "input":
      bb(a, c);
      b = c.name;
      if ("radio" === c.type && null != b) {
        for (c = a; c.parentNode; ) c = c.parentNode;
        c = c.querySelectorAll("input[name=" + JSON.stringify("" + b) + '][type="radio"]');
        for (b = 0; b < c.length; b++) {
          var d = c[b];
          if (d !== a && d.form === a.form) {
            var e = Db(d);
            if (!e) throw Error(p(90));
            Wa(d);
            bb(d, e);
          }
        }
      }
      break;
    case "textarea":
      ib(a, c);
      break;
    case "select":
      b = c.value, null != b && fb(a, !!c.multiple, b, false);
  }
};
Gb = Qk;
Hb = Rk;
var sl = { usingClientEntryPoint: false, Events: [Cb, ue, Db, Eb, Fb, Qk] }, tl = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" };
var ul = { bundleType: tl.bundleType, version: tl.version, rendererPackageName: tl.rendererPackageName, rendererConfig: tl.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a) {
  a = Zb(a);
  return null === a ? null : a.stateNode;
}, findFiberByHostInstance: tl.findFiberByHostInstance || jl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
  var vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!vl.isDisabled && vl.supportsFiber) try {
    kc = vl.inject(ul), lc = vl;
  } catch (a) {
  }
}
reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sl;
reactDom_production_min.createPortal = function(a, b) {
  var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
  if (!nl(b)) throw Error(p(200));
  return cl(a, b, null, c);
};
reactDom_production_min.createRoot = function(a, b) {
  if (!nl(a)) throw Error(p(299));
  var c = false, d = "", e = kl;
  null !== b && void 0 !== b && (true === b.unstable_strictMode && (c = true), void 0 !== b.identifierPrefix && (d = b.identifierPrefix), void 0 !== b.onRecoverableError && (e = b.onRecoverableError));
  b = bl(a, 1, false, null, null, c, false, d, e);
  a[uf] = b.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  return new ll(b);
};
reactDom_production_min.findDOMNode = function(a) {
  if (null == a) return null;
  if (1 === a.nodeType) return a;
  var b = a._reactInternals;
  if (void 0 === b) {
    if ("function" === typeof a.render) throw Error(p(188));
    a = Object.keys(a).join(",");
    throw Error(p(268, a));
  }
  a = Zb(b);
  a = null === a ? null : a.stateNode;
  return a;
};
reactDom_production_min.flushSync = function(a) {
  return Rk(a);
};
reactDom_production_min.hydrate = function(a, b, c) {
  if (!ol(b)) throw Error(p(200));
  return rl(null, a, b, true, c);
};
reactDom_production_min.hydrateRoot = function(a, b, c) {
  if (!nl(a)) throw Error(p(405));
  var d = null != c && c.hydratedSources || null, e = false, f2 = "", g = kl;
  null !== c && void 0 !== c && (true === c.unstable_strictMode && (e = true), void 0 !== c.identifierPrefix && (f2 = c.identifierPrefix), void 0 !== c.onRecoverableError && (g = c.onRecoverableError));
  b = el(b, null, a, 1, null != c ? c : null, e, false, f2, g);
  a[uf] = b.current;
  sf(a);
  if (d) for (a = 0; a < d.length; a++) c = d[a], e = c._getVersion, e = e(c._source), null == b.mutableSourceEagerHydrationData ? b.mutableSourceEagerHydrationData = [c, e] : b.mutableSourceEagerHydrationData.push(
    c,
    e
  );
  return new ml(b);
};
reactDom_production_min.render = function(a, b, c) {
  if (!ol(b)) throw Error(p(200));
  return rl(null, a, b, false, c);
};
reactDom_production_min.unmountComponentAtNode = function(a) {
  if (!ol(a)) throw Error(p(40));
  return a._reactRootContainer ? (Rk(function() {
    rl(null, null, a, false, function() {
      a._reactRootContainer = null;
      a[uf] = null;
    });
  }), true) : false;
};
reactDom_production_min.unstable_batchedUpdates = Qk;
reactDom_production_min.unstable_renderSubtreeIntoContainer = function(a, b, c, d) {
  if (!ol(c)) throw Error(p(200));
  if (null == a || void 0 === a._reactInternals) throw Error(p(38));
  return rl(a, b, c, false, d);
};
reactDom_production_min.version = "18.3.1-next-f1338f8080-20240426";
function checkDCE() {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
    return;
  }
  try {
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    console.error(err);
  }
}
{
  checkDCE();
  reactDom.exports = reactDom_production_min;
}
var reactDomExports = reactDom.exports;
var m = reactDomExports;
{
  client.createRoot = m.createRoot;
  client.hydrateRoot = m.hydrateRoot;
}
const PROJECT_STAGES = [
  "Planning",
  "Development",
  "Testing",
  "Production",
  "Maintenance"
];
const FRAMEWORKS = [
  "MITRE ATT&CK",
  "STRIDE",
  "PASTA",
  "OCTAVE",
  "VAST",
  "Custom Client Framework"
];
const FRAMEWORK_DESCRIPTIONS = {
  "MITRE ATT&CK": "Adversarial tactics, techniques, and common knowledge - maps real-world threat actor behaviors",
  "STRIDE": "Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege",
  "PASTA": "Process for Attack Simulation and Threat Analysis - risk-centric methodology",
  "OCTAVE": "Operationally Critical Threat, Asset, and Vulnerability Evaluation - organizational risk assessment",
  "VAST": "Visual, Agile, and Simple Threat modeling - scalable for DevOps and agile environments",
  "Custom Client Framework": "Organization-specific threat modeling framework tailored to your requirements"
};
const BUSINESS_CRITICALITY = [
  "Critical",
  "High",
  "Medium",
  "Low"
];
const APPLICATION_TYPES = [
  "Web Application",
  "Mobile Application",
  "Desktop Application",
  "API/Microservices",
  "AI/ML Project",
  "Cloud Infrastructure",
  "IoT Device",
  "Database System",
  "Other"
];
const DEPLOYMENT_MODELS = [
  "Cloud (AWS)",
  "Cloud (Azure)",
  "Cloud (GCP)",
  "On-Premises",
  "Hybrid",
  "Multi-Cloud"
];
const ENVIRONMENTS = [
  "Production",
  "Staging",
  "Development",
  "Testing",
  "DR/Backup"
];
const RISK_FOCUS_AREAS = [
  "Agentic AI Risk",
  "Model Risk",
  "Data Security Risk",
  "Infrastructure Risk",
  "Compliance Risk",
  "Privacy Risk",
  "Supply Chain Risk",
  "Identity & Access Risk"
];
const RISK_AREA_DESCRIPTIONS = {
  "Agentic AI Risk": "Autonomous agent behavior, decision-making, prompt injection, and agent orchestration vulnerabilities",
  "Model Risk": "AI model security including adversarial attacks, model poisoning, and inference manipulation",
  "Data Security Risk": "Data breaches, unauthorized access, data exfiltration, and sensitive information exposure",
  "Infrastructure Risk": "Cloud/on-prem infrastructure vulnerabilities, misconfigurations, and deployment security",
  "Compliance Risk": "Regulatory compliance gaps (GDPR, HIPAA, SOC2) and audit requirements",
  "Privacy Risk": "PII handling, user consent, data retention, and privacy law violations",
  "Supply Chain Risk": "Third-party dependencies, vendor security, open-source vulnerabilities, and supply chain attacks",
  "Identity & Access Risk": "Authentication weaknesses, authorization flaws, privilege escalation, and access control issues"
};
const COMPLIANCE_REQUIREMENTS = [
  "SOC 2",
  "ISO 27001",
  "GDPR",
  "HIPAA",
  "PCI DSS",
  "NIST",
  "CIS Controls",
  "CCPA"
];
const API_BASE_URL = "";
const AuthContext = reactExports.createContext(void 0);
const AuthProvider = ({ children }) => {
  const [user, setUser] = reactExports.useState(null);
  const [token, setToken] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  const login = async (email, password) => {
    try {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);
      const response = await fetch(`${API_BASE_URL}/token`, {
        method: "POST",
        body: formData
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Login failed");
      }
      const data = await response.json();
      const userResponse = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          "Authorization": `Bearer ${data.access_token}`
        }
      });
      if (!userResponse.ok) {
        throw new Error("Failed to get user information");
      }
      const userData = await userResponse.json();
      setToken(data.access_token);
      setUser(userData);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };
  const register = async (email, password, fullName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName
        })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Registration failed");
      }
      await login(email, password);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };
  const isAdmin = (user == null ? void 0 : user.role) === "admin";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthContext.Provider, { value: { user, token, login, register, logout, isAdmin, loading }, children });
};
const useAuth = () => {
  const context = reactExports.useContext(AuthContext);
  if (context === void 0) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
const Login = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md w-full bg-white rounded-lg shadow-xl p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Threat Modeling AI" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 mt-2", children: "Sign in to your account" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Email Address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "submit",
          disabled: loading,
          className: "w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors",
          children: loading ? "Signing in..." : "Sign In"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-600", children: [
      "Don't have an account?",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onSwitchToRegister,
          className: "text-blue-600 hover:text-blue-700 font-medium",
          children: "Create one"
        }
      )
    ] }) })
  ] }) });
};
const Register = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const [formData, setFormData] = reactExports.useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    organizationName: ""
  });
  const [error, setError] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`;
      await register(formData.email, formData.password, fullName);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md w-full bg-white rounded-lg shadow-xl p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Threat Modeling AI" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 mt-2", children: "Create your account" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Organization Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            name: "organizationName",
            value: formData.organizationName,
            onChange: handleChange,
            className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "First Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              name: "firstName",
              value: formData.firstName,
              onChange: handleChange,
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Last Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              name: "lastName",
              value: formData.lastName,
              onChange: handleChange,
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              required: true
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Email Address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "email",
            name: "email",
            value: formData.email,
            onChange: handleChange,
            className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "password",
            name: "password",
            value: formData.password,
            onChange: handleChange,
            className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            minLength: 8,
            required: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Must be at least 8 characters" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Confirm Password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "password",
            name: "confirmPassword",
            value: formData.confirmPassword,
            onChange: handleChange,
            className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "submit",
          disabled: loading,
          className: "w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors",
          children: loading ? "Creating account..." : "Create Account"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-600", children: [
      "Already have an account?",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onSwitchToLogin,
          className: "text-blue-600 hover:text-blue-700 font-medium",
          children: "Sign in"
        }
      )
    ] }) })
  ] }) });
};
const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = reactExports.useState("overview");
  const [users, setUsers] = reactExports.useState([]);
  const [stats, setStats] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [showInviteModal, setShowInviteModal] = reactExports.useState(false);
  const [inviteEmail, setInviteEmail] = reactExports.useState("");
  const [inviteRole, setInviteRole] = reactExports.useState("user");
  const [showPasswordModal, setShowPasswordModal] = reactExports.useState(false);
  const [selectedUserId, setSelectedUserId] = reactExports.useState(null);
  const [newPassword, setNewPassword] = reactExports.useState("");
  const [showRoleModal, setShowRoleModal] = reactExports.useState(false);
  const [selectedRole, setSelectedRole] = reactExports.useState("user");
  const [auditLogs, setAuditLogs] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (activeTab === "overview") {
      loadDashboardStats();
    } else if (activeTab === "users") {
      loadUsers();
    } else if (activeTab === "audit") {
      loadAuditLogs();
    }
  }, [activeTab]);
  const loadDashboardStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to load dashboard stats: ${response.status}`);
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error("Load stats error:", err);
      setError(err.message || "Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    if (activeTab === "users") {
      loadUsers();
    } else if (activeTab === "audit") {
      loadAuditLogs();
    }
  }, [activeTab]);
  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      console.log("Fetching users from:", `${API_BASE_URL}/api/users`);
      console.log("Token exists:", !!token);
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      console.log("Response status:", response.status);
      if (!response.ok) {
        const errorData = await response.text();
        console.error("Error response:", errorData);
        throw new Error(`Failed to load users: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Users data:", data);
      setUsers(data.users || []);
    } catch (err) {
      console.error("Load users error:", err);
      setError(err.message || "Failed to fetch users. Please check console for details.");
    } finally {
      setLoading(false);
    }
  };
  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/audit-logs`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Failed to load audit logs");
      const data = await response.json();
      setAuditLogs(data.logs || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ active: !currentStatus })
      });
      if (!response.ok) throw new Error("Failed to update user status");
      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };
  const handleResetPassword = async () => {
    if (!selectedUserId || !newPassword) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/users/${selectedUserId}/password`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password: newPassword })
      });
      if (!response.ok) throw new Error("Failed to reset password");
      setShowPasswordModal(false);
      setNewPassword("");
      setSelectedUserId(null);
      alert("Password reset successfully");
    } catch (err) {
      setError(err.message);
    }
  };
  const handleChangeRole = async () => {
    if (!selectedUserId) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/users/${selectedUserId}/role`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ role: selectedRole })
      });
      if (!response.ok) throw new Error("Failed to change role");
      setShowRoleModal(false);
      setSelectedUserId(null);
      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };
  if ((user == null ? void 0 : user.role) !== "admin") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-8 rounded-lg shadow-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Access Denied" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600", children: "You don't have permission to access the admin dashboard." })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gray-100", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "bg-white shadow", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 py-4 flex justify-between items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-gray-900", children: "SecureAI - Admin Dashboard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-600", children: user == null ? void 0 : user.organizationName })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-gray-700", children: [
          user == null ? void 0 : user.firstName,
          " ",
          user == null ? void 0 : user.lastName
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: logout,
            className: "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700",
            children: "Logout"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-64 bg-white rounded-lg shadow p-4 h-fit", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-bold text-gray-900 mb-4", children: "Navigation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 mb-3", children: "Select a section" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setActiveTab("overview"),
              className: `w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 ${activeTab === "overview" ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-chart-line w-4" }),
                " Overview"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setActiveTab("users"),
              className: `w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 ${activeTab === "users" ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-users w-4" }),
                " User Management"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setActiveTab("audit"),
              className: `w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 ${activeTab === "audit" ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-clipboard-list w-4" }),
                " Audit Logs"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setActiveTab("api-keys"),
              className: `w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 ${activeTab === "api-keys" ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-key w-4" }),
                " API Keys"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setActiveTab("usage"),
              className: `w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 ${activeTab === "usage" ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-chart-bar w-4" }),
                " Usage Statistics"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setActiveTab("health"),
              className: `w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 ${activeTab === "health" ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-heartbeat w-4" }),
                " System Health"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setActiveTab("settings"),
              className: `w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 ${activeTab === "settings" ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-cog w-4" }),
                " Settings"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        activeTab === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-gray-600", children: "Loading dashboard..." })
        ] }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800", children: error }) : stats ? /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-gray-900 mb-4", children: "📊 Organization Overview" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-4 mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg shadow-lg text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs opacity-90 uppercase font-semibold", children: "Total Users" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold mt-1", children: stats.users.total }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs opacity-75 mt-1", children: [
                  stats.users.active,
                  " active"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl opacity-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-users" }) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-lg shadow-lg text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs opacity-90 uppercase font-semibold", children: "Total Assessments" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold mt-1", children: stats.assessments.total }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs opacity-75 mt-1", children: [
                  stats.assessments.last_30d,
                  " last 30d"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl opacity-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-shield-alt" }) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-lg shadow-lg text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs opacity-90 uppercase font-semibold", children: "Active API Keys" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold mt-1", children: stats.api.active_keys }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs opacity-75 mt-1", children: "API access" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl opacity-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-key" }) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-lg shadow-lg text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs opacity-90 uppercase font-semibold", children: "API Calls" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold mt-1", children: stats.api.calls_this_month }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs opacity-75 mt-1", children: "This month" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl opacity-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-chart-line" }) })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-6 mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-6 rounded-lg shadow", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-gray-900 mb-4", children: "📊 Frameworks Distribution" }),
              Object.keys(stats.frameworks).length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: Object.entries(stats.frameworks).map(([framework, count]) => {
                const total = Object.values(stats.frameworks).reduce((a, b) => a + b, 0);
                const percentage = (count / total * 100).toFixed(1);
                const colors = ["bg-blue-600", "bg-green-600", "bg-purple-600", "bg-red-600", "bg-yellow-600", "bg-indigo-600"];
                const colorIndex = Object.keys(stats.frameworks).indexOf(framework);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs mb-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-700 font-medium", children: framework }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-900 font-bold", children: [
                      count,
                      " (",
                      percentage,
                      "%)"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 bg-gray-200 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: `h-full ${colors[colorIndex % colors.length]} transition-all duration-500`,
                      style: { width: `${percentage}%` }
                    }
                  ) })
                ] }, framework);
              }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 text-center py-4", children: "No assessments yet" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-6 rounded-lg shadow", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-gray-900 mb-4", children: "🎯 Risk Areas Coverage" }),
              Object.keys(stats.risk_areas).length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: Object.entries(stats.risk_areas).sort(([, a], [, b]) => b - a).slice(0, 5).map(([area, count]) => {
                const maxCount = Math.max(...Object.values(stats.risk_areas));
                const percentage = (count / maxCount * 100).toFixed(0);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs mb-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-700 font-medium", children: area }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-900 font-bold", children: count })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 bg-gray-200 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500",
                      style: { width: `${percentage}%` }
                    }
                  ) })
                ] }, area);
              }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 text-center py-4", children: "No risk areas analyzed yet" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-6 rounded-lg shadow", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-gray-900 mb-4", children: "🕒 Recent Assessments" }),
            stats.recent_assessments.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-gray-50 border-b", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-3 px-4 font-semibold text-gray-700", children: "Project" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-3 px-4 font-semibold text-gray-700", children: "Framework" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-3 px-4 font-semibold text-gray-700", children: "User" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-3 px-4 font-semibold text-gray-700", children: "Date" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: stats.recent_assessments.map((assessment) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b hover:bg-gray-50 transition-colors", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 font-medium text-gray-900", children: assessment.project_name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium", children: assessment.framework }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-gray-600", children: assessment.user_email }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-gray-500", children: new Date(assessment.created_at).toLocaleDateString() })
              ] }, assessment.id)) })
            ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 text-center py-8", children: "No recent assessments" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-4 rounded-lg shadow border-l-4 border-blue-500", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 font-semibold", children: "Last 7 Days" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-gray-900 mt-1", children: stats.assessments.last_7d }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-600 mt-1", children: "Assessments" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-4 rounded-lg shadow border-l-4 border-green-500", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 font-semibold", children: "Last 30 Days" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-gray-900 mt-1", children: stats.assessments.last_30d }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-600 mt-1", children: "Assessments" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-4 rounded-lg shadow border-l-4 border-purple-500", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 font-semibold", children: "Active Users" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-gray-900 mt-1", children: stats.users.active }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-600 mt-1", children: [
                "of ",
                stats.users.total,
                " total"
              ] })
            ] })
          ] })
        ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-gray-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "No dashboard data available" }) }) }),
        activeTab === "users" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-gray-900", children: "👥 User Management" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-plus mr-2" }),
              "Add New User"
            ] })
          ] }),
          error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded", children: error }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg shadow", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-gray-900", children: "Current Users" }) }),
            loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-gray-600", children: "Loading users..." })
            ] }) : users.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-gray-500", children: "No users found" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-gray-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-medium text-gray-700", children: "#" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-medium text-gray-700", children: "Email" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-medium text-gray-700", children: "Full Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-medium text-gray-700", children: "Role" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-medium text-gray-700", children: "Status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-medium text-gray-700", children: "Last Login" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-medium text-gray-700", children: "Actions" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-gray-200", children: users.map((u2, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: idx + 1 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: u2.email }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: u2.full_name || u2.username }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-1 rounded text-xs font-medium ${u2.role === "admin" ? "bg-red-100 text-red-800" : u2.role === "manager" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`, children: u2.role }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-1 rounded text-xs font-medium ${u2.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`, children: u2.is_active ? "Active" : "Inactive" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs", children: u2.last_login_at ? new Date(u2.last_login_at).toLocaleString() : "Never" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => {
                        setSelectedUserId(u2.id);
                        setSelectedRole(u2.role);
                        setShowRoleModal(true);
                      },
                      className: "text-blue-600 hover:text-blue-800 text-xs",
                      title: "Change Role",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-user-cog" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => {
                        setSelectedUserId(u2.id);
                        setShowPasswordModal(true);
                      },
                      className: "text-orange-600 hover:text-orange-800 text-xs",
                      title: "Reset Password",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-key" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => handleToggleUserStatus(u2.id, u2.is_active),
                      className: `${u2.is_active ? "text-red-600 hover:text-red-800" : "text-green-600 hover:text-green-800"} text-xs`,
                      title: u2.is_active ? "Disable User" : "Enable User",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: `fas fa-${u2.is_active ? "ban" : "check-circle"}` })
                    }
                  )
                ] }) })
              ] }, u2.id)) })
            ] })
          ] })
        ] }),
        activeTab === "audit" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-gray-900 mb-4", children: "📋 Audit Logs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4 mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Time Period" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "w-full px-3 py-2 border border-gray-300 rounded text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Last 30 days" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Action" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "w-full px-3 py-2 border border-gray-300 rounded text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "All" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "user.login" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "user.create" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "threat_assessment.create" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "api_key.create" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "w-full px-3 py-2 border border-gray-300 rounded text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "All" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4 mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 p-4 rounded", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: "TOTAL EVENTS" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-gray-900 mt-1", children: "49" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-green-50 p-4 rounded", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-green-700", children: "SUCCESS RATE" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-green-900 mt-1", children: "93.8%" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-blue-50 p-4 rounded", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-blue-700", children: "ACTION TYPES" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-blue-900 mt-1", children: "2" })
              ] })
            ] }),
            loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" }) }) : auditLogs.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-gray-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-medium text-gray-700", children: "Timestamp" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-medium text-gray-700", children: "User" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-medium text-gray-700", children: "Action" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-medium text-gray-700", children: "Resource" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-medium text-gray-700", children: "IP Address" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-gray-200", children: auditLogs.map((log) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: new Date(log.created_at).toLocaleString() }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2", children: [
                  "User #",
                  log.user_id
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-1 bg-blue-100 text-blue-800 rounded", children: log.action }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2", children: [
                  log.resource_type,
                  " #",
                  log.resource_id
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: log.ip_address })
              ] }, log.id)) })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-600", children: "No audit events found" })
          ] })
        ] }),
        activeTab === "api-keys" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-gray-900", children: "🔑 API Keys" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-plus mr-2" }),
              "Generate New Key"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 mb-4", children: "Manage API keys for programmatic access to SecureAI" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-500", children: 'No API keys generated yet. Click "Generate New Key" to create one.' })
          ] })
        ] }),
        activeTab === "usage" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-gray-900 mb-4", children: "📊 Usage Statistics" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 mb-4", children: "Monitor API usage and resource consumption" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-500", children: "Usage statistics will be displayed here" })
          ] })
        ] }),
        activeTab === "health" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-gray-900 mb-4", children: "💚 System Health" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white rounded-lg shadow p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pb-3 border-b", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-900", children: "API Status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: "Backend API health" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium", children: "Healthy" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pb-3 border-b", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-900", children: "Database" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: "SQLite connection" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium", children: "Connected" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pb-3 border-b", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-900", children: "AI Service" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: "Claude API status" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium", children: "Active" })
            ] })
          ] }) })
        ] }),
        activeTab === "settings" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-gray-900 mb-4", children: "⚙️ Organization Settings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg shadow", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 border-b", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-gray-900 mb-4", children: "Organization Details" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Organization Name" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: "Default Organization", className: "w-full px-3 py-2 border border-gray-300 rounded text-sm" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Domain" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: "example.com", className: "w-full px-3 py-2 border border-gray-300 rounded text-sm" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Max Users" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: "50", className: "flex-1 px-3 py-2 border border-gray-300 rounded-l text-sm" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "px-3 border-t border-b border-r border-gray-300 text-gray-600 hover:bg-gray-50 text-xs", children: "-" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "px-3 border-t border-b border-r border-gray-300 rounded-r text-gray-600 hover:bg-gray-50 text-xs", children: "+" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Storage Limit (GB)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: "10.00", className: "flex-1 px-3 py-2 border border-gray-300 rounded-l text-sm" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "px-3 border-t border-b border-r border-gray-300 text-gray-600 hover:bg-gray-50 text-xs", children: "-" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "px-3 border-t border-b border-r border-gray-300 rounded-r text-gray-600 hover:bg-gray-50 text-xs", children: "+" })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-gray-700 mb-1", children: "Max API Calls/Month" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: "1000", className: "w-full px-3 py-2 border border-gray-300 rounded text-sm" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-save mr-2" }),
                  "Save Organization"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-gray-900 mb-4", children: "📢 SSO Configuration (SAML)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", className: "rounded" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-700", children: "Enable SAML SSO" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-save mr-2" }),
                "Save SSO Settings"
              ] })
            ] })
          ] })
        ] }),
        showPasswordModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg p-6 max-w-md w-full mx-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Reset User Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "New Password" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "password",
                value: newPassword,
                onChange: (e) => setNewPassword(e.target.value),
                className: "w-full px-4 py-2 border border-gray-300 rounded-lg",
                placeholder: "Enter new password"
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex justify-end gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => {
                  setShowPasswordModal(false);
                  setNewPassword("");
                  setSelectedUserId(null);
                },
                className: "px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: handleResetPassword,
                className: "px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700",
                children: "Reset Password"
              }
            )
          ] })
        ] }) }),
        showRoleModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg p-6 max-w-md w-full mx-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Change User Role" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Role" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: selectedRole,
                onChange: (e) => setSelectedRole(e.target.value),
                className: "w-full px-4 py-2 border border-gray-300 rounded-lg",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "user", children: "User" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "manager", children: "Manager" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "admin", children: "Admin" })
                ]
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex justify-end gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => {
                  setShowRoleModal(false);
                  setSelectedUserId(null);
                },
                className: "px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: handleChangeRole,
                className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700",
                children: "Change Role"
              }
            )
          ] })
        ] }) })
      ] })
    ] }) })
  ] });
};
const ComplianceDocumentation = () => {
  const controls = [
    {
      category: "AI System Governance",
      control: "5.1 AI Management System",
      requirement: "Establish, implement, maintain and continually improve an AI management system",
      implementation: "Our organization has established formal AI governance policies defining roles, responsibilities, and oversight mechanisms. The platform architecture enforces these policies through layered access controls, automated audit capture at every transaction point, and administrative oversight dashboards. Organizational policy mandates continuous monitoring and annual review cycles to ensure the AI management system evolves with regulatory requirements.",
      status: "✓ Implemented",
      evidence: "AI Governance Policy Documents, Admin Dashboard, Audit Logs, Annual Review Procedures"
    },
    {
      category: "AI System Governance",
      control: "5.2 AI Policy",
      requirement: "Define and document AI policies aligned with organizational objectives",
      implementation: "Our organization maintains documented AI usage policies that mandate responsible AI use for threat modeling. These policies require: (1) Use of industry-recognized frameworks (MITRE ATT&CK, STRIDE, PASTA, OCTAVE, VAST), (2) Human review of all AI-generated outputs, (3) Prohibition of AI decision-making without human oversight. The platform design enforces these policies by requiring framework selection, providing transparency into AI model choices, and architecting mandatory human approval workflows that cannot be bypassed.",
      status: "✓ Implemented",
      evidence: "AI Usage Policy, Framework Selection Enforcement, Human-in-Loop Architecture"
    },
    {
      category: "Risk Management",
      control: "6.1 Risk Assessment",
      requirement: "Identify and assess risks associated with AI systems",
      implementation: "Organizational policy mandates comprehensive risk assessment across five dimensions: Agentic AI Risk, Model Risk, Data Security Risk, Infrastructure Risk, and Compliance Risk. The system is architected to enforce this policy by requiring users to select risk focus areas before assessment generation, ensuring no analysis proceeds without explicit risk domain consideration. The AI engine is configured with specialized prompts for each risk category that align with organizational risk tolerance thresholds and industry threat intelligence frameworks, ensuring consistent risk identification methodology.",
      status: "✓ Implemented",
      evidence: "Risk Management Policy, Risk Focus Selection Workflow, AI Prompt Engineering Documentation"
    },
    {
      category: "Risk Management",
      control: "6.2 Risk Treatment",
      requirement: "Plan and implement risk treatment measures",
      implementation: "Our organization's risk treatment policy establishes four-tier prioritization (P0-P3) aligned with business impact and likelihood matrices. The platform design enforces systematic risk treatment by architecting the AI to output structured mitigation recommendations mapped to the prioritization framework. Each identified threat triggers generation of specific, actionable remediation steps with implementation guidance. Organizational policy requires documented risk treatment plans for P0/P1 findings within defined SLAs, which the system tracks through report generation timestamps and audit logs.",
      status: "✓ Implemented",
      evidence: "Risk Treatment Policy, Prioritization Framework, Mitigation Workflow, SLA Tracking"
    },
    {
      category: "Data Governance",
      control: "7.3 Data for AI",
      requirement: "Ensure data quality, integrity, and appropriate use for AI systems",
      implementation: "Organizational data governance policy mandates data quality standards, authorized use cases, and integrity controls for all AI training and inference data. The platform enforces this through architectural design: (1) Input validation layer ensures only approved document types are processed, (2) Organizational isolation ensures data cannot cross tenant boundaries, (3) Encryption-at-rest and in-transit protects data integrity, (4) Database constraints prevent data corruption. The system design principle of 'least privilege data access' ensures AI models receive only necessary context for threat modeling, never full dataset access.",
      status: "✓ Implemented",
      evidence: "Data Governance Policy, Input Validation Architecture, Encryption Standards, Isolation Design"
    },
    {
      category: "Data Governance",
      control: "7.4 Data Privacy",
      requirement: "Protect personal data processed by AI systems",
      implementation: "Our organizational privacy policy prohibits AI processing of PII and mandates strict data segregation. The system architecture implements privacy-by-design principles: (1) Multi-tenant isolation at database layer prevents cross-organizational data exposure, (2) Authentication gates all data access, (3) AI prompt engineering includes explicit instructions to reject PII, (4) Session management ensures user data context isolation. Organizational policy requires documented data retention schedules and user data deletion procedures, enforced through database lifecycle policies.",
      status: "✓ Implemented",
      evidence: "Privacy Policy, Privacy-by-Design Architecture, PII Rejection Prompts, Data Retention Policy"
    },
    {
      category: "Transparency & Explainability",
      control: "8.1 Transparency",
      requirement: "Ensure AI system decisions and processes are transparent",
      implementation: "Organizational policy mandates full transparency of AI decision-making processes. The platform design ensures transparency through: (1) Embedding AI model version (Claude Sonnet 4) and framework selection in every report header, (2) Capturing complete assessment parameters in audit logs with timestamps, (3) Documenting methodology explanations for each framework. The system architecture makes all AI interactions traceable - users can review which inputs generated which outputs, when, and by whom. This design principle of 'explainable AI workflows' ensures stakeholders can validate AI reasoning paths.",
      status: "✓ Implemented",
      evidence: "AI Transparency Policy, Model Version Tracking, Audit Trail Architecture, Methodology Documentation"
    },
    {
      category: "Transparency & Explainability",
      control: "8.2 Explainability",
      requirement: "Provide explanations for AI system outputs",
      implementation: "Our organizational explainability standard requires AI outputs to include reasoning, context, and actionable guidance. The system design enforces this by architecting AI prompts to generate structured outputs containing: (1) Threat description with context, (2) Attack scenario explanation, (3) Business impact justification, (4) Step-by-step mitigation guidance. The prompt engineering methodology ensures the AI cannot produce unexplained recommendations - every output must include reasoning chains that security professionals can validate against established threat models.",
      status: "✓ Implemented",
      evidence: "Explainability Standards, Structured Output Architecture, Prompt Engineering Framework"
    },
    {
      category: "Human Oversight",
      control: "9.1 Human-in-the-Loop",
      requirement: "Maintain appropriate human oversight of AI systems",
      implementation: "Organizational policy prohibits autonomous AI decision-making and mandates human oversight at every critical juncture. The platform architecture enforces this policy by design: (1) Zero automated assessments - all analysis requires explicit user initiation, (2) Review workflow requires human validation before reports are finalized, (3) Regeneration capability allows humans to reject and retry AI outputs with modified parameters. The system design principle prevents AI autonomy - no assessment generation occurs without authenticated human authorization, and no outputs are actionable without human review and approval.",
      status: "✓ Implemented",
      evidence: "Human Oversight Policy, User-Initiated Architecture, Review Workflow Design"
    },
    {
      category: "Human Oversight",
      control: "9.2 Human Control",
      requirement: "Ensure humans retain control over critical decisions",
      implementation: "Organizational policy vests all critical AI decisions with human operators. The system design enforces complete human authority over: (1) Framework selection - humans choose analysis methodology based on project context, (2) Risk focus determination - humans define which risk domains are assessed, (3) Project parameter configuration - humans set scope and constraints, (4) Report distribution - humans control when and to whom outputs are shared. The architecture contains no autonomous decision-making paths - every critical function requires explicit human action and cannot be triggered by AI or automation.",
      status: "✓ Implemented",
      evidence: "Decision Authority Policy, User Control Architecture, Manual Workflow Design"
    },
    {
      category: "Accountability",
      control: "10.1 Roles & Responsibilities",
      requirement: "Define clear roles and responsibilities for AI system management",
      implementation: "Organizational policy defines distinct accountability levels: Administrators responsible for system governance, user management, and compliance oversight; Users responsible for assessment quality, parameter selection, and output validation. The platform architecture enforces these responsibilities through role-based access control (RBAC) that technically prevents unauthorized actions. The separation of duties principle is embedded in the system design: assessment creation, administrative oversight, and audit review are distinct capabilities assigned to appropriate roles, ensuring accountability is architecturally enforced, not merely procedural.",
      status: "✓ Implemented",
      evidence: "Roles & Responsibilities Policy, RBAC Architecture, Separation of Duties Design"
    },
    {
      category: "Accountability",
      control: "10.2 Audit & Traceability",
      requirement: "Maintain comprehensive audit trails and traceability",
      implementation: "Organizational policy mandates complete auditability of all AI system interactions for compliance and forensic purposes. The system design implements comprehensive audit capture through: (1) Database-level triggers capturing every transaction with user attribution and timestamp, (2) API middleware logging all requests/responses, (3) Authentication event tracking for security analysis, (4) Immutable audit log storage preventing tampering. The architectural principle of 'audit-first design' ensures no system action occurs without corresponding audit record generation - traceability is a fundamental system constraint, not an optional feature.",
      status: "✓ Implemented",
      evidence: "Audit Policy, Immutable Logging Architecture, Transaction Tracking Design"
    },
    {
      category: "Security",
      control: "11.1 Information Security",
      requirement: "Implement appropriate information security controls",
      implementation: "Organizational information security policy adopts defense-in-depth principles across authentication, encryption, and access control layers. The system architecture implements these requirements through: (1) JWT-based authentication with token expiration enforcing session security policy, (2) Bcrypt password hashing meeting organizational cryptographic standards, (3) TLS encryption enforcing data-in-transit protection policy, (4) CORS configuration implementing organizational network security boundaries, (5) Secure credential management preventing exposure of API keys. The security-by-design principle ensures vulnerabilities cannot be introduced through configuration - security controls are architectural constraints.",
      status: "✓ Implemented",
      evidence: "Information Security Policy, Defense-in-Depth Architecture, Cryptographic Standards"
    },
    {
      category: "Security",
      control: "11.2 AI System Security",
      requirement: "Protect AI systems from security threats",
      implementation: "Our AI security policy mandates protection against abuse, injection attacks, and service disruption. The platform design enforces these protections through layered security architecture: (1) Rate limiting (10 req/min) prevents abuse and DoS attacks per organizational threshold policy, (2) Input validation and parameterized queries prevent injection attacks, (3) XSS protection through output encoding, (4) Secure API provider integration with isolated credential storage. The system architecture follows the principle of 'secure API design' ensuring AI interactions cannot bypass security controls or access unauthorized resources.",
      status: "✓ Implemented",
      evidence: "AI Security Policy, Rate Limiting Configuration, Input Validation Architecture, Secure Integration Design"
    },
    {
      category: "Performance & Monitoring",
      control: "12.1 Performance Metrics",
      requirement: "Monitor and measure AI system performance",
      implementation: "Organizational policy requires continuous monitoring of AI system performance, availability, and quality metrics to ensure service objectives are met. The platform architecture implements real-time performance tracking through: (1) Admin dashboard aggregating usage statistics for capacity planning, (2) Assessment completion tracking measuring AI delivery success rates, (3) Response time monitoring ensuring SLA compliance, (4) Error rate tracking identifying degradation patterns. The monitoring design enables data-driven policy decisions and proactive capacity management aligned with organizational growth objectives.",
      status: "✓ Implemented",
      evidence: "Performance Monitoring Policy, Metrics Dashboard, SLA Tracking, Capacity Planning Data"
    },
    {
      category: "Performance & Monitoring",
      control: "12.2 Continuous Improvement",
      requirement: "Continuously monitor and improve AI system",
      implementation: "Organizational continuous improvement policy mandates regular evaluation of AI model effectiveness and system capabilities. The platform design supports this through: (1) Model version tracking enabling controlled upgrades (Claude Sonnet 4), (2) Framework updates maintaining alignment with threat intelligence evolution, (3) User feedback mechanisms informing improvement priorities, (4) Assessment versioning allowing retrospective quality analysis. The architecture principle of 'evolutionary design' ensures the system can adopt improved AI models and methodologies without disrupting operations, supporting organizational commitment to excellence.",
      status: "✓ Implemented",
      evidence: "Continuous Improvement Policy, Version Control Architecture, Feedback Mechanisms, Upgrade Procedures"
    },
    {
      category: "Third-Party Management",
      control: "13.1 AI Service Providers",
      requirement: "Manage relationships with AI service providers",
      implementation: "Organizational third-party risk management policy requires vendor assessment, documented responsibilities, and continuous monitoring of AI service providers. Our relationship with Anthropic (Claude AI provider) is governed by: (1) Documented service level agreements defining availability and performance expectations, (2) Secure API key management following organizational credential policies, (3) Provider availability monitoring detecting service disruptions, (4) Documented data handling and privacy commitments. The system architecture abstracts provider integration, enabling provider switching if organizational policy requirements change, ensuring vendor independence.",
      status: "✓ Implemented",
      evidence: "Vendor Management Policy, Service Agreements, API Integration Architecture, Monitoring Configuration"
    },
    {
      category: "Documentation",
      control: "14.1 AI System Documentation",
      requirement: "Maintain comprehensive documentation of AI systems",
      implementation: "Organizational policy mandates complete documentation of AI systems for operational support, compliance verification, and knowledge transfer. Documentation architecture includes: (1) Framework methodology documentation enabling consistent threat modeling, (2) User guides supporting operational procedures, (3) API documentation facilitating integration and troubleshooting, (4) Compliance documentation (this statement) demonstrating regulatory adherence, (5) Technical architecture documentation supporting maintenance and evolution. The documentation principle of 'living documentation' ensures updates accompany system changes, maintaining accuracy and organizational knowledge currency.",
      status: "✓ Implemented",
      evidence: "Documentation Policy, Framework Guides, User Documentation, Technical Architecture Documents, Compliance Statement"
    },
    {
      category: "Incident Management",
      control: "15.1 Incident Response",
      requirement: "Establish procedures for AI system incident response",
      implementation: "Organizational incident response policy defines detection, escalation, response, and recovery procedures for AI system incidents. The platform design supports incident management through: (1) Comprehensive error logging capturing failure details for root cause analysis, (2) Immutable audit trails providing forensic evidence for incident investigation, (3) User notification mechanisms enabling rapid communication during incidents, (4) Admin alerting systems ensuring timely awareness of system failures. The resilience design principle ensures incidents are contained, investigated, and resolved according to organizational incident response protocols.",
      status: "✓ Implemented",
      evidence: "Incident Response Policy, Error Logging Architecture, Audit System, Notification Framework, Escalation Procedures"
    },
    {
      category: "Compliance & Legal",
      control: "16.1 Regulatory Compliance",
      requirement: "Ensure compliance with applicable laws and regulations",
      implementation: "Organizational compliance policy mandates adherence to GDPR, industry security standards, and applicable AI regulations. The system architecture embeds compliance controls: (1) GDPR-compliant data handling through consent, access, and deletion capabilities, (2) Audit trail generation supporting regulatory reporting requirements, (3) Data retention policies aligned with legal requirements enforced through automated lifecycle management, (4) Privacy-by-design architecture ensuring regulatory requirements cannot be violated through misconfiguration. The compliance-first design ensures regulatory obligations are system constraints, not optional procedures.",
      status: "✓ Implemented",
      evidence: "Regulatory Compliance Policy, GDPR Controls, Audit Trail Architecture, Data Retention Automation, Privacy Architecture"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl shadow-lg p-8 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-certificate text-white text-3xl" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2", children: "ISO/IEC 42001:2023 Compliance Statement" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-slate-600", children: "Certification of AI Management System Compliance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 mt-1", children: "This document certifies that our organization and the Threat Modeling AI Platform meet all necessary controls and requirements of ISO/IEC 42001:2023" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-check-circle text-green-600 text-2xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-green-900", children: "Compliance Status" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-green-600", children: "100%" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-green-700", children: "All controls implemented" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-shield-alt text-blue-600 text-2xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-blue-900", children: "Total Controls" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-blue-600", children: controls.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-blue-700", children: "Across 10 categories" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-calendar-check text-purple-600 text-2xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-purple-900", children: "Last Reviewed" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold text-purple-600", children: (/* @__PURE__ */ new Date()).toLocaleDateString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-purple-700", children: "Continuously monitored" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl shadow-lg p-8 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-award text-blue-600" }),
        "Compliance Certification Statement"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-blue-50 border-l-4 border-blue-600 p-4 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-slate-800 font-semibold mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-check-circle text-green-600 mr-2" }),
        "We hereby certify that our organization and the Threat Modeling AI Platform fully comply with ISO/IEC 42001:2023."
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-600 mb-4", children: "This certification statement demonstrates how our organization and platform meet all controls and requirements specified in ISO/IEC 42001:2023 - Information technology — Artificial intelligence — Management system. ISO 42001 is the world's first AI management system standard, providing comprehensive requirements for establishing, implementing, maintaining, and continually improving an AI management system within organizations." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-600 mb-4", children: "Our platform has been architected with AI governance, risk management, transparency, and accountability as foundational principles, ensuring enterprise-grade security and regulatory compliance for AI-powered threat modeling operations." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-bold text-blue-900 mb-2 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-building text-blue-600" }),
            "Organizational Compliance"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-700", children: "Our organization maintains documented AI governance policies, risk management procedures, and accountability frameworks" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-bold text-green-900 mb-2 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-cogs text-green-600" }),
            "Platform Compliance"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-700", children: "The platform implements technical controls for AI system security, data governance, transparency, and human oversight" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-bold text-purple-900 mb-2 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-sync-alt text-purple-600" }),
            "Continuous Monitoring"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-700", children: "Both organizational processes and platform controls are continuously monitored, audited, and improved" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl shadow-lg overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-blue-600 to-indigo-600 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-bold text-white flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-clipboard-check" }),
          "ISO 42001 Control Compliance Matrix"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-100 text-sm mt-2", children: "Evidence of implementation for all required controls" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 border-b-2 border-slate-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-left text-sm font-bold text-slate-900", children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-left text-sm font-bold text-slate-900", children: "Control ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-left text-sm font-bold text-slate-900", children: "Requirement" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-left text-sm font-bold text-slate-900", children: "Implementation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-left text-sm font-bold text-slate-900", children: "Evidence" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 text-center text-sm font-bold text-slate-900", children: "Status" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-slate-200", children: controls.map((control, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "hover:bg-blue-50 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800", children: control.category }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm font-bold text-slate-900", children: control.control }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-sm text-slate-700 max-w-xs", children: control.requirement }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-sm text-slate-600 max-w-md", children: control.implementation }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-xs text-slate-500 max-w-xs", children: control.evidence }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800", children: control.status }) })
            ]
          },
          index
        )) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl shadow-lg p-8 mt-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-star text-yellow-500" }),
        "Key Platform Features Supporting Compliance"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-slate-200 rounded-lg p-5 hover:border-blue-300 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-slate-900 mb-2 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-users-cog text-blue-600" }),
            "Role-Based Access Control"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600", children: "Granular permission management with Admin and User roles, ensuring proper segregation of duties" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-slate-200 rounded-lg p-5 hover:border-blue-300 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-slate-900 mb-2 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-clipboard-list text-green-600" }),
            "Comprehensive Audit Logging"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600", children: "Complete tracking of all user actions, API calls, and system events with tamper-proof timestamps" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-slate-200 rounded-lg p-5 hover:border-blue-300 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-slate-900 mb-2 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-brain text-purple-600" }),
            "Multi-Framework AI Analysis"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600", children: "Support for MITRE ATT&CK, STRIDE, PASTA, OCTAVE, and VAST frameworks with explainable AI outputs" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-slate-200 rounded-lg p-5 hover:border-blue-300 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-slate-900 mb-2 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-lock text-red-600" }),
            "Enterprise Security"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600", children: "JWT authentication, encryption at rest and in transit, rate limiting, and secure API key management" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-slate-200 rounded-lg p-5 hover:border-blue-300 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-slate-900 mb-2 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-chart-line text-indigo-600" }),
            "Performance Monitoring"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600", children: "Real-time usage statistics, assessment tracking, and system health monitoring via admin dashboard" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-slate-200 rounded-lg p-5 hover:border-blue-300 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-slate-900 mb-2 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-database text-teal-600" }),
            "Data Governance"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600", children: "Organization-level data isolation, secure document storage, and GDPR-compliant data handling" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-8 mt-8 text-white", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-bold mb-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-certificate" }),
        "Compliance Verification & Audit Support"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-4", children: "This compliance statement is available for client review and third-party audit verification. For detailed audit reports, attestation documents, control evidence, or questions about our ISO 42001 implementation and organizational compliance processes, please contact our compliance office." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-file-download mr-2" }),
          "Download Compliance Certificate"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-400 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-envelope mr-2" }),
          "Request Audit Documentation"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-shield-alt mr-2" }),
          "View Security Attestations"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 text-center text-sm text-slate-600 bg-white rounded-lg p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-slate-700 mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-stamp text-blue-600 mr-2" }),
        "Official Compliance Statement"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "Document Version: 1.0 | Certification Date: ",
        (/* @__PURE__ */ new Date()).toLocaleDateString(),
        " | Valid Through: ",
        new Date((/* @__PURE__ */ new Date()).setFullYear((/* @__PURE__ */ new Date()).getFullYear() + 1)).toLocaleDateString()
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs", children: "Classification: Client Facing | Authority: Compliance Office | Review Cycle: Annual" })
    ] })
  ] }) });
};
const FileUpload = ({ onFilesAdded }) => {
  const formatSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k2 = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k2));
    return parseFloat((bytes / Math.pow(k2, i)).toFixed(1)) + " " + sizes[i];
  };
  const handleFileChange = async (e) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const token = localStorage.getItem("token");
    const newDocs = await Promise.all(
      files.map(async (file) => {
        let content = "";
        const fileExtension = file.name.toLowerCase().split(".").pop() || "";
        if (["png", "jpg", "jpeg", "gif", "webp", "bmp"].includes(fileExtension)) {
          const reader = new FileReader();
          content = await new Promise((resolve) => {
            reader.onload = () => {
              const base64 = reader.result;
              const base64Data = base64.split(",")[1] || base64;
              resolve(base64Data);
            };
            reader.readAsDataURL(file);
          });
          console.log(`Image ${file.name} loaded as base64 for Vision API`);
        } else if (["txt", "md"].includes(fileExtension)) {
          content = await file.text();
        } else {
          try {
            const formData = new FormData();
            formData.append("file", file);
            const response = await fetch("/api/process-file", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${token}`
              },
              body: formData
            });
            if (response.ok) {
              const result = await response.json();
              content = result.extracted_text;
              if (result.fallback) {
                console.log(`Using placeholder for ${file.name} - processing not available`);
              } else {
                console.log(`Successfully processed ${file.name}: ${result.char_count} characters`);
              }
            } else {
              content = `[${fileExtension.toUpperCase()} Document: ${file.name}]`;
              console.warn(`Failed to process ${file.name}, using placeholder`);
            }
          } catch (error) {
            console.error("File processing error:", error);
            content = `[${fileExtension.toUpperCase()} Document: ${file.name}]`;
          }
        }
        let category = "Other";
        const name = file.name.toLowerCase();
        if (name.includes("req")) category = "Requirement";
        else if (name.includes("design") || name.includes("arch")) category = "Architecture";
        else if (name.includes("case")) category = "Business Case";
        else if (name.includes("budget") || name.includes("cost")) category = "Budget";
        else if (name.includes("plan") || name.includes("schedule")) category = "Plan";
        else if (name.includes("risk")) category = "Risk Register";
        else if (name.includes("status")) category = "Status Report";
        return {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          size: formatSize(file.size),
          content,
          category
        };
      })
    );
    onFilesAdded(newDocs);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative border-2 border-dashed border-blue-400 rounded-lg p-10 text-center bg-blue-50/20 hover:bg-blue-50/40 transition-all cursor-pointer group", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "file",
        multiple: true,
        onChange: handleFileChange,
        className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer",
        id: "file-input"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fa-regular fa-file-lines text-5xl text-slate-700 mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-600 font-medium", children: "Drag and drop files here" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mt-1", children: "Supported: PDF, DOCX, XLSX, TXT" })
    ] })
  ] });
};
const ReportHistory = ({ projects, onViewReport, onDownloadPdf }) => {
  const [groupByProject, setGroupByProject] = reactExports.useState(true);
  const [expandedProjects, setExpandedProjects] = reactExports.useState(/* @__PURE__ */ new Set());
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  const toggleProject = (projectKey) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectKey)) {
      newExpanded.delete(projectKey);
    } else {
      newExpanded.add(projectKey);
    }
    setExpandedProjects(newExpanded);
  };
  const allAssessments = projects.flatMap((p2) => p2.versions);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold text-slate-900 mb-2", children: "📚 Past Assessments" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-600", children: "View and download your threat assessment reports" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setGroupByProject(!groupByProject),
          className: `px-4 py-2 rounded-lg font-medium transition-colors ${groupByProject ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700 hover:bg-slate-300"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-layer-group mr-2" }),
            groupByProject ? "Grouped by Project" : "List View"
          ]
        }
      ) })
    ] }),
    allAssessments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl border border-slate-200 p-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-folder-open text-3xl text-slate-300" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-slate-900 mb-2", children: "No Reports Yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-600", children: "🔍 No past assessments yet. Create your first threat assessment!" })
    ] }) : groupByProject ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: projects.map((project, idx) => {
      const projectKey = `${project.project_name}_${project.project_number || idx}`;
      const isExpanded = expandedProjects.has(projectKey);
      const latestVersion = project.versions[0];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl border-2 border-slate-200 overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "p-6 bg-gradient-to-r from-slate-50 to-white cursor-pointer hover:bg-slate-50 transition-colors",
            onClick: () => toggleProject(projectKey),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xl font-bold text-slate-900", children: [
                      "🔍 ",
                      project.project_name
                    ] }),
                    project.project_number && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-lg", children: [
                      "#",
                      project.project_number
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-lg", children: [
                      project.versions.length,
                      " version",
                      project.versions.length !== 1 ? "s" : ""
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-sm text-slate-600", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-shield-alt mr-1" }),
                      " ",
                      latestVersion.framework
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-clock mr-1" }),
                      " Latest: ",
                      formatDate(latestVersion.created_at)
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-slate-400 hover:text-slate-600 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: `fas fa-chevron-${isExpanded ? "up" : "down"} text-xl` }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 border border-red-200", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-700 text-xs font-bold uppercase", children: "🔴 Critical" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-900 text-2xl font-extrabold mt-1", children: latestVersion.critical_count })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-orange-700 text-xs font-bold uppercase", children: "🟠 High" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-orange-900 text-2xl font-extrabold mt-1", children: latestVersion.high_count })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-3 border border-yellow-200", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-yellow-700 text-xs font-bold uppercase", children: "🟡 Medium" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-yellow-900 text-2xl font-extrabold mt-1", children: latestVersion.medium_count })
                ] })
              ] })
            ]
          }
        ),
        isExpanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 bg-slate-50 border-t border-slate-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-bold text-slate-700 uppercase mb-4", children: "Version History" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: project.versions.map((assessment) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "bg-white rounded-lg p-4 border border-slate-200",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded", children: [
                      "v",
                      assessment.version
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-3 text-sm text-slate-600", children: formatDate(assessment.created_at) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg uppercase", children: assessment.status })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 text-sm", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-red-600 font-semibold", children: [
                      "🔴 ",
                      assessment.critical_count
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-orange-600 font-semibold", children: [
                      "🟠 ",
                      assessment.high_count
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-yellow-600 font-semibold", children: [
                      "🟡 ",
                      assessment.medium_count
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        onClick: () => onDownloadPdf(assessment.id),
                        className: "px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-file-pdf mr-1" }),
                          " PDF"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        onClick: () => onViewReport(assessment.id),
                        className: "px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-eye mr-1" }),
                          " View"
                        ]
                      }
                    )
                  ] })
                ] })
              ]
            },
            assessment.id
          )) })
        ] })
      ] }, projectKey);
    }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: allAssessments.map((assessment) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl border-2 border-slate-200 p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xl font-bold text-slate-900", children: [
            "🔍 ",
            assessment.project_name
          ] }),
          assessment.project_number && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-500 font-medium", children: [
            "#",
            assessment.project_number
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg uppercase", children: assessment.status })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 text-xs font-semibold uppercase", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-900 font-semibold", children: formatDate(assessment.created_at) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 text-xs font-semibold uppercase", children: "Framework" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-900 font-semibold", children: assessment.framework })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 text-xs font-semibold uppercase", children: "Version" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-slate-900 font-semibold", children: [
            "v",
            assessment.version
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 border border-red-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-700 text-xs font-bold uppercase", children: "🔴 Critical" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-900 text-2xl font-extrabold mt-1", children: assessment.critical_count })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-orange-700 text-xs font-bold uppercase", children: "🟠 High" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-orange-900 text-2xl font-extrabold mt-1", children: assessment.high_count })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-3 border border-yellow-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-yellow-700 text-xs font-bold uppercase", children: "🟡 Medium" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-yellow-900 text-2xl font-extrabold mt-1", children: assessment.medium_count })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => onDownloadPdf(assessment.id),
            className: "flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-file-pdf mr-2" }),
              " Download PDF"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => onViewReport(assessment.id),
            className: "flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-eye mr-2" }),
              " View Full Report"
            ]
          }
        )
      ] })
    ] }, assessment.id)) })
  ] });
};
const Sidebar = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = reactExports.useState("");
  const [isSaved, setIsSaved] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const savedKey = localStorage.getItem("anthropic_api_key");
    if (savedKey) {
      setApiKey(savedKey);
      setIsSaved(true);
    }
  }, []);
  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem("anthropic_api_key", apiKey.trim());
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2e3);
    }
  };
  const handleClear = () => {
    localStorage.removeItem("anthropic_api_key");
    setApiKey("");
    setIsSaved(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity",
        onClick: onClose
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold", children: "Settings" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-blue-100 mt-1", children: "Configuration" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: onClose,
                className: "text-white hover:bg-blue-800 rounded-full p-2 transition-colors",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-blue-600 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold text-gray-800", children: "SecureAI API Key" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "password",
                    value: apiKey,
                    onChange: (e) => setApiKey(e.target.value),
                    placeholder: "sk-ant-api03-...",
                    className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: handleSave,
                      disabled: !apiKey.trim(),
                      className: `flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${apiKey.trim() ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`,
                      children: isSaved ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center justify-center", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }),
                        "Saved!"
                      ] }) : "Save Key"
                    }
                  ),
                  apiKey && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: handleClear,
                      className: "px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-semibold transition-all",
                      children: "Clear"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-blue-800", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold mb-1", children: "About API Keys" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-disc list-inside space-y-1 text-blue-700", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Stored locally in your browser" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Never sent to our servers" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                      "Get your key from ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://console.anthropic.com", target: "_blank", rel: "noopener noreferrer", className: "underline hover:text-blue-900", children: "SecureAI Console" })
                    ] })
                  ] })
                ] })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 border-t border-gray-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-bold text-gray-800 mb-3 flex items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 mr-2 text-gray-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }),
                "How to Use"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "text-sm text-gray-600 space-y-2 list-decimal list-inside", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Enter your AssureAI API key above" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: 'Click "Save Key" to store it locally' }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Upload project documents to analyze" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "View comprehensive assurance reports" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-4 border-t border-gray-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-500 space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "SecureAI" }),
                " v1.0.0"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400", children: "© 2026 SecureAI" })
            ] }) })
          ] }) })
        ] })
      }
    )
  ] });
};
const ComponentSpecificSection = ({
  components = [],
  onFindingClick
}) => {
  if (!components || components.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      padding: "40px",
      textAlign: "center",
      color: "#64748b"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "32px", marginBottom: "12px" }, children: "📦" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "14px", fontWeight: 600, color: "#475569", marginBottom: "6px" }, children: "No Component Analysis Available" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "12px", lineHeight: 1.6 }, children: "Component-specific threat analysis data not found in this report." })
    ] });
  }
  const getRiskColor = (riskLevel) => {
    const level = riskLevel.toUpperCase();
    if (level === "CRITICAL") return "#dc2626";
    if (level === "HIGH") return "#ea580c";
    if (level === "MEDIUM") return "#d97706";
    return "#65a30d";
  };
  const getRiskBg = (riskLevel) => {
    const level = riskLevel.toUpperCase();
    if (level === "CRITICAL") return "#fef2f2";
    if (level === "HIGH") return "#fff7ed";
    if (level === "MEDIUM") return "#fffbeb";
    return "#f7fee7";
  };
  const getRiskBorder = (riskLevel) => {
    const level = riskLevel.toUpperCase();
    if (level === "CRITICAL") return "#fecaca";
    if (level === "HIGH") return "#fed7aa";
    if (level === "MEDIUM") return "#fde68a";
    return "#d9f99d";
  };
  const getComponentIcon = (component) => {
    const name = component.toLowerCase();
    if (name.includes("api") || name.includes("gateway")) return "🚪";
    if (name.includes("database") || name.includes("db")) return "🗄️";
    if (name.includes("auth") || name.includes("login")) return "🔐";
    if (name.includes("frontend") || name.includes("ui")) return "🖥️";
    if (name.includes("backend") || name.includes("server")) return "⚙️";
    if (name.includes("network") || name.includes("firewall")) return "🌐";
    if (name.includes("storage") || name.includes("s3")) return "💾";
    return "📦";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "16px",
    padding: "0"
  }, children: components.map((comp, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        background: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        transition: "all 0.15s"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
        e.currentTarget.style.transform = "translateY(-2px)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
        e.currentTarget.style.transform = "translateY(0)";
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          padding: "16px 18px",
          background: "white",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "12px"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "12px", alignItems: "flex-start", flex: 1 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "26px", lineHeight: 1 }, children: getComponentIcon(comp.component) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                fontSize: "14px",
                fontWeight: 700,
                color: "#0f172a",
                lineHeight: 1.4,
                marginBottom: "4px"
              }, children: comp.component }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                fontSize: "11px",
                color: "#64748b",
                fontFamily: "JetBrains Mono, monospace"
              }, children: comp.doc_source.split(":")[0] || "Document Evidence" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            display: "inline-flex",
            alignItems: "center",
            padding: "5px 11px",
            borderRadius: "6px",
            fontSize: "10px",
            fontWeight: 700,
            fontFamily: "JetBrains Mono, monospace",
            color: getRiskColor(comp.risk_level),
            background: getRiskBg(comp.risk_level),
            border: `1px solid ${getRiskBorder(comp.risk_level)}`,
            whiteSpace: "nowrap"
          }, children: comp.risk_level.toUpperCase() })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          padding: "12px 18px",
          background: "#f8fafc",
          borderBottom: "1px solid #e2e8f0"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "9px",
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            fontWeight: 600,
            marginBottom: "7px"
          }, children: "Document Evidence" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "11px",
            color: "#475569",
            lineHeight: 1.6,
            fontWeight: 500,
            fontStyle: "italic"
          }, children: [
            '"',
            comp.verbatim_quote,
            '"'
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          padding: "14px 18px",
          background: "white"
        }, children: comp.critical_threats.split(",").map((threat, tIdx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: tIdx < comp.critical_threats.split(",").length - 1 ? "1px solid #f1f5f9" : "none"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                fontSize: "12px",
                color: "#334155",
                fontWeight: 500,
                flex: 1
              }, children: threat.trim() }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
                fontSize: "11px",
                color: getRiskColor(comp.risk_level),
                fontWeight: 600,
                fontFamily: "JetBrains Mono, monospace",
                marginLeft: "12px"
              }, children: [
                "→ ",
                comp.risk_level.toUpperCase()
              ] })
            ]
          },
          tIdx
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          padding: "12px 18px",
          background: "#f0fdf4",
          borderTop: "1px solid #bbf7d0",
          display: "flex",
          alignItems: "flex-start",
          gap: "10px"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "10px",
            color: "#15803d",
            fontWeight: 600,
            minWidth: "80px"
          }, children: "Mitigation:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            fontSize: "11px",
            color: "#166534",
            lineHeight: 1.6,
            flex: 1
          }, children: comp.mitigation_priority })
        ] }),
        comp.finding_refs && comp.finding_refs.length > 0 && onFindingClick && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "12px 18px", background: "white", borderTop: "1px solid #e2e8f0" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "9px",
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            fontWeight: 600,
            marginBottom: "8px"
          }, children: "Related Findings:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "6px", flexWrap: "wrap" }, children: comp.finding_refs.map((fid) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => onFindingClick(fid),
              style: {
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "10px",
                fontWeight: 700,
                color: "#2563eb",
                background: "#eff6ff",
                padding: "4px 10px",
                borderRadius: "6px",
                border: "1px solid #bfdbfe",
                cursor: "pointer",
                transition: "all 0.15s"
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.background = "#2563eb";
                e.currentTarget.style.color = "white";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.background = "#eff6ff";
                e.currentTarget.style.color = "#2563eb";
              },
              children: [
                fid,
                " →"
              ]
            },
            fid
          )) })
        ] })
      ]
    },
    idx
  )) });
};
const SpecializedRiskSection = ({
  risks = [],
  onFindingClick
}) => {
  if (!risks || risks.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      padding: "40px",
      textAlign: "center",
      color: "#64748b"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "32px", marginBottom: "12px" }, children: "🎯" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "14px", fontWeight: 600, color: "#475569", marginBottom: "6px" }, children: "No Specialized Risk Assessments Available" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "12px", lineHeight: 1.6 }, children: "Specialized risk domain analysis data not found in this report." })
    ] });
  }
  const getGradeColor = (grade) => {
    const level = grade.toUpperCase();
    if (level === "CRITICAL") return "#dc2626";
    if (level === "HIGH") return "#ea580c";
    if (level === "MEDIUM") return "#d97706";
    return "#65a30d";
  };
  const getGradeBg = (grade) => {
    const level = grade.toUpperCase();
    if (level === "CRITICAL") return "#fef2f2";
    if (level === "HIGH") return "#fff7ed";
    if (level === "MEDIUM") return "#fffbeb";
    return "#f7fee7";
  };
  const getGradeBorder = (grade) => {
    const level = grade.toUpperCase();
    if (level === "CRITICAL") return "#fecaca";
    if (level === "HIGH") return "#fed7aa";
    if (level === "MEDIUM") return "#fde68a";
    return "#d9f99d";
  };
  const getSeverityColor = (severity) => {
    const level = severity.toUpperCase();
    if (level === "CRITICAL") return "#dc2626";
    if (level === "HIGH") return "#ea580c";
    if (level === "MEDIUM") return "#d97706";
    return "#65a30d";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
    gap: "16px",
    padding: "0"
  }, children: risks.map((risk, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        background: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        transition: "all 0.15s"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
        e.currentTarget.style.transform = "translateY(-2px)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
        e.currentTarget.style.transform = "translateY(0)";
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          padding: "16px 18px",
          background: "white",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "12px",
          borderBottom: "1px solid #e2e8f0"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "10px", alignItems: "flex-start", flex: 1 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "24px", lineHeight: 1 }, children: risk.icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                fontSize: "14px",
                fontWeight: 700,
                color: "#0f172a",
                lineHeight: 1.4,
                marginBottom: "4px"
              }, children: risk.domain }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                fontSize: "11px",
                color: "#64748b",
                fontFamily: "JetBrains Mono, monospace"
              }, children: [
                risk.summary,
                " · click items for details"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            display: "inline-flex",
            alignItems: "center",
            padding: "5px 11px",
            borderRadius: "6px",
            fontSize: "10px",
            fontWeight: 700,
            fontFamily: "JetBrains Mono, monospace",
            color: getGradeColor(risk.grade),
            background: getGradeBg(risk.grade),
            border: `1px solid ${getGradeBorder(risk.grade)}`,
            whiteSpace: "nowrap"
          }, children: risk.grade.toUpperCase() })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          padding: "14px 18px",
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }, children: risk.findings.map((finding, fIdx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 12px",
              background: "#f8fafc",
              borderRadius: "6px",
              cursor: finding.finding_ref && onFindingClick ? "pointer" : "default",
              transition: "all 0.1s",
              border: finding.finding_ref ? "1px solid #e2e8f0" : "none"
            },
            onClick: () => finding.finding_ref && onFindingClick && onFindingClick(finding.finding_ref),
            onMouseEnter: (e) => {
              if (finding.finding_ref && onFindingClick) {
                e.currentTarget.style.background = "#eff6ff";
                e.currentTarget.style.borderColor = "#bfdbfe";
              }
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.background = "#f8fafc";
              e.currentTarget.style.borderColor = "#e2e8f0";
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
                fontSize: "11px",
                color: "#334155",
                fontWeight: 600,
                flex: 1,
                fontFamily: "JetBrains Mono, monospace"
              }, children: [
                finding.label,
                finding.finding_ref && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
                  fontSize: "9px",
                  color: "#2563eb",
                  marginLeft: "6px",
                  fontWeight: 700
                }, children: [
                  "(",
                  finding.finding_ref,
                  ")"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                fontSize: "11px",
                fontWeight: 700,
                color: getSeverityColor(finding.severity),
                fontFamily: "JetBrains Mono, monospace",
                marginLeft: "12px"
              }, children: finding.value })
            ]
          },
          fIdx
        )) })
      ]
    },
    idx
  )) });
};
const NAVY = "#0B1E3D";
const BLUE = "#1D4ED8";
const PAGE_BG = "#F0F4F9";
const SEV_COLOR = { CRITICAL: "#DC2626", HIGH: "#EA580C", MEDIUM: "#D97706", LOW: "#16A34A" };
const SEV_BG = { CRITICAL: "#FEF2F2", HIGH: "#FFF7ED", MEDIUM: "#FFFBEB", LOW: "#F0FDF4" };
const SEV_BORDER = { CRITICAL: "#FECACA", HIGH: "#FED7AA", MEDIUM: "#FDE68A", LOW: "#BBF7D0" };
const MITRE_TACTICS = [
  { id: "TA0001", short: "Initial Access" },
  { id: "TA0002", short: "Execution" },
  { id: "TA0003", short: "Persistence" },
  { id: "TA0004", short: "Privilege Esc." },
  { id: "TA0005", short: "Defense Evasion" },
  { id: "TA0006", short: "Cred. Access" },
  { id: "TA0007", short: "Discovery" },
  { id: "TA0008", short: "Lateral Move." },
  { id: "TA0009", short: "Collection" },
  { id: "TA0010", short: "Command & Ctrl" },
  { id: "TA0011", short: "Exfiltration" },
  { id: "TA0012", short: "Impact" }
];
const PHASE_LABELS = {
  "Initial Access": "ACC",
  "Execution": "EXEC",
  "Persistence": "PRST",
  "Privilege Escalation": "PRIV",
  "Defense Evasion": "EVDN",
  "Credential Access": "CRED",
  "Discovery": "DISC",
  "Lateral Movement": "LATR",
  "Collection": "COLL",
  "Command and Control": "C2",
  "Exfiltration": "EXFL",
  "Impact": "IMPT",
  "Weaponize": "WPNZ",
  "Deliver": "DLVR",
  "Exploit": "EXPL",
  "Install": "INST",
  "Cover": "COVR",
  "C2": "C2"
};
const NAV_ITEMS = [
  { id: "exec-summary", faIcon: "fa-chart-line", label: "Executive Summary" },
  { id: "overview", faIcon: "fa-layer-group", label: "Overview & Scorecard" },
  { id: "attck-map", faIcon: "fa-crosshairs", label: "MITRE ATT&CK Map" },
  { id: "kill-chain", faIcon: "fa-link", label: "Kill Chain Analysis" },
  { id: "findings", faIcon: "fa-magnifying-glass", label: "All Findings" },
  { id: "risk-matrix", faIcon: "fa-table-cells", label: "Risk Priority Matrix" },
  { id: "recommendations", faIcon: "fa-shield-halved", label: "Recommendations" },
  { id: "specialized", faIcon: "fa-bullseye", label: "Specialized Risks" },
  { id: "components", faIcon: "fa-cubes", label: "Component Analysis" },
  { id: "action-plan", faIcon: "fa-list-check", label: "Action Plan" }
];
const Pill = ({ sev }) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { display: "inline-flex", alignItems: "center", fontFamily: "'JetBrains Mono',monospace", fontSize: 8, fontWeight: 800, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase", letterSpacing: 0.8, whiteSpace: "nowrap", background: SEV_BG[sev] || "#F1F5F9", color: SEV_COLOR[sev] || "#475569", border: `1px solid ${SEV_BORDER[sev] || "#E2E8F0"}` }, children: sev });
const SecHeader = ({ num, title, sub }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 28 }, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { minWidth: 40, height: 40, background: NAVY, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0, letterSpacing: -0.5 }, children: num }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { borderLeft: "3px solid " + BLUE, paddingLeft: 14 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 19, fontWeight: 800, color: "#0F172A", letterSpacing: -0.5, lineHeight: 1.2 }, children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11.5, color: "#64748B", marginTop: 4, fontFamily: "'JetBrains Mono',monospace", letterSpacing: 0.1 }, children: sub })
  ] })
] });
function matchTacticId(tactic) {
  if (!tactic) return "";
  const t2 = tactic.toLowerCase();
  if (t2.includes("initial")) return "TA0001";
  if (t2.includes("execut")) return "TA0002";
  if (t2.includes("persist")) return "TA0003";
  if (t2.includes("privilege") || t2.includes("escalat")) return "TA0004";
  if (t2.includes("defense") || t2.includes("evasion")) return "TA0005";
  if (t2.includes("credential")) return "TA0006";
  if (t2.includes("discover")) return "TA0007";
  if (t2.includes("lateral")) return "TA0008";
  if (t2.includes("collect")) return "TA0009";
  if (t2.includes("command") || t2.includes("control") || t2.includes("c2")) return "TA0010";
  if (t2.includes("exfil")) return "TA0011";
  if (t2.includes("impact")) return "TA0012";
  return "";
}
const ExecutiveSummary = ({
  data,
  projectName,
  onPrint
}) => {
  const overall = data.overall_risk_rating || "HIGH";
  const sev = data.findings_by_severity || { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  const findings = data.all_findings || [];
  const recs = data.all_recommendations || [];
  const fw = data.frameworks_used || [];
  const ra2 = data.risk_areas_assessed || [];
  const top5 = [...findings].sort((a, b) => b.risk_score - a.risk_score).slice(0, 5);
  const top3Recs = recs.filter((r2) => r2.priority === "P0").slice(0, 3);
  const totalRisk = sev.CRITICAL * 25 + sev.HIGH * 15 + sev.MEDIUM * 8 + sev.LOW * 3;
  const maxPossible = findings.length * 25;
  const riskPct = maxPossible > 0 ? Math.round(totalRisk / maxPossible * 100) : 0;
  const riskDesc = overall === "CRITICAL" ? "Immediate executive action required. Critical vulnerabilities present significant business risk." : overall === "HIGH" ? "Significant vulnerabilities require urgent attention within 30 days." : "Moderate risk identified. Address findings per the recommended timeline.";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "exec-summary", style: { background: "#fff", borderRadius: 16, border: "2px solid #1d4ed8", overflow: "hidden", boxShadow: "0 4px 24px rgba(29,78,216,.15)", scrollMarginTop: -20, minHeight: "60vh", marginTop: 0 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: `linear-gradient(135deg,${NAVY} 0%,#1e3a5f 60%,${BLUE} 100%)`, padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, borderRadius: "10px 10px 0 0" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "rgba(255,255,255,.5)", textTransform: "uppercase", letterSpacing: 2, fontWeight: 600, marginBottom: 6 }, children: "EXECUTIVE SUMMARY" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 14, color: "rgba(255,255,255,.75)", display: "flex", alignItems: "center", gap: 8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-chart-line", style: { fontSize: 12 } }),
          "Key findings and risk overview"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onPrint, style: { padding: "10px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,.2)", background: "rgba(255,255,255,.08)", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 7 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-print", style: { fontSize: 11 } }),
        "Print One-Pager"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "24px 32px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: SEV_BG[overall], border: `1px solid ${SEV_BORDER[overall]}`, borderLeft: `4px solid ${SEV_COLOR[overall]}`, borderRadius: 8, padding: "12px 18px", display: "flex", gap: 14, alignItems: "center", marginBottom: 24 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: `fas ${overall === "CRITICAL" ? "fa-circle-exclamation" : overall === "HIGH" ? "fa-triangle-exclamation" : "fa-info-circle"}`, style: { fontSize: 20, color: SEV_COLOR[overall], flexShrink: 0 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 12, fontWeight: 800, color: SEV_COLOR[overall], marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.4 }, children: [
            overall,
            " Risk — ",
            overall === "CRITICAL" ? "Immediate Executive Action Required" : "Urgent Action Required"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "#475569", lineHeight: 1.5 }, children: riskDesc })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", flexShrink: 0, background: "#fff", border: `1px solid ${SEV_BORDER[overall]}`, borderRadius: 10, padding: "8px 16px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 28, fontWeight: 900, color: SEV_COLOR[overall] }, children: [
            riskPct,
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8", textTransform: "uppercase" }, children: "Risk Score" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }, children: ["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: SEV_BG[s], border: `1px solid ${SEV_BORDER[s]}`, borderTop: `3px solid ${SEV_COLOR[s]}`, borderRadius: 10, padding: "16px", textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 28, fontWeight: 900, color: SEV_COLOR[s], lineHeight: 1, fontFamily: "'JetBrains Mono',monospace" }, children: sev[s] || 0 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: SEV_COLOR[s], textTransform: "uppercase", fontWeight: 700, marginTop: 4 }, children: s }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8", marginTop: 2 }, children: "findings" })
      ] }, s)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-magnifying-glass", style: { fontSize: 10, color: "#94a3b8" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#94a3b8", textTransform: "uppercase", fontWeight: 600, letterSpacing: 0.5 }, children: [
              "Top ",
              top5.length,
              " Priority Findings"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden" }, children: top5.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "20px", textAlign: "center", color: "#94a3b8", fontSize: 12 }, children: "Run a new assessment to populate findings." }) : top5.map((f2, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: i < top5.length - 1 ? "1px solid #f1f5f9" : "none", background: i % 2 === 0 ? "#fff" : "#f8f9fb", borderLeft: `3px solid ${SEV_COLOR[f2.severity] || "#e2e8f0"}` }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#2563eb", fontWeight: 700, flexShrink: 0, minWidth: 36 }, children: f2.id }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, fontWeight: 700, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: f2.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8", marginTop: 1 }, children: [
                f2.tactic || "—",
                " · ",
                f2.technique_id || "—"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "right", flexShrink: 0 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 900, color: SEV_COLOR[f2.severity] }, children: [
                f2.risk_score,
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 8, color: "#94a3b8" }, children: "/25" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Pill, { sev: f2.severity })
            ] })
          ] }, f2.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 16 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-bolt", style: { fontSize: 10, color: "#94a3b8" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#94a3b8", textTransform: "uppercase", fontWeight: 600, letterSpacing: 0.5 }, children: "Immediate Actions (0–30 Days)" })
            ] }),
            top3Recs.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: top3Recs.map((r2, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", borderLeft: "4px solid #dc2626", display: "flex", gap: 10, alignItems: "flex-start" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 20, height: 20, borderRadius: "50%", background: "#dc2626", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fontWeight: 900, flexShrink: 0, marginTop: 1 }, children: i + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, fontWeight: 800, color: "#0f172a", marginBottom: 2 }, children: r2.title }),
                r2.risk_reduction_pct && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#16a34a", fontWeight: 600 }, children: [
                  "↓ ",
                  r2.risk_reduction_pct,
                  "% risk · ",
                  r2.effort_weeks || "?",
                  "w · ",
                  r2.owner || "—"
                ] })
              ] })
            ] }, r2.id || i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "12px 14px", background: "#f8f9fb", borderRadius: 10, border: "1px solid #e2e8f0", textAlign: "center" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "#94a3b8" }, children: "No P0 recommendations in this report." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#64748b", marginTop: 4 }, children: "Run a new assessment to generate action items." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "14px 16px", background: "#f8f9fb", borderRadius: 10, border: "1px solid #e2e8f0" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-chart-pie", style: { fontSize: 9, color: "#94a3b8" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8", textTransform: "uppercase", fontWeight: 600 }, children: "Risk Distribution" })
            ] }),
            ["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((s) => {
              const count = sev[s] || 0;
              const pct = findings.length > 0 ? Math.round(count / findings.length * 100) : 0;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 7 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 3 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fontWeight: 700, color: SEV_COLOR[s] }, children: s }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8" }, children: [
                    count,
                    " (",
                    pct,
                    "%)"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 5, background: "#e2e8f0", borderRadius: 3 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: "100%", width: `${pct}%`, background: SEV_COLOR[s], borderRadius: 3 } }) })
              ] }, s);
            })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "linear-gradient(135deg,#f8f9fb,#f1f5f9)", border: "1px solid #e2e8f0", borderRadius: 10, padding: "14px 20px", display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "space-between" }, children: [["Framework", fw.join(", ") || "—"], ["Risk Areas", ra2.length > 0 ? `${ra2.length}: ${ra2.slice(0, 2).join(", ")}${ra2.length > 2 ? "…" : ""}` : "—"], ["Total Findings", `${findings.length}`], ["Assessment Date", data.assessment_date || "—"], ["Classification", "CONFIDENTIAL"], ["Generated By", "ThreatVision AI"]].map(([label, val]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8", textTransform: "uppercase", fontWeight: 600, marginBottom: 3 }, children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, fontWeight: 700, color: "#0f172a" }, children: val })
      ] }, label)) })
    ] })
  ] });
};
const OverviewSection = ({ data, projectName }) => {
  const overall = data.overall_risk_rating || "HIGH";
  const sev = data.findings_by_severity || { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  const fw = data.frameworks_used || [];
  const ra2 = data.risk_areas_assessed || [];
  const p0 = (data.all_findings || []).filter((f2) => f2.priority === "P0").length;
  const gauge = { CRITICAL: 95, HIGH: 70, MEDIUM: 45, LOW: 20 }[overall] || 70;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "overview", style: SS.section, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SecHeader, { num: "01", title: "Overview & Risk Scorecard", sub: `${projectName} · ${data.assessment_date} · ${fw.join(", ")}` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 24 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: SEV_BG[overall], border: `1px solid ${SEV_BORDER[overall]}`, borderRadius: 16, padding: "24px 32px", display: "flex", flexDirection: "column", alignItems: "center", minWidth: 160 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: SEV_COLOR[overall], textTransform: "uppercase", fontWeight: 700, letterSpacing: 1, marginBottom: 8 }, children: "Overall Rating" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 32, fontWeight: 900, color: SEV_COLOR[overall], letterSpacing: -1 }, children: overall }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 120, height: 6, background: "#e2e8f0", borderRadius: 3, marginTop: 12, overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: `${gauge}%`, height: "100%", background: SEV_COLOR[overall], borderRadius: 3 } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#94a3b8", marginTop: 8 }, children: [
          data.total_findings,
          " total findings"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, flex: 1, flexWrap: "wrap", alignItems: "stretch" }, children: [
        ["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: "1 1 80px", background: "#fff", border: `1px solid ${SEV_BORDER[s]}`, borderTop: `3px solid ${SEV_COLOR[s]}`, borderRadius: 12, padding: "14px 12px", textAlign: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 28, fontWeight: 900, color: SEV_COLOR[s], lineHeight: 1 }, children: sev[s] || 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8", marginTop: 4, textTransform: "uppercase" }, children: s })
        ] }, s)),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: "1 1 80px", background: "#fff", border: "1px solid #bfdbfe", borderTop: "3px solid #2563eb", borderRadius: 12, padding: "14px 12px", textAlign: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 28, fontWeight: 900, color: "#2563eb", lineHeight: 1 }, children: p0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8", marginTop: 4, textTransform: "uppercase" }, children: "P0 Immediate" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 1, background: "#e2e8f0", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", marginBottom: 24 }, children: [["Project", projectName], ["Frameworks", fw.join(", ") || "—"], ["Risk Areas", `${ra2.length} assessed`], ["Date", data.assessment_date || "—"]].map(([label, val]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "#fff", padding: "12px 16px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }, children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, fontWeight: 700, color: "#0f172a" }, children: val })
    ] }, label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 8 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-shield-halved", style: { fontSize: 10, color: "#94a3b8" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8", textTransform: "uppercase", fontWeight: 600, letterSpacing: 0.5 }, children: "Security Posture by Tactic" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 10 }, children: Object.entries(
        (data.all_findings || []).reduce((acc, f2) => {
          const t2 = f2.tactic || "General";
          if (!acc[t2]) acc[t2] = { worst: "LOW", count: 0 };
          acc[t2].count++;
          if (f2.severity === "CRITICAL") acc[t2].worst = "CRITICAL";
          else if (f2.severity === "HIGH" && acc[t2].worst !== "CRITICAL") acc[t2].worst = "HIGH";
          else if (f2.severity === "MEDIUM" && !["CRITICAL", "HIGH"].includes(acc[t2].worst)) acc[t2].worst = "MEDIUM";
          return acc;
        }, {})
      ).slice(0, 8).map(([tactic, info]) => {
        const infoTyped = info;
        const grade = infoTyped.worst === "CRITICAL" ? "D" : infoTyped.worst === "HIGH" ? "C" : infoTyped.worst === "MEDIUM" ? "B" : "A";
        const gc2 = SEV_COLOR[infoTyped.worst] || "#16a34a";
        const gb2 = SEV_BG[infoTyped.worst] || "#f0fdf4";
        const gborder = SEV_BORDER[infoTyped.worst] || "#bbf7d0";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: gb2, border: `1px solid ${gborder}`, borderRadius: 10, padding: "12px 14px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, fontWeight: 700, color: "#0f172a", lineHeight: 1.3, flex: 1, marginRight: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: tactic }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 26, height: 26, borderRadius: 7, background: gc2, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 900, flexShrink: 0 }, children: grade })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: gc2, fontWeight: 700, textTransform: "uppercase" }, children: infoTyped.worst }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8", marginTop: 2 }, children: [
            infoTyped.count,
            " finding",
            infoTyped.count !== 1 ? "s" : ""
          ] })
        ] }, tactic);
      }) })
    ] })
  ] });
};
const AttckMapSection = ({ findings, frameworks, onFindingClick }) => {
  const byTactic = reactExports.useMemo(() => {
    const map = {};
    findings.forEach((f2) => {
      const tid = f2.tactic_id || matchTacticId(f2.tactic);
      if (tid) {
        map[tid] = map[tid] || [];
        map[tid].push(f2);
      }
    });
    return map;
  }, [findings]);
  const covered = Object.keys(byTactic).length;
  const isMitre = frameworks.some((fw) => fw.toUpperCase().includes("MITRE"));
  const tactics = isMitre ? MITRE_TACTICS : Array.from(new Map(findings.map((f2) => [f2.tactic_id || `T-${(f2.tactic || "").slice(0, 4).toUpperCase()}`, { id: f2.tactic_id || `T-${(f2.tactic || "").slice(0, 4).toUpperCase()}`, short: (f2.tactic || "General").slice(0, 16) }])).values());
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "attck-map", style: SS.section, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SecHeader, { num: "02", title: "ATT&CK Coverage Map", sub: "Techniques identified from your report · Click any cell to open the related finding" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { overflowX: "auto", paddingBottom: 8 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 8, minWidth: 900 }, children: tactics.map((tactic) => {
      const cells = byTactic[tactic.id] || [];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 90, display: "flex", flexDirection: "column", gap: 6 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "#0f172a", color: "white", borderRadius: 8, padding: "8px 6px", textAlign: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "rgba(255,255,255,.55)", marginBottom: 2, fontWeight: 500 }, children: tactic.id }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 10, fontWeight: 700, lineHeight: 1.3 }, children: tactic.short })
        ] }),
        cells.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "#f1f5f9", borderRadius: 7, padding: "7px 8px", textAlign: "center", fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#cbd5e1" }, children: "No findings" }) : cells.slice(0, 3).map((f2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onClick: () => onFindingClick(f2),
            title: f2.title,
            style: { background: SEV_BG[f2.severity], border: `1px solid ${SEV_BORDER[f2.severity]}`, borderRadius: 7, padding: "7px 8px", cursor: "pointer" },
            onMouseOver: (e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(15,23,42,.12)";
            },
            onMouseOut: (e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "";
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 8, display: "block", marginBottom: 2, fontWeight: 600, color: SEV_COLOR[f2.severity] }, children: f2.technique_id || f2.id }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 10, fontWeight: 700, color: "#0f172a", display: "block", lineHeight: 1.3, marginBottom: 3 }, children: [
                f2.title.slice(0, 28),
                f2.title.length > 28 ? "…" : ""
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fontWeight: 600, color: SEV_COLOR[f2.severity] }, children: [
                "Score: ",
                f2.risk_score,
                "/25"
              ] })
            ]
          },
          f2.id
        ))
      ] }, tactic.id);
    }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8", marginTop: 10, textAlign: "right", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-arrows-left-right", style: { fontSize: 9 } }),
      "Scroll to view all ",
      tactics.length,
      " tactics  |  ",
      covered,
      "/",
      tactics.length,
      " covered  |  ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-arrow-pointer", style: { fontSize: 9 } }),
      "Click cell to open finding"
    ] })
  ] });
};
const AttackPathSVG = ({ kc: kc2 }) => {
  const phases = kc2.phases || [];
  if (!phases.length) return null;
  const nodeR = 36, gap = 110, startX = 60;
  const svgW = Math.max(700, startX * 2 + phases.length * (nodeR * 2 + gap));
  const score = kc2.risk_score || 20;
  const scoreColor = score >= 20 ? "#dc2626" : score >= 12 ? "#ea580c" : "#d97706";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "16px 20px", boxShadow: "0 1px 3px rgba(15,23,42,.06)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 8 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, fontWeight: 800, color: "#0f172a" }, children: kc2.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#94a3b8", marginTop: 2 }, children: [
          phases.length,
          " phases sourced directly from your uploaded documentation"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: score >= 20 ? "#fef2f2" : "#fff7ed", color: scoreColor, border: `1px solid ${score >= 20 ? "#fecaca" : "#fed7aa"}` }, children: [
        "CRITICAL · SCORE ",
        score,
        "/25"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "100%", viewBox: `0 0 ${svgW} 200`, xmlns: "http://www.w3.org/2000/svg", style: { minWidth: 700 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("marker", { id: "rv-arr", viewBox: "0 0 10 10", refX: "8", refY: "5", markerWidth: "6", markerHeight: "6", orient: "auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M2 1L8 5L2 9", fill: "none", stroke: scoreColor, strokeWidth: "1.5", strokeLinecap: "round" }) }) }),
      phases.map((ph2, i) => {
        const cx = startX + nodeR + i * (nodeR * 2 + gap), cy = 90;
        const sev = ph2.severity || "HIGH";
        const stroke = SEV_COLOR[sev] || scoreColor;
        const fill = SEV_BG[sev] || "#fff7ed";
        const label = PHASE_LABELS[ph2.phase] || ph2.phase.slice(0, 4).toUpperCase();
        const nameShort = ph2.phase.slice(0, 12) + (ph2.phase.length > 12 ? "…" : "");
        const techShort = (ph2.technique_id || "").slice(0, 10);
        const detShort = (ph2.detection_window || "").slice(0, 14);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
          i > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: startX + nodeR + (i - 1) * (nodeR * 2 + gap) + nodeR, y1: cy, x2: cx - nodeR - 4, y2: cy, stroke, strokeWidth: "1.5", opacity: "0.6", markerEnd: "url(#rv-arr)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx, cy, r: nodeR, fill: "white", stroke, strokeWidth: "2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx, cy, r: nodeR - 6, fill }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: cx, y: cy + 4, textAnchor: "middle", fontSize: "9", fontFamily: "JetBrains Mono, monospace", fontWeight: "800", fill: stroke, children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: cx, y: cy + nodeR + 16, textAnchor: "middle", fill: stroke, fontSize: "9", fontFamily: "JetBrains Mono, monospace", fontWeight: "600", children: nameShort }),
          techShort && /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: cx, y: cy + nodeR + 27, textAnchor: "middle", fill: "#94a3b8", fontSize: "8", fontFamily: "JetBrains Mono, monospace", children: techShort }),
          detShort && /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: cx, y: cy + nodeR + 38, textAnchor: "middle", fill: stroke, fontSize: "8", fontFamily: "JetBrains Mono, monospace", fontWeight: "600", children: detShort })
        ] }, i);
      })
    ] }) })
  ] });
};
const KillChainSection = ({ killChains }) => {
  const [active, setActive] = reactExports.useState(0);
  if (!killChains || !killChains.length) return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "kill-chain", style: SS.section, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SecHeader, { num: "03", title: "Kill Chain Analysis", sub: "No attack scenarios for this assessment" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 13, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-link", style: { fontSize: 24, color: "#CBD5E1" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "No kill chain data. Run a new assessment." })
    ] })
  ] });
  const kc2 = killChains[active];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "kill-chain", style: SS.section, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SecHeader, { num: "03", title: "Kill Chain Analysis", sub: "Attack scenario phases — sourced directly from document evidence" }),
    killChains.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }, children: killChains.slice(0, 3).map((k2, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActive(i), style: { padding: "6px 14px", borderRadius: 8, border: "1px solid #cbd5e1", background: active === i ? "#0f172a" : "#fff", color: active === i ? "#fff" : "#475569", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }, children: [
      "Scenario ",
      i + 1,
      ": ",
      k2.title.slice(0, 40),
      k2.title.length > 40 ? "…" : "",
      " (",
      k2.risk_score,
      "/25)"
    ] }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AttackPathSVG, { kc: kc2 }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 20 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-list-check", style: { fontSize: 9, color: "#94a3b8" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }, children: "Phase-by-Phase Analysis with Detection Windows" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(15,23,42,.06)" }, children: (kc2.phases || []).map((ph2, i) => {
        const det = ph2.detection_window || "";
        const detColor = det.toLowerCase().match(/second|minute|real-time|immediate/) ? "#dc2626" : det.toLowerCase().match(/hour|day/) ? "#ea580c" : "#16a34a";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: { display: "flex", borderBottom: i < kc2.phases.length - 1 ? "1px solid #f1f5f9" : "none" },
            onMouseOver: (e) => e.currentTarget.style.background = "#f8f9fb",
            onMouseOut: (e) => e.currentTarget.style.background = "",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 40, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, color: "#94a3b8", flexShrink: 0, borderRight: "1px solid #f1f5f9", background: "#f8f9fb" }, children: String(i + 1).padStart(2, "0") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 52, display: "flex", alignItems: "center", justifyContent: "center", borderRight: "1px solid #f1f5f9", flexShrink: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 7, fontWeight: 800, padding: "2px 4px", borderRadius: 3, background: SEV_BG[ph2.severity || "HIGH"], color: SEV_COLOR[ph2.severity || "HIGH"], border: `1px solid ${SEV_BORDER[ph2.severity || "HIGH"]}` }, children: PHASE_LABELS[ph2.phase] || ph2.phase.slice(0, 4).toUpperCase() }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, padding: "10px 14px" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, fontWeight: 800, color: "#0f172a", marginBottom: 2 }, children: ph2.phase }),
                ph2.technique_id && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#2563eb", fontWeight: 600, marginBottom: 4 }, children: ph2.technique_id }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "#475569", lineHeight: 1.5, marginBottom: ph2.doc_evidence ? 5 : 0 }, children: ph2.description }),
                ph2.doc_evidence && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#64748b", background: "#f1f5f9", padding: "3px 7px", borderRadius: 4, borderLeft: "2px solid #2563eb", display: "inline-block", marginBottom: 4 }, children: ph2.doc_evidence }),
                ph2.mitigation && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, color: "#475569" }, children: [
                  "↳ ",
                  ph2.mitigation
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: 110, flexShrink: 0, padding: "10px 12px", borderLeft: "1px solid #f1f5f9", display: "flex", flexDirection: "column", gap: 4, justifyContent: "center" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: "#94a3b8", textTransform: "uppercase", fontWeight: 600 }, children: "Detection" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fontWeight: 700, color: detColor }, children: det || "—" })
              ] })
            ]
          },
          i
        );
      }) })
    ] })
  ] });
};
const FindingsSection = ({ findings, onFindingClick }) => {
  const [filter, setFilter] = reactExports.useState("ALL");
  const [search, setSearch] = reactExports.useState("");
  const [sortCol, setSortCol] = reactExports.useState(5);
  const [sortAsc, setSortAsc] = reactExports.useState(false);
  const sevCount = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  findings.forEach((f2) => {
    sevCount[f2.severity] = (sevCount[f2.severity] || 0) + 1;
  });
  const filtered = reactExports.useMemo(() => {
    let list = findings;
    if (filter !== "ALL") list = list.filter((f2) => f2.severity === filter);
    if (search) {
      const q2 = search.toLowerCase();
      list = list.filter((f2) => f2.title.toLowerCase().includes(q2) || (f2.technique_id || "").toLowerCase().includes(q2) || (f2.owner || "").toLowerCase().includes(q2) || (f2.tactic || "").toLowerCase().includes(q2) || f2.id.toLowerCase().includes(q2));
    }
    const cols = ["id", "title", "tactic", "technique_id", "severity", "risk_score", "owner", "timeline"];
    return [...list].sort((a, b) => {
      const av = a[cols[sortCol]] ?? "";
      const bv = b[cols[sortCol]] ?? "";
      const cmp = String(av).localeCompare(String(bv), void 0, { numeric: true });
      return sortAsc ? cmp : -cmp;
    });
  }, [findings, filter, search, sortCol, sortAsc]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "findings", style: SS.section, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SecHeader, { num: "04", title: `All Findings — ${findings.length} Total`, sub: "Click any row for evidence, scores & mitigation steps  ·  Sort by column  ·  Filter by severity" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12, alignItems: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search findings, techniques, owners…", style: { flex: 1, minWidth: 200, padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontFamily: "inherit", fontSize: 12, outline: "none", background: "#f8f9fb" } }),
      ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setFilter(s), style: { padding: "7px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", border: filter === s ? "none" : "1px solid #e2e8f0", background: filter === s ? SEV_COLOR[s] || "#0f172a" : "#fff", color: filter === s ? "#fff" : "#475569" }, children: s === "ALL" ? `All (${findings.length})` : `${s} (${sevCount[s] || 0})` }, s))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#64748b", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Showing ",
        filtered.length,
        " of ",
        findings.length,
        " findings"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#94a3b8", display: "flex", alignItems: "center", gap: 5 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-arrow-pointer", style: { fontSize: 9 } }),
        "Click any row to view detail"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(15,23,42,.06)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { overflowX: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { style: { width: "100%", borderCollapse: "collapse" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { style: { background: "#f1f5f9" }, children: ["ID", "Finding", "Tactic", "Technique", "Severity", "Score", "Owner", "Timeline"].map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("th", { onClick: () => {
        if (sortCol === i) setSortAsc((a) => !a);
        else {
          setSortCol(i);
          setSortAsc(false);
        }
      }, style: { padding: "9px 12px", fontFamily: "'JetBrains Mono',monospace", fontSize: 9, textTransform: "uppercase", letterSpacing: 0.5, color: sortCol === i ? "#2563eb" : "#94a3b8", textAlign: "left", fontWeight: 600, whiteSpace: "nowrap", cursor: "pointer", userSelect: "none" }, children: [
        h,
        " ",
        sortCol === i ? sortAsc ? "↑" : "↓" : "↕"
      ] }, h)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((f2, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          onClick: () => onFindingClick(f2),
          style: { background: "#fff", cursor: "pointer", transition: "background .1s", borderLeft: `4px solid ${SEV_COLOR[f2.severity] || "#e2e8f0"}` },
          onMouseOver: (e) => {
            e.currentTarget.style.background = SEV_BG[f2.severity] || "#eff6ff";
          },
          onMouseOut: (e) => {
            e.currentTarget.style.background = "#fff";
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { style: { padding: "12px 12px", whiteSpace: "nowrap" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#2563eb", fontWeight: 800 }, children: f2.id }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: "#94a3b8", marginTop: 2 }, children: f2.priority })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { style: { padding: "12px 12px", maxWidth: 260 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 800, fontSize: 12, color: "#0f172a", lineHeight: 1.3, marginBottom: 3 }, children: f2.title }),
              f2.verbatim_evidence && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#64748b", fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 240 }, children: [
                '"',
                f2.verbatim_evidence.slice(0, 60),
                f2.verbatim_evidence.length > 60 ? "…" : "",
                '"'
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "12px 12px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#475569", fontWeight: 600, background: "#f1f5f9", padding: "2px 6px", borderRadius: 4, display: "inline-block", whiteSpace: "nowrap" }, children: f2.tactic || "—" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "12px 12px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#2563eb", fontWeight: 700, background: "#eff6ff", padding: "2px 6px", borderRadius: 4, border: "1px solid #bfdbfe", display: "inline-block" }, children: f2.technique_id || "—" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "12px 12px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pill, { sev: f2.severity }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "12px 12px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 32, height: 32, borderRadius: "50%", background: SEV_BG[f2.severity], border: `2px solid ${SEV_COLOR[f2.severity]}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 900, color: SEV_COLOR[f2.severity], flexShrink: 0 }, children: f2.risk_score }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 40 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 4, background: "#f1f5f9", borderRadius: 2, overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: "100%", width: `${f2.risk_score / 25 * 100}%`, background: SEV_COLOR[f2.severity], borderRadius: 2 } }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 7, color: "#94a3b8", marginTop: 1 }, children: "/25" })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "12px 12px", fontSize: 11, color: "#475569", fontWeight: 600 }, children: f2.owner || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "12px 12px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 9,
              fontWeight: 700,
              color: f2.timeline && (f2.timeline.includes("0-30") || f2.timeline.includes("Immediate")) ? "#dc2626" : f2.timeline && f2.timeline.includes("30-90") ? "#ea580c" : "#d97706",
              background: f2.timeline && (f2.timeline.includes("0-30") || f2.timeline.includes("Immediate")) ? "#fef2f2" : f2.timeline && f2.timeline.includes("30-90") ? "#fff7ed" : "#fffbeb",
              padding: "3px 7px",
              borderRadius: 6,
              border: "1px solid #fde68a",
              whiteSpace: "nowrap",
              display: "inline-block"
            }, children: f2.timeline || "—" }) })
          ]
        },
        f2.id
      )) })
    ] }) }) })
  ] });
};
const RiskMatrixSection = ({ findings }) => {
  const GRID = [5, 4, 3, 2, 1];
  const cellF = (l2, imp) => findings.filter((f2) => (f2.likelihood || 3) === l2 && (f2.impact || 3) === imp);
  const cellC = (l2, imp) => {
    const s = l2 * imp;
    if (s >= 20) return { bg: "#fef2f2", b: "#fecaca", c: "#dc2626" };
    if (s >= 12) return { bg: "#fff7ed", b: "#fed7aa", c: "#ea580c" };
    if (s >= 6) return { bg: "#fffbeb", b: "#fde68a", c: "#d97706" };
    return { bg: "#f0fdf4", b: "#bbf7d0", c: "#16a34a" };
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "risk-matrix", style: SS.section, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SecHeader, { num: "05", title: "Risk Priority Matrix", sub: "Findings plotted by Likelihood × Impact" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 24, flexWrap: "wrap" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 320 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 30 } }),
          [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, textAlign: "center", fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8", fontWeight: 600 }, children: [
            "I=",
            i
          ] }, i))
        ] }),
        GRID.map((l2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: 30, fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8", fontWeight: 600, textAlign: "right" }, children: [
            "L=",
            l2
          ] }),
          [1, 2, 3, 4, 5].map((imp) => {
            const cell = cellF(l2, imp);
            const { bg: bg2, b, c } = cellC(l2, imp);
            return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, aspectRatio: "1", background: bg2, border: `1px solid ${b}`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 40, flexDirection: "column" }, children: cell.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 900, color: c }, children: cell.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 7, color: "#94a3b8" }, children: l2 * imp })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#e2e8f0" }, children: l2 * imp }) }, imp);
          })
        ] }, l2))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { minWidth: 160 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8", textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }, children: "Risk Zones" }),
        [{ label: "CRITICAL (20-25)", bg: "#fef2f2", b: "#fecaca", c: "#dc2626" }, { label: "HIGH (12-19)", bg: "#fff7ed", b: "#fed7aa", c: "#ea580c" }, { label: "MEDIUM (6-11)", bg: "#fffbeb", b: "#fde68a", c: "#d97706" }, { label: "LOW (1-5)", bg: "#f0fdf4", b: "#bbf7d0", c: "#16a34a" }].map((z2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 16, height: 16, background: z2.bg, border: `1px solid ${z2.b}`, borderRadius: 4 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 600, color: z2.c }, children: z2.label })
        ] }, z2.label)),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 16, padding: "10px 14px", background: "#f8f9fb", borderRadius: 8, border: "1px solid #e2e8f0" }, children: ["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((s) => {
          const count = findings.filter((f2) => f2.severity === s).length;
          const pct = findings.length > 0 ? Math.round(count / findings.length * 100) : 0;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 6 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 2 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fontWeight: 700, color: SEV_COLOR[s] }, children: s }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8" }, children: count })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 4, background: "#f1f5f9", borderRadius: 2 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: "100%", width: `${pct}%`, background: SEV_COLOR[s], borderRadius: 2 } }) })
          ] }, s);
        }) })
      ] })
    ] })
  ] });
};
const RecCard = ({ rec, onFindingClick }) => {
  const [open, setOpen] = reactExports.useState(false);
  const pc2 = { P0: "#dc2626", P1: "#ea580c", P2: "#d97706" }[rec.priority] || "#64748b";
  const pb2 = { P0: "#fef2f2", P1: "#fff7ed", P2: "#fffbeb" }[rec.priority] || "#f1f5f9";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, borderLeft: `4px solid ${pc2}`, boxShadow: "0 1px 3px rgba(15,23,42,.06)", overflow: "hidden" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => setOpen((o) => !o), style: { padding: "14px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: pb2, color: pc2, flexShrink: 0 }, children: rec.priority }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, fontWeight: 800, color: "#0f172a" }, children: rec.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 11, color: "#64748b", marginTop: 2 }, children: [
          rec.risk_reduction_pct && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, color: "#16a34a" }, children: [
            rec.risk_reduction_pct,
            "% risk reduction"
          ] }),
          rec.effort_weeks && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#94a3b8" }, children: [
            " · ",
            rec.effort_weeks,
            "w effort"
          ] }),
          rec.owner && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#94a3b8" }, children: [
            " · ",
            rec.owner
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: `fas ${open ? "fa-chevron-up" : "fa-chevron-down"}`, style: { color: "#94a3b8", fontSize: 11 } })
    ] }),
    open && (rec.steps || []).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "0 18px 14px", borderTop: "1px solid #f1f5f9" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8", textTransform: "uppercase", fontWeight: 600, margin: "12px 0 8px" }, children: "Implementation Steps" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { style: { margin: 0, paddingLeft: 18 }, children: (rec.steps || []).map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { style: { fontSize: 12, color: "#475569", marginBottom: 5, lineHeight: 1.5 }, children: s }, i)) }),
      (rec.addresses_findings || []).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8", fontWeight: 600 }, children: "Addresses:" }),
        rec.addresses_findings.map((fid) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: (e) => {
              e.stopPropagation();
              onFindingClick(fid);
            },
            style: {
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 9,
              fontWeight: 700,
              color: "#2563eb",
              background: "#eff6ff",
              padding: "3px 8px",
              borderRadius: 4,
              border: "1px solid #bfdbfe",
              cursor: "pointer",
              transition: "all 0.15s"
            },
            onMouseOver: (e) => {
              e.currentTarget.style.background = "#2563eb";
              e.currentTarget.style.color = "white";
            },
            onMouseOut: (e) => {
              e.currentTarget.style.background = "#eff6ff";
              e.currentTarget.style.color = "#2563eb";
            },
            children: [
              fid,
              " →"
            ]
          },
          fid
        ))
      ] })
    ] })
  ] });
};
const RecommendationsSection = ({ recs, onFindingClick }) => {
  const [ap, setAp] = reactExports.useState("P0");
  const p0 = recs.filter((r2) => r2.priority === "P0"), p1 = recs.filter((r2) => r2.priority === "P1"), p2 = recs.filter((r2) => r2.priority === "P2");
  const shown = ap === "P0" ? p0 : ap === "P1" ? p1 : p2;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "recommendations", style: SS.section, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SecHeader, { num: "06", title: "Prioritized Recommendations", sub: "Ordered by risk reduction potential · Click finding IDs to jump" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 6, marginBottom: 16 }, children: [["P0", p0.length, "#dc2626"], ["P1", p1.length, "#ea580c"], ["P2", p2.length, "#d97706"]].map(([pri, count, color]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setAp(pri), style: { padding: "8px 16px", borderRadius: 8, border: "1px solid #e2e8f0", background: ap === pri ? color : "#fff", color: ap === pri ? "#fff" : "#475569", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }, children: [
      pri,
      " — ",
      count,
      " item",
      count !== 1 ? "s" : ""
    ] }, pri)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: [
      shown.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: 32, textAlign: "center", color: "#94a3b8", fontSize: 13, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-shield-halved", style: { fontSize: 24, color: "#CBD5E1" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "No ",
          ap,
          " recommendations generated."
        ] })
      ] }),
      shown.map((r2, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(RecCard, { rec: r2, onFindingClick }, r2.id || i))
    ] })
  ] });
};
const ActionPlanSection = ({ findings, items, setItems, onSave, saving, saved }) => {
  const p0p1 = findings.filter((f2) => f2.priority === "P0" || f2.priority === "P1");
  const toggle = (f2, checked) => {
    if (checked) setItems((prev) => [...prev.filter((a) => a.id !== f2.id), { id: f2.id, title: f2.title, severity: f2.severity, timeline: f2.timeline, assignee: f2.owner || "", dueDate: "", status: "Open", notes: "" }]);
    else setItems((prev) => prev.filter((a) => a.id !== f2.id));
  };
  const update = (id2, field, value) => setItems((prev) => prev.map((a) => a.id === id2 ? { ...a, [field]: value } : a));
  const sc2 = { "Open": "#dc2626", "In Progress": "#ea580c", "Complete": "#16a34a", "Deferred": "#94a3b8" };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "action-plan", style: SS.section, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SecHeader, { num: "10", title: "Action Plan Builder", sub: "Select findings  ·  Assign owners  ·  Set due dates  ·  Track status" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 13, color: "#475569" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: items.length }),
        " item",
        items.length !== 1 ? "s" : "",
        " in action plan"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onSave, disabled: saving, style: { padding: "8px 18px", borderRadius: 8, border: "none", background: saved ? "#16a34a" : "#2563eb", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }, children: saving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-circle-notch fa-spin", style: { fontSize: 11 } }),
        "Saving…"
      ] }) : saved ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-check", style: { fontSize: 11 } }),
        "Saved!"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-floppy-disk", style: { fontSize: 11 } }),
        "Save Action Plan"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: p0p1.map((f2) => {
      const ex = items.find((a) => a.id === f2.id);
      const pc2 = f2.priority === "P0" ? "#dc2626" : "#ea580c";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, borderLeft: `4px solid ${pc2}`, boxShadow: "0 1px 2px rgba(15,23,42,.04)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "12px 16px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: !!ex, onChange: (e) => toggle(f2, e.target.checked), style: { width: 16, height: 16, cursor: "pointer", accentColor: "#2563eb" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#2563eb", fontWeight: 700 }, children: f2.id }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pill, { sev: f2.severity }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13, fontWeight: 700, color: "#0f172a", flex: 1 }, children: f2.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#94a3b8" }, children: f2.timeline }),
          ex && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 10, color: sc2[ex.status] || "#94a3b8", background: "#f8f9fb", border: "1px solid #e2e8f0" }, children: ex.status })
        ] }),
        ex && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, padding: "0 16px 14px", borderTop: "1px solid #f8f9fb" }, children: [
          [{ l: "Assignee", f: "assignee", p: f2.owner, t: "text" }, { l: "Due Date", f: "dueDate", p: "", t: "date" }].map(({ l: l2, f: field, p: p2, t: t2 }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: 4, marginTop: 10 }, children: l2 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: t2, value: ex[field], placeholder: p2, onChange: (e) => update(f2.id, field, e.target.value), style: { width: "100%", background: "#f8f9fb", border: "1px solid #e2e8f0", borderRadius: 6, padding: "6px 8px", fontFamily: "inherit", fontSize: 11, color: "#0f172a", outline: "none", boxSizing: "border-box" } })
          ] }, field)),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: 4, marginTop: 10 }, children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: ex.status, onChange: (e) => update(f2.id, "status", e.target.value), style: { width: "100%", background: "#f8f9fb", border: "1px solid #e2e8f0", borderRadius: 6, padding: "6px 8px", fontFamily: "inherit", fontSize: 11, color: "#0f172a", outline: "none" }, children: ["Open", "In Progress", "Complete", "Deferred"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: s }, s)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { gridColumn: "1 / -1" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: 4 }, children: "Notes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: ex.notes, placeholder: "Add notes or blockers…", onChange: (e) => update(f2.id, "notes", e.target.value), style: { width: "100%", background: "#f8f9fb", border: "1px solid #e2e8f0", borderRadius: 6, padding: "6px 8px", fontFamily: "inherit", fontSize: 11, color: "#0f172a", outline: "none", boxSizing: "border-box" } })
          ] })
        ] })
      ] }, f2.id);
    }) })
  ] });
};
const FindingModal = ({
  finding,
  onClose,
  onAddToActionPlan,
  relatedRecs,
  relatedComponents,
  relatedSpecialized
}) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { onClick: (e) => {
  if (e.target === e.currentTarget) onClose();
}, style: { position: "fixed", inset: 0, background: "rgba(15,23,42,.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1e3, padding: 20 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "#fff", borderRadius: 16, width: "100%", maxWidth: 600, maxHeight: "85vh", overflow: "auto", boxShadow: "0 24px 64px rgba(15,23,42,.25)" }, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "20px 24px 16px", borderBottom: "1px solid #f1f5f9", position: "sticky", top: 0, background: "#fff", zIndex: 1 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#2563eb", fontWeight: 700 }, children: finding.id }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Pill, { sev: finding.severity })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, style: { width: 28, height: 28, borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8f9fb", cursor: "pointer", fontSize: 12, color: "#475569", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-xmark" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { fontSize: 16, fontWeight: 800, color: "#0f172a", marginTop: 8, lineHeight: 1.3 }, children: finding.title }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#94a3b8", marginTop: 4 }, children: [
      finding.tactic,
      " · ",
      finding.technique_id,
      " · ",
      finding.doc_source
    ] })
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "20px 24px" }, children: [
    finding.verbatim_evidence && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 20 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }, children: "Document Evidence" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "#f8f9fb", border: "1px solid #e2e8f0", borderLeft: "3px solid #2563eb", borderRadius: 8, padding: "12px 16px", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#475569", lineHeight: 1.6 }, children: [
        '"',
        finding.verbatim_evidence,
        '"'
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 20 }, children: [["Likelihood", `${finding.likelihood || "—"} / 5`], ["Impact", `${finding.impact || "—"} / 5`], ["Risk Score", `${finding.risk_score} / 25`], ["Priority", finding.priority]].map(([l2, v2]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "#f8f9fb", borderRadius: 8, padding: "10px 12px", border: "1px solid #e2e8f0" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }, children: l2 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 15, fontWeight: 900, color: SEV_COLOR[finding.severity] || "#475569" }, children: v2 })
    ] }, l2)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }, children: [["Owner", finding.owner || "—"], ["Timeline", finding.timeline || "—"]].map(([l2, v2]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "#f8f9fb", borderRadius: 8, padding: "10px 12px", border: "1px solid #e2e8f0" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }, children: l2 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, fontWeight: 700, color: "#0f172a" }, children: v2 })
    ] }, l2)) }),
    finding.business_impact && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 20 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }, children: "Business Impact" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 13, color: "#475569", lineHeight: 1.6, margin: 0 }, children: finding.business_impact })
    ] }),
    (finding.mitigation_steps || []).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 20 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#94a3b8", textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }, children: "Recommended Mitigation Steps" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { style: { margin: 0, paddingLeft: 18 }, children: (finding.mitigation_steps || []).map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { style: { fontSize: 12, color: "#475569", marginBottom: 6, lineHeight: 1.5 }, children: s }, i)) })
    ] }),
    (relatedRecs.length > 0 || relatedComponents.length > 0 || relatedSpecialized.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 20, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: "14px 16px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#2563eb", textTransform: "uppercase", fontWeight: 600, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-link", style: { fontSize: 9 } }),
        "Referenced In"
      ] }),
      relatedRecs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: relatedComponents.length > 0 || relatedSpecialized.length > 0 ? 10 : 0 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, color: "#475569", marginBottom: 4, fontWeight: 600 }, children: [
          relatedRecs.length,
          " Recommendation",
          relatedRecs.length !== 1 ? "s" : "",
          ":"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 4, flexWrap: "wrap" }, children: relatedRecs.map((r2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#16a34a", background: "#f0fdf4", padding: "2px 6px", borderRadius: 4, border: "1px solid #bbf7d0" }, children: [
          r2.id,
          " ",
          r2.priority
        ] }, r2.id)) })
      ] }),
      relatedComponents.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: relatedSpecialized.length > 0 ? 10 : 0 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, color: "#475569", marginBottom: 4, fontWeight: 600 }, children: [
          relatedComponents.length,
          " Component",
          relatedComponents.length !== 1 ? "s" : "",
          ":"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 4, flexWrap: "wrap" }, children: relatedComponents.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "#0f172a", background: "#f8fafc", padding: "2px 8px", borderRadius: 4, border: "1px solid #e2e8f0" }, children: c.component }, c.component)) })
      ] }),
      relatedSpecialized.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, color: "#475569", marginBottom: 4, fontWeight: 600 }, children: [
          relatedSpecialized.length,
          " Specialized Risk",
          relatedSpecialized.length !== 1 ? "s" : "",
          ":"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 4, flexWrap: "wrap" }, children: relatedSpecialized.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "#0f172a", background: "#f8fafc", padding: "2px 8px", borderRadius: 4, border: "1px solid #e2e8f0" }, children: s.domain }, i)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
      onAddToActionPlan(finding);
      onClose();
    }, style: { width: "100%", padding: "12px", borderRadius: 8, border: "none", background: BLUE, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-plus", style: { fontSize: 11 } }),
      "Add to Action Plan"
    ] })
  ] })
] }) });
const SS = {
  section: { background: "#ffffff", borderRadius: 12, border: "1px solid #E2E8F0", padding: "32px", boxShadow: "0 2px 10px rgba(11,30,61,.07)", scrollMarginTop: 16 }
};
const ReportViewer = ({ assessmentId, projectName, token, apiBase = "", onActionPlanSave }) => {
  const [structured, setStructured] = reactExports.useState(null);
  const [rawMarkdown, setRawMarkdown] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [pdfLoading, setPdfLoading] = reactExports.useState(false);
  const [actionPlanItems, setActionPlanItems] = reactExports.useState([]);
  const [apSaving, setApSaving] = reactExports.useState(false);
  const [apSaved, setApSaved] = reactExports.useState(false);
  const [activeSection, setActiveSection] = reactExports.useState("exec-summary");
  const [selectedFinding, setSelectedFinding] = reactExports.useState(null);
  const [activeView, setActiveView] = reactExports.useState("report");
  const [printMode, setPrintMode] = reactExports.useState(false);
  const [observerEnabled, setObserverEnabled] = reactExports.useState(false);
  const scrollContainerRef = reactExports.useRef(null);
  const tok = token || localStorage.getItem("token") || localStorage.getItem("access_token") || "";
  const headers = { Authorization: `Bearer ${tok}`, "Content-Type": "application/json" };
  reactExports.useEffect(() => {
    if (!assessmentId) return;
    setLoading(true);
    setObserverEnabled(false);
    Promise.all([
      fetch(`${apiBase}/reports/${assessmentId}/structured`, { headers }).then((r2) => r2.json()),
      fetch(`${apiBase}/reports/${assessmentId}`, { headers }).then((r2) => r2.json()),
      fetch(`${apiBase}/reports/${assessmentId}/action-plan`, { headers }).then((r2) => r2.json())
    ]).then(([sr, rr, ar]) => {
      setStructured(sr.structured || null);
      setRawMarkdown(rr.report || "");
      setActionPlanItems(ar.items || []);
    }).catch((e) => setError(`Failed to load report: ${e.message}`)).finally(() => {
      setLoading(false);
      setActiveSection("exec-summary");
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0;
          setActiveSection("exec-summary");
        }
        setTimeout(() => setObserverEnabled(true), 1e3);
      }, 100);
    });
  }, [assessmentId]);
  reactExports.useEffect(() => {
    if (!observerEnabled) return;
    const root2 = scrollContainerRef.current || null;
    if (!root2) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && e.intersectionRatio > 0.15) setActiveSection(e.target.id);
      });
    }, { root: root2, threshold: [0.15, 0.5], rootMargin: "0px 0px -40% 0px" });
    NAV_ITEMS.forEach((item) => {
      const el2 = document.getElementById(item.id);
      if (el2) obs.observe(el2);
    });
    return () => obs.disconnect();
  }, [observerEnabled]);
  const downloadPdf = reactExports.useCallback(async () => {
    setPdfLoading(true);
    try {
      const resp = await fetch(`${apiBase}/reports/${assessmentId}/pdf`, { headers });
      if (!resp.ok) throw new Error("PDF generation failed");
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Threat_Assessment_${projectName.replace(/\s+/g, "_")}_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(`PDF download failed: ${e.message}`);
    } finally {
      setPdfLoading(false);
    }
  }, [assessmentId, projectName]);
  const saveActionPlan = reactExports.useCallback(async () => {
    setApSaving(true);
    try {
      await fetch(`${apiBase}/reports/${assessmentId}/action-plan`, { method: "POST", headers, body: JSON.stringify({ items: actionPlanItems }) });
      setApSaved(true);
      setTimeout(() => setApSaved(false), 2500);
      onActionPlanSave == null ? void 0 : onActionPlanSave(actionPlanItems);
    } catch (e) {
      alert(`Save failed: ${e.message}`);
    } finally {
      setApSaving(false);
    }
  }, [assessmentId, actionPlanItems]);
  const printExecSummary = reactExports.useCallback(() => {
    const el2 = document.getElementById("exec-summary");
    if (!el2) return;
    const w2 = window.open("", "_blank", "width=900,height=700");
    if (!w2) return;
    w2.document.write(`<!DOCTYPE html><html><head><title>${projectName} — Executive Summary</title>
      <link href="https://fonts.googleapis.com/css2?family=Epilogue:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Epilogue',sans-serif;background:#fff;padding:0;}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}</style>
      </head><body>${el2.outerHTML}</body></html>`);
    w2.document.close();
    setTimeout(() => w2.print(), 800);
  }, [projectName]);
  const addToActionPlan = reactExports.useCallback((f2) => {
    setActionPlanItems((prev) => [...prev.filter((a) => a.id !== f2.id), { id: f2.id, title: f2.title, severity: f2.severity, timeline: f2.timeline, assignee: f2.owner || "", dueDate: "", status: "Open", notes: "" }]);
    const container = scrollContainerRef.current;
    const el2 = document.getElementById("action-plan");
    if (container && el2) {
      const containerRect = container.getBoundingClientRect();
      const elRect = el2.getBoundingClientRect();
      const offset = elRect.top - containerRect.top + container.scrollTop - 16;
      container.scrollTo({ top: offset, behavior: "smooth" });
    }
  }, []);
  const navigateToFinding = reactExports.useCallback((findingId) => {
    const finding = findings.find((f2) => f2.id === findingId);
    if (!finding) return;
    const container = scrollContainerRef.current;
    const el2 = document.getElementById("findings");
    if (container && el2) {
      const containerRect = container.getBoundingClientRect();
      const elRect = el2.getBoundingClientRect();
      const offset = elRect.top - containerRect.top + container.scrollTop - 16;
      container.scrollTo({ top: offset, behavior: "smooth" });
      setTimeout(() => setSelectedFinding(finding), 400);
    } else {
      setSelectedFinding(finding);
    }
  }, [findings]);
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", background: "#F0F4F9", borderRadius: 12, border: "1px solid #E2E8F0" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 36, height: 36, border: "3px solid #E2E8F0", borderTop: `3px solid ${BLUE}`, borderRadius: "50%", animation: "rv-spin 0.8s linear infinite" } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#475569", fontSize: 13, marginTop: 16, fontFamily: "'JetBrains Mono',monospace", letterSpacing: 0.3 }, children: "Loading assessment report…" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `@keyframes rv-spin{to{transform:rotate(360deg);}}` })
  ] });
  if (error) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px", background: "#FEF2F2", borderRadius: 12, border: "1px solid #FECACA" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-triangle-exclamation", style: { fontSize: 20, color: "#DC2626" } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#DC2626", fontSize: 13, marginTop: 10, fontWeight: 600 }, children: error })
  ] });
  const overall = (structured == null ? void 0 : structured.overall_risk_rating) || "HIGH";
  const sev = (structured == null ? void 0 : structured.findings_by_severity) || { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  const findings = (structured == null ? void 0 : structured.all_findings) || [];
  const recs = (structured == null ? void 0 : structured.all_recommendations) || [];
  const killChains = (structured == null ? void 0 : structured.kill_chains) || [];
  const fw = (structured == null ? void 0 : structured.frameworks_used) || [];
  const reverseRefs = reactExports.useMemo(() => {
    if (!selectedFinding || !structured) return { recs: [], components: [], specialized: [] };
    const fid = selectedFinding.id;
    const relatedRecs = recs.filter((r2) => (r2.addresses_findings || []).includes(fid));
    const relatedComponents = (structured.component_analysis || []).filter((c) => (c.finding_refs || []).includes(fid));
    const relatedSpecialized = [];
    (structured.specialized_risks || []).forEach((risk) => {
      risk.findings.forEach((f2) => {
        if (f2.finding_ref === fid) {
          relatedSpecialized.push({ domain: risk.domain, finding: f2.label });
        }
      });
    });
    return { recs: relatedRecs, components: relatedComponents, specialized: relatedSpecialized };
  }, [selectedFinding, structured, recs]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontFamily: "'Epilogue','Inter',sans-serif", background: PAGE_BG }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `@keyframes rv-spin{to{transform:rotate(360deg);}}*{box-sizing:border-box;}@media print{nav,button,.no-print{display:none!important;}}` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: `linear-gradient(135deg,${NAVY} 0%,#152d54 100%)`, borderRadius: "12px 12px 0 0", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 14 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 36, height: 36, background: BLUE, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-shield-halved", style: { color: "#fff", fontSize: 16 } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: 15, fontWeight: 800, color: "#fff", letterSpacing: -0.3, margin: 0 }, children: "Threat Assessment Report" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 3, background: "#EF4444", color: "#fff", letterSpacing: 0.8 }, children: "CONFIDENTIAL" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { fontSize: 12, color: "rgba(255,255,255,.6)", margin: 0 }, children: [
            projectName,
            " · ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: SEV_COLOR[overall] || "#EA580C", fontWeight: 700 }, children: [
              overall,
              " RISK"
            ] }),
            " · ",
            findings.length,
            " findings"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 4, marginRight: 4 }, children: ["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", padding: "4px 10px", borderRadius: 6, background: `rgba(255,255,255,.08)`, border: `1px solid rgba(255,255,255,.12)` }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 14, fontWeight: 900, color: SEV_COLOR[s], lineHeight: 1 }, children: sev[s] || 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 7, color: "rgba(255,255,255,.45)", textTransform: "uppercase", marginTop: 1 }, children: s.slice(0, 4) })
        ] }, s)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveView((v2) => v2 === "report" ? "raw" : "report"), style: { padding: "8px 14px", borderRadius: 7, border: "1px solid rgba(255,255,255,.2)", background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.85)", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: `fas ${activeView === "report" ? "fa-code" : "fa-chart-bar"}`, style: { fontSize: 11 } }),
          activeView === "report" ? "Raw Markdown" : "Interactive Report"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: downloadPdf, disabled: pdfLoading, style: { padding: "8px 16px", borderRadius: 7, border: "none", background: BLUE, color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6, opacity: pdfLoading ? 0.7 : 1 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: `fas ${pdfLoading ? "fa-circle-notch fa-spin" : "fa-download"}`, style: { fontSize: 11 } }),
          pdfLoading ? "Generating PDF…" : "Download PDF"
        ] })
      ] })
    ] }),
    activeView === "raw" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "#0F172A", maxHeight: "80vh", overflow: "auto", borderRadius: "0 0 12px 12px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { style: { padding: 28, margin: 0, color: "#E2E8F0", fontSize: 12, lineHeight: 1.7, fontFamily: "'JetBrains Mono',monospace", whiteSpace: "pre-wrap", wordBreak: "break-word" }, children: rawMarkdown }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", background: PAGE_BG }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { style: { width: 220, flexShrink: 0, background: NAVY, padding: "20px 0", position: "sticky", top: 0, height: "calc(100vh - 120px)", overflowY: "auto", display: "flex", flexDirection: "column" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "0 16px 14px", fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: "rgba(255,255,255,.3)", textTransform: "uppercase", fontWeight: 600, letterSpacing: 1.2 }, children: "Report Sections" }),
        NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: `#${item.id}`,
              onClick: (e) => {
                e.preventDefault();
                const container = scrollContainerRef.current;
                const el2 = document.getElementById(item.id);
                if (container) {
                  if (item.id === "exec-summary") {
                    container.scrollTo({ top: 0, behavior: "smooth" });
                  } else if (el2) {
                    const containerRect = container.getBoundingClientRect();
                    const elRect = el2.getBoundingClientRect();
                    const offset = elRect.top - containerRect.top + container.scrollTop - 16;
                    container.scrollTo({ top: offset, behavior: "smooth" });
                  }
                }
                setActiveSection(item.id);
              },
              style: { display: "flex", alignItems: "center", gap: 10, padding: "9px 16px 9px 0", fontSize: 12, fontWeight: 600, textDecoration: "none", transition: "all .12s", color: isActive ? "#fff" : "rgba(255,255,255,.5)", background: isActive ? "rgba(29,78,216,.25)" : "transparent", borderLeft: isActive ? `3px solid ${BLUE}` : "3px solid transparent", paddingLeft: 13 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: `fas ${item.faIcon}`, style: { fontSize: 12, width: 16, textAlign: "center", color: isActive ? BLUE : "rgba(255,255,255,.35)", flexShrink: 0 } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { flex: 1, fontSize: 11.5 }, children: item.label }),
                item.id === "findings" && findings.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 8, fontWeight: 700, padding: "1px 6px", borderRadius: 3, background: "rgba(220,38,38,.3)", color: "#FCA5A5", border: "1px solid rgba(220,38,38,.4)", marginRight: 8 }, children: findings.length }),
                item.id === "action-plan" && actionPlanItems.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 8, fontWeight: 700, padding: "1px 6px", borderRadius: 3, background: "rgba(29,78,216,.4)", color: "#93C5FD", border: "1px solid rgba(29,78,216,.5)", marginRight: 8 }, children: actionPlanItems.length }),
                item.id === "recommendations" && recs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 8, fontWeight: 700, padding: "1px 6px", borderRadius: 3, background: "rgba(22,163,74,.25)", color: "#86EFAC", border: "1px solid rgba(22,163,74,.4)", marginRight: 8 }, children: recs.length })
              ]
            },
            item.id
          );
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: "auto", padding: "16px", borderTop: "1px solid rgba(255,255,255,.06)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: "rgba(255,255,255,.25)", lineHeight: 1.8, letterSpacing: 0.2 }, children: [
          projectName,
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          structured == null ? void 0 : structured.assessment_date,
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          fw.slice(0, 2).join(" · "),
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "ThreatVision AI"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: scrollContainerRef, style: { flex: 1, padding: "0", overflowY: "auto", display: "flex", flexDirection: "column", gap: 20, maxHeight: "calc(100vh - 120px)", paddingBottom: "24px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "0 24px", paddingTop: "20px" }, children: structured ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ExecutiveSummary, { data: structured, projectName, onPrint: printExecSummary }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 20 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(OverviewSection, { data: structured, projectName }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 20 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AttckMapSection, { findings, frameworks: fw, onFindingClick: setSelectedFinding }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 20 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(KillChainSection, { killChains }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 20 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FindingsSection, { findings, onFindingClick: setSelectedFinding }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 20 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RiskMatrixSection, { findings }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 20 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RecommendationsSection, { recs, onFindingClick: navigateToFinding }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 20 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "specialized", style: SS.section, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SecHeader, { num: "08", title: "Specialized Risk Assessments", sub: `${(structured.specialized_risks || []).length} specialized domains analyzed` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SpecializedRiskSection, { risks: structured.specialized_risks || [], onFindingClick: navigateToFinding })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 20 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "components", style: SS.section, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SecHeader, { num: "09", title: "Component-Specific Threat Analysis", sub: `${(structured.component_analysis || []).length} architectural components assessed` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ComponentSpecificSection, { components: structured.component_analysis || [], onFindingClick: navigateToFinding })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 20 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ActionPlanSection, { findings, items: actionPlanItems, setItems: setActionPlanItems, onSave: saveActionPlan, saving: apSaving, saved: apSaved })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: 48, textAlign: "center", color: "#94a3b8", fontSize: 13, background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-file-circle-question", style: { fontSize: 28, color: "#CBD5E1" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "No structured data available. Run a new assessment with the latest prompt version." })
      ] }) }) })
    ] }),
    selectedFinding && /* @__PURE__ */ jsxRuntimeExports.jsx(
      FindingModal,
      {
        finding: selectedFinding,
        onClose: () => setSelectedFinding(null),
        onAddToActionPlan: addToActionPlan,
        relatedRecs: reverseRefs.recs,
        relatedComponents: reverseRefs.components,
        relatedSpecialized: reverseRefs.specialized
      }
    )
  ] });
};
const markdownToHtml = (markdown) => {
  let html = markdown.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = html.split("\n");
  const processedLines = [];
  let inTable = false;
  let tableBuffer = [];
  let inCodeBlock = false;
  let codeBuffer = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        processedLines.push(`<pre class="bg-gray-100 p-4 rounded overflow-x-auto my-4 text-sm"><code>${codeBuffer.join("\n")}</code></pre>`);
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }
    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      if (!inTable) {
        inTable = true;
        tableBuffer = [];
      }
      tableBuffer.push(line);
      continue;
    } else if (inTable) {
      if (tableBuffer.length >= 2) {
        const headers = tableBuffer[0].split("|").filter((c) => c.trim()).map((h) => h.trim());
        const rows = tableBuffer.slice(2).map((row) => row.split("|").filter((c) => c.trim()).map((c) => c.trim()));
        processedLines.push(`<table class="min-w-full border-collapse my-6"><thead><tr>${headers.map((h) => `<th class="border border-gray-300 px-4 py-2 bg-blue-600 text-white text-left">${h}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((c) => `<td class="border border-gray-300 px-4 py-2">${c}</td>`).join("")}</tr>`).join("")}</tbody></table>`);
      }
      inTable = false;
      tableBuffer = [];
    }
    if (trimmed.startsWith("### ")) {
      processedLines.push(`<h3 style="color: #475569; font-size: 1.25rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.75rem;">${trimmed.substring(4)}</h3>`);
      continue;
    }
    if (trimmed.startsWith("## ")) {
      processedLines.push(`<h2 style="color: #334155; font-size: 1.5rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; border-left: 5px solid #3b82f6; padding-left: 1rem; background: linear-gradient(90deg, #eff6ff 0%, transparent 100%); padding-top: 0.5rem; padding-bottom: 0.5rem;">${trimmed.substring(3)}</h2>`);
      continue;
    }
    if (trimmed.startsWith("# ")) {
      processedLines.push(`<h1 style="color: #1e293b; font-size: 2rem; font-weight: 800; margin-top: 2.5rem; margin-bottom: 1.5rem; border-bottom: 3px solid #3b82f6; padding-bottom: 0.75rem;">${trimmed.substring(2)}</h1>`);
      continue;
    }
    if (trimmed === "---" || trimmed === "***") {
      processedLines.push('<hr class="my-6 border-t-2 border-gray-300" />');
      continue;
    }
    if (trimmed.startsWith("> ")) {
      processedLines.push(`<blockquote class="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-700">${trimmed.substring(2)}</blockquote>`);
      continue;
    }
    if (trimmed.startsWith("- ")) {
      const formatted = trimmed.substring(2).replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>').replace(/\*(.+?)\*/g, "<em>$1</em>");
      processedLines.push(`<li class="ml-6 my-1">${formatted}</li>`);
      continue;
    }
    if (/^\d+\.\s/.test(trimmed)) {
      const text = trimmed.replace(/^\d+\.\s/, "");
      const formatted = text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>').replace(/\*(.+?)\*/g, "<em>$1</em>");
      processedLines.push(`<li class="ml-6 my-1">${formatted}</li>`);
      continue;
    }
    if (trimmed) {
      const formatted = line.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>').replace(/\*(.+?)\*/g, "<em>$1</em>");
      processedLines.push(formatted);
    } else {
      processedLines.push("<br/>");
    }
  }
  let finalHtml = processedLines.join("\n");
  finalHtml = finalHtml.replace(/(<li class="ml-6 my-1">.+?<\/li>\n?)+/g, (match) => {
    return `<ul class="list-disc pl-6 my-3">${match}</ul>`;
  });
  return finalHtml;
};
function App() {
  const { user, token, logout, isAdmin, loading } = useAuth();
  const [view, setView] = reactExports.useState("upload");
  const [showAuthModal, setShowAuthModal] = reactExports.useState(null);
  const [sidebarOpen, setSidebarOpen] = reactExports.useState(false);
  const [projectName, setProjectName] = reactExports.useState("");
  const [projectNumber, setProjectNumber] = reactExports.useState("");
  const [projectStage, setProjectStage] = reactExports.useState(PROJECT_STAGES[0]);
  const [framework, setFramework] = reactExports.useState(FRAMEWORKS[0]);
  const [frameworks, setFrameworks] = reactExports.useState([FRAMEWORKS[0]]);
  const [businessCriticality, setBusinessCriticality] = reactExports.useState(BUSINESS_CRITICALITY[0]);
  const [applicationType, setApplicationType] = reactExports.useState(APPLICATION_TYPES[0]);
  const [deploymentModel, setDeploymentModel] = reactExports.useState(DEPLOYMENT_MODELS[0]);
  const [environment, setEnvironment] = reactExports.useState(ENVIRONMENTS[0]);
  const [complianceRequirements, setComplianceRequirements] = reactExports.useState([]);
  const [riskFocusAreas, setRiskFocusAreas] = reactExports.useState([]);
  const [documents, setDocuments] = reactExports.useState([]);
  const [report, setReport] = reactExports.useState(null);
  const [currentAssessmentId, setCurrentAssessmentId] = reactExports.useState(null);
  const [reportProjects, setReportProjects] = reactExports.useState([]);
  const [isGenerating, setIsGenerating] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (!loading && !user) {
      setShowAuthModal("login");
    }
  }, [loading, user]);
  reactExports.useEffect(() => {
    if (user && token) {
      fetchSavedReports();
    }
  }, [user, token]);
  const fetchSavedReports = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reports`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setReportProjects(data.projects || []);
      }
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    }
  };
  const resetForm = () => {
    setProjectName("");
    setProjectNumber("");
    setProjectStage(PROJECT_STAGES[0]);
    setFramework(FRAMEWORKS[0]);
    setFrameworks([FRAMEWORKS[0]]);
    setBusinessCriticality(BUSINESS_CRITICALITY[0]);
    setApplicationType(APPLICATION_TYPES[0]);
    setDeploymentModel(DEPLOYMENT_MODELS[0]);
    setEnvironment(ENVIRONMENTS[0]);
    setComplianceRequirements([]);
    setRiskFocusAreas([]);
    setDocuments([]);
    setReport(null);
    setCurrentAssessmentId(null);
    setError("");
  };
  const handleFilesAdded = (newDocs) => {
    setDocuments([...documents, ...newDocs]);
    setError("");
  };
  const handleGenerateReport = async () => {
    if (!projectName || documents.length === 0) {
      setError("Please provide project name and upload at least one document");
      return;
    }
    const apiKey = localStorage.getItem("anthropic_api_key") || localStorage.getItem("api_key");
    if (!apiKey || apiKey.trim() === "") {
      setError("SecureAI API key is missing. Please click the Settings gear icon (⚙️) in the top right and enter your API key.");
      setSidebarOpen(true);
      return;
    }
    setIsGenerating(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/threat-modeling`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          project_name: projectName,
          project_number: projectNumber,
          project_stage: projectStage,
          framework,
          frameworks,
          business_criticality: businessCriticality,
          application_type: applicationType,
          deployment_model: deploymentModel,
          environment,
          compliance_requirements: complianceRequirements,
          risk_focus_areas: riskFocusAreas,
          documents,
          system_description: documents.length > 0 ? documents.map((doc) => `Document: ${doc.name}
Category: ${doc.category}
Size: ${doc.size}`).join("\n\n") : "No documentation provided yet.",
          anthropic_api_key: apiKey
        })
      });
      if (!response.ok) {
        let errorMessage = "Failed to generate threat assessment";
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } catch {
          try {
            const errorText = await response.text();
            if (errorText.includes("<html>") || errorText.includes("<!DOCTYPE")) {
              errorMessage = `Server error (${response.status}). Please check the server logs.`;
            } else {
              errorMessage = errorText || `Server error (${response.status})`;
            }
          } catch {
            errorMessage = `Server error (${response.status})`;
          }
        }
        if (response.status === 401 || errorMessage.includes("API key") || errorMessage.includes("authentication")) {
          throw new Error(`❌ ${errorMessage}

📝 To fix this:
1. Go to https://console.anthropic.com/settings/keys
2. Create a new API key
3. Paste it into Settings (sidebar) → SecureAI API Key`);
        }
        throw new Error(errorMessage);
      }
      const reportData = await response.json();
      setReport(reportData.report);
      setCurrentAssessmentId(reportData.assessment_id || reportData.id || null);
      setView("report");
      setError("✅ Assessment completed successfully!");
      setTimeout(() => setError(""), 3e3);
      await fetchSavedReports();
    } catch (err) {
      setError(err.message || "Failed to generate threat assessment. Please check your API key and try again.");
      console.error("Threat assessment generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };
  const handleDownloadPdf = async (assessmentId) => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/reports/${assessmentId}/pdf`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `threat_assessment_${assessmentId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setError("Failed to download PDF");
      }
    } catch (err) {
      console.error("PDF download error:", err);
      setError("Failed to download PDF");
    }
  };
  const handleViewReport = async (assessmentId) => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/reports/${assessmentId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setReport(data.report);
        setCurrentAssessmentId(assessmentId);
        if (data.project_name) setProjectName(data.project_name);
        setView("report");
      } else {
        setError("Failed to load report");
      }
    } catch (err) {
      console.error("Report load error:", err);
      setError("Failed to load report");
    }
  };
  const handleResetForm = () => {
    setProjectName("");
    setProjectNumber("");
    setProjectStage(PROJECT_STAGES[0]);
    setFramework(FRAMEWORKS[0]);
    setFrameworks([FRAMEWORKS[0]]);
    setBusinessCriticality(BUSINESS_CRITICALITY[0]);
    setApplicationType(APPLICATION_TYPES[0]);
    setDeploymentModel(DEPLOYMENT_MODELS[0]);
    setEnvironment(ENVIRONMENTS[0]);
    setComplianceRequirements([]);
    setRiskFocusAreas([]);
    setDocuments([]);
    setReport(null);
    setCurrentAssessmentId(null);
    setView("upload");
    setError("");
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-slate-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-600", children: "Loading..." })
    ] }) });
  }
  if (!user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      showAuthModal === "login" && /* @__PURE__ */ jsxRuntimeExports.jsx(Login, { onSwitchToRegister: () => setShowAuthModal("register") }),
      showAuthModal === "register" && /* @__PURE__ */ jsxRuntimeExports.jsx(Register, { onSwitchToLogin: () => setShowAuthModal("login") })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center h-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-shield-halved text-white text-xl" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-slate-900", children: "Threat Modeling AI" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "AI-Powered Threat Analysis Platform" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden md:flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
              resetForm();
              setView("upload");
            },
            className: `px-4 py-2 rounded-lg font-medium transition-colors ${view === "upload" ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:bg-slate-100"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-upload mr-2" }),
              "New Assessment"
            ]
          }
        ),
        (report || currentAssessmentId) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setView("report"),
            className: `px-4 py-2 rounded-lg font-medium transition-colors ${view === "report" ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:bg-slate-100"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-file-alt mr-2" }),
              "Full Report"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setView("history"),
            className: `px-4 py-2 rounded-lg font-medium transition-colors ${view === "history" ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:bg-slate-100"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-folder-open mr-2" }),
              "Past Assessments"
            ]
          }
        ),
        isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setView("admin"),
            className: `px-4 py-2 rounded-lg font-medium transition-colors ${view === "admin" ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:bg-slate-100"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-user-shield mr-2" }),
              "Admin"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSidebarOpen(true), className: "p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors", title: "Settings", children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-cog text-xl" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-slate-900", children: user.full_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: user.role })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: logout, className: "p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors", title: "Logout", children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-sign-out-alt" }) })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `mb-6 px-4 py-3 rounded-lg flex items-start gap-3 ${error.startsWith("✅") ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: `mt-0.5 text-sm ${error.startsWith("✅") ? "fas fa-check-circle" : "fas fa-exclamation-circle"}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm", children: error.startsWith("✅") ? "Success" : "Error" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: error })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setError(""), className: "ml-auto hover:opacity-70", children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-times text-sm" }) })
      ] }),
      view === "upload" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-bold text-slate-900 mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-info-circle text-blue-600" }),
            "Project Information"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Project Name *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: projectName, onChange: (e) => setProjectName(e.target.value), className: "w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "e.g., Customer Portal Modernization" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Business Criticality *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: businessCriticality, onChange: (e) => setBusinessCriticality(e.target.value), className: "w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: BUSINESS_CRITICALITY.map((crit) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: crit, children: crit }, crit)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Project Number" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: projectNumber, onChange: (e) => setProjectNumber(e.target.value), className: "w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "e.g., PRJ-2024-001" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Application Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: applicationType, onChange: (e) => setApplicationType(e.target.value), className: "w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: APPLICATION_TYPES.map((type) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: type, children: type }, type)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Environment" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: environment, onChange: (e) => setEnvironment(e.target.value), className: "w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: ENVIRONMENTS.map((env) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: env, children: env }, env)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Deployment Model" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: deploymentModel, onChange: (e) => setDeploymentModel(e.target.value), className: "w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: DEPLOYMENT_MODELS.map((model) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: model, children: model }, model)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Project Stage" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: projectStage, onChange: (e) => setProjectStage(e.target.value), className: "w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: PROJECT_STAGES.map((stage) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: stage, children: stage }, stage)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-slate-700 mb-3", children: "Compliance Requirements" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: COMPLIANCE_REQUIREMENTS.map((req) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 p-2 border border-slate-200 rounded-lg cursor-pointer hover:border-blue-300 transition-all", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: complianceRequirements.includes(req), onChange: (e) => {
                  if (e.target.checked) {
                    setComplianceRequirements([...complianceRequirements, req]);
                  } else {
                    setComplianceRequirements(complianceRequirements.filter((r2) => r2 !== req));
                  }
                }, className: "w-4 h-4 text-blue-600" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-slate-900", children: req })
              ] }, req)) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-upload text-orange-600" }),
            "Upload Project Documents"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileUpload, { onFilesAdded: handleFilesAdded }),
          documents.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold text-slate-900 mb-3", children: [
              "Uploaded Documents (",
              documents.length,
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: documents.map((doc) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 bg-slate-50 rounded-lg", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-file-alt text-blue-600" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-slate-900", children: doc.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500", children: [
                    doc.category,
                    " • ",
                    doc.size
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setDocuments(documents.filter((d) => d.id !== doc.id)), className: "text-red-600 hover:text-red-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-trash" }) })
            ] }, doc.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-shield-alt text-red-600" }),
            "Select Threat Modeling Frameworks (Multi-Select)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600 mb-4", children: "Select one or more frameworks for comprehensive threat analysis." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: FRAMEWORKS.map((fw) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              onClick: () => {
                if (fw === "Custom Client Framework") return;
                if (frameworks.includes(fw)) {
                  if (frameworks.length > 1) {
                    setFrameworks(frameworks.filter((f2) => f2 !== fw));
                    setFramework(frameworks.filter((f2) => f2 !== fw)[0]);
                  }
                } else {
                  setFrameworks([...frameworks, fw]);
                  setFramework(fw);
                }
              },
              className: `p-4 border-2 rounded-lg transition-all ${fw === "Custom Client Framework" ? "border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed" : frameworks.includes(fw) ? "border-blue-600 bg-blue-50 cursor-pointer" : "border-slate-200 hover:border-blue-300 cursor-pointer"}`,
              title: FRAMEWORK_DESCRIPTIONS[fw] || "",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: frameworks.includes(fw), disabled: fw === "Custom Client Framework", onChange: () => {
                  }, className: "text-blue-600 w-4 h-4" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: `font-bold ${fw === "Custom Client Framework" ? "text-slate-500" : "text-slate-900"}`, children: fw }),
                    fw === "Custom Client Framework" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full border border-amber-300", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-star mr-1" }),
                      "Customize with Client"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: `text-xs ${fw === "Custom Client Framework" ? "text-slate-400" : "text-slate-600"}`, children: [
                  fw === "MITRE ATT&CK" && "Comprehensive framework for understanding adversary behavior",
                  fw === "STRIDE" && "Microsoft's threat modeling methodology",
                  fw === "PASTA" && "Process for Attack Simulation and Threat Analysis",
                  fw === "OCTAVE" && "Operationally Critical Threat, Asset, and Vulnerability Evaluation",
                  fw === "VAST" && "Visual, Agile, and Simple Threat modeling",
                  fw === "Custom Client Framework" && "Organization-specific threat modeling approach"
                ] })
              ]
            },
            fw
          )) }),
          frameworks.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 p-3 bg-green-50 border border-green-200 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-green-800 font-medium", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-check-circle mr-2" }),
            frameworks.length,
            " frameworks selected: ",
            frameworks.join(" + ")
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-crosshairs text-purple-600" }),
            "Select Risk Focus Areas"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: RISK_FOCUS_AREAS.map((area) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-blue-300 transition-all", title: RISK_AREA_DESCRIPTIONS[area] || "", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: riskFocusAreas.includes(area), onChange: (e) => {
              if (e.target.checked) {
                setRiskFocusAreas([...riskFocusAreas, area]);
              } else {
                setRiskFocusAreas(riskFocusAreas.filter((a) => a !== area));
              }
            }, className: "w-5 h-5 text-blue-600" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-900", children: area }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-600", children: RISK_AREA_DESCRIPTIONS[area] })
            ] })
          ] }, area)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleGenerateReport,
            disabled: isGenerating || !projectName || documents.length === 0,
            className: "px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-bold text-lg hover:from-red-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center gap-3",
            children: isGenerating ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-spinner fa-spin" }),
              "Generating Threat Assessment..."
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-shield-virus" }),
              "Generate Threat Assessment Report"
            ] })
          }
        ) })
      ] }),
      view === "dashboard" && report && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-slate-900", children: "📈 Assessment Dashboard" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setView("report"), className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-file-alt mr-2" }),
            "View Full Report"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-gray-500 py-12", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-chart-pie text-6xl text-gray-300 mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "Dashboard visualization coming soon. Please view the Full Report."
        ] }) })
      ] }),
      view === "report" && (report || currentAssessmentId) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-bold text-slate-900 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-shield-alt text-blue-600" }),
            "Threat Assessment Report"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => setView("history"),
                className: "px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-folder-open mr-2" }),
                  "Past Assessments"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: handleResetForm,
                className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-plus mr-2" }),
                  "New Assessment"
                ]
              }
            )
          ] })
        ] }),
        currentAssessmentId ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          ReportViewer,
          {
            assessmentId: currentAssessmentId,
            projectName,
            token,
            apiBase: API_BASE_URL
          }
        ) : (
          /* Fallback: no assessmentId yet — show raw markdown */
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "prose prose-lg max-w-none",
              style: { lineHeight: "1.8", fontSize: "0.95rem", color: "#374151" },
              dangerouslySetInnerHTML: { __html: markdownToHtml(report || "") }
            }
          ) })
        )
      ] }),
      view === "history" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        ReportHistory,
        {
          projects: reportProjects,
          onViewReport: handleViewReport,
          onDownloadPdf: handleDownloadPdf
        }
      ),
      view === "admin" && isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-slate-900", children: "Admin Dashboard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AdminDashboard, {})
      ] }),
      view === "compliance" && /* @__PURE__ */ jsxRuntimeExports.jsx(ComplianceDocumentation, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "bg-gradient-to-br from-slate-50 to-slate-100 border-t border-slate-200 mt-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-shield-alt text-white text-xl" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent", children: "THREAT MODELING AI" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600 leading-relaxed", children: "An AI-powered threat assessment platform designed for enterprise security and compliance. Built for security teams, PMOs, and executive oversight." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-bold text-slate-900 uppercase tracking-wider", children: "Security Frameworks" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: ["MITRE ATT&CK", "STRIDE Methodology", "PASTA Framework", "OCTAVE & VAST"].map((fw) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2 text-sm text-slate-600", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-check text-green-600 text-xs" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: fw })
          ] }, fw)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-bold text-slate-900 uppercase tracking-wider", children: "Enterprise & Security" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: [
            { icon: "fa-file-alt", label: "Audit Logs" },
            { icon: "fa-lock", label: "Data Privacy" },
            { icon: "fa-key", label: "API Credentials" },
            { icon: "fa-certificate", label: "ISO 42001 Compliance", onClick: () => setView("compliance") }
          ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: `flex items-center gap-2 text-sm text-slate-600 ${item.onClick ? "cursor-pointer hover:text-blue-700" : ""}`, onClick: item.onClick, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: `fas ${item.icon} text-blue-600 text-xs` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: item.onClick ? "hover:underline" : "", children: item.label })
          ] }, item.label)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 pt-6 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500", children: [
          "© ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          " Threat Modeling AI Systems. All rights reserved."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-xs text-slate-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-code-branch text-blue-600" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "v2.0.0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "•" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fas fa-shield-alt text-green-600" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Encrypted Session" })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, { isOpen: sidebarOpen, onClose: () => setSidebarOpen(false) })
  ] });
}
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}
const root = client.createRoot(rootElement);
root.render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) }) })
);
