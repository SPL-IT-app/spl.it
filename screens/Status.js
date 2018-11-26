import React, { Component } from 'react'
import { Container, Content, Text } from 'native-base';
import { MyHeader, BackButton } from '../components';
import { makeRef } from '../server/firebaseconfig'
import { connect } from 'react-redux'

class Status extends Component {
    constructor(){
        super()
        this.state = {
            receipts: [],
            members: [],
            event: {}
        }
    }

    componentDidMount(){
        this.eventRef = makeRef(`events/${this.props.navigation.getParam('eventId')}`)
        this.eventRef.on('value', snapshot => {
            this.setState({event: snapshot.val()})
        })
    }

    componentWillUnmount(){
        this.eventRef.off()
    }

    render() {
        console.log(this.state)

        const moneyToSend = {}
        const moneyToReceive = {}

        for(let key in this.state.event.receipts){
            let receipt = this.state.event.receipts[key]
            const creator = receipt.creator
            const lineItems = Object.values(receipt).filter(value => typeof value === 'object')
            for(let i = 0; i < lineItems.length; i++){
                if (lineItems[i].users && lineItems[i].users.hasOwnProperty(this.props.id)){
                    const countUsers = Object.keys(lineItems[i].users).length
                    if(moneyToSend.hasOwnProperty(creator)){
                        moneyToSend[creator] += lineItems[i].price/countUsers*(1 + receipt.tipPercent/100)*(1.1025)
                    } else {
                        moneyToSend[creator] = lineItems[i].price/countUsers*(1 + receipt.tipPercent/100)*(1.1025)
                    }
                }
            }

        }
        console.log('moneyToSend', moneyToSend)

        return (
            <Container>
                <MyHeader title='Status' right={()=><BackButton />} />
                <Content>
                    <Text>This is Status Page</Text>
                    <Text>{this.props.navigation.getParam('eventId')}</Text>
                </Content>
            </Container>
        )
    }
}

const mapState = state => ({
    id: state.user.currentUser.id
})

export default connect(mapState)(Status)
