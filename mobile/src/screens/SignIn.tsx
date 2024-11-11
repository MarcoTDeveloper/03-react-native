import { VStack, Image, Center, Text, Heading, ScrollView, useToast } from '@gluestack-ui/themed'
import BackgroundImg from '@assets/background.png'
import Logo from '@assets/logo.svg'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { useNavigation } from '@react-navigation/native'
import type { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup' 
import * as yup from 'yup'
import { useAuth } from '@hooks/useAuth'
import { AppError } from '@utils/AppError'
import { ToastMessage } from '@components/ToastMessage'
import { useState } from 'react'

const signInSchema = yup.object({
  email: yup.string().email('E-mail invalido!').required('Campo obrigatório!'),
  password: yup.string().required('Campo obrigatório!'),
})

type SingInFormData = yup.InferType<typeof signInSchema>

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const navigator = useNavigation<AuthNavigatorRoutesProps>()
  const { signIn } = useAuth()
  const { control, handleSubmit, formState: { errors } } = useForm<SingInFormData>({
    resolver: yupResolver(signInSchema)
  })

  function handleNewAccount() {
    navigator.navigate('singUp')
  }

  async function handleSingIn({ email, password }: SingInFormData) {
    try {
      setIsLoading(true)
      await signIn(email, password)
      
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível entrar.'
      
      setIsLoading(false)

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            action="error"
            title={title}
            description='Tente novamente mais tarde'
            onClose={() => toast.close(id)}
          />
        )
      })
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <VStack flex={1} bg='$gray700'>
        <Image
          w='$full'
          h={624}
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt='Pessoas treinando'
          position='absolute'
        />

        <VStack flex={1} px='$10' pb='$16'>
          <Center my='$24'>
            <Logo />

            <Text color='$gray100' fontSize='$sm'>
              Treine sua mente e o seu corpo.
            </Text>
          </Center>

          <Center gap='$2'>
            <Heading color='$gray100'>Acesse a conta</Heading>

            <Controller
              control={control}
              name='email'
              render={({ field }) => (
                <Input
                  placeholder='E-mail'
                  keyboardType='email-address'
                  autoCapitalize='none'  
                  onChangeText={field.onChange}
                  value={field.value}
                  errorMessage={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name='password'
              render={({ field }) => (
                <Input
                  placeholder='Senha'
                  autoCapitalize='none'
                  secureTextEntry
                  onChangeText={field.onChange}
                  value={field.value}
                  onSubmitEditing={handleSubmit(handleSingIn)}
                  returnKeyType='send'
                  errorMessage={errors.password?.message}
                />
              )}
            />

            <Button title='Acessar' isLoading={isLoading} onPress={handleSubmit(handleSingIn)}/>
          </Center>

          <Center flex={1} justifyContent='flex-end' mt='$4'>
            <Text
              color='$gray100'
              fontSize='$sm'
              mb='$3'
              fontFamily='$body'
            >
              Ainda não tem acesso?
            </Text>
            <Button
              title='Criar conta'
              variant='outline'
              onPress={handleNewAccount}
            />
          </Center>
        </VStack>
      </VStack>
    </ScrollView>
  )
}