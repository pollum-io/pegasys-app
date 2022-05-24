import { ButtonProps, Flex, Link } from "@chakra-ui/react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { SUPPORTED_WALLETS, NEVM_CHAIN_PARAMS } from "components/Constants";
import { usePicasso } from "hooks";
import { FunctionComponent, ReactNode, useState } from "react";
import { AbstractConnector } from '@web3-react/abstract-connector'
import ReactGA from 'react-ga'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { Option } from './other'
import { injected } from '../Connectores'
import MetamaskIcon from '../../public/icons/metamask.png'
import { isMobile } from 'react-device-detect'


interface IButtonProps extends ButtonProps {
	children?: ReactNode;
  active?: boolean
}

export const WalletOptions:  FunctionComponent<IButtonProps> = props =>  {
    const theme = usePicasso();
    const { active, account, connector, activate, error } = useWeb3React()
    const [pendingWallet, setPendingWallet] = useState<AbstractConnector | undefined>()
    const [pendingError, setPendingError] = useState<boolean>()

    function addSyscoinNetwork() {
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
        let name: string | undefined
        name = ''
        Object.keys(SUPPORTED_WALLETS).map(key => {
          if (connector === SUPPORTED_WALLETS[key].connector) {
            console.log(name, 'nAME')
            console.log(connector, 'connector')

            return (name = SUPPORTED_WALLETS[key].name)
          }
          return true
        })
        // log selected wallet
        ReactGA.event({
          category: 'Wallet',
          action: 'Change Wallet',
          label: name
        })
        setPendingWallet(connector) // set wallet for pending view
    
        if (connector instanceof WalletConnectConnector && connector.walletConnectProvider?.wc?.uri) {
              connector.walletConnectProvider = undefined
        }

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

    return (
      <>
        {Object.keys(SUPPORTED_WALLETS).map((key) => {
              const isMetamask = window.ethereum && window.ethereum.isMetaMask
              const option = SUPPORTED_WALLETS[key]
                  // check for mobile options
              if (isMobile) {
                  if (!window.web3 && !window.ethereum && option.mobile) {
                  return (
                    <>
                      <Option
                        onClick={() => {
                          option.connector !== connector && !option.href && tryActivation(option.connector)
                        }}
                        id={`connect-${key}`}
                        key={key}
                        active={option.connector && option.connector === connector}
                        color={option.color}
                        link={option.href}
                        header={option.name}
                        subheader={null}
                        icon={require('../../public/icons/' + option.iconName)}
                    />
                  </>
                )}
                return null
              }
              // overwrite injected when needed
              if (option.connector === injected) {
                // don't show injected if there's no injected provider
                if (!(window.web3 || window.ethereum)) {
                  if (option.name === 'MetaMask') {
                    return (
                      <Option
                        id={`connect-${key}`}
                        key={key}
                        color={'#E8831D'}
                        header={'Install Metamask'}
                        subheader={null}
                        link={'https://metamask.io/'}
                        icon={MetamaskIcon}
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
              return (
                !isMobile &&
                !option.mobileOnly && (
                  <Option
                    id={`connect-${key}`}
                    onClick={() => {
                     tryActivation(option.connector)
                    }}
                    key={key}
                    active={option.connector === connector}
                    color={option.color}
                    link={option.href}
                    header={option.name}
                    subheader={null} //use option.descriptio to bring back multi-line
                    icon={require('../../public/icons/' + option.iconName)}
                  />
                )
              )
          })}
      </>
    )
}