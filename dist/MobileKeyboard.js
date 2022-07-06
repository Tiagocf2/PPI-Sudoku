"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

require("./styles.css");

var _excluded = ["sudoku", "showAways"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var MobileKeyboard = function MobileKeyboard(_ref) {
  var sudoku = _ref.sudoku,
      _ref$showAways = _ref.showAways,
      showAways = _ref$showAways === void 0 ? false : _ref$showAways,
      props = _objectWithoutProperties(_ref, _excluded);

  var isMobile = /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  var generateButtons = function generateButtons() {
    var buttons = [];

    var _loop = function _loop(i) {
      buttons.push( /*#__PURE__*/_react["default"].createElement("button", {
        className: "sudoku-mobile-kb-button",
        onPointerUp: function onPointerUp() {
          sudoku.select(sudoku.lastSelection.x, sudoku.lastSelection.y);
          sudoku.inputNumber(i);
        }
      }, i));
    };

    for (var i = 1; i <= 9; i++) {
      _loop(i);
    }

    buttons.push( /*#__PURE__*/_react["default"].createElement("button", {
      className: "sudoku-mobile-kb-button sudoku-mobile-kb-delete",
      onPointerUp: function onPointerUp() {
        sudoku.select(sudoku.lastSelection.x, sudoku.lastSelection.y);
        sudoku.inputNumber(null);
      }
    }, "\u2421"));
    return buttons;
  };

  return /*#__PURE__*/_react["default"].createElement("div", _extends({
    role: "keyboard"
  }, props, {
    className: "sudoku-mobile-kb".concat(props.className ? " " + props.className : "")
  }), !(isMobile || showAways) && generateButtons());
};

var _default = MobileKeyboard;
exports["default"] = _default;