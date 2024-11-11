import { Image } from "@gluestack-ui/themed"
import type { ComponentProps } from "react"

type UserPhotoProps = ComponentProps<typeof Image>

export function UserPhoto({ ...props }: UserPhotoProps) {
  return (
    <Image
      rounded="$full"
      borderWidth="$2"
      borderColor="$gray400"
      backgroundColor="$gray500"
      {...props}
    />
  )
}