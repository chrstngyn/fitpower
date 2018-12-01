import React from 'react';
import { Platform, Text, View, TextInput, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Modal } from 'react-native';

import { Auth } from 'aws-amplify'
import config from '../aws-exports'
Amplify.configure(config)
import { connect } from 'react-redux'

import { fonts, colors } from '../theme'
import { createUser, confirmUserSignUp } from '../actions'

import Input from '../components/Input'
import Button from '../components/Button'
import Amplify from "aws-amplify-react-native"

import withObservables from '@nozbe/with-observables'

const initialState = {
    username: '',
    password: '',
    email: '',
    phone_number: '',
    authCode: ''
}

class SignUp extends React.Component {
    state = initialState

    onChangeText = (key, value) => {
        this.setState({
            [key]: value
        })
    }

    signUp() {
        const { username, password, email, phone_number } = this.state
        this.props.dispatchCreateUser(username, password, email, phone_number)
    }

    confirm() {
        const { authCode, username } = this.state
        this.props.dispatchConfirmUser(username, authCode)
    }

    componentWillReceiveProps(nextProps) {
        const { auth: { showSignUpConfirmationModal }} = nextProps
        if (!showSignUpConfirmationModal && this.props.auth.showSignUpConfirmationModal) {
            this.setState(initialState)
        }
    }

    render() {
        const { auth: {
            showSignUpConfirmationModal,
            isAuthenticating,
            signUpError,
            signUpErrorMessage
        }} = this.props
        return (
            <View style={styles.container}>
                <View style={styles.heading}>
                    <Image
                        source={require('../assets/shape.png')}
                        style={styles.headingImage}
                        resizeMode="contain"
                    />
                </View>
                <Text style={styles.register}>
                    Lets get started, athlete.
                </Text>
                <View style={styles.inputContainer}>
                    <Input
                        value={this.state.username}
                        placeholder="User Name"
                        type='username'
                        onChangeText={this.onChangeText}
                    />
                    <Input
                        value={this.state.email}
                        placeholder="Email"
                        type='email'
                        onChangeText={this.onChangeText}
                    />
                    <Input
                        value={this.state.password}
                        placeholder="Password"
                        secureTextEntry
                        type='password'
                        onChangeText={this.onChangeText}
                    />
                    <Input
                        placeholder="Phone Number"
                        type='phone_number'
                        keyboardType='numeric'
                        onChangeText={this.onChangeText}
                        value={this.state.phone_number}
                    />
                </View>
                <Button
                    title='Sign Up'
                    onPress={this.signUp.bind(this)}
                    isLoading={isAuthenticating}
                />
                <Text style={[styles.errorMessage, signUpError && { color: 'black' }]}>Error logging in. Please try again.</Text>
                <Text style={[styles.errorMessage, signUpError && { color: 'black' }]}>{signUpErrorMessage}</Text>
                {
                    showSignUpConfirmationModal && (
                        <Modal>
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

const mapStateToProps = state => ({
    auth: state.auth
})

const mapDispatchToProps = {
    dispatchConfirmUser: (username, authCode) => confirmUserSignUp(username, authCode),
    dispatchCreateUser: (username, password, email, phone_number) => createUser(username, password, email, phone_number)
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputContainer: {
        marginTop: 20
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 40
    },
    register: {
        marginTop: 20,
        fontFamily: fonts.light,
        fontSize: 24
    },
    heading: {
        flexDirection: 'row'
    },
    headingImage: {
        width: 38,
        height: 38
    },
    errorMessage: {
        fontFamily: fonts.base,
        fontSize: 12,
        marginTop: 10,
        color: 'transparent'
    }
});