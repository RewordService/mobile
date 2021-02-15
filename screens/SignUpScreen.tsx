import {yupResolver} from "@hookform/resolvers/yup"
import {useNavigation} from "@react-navigation/native"
import axios, {AxiosError} from "axios"
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
import {useForm, Controller, SubmitHandler} from "react-hook-form"
import {View} from "react-native"
import {useDispatch} from "react-redux"
import ErrorMessage from "../components/ErrorMessage"
import {
  IErrorsResponse,
  ISignUpFormValues,
  IUserSuccessResponse,
} from "../interfaces"
import {signUpSchema} from "../schema"
import {setCurrentUser, setHeaders} from "../slices/currentUser"

const SignUpScreen = () => {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const {control, handleSubmit, errors} = useForm({
    resolver: yupResolver(signUpSchema),
  })
  const onSubmit = (data: SubmitHandler<ISignUpFormValues>) => {
    setLoading(true)
    axios
      .post<IUserSuccessResponse>("/auth", data)
      .then(res => {
        dispatch(setCurrentUser(res.data.data))
        dispatch(setHeaders(res.headers))
        navigation.navigate("Home")
      })
      .catch((err: AxiosError<IErrorsResponse>) => {
        setLoading(false)
        console.log(err.response?.data.errors)
        ;(err.response?.data.errors.full_messages || []).forEach(error =>
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
          <H2 style={{textAlign: "center"}}>SignUp</H2>
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
              name="name"
              control={control}
              defaultValue=""
              render={({ref, value, onChange}, {invalid}) => (
                <Item floatingLabel error={invalid}>
                  <Label>Name</Label>
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
            <ErrorMessage errors={errors} name="name" />

            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ref, value, onChange}, {invalid}) => (
                <Item floatingLabel error={invalid}>
                  <Label>password</Label>
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

            <Controller
              name="passwordConfirmation"
              control={control}
              defaultValue=""
              render={({ref, value, onChange}, {invalid}) => (
                <Item floatingLabel error={invalid}>
                  <Label>passwordConfirmation</Label>
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
            <ErrorMessage errors={errors} name="passwordConfirmation" />

            <Button
              block
              style={{marginTop: 30}}
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
            >
              {loading ? <Spinner /> : null}
              <Text>SignUp</Text>
            </Button>
          </Form>
        </View>
      </View>
    </Root>
  )
}

export default SignUpScreen
