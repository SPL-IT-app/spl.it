import React from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';
import { Button, Icon, Container, Content, List, ListItem, View, Fab } from 'native-base';
import { setEvent } from '../store'
import { connect } from 'react-redux';
import { makeRef } from "../server/firebaseconfig"
import { withNavigation } from "react-navigation";
import { user } from "../store/index";

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
    fab: {
        color: 'blue',
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
        const { user } = this.props
        this.eventIds = []

        this.userEventsRef = makeRef(`/users/${user.id}/events`)

        this.userEventsRef.on('child_added', snapshot => {
            const eventsRef = makeRef(`/events/${snapshot.key}`)
            eventsRef.once('value', eventSnapshot => {
                this.setState(prevState => ({
                    events: [...prevState.events, eventSnapshot.val()]
                }))
                this.eventIds.push(eventSnapshot.key)
            })
        })
    }

    componentWillUnmount() {
        this.userEventsRef.off()
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
                </List>
                <ScrollView>
                    <List>
                        {
                            events.map((event, idx) => {
                                return event.status ?
                                    (
                                        <Button
                                            block
                                            style={styles.eventButton}
                                            key={this.eventIds[idx]}
                                            onPress={() => this.handleEventClick(this.eventIds[idx])}
                                        >
                                            <Text>{event.title === '' ? `Event ${idx + 1} idx: ${this.eventIds[idx]}` : event.title.toUpperCase()}</Text><Icon type="MaterialCommunityIcons" name="arrow-right" />
                                        </Button>
                                    ) : <Text />
                            })
                        }
                    </List>
                </ScrollView>
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


const mapState = state => {
    return { user: state.user.currentUser }
}

export default withNavigation(connect(mapState, { setEvent })(AllEvents))
