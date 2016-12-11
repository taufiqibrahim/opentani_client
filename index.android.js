/**
 * Opentani Android Client App
 * https://github.com/taufiqibrahim/opentani_client
 * @flow
 */

'use strict';
import ReactNative, {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import React from 'react';

import SignUp from './app/route/signup/signup';
import Login from './app/route/login/login';
import Mapping from './app/route/mapping/mapping';
import Store from './app/route/mapping/store';
import Listing from './app/route/listing/listing';

class opentani_client extends React.Component {
  render() {
    return (
      <View>
        <Mapping />
      </View>
      );
  }
}

AppRegistry.registerComponent('opentani_client', () => opentani_client);
