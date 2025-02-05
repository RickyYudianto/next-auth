"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;

var _crypto = require("crypto");

var _logger = _interopRequireDefault(require("../utils/logger"));

var _errors = require("./errors");

var _providers = _interopRequireDefault(require("./lib/providers"));

var _utils = require("./lib/utils");

var cookie = _interopRequireWildcard(require("./lib/cookie"));

var jwt = _interopRequireWildcard(require("../jwt"));

var _defaultCallbacks = require("./lib/default-callbacks");

var _csrfToken = require("./lib/csrf-token");

var _callbackUrl = require("./lib/callback-url");

var _parseUrl = _interopRequireDefault(require("../utils/parse-url"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

async function init({
  authOptions,
  providerId,
  action,
  url: reqUrl,
  cookies: reqCookies,
  callbackUrl: reqCallbackUrl,
  csrfToken: reqCsrfToken,
  isPost
}) {
  var _authOptions$useSecur, _authOptions$events;

  const parsed = (0, _parseUrl.default)(reqUrl.origin + reqUrl.pathname.replace(`/${action}`, "").replace(`/${providerId}`, ""));
  const url = new URL(parsed.toString());
  const secret = (0, _utils.createSecret)({
    authOptions,
    url
  });
  const {
    providers,
    provider
  } = (0, _providers.default)({
    providers: authOptions.providers,
    url,
    providerId
  });
  const maxAge = 30 * 24 * 60 * 60;
  const options = {
    debug: false,
    pages: {},
    theme: {
      colorScheme: "auto",
      logo: "",
      brandColor: "",
      buttonText: ""
    },
    ...authOptions,
    url,
    action,
    provider,
    cookies: { ...cookie.defaultCookies((_authOptions$useSecur = authOptions.useSecureCookies) !== null && _authOptions$useSecur !== void 0 ? _authOptions$useSecur : url.protocol === "https:"),
      ...authOptions.cookies
    },
    secret,
    providers,
    session: {
      strategy: authOptions.adapter ? "database" : "jwt",
      maxAge,
      updateAge: 24 * 60 * 60,
      generateSessionToken: () => {
        var _randomUUID;

        return (_randomUUID = _crypto.randomUUID === null || _crypto.randomUUID === void 0 ? void 0 : (0, _crypto.randomUUID)()) !== null && _randomUUID !== void 0 ? _randomUUID : (0, _crypto.randomBytes)(32).toString("hex");
      },
      ...authOptions.session
    },
    jwt: {
      secret,
      maxAge,
      encode: jwt.encode,
      decode: jwt.decode,
      ...authOptions.jwt
    },
    events: (0, _errors.eventsErrorHandler)((_authOptions$events = authOptions.events) !== null && _authOptions$events !== void 0 ? _authOptions$events : {}, _logger.default),
    adapter: (0, _errors.adapterErrorHandler)(authOptions.adapter, _logger.default),
    callbacks: { ..._defaultCallbacks.defaultCallbacks,
      ...authOptions.callbacks
    },
    logger: _logger.default,
    callbackUrl: url.origin
  };
  const cookies = [];
  const {
    csrfToken,
    cookie: csrfCookie,
    csrfTokenVerified
  } = (0, _csrfToken.createCSRFToken)({
    options,
    cookieValue: reqCookies === null || reqCookies === void 0 ? void 0 : reqCookies[options.cookies.csrfToken.name],
    isPost,
    bodyValue: reqCsrfToken
  });
  options.csrfToken = csrfToken;
  options.csrfTokenVerified = csrfTokenVerified;

  if (csrfCookie) {
    cookies.push({
      name: options.cookies.csrfToken.name,
      value: csrfCookie,
      options: options.cookies.csrfToken.options
    });
  }

  const {
    callbackUrl,
    callbackUrlCookie
  } = await (0, _callbackUrl.createCallbackUrl)({
    options,
    cookieValue: reqCookies === null || reqCookies === void 0 ? void 0 : reqCookies[options.cookies.callbackUrl.name],
    paramValue: reqCallbackUrl
  });
  options.callbackUrl = callbackUrl;

  if (callbackUrlCookie) {
    cookies.push({
      name: options.cookies.callbackUrl.name,
      value: callbackUrlCookie,
      options: options.cookies.callbackUrl.options
    });
  }

  return {
    options,
    cookies
  };
}