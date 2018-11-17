import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  PanResponder,
} from 'react-native';
import { PanResponderInstance } from 'PanResponder';
import { Camera, Permissions, ImageManipulator } from 'expo';
const axios = require('axios');
require('../secrets');
import { Icon, Button, Content, Spinner } from 'native-base';
import { connect } from 'react-redux';
import { setReceipt } from '../store';

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

export class CameraView extends React.Component {
  constructor() {
    super();
    this.state = {
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
  }
  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  _panResponder: PanResponderInstance = PanResponder.create({
    onMoveShouldSetPanResponder: (event, gestureState) => true,
    // onPanResponderGrant: (event, gestureState) => {
    //   this.setState({
    //     crop: {
    //       originX: event.nativeEvent.locationX,
    //       originY: event.nativeEvent.locationY,
    //     },
    //   });
    // },
    onPanResponderMove: (event, gestureState) => {
      console.log();
      const { x0, y0, dx, dy, moveX, moveY } = gestureState;
      this.setState({
        crop: {
          originX: event.nativeEvent.locationX,
          originY: event.nativeEvent.locationY,
          width: event.nativeEvent.locationX + dx,
          height: event.nativeEvent.locationY + dy,
        },
      });
    },
    onPanResponderRelease: (evt, gestureState) => {
      this.toggleLoading();
      this.takePicture().then(() => {
        this.props.navigation.navigate('ListConfirm');
      });
    },
  });

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
      console.log('request ======>', reqBody);
      const resp = await axios.post(
        `https://vision.googleapis.com/v1/images:annotate?key=${
          process.env.REACT_APP_GOOGLE_API_KEY
        }`,
        reqBody
      );
      // console.log(
      //   'RESPONSE ======>',
      //   resp.data.responses[0].fullTextAnnotation.text
      // );
      const receiptText = resp.data.responses[0].fullTextAnnotation.text;
      const receiptObj = parseReceipt(receiptText);
      this.props.setReceipt(receiptObj);
    } catch (err) {
      console.log('some error happened');
      console.error(err);
    }
  };
  takePicture = async () => {
    console.log(this.state.crop);
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
            originX: this.state.crop.originX,
            originY: this.state.crop.originY,
            width: this.state.crop.width,
            height: this.state.crop.height,
          },
        },
      ],
      { base64: true }
    );
    this.getData(croppedPhoto);
  };

  handlePress = evt => {
    this.setState({
      crop: {
        originX: evt.nativeEvt.pageX,
        originY: evt.nativeEvt.pageY,
      },
    });
  };

  toggleLoading = () => {
    this.setState({
      displayLoading: !this.state.displayLoading,
    });
  };

  _renderLoading = () => {
    if (this.state.displayLoading) {
      return (
        <View style={styles.Camera}>
          <Content>
            <Spinner />
            <Text>Reading Receipt...</Text>
          </Content>
        </View>
      );
    } else {
      return null;
    }
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
            {...this._panResponder.panHandlers}
          >
            {this._renderLoading()}
            <View style={styles.camera}>
              <Button
                style={styles.button}
                onPress={() => this.props.navigation.navigate('Home')}
              >
                <Icon type="MaterialCommunityIcons" name="cancel" />
              </Button>
              {/* <TouchableOpacity
              style={styles.touch}
              onPress={() => {
                this.takePicture().then(() => {
                  this.props.navigation.navigate('ListConfirm');
                });
              }}
            >
              <Button>
                <Text style={styles.text}> Take Photo </Text>
              </Button>
            </TouchableOpacity> */}
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
  let parsedReceipt = [];
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
    parsedReceipt.push({
      name: itemsArr[idx],
      price: price,
      quantity: 1,
    });
  });

  console.log('RECEIPT ARRAY ====>', parsedReceipt);
  return parsedReceipt;
}

const mapDispatch = dispatch => {
  return {
    setReceipt: receiptObj => {
      dispatch(setReceipt(receiptObj));
    },
  };
};

export default connect(
  null,
  mapDispatch
)(CameraView);
