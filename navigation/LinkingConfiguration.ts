import * as Linking from "expo-linking"

export default {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      Root: {
        screens: {
          Home: {
            screens: {
              HomeScreen: "home",
            },
          },
          Game: {
            screens: {
              GameScreen: "game",
            },
          },
          User: {
            screens: {
              UserScreen: "user",
            },
          },
        },
      },
      NotFound: "*",
    },
  },
}
