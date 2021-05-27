import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import {useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

const App = () => {

	const [redirectData, setRedirectData] = useState(null);

	_handleRedirect = (event) => {
		if (Constants.platform.ios) {
			WebBrowser.dismissBrowser();
		} else {
			_removeLinkingListener();
		}

		let data = Linking.parse(event.url);

		setRedirectData({redirectData: data})
	};


	// openBrowserAsync requires that you subscribe to Linking events and the
	// resulting Promise only contains information about whether it was canceled
	// or dismissed
	_openBrowserAsync = async () => {
		try {
			_addLinkingListener();
			let result = await WebBrowser.openBrowserAsync(
				// We add `?` at the end of the URL since the test backend that is used
				// just appends `authToken=<token>` to the URL provided.
				`https://backend-xxswjknyfi.now.sh/?linkingUri=${Linking.createURL('/?')}`
			);

			// https://github.com/expo/expo/issues/5555
			if (Constants.platform.ios) {
				_removeLinkingListener();
			}
			setRedirectData({result})
		} catch (error) {
			alert(error);
			console.log(error);
		}
	};

	_addLinkingListener = () => {
		Linking.addEventListener('url', _handleRedirect);
	};

	_removeLinkingListener = () => {
		Linking.removeEventListener('url', _handleRedirect);
	};

	_maybeRenderRedirectData = () => {
		if (!redirectData) {
			return;
		}

		return (
			<Text style={{marginTop: 30}}>
				{JSON.stringify(redirectData)}
			</Text>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Redirect Example</Text>

			<Button
				onPress={_openBrowserAsync}
				title="Tap here to try it out with openBrowserAsync"
			/>

			{_maybeRenderRedirectData()}
		</View>
	);
};

export default App;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		paddingBottom: 40,
	},
	header: {
		fontSize: 25,
		marginBottom: 25,
	},
});
