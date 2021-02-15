import * as yup from "yup"

const signInSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
})
const signUpSchema = yup.object().shape({
  email: yup.string().email().required(),
  name: yup.string().required(),
  password: yup.string().required(),
  passwordConfirmation: yup.string().oneOf([yup.ref("password"), null]),
})

export {signInSchema, signUpSchema}
