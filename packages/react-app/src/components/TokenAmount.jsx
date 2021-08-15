import { Fraction, Token, JSBI } from "@sushiswap/sdk";
var _Big = _interopDefault(require("big.js"));
var toFormat = _interopDefault(require("toformat"));
var ZERO = /*#__PURE__*/ JSBI.BigInt(0);
var TEN = /*#__PURE__*/ JSBI.BigInt(10);

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function currencyEquals(currencyA, currencyB) {
  if (currencyA instanceof Token && currencyB instanceof Token) {
    return currencyA.equals(currencyB);
  } else if (currencyA instanceof Token) {
    return false;
  } else if (currencyB instanceof Token) {
    return false;
  } else {
    return currencyA === currencyB;
  }
}

var SolidityType;

(function (SolidityType) {
  SolidityType["uint8"] = "uint8";
  SolidityType["uint256"] = "uint256";
})(SolidityType || (SolidityType = {}));

var _SOLIDITY_TYPE_MAXIMA;

var SOLIDITY_TYPE_MAXIMA =
  ((_SOLIDITY_TYPE_MAXIMA = {}),
  (_SOLIDITY_TYPE_MAXIMA[SolidityType.uint8] = /*#__PURE__*/ JSBI.BigInt("0xff")),
  (_SOLIDITY_TYPE_MAXIMA[SolidityType.uint256] = /*#__PURE__*/ JSBI.BigInt(
    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
  )),
  _SOLIDITY_TYPE_MAXIMA);

var Currency =
  /**
   * Constructs an instance of the base class `Currency`. The only instance of the base class `Currency` is `Currency.ETHER`.
   * @param decimals decimals of the currency
   * @param symbol symbol of the currency
   * @param name of the currency
   */
  function Currency(decimals, symbol, name) {
    validateSolidityTypeInstance(JSBI.BigInt(decimals), SolidityType.uint8);
    this.decimals = decimals;
    this.symbol = symbol;
    this.name = name;
  };
/**
 * The only instance of the base class `Currency`.
 */

Currency.ETHER = /*#__PURE__*/ new Currency(18, "ETH", "Ether");
var ETHER = Currency.ETHER;

function _interopDefault(ex) {
  return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
}
var invariant = _interopDefault(require("tiny-invariant"));

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function parseBigintIsh(bigintIsh) {
  return bigintIsh instanceof JSBI
    ? bigintIsh
    : typeof bigintIsh === "bigint"
    ? JSBI.BigInt(bigintIsh.toString())
    : JSBI.BigInt(bigintIsh);
} // mock the on-chain sqrt function

function validateSolidityTypeInstance(value, solidityType) {
  !JSBI.greaterThanOrEqual(value, ZERO) ? invariant(false, value + " is not a " + solidityType + ".") : void 0;
  !JSBI.lessThanOrEqual(value, SOLIDITY_TYPE_MAXIMA[solidityType])
    ? invariant(false, value + " is not a " + solidityType + ".")
    : void 0;
} // warns if addresses are not checksummed

var Big$1 = /*#__PURE__*/ toFormat(_Big);
var CurrencyAmount = /*#__PURE__*/ (function (_Fraction) {
  _inheritsLoose(CurrencyAmount, _Fraction);

  // amount _must_ be raw, i.e. in the native representation
  function CurrencyAmount(currency, amount) {
    var _this;

    var parsedAmount = parseBigintIsh(amount);
    validateSolidityTypeInstance(parsedAmount, SolidityType.uint256);
    _this = _Fraction.call(this, parsedAmount, JSBI.exponentiate(TEN, JSBI.BigInt(currency.decimals))) || this;
    _this.currency = currency;
    return _this;
  }
  /**
   * Helper that calls the constructor with the ETHER currency
   * @param amount ether amount in wei
   */

  CurrencyAmount.ether = function ether(amount) {
    return new CurrencyAmount(ETHER, amount);
  };

  var _proto = CurrencyAmount.prototype;

  _proto.add = function add(other) {
    !currencyEquals(this.currency, other.currency) ? invariant(false, "TOKEN") : void 0;
    return new CurrencyAmount(this.currency, JSBI.add(this.raw, other.raw));
  };

  _proto.subtract = function subtract(other) {
    !currencyEquals(this.currency, other.currency) ? invariant(false, "TOKEN") : void 0;
    return new CurrencyAmount(this.currency, JSBI.subtract(this.raw, other.raw));
  };

  _proto.toSignificant = function toSignificant(significantDigits, format, rounding) {
    if (significantDigits === void 0) {
      significantDigits = 6;
    }

    if (rounding === void 0) {
      rounding = exports.Rounding.ROUND_DOWN;
    }

    return _Fraction.prototype.toSignificant.call(this, significantDigits, format, rounding);
  };

  _proto.toFixed = function toFixed(decimalPlaces, format, rounding) {
    if (decimalPlaces === void 0) {
      decimalPlaces = this.currency.decimals;
    }

    if (rounding === void 0) {
      rounding = exports.Rounding.ROUND_DOWN;
    }

    !(decimalPlaces <= this.currency.decimals) ? invariant(false, "DECIMALS") : void 0;
    return _Fraction.prototype.toFixed.call(this, decimalPlaces, format, rounding);
  };

  _proto.toExact = function toExact(format) {
    if (format === void 0) {
      format = {
        groupSeparator: "",
      };
    }

    Big$1.DP = this.currency.decimals;
    return new Big$1(this.numerator.toString()).div(this.denominator.toString()).toFormat(format);
  };

  _createClass(CurrencyAmount, [
    {
      key: "raw",
      get: function get() {
        return this.numerator;
      },
    },
  ]);

  return CurrencyAmount;
})(Fraction);

export var TokenAmount = /*#__PURE__*/ (function (_CurrencyAmount) {
  _inheritsLoose(TokenAmount, _CurrencyAmount);

  // amount _must_ be raw, i.e. in the native representation
  function TokenAmount(token, amount) {
    var _this;

    _this = _CurrencyAmount.call(this, token, amount) || this;
    _this.token = token;
    return _this;
  }

  var _proto = TokenAmount.prototype;

  _proto.add = function add(other) {
    !this.token.equals(other.token) ? invariant(false, "TOKEN") : void 0;
    return new TokenAmount(this.token, JSBI.add(this.raw, other.raw));
  };

  _proto.subtract = function subtract(other) {
    !this.token.equals(other.token) ? invariant(false, "TOKEN") : void 0;
    return new TokenAmount(this.token, JSBI.subtract(this.raw, other.raw));
  };

  return TokenAmount;
})(CurrencyAmount);
