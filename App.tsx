import React, {useEffect, useState} from "react"
import {Provider} from "react-redux"
import {PersistGate} from "redux-persist/integration/react"
import * as Font from "expo-font"
import {StatusBar} from "expo-status-bar"
import {SafeAreaProvider} from "react-native-safe-area-context"
import axios from "axios"
import {store, persistor} from "./store"
import useCachedResources from "./hooks/useCachedResources"
import useColorScheme from "./hooks/useColorScheme"
import Navigation from "./navigation"

switch (process.env.NODE_ENV) {
  case "development":
    //axios.defaults.baseURL = "http://localhost:3000/api"
    axios.defaults.baseURL = "https://reword-web.herokuapp.com/api"
    break
  case "production":
    axios.defaults.baseURL = "https://reword-web.herokuapp.com/api"
    break
  default:
    axios.defaults.baseURL = "http://localhost:3000/api"
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
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    )
  }
}
