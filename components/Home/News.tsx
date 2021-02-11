import React, {useEffect, useState} from "react"
import {Linking, ScrollView} from "react-native"
import axios from "axios"
import {Body, CardItem, Right, Spinner, Text} from "native-base"
import Section from "../Section"
interface INews {
  title: string
  url: string
  date: string
}
const News = () => {
  const [loading, setLoading] = useState(true)
  const [news, setNews] = useState<INews[]>([])
  useEffect(() => {
    axios
      .get<INews[]>("/news.json")
      .then(res => {
        setLoading(false)
        setNews(res.data)
      })
      .catch(err => err)
  }, [])
  return (
    <Section title="お知らせ">
      <ScrollView style={{height: 200}} nestedScrollEnabled>
        {loading ? (
          <Spinner />
        ) : (
          news.map(({title, date, url}) => {
            const handlePress = () => Linking.openURL(url)
            return (
              <CardItem key={title} onPress={handlePress}>
                <Body>
                  <Text>{title}</Text>
                </Body>
                <Right>
                  <Text note>{date}</Text>
                </Right>
              </CardItem>
            )
          })
        )}
      </ScrollView>
    </Section>
  )
}

export default News
