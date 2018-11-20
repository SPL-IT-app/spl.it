import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Icon, Container, Content, List, Text, ListItem, View, Fab } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { setReceipt, setEvent } from '../store'
import { connect } from 'react-redux'
import { makeRef } from "../server/firebaseconfig"


const styles = StyleSheet.create({
})

class SingleEvent extends React.Component {
    constructor() {
        super()
        this.state = {
            event: {}
        }
    }

    componentDidMount() {
        const { navigation } = this.props
        const { event } = this.state

        this.eventRef = makeRef(`/events/${navigation.getParam('id')}`)
        this.eventRef.on('value', snapshot => {
            this.setState({
                event: snapshot.val()
            })
        })

    }

    componentWillUnmount() {
        this.eventRef.ref.off()
    }

    render() {
        const { event } = this.state
        console.log(Object.entries(event), '<-----ENTRIES')
        if (!event.title) return <Container />

        return (
            <Container>
                <Grid>
                    <Row>
                        <ListItem >
                            <Text>{event.title}</Text>
                        </ListItem>
                    </Row>
                    <Row>

                    </Row>
                </Grid>
            </Container>
        )
    }
}

export default connect(null, { setReceipt })(SingleEvent)
