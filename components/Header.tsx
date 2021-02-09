import React from "react"
import {
  Container,
  Header as NativeBaseHeader,
  Left,
  Body,
  Right,
  Button,
  Icon,
  Title,
} from "native-base"

const Header = () => {
  return (
    <Container>
      <NativeBaseHeader>
        <Left>
          <Button transparent>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>NativeBaseHeader</Title>
        </Body>
        <Right>
          <Button transparent>
            <Icon name="menu" />
          </Button>
        </Right>
      </NativeBaseHeader>
    </Container>
  )
}

export default Header
