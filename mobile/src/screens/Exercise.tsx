import { Box, Heading, HStack, Icon, Image, Text, Toast, useToast, VStack } from "@gluestack-ui/themed";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { AppNavigatorRoutesProps } from "@routes/app.routes";
import { ArrowLeft } from "lucide-react-native";
import { ScrollView, TouchableOpacity } from "react-native";

import BodySvg from "@assets/body.svg"
import SeriesSvg from "@assets/series.svg"
import RepetitionSvg from "@assets/repetitions.svg"
import { Button } from "@components/Button";
import { AppError } from "@utils/AppError";
import { ToastMessage } from "@components/ToastMessage";
import { api } from "@services/api";
import { useEffect, useState } from "react";
import type { ExerciseDTO } from "@dtos/ExerciseDTO";
import { Loading } from "@components/Loading";

type RouteParams = {
  exerciseId: string
}

export function Exercise() {
  const [isLoading, setIsLoading] = useState(true)
  const [submittingRegister, setSubmittingRegister] = useState(false)
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO)
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const toast = useToast()
  const route = useRoute()

  const { exerciseId } = route.params as RouteParams

  function handleReturnToHome() {
    navigation.goBack()
  }

  async function fetchExerciseDetails() {
    try {
      setIsLoading(true)
      const response = await api.get(`/exercises/${exerciseId}`)
      setExercise(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível carregar os detalhes do exercícios.'

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
  
  async function handleExerciseHistoryRegister() {
    try {
      setSubmittingRegister(true)
      await api.post('/history', { exercise_id: exerciseId })

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title="Parabéns"
            description="Exercício registrado no seu histórico"
            onClose={() => toast.close(id)}
            action="success"
          />
        )
      })

      navigation.navigate('history')

    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível registrar o exercício.'

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
      setSubmittingRegister(false)
    }
  }

  useEffect(() => {
    fetchExerciseDetails()
  },[exerciseId])

  return (
    <VStack flex={1}>
      <VStack px="$8" bg="$gray600" pt="$12">
        <TouchableOpacity onPress={handleReturnToHome}>
          <Icon as={ArrowLeft} color="$green500" size='xl' />
        </TouchableOpacity>

        <HStack
          justifyContent="space-between"
          alignItems="center"
          mt="$4"
          mb="$8"
        >
          <Heading
            color="$gray100"
            fontFamily="$heading"
            fontSize="$lg"
            flexShrink={1}
          >
            {exercise.name}
          </Heading>

          <HStack alignItems="center">
            <BodySvg />
            <Text color="$gray200" ml='$1' textTransform="capitalize">{exercise.group}</Text>
          </HStack>

        </HStack>
      </VStack>

      {isLoading ? <Loading /> : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          <VStack p="$8">
            <Box rounded="$lg" mb="$3" overflow="hidden">
              <Image
                source={{ uri: `${api.defaults.baseURL}/exercise/thumb/${exercise.thumb}` }}
                alt="Foto do exercício"
                mb="$3"
                resizeMode="cover"
                rounded="$lg"
                w="$full"
                h="$80"
              />
            </Box>

            <Box
              bg="$gray600"
              rounded="$md"
              pb="$4"
              px="$4"
            >
              <HStack alignItems="center" justifyContent="space-around" mb="$6" mt="$5">
                <HStack>
                  <SeriesSvg />
                  <Text color="$gray200" ml="$2">{exercise.series} séries</Text>  
                </HStack>
                <HStack>
                  <RepetitionSvg />
                  <Text color="$gray200" ml="$2">{exercise.repetitions} repetições</Text>
                </HStack>
              </HStack>

              <Button onPress={handleExerciseHistoryRegister} title="Marcar como realizado" isLoading={submittingRegister} />
            </Box>
          </VStack>
        </ScrollView>
      )}
    </VStack>
  )
}