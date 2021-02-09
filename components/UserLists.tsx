import {MaterialIcons} from "@expo/vector-icons"
import React from "react"
import {format} from "date-fns"
import {
  Card,
  CardItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Text,
  View,
  H3,
} from "native-base"
import {IUser} from "../interfaces"
const userList = ({image, name, introduction, created_at}: IUser) => {
  return (
    <CardItem>
      <Left>
        {image?.url ? (
          <Thumbnail source={{uri: image.url || undefined}} />
        ) : (
          <MaterialIcons name="account-circle" size={55} color="#999999" />
        )}
      </Left>
      <Body>
        <Text>{name}</Text>
        <Text note>{introduction}</Text>
      </Body>
      <Right>
        <Text note>{format(Date.parse(created_at), "yyyy/MM/dd")}</Text>
      </Right>
    </CardItem>
  )
}
const UserLists = ({title, users}: {title: string; users: IUser[]}) => {
  const userListItems = users.map(user => userList(user))
  return (
    <Card>
      <View
        style={{
          flex: 1,
          alignSelf: "stretch",
          paddingLeft: 10,
          marginTop: 10,
          marginHorizontal: 15,
          borderLeftWidth: 3,
          borderLeftColor: "#79bac1",
          borderBottomWidth: 1,
          borderBottomColor: "#999999",
        }}
      >
        <H3>{title}</H3>
      </View>
      {userListItems}
    </Card>
  )
}

export default UserLists
