import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera, Permissions } from 'expo';
const axios = require('axios');
require('../secrets');

export default class CameraView extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  getData = async photo => {
    try {
      const reqBody = {
        requests: [
          {
            image: {
              content: photo.base64,
              // source: {
              //   imageUri: photo.uri,
              // },
            },
            features: [
              {
                type: 'TEXT_DETECTION',
              },
            ],
          },
        ],
      };
      const resp = await axios.post(
        `https://vision.googleapis.com/v1/images:annotate?key=${
          process.env.REACT_APP_GOOGLE_API_KEY
        }`,
        reqBody
      );
      // if (resp.status >= 400) {
      //   console.log(resp.body);
      // }
      console.log('non-json: ', resp.data);
      console.log(
        'RESPONSE ======>',
        resp.data.responses[0].fullTextAnnotation.text
      );
      const receiptText = resp.data.responses[0].fullTextAnnotation.text;
      parseReceipt(
        'Kiwiana Restaurant\n847 A Union Street\nBrooklyn, NY 11215\n718-230-3682\nTbl:4\nRef:57204\nChk:57373\n2/5/2017 12:19 pm\nNino\nbloody mary\nMimosa Special\nCoffee\nFlorentine\nFrench Toast\n7.00\n8.00\n2.75\n12.00\n13.00\nSub Total\nState Tax\n42.75\n3.79\nTotal\n46.54\nImmigrants make America great (they also cooked\nyour food and served you today)\n'
      );
    } catch (err) {
      console.log('some error happened');
      console.error(err);
    }
  };
  takePicture = async () => {
    let photo = await this.camera.takePictureAsync({
      quality: 0,
      base64: true,
    });
    this.getData(photo);
  };

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            style={{ flex: 1 }}
            type={this.state.type}
            ref={ref => {
              this.camera = ref;
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  /*  this.setState({
                    type: this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
                  }); */
                  this.takePicture();
                }}
              >
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: 'white' }}
                >
                  {' '}
                  Take Photo{' '}
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }
}

function parseReceipt(receiptText) {
  const receiptArr = receiptText.split('\n');
  let priceArr = [];
  let itemsArr = [];
  let receiptObj = {};
  const regex = /^\d*\.?\d*$/g;
  receiptArr.forEach(ele => {
    if (Number(ele)) {
      if (ele.match(regex)) {
        priceArr.push(Number(ele));
      }
    } else {
      itemsArr.push(ele);
    }
  });

  itemsArr.forEach((ele, idx) => {
    const lastSpaceIdx = ele.lastIndexOf(' ');
    if (ele.slice(-3).match(regex)) {
      priceArr.splice(
        idx,
        0,
        isNaN(Number(ele.slice(lastSpaceIdx + 1)))
          ? 999.99
          : Number(ele.slice(lastSpaceIdx + 1))
      );
    }
  });
  priceArr.forEach((price, idx) => {
    receiptObj[idx] = {
      name: itemsArr[idx],
      price: price,
      quantity: 1,
    };
  });

  console.log('RECEIPT OBJECT ====>', receiptObj);
}
