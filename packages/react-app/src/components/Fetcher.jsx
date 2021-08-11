import { Token, Pair } from '@sushiswap/sdk'

var providers = require('@ethersproject/providers');

var _TOKEN_DECIMALS_CACHE;
var TOKEN_DECIMALS_CACHE = (_TOKEN_DECIMALS_CACHE = {}, _TOKEN_DECIMALS_CACHE[exports.ChainId.MAINNET] = {
  '0xE0B7927c4aF23765Cb51314A0E0521A9645F0E2A': 9 // DGD

}, _TOKEN_DECIMALS_CACHE);

var Fetcher = /*#__PURE__*/function () {
    /**
     * Cannot be constructed.
     */
    function Fetcher() {}
    /**
     * Fetch information for a given token on the given chain, using the given ethers provider.
     * @param chainId chain of the token
     * @param address address of the token on the chain
     * @param provider provider used to fetch the token
     * @param symbol optional symbol of the token
     * @param name optional name of the token
     */
  
  
    Fetcher.fetchTokenData = function fetchTokenData(chainId, address, provider, symbol, name) {
      try {
        var _TOKEN_DECIMALS_CACHE2, _TOKEN_DECIMALS_CACHE3;
  
        var _temp3 = function _temp3(parsedDecimals) {
          return new Token(chainId, address, parsedDecimals, symbol, name);
        };
  
        if (provider === undefined) provider = providers.getDefaultProvider(networks.getNetwork(chainId));
  
        var _temp4 = typeof ((_TOKEN_DECIMALS_CACHE2 = TOKEN_DECIMALS_CACHE) === null || _TOKEN_DECIMALS_CACHE2 === void 0 ? void 0 : (_TOKEN_DECIMALS_CACHE3 = _TOKEN_DECIMALS_CACHE2[chainId]) === null || _TOKEN_DECIMALS_CACHE3 === void 0 ? void 0 : _TOKEN_DECIMALS_CACHE3[address]) === 'number';
  
        return Promise.resolve(_temp4 ? _temp3(TOKEN_DECIMALS_CACHE[chainId][address]) : Promise.resolve(new contracts.Contract(address, ERC20, provider).decimals().then(function (decimals) {
          var _TOKEN_DECIMALS_CACHE4, _extends2, _extends3;
  
          TOKEN_DECIMALS_CACHE = _extends({}, TOKEN_DECIMALS_CACHE, (_extends3 = {}, _extends3[chainId] = _extends({}, (_TOKEN_DECIMALS_CACHE4 = TOKEN_DECIMALS_CACHE) === null || _TOKEN_DECIMALS_CACHE4 === void 0 ? void 0 : _TOKEN_DECIMALS_CACHE4[chainId], (_extends2 = {}, _extends2[address] = decimals, _extends2)), _extends3));
          return decimals;
        })).then(_temp3));
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Fetches information about a pair and constructs a pair from the given two tokens.
     * @param tokenA first token
     * @param tokenB second token
     * @param provider the provider to use to fetch the data
     */
    ;
  
    Fetcher.fetchPairData = function fetchPairData(tokenA, tokenB, provider) {
      try {
        if (provider === undefined) provider = providers.getDefaultProvider(networks.getNetwork(tokenA.chainId));
        !(tokenA.chainId === tokenB.chainId) ? "development" !== "production" ? invariant(false, 'CHAIN_ID') : invariant(false) : void 0;
        var address = Pair.getAddress(tokenA, tokenB);
        return Promise.resolve(new contracts.Contract(address, IUniswapV2Pair.abi, provider).getReserves()).then(function (_ref) {
          var reserves0 = _ref[0],
              reserves1 = _ref[1];
          var balances = tokenA.sortsBefore(tokenB) ? [reserves0, reserves1] : [reserves1, reserves0];
          return new Pair(new TokenAmount(tokenA, balances[0]), new TokenAmount(tokenB, balances[1]));
        });
      } catch (e) {
        return Promise.reject(e);
      }
    };
  
    return Fetcher;
}();

// exports.Fetcher = Fetcher;

export default Fetcher; 
// export { Fetcher };
