import React from 'react';
import {
    Platform,
    Text,
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    Modal
} from 'react-native';

import { Auth } from 'aws-amplify'
import config from '../aws-exports'
Amplify.configure(config)
import { connect } from 'react-redux'

import { authenticate, confirmUserLogin } from '../actions'
import { fonts, colors } from '../theme'

import Input from '../components/Input'
import Button from '../components/Button'
import Amplify from "aws-amplify-react-native";

class SignIn extends React.Component {
    state = {
        username: '',
        password: '',
        accessCode: ''
    }

    onChangeText = (key, value) => {
        this.setState({
            [key]: value
        })
    }

    signIn() {
        const { username, password } = this.state
        this.props.dispatchAuthenticate(username, password)
    }

    confirm() {
        const { authCode } = this.state
        this.props.dispatchConfirmUserLogin(authCode)
    }

    render() {
        const { fontsLoaded } = this.state
        const { auth: {
            signInErrorMessage,
            isAuthenticating,
            signInError,
            showSignInConfirmationModal
        }} = this.props
        return (
            <View style={styles.container}>
                <View style={styles.heading}>
                    <Image
                        style={styles.headingImage}
                        resizeMode="contain"
                    />
                </View>
                <Text style={[styles.welcome]}>
                    Welcome to Fit Power
                </Text>

                <View style={styles.inputContainer}>
                    <Input
                        placeholder="Username"
                        type='username'
                        onChangeText={this.onChangeText}
                        value={this.state.username}
                    />
                    <Input
                        placeholder="Password"
                        type='password'
                        onChangeText={this.onChangeText}
                        value={this.state.password}
                        secureTextEntry
                    />
                </View>

                <Button
                    isLoading={isAuthenticating}
                    title='Sign In'
                    onPress={this.signIn.bind(this)}
                />
                <Text style={[styles.errorMessage, signInError && { color: 'black' }]}>Error logging in. Please try again.</Text>
                <Text style={[styles.errorMessage, signInError && { color: 'black' }]}>{signInErrorMessage}</Text>

                <Button

                />
                {
                    showSignInConfirmationModal && (
                        <Modal onRequestClose={() => null}>
                            <View style={styles.modal}>
                                <Input
                                    placeholder="Authorization Code"
                                    type='authCode'
                                    keyboardType='numeric'
                                    onChangeText={this.onChangeText}
                                    value={this.state.authCode}
                                    keyboardType='numeric'
                                />
                                <Button
                                    title='Confirm'
                                    onPress={this.confirm.bind(this)}
                                    isLoading={isAuthenticating}
                                />
                            </View>
                        </Modal>
                    )
                }
            </View>
        );
    }
}

const mapDispatchToProps = {
    dispatchConfirmUserLogin: authCode => confirmUserLogin(authCode),
    dispatchAuthenticate: (username, password) => authenticate(username, password)
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    heading: {
        flexDirection: 'row'
    },
    headingImage: {
        width: 38,
        height: 38
    },
    errorMessage: {
        fontSize: 12,
        marginTop: 10,
        color: 'transparent',
        fontFamily: fonts.base
    },
    inputContainer: {
        marginTop: 20
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 40
    },
    welcome: {
        marginTop: 20,
        fontSize: 24,
        fontFamily: fonts.light
    }
});