import {useNavigation} from "@react-navigation/native"
import axios from "axios"
import {format} from "date-fns"
import {
  Text,
  Body,
  Button,
  CardItem,
  Col,
  H2,
  H3,
  View,
  Spinner,
} from "native-base"
import React from "react"
import {useEffect} from "react"
import {useState} from "react"
import {Dimensions, ScrollView} from "react-native"
import {BarChart} from "react-native-chart-kit"
import {Grid} from "react-native-easy-grid"
import {useSelector} from "react-redux"
import Section from "../components/Section"
import {IUser} from "../interfaces"
import {selectCurrentUser} from "../slices/currentUser"

const calcPercent = (success: number, total: number) => {
  const result = Math.round((success / total) * 100)
  if (Number.isNaN(result)) return 0
  if (result > 100) return 100
  return result
}

interface IRechartData {
  labels: string[]
  successData: number[]
  totalData: number[]
  percentData: number[]
}
const UserScreen = () => {
  const height = 300
  const width = Dimensions.get("window").width
  const chartConfig = {
    backgroundGradientFrom: "#757ce8",
    backgroundGradientTo: "#79bac1",
    backgroundGradientFromOpacity: 0.5,
    strokeWidth: 2,
    barPercentage: 0.6,
    color: () => `white`,
    style: {
      borderRadius: 13,
    },
  }
  const graphStyle = {
    marginVertical: 8,
    ...chartConfig.style,
  }
  const [loading, setLoading] = useState(true)
  const [rewords, setRewords] = useState<IRechartData>({
    labels: [],
    successData: [],
    totalData: [],
    percentData: [],
  })
  const [user, setUser] = useState<IUser>({
    email: "",
    id: 0,
    image: {url: ""},
    name: "",
    nickname: "",
    created_at: "",
    birthday: "",
    gender: 0,
    introduction: "",
  })
  const currentUser = useSelector(selectCurrentUser)

  useEffect(() => {
    axios
      .get<IUser>(`/users/${currentUser?.id}`)
      .then(res => {
        if (!res.data.reword) return
        const resRewords = Object.entries(res.data.reword)
        const totalData = []
        const successData = []
        const percentData = []
        const labels = []
        for (let i = 0; i < resRewords.length; i += 1) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const [count, {total, success}]: [
            string,
            {total: number; success: number}
          ] = resRewords[i]
          if (!Number(count)) break
          labels.push(String(i + 2))
          totalData.push(total)
          successData.push(success)
          percentData.push(calcPercent(total, success))
        }
        setUser(res.data)
        setRewords({totalData, successData, percentData, labels})
        setLoading(false)
      })
      .catch(err => err)
  }, [])
  return (
    <>
      {!currentUser ? <SignScreen /> : null}
      <ScrollView>
        <Section title="プロフィール">
          <CardItem>
            <Body>
              {loading ? (
                <View style={{width: "100%"}}>
                  <Spinner />
                </View>
              ) : (
                <Grid>
                  <Col>
                    <View
                      style={{
                        paddingTop: 20,
                        borderRightWidth: 1,
                        borderRightColor: "#999999",
                      }}
                    >
                      <Text style={{textAlign: "center"}}>ユーザー名</Text>
                      <H3 style={{textAlign: "center"}}>{user.name}</H3>
                    </View>
                  </Col>
                  <Col>
                    <View
                      style={{
                        paddingTop: 20,
                        borderRightWidth: 1,
                        borderRightColor: "#999999",
                      }}
                    >
                      <Text style={{textAlign: "center"}}>Reword開始日</Text>
                      <H3 style={{textAlign: "center"}}>
                        {user.created_at
                          ? format(Date.parse(user.created_at), "yyyy/MM/dd")
                          : ""}
                      </H3>
                    </View>
                  </Col>
                  <Col>
                    <View
                      style={{
                        paddingTop: 20,
                      }}
                    >
                      <Text style={{textAlign: "center"}}>トータルスコア</Text>
                      <H3 style={{textAlign: "center"}}>
                        {user.reword?.total}
                      </H3>
                    </View>
                  </Col>
                </Grid>
              )}
            </Body>
          </CardItem>
        </Section>
        <H2 style={{marginTop: 10, textAlign: "center"}}>試行回数</H2>
        <BarChart
          data={{
            labels: rewords.labels,
            datasets: [{data: rewords.totalData}],
          }}
          height={height}
          width={width}
          chartConfig={chartConfig}
          style={graphStyle}
        />
        <H2 style={{textAlign: "center"}}>正答数</H2>
        <BarChart
          data={{
            labels: rewords.labels,
            datasets: [{data: rewords.successData}],
          }}
          width={width}
          height={height}
          chartConfig={chartConfig}
          style={graphStyle}
        />
        <H2 style={{textAlign: "center"}}>正答率</H2>
        <BarChart
          data={{
            labels: rewords.labels,
            datasets: [{data: rewords.percentData}],
          }}
          height={height}
          width={width}
          chartConfig={chartConfig}
          style={graphStyle}
        />
      </ScrollView>
    </>
  )
}
const SignScreen = () => {
  const navigation = useNavigation()
  const handleSignIn = () => navigation.navigate("SignIn")
  const handleSignUp = () => navigation.navigate("SignUp")
  return (
    <View
      style={{
        position: "absolute",
        zIndex: 1,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(255,255,255,0.7)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 300,
          paddingHorizontal: 20,
          paddingVertical: 30,
          backgroundColor: "white",
          borderRadius: 15,
        }}
      >
        <H2 style={{textAlign: "center"}}>ログイン</H2>
        <Text>ログインを行うことで、ゲームの記録を行うことができます。</Text>
        <View style={{marginVertical: 10}}>
          <Button block onPress={handleSignIn}>
            <Text>SignIn</Text>
          </Button>
        </View>
        <Button block onPress={handleSignUp}>
          <Text>SignUp </Text>
        </Button>
      </View>
    </View>
  )
}

export default UserScreen
