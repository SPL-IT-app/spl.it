import React from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';
import {
    Button,
    Container,
    Content,
    List,
    Text,
    ListItem,
    Icon,
    Left,
    Body,
    Right,
    Thumbnail,
    Footer,
} from 'native-base';
import { setReceipt } from '../store';
import { connect } from 'react-redux';
import { makeRef } from '../server/firebaseconfig';
import { BackButton, MyHeader } from '../components';
import Swipeable from 'react-native-swipeable';
const dateFormat = require('dateformat');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#FF7E79',
    height: '100%',
  },
  receiptText: {
    fontWeight: '200',
    letterSpacing: 2,
  },
  receiptDateText: {
    fontWeight: '200',
    color: '#838383',
    letterSpacing: 2,
    paddingTop: 5,
    fontSize: 10,
  },
  deleteText: {
    paddingLeft: 15,
    color: 'white',
  },
  buttonText: {
    textAlign: 'center',
    letterSpacing: 2,
    color: 'white',
  },
  button: {
    marginTop: 10,
    width: '95%',
    alignSelf: 'center',
  },
  footer: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    paddingBottom: 15,
  },
  icon: {
    margin: 0,
    padding: 0,
  },
});

class SingleEvent extends React.Component {
    constructor() {
        super();
        this.state = {
            event: {},
            receipts: [],
            receiptIds: [],
        };
    }

    componentDidMount() {
        this.eventRef = makeRef(`/events/${this.props.event}`);
        this.receiptsRef = makeRef(`/events/${this.props.event}/receipts`);

        // ON EVENT CHANGE
        this.eventRef.once('value', snapshot => {
            this.setState({
                event: snapshot.val(),
            });
        });

        // ON EVENT RECEIPT ADDED
        this.receiptsRef.on('child_added', async snapshot => {
            await this.setState(prevState => ({
                receiptIds: [...prevState.receiptIds, snapshot.key],
                receipts: [...prevState.receipts, snapshot.val()],
            }));
        });

        // ON EVENT RECEIPT REMOVED
        this.receiptsRef.on('child_removed', snapshot => {
            const { receiptIds, receipts } = this.state
            const removeReceiptIdx = receiptIds.indexOf(snapshot.key);
            const newReceiptIds = receiptIds.slice();
            newReceiptIds.splice(removeReceiptIdx, 1);

            const newReceipts = receipts.slice();
            newReceipts.splice(removeReceiptIdx, 1);
            this.setState({
                receiptIds: newReceiptIds,
                receipts: newReceipts,
            });
        });
    }

    handleSelectReceipt = receiptId => {
        const receiptRef = `/events/${this.props.event}/receipts/${receiptId}`;
        this.props.navigation.navigate('Confirmed', {
            receiptRef: receiptRef,
        });
    };

    handleRemoveReceipt = (receiptId) => {
        const receiptRef = makeRef(`events/${this.props.event}/receipts/${receiptId}`)
        receiptRef.remove()
    }

    componentWillUnmount() {
        this.eventRef.off();
        this.receiptsRef.off();
    }

    render() {
        const { event, receipts, receiptIds } = this.state;
        if (!event.title) return <MyHeader title="Add Event" right={() => <BackButton />} />
        return (
            <Container styles={styles.container}>
                <MyHeader title={event.title} right={() => <BackButton />} />
                <Content>
                    <List>
                        {receipts.length > 0 ? (
                            receipts.map((receipt, idx) => {
                                const rightButtons = [
                                    <TouchableHighlight
                                        style={styles.deleteButton}
                                        key={parseInt(idx, 2)}
                                        onPress={() => {
                                            this.handleRemoveReceipt(receiptIds[idx]);
                                        }}
                                    >
                                        <Text style={styles.deleteText}>DELETE</Text>
                                    </TouchableHighlight>,
                                ];
                                return (
                                    <Swipeable key={parseInt(idx, 2)} rightButtons={rightButtons}>
                                        <ListItem
                                            thumbnail
                                            button
                                            onPress={() =>
                                                this.handleSelectReceipt(receiptIds[idx])
                                            }
                                        >
                                            <Left>
                                                <Thumbnail square source={{ uri: receipt.imageUrl }} />
                                            </Left>
                                            <Body>
                                                <Text style={styles.receiptText}>
                                                    {`Receipt ${idx + 1}`.toUpperCase()}
                                                </Text>
                                                <Text note numberOfLines={1}>
                                                    Its time to build a difference . .
                                                </Text>
                                            </Body>
                                            <Right>
                                                <Icon
                                                    type="MaterialCommunityIcons"
                                                    name="chevron-right"
                                                />
                                            </Right>
                                        </ListItem>
                                    </Swipeable>
                                );
                            })
                        ) : (
                                <Text>No Receipts</Text>
                            )}
                    </List>
                </Content>

                <Footer style={styles.footer}>
                    <Button
                        warning
                        block
                        style={styles.button}
                        onPress={() => this.props.navigation.navigate('Camera')}
                    >
                        <Icon
                            type="MaterialCommunityIcons"
                            name="camera"
                            style={styles.icon}
                        />
                        <Text style={styles.buttonText}> ADD RECEIPT </Text>
                    </Button>
                </Footer>

                <Footer style={styles.footer}>
                    <Button
                        success
                        disabled
                        block
                        style={styles.button}
                        onPress={() => {
                            this.props.navigation.navigate('Home');
                        }}
                    >
                        <Icon
                            type="MaterialCommunityIcons"
                            name="credit-card"
                            style={styles.icon}
                        />
                        <Text style={styles.buttonText}> CHECKOUT </Text>
                    </Button>
                </Footer>
            </Container>
        );
    }
}

const mapState = state => {
    return {
        event: state.event.eventId,
    };
};

export default connect(
    mapState,
    { setReceipt }
)(SingleEvent);
