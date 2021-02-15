import React, {useEffect, useState} from "react"
import {Platform, Alert, ScrollView} from "react-native"
import {
  Text,
  Button,
  Toast,
  View,
  Spinner,
  Item,
  Label,
  Input,
  Icon,
  Picker,
  Root,
} from "native-base"
import snakeCaseKeys from "snakecase-keys"
import axios, {AxiosError} from "axios"
import {useDispatch, useSelector} from "react-redux"
import {useForm, Controller} from "react-hook-form"
import {useNavigation} from "@react-navigation/native"
import DateTimePicker from "@react-native-community/datetimepicker"
import {yupResolver} from "@hookform/resolvers/yup"
import * as ImagePicker from "expo-image-picker"
import {
  remove,
  selectCurrentUser,
  selectHeaders,
  setCurrentUser,
  setHeaders,
} from "../slices/currentUser"
import {
  IErrorResponse,
  IErrorsResponse,
  IUserSuccessResponse,
} from "../interfaces"
import Section from "../components/Section"
import {emailSchema, profileSchema} from "../schema"
import ErrorMessage from "../components/ErrorMessage"

const ProfileEdit: React.FC = () => (
  <ScrollView>
    <Root>
      <ProfileChange />
      <EmailChange />
      <PasswordChange />
      <AccountDelete />
    </Root>
  </ScrollView>
)

