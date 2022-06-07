import { injected } from 'utils/connectors'
import { NEVM_CHAIN_PARAMS } from "helpers/consts";


export const ConnectSyscoinNetwork = () => {
    injected.getProvider().then(provider => {
      provider
        .request({
          method: 'wallet_addEthereumChain',
          params: [NEVM_CHAIN_PARAMS]
        })
        .catch((error: any) => {
          console.log(error)
        })
    })
  }