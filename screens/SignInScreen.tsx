import {Button, Form, H2, Input, Item, Label, Text} from "native-base"
import React from "react"
import {View} from "react-native"

const SignInScreen = () => {
  return (
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
          <Item floatingLabel>
            <Label>Email</Label>
            <Input />
          </Item>
          <Item floatingLabel>
            <Label>Password</Label>
            <Input />
          </Item>
          <Button block style={{marginTop: 30}}>
            <Text>SignIn</Text>
          </Button>
        </Form>
      </View>
    </View>
  )
}

export default SignInScreen