const IconChange = () => {
  const dispatch = useDispatch()
  const headers = useSelector(selectHeaders)
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })
    if (!result.cancelled) {
      handlePost(result.uri)
    }
  }
  const handlePost = (uri: string) => {
    if (!headers) return
    const formData = new FormData()
    let uriParts = uri.split(".")
    let fileType = uriParts[uriParts.length - 1]
    formData.append("image", {
      uri: uri,
      name: `icon.${fileType}`,
      type: `image/${fileType}`,
    })
    axios
      .patch<IUserSuccessResponse>("/auth", formData, headers)
      .then(res => {
        dispatch(setCurrentUser(res.data.data))
        Toast.show({
          text: "アイコンを変更しました",
          buttonText: "Close",
          type: "success",
          duration: 5000,
        })
      })
      .catch((err: AxiosError<IErrorResponse>) => {
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

  useEffect(() => {
    ;(async () => {
      if (Platform.OS !== "web") {
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!")
        }
      }
    })()
  }, [])

  return (
    <View style={{marginBottom: 10}}>
      <SubTitle title="アイコン" />
      <Button block onPress={pickImage}>
        <Text>Open Photo</Text>
      </Button>
    </View>
  )
}

interface IFormValueProfile {
  introduction: string
  name: string
}
const ProfileChange = () => {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const {control, handleSubmit, errors} = useForm<IFormValueProfile>({
    resolver: yupResolver(profileSchema),
  })
  const dispatch = useDispatch()
  const headers = useSelector(selectHeaders)
  const currentUser = useSelector(selectCurrentUser)
  const handleShow = () => setShow(true)
  const onSubmit = (data: IFormValueProfile) => {
    if (!headers) return
    setLoading(true)
    axios
      .patch<IUserSuccessResponse>("/auth", snakeCaseKeys({...data}), headers)
      .then(res => {
        setLoading(false)
        dispatch(setCurrentUser(res.data.data))
        Toast.show({
          text: "プロフィールを変更しました",
          buttonText: "Close",
          type: "success",
          duration: 5000,
        })
      })
      .catch((err: AxiosError<IErrorsResponse>) => {
        setLoading(false)
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
    <Section title="ユーザー編集">
      <View style={{margin: 10}}>
        <View>
          <IconChange />
          <View>
            <Controller
              name="name"
              control={control}
              defaultValue={currentUser?.name || ""}
              render={({ref, value, onChange}, {invalid}) => (
                <Item floatingLabel error={invalid}>
                  <Label>Name</Label>
                  <Input
                    ref={ref}
                    value={value}
                    onChangeText={onChange}
                    disabled={loading}
                  />
                  {invalid ? <Icon name="close-circle" /> : null}
                </Item>
              )}
            />
            <ErrorMessage errors={errors} name="name" />
          </View>
          <View>
            <SubTitle title="自己紹介文" />
            <Controller
              name="introduction"
              control={control}
              defaultValue={currentUser?.introduction || ""}
              render={({ref, value, onChange}, {invalid}) => (
                <Item floatingLabel error={invalid}>
                  <Label>Name</Label>
                  <Input
                    ref={ref}
                    value={value}
                    onChangeText={onChange}
                    disabled={loading}
                  />
                  {invalid ? <Icon name="close-circle" /> : null}
                </Item>
              )}
            />
            <ErrorMessage errors={errors} name="introduction" />
          </View>
          <View>
            <SubTitle title="性別" />
            {currentUser?.gender ? (
              <Text>{currentUser?.gender}</Text>
            ) : (
              <Controller
                name="gender"
                control={control}
                defaultValue={currentUser?.gender || 0}
                render={({ref, value, onChange}) => (
                  <Picker
                    ref={ref}
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" />}
                    selectedValue={value}
                    onValueChange={onChange}
                  >
                    <Picker.Item label="男性" value={1} />
                    <Picker.Item label="女性" value={2} />
                    <Picker.Item label="その他" value={9} />
                  </Picker>
                )}
              />
            )}
          </View>
          <View>
            <SubTitle title="誕生日" />
            {show ? (
              <Controller
                name="birthday"
                control={control}
                defaultValue={currentUser?.birthday || new Date()}
                render={({value, onChange}) => (
                  <DateTimePicker
                    value={value}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={(_e, selectedDate) => {
                      const currentDate = selectedDate || new Date()
                      setShow(Platform.OS === "ios")
                      onChange(currentDate)
                    }}
                  />
                )}
              />
            ) : null}
          </View>
          <Button block style={{marginTop: 30}} onPress={handleShow}>
            <Text>select Date</Text>
          </Button>
          <View>
            <Button
              block
              style={{marginTop: 30}}
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
            >
              {loading ? <Spinner /> : null}
              <Text>保存</Text>
            </Button>
          </View>
        </View>
      </View>
    </Section>
  )
}

interface IFormValueEmail {
  email: string
}
const EmailChange = () => {
  const [loading, setLoading] = useState(false)
  const currentUser = useSelector(selectCurrentUser)
  const headers = useSelector(selectHeaders)
  const dispatch = useDispatch()
  const {control, handleSubmit, errors} = useForm<IFormValueEmail>({
    resolver: yupResolver(emailSchema),
  })
  const onSubmit = (data: IFormValueEmail) => {
    if (!headers) return
    setLoading(true)
    axios
      .patch<IUserSuccessResponse>("/auth", data, headers)
      .then(res => {
        setLoading(false)
        Toast.show({
          text: "メールアドレスを変更しました",
          buttonText: "Close",
          type: "success",
          duration: 5000,
        })
        dispatch(setHeaders(res.headers))
      })
      .catch((err: AxiosError<IErrorsResponse>) => {
        setLoading(false)
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
    <Section title="メールアドレス変更">
      <View style={{margin: 10}}>
        <Controller
          name="email"
          control={control}
          defaultValue={currentUser?.email || ""}
          render={({ref, value, onChange}, {invalid}) => (
            <Item floatingLabel error={invalid}>
              <Label>Name</Label>
              <Input
                ref={ref}
                value={value}
                onChangeText={onChange}
                disabled={loading}
              />
              {invalid ? <Icon name="close-circle" /> : null}
            </Item>
          )}
        />
        <ErrorMessage errors={errors} name="email" />
        <Button block onPress={handleSubmit(onSubmit)}>
          {loading ? <Spinner /> : null}
          <Text>変更</Text>
        </Button>
      </View>
    </Section>
  )
}
interface IFormValuePassword {
  password: string
  passwordConfirmation: string
}
const PasswordChange = () => {
  const [loading, setLoading] = useState(false)
  const {
    control,
    handleSubmit,
    setValue,
    errors,
  } = useForm<IFormValuePassword>()
  const headers = useSelector(selectHeaders)
  const onSubmit = (data: IFormValuePassword) => {
    setLoading(true)
    if (!headers) return
    axios
      .put<IUserSuccessResponse>("/auth/password", snakeCaseKeys(data), headers)
      .then(() => {
        setLoading(false)
        Toast.show({
          text: "パスワードを変更しました",
          buttonText: "Close",
          type: "success",
          duration: 5000,
        })
      })
      .catch((err: AxiosError<IErrorsResponse>) => {
        setLoading(false)
        ;(err.response?.data.errors.full_messages || []).forEach(error =>
          Toast.show({
            text: error,
            buttonText: "Close",
            type: "danger",
            duration: 5000,
          })
        )
      })
    setValue("password", "")
    setValue("passwordConfirmation", "")
  }
  return (
    <Section title="パスワード変更">
      <View style={{margin: 10}}>
        <View>
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
                  onChangeText={onChange}
                  disabled={loading}
                />
                {invalid ? <Icon name="close-circle" /> : null}
              </Item>
            )}
          />
          <ErrorMessage errors={errors} name="password" />
        </View>
        <View>
          <Controller
            name="passwordConfirmation"
            control={control}
            defaultValue=""
            render={({ref, value, onChange}, {invalid}) => (
              <Item floatingLabel error={invalid}>
                <Label>PasswordConfirmation</Label>
                <Input
                  ref={ref}
                  value={value}
                  onChangeText={onChange}
                  disabled={loading}
                />
                {invalid ? <Icon name="close-circle" /> : null}
              </Item>
            )}
          />
          <ErrorMessage errors={errors} name="passwordConfirmation" />
        </View>
        <Button block onPress={handleSubmit(onSubmit)}>
          {loading ? <Spinner /> : null}
          <Text>変更</Text>
        </Button>
      </View>
    </Section>
  )
}

const AccountDelete = () => {
  const headers = useSelector(selectHeaders)
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const handlePress = () => {
    if (!headers) return
    axios
      .delete("/auth", headers)
      .then(() => {
        navigation.navigate("Home")
        dispatch(remove())
      })
      .catch((err: AxiosError<IErrorsResponse>) => {
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
  const createModal = () => {
    Alert.alert(
      "本当に削除しますか?",
      "削除を行うと、アカウントやゲームの情報などがすべて消えます",
      [
        {text: "削除する", onPress: () => handlePress()},
        {text: "キャンセル", style: "cancel"},
      ]
    )
  }
  return (
    <Section title="アカウント退会">
      <View style={{margin: 10}}>
        <Button block danger onPress={createModal}>
          <Text>Delete Account</Text>
        </Button>
      </View>
    </Section>
  )
}
const SubTitle = ({title}: {title: string}) => (
  <Text
    style={{
      marginBottom: 10,
    }}
  >
    {title}
  </Text>
)

export default ProfileEdit
