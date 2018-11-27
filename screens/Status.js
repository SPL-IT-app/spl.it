import React, { Component } from "react";
import {
  Container,
  Content,
  Text,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail
} from "native-base";
import { MyHeader, BackButton, CameraProcessing } from "../components";
import { makeRef } from "../server/firebaseconfig";
import { connect } from "react-redux";

class Status extends Component {
  constructor() {
    super();
    this.state = {
      members: {},
      event: {},
      memberCount: Infinity
    };
  }

  componentDidMount() {
    this.eventRef = makeRef(
      `events/${this.props.navigation.getParam("eventId")}`
    );
    this.eventRef.on("value", snapshot => {
      this.setState({ event: snapshot.val() });
    });
    this.membersRef = makeRef(
      `events/${this.props.navigation.getParam("eventId")}/members`
    );
    this.membersRef.once("value", snapshot => {
      this.setState({ memberCount: Object.keys(snapshot.val()).length });
    });
    this.membersRef.on("child_added", snapshot => {
      makeRef(`profiles/${snapshot.key}`).once("value", snapshot => {
        this.setState({
          members: { ...this.state.members, [snapshot.key]: snapshot.val() }
        });
      });
    });
    this.membersRef.on("child_removed", snapshot => {
      makeRef(`profiles/${snapshot.key}`).once("value", snapshot => {
        let newMembers = { ...this.state.members };
        delete newMembers[snapshot.key];
        this.setState({ members: newMembers });
      });
    });
  }

  componentWillUnmount() {
    this.eventRef.off();
    this.membersRef.off();
  }

  render() {

    const moneyToSendOrReceive = { unassigned: 0 };

    const calculatePrice = (price, count, tipPercent = 15) => {
      return (price / count) * (1 + tipPercent / 100 + 0.1025);
    };

    for (let key in this.state.event.receipts) {
      let receipt = this.state.event.receipts[key];
      const creator = receipt.creator;
      const lineItems = Object.values(receipt).filter(
        value => typeof value === "object"
      );
      const isCreator = creator === this.props.id;
      for (let i = 0; i < lineItems.length; i++) {
        if (
          !isCreator &&
          lineItems[i].users &&
          lineItems[i].users.hasOwnProperty(this.props.id)
        ) {
          const countUsers = Object.keys(lineItems[i].users).length;
          if (moneyToSendOrReceive.hasOwnProperty(creator)) {
            moneyToSendOrReceive[creator] += calculatePrice(
              lineItems[i].price,
              countUsers,
              receipt.tipPercent
            );
          } else {
            moneyToSendOrReceive[creator] = calculatePrice(
              lineItems[i].price,
              countUsers,
              receipt.tipPercent
            );
          }
        }

        if (isCreator) {
          if (lineItems[i].users) {
            const countUsers = Object.keys(lineItems[i].users).length;
            for (let userKey in lineItems[i].users) {
              if (userKey === this.props.id) continue;
              if (moneyToSendOrReceive.hasOwnProperty(userKey)) {
                moneyToSendOrReceive[userKey] -= calculatePrice(
                  lineItems[i].price,
                  countUsers,
                  receipt.tipPercent
                );
              } else {
                moneyToSendOrReceive[userKey] =
                  -1 *
                  calculatePrice(
                    lineItems[i].price,
                    countUsers,
                    receipt.tipPercent
                  );
              }
            }
          } else {
            moneyToSendOrReceive.unassigned += calculatePrice(
              lineItems[i].price,
              1,
              receipt.tipPercent
            );
          }
        }
      }
    }

    if (Object.keys(this.state.members).length < this.state.memberCount) {
      return <CameraProcessing />;
    }
    const members = this.state.members;

    return (
      <Container>
        <MyHeader title="Status" right={() => <BackButton />} />
        <Content>
          <List>
            {Object.entries(moneyToSendOrReceive).map(entry => {
              if (entry[0] === "unassigned") {
                if(!entry[1]) return
                return (
                  <ListItem>
                    <Left>
                      <Text>Unassigned Amount:</Text>
                    </Left>
                    <Body />
                    <Right>
                      <Text style={{ color: "red" }}>$ {entry[1]}</Text>
                    </Right>
                  </ListItem>
                );
              } else {
                return (
                  <ListItem>
                    <Left>
                      <Thumbnail
                        source={{ uri: members[entry[0]].imageUrl }}
                        style={{
                          borderWidth: 4,
                          borderColor: members[entry[0]].color
                            ? members[entry[0]].color
                            : randomColor({
                                luminosity: "light",
                                hue: "random"
                              }).toString()
                        }}
                      />
                    </Left>
                    <Body>
                      <Text>{members[entry[0]].username}</Text>
                    </Body>
                    <Right>
                      <Text
                        style={{ color: entry[1] > 0 ? "orange" : "green" }}
                      >
                        $ {entry[1]}
                      </Text>
                    </Right>
                  </ListItem>
                );
              }
            })}
            {false && Object.entries(moneyToReceive).map(entry => {
              if (entry[0] === "unassigned") {
                return (
                  <ListItem>
                    <Left>
                      <Text>Unassigned Amount:</Text>
                    </Left>
                    <Body />
                    <Right>
                      <Text style={{ color: "red" }}>$ {entry[1]}</Text>
                    </Right>
                  </ListItem>
                );
              }

              return (
                <ListItem>
                  <Left>
                    <Thumbnail
                      source={{ uri: members[entry[0]].imageUrl }}
                      style={{
                        borderWidth: 4,
                        borderColor: members[entry[0]].color
                          ? members[entry[0]].color
                          : randomColor({
                              luminosity: "light",
                              hue: "random"
                            }).toString()
                      }}
                    />
                  </Left>
                  <Body>
                    <Text>{members[entry[0]].username}</Text>
                  </Body>
                  <Right>
                    <Text style={{ color: "green" }}>$ {entry[1]}</Text>
                  </Right>
                </ListItem>
              );
            })}
          </List>
        </Content>
      </Container>
    );
  }
}

const mapState = state => ({
  id: state.user.currentUser.id
});

export default connect(mapState)(Status);
