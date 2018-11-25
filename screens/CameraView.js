import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  PanResponder,
  Alert,
  Dimensions,
  PixelRatio,
} from 'react-native';
import { PanResponderInstance } from 'PanResponder';
import { Camera, Permissions, ImageManipulator, Svg } from 'expo';
const axios = require('axios');
require('../secrets');
import { Icon, Button, Content, Spinner } from 'native-base';
import { connect } from 'react-redux';
import { setReceipt } from '../store';
import { MyHeader, BackButton } from '../components/index';
import platformStyle from '../native-base-theme/variables/platform.js';

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  camera: {
    flex: 1,
    backgroundColor: 'rgba(220, 220, 220, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: { padding: 20, marginTop: 20 },
  touch: {
    display: 'flex',
    alignItems: 'center',
    width: '60%',
    alignSelf: 'flex-end',
    textAlign: 'center',
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
        originX: 0,
        originY: 0,
        width: 0,
        height: 0,
      },
      // dimensions: {
      //   width: 0,
      //   height: 0,
      // },
      displayCrop: false,
    };
  }
  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  _panResponder: PanResponderInstance = PanResponder.create({
    onMoveShouldSetPanResponder: (event, gestureState) => true,
    onPanResponderMove: (event, gestureState) => {
      const { x0, y0, dx, dy, moveX, moveY } = gestureState;
      this.setState({
        crop: {
          // originX: moveX - dx,
          // originY: moveY - dy,
          originX: x0,
          originY: y0,
          width: dx,
          height: dy,
        },
        displayCrop: true,
      });
    },
    onPanResponderRelease: (evt, gestureState) => {
      console.log('crop on release ===>', this.state.crop);
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
      if (!resp.data.responses[0].fullTextAnnotation) {
        this.props.navigation.navigate('Camera');
        Alert.alert('Error', 'Try again!');
      } else {
        const receiptText = resp.data.responses[0].fullTextAnnotation.text;
        const receiptObj = parseReceipt(receiptText);
        this.props.setReceipt(receiptObj);
      }
    } catch (err) {
      console.error(err);
    }
  };
  takePicture = async () => {
    let photo = await this.camera.takePictureAsync({
      quality: 0,
      base64: true,
    });
    this.cropPicture(photo);
  };

  cropPicture = async photo => {
    let resizedPhoto = await ImageManipulator.manipulateAsync(photo.uri, [
      {
        resize: {
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          // width: this.state.dimensions.width,
          // height: this.state.dimensions.height,
        },
      },
    ]);
    let croppedPhoto = await ImageManipulator.manipulateAsync(
      resizedPhoto.uri,
      [
        {
          crop: {
            originX: this.state.crop.originX,
            originY: this.state.crop.originY + platformStyle.toolbarHeight / 4,
            width: this.state.crop.width,
            height: this.state.crop.height + platformStyle.toolbarHeight / 3,
          },
        },
      ],
      { base64: true }
    );

    this.getData(croppedPhoto);
  };

  toggleLoading = () => {
    this.setState({
      displayCrop: false,
      displayLoading: !this.state.displayLoading,
    });
  };

  _renderLoading = () => {
    if (this.state.displayLoading) {
      return (
        <View style={styles.camera}>
          <Spinner color='#159192'/>
          <Text>Reading receipt...</Text>
        </View>
      );
    } else {
      return null;
    }
  };

  _rectangleDisplay = () => {
    const { width, height } = Dimensions.get('window');
    // let currentWidth = 0;
    // let currentHeight = 0;
    if (this.state.displayCrop) {
      return (
        <View
        // onLayout={evt => {
        //   const { x, y, width, height } = evt.nativeEvent.layout;
        //   currentHeight = height;
        //   currentWidth = width;
        // }}
        >
          {/* <Svg height={currentHeight} width={currentWidth}> */}
          <Svg height={height} width={width}>
            <Svg.Rect
              // originX={this.state.crop.originX}
              // originY={this.state.crop.originY}
              x={this.state.crop.originX}
              y={this.state.crop.originY - platformStyle.toolbarHeight}
              width={this.state.crop.width}
              height={this.state.crop.height}
              strokeWidth={2}
              stroke="#FFC000"
              fill="transparent"
            />
          </Svg>
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
      return <Text>No access to camera!</Text>;
    } else {
      return (
        <View style={styles.view}>
          <MyHeader title="Take Photo" right={() => <BackButton />} />
          <Camera
            style={styles.view}
            type={this.state.type}
            ref={ref => {
              this.camera = ref;
            }}
            {...this._panResponder.panHandlers}
          >
            {this._rectangleDisplay()}
            {this._renderLoading()}
            {/* <View style={styles.camera}>
              <Button
                style={styles.button}
                onPress={() => this.props.navigation.navigate('Home')}
              >
                <Icon type="MaterialCommunityIcons" name="cancel" />
              </Button>
              <TouchableOpacity
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
              </TouchableOpacity>
            </View> */}
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
