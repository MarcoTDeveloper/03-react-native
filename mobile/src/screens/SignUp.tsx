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
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { ToastMessage } from '@components/ToastMessage'
import { useState } from 'react'
import { useAuth } from '@hooks/useAuth'

const signUpSchema = yup.object({
  name: yup.string().required('Campo obrigatório!'),
  email: yup.string().email('E-mail invalido!').required('Campo obrigatório!'),
  password: yup.string().required('Campo obrigatório!').min(6, 'Mínimo de 6 caracteres'),
  password_confirm: yup
    .string()
    .required('Campo obrigatório!')
    .oneOf([ yup.ref('password'), ''], 'As senhas não conferem!')
})

type FormDataType = yup.InferType<typeof signUpSchema>

export function SignUp() {
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()

  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  const toast = useToast()

  const { control, handleSubmit, formState: { errors } } =  useForm<FormDataType>({
    resolver: yupResolver(signUpSchema)
  })

  function handleBackToLogin() {
    navigation.navigate('singIn')
  }

  async function handleSingUp({ name, email, password }: FormDataType) {
    try {
      setIsLoading(true)
      await api.post('/users', { name, email, password })
      await signIn(email, password)

    } catch (error) {
      setIsLoading(false)

      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível criar a conta. Tente novamente mais tarde!'

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            action="error"
            title={title}
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

          <Center gap='$2' flex={1}>
            <Heading color='$gray100'>Crie sua conta</Heading>

            <Controller
              control={control}
              name='name'
              render={({ field }) => (
                <Input
                  placeholder='Nome'
                  onChangeText={field.onChange}
                  value={field.value}
                  errorMessage={errors.name?.message} 
                />
              )}
            />

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
                  onChangeText={field.onChange}
                  value={field.value}
                  secureTextEntry
                  errorMessage={errors.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name='password_confirm'
              render={({ field }) => (
                <Input
                  placeholder='Confirme a senha'
                  onChangeText={field.onChange}
                  value={field.value}
                  secureTextEntry
                  onSubmitEditing={handleSubmit(handleSingUp)}
                  returnKeyType='send'
                  errorMessage={errors.password_confirm?.message}
                />
              )}
            />
            
            <Button
              isLoading={isLoading}
              title='Criar e acessar'
              onPress={handleSubmit(handleSingUp)}
            />
          </Center>

          <Button title='Voltar para o login' variant='outline' mt='$12' onPress={handleBackToLogin} />
        </VStack>
      </VStack>
    </ScrollView>
  )
}