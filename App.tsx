import axios from "axios"
import {StatusBar} from "expo-status-bar"
import React from "react"
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
  const isLoadingComplete = useCachedResources()
  const colorScheme = useColorScheme()

  if (!isLoadingComplete) {
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
