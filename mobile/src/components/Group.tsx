import { Button, Text } from "@gluestack-ui/themed"
import type { ComponentProps } from "react"

type GroupProps = ComponentProps<typeof Button> & {
  name: string
  isActive: boolean
}

export function Group({ name, isActive, ...props }: GroupProps) {
  return (
    <Button
      minWidth="$24"
      h="$10"
      bg="$gray600"
      rounded="$md"
      justifyContent="center"
      alignItems="center"
      borderColor="$green500"
      mr="$3"
      borderWidth={isActive ? 1 : 0}
      sx={{
        ":active": {
          borderWidth: 1
        }
      }}
      {...props}
    >
      <Text
        color={isActive ? "$green500" : "$gray200"}
        textTransform="uppercase"
        fontSize="$xs"
        fontFamily="$heading"
      >
        {name}
      </Text>
    </Button>
  )
}