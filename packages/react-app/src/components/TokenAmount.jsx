import { JSBI } from '@sushiswap/sdk'

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }
var invariant = _interopDefault(require('tiny-invariant'));

function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

export default function TokenAmount(_CurrencyAmount) {
    _inheritsLoose(TokenAmount, _CurrencyAmount);

    function TokenAmount(token, amount) {
    var _this;
  
    _this = _CurrencyAmount.call(this, token, amount) || this;
    _this.token = token;
    return _this;
    }
  
    var _proto = TokenAmount.prototype;
  
    _proto.add = function add(other) {
      !this.token.equals(other.token) ?  invariant(false, 'TOKEN')  : void 0;
      return new TokenAmount(this.token, JSBI.add(this.raw, other.raw));
    };
  
    _proto.subtract = function subtract(other) {
      !this.token.equals(other.token) ?  invariant(false, 'TOKEN')  : void 0;
      return new TokenAmount(this.token, JSBI.subtract(this.raw, other.raw));
    };
  
    return TokenAmount;
}