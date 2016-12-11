'use strict';
import Config from '../../config';
import ReactNative, {
  StyleSheet,
  Text,
  View,
  AsyncStorage
} from 'react-native';
import React, {Component} from 'react';

var COORDINATE_KEY = '@CoordinateStore:key';

class Store extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      isTracking: 0,
      isInitial: 1,
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      longitude:0,
      latitude:0,
      geojson: {
        "type": "LineString",
        coordinate: []
      }
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
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );

    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position);
      this.setState({lastPosition});
      this.setState({longitude: position.coords.longitude});
      this.setState({latitude: position.coords.latitude});
      let center = JSON.stringify({
        longitude: this.state.longitude,
        latitude: this.state.latitude
      });

      // Check if initial then erase storage
      console.log('isInitial value = ' + this.state.isInitial);
      if (this.state.isInitial == 1) {
        this._RemoveStorage();
        this.setState({isInitial: 0})
      }

      var array = [];
      array.push([this.state.longitude, this.state.latitude]);

      console.log('Data dari GPS ' + JSON.stringify(array));

      this.saveStorage();

    });
  }

  componentWillMount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  async saveStorage() {
    try {
      
      let readValue = await AsyncStorage.getItem(COORDINATE_KEY);
      var passValue = [];
      if (readValue == null) {
        passValue = [];
      } else {
        passValue = JSON.parse(readValue);
      }
      console.log('Nilai terbaca dari DB: ' + JSON.stringify(passValue));

      let newValue = [];
      newValue.push(this.state.longitude, this.state.latitude);
      //newValue.push(this.state.latitude);
      console.log('Nilai baru dari GPS: ' + JSON.stringify(newValue));

      passValue.push(newValue);

      this.setState({
        geojson: {
          type: 'LineString',
          coordinate: passValue
        }
      });
      console.log('Geojson:  ' + JSON.stringify(this.state.geojson));
      console.log('State:  ' + JSON.stringify(this.state));

      await AsyncStorage.setItem(COORDINATE_KEY, JSON.stringify(passValue));

    } catch(error) {
      console.log('Error storing new data. ' + error.message);
    }
  }

  _ReadStorage = async () => {
    try {
      const readValue = await AsyncStorage.getItem(COORDINATE_KEY);
      //console.log('Value is: ' + readValue);
    } catch(error) {
      console.log('error reading: ' + error.message);
    }
  }

  _RemoveStorage = async () => {
    try {
      await AsyncStorage.removeItem(COORDINATE_KEY);
      console.log('Data erased!');
    } catch(error) {
      console.log('Error in erasing data!');
    }
  }

  _appendMessage = (value) => {
    this.setState({messages: this.state.messages.concat('DataMasuk.')});
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textHeader}>Longitude</Text>
        <Text style={styles.textValue}>{this.state.longitude}</Text>
        <Text style={styles.textHeader}>Latitude</Text>
        <Text style={styles.textValue}>{this.state.latitude}</Text> 
        <Text style={styles.textHeader}>AsyncStorage database state</Text>
        <Text style={styles.textHeader}>{this.state.messages}</Text>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    height: 400
  },
  map: {
    flex: 1
  },
  textHeader: {
    color: '#A9A9A9',
    fontSize: 12,
    alignSelf: 'stretch',
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    height: 25  //height must be defined in text if flex is used    
  },  
  textValue: {
    color: 'black',
    fontSize: 22,
    alignSelf: 'stretch',
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
    height: 50  //height must be defined in text if flex is used    
  }
})
module.exports = Store