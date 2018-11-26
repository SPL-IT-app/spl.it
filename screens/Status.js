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
        const moneyToReceive = {unassigned: 0}

        const calculatePrice = (price, count, tipPercent = 15) => {
            return (price/count)*(1 + tipPercent/100 + 0.1025)
        }

        for(let key in this.state.event.receipts){
            let receipt = this.state.event.receipts[key]
            const creator = receipt.creator
            const lineItems = Object.values(receipt).filter(value => typeof value === 'object')
            const isCreator = creator === this.props.id
            for(let i = 0; i < lineItems.length; i++){
                if (!isCreator && lineItems[i].users && lineItems[i].users.hasOwnProperty(this.props.id)){
                    const countUsers = Object.keys(lineItems[i].users).length
                    if(moneyToSend.hasOwnProperty(creator)){
                        moneyToSend[creator] += calculatePrice(lineItems[i].price, countUsers, receipt.tipPercent)
                    } else {
                        moneyToSend[creator] = calculatePrice(lineItems[i].price, countUsers, receipt.tipPercent)
                    }
                }
                if(isCreator){
                    if(lineItems[i].users){
                        const countUsers = Object.keys(lineItems[i].users).length
                        for(let userKey in lineItems[i].users){
                            if(userKey === this.props.id) continue
                            if(moneyToReceive.hasOwnProperty(userKey)){
                                moneyToReceive[userKey] += calculatePrice(lineItems[i].price, countUsers, receipt.tipPercent)
                            } else {
                                moneyToReceive[userKey] = calculatePrice(lineItems[i].price, countUsers, receipt.tipPercent)
                            }
                        }
                    } else {
                        moneyToReceive.unassigned += calculatePrice(lineItems[i].price, 1, receipt.tipPercent)
                    }
                }
            }

        }
        console.log('moneyToSend', moneyToSend)
        console.log('moneyToReceive', moneyToReceive)

        return (
            <Container>
                <MyHeader title='Status' right={()=><BackButton />} />
                <Content>
                    <Text>This is Status Page</Text>

                </Content>
            </Container>
        )
    }
}

const mapState = state => ({
    id: state.user.currentUser.id
})

export default connect(mapState)(Status)
