import { Button, Flex, Img, Link, Text, Input } from '@chakra-ui/react';
import { DefaultTemplate } from 'container';
import { usePicasso } from 'hooks';
import { NextPage } from 'next';

export const FarmContainer: NextPage = () => {
  const theme = usePicasso();

  return (
    <DefaultTemplate>
      <Flex
        w="100%"
        h="100%"
        alignItems="flex-start"
        justifyContent="center"
        pt="24"
      >
        <Flex flexDirection="column" maxW="xl" h="100%" gap="5">
          <Flex
            flexDirection="column"
            zIndex="docked"
            position="relative"
            borderRadius="xl"
            h="127px"
            background="linear-gradient(160deg, #b000e9 0%, #80d0c7 100%)"
          >
            <Img
              borderRadius="xl"
              src="images/backgrounds/1.png"
              position="absolute"
              zIndex="base"
              w="100%"
              h="100%"
              objectFit="none"
              opacity="0.4"
              objectPosition="25% 20%"
            />
            <Flex zIndex="docked" flexDirection="column" px="4" py="4" gap="1">
              <Text fontWeight="medium" color="white">
                Pegasys liquidity mining
              </Text>
              <Text fontWeight="medium" fontSize="sm" color="white">
                Deposit your Pegasys Liquidity Provider PLP tokens to receive
                PSYS, the Pegasys protocol governance token.
              </Text>
              <Link textDecoration="underline" color="white">
                Read more about PSYS
              </Link>
            </Flex>
          </Flex>

          <Flex flexDirection="column" fontSize="xl" gap="3">
            <Text fontWeight="medium">Participating pools</Text>
            <Input
              px="4"
              py="4"
              w="100%"
              h="max-content"
              m="0"
              borderRadius={36}
              placeholder="Token Name"
              fontWeight={400}
              backgroundColor="transparent"
              border="1px solid"
              borderColor={theme.border.borderSettings}
              color={theme.text.mono}
              fontFamily="mono"
              letterSpacing="-0.8px"
            />
            <Flex>
              <Text fontSize="sm" mr="2">
                Sort by:
              </Text>
              <Flex justifyContent="space-between" w="35%">
                <Text
                  fontSize="sm"
                  cursor="pointer"
                  _after={{ content: `"|"`, marginLeft: '2' }}
                >
                  Liquidity
                </Text>
                <Text
                  fontSize="sm"
                  cursor="pointer"
                  _after={{ content: `"|"`, marginLeft: '2' }}
                >
                  Pool Weight
                </Text>
                <Text fontSize="sm" cursor="pointer">
                  APR
                </Text>
              </Flex>
            </Flex>

            <Flex flexDirection="column" gap="3">
              <Flex
                flexDirection="column"
                zIndex="docked"
                position="relative"
                borderRadius="xl"
                h="247px"
                background="radial-gradient(91.85% 100% at 1.84% 0%, rgb(36, 116, 204) 0%, rgb(108, 114, 132) 100%)"
              >
                <Img
                  borderRadius="xl"
                  src="images/backgrounds/apps.png"
                  position="absolute"
                  zIndex="base"
                  w="100%"
                  h="100%"
                  objectFit="none"
                  opacity="0.4"
                  objectPosition="25% 20%"
                />
                <Flex
                  zIndex="docked"
                  flexDirection="column"
                  px="4"
                  py="4"
                  gap="3"
                >
                  <Flex
                    w="100%"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Flex alignItems="center">
                      <Img src="icons/usdc.png" w="24px" h="24px" />
                      <Img src="icons/usdt.png" w="24px" h="24px" />
                      <Text ml="2" color="white" fontWeight={600}>
                        USDC-USDT
                      </Text>
                    </Flex>
                    <Button
                      backgroundColor={theme.bg.button.primary}
                      color="white"
                    >
                      Deposit
                    </Button>
                  </Flex>
                  <Flex flexDirection="column" w="100%" gap="3">
                    <Flex
                      w="100%"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text fontSize="md" color={theme.text.infoLink}>
                        Total staked
                      </Text>
                      <Text fontSize="md" color={theme.text.infoLink}>
                        $1,422,000
                      </Text>
                    </Flex>
                    <Flex
                      w="100%"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text fontSize="md" color={theme.text.infoLink}>
                        Swap Fee APR
                      </Text>
                      <Text fontSize="md" color={theme.text.infoLink}>
                        -
                      </Text>
                    </Flex>
                    <Flex
                      w="100%"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text fontSize="md" color={theme.text.infoLink}>
                        Rewards APR
                      </Text>
                      <Text fontSize="md" color={theme.text.infoLink}>
                        10%
                      </Text>
                    </Flex>
                    <Flex
                      w="100%"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text fontSize="md" color={theme.text.infoLink}>
                        Total APR
                      </Text>
                      <Text fontSize="md" color={theme.text.infoLink}>
                        10%
                      </Text>
                    </Flex>
                    <Flex
                      w="100%"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text fontSize="md" color={theme.text.infoLink}>
                        Pool Weight
                      </Text>
                      <Text fontSize="md" color={theme.text.infoLink}>
                        2X
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </DefaultTemplate>
  );
};
