import { Center, Heading } from "@gluestack-ui/themed";

type ScreenHeaderProps = {
  title: string
}

export function ScreenHeader({ title }: ScreenHeaderProps) {
  return (
    <Center bg="$gray600" pb="$6" pt="$16">
      <Heading color="$gray100" fontSize="$xl" fontFamily="$heading">
        {title}
      </Heading>
    </Center>
  )
}