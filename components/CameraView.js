import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera, Permissions, ImageManipulator } from 'expo';
const axios = require('axios');
require('../secrets');
import { Icon, Button } from 'native-base';

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  camera: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  button: { padding: 20, marginTop: 20 },
  touch: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: { fontSize: 18, marginBottom: 10, color: 'white' },
});

export default class CameraView extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    displayLoading: false,
    crop: {
      originX: 1,
      originY: 1,
      width: 1,
      height: 1,
    },
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
      parseReceipt(receiptText);
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
    this.cropPicture(photo);
    // this.getData(photo);
  };

  cropPicture = async photo => {
    let croppedPhoto = await ImageManipulator.manipulate(
      photo.uri,
      [
        {
          crop: {
            originX: 1,
            originY: 1,
            width: 1,
            height: 1,
          },
        },
      ],
      { base64: true }
    );
    this.getData(croppedPhoto);
  };

  handlePress = evt => {
    this.setState({
      ...this.state,
      crop: {
        originX: evt.nativeEvt.pageX,
        originY: evt.nativeEvt.pageX,
        width: 1,
        height: 1,
      },
    });
  };

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={styles.view}>
          <Camera
            style={styles.view}
            type={this.state.type}
            ref={ref => {
              this.camera = ref;
            }}
          >
            <View style={styles.camera} onStartShouldSetResponder="true">
              <Button
                style={styles.button}
                onPress={() => this.props.navigation.navigate('Home')}
              >
                <Icon name="ios-arrow-back" />
              </Button>
              <TouchableOpacity
                style={styles.touch}
                onPress={() => {
                  this.takePicture();
                }}
              >
                <Button>
                  <Text style={styles.text}> Take Photo </Text>
                </Button>
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
