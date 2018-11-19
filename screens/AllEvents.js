import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Button, Icon, Container, Content, List, ListItem, } from 'native-base';
import { setReceipt, setEvent } from '../store'
import { connect } from 'react-redux';
import { makeRef } from "../server/firebaseconfig";

const styles = StyleSheet.create({
    eventName: {

    },
    addEvent: {

    },
    listItemTitle: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    eventButton: {
        display: 'flex',
        flexGrow: 1,
    }
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
            this.refs.push(eventsRef)
            eventsRef.on('value', snapshot => {
                this.setState({
                    events: [...this.state.events, snapshot.val()]
                })
            })
        })
    }

    componentWillUnmount() {
        this.refs.forEach(ref => {
            ref.off()
        })
    }
    render() {
        const { events } = this.state
        if (events.length === 0) return <Container />

        return (
            <Container>
                <List>
                    <ListItem>
                        <Text>Event Name <Text>+</Text></Text>
                    </ListItem>
                    {
                        events.map((event, idx) => {
                            return (
                                <Button style={styles.eventButton} key={parseInt(idx, 2)}>
                                    <Text>{event.title}</Text>
                                </Button>

                            )
                        })
                    }


                </List>
            </Container>
        )
    }
}

export default connect(null, { setEvent })(AllEvents)
