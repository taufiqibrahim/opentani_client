'use strict';
import Config from '../../config';
import ReactNative, {
  StyleSheet,
  Dimensions,
  Text,
  View,
  AsyncStorage,
  TouchableHighlight,
} from 'react-native';
import React, {Component} from 'react';
import Mapbox, { MapView } from 'react-native-mapbox-gl';

Mapbox.setAccessToken(Config.mapboxglAccessToken);

var COORDINATE_KEY = '@CoordinateStore:key';

class Mapping extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toggleTrackingState: false,
      trackingText: 'Rekam',
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      zoom: 14,
      dlongitude: 0,
      dlatitude: 0,
      dAccuracy: 0,
      dSpeed: 0,
      annotations: [],
      arrayCoordinates: []    
    };
  }

  watchID: ?number = null;

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
        (position) => {
          var initialPosition = JSON.stringify(position);
          this.setState({initialPosition});
        },
        (error) => alert(JSON.stringify(error)),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 5000}
    );

    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position);
      this.setState({lastPosition});
      this.setState({dlongitude: position.coords.longitude});
      this.setState({dlatitude: position.coords.latitude});
      this.setState({dAccuracy: position.coords.accuracy});
      this.setState({dSpeed: position.coords.speed});
    });  
  }

  componentWillMount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  onUpdateUserLocation = (location) => {
    var toggle = this.state.toggleTrackingState;
    if (toggle) {    
      this._map && this._map.setCenterCoordinate(this.state.dlatitude, this.state.dlongitude);
      console.log('toggleTrackingState: ' + toggle)
      console.log('onUpdateUserLocation', location);
      this.setState({dlongitude: location.longitude});
      this.setState({dlatitude: location.latitude});
      this.saveCoordinates();
    }
  }

  onChangeUserTrackingMode = (userTrackingMode) => {
    this.setState({ userTrackingMode: Mapbox.userTrackingMode.follow });
  }

  resetAnnotation = () => {
    this.setState({annotations: []})
  }

  drawLineString = () => {
    this.resetAnnotation();
    this.setState({
      annotations: [...this.state.annotations, {
        coordinates: this.state.arrayCoordinates,
        type: 'polyline',
        strokeColor: '#9DE033',
        strokeWidth: 4,
        strokeAlpha: 0.5,
        id: 'line'
      }]
    })
  }

  async saveCoordinates() {
    try {
      let readValue = await AsyncStorage.getItem(COORDINATE_KEY);
      var passValue = [];

      if (readValue == null) {
        passValue = [];
      } else {
        passValue = JSON.parse(readValue);
      }

      let newValue = [];
      newValue.push(this.state.dlatitude, this.state.dlongitude);

      passValue.push(newValue);

      await AsyncStorage.setItem(COORDINATE_KEY, JSON.stringify(passValue));
      this.setState({arrayCoordinates: passValue});
      console.log('Pass value: ' + this.state.arrayCoordinates);

      this.drawLineString();

    } catch(error) {
      console.log('Error storing new data. ' + error.message);
    }
  }

  RemoveStorage = async () => {
    try {
      await AsyncStorage.removeItem(COORDINATE_KEY);
      this.setState({arrayCoordinates: []})
      this.resetAnnotation();
      this.drawLineString();
      console.log('Data erased!');
      console.log('Current data: ' + JSON.stringify(this.state.arrayCoordinates));
    } catch(error) {
      console.log('Error in erasing data!');
    }
  }

  onButtonToogleTracking() {
    try {
      var toogle = this.state.toggleTrackingState;
      if (toogle) {
        this.setState({trackingText: 'Rekam'});
      } else {
        this.setState({trackingText: 'Selesai'});
      }
      this.setState({toggleTrackingState: !toogle});
      console.log('toggleTrackingState: ' + this.state.toggleTrackingState);
    } catch(error) {
      console.log('Error onButtonToogleTracking');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.boxUpper}>
          <MapView 
            ref={map => { this._map = map; }}
            style={styles.map}
            styleURL={Mapbox.mapStyles.dark}
            initialCenterCoordinate={this.state.center}
            initialZoomLevel={this.state.zoom}
            showsUserLocation={true}
            // onChangeUserTrackingMode={this.onChangeUserTrackingMode}
            onUpdateUserLocation={this.onUpdateUserLocation}
            annotations={this.state.annotations}
            annotationsAreImmutable
            onOpenAnnotation={this.onOpenAnnotation}
          />
        </View>
        <View style={styles.boxLower}>
          <View style={styles.boxDoubleCol}>
            <View style={styles.boxDoubleColChild}>
                <Text style={styles.textHeader}>Longitude</Text>
                <Text style={styles.textHeader}>Latitude</Text>
            </View>
            <View style={styles.boxDoubleColChild}>
                <Text style={styles.textValue}>{this.state.dlongitude.toFixed(4)}</Text>
                <Text style={styles.textValue}>{this.state.dlatitude.toFixed(4)}</Text>
            </View>
          </View>   
          <View style={styles.boxDoubleCol}>
            <View style={styles.boxDoubleColChild}>
                <Text style={styles.textHeader}>Akurasi (meter)</Text>
                <Text style={styles.textHeader}>Kecepatan (km/jam)</Text>
            </View>
            <View style={styles.boxDoubleColChild}>
                <Text style={styles.textValue}>{this.state.dAccuracy}</Text>
                <Text style={styles.textValue}>{this.state.dSpeed}</Text>
            </View>
          </View>
          <View style={styles.boxDoubleCol}>
            <TouchableHighlight 
              style={[
                  styles.button,
                  !this.state.toggleTrackingState && styles.buttonToggleFalse,
                  this.state.toggleTrackingState && styles.buttonToggleTrue,
                ]} 
              onPress={this.onButtonToogleTracking.bind(this)}>
              <Text style={styles.buttonText}>
                {this.state.trackingText}
              </Text>
            </TouchableHighlight> 
            <TouchableHighlight 
              style={[
                  styles.button,
                  {backgroundColor: '#607D8B'},
                ]}
              onPress={this.RemoveStorage.bind(this)}>
              <Text style={styles.buttonText}>
                Hapus Rekaman
              </Text>
            </TouchableHighlight>
          </View>          
        </View>           
      </View>
    )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: Dimensions.get('window').height,
    backgroundColor: '#242424',
  },
  boxUpper: {
    flex: 1,
  },
  map: {
    flex: 1,
  },  
  boxLower: {
    flex: 1,
  },
  boxDoubleCol: {
    flexDirection: 'column',
  },
  boxDoubleColChild: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  textHeader: {
    color: '#A9A9A9',
    fontSize: 14,
    alignSelf: 'stretch',
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,   
  },  
  textValue: {
    color: '#F6F6F6',
    fontSize: 26,
    alignSelf: 'stretch',
    textAlignVertical: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    height: 50  //height must be defined in text if flex is used    
  },
  button: {
    height: 60,
    alignSelf: 'stretch',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,  
  },
  buttonToggleFalse: {backgroundColor: '#9DE033',},
  buttonToggleTrue: {backgroundColor: '#F44336',},
  buttonText: {
    alignSelf: 'center',
    fontSize: 22,
    fontFamily: 'Roboto',
    color: '#F6F6F6',
  }
})

module.exports = Mapping