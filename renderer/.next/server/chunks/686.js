"use strict";
exports.id = 686;
exports.ids = [686];
exports.modules = {

/***/ 3171:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Bt": () => (/* binding */ _roomDate),
/* harmony export */   "ER": () => (/* binding */ _groupId),
/* harmony export */   "Tc": () => (/* binding */ _user),
/* harmony export */   "ri": () => (/* binding */ _roomId),
/* harmony export */   "sJ": () => (/* binding */ _roomTarget)
/* harmony export */ });
/* harmony import */ var recoil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9755);
/* harmony import */ var recoil__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(recoil__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6555);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([uuid__WEBPACK_IMPORTED_MODULE_1__]);
uuid__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


const _roomId = (0,recoil__WEBPACK_IMPORTED_MODULE_0__.atom)({
    key: `roomId/${(0,uuid__WEBPACK_IMPORTED_MODULE_1__.v1)()}`,
    default: ""
});
const _roomTarget = (0,recoil__WEBPACK_IMPORTED_MODULE_0__.atom)({
    key: `roomTarget/${(0,uuid__WEBPACK_IMPORTED_MODULE_1__.v1)()}`,
    default: ""
});
const defaultUserModel = {
    uid: "",
    email: "",
    nickname: ""
};
const _user = (0,recoil__WEBPACK_IMPORTED_MODULE_0__.atom)({
    key: `user/${(0,uuid__WEBPACK_IMPORTED_MODULE_1__.v1)()}`,
    default: defaultUserModel
});
const _roomDate = (0,recoil__WEBPACK_IMPORTED_MODULE_0__.atom)({
    key: `roomDate/${(0,uuid__WEBPACK_IMPORTED_MODULE_1__.v1)()}`,
    default: ""
});
const _groupId = (0,recoil__WEBPACK_IMPORTED_MODULE_0__.atom)({
    key: `groupId/${(0,uuid__WEBPACK_IMPORTED_MODULE_1__.v1)()}`,
    default: ""
});

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 4713:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const firebaseConfig = {
  apiKey: "AIzaSyAftjPZ4MSu7EAVeQvbSHPHuaaQhJ3JQL4",
  authDomain: "tokyo-ring-376315.firebaseapp.com",
  projectId: "tokyo-ring-376315",
  storageBucket: "tokyo-ring-376315.appspot.com",
  messagingSenderId: "400820874062",
  appId: "1:400820874062:web:b196995c4e3ed323a2cc1f",
  measurementId: "G-6HVY02PMG1",
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (firebaseConfig);


/***/ }),

/***/ 991:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "I": () => (/* binding */ auth),
/* harmony export */   "db": () => (/* binding */ db)
/* harmony export */ });
/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3745);
/* harmony import */ var firebase_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(401);
/* harmony import */ var firebase_database__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1208);
/* harmony import */ var _firebase_config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4713);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([firebase_app__WEBPACK_IMPORTED_MODULE_0__, firebase_auth__WEBPACK_IMPORTED_MODULE_1__, firebase_database__WEBPACK_IMPORTED_MODULE_2__]);
([firebase_app__WEBPACK_IMPORTED_MODULE_0__, firebase_auth__WEBPACK_IMPORTED_MODULE_1__, firebase_database__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);






const app = firebase_app__WEBPACK_IMPORTED_MODULE_0__.initializeApp(_firebase_config__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z);

const db = (0,firebase_database__WEBPACK_IMPORTED_MODULE_2__.getDatabase)(app);
const auth = (0,firebase_auth__WEBPACK_IMPORTED_MODULE_1__.getAuth)();

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;