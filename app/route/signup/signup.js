'use strict';

import ReactNative, {
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';

import React, {Component} from 'react';

class SignUp extends React.Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	ektp_id: "",
	  	username: "",
	  	email: "",
	  	password: "",
	  	errors: {},
	  	api_error: ""
	  };
	}

	async onSignUpPressed() {
		try {
		  let response = await fetch('http://192.168.0.145:3000/signup', {
		  	method: 'POST',
		  	headers: {
		  		'Accept': 'application/json',
		  		'Content-Type': 'application/json'
		  	},
		  	body: JSON.stringify({
		  			ektp_id: this.state.ektp_id,
		  			username: this.state.username,
		  			email: this.state.email,
		  			password: this.state.password
		  	})
		  });

		  let res = await response.json();
		  
		  if (res.status >= 200 && res.status < 300) {
		  	console.log(res);
		  } else {
		  	this.setState({api_error: res.error.message});
		  	let errors = res.error.message;
		  }

		} catch(errors) {
			console.log(errors);
		}
	}

	render() {
		return (
         <View style={styles.container}>
            <TextInput
              onChangeText = {(value) => this.setState({ektp_id: value})}
              editable= {true}
              maxLength= {40}
              placeholder="Nomor EKTP"
              style={styles.text}
            />
            <Text>{this.state.ektp_id}</Text>
           <TextInput
              onChangeText = {(value) => this.setState({username: value})}
              editable= {true}
              maxLength= {40}
              placeholder="Nama pengguna"
              style={styles.text}
            />
            <Text>{this.state.username}</Text>
           <TextInput
              onChangeText = {(value) => this.setState({email: value})}
              editable= {true}
              maxLength= {40}
              placeholder="Email"
              style={styles.text}
            />
            <Text>{this.state.email}</Text>
           <TextInput
              onChangeText = {(value) => this.setState({password: value})}
              editable= {true}
              maxLength= {40}
              placeholder="Kata sandi"
              secureTextEntry={true}
              style={styles.text}
            />
            <Text>{this.state.password}</Text> 
            <TouchableHighlight style={styles.button} onPress={this.onSignUpPressed.bind(this)}>
              <Text style={styles.buttonText}>
                Daftar
              </Text>
            </TouchableHighlight>
            <Text style={styles.texterror}>{this.state.api_error}</Text>                                 
          </View>
		)
	}
}

const styles = StyleSheet.create({
	text: {
		color: 'black',
		alignSelf: 'stretch',
		height: 60	//height must be defined in text if flex is used
	},
	texterror: {
		color: 'red',
		alignSelf: 'center',
		height: 60,	//height must be defined in text if flex is used		
		marginTop: 50
	},
	button: {
		height: 50,
		backgroundColor: '#48BBEC',
		alignSelf: 'stretch',
		marginTop: 30,
		justifyContent: 'center'
	},
	buttonText: {
		fontSize: 22,
		color: 'white',
		alignSelf: 'center'
	},
	container: {
		flex: 1,
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 100
	}
})

module.exports = SignUp