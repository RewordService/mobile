import React, {ReactNode} from "react"
import {ScrollView, View} from "react-native"
import {Card, H3} from "native-base"

interface ISection {
  title: string
  children: ReactNode
}
const Section = ({title, children}: ISection) => {
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
      {children}
    </Card>
  )
}

export default Section
