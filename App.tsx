import axios from "axios"
import * as Font from "expo-font"
import {StatusBar} from "expo-status-bar"
import React, {useEffect, useState} from "react"
import {SafeAreaProvider} from "react-native-safe-area-context"

import useCachedResources from "./hooks/useCachedResources"
import useColorScheme from "./hooks/useColorScheme"
import Navigation from "./navigation"

switch (process.env.NODE_ENV) {
  case "development":
    //axios.defaults.baseURL = "http://localhost:3000"
    axios.defaults.baseURL = "https://reword-back.herokuapp.com/"
    break
  case "production":
    axios.defaults.baseURL = "https://reword-back.herokuapp.com/"
    break
  default:
    axios.defaults.baseURL = "http://localhost:3000"
}
export default function App() {
  const [loadingFont, setLoadingFont] = useState(true)
  const isLoadingComplete = useCachedResources()
  const colorScheme = useColorScheme()
  useEffect(() => {
    ;(async () => {
      await Font.loadAsync({
        Roboto: require("./node_modules/native-base/Fonts/Roboto.ttf"),
        Roboto_medium: require("./node_modules/native-base/Fonts/Roboto_medium.ttf"),
      })
      setLoadingFont(false)
    })()
  }, [])
  if (!isLoadingComplete || loadingFont) {
    return null
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    )
  }
}
