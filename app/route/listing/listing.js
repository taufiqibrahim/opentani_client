'use strict';

import ReactNative, {
  StyleSheet,
  Dimensions,
  Text,
  View,
  ListView
} from 'react-native';

import React, {Component} from 'react';

class Listing extends React.Component {
	constructor(props) {
	  super(props);
	  const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
	  this.state = {
	  	dataSource: ds.cloneWithRows(['Buy Coffee', 'Water the Plants'])
	  };
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.title}>Data Anda</Text>
				<ListView
					style = {styles.listItem}
					dataSource = {this.state.dataSource}
					renderRow = {
						(rowData) => (
							<View>
								<Text style={{fontSize:10,color: '#6FC91F',paddingTop: 5 }}>3 Hours Ago</Text>
								<Text style={styles.listText}>
									{rowData}
								</Text>
							</View>
						)
					}
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		height: Dimensions.get('window').height
	},
	title: {
		flex:0.1,
		backgroundColor: '#4db84e',
		fontFamily: 'Verdana',
		fontSize: 20,
		color: '#F6FDE8',
		alignSelf: 'stretch',
		textAlign: 'center',
		textAlignVertical: 'center',
	},
	listItem: {
		backgroundColor: '#F6FDE8',
		paddingLeft: 10,
		paddingRight: 10,		
	},
	listText: {
		height: 50,
		fontSize: 18,
		color: '#212121',
		borderBottomColor: '#212121',
		borderBottomWidth: 0.2,		
	}
})

module.exports = Listing