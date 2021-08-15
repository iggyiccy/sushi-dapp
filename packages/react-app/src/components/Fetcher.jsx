import { CurrencyAmount, Pair } from '@sushiswap/sdk'

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var providers = require('@ethersproject/providers');
var networks = require('@ethersproject/networks');
var contracts = require('@ethersproject/contracts');
var IUniswapV2Pair = _interopDefault(require('@sushiswap/core/abi/IUniswapV2Pair.json'));
var invariant = _interopDefault(require('tiny-invariant'));



/**
* Fetches information about a pair and constructs a pair from the given two tokens.
* @param tokenA first token
* @param tokenB second token
* @param provider the provider to use to fetch the data
*/
  
export default function fetchPairData(tokenA, tokenB, provider) {
  try {
    if (provider === undefined) provider = providers.getDefaultProvider(networks.getNetwork(tokenA.chainId));
    !(tokenA.chainId === tokenB.chainId) ? "development" !== "production" ? invariant(false, 'CHAIN_ID') : invariant(false) : void 0;
    var address = Pair.getAddress(tokenA, tokenB);
    return Promise.resolve(new contracts.Contract(address, IUniswapV2Pair.abi, provider).getReserves()).then(function (_ref) {
      var reserves0 = _ref[0],
          reserves1 = _ref[1];
      var balances = tokenA.sortsBefore(tokenB) ? [reserves0, reserves1] : [reserves1, reserves0];
      return new Pair(new CurrencyAmount.fromRawAmount(tokenA, balances[0]), new CurrencyAmount.fromRawAmount(tokenB, balances[1]));
    });
  } catch (e) {
    return Promise.reject(e);
  }
} 

