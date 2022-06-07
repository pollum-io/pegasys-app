import { Flex, Img } from '@chakra-ui/react'
import { usePicasso } from 'hooks'
import React from 'react'

interface IWalletProps  {
  link?: string | null
  onClick?: null | (() => void) | any
  header: React.ReactNode
  icon: any
  id: string
}

export const Wallets = ({id, header, icon, onClick}: IWalletProps) => {
  const theme = usePicasso();

  return (
      <Flex
        justifyContent='space-between'
        w='100%'
        mx='0'
        my='2'
        p='4'
        border='1px solid'
        borderRadius='10'
        fontSize='md'
        borderColor={theme.border.walltes}
        _hover={{ borderColor: theme.text.cyan }}
        fontWeight={500}
        id={id} onClick={onClick}
      >
        <Flex>{header}</Flex>
        <Img src={icon} w='6'/>
      </Flex>
  )
}
