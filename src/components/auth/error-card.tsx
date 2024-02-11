import { FaExclamation } from "react-icons/fa"
import { CardWrapper } from "./card-wrapper"

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Oops! Something went wrong"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
      showSocial={false}
    >
      <div className="w-full flex justify-center items-center">
        <FaExclamation className="text-6xl text-red-500" />
      </div>
    </CardWrapper>
  )
}
