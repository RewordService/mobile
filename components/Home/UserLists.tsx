import {MaterialIcons} from "@expo/vector-icons"
import React from "react"
import {ScrollView, View} from "react-native"
import {format} from "date-fns"
import {
  CardItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Text,
  Spinner,
} from "native-base"
import {IUser} from "../../interfaces"
import Section from "../Section"

const UserList = ({image, name, introduction, created_at}: IUser) => {
  return (
    <CardItem>
      <Left>
        {image?.url ? (
          <Thumbnail source={{uri: image.url}} />
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
const UserLists = ({
  loading,
  title,
  users,
}: {
  loading: boolean
  title: string
  users: IUser[]
}) => {
  const userListItems = users.map(user => <UserList key={user.id} {...user} />)
  return (
    <Section title={title}>
      <View>
        <ScrollView style={{height: 300}} nestedScrollEnabled>
          {loading ? <Spinner color="blue" /> : userListItems}
        </ScrollView>
      </View>
    </Section>
  )
}

export default UserLists
