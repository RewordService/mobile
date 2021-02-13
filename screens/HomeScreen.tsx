import React, {useEffect, useState} from "react"
import {Linking, View} from "react-native"
import axios from "axios"
import {Col, Grid} from "react-native-easy-grid"
import {Content, Text, H1, Button, CardItem, Body, H3} from "native-base"
import {useNavigation} from "@react-navigation/native"
import Section from "../components/Section"
import UserLists from "../components/Home/UserLists"
import News from "../components/Home/News"

const HomeScreen = () => {
  const [latestUsers, setLatestUsers] = useState([])
  const [rankedUsers, setRankedUsers] = useState([])
  const [lodaingLatestUsers, setLoadingLatestUsers] = useState(true)
  const [lodaingRankedtUsers, setLoadingRankedUsers] = useState(true)
  useEffect(() => {
    axios
      .get("/users/latest")
      .then(res => {
        setLoadingLatestUsers(false)
        setLatestUsers(res.data.slice(0, 10))
      })
      .catch(err => err)
    axios
      .get("/users/ranked")
      .then(res => {
        setLoadingRankedUsers(false)
        setRankedUsers(res.data.slice(0, 10))
      })
      .catch(err => err)
  }, [])
  return (
    <Content>
      <RewordInfo />
      <ButtonGroup />
      <News />
      <UserLists
        loading={lodaingRankedtUsers}
        title="ランキング"
        users={rankedUsers}
      />
      <UserLists
        loading={lodaingLatestUsers}
        title="新規ユーザー"
        users={latestUsers}
      />
    </Content>
  )
}
const ButtonGroup = () => {
  const navigation = useNavigation()
  const handlePress = () => navigation.navigate("Game")
  const handlePressTwitter = () => {
    const appURL = "twitter://user?screen_name=re_reword"
    const httpURL = "https://twitter.com/re_reword"
    Linking.canOpenURL(appURL).then(supported =>
      Linking.openURL(supported ? appURL : httpURL)
    )
  }
  return (
    <>
      <View style={{marginBottom: 5}}>
        <Button block onPress={handlePress}>
          <Text>Play Game</Text>
        </Button>
      </View>
      <Button block info onPress={handlePressTwitter}>
        <Text>Twitter</Text>
      </Button>
    </>
  )
}

const RewordInfo = () => {
  const [score, setScore] = useState({total_score: 0, success_rate: 0})

  useEffect(() => {
    axios
      .get("/reword/info")
      .then(res => {
        setScore(res.data)
      })
      .catch(err => console.log(err))
  }, [])

  return (
    <>
      <Section title="Reword">
        <CardItem>
          <Body>
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
          </Body>
        </CardItem>
      </Section>
    </>
  )
}

export default HomeScreen
