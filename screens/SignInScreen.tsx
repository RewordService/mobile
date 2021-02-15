import {
  Button,
  Form,
  H2,
  Icon,
  Input,
  Item,
  Label,
  Root,
  Spinner,
  Text,
  Toast,
} from "native-base"
import React, {useState} from "react"
import {View} from "react-native"
import {useForm, Controller, SubmitHandler} from "react-hook-form"
import {useDispatch} from "react-redux"
import axios, {AxiosError} from "axios"
import {yupResolver} from "@hookform/resolvers/yup"
import {useNavigation} from "@react-navigation/native"
import {setCurrentUser, setHeaders} from "../slices/currentUser"
import {
  IErrorResponse,
  ISignInFormValues,
  IUserSuccessResponse,
} from "../interfaces"
import {signInSchema} from "../schema"
import ErrorMessage from "../components/ErrorMessage"

const SignInScreen = () => {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const {control, handleSubmit, errors, clearErrors} = useForm({
    resolver: yupResolver(signInSchema),
  })
  const onSubmit = (data: SubmitHandler<ISignInFormValues>) => {
    setLoading(true)
    axios
      .post<IUserSuccessResponse>("/auth/sign_in", data)
      .then(res => {
        dispatch(setCurrentUser(res.data.data))
        dispatch(setHeaders(res.headers))
        navigation.navigate("Home")
      })
      .catch((err: AxiosError<IErrorResponse>) => {
        setLoading(false)
        ;(err.response?.data.errors || []).forEach(error =>
          Toast.show({
            text: error,
            buttonText: "Close",
            type: "danger",
            duration: 5000,
          })
        )
      })
  }
  return (
    <Root>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{width: "90%"}}>
          <H2 style={{textAlign: "center"}}>SignIn</H2>
          <Form>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ref, value, onChange}, {invalid}) => (
                <Item floatingLabel error={invalid}>
                  <Label>Email</Label>
                  <Input
                    ref={ref}
                    value={value}
                    onChangeText={text => onChange(text)}
                    disabled={loading}
                  />
                  {invalid ? <Icon name="close-circle" /> : null}
                </Item>
              )}
            />
            <ErrorMessage errors={errors} name="email" />
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ref, value, onChange}, {invalid}) => (
                <Item floatingLabel error={invalid}>
                  <Label>Password</Label>
                  <Input
                    ref={ref}
                    value={value}
                    onChangeText={text => onChange(text)}
                    disabled={loading}
                  />
                  {invalid ? <Icon name="close-circle" /> : null}
                </Item>
              )}
            />
            <ErrorMessage errors={errors} name="password" />

            <Button
              block
              style={{marginTop: 30}}
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
            >
              {loading ? <Spinner /> : null}
              <Text>SignIn</Text>
            </Button>
          </Form>
        </View>
      </View>
    </Root>
  )
}

export default SignInScreen
