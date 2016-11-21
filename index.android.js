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

class opentani_client extends React.Component {
  render() {
    return (
      <View>
        <SignUp />
      </View>
      );
  }
}

AppRegistry.registerComponent('opentani_client', () => opentani_client);
