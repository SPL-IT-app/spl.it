import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Button, Icon, Container, Content, List, Text, ListItem, Card, CardItem } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { setReceipt } from '../store'
import { connect } from 'react-redux'
import { makeRef } from "../server/firebaseconfig"
import Header from "../components/Header";


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    eventTitle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 'auto',
    }
})

class SingleEvent extends React.Component {
    constructor() {
        super()
        this.state = {
            event: {},
            receipts: [],
            receiptIds: []
        }
    }

    componentDidMount() {
        const { navigation } = this.props
        const { event, receipts, receiptIds } = this.state

        this.eventRef = makeRef(`/events/${navigation.getParam('id')}`)
        this.receiptsRef = makeRef(`/events/${navigation.getParam('id')}/receipts`)

        this.receiptsRef.on('value', snapshot => {
            this.setState({
                receiptIds: [...receiptIds, Object.keys(snapshot.val())],
                receipts: [...receipts, ...Object.values(snapshot.val())]
            })
        })

        this.eventRef.on('value', snapshot => {
            this.setState({
                event: snapshot.val(),
            })
        })
    }

    componentWillUnmount() {
        this.eventRef.off()
        this.receiptsRef.off()
    }

    render() {
        const { event, receipts, receiptIds } = this.state
        if (!event.title) return <Container />
        console.log(receipts.length, 'she')
        console.log(receipts, 'her')

        return (
            <Container styles={styles.container}>
                <Header />
                <List>
                    <ListItem style={styles.eventTitle}>
                        <TouchableOpacity>
                            <Icon
                                type="MaterialCommunityIcons"
                                name="arrow-left"
                                onPress={() => this.props.navigation.goBack()}
                            />
                        </TouchableOpacity>
                        <Text>{event.title.toUpperCase()}</Text>
                        <Text />
                    </ListItem>
                </List>

                {receipts.length && receipts.map((receipt, idx) => {
                    console.log(CardItem, 'TEST')
                    return (
                        <Content key={parseInt(idx, 2)}>
                            <Card>
                                <CardItem>
                                    <Image source={{ uri: receipt.imageUrl }} style={{ height: 100, width: null, flex: 1 }} />
                                </CardItem>
                                <CardItem>
                                    <Text>Receipt</Text>
                                </CardItem>
                            </Card>
                        </Content>
                    )
                })
                }

                <Button
                    block
                    onPress={() => this.props.navigation.navigate('Camera')}
                >
                    <Text>Add Receipt</Text>
                </Button>
                <Button
                    block
                    disabled={true}
                >
                    <Text>Checkout Event</Text>
                </Button>
            </Container>
        )
    }
}

export default connect(null, { setReceipt })(SingleEvent)
