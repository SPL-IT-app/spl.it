import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera, Permissions } from 'expo';
import vision from 'react-native-cloud-vision-api';

export default class CameraView extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  takePicture = async () => {

    /**
     * TODO(developer): Uncomment the following line before running the sample.
     */
    // const fileName = 'Local image file, e.g. /path/to/image.png';

    // Performs text detection on the local file
    let photo = await this.camera.takePictureAsync({ base64: true });
    console.log("photo taken")
    try {
      vision.init({ auth: process.env.API_KEY });
      const req = new vision.Request({
        image: new vision.Image({
          base64: photo.base64,
        }),
        features: [
          new vision.Feature('TEXT_DETECTION', 4)
        ],
      });
      vision.annotate(req).then((res) => {
        // handling response
        console.log("res", res)
        console.log(JSON.stringify(res.responses))
      }).catch(err => console.log(err))
    } catch (err) {
      console.log("some error happened")
      console.error(err);
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
