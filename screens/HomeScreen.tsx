import React, {useEffect, useState} from "react"
import {Linking, View} from "react-native"
import axios, {AxiosError} from "axios"
import {Col, Grid} from "react-native-easy-grid"
import {Content, Text, H1, Button} from "native-base"
import Section from "../components/Section"
import UserLists from "../components/UserLists"

const HomeScreen = () => {
  return (
    <Content>
      <RewordInfo />
    </Content>
  )
}

const RewordInfo = () => {
  const [score, setScore] = useState({total_score: 0, success_rate: 0})
  const [latestUsers, setLatestUsers] = useState([])
  const [rankedUsers, setRankedUsers] = useState([])
  const handlePressTwitter = () => {
    const appURL = "twitter://user?screen_name=re_reword"
    const httpURL = "https://twitter.com/re_reword"
    Linking.canOpenURL(appURL).then(supported =>
      Linking.openURL(supported ? appURL : httpURL)
    )
  }

  useEffect(() => {
    axios
      .get("/reword/info")
      .then(res => setScore(res.data))
      .catch((err: AxiosError) => err)
    axios.get("/users/latest").then(res => setLatestUsers(res.data))
    axios.get("/users/ranked").then(res => setRankedUsers(res.data))
  }, [])

  return (
    <>
      <Section title="Reword">
        <Grid>
          <Col>
            <View
              style={{
                paddingTop: 20,
                borderRightWidth: 1,
                borderRightColor: "#999999",
              }}
            >
              <Text style={{textAlign: "center"}}>総合Reword数</Text>
              <H1 style={{textAlign: "center"}}>{score.total_score}</H1>
            </View>
          </Col>
          <Col>
            <View
              style={{
                paddingTop: 20,
              }}
            >
              <Text style={{textAlign: "center"}}>総合正答率</Text>
              <H1 style={{textAlign: "center"}}>{score.success_rate}%</H1>
            </View>
          </Col>
        </Grid>
      </Section>
      <View style={{marginBottom: 5}}>
        <Button block light>
          <Text>Play Game</Text>
        </Button>
      </View>
      <View style={{marginBottom: 5}}>
        <Button block info onPress={handlePressTwitter}>
          <Text>Twitter</Text>
        </Button>
      </View>
      <UserLists title="ランキング" users={rankedUsers} />
      <UserLists title="新規ユーザー" users={latestUsers} />
    </>
  )
}

export default HomeScreen
