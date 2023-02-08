"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLocValue = exports.useLocState = void 0;
var react_1 = require("react");
var M = {};
var getLocData = function (key) {
    var valueString = localStorage.getItem("locState");
    var valueobj = JSON.parse(valueString !== null && valueString !== void 0 ? valueString : "{}");
    var selfState = valueobj[key];
    if (selfState !== null && selfState !== undefined) {
        M[key] = selfState;
        return selfState;
    }
};
var saveLocData = function (key, newValue) {
    var _a;
    var DBState = JSON.parse((_a = localStorage.getItem("locState")) !== null && _a !== void 0 ? _a : "{}");
    M[key] = newValue;
    DBState[key] = newValue;
    localStorage.setItem("locState", JSON.stringify(DBState));
};
var useLocState = function (key, value) {
    var _a = (0, react_1.useState)(value), state = _a[0], setState = _a[1];
    var locState = getLocData(key);
    (0, react_1.useEffect)(function () {
        if (locState) {
            setState(locState);
        }
    }, []);
    (0, react_1.useLayoutEffect)(function () {
        if (!locState) {
            saveLocData(key, state);
        }
    }, []);
    var SetLocState = function (newValue) {
        setState(function (preValue) {
            saveLocData(key, newValue);
            return newValue;
        });
    };
    return [state, SetLocState];
};
exports.useLocState = useLocState;
var useLocValue = function (key) {
    var _a = (0, react_1.useState)(null), locValue = _a[0], setLocValue = _a[1];
    (0, react_1.useEffect)(function () {
        if (locValue === null) {
            setTimeout(function () {
                setLocValue(getLocData(key));
            }, 10);
        }
    }, [locValue]);
    if (locValue) {
        return locValue;
    }
    return M[key]; //缓存数据 未读取loc前方便其他组件读取
};
exports.useLocValue = useLocValue;