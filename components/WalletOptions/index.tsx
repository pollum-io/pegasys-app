import { ButtonProps, Flex } from "@chakra-ui/react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { SUPPORTED_WALLETS, NEVM_CHAIN_PARAMS } from "helpers/consts";
import { FunctionComponent, ReactNode, useState } from "react";
import { AbstractConnector } from '@web3-react/abstract-connector'
import { Wallets } from './Wallets'
import { injected } from '../../utils/connectors'
import { isMobile } from 'react-device-detect'


interface IButtonProps extends ButtonProps {
  children?: ReactNode;
  active?: boolean
}

export const WalletOptions: FunctionComponent<IButtonProps> = props => {
  const { active, account, connector, activate, error } = useWeb3React()
  const [pendingWallet, setPendingWallet] = useState<AbstractConnector | undefined>()
  const [pendingError, setPendingError] = useState<boolean>()

  const addSyscoinNetwork = () => {
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

  const tryActivation = async (connector: AbstractConnector | undefined) => {
    let name
    Object.keys(SUPPORTED_WALLETS).map(key => {
      if (connector === SUPPORTED_WALLETS[key].connector) {
        return (name = SUPPORTED_WALLETS[key].name)
      }
      return true
    })

    connector &&
      activate(connector, undefined, true)
        .then(() => {
          const isCbWalletDappBrowser = window?.ethereum?.isCoinbaseWallet
          const isWalletlink = !!window?.WalletLinkProvider || !!window?.walletLinkExtension
          const isCbWallet = isCbWalletDappBrowser || isWalletlink
          if (isCbWallet) {
            addSyscoinNetwork()
          }
        })
        .catch(error => {
          if (error instanceof UnsupportedChainIdError) {
            activate(connector) // a little janky...can't use setError because the connector isn't set
          } else {
            setPendingError(true)
          }
        })
  }

  const coisas = () => {
    Object.keys(SUPPORTED_WALLETS).map((key) => {

      const isMetamask = window.ethereum && window.ethereum.isMetaMask
      const option = SUPPORTED_WALLETS[key]
      // check for mobile options
      if (isMobile) {
        if (!window.web3 && !window.ethereum && option.mobile) {

          return (
            <>
              <Wallets
                onClick={() => {
                  option.connector !== connector && !option.href && tryActivation(option.connector)
                }}
                id={`connect-${key}`}
                key={key}
                header={option.name}
                icon={'icons/' + option.iconName}
              />
            </>
          )
        }
        return null
      }
      // overwrite injected when needed
      if (option.connector === injected) {
        // don't show injected if there's no injected provider
        if (!(window.web3 || window.ethereum)) {
          if (option.name === 'MetaMask') {
            return (
              <Wallets
                id={`connect-${key}`}
                key={key}
                header={'Install Metamask'}
                link={'https://metamask.io/'}
                icon={'/icons/metamask.png'}
              />
            )
          } else {
            return null //dont want to return install twice
          }
        }
        // don't return metamask if injected provider isn't metamask
        else if (option.name === 'MetaMask' && !isMetamask) {
          return null
        }
        // likewise for generic
        else if (option.name === 'Injected' && isMetamask) {
          return null
        }
      }
      // return rest of options
      console.log('cheguei aqui2')
      return (
        !isMobile &&
        !option.mobileOnly && (
          <Wallets
            id={`connect-${key}`}
            onClick={() => {
              tryActivation(option.connector)
            }}
            key={key}
            link={option.href}
            header={option.name}
            icon={'icons/' + option.iconName}
          />
        )
      )
    })
  }

  return (
    <>
      {coisas()}
    </>
  )
}