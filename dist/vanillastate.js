"use strict";
var VannilaState = /** @class */ (function () {
    function VannilaState(domId) {
        var _this = this;
        this.state = new Map();
        this.id = undefined;
        this.template = undefined;
        document.addEventListener("DOMContentLoaded", function () {
            var _a;
            _this.id = domId;
            _this.template = (_a = document.getElementById(domId)) === null || _a === void 0 ? void 0 : _a.innerHTML;
            _this.render();
        });
    }
    VannilaState.prototype.useState = function (id, value, onChange) {
        var _this = this;
        var get = function () {
            var stateObj = _this.state.get(id);
            return stateObj && dont_call_me_from_outside_vannila_get_state(stateObj);
        };
        var set = function (v) {
            var state = _this.state.get(id);
            if (state) {
                state.value = v;
                if (onChange) {
                    onChange(v);
                }
            }
            else {
                _this.state.set(id, {
                    key: "".concat(id, "-").concat(Math.floor(Math.random() * 1000000)),
                    value: v,
                });
            }
            _this.render();
        };
        set(value);
        return { get: get, set: set };
    };
    VannilaState.prototype.render = function () {
        if (!this.template) {
            return;
        }
        var newDom = document.createElement("div");
        newDom.innerHTML = this.template;
        this.state.forEach(function (stateObj, key) {
            // this.state.get(v)がundefinedになることはありえない
            newDom.innerHTML = newDom.innerHTML.replace(new RegExp("%".concat(key), "g"), "%".concat(stateObj.key));
        });
        // If you know better way, please fix it.
        var currentNodeList = document.querySelectorAll("#".concat(this.id, " *"));
        var newNodeList = newDom.querySelectorAll("*");
        var _loop_1 = function (i) {
            if (currentNodeList[i].childElementCount === 0) {
                this_1.state.forEach(function (stateObj) {
                    if (stateObj &&
                        newNodeList[i].innerText.includes("%".concat(stateObj.key))) {
                        var state = dont_call_me_from_outside_vannila_get_state(stateObj);
                        newNodeList[i].innerText = newNodeList[i].innerText.replace("%".concat(stateObj.key), state);
                    }
                });
                if (!currentNodeList[i].isEqualNode(newNodeList[i])) {
                    currentNodeList[i].innerText = newNodeList[i].innerText;
                }
            }
            if (newNodeList[i].dataset.visible) {
                var stateObj = this_1.state.get(newNodeList[i].dataset.visible);
                if (!stateObj) {
                    throw new Error("The state ".concat(newNodeList[i].dataset.visible, " is not defined!"));
                }
                var state = dont_call_me_from_outside_vannila_get_state(stateObj);
                currentNodeList[i].style.display = state
                    ? newNodeList[i].style.display
                    : "none";
            }
        };
        var this_1 = this;
        for (var i = 0; i < currentNodeList.length; i++) {
            _loop_1(i);
        }
    };
    return VannilaState;
}());
function dont_call_me_from_outside_vannila_get_state(s) {
    var state = s.value;
    if (typeof state === "function") {
        return state();
    }
    else {
        return state;
    }
}
