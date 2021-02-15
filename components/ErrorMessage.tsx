import React from "react"
import {Text} from "react-native"

interface IErrorMessage {
  errors: any
  name: string
}
const ErrorMessage = ({errors, name}: IErrorMessage) => (
  <Text style={{color: "red"}}>{errors[name] ? errors[name].message : ""}</Text>
)

export default ErrorMessage
