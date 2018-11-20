import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Button, Icon, Container, Content, List, ListItem, View, Fab } from 'native-base';
import { setEvent } from '../store'
import { connect } from 'react-redux';
import { makeRef } from "../server/firebaseconfig"
import { withNavigation } from "react-navigation";

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
        const { events } = this.props
        this.refs = []
        this.eventId = []

        Object.keys(events).forEach(id => {
            const eventsRef = makeRef(`/events/${id}`)
            const { events } = this.state

            this.refs.push(eventsRef)
            this.eventId.push(id)
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

    handleEventClick = async (id) => {
        const { navigation } = this.props

        await setEvent(id)
        navigation.navigate('SingleEvent', {
            id
        })
    }

    handleEventAdd = async () => {
        const { navigation } = this.props

        await setEvent('')
        navigation.navigate('Camera')
    }


    render() {
        const { events } = this.state
        if (events.length === 0) return <Container />

        return (
            <Container >
                <List>
                    <ListItem style={styles.listItemTitle}>
                        <Text>Event Name</Text><Text>View</Text>
                    </ListItem>
                    {
                        events.map((event, idx) => {
                            return (
                                <Button
                                    block
                                    style={styles.eventButton}
                                    key={parseInt(idx, 2)}
                                    onPress={() => this.handleEventClick(this.eventId[idx])}
                                >
                                    <Text>{event.title.toUpperCase()}</Text><Icon type="MaterialCommunityIcons" name="arrow-right" />
                                </Button>
                            )
                        })
                    }
                </List>
                <Container >
                    <Fab
                        position='bottomRight'
                        onPress={() => this.handleEventAdd()}
                    >
                        <Icon type="MaterialCommunityIcons" name="plus" />
                    </Fab>
                </Container>
            </Container>
        )
    }
}

export default withNavigation(connect(null, { setEvent })(AllEvents))
