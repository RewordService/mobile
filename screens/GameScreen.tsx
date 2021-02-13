import React, {useState, useEffect} from "react"
import {ScrollView} from "react-native-gesture-handler"
import {
  View,
  NativeSyntheticEvent,
  TextInputEndEditingEventData,
} from "react-native"
import {useSelector} from "react-redux"
import {AntDesign} from "@expo/vector-icons"
import {Text, H1, Button, Form, Item, Input, CardItem, Body} from "native-base"
import {Grid, Col} from "react-native-easy-grid"
import axios, {AxiosError} from "axios"
import Section from "../components/Section"
import {selectCurrentUser, selectHeaders} from "../slices/currentUser"

const randomJPString = (wordCount: number) => {
  const JP =
    "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよわをん"
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return [...Array(wordCount)].map(
    () => JP[Math.floor(Math.random() * JP.length)]
  )
}

const wait = (sec: number) =>
  new Promise(resolve => {
    setTimeout(resolve, sec * 1000)
  })

const GameScreen: React.FC = () => (
  <ScrollView>
    <Screen />
    <Description />
  </ScrollView>
)
interface IGameInfo {
  gameInfo: {
    ranking: number
    score: number
  }
}
const GameInfo: React.FC<IGameInfo> = ({
  gameInfo: {ranking, score},
}: IGameInfo) => (
  <Section title="ゲーム情報">
    <Grid>
      <Col>
        <View
          style={{
            paddingTop: 20,
            borderRightWidth: 1,
            borderRightColor: "#999999",
          }}
        >
          <Text>順位</Text>
          <H1>{ranking}</H1>
        </View>
      </Col>
      <Col>
        <View
          style={{
            paddingTop: 20,
          }}
        >
          <Text>スコア</Text>
          <H1>{score}</H1>
        </View>
      </Col>
    </Grid>
  </Section>
)
const Description = () => (
  <Section title="遊び方">
    <CardItem>
      <Body>
        <Text>
          {`1. ランダムな文字列が提示されます。その文字列を記憶しましょう。
例)リワード
2. 記憶した文字列を、反対から読み返しましょう。
例) ドーワリ 
3. 提示された文字列を逆から読み返したものをAnswerの中に回答しましょう。
例) 回答はドーワリ`}
        </Text>
      </Body>
    </CardItem>
  </Section>
)

const Screen = () => {
  const SUCCESS = "Success!"
  const FAIL = "Fail..."
  const [screenState, setScreenState] = useState<
    "start" | "question" | "answer" | "end"
  >("start")
  const [gameInfo, setGameInfo] = useState({ranking: 0, score: 0})
  const [wordCount, setWordCount] = useState(2)
  const [screenString, setScreenString] = useState("PushStart")
  const [answerString, setAnswerString] = useState("")
  const currentUser = useSelector(selectCurrentUser)
  const headers = useSelector(selectHeaders)
  const handleIncrement = () => setWordCount(wordCount + 1)
  const handleDecrement = () => setWordCount(wordCount - 1)
  const handleQuestion = async () => {
    setScreenState("question")
    const JPString = randomJPString(wordCount)
    for (let i = 0; i < JPString.length; i += 1) {
      setScreenString(JPString[i])
      // eslint-disable-next-line no-await-in-loop
      await wait(0.8)
    }
    setScreenString("")
    setAnswerString(JPString.reverse().join(""))
    setScreenState("answer")
  }
  const handleAnswer = (
    e: NativeSyntheticEvent<TextInputEndEditingEventData>
  ) => {
    let result
    if (e.nativeEvent.text === answerString) {
      result = "success"
      setScreenString(SUCCESS)
    } else {
      result = "fail"
      setScreenString(FAIL)
    }
    if (currentUser && headers) {
      axios
        .put("/user/reword", {count: wordCount, result}, headers)
        .then(res => setGameInfo(res.data))
        .catch((err: AxiosError) => err)
    }
    setScreenState("end")
  }
  useEffect(() => {
    if (!headers) return
    axios
      .get("/user/reword", headers)
      .then(res => setGameInfo(res.data))
      .catch((err: AxiosError) => err)
  }, [headers])

  return (
    <>
      {currentUser?.id && <GameInfo gameInfo={gameInfo} />}
      <View style={{height: 300, alignItems: "center"}}>
        <H1
          style={{
            color:
              // eslint-disable-next-line no-nested-ternary
              screenString === SUCCESS
                ? "blue"
                : screenString === FAIL
                ? "red"
                : "black",
          }}
        >
          {screenString}
        </H1>
      </View>
      {(screenState === "start" || screenState === "end") && (
        <>
          <H1 style={{textAlign: "center"}}>{wordCount}</H1>
          <View style={{marginBottom: 5}}>
            <Button block disabled={wordCount >= 10} onPress={handleIncrement}>
              <AntDesign name="plus" size={24} color="white" />
            </Button>
          </View>
          <View style={{marginBottom: 10}}>
            <Button block disabled={wordCount <= 2} onPress={handleDecrement}>
              <AntDesign name="minus" size={24} color="white" />
            </Button>
          </View>
          <Button block onPress={handleQuestion}>
            <Text>START</Text>
          </Button>
        </>
      )}
      {screenState === "answer" && (
        <Item>
          <Input placeholder="Answer" onEndEditing={handleAnswer} />
        </Item>
      )}
    </>
  )
}

export default GameScreen
