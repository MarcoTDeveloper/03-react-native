import { FormControlError } from '@gluestack-ui/themed'
import { FormControl, FormControlErrorText, Input as GInput, InputField } from '@gluestack-ui/themed'
import type { ComponentProps } from 'react'

type InputProps = ComponentProps<typeof InputField> & {
  errorMessage?: string | null
  isInvalid?: boolean
  isReadyOnly?: boolean
}

export function Input({
  isReadyOnly = false,
  errorMessage = null,
  isInvalid = false,
  ...props
}: InputProps) {

  const invalid = !!errorMessage || isInvalid

  return (
    <FormControl isInvalid={invalid} w="$full">
      <GInput
        isInvalid={isInvalid}
        h='$14'
        borderWidth='$0'
        borderRadius='$md'
        $focus={{
          borderWidth: 1,
          borderColor: invalid ? '$red500' : '$green500'
        }}
        $invalid={{
          borderWidth: 1,
          borderColor: '$red500'
        }}
        isReadOnly={isReadyOnly}
        opacity={isReadyOnly ? 0.5 : 1}
      >
        <InputField
          bg='$gray700'
          px='$4'
          color='$white'
          fontFamily='$body'
          placeholderTextColor='$gray300'
          {...props}
        />
      </GInput>
      
      <FormControlError>
        <FormControlErrorText color='$red500'>
          {errorMessage}
        </FormControlErrorText>
      </FormControlError>
    </FormControl>
  )
}