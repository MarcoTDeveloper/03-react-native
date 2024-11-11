import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Center, Heading, ScrollView, Text, useToast, VStack } from "@gluestack-ui/themed";
import { TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker"
import * as FileSystem from "expo-file-system"
import * as yup from "yup"
import defaultUserPhotoImg from "@assets/userPhotoDefault.png"
import { useState } from "react";
import { ToastMessage } from "@components/ToastMessage";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@hooks/useAuth";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";

const profileSchema = yup.object({
  name: yup.string().required('Campo obrigatório!'),
  email: yup.string(),
  old_password: yup.string(),
  password: yup.string().min(6, 'Mínimo de 6 dígitos!').nullable().transform((value) => !!value ? value : null),
  confirm_password: yup
    .string()
    .min(6, 'Mínimo de 6 dígitos!')
    .nullable()
    .transform((value) => !!value ? value : null)
    .oneOf([ yup.ref('password'), ''], 'As senhas não conferem!')
    .when('password', {
      is: (field: any) => field,
      then: (schema) =>
        schema.nullable().required('Informe a confirmação da senha.').transform((value) => !!value ? value : null),
    })
})

type ProfileFormData = yup.InferType<typeof profileSchema>

export function Profile() {
  const [isLoading, setIsLoading] = useState(false)

  const toast = useToast()
  const { user, updateUserProfile } = useAuth()

  const { control, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema)
  })

  async function handleUserPhotoSelect() {
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true
      })
  
      if (photoSelected.canceled) {
        return
      }
  
      const photoURI = photoSelected.assets[0].uri 
  
      if (photoURI) {
        const photoInfo = await FileSystem.getInfoAsync(photoURI) as { size: number }
  
        if (photoInfo.size && (photoInfo.size / 1024 / 1024) > 5) {
          return toast.show({
            placement: "top",
            render: ({ id }) => (
              <ToastMessage
                id={id}
                action="error"
                title="Imagem muito grande!"
                description="Escolha uma imagem de até 5MB!"
                onClose={() => toast.close(id)}
              />
            )
          })
        }
  
        const fileExtension = photoURI.split('.').pop()

        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: photoURI,
          type: `${photoSelected.assets[0].type}/${fileExtension}`
        } as any

        const userPhotoUploadForm = new FormData()
        userPhotoUploadForm.append('avatar', photoFile)

        const avatarUpdated = await api.patch('/users/avatar', userPhotoUploadForm, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        const userUpdated = user
        userUpdated.avatar = avatarUpdated.data.avatar
        updateUserProfile(userUpdated)

        toast.show({
          placement: "top",
          render: ({ id }) => (
            <ToastMessage
              id={id}
              title="Imagem atualizada!"
              action="success"
              onClose={() => toast.close(id)}
            />
          )
        })

      }
    } catch (error) {
      console.log(error)
    }
  }

  async function handleProfileUpdate({ name, password, old_password }: ProfileFormData) {
    try {
      setIsLoading(true)

      const userUpdated = user
      userUpdated.name = name

      await api.put('/users', { name, password, old_password })

      await updateUserProfile(userUpdated)

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title="Perfil atualizado"
            onClose={() => toast.close(id)}
            action="success"
          />
        )
      })
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível atualizar o perfil.'

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title={title}
            onClose={() => toast.close(id)}
            action="error"
          />
        )
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$10">
          <UserPhoto
            source={
              user.avatar
              ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
              : defaultUserPhotoImg
            }
            alt="Foto de perfil"
            size="xl"
          />

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text
              color="$green500"
              fontFamily="$heading"
              fontSize="$md"
              mt="$2"
              mb="$8"
            >
              Alterar Foto
            </Text>
          </TouchableOpacity>

          <Center w='$full' gap='$4'>
            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="Nome"
                  bg="$gray600"
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="E-mail"
                  bg="$gray600"
                  isReadyOnly
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </Center>

          <Heading
            alignItems="flex-start"
            fontFamily="$heading"
            color="$gray200"
            fontSize="$md"
            mt="$12"
            mb="$2"
          >
            Alterar senha
          </Heading>

          <Center w="$full" gap="$4">
            <Controller
              control={control}
              name="old_password"
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="Senha antiga"
                  bg="$gray600"
                  secureTextEntry
                  onChangeText={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="Nova senha"
                  bg="$gray600"
                  secureTextEntry
                  onChangeText={onChange}
                  errorMessage={errors.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="confirm_password"
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="Confirme a nova senha"
                  bg="$gray600"
                  secureTextEntry
                  onChangeText={onChange}
                  errorMessage={errors.confirm_password?.message}
                />
              )}
            />

            <Button title="Atualizar" onPress={handleSubmit(handleProfileUpdate)} isLoading={isLoading} />
          </Center>

        </Center>

      </ScrollView>
    </VStack>
  )
}