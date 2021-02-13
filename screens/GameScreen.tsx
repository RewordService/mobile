import React, {useState, useEffect, ChangeEvent} from "react"
import {Text, H1, Button, Input} from "native-base"
import axios, {AxiosError} from "axios"
import Section from "../components/Section"
import {Grid, Col} from "react-native-easy-grid"
import {View} from "react-native"

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
  <>
    <Screen />
    <Description />
  </>
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
    <Text>
      1. ランダムな文字列が提示されます。その文字列を記憶しましょう。 例)
      リワード 2.
      記憶した文字列を、反対から読み返しましょう。(メモなどはしないでください)
      例) ドーワリ 3.
      提示された文字列を逆から読み返したものをAnswerの中に回答しましょう。 例)
      回答はドーワリ
    </Text>
  </Section>
)

const Screen = () => {
  const SUCESS = "Success!"
  const FAIL = "Fail..."
  const [screenState, setScreenState] = useState<
    "start" | "question" | "answer" | "end"
  >("start")
  const [gameInfo, setGameInfo] = useState({ranking: 0, score: 0})
  const [wordCount, setWordCount] = useState(2)
  const [screenString, setScreenString] = useState("PushStart")
  const [answerString, setAnswerString] = useState("")
  const [submitString, setSubmitString] = useState("")
  //const currentUser = useSelector(selectCurrentUser)
  const currentUser = null
  //const headers = useSelector(selectHeaders)
  const handleIncrement = () => setWordCount(wordCount + 1)
  const handleDecrement = () => setWordCount(wordCount - 1)
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSubmitString(e.target.value)
  const handleAnswer = (e: KeyboardEvent) => {
    //if (e.key === "Enter") {
    //let result
    //if (submitString === answerString) {
    //result = "success"
    //setScreenString(SUCESS)
    //} else {
    //result = "fail"
    //setScreenString(FAIL)
    //}
    //if (currentUser && headers) {
    //axios
    //.put("/user/reword", {count: wordCount, result}, headers)
    //.then(res => setGameInfo(res.data))
    //.catch((err: AxiosError) => err)
    //}
    //setScreenState("end")
    //}
  }
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
  //useEffect(() => {
  //if (!headers) return
  //axios
  //.get("/user/reword", headers)
  //.then(res => setGameInfo(res.data))
  //.catch((err: AxiosError) => err)
  //}, [headers])

  return (
    <>
      {currentUser?.id && <GameInfo gameInfo={gameInfo} />}
      <Section title="Reword">
        <View
          style={{
            height: 350,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <H1
            style={{
              color:
                // eslint-disable-next-line no-nested-ternary
                screenString === SUCESS
                  ? "primary"
                  : screenString === FAIL
                  ? "secondary"
                  : "initial",
            }}
          >
            {screenString}
          </H1>
        </View>
        {(screenState === "start" || screenState === "end") && (
          <View style={{textAlign: "center"}}>
            <Button disabled={wordCount >= 10} onPress={handleIncrement}>
              <Text>+</Text>
            </Button>
            <Button>
              <Text>{wordCount}</Text>
            </Button>
            <Button disabled={wordCount <= 2} onPress={handleDecrement}>
              <Text>-</Text>
            </Button>
            <Button onPress={handleQuestion}>
              <Text>START</Text>
            </Button>
          </View>
        )}
        {screenState === "answer" && (
          <Input
            placeholder="Answer"
            onChange={handleChange}
            onKeyDown={handleAnswer}
          />
        )}
      </Section>
    </>
  )
}

export default GameScreen
