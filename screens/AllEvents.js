import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Button, Icon, Container, Content, List, ListItem, View, Fab } from 'native-base';
import { setReceipt, setEvent } from '../store'
import { connect } from 'react-redux';
import { makeRef } from "../server/firebaseconfig";

const styles = StyleSheet.create({
    listItemTitle: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    eventButton: {
        marginTop: 20,
        display: 'flex',
        justifyContent: 'space-between',
        width: '99%'
    },
})

class AllEvents extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            events: []
        }
    }

    componentDidMount() {
        this.refs = []

        Object.keys(this.props.events).forEach(id => {
            const eventsRef = makeRef(`/events/${id}`)
            const { events } = this.state

            this.refs.push(eventsRef)
            eventsRef.on('value', snapshot => {
                this.setState({
                    events: [...events, snapshot.val()]
                })
            })
        })
    }

    componentWillUnmount() {
        this.refs.forEach(ref => {
            ref.off()
        })
    }

    handleEventAdd = () => {

    }

    handleEventView = () => {

    }

    render() {
        const { events } = this.state
        if (events.length === 0) return <Container />
        console.log(events, 'she\'s events')

        return (
            <Container >
                <List>
                    <ListItem style={styles.listItemTitle}>
                        <Text>Event Name</Text><Text />
                    </ListItem>
                    {
                        events.map((event, idx) => {
                            return (
                                <Button block style={styles.eventButton} key={parseInt(idx, 2)}>
                                    <Text>{event.title}</Text><Icon type="MaterialCommunityIcons" name="arrow-right" />
                                </Button>
                            )
                        })
                    }
                </List>
                <Container >
                    <Fab
                        position='bottomRight'
                    >
                        <Icon type="MaterialCommunityIcons" name="plus" />
                    </Fab>
                </Container>
            </Container>
        )
    }
}

export default connect(null, { setEvent })(AllEvents)
