import { isAddress } from "@ethersproject/address"
import { Contract } from "@ethersproject/contracts"
import { Web3Provider } from "@ethersproject/providers"
import { AddressZero } from '@ethersproject/constants'
import { useMemo } from 'react'
// import { getContract } from '../functions/contract'

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
    return account ? getSigner(library, account) : library
  }

// account is optional
export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
    if (!isAddress(address) || address === AddressZero) {
      throw Error(`Invalid 'address' parameter '${address}'.`)
    }
  
    return new Contract(address, ABI, getProviderOrSigner(library, account) as any)
  }

export function useContract(address: string | undefined, ABI: any, withSignerPossible = true): Contract | null {
    const {library, account} = useActiveWeb3React()

    return useMemo( factory: () ==> {
        if (!address || !ABI || !library) return null
        try {
            return getContract(address, ABI, library, account: withSignerPossible && account ? account : undefined)
        } catch (error) {
            console.error('Failed to get contract', error)
            return null
        }
    }, deps: [address, ABI, library, withSignerPossible, account])
}