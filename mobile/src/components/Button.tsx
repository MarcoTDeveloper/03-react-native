import { ButtonSpinner, Button as GButton, Text } from "@gluestack-ui/themed"
import type { ComponentProps } from "react"

type ButtonProps = ComponentProps<typeof GButton> & {
  title: string
  isLoading?: boolean
  variant?: 'solid' | 'outline' 
}

export function Button({ title, variant = 'solid', isLoading = false, ...props}: ButtonProps) {
  return (
    <GButton
      w='$full'
      h='$14'
      bg={variant === 'outline' ? 'transparent' : '$green700'}
      borderWidth={variant === 'outline' ? '$1' : '$0'}
      borderColor='$green500'
      rounded='$sm'
      $active-bg={variant === 'outline' ? '$gray500' : "$green500"}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <ButtonSpinner color='$white' /> : (          
        <Text
          color={variant === 'outline' ? '$green500' : '$white'}
          fontFamily='$heading'
          fontSize='$sm'
        >
          {title}
        </Text>
      )}
    </GButton>
  )
}