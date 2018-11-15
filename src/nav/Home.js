import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    Button,
    Animated,
    Dimensions
} from 'react-native'

import { connect } from 'react-redux'
import Auth from 'aws-amplify'

import BluetoothSerial from 'react-native-bluetooth-serial'

import { logOut } from '../actions'
import { colors, fonts } from '../theme'
const { width, height } = Dimensions.get('window')

const device = {
    name: 'RNBT-584E',
    id: '00:06:66:7D:58:4E'
}

class Home extends React.Component {
    static navigationOptions = {
        header: null
    }
    state = {
        username: '',
        value: false,
        devices: [],
        isEnabled: false,
        connected: false,
        crash: false,
        data: ''
    }

    connect() {
        BluetoothSerial.connect(device.id)
            .then((res) => {
                alert(`Connected to device ${device.name}`)
                this.setState({
                    connected: true
                })
            })

            .catch((err) => alert(err.message))
    }

    disconnect() {
        BluetoothSerial.disconnect()
            .then(() => this.setState({
                connected: false
            }))
            .catch((err) => alert(err.message))

    }

    readData() {
        BluetoothSerial.readFromDevice()
            .then((data) => {
                    if (data && this.state.value && this.state.crash === false) {
                        this.setState({
                            crash: true
                        })
                    }
            })
            .catch((err) => { console.log(err)})

    }

    AnimatedScale = new Animated.Value(1)

    componentDidMount() {
        this.animate()

        Promise.all([BluetoothSerial.isEnabled(), BluetoothSerial.list()])
            .then((values) => {
                const[isEnabled, devices] = values
                this.setState({
                    isEnabled,
                    devices
                })
                if (this.state.isEnabled === false) {
                    alert('Bluetooth must be switched on and paired with device for crash detection')
                }

            })
        this.connect()
        setInterval(() => {
            BluetoothSerial.readFromDevice().then((data) => {alert(data)}), 500
        })

    }
    async logout() {
        Auth.signOut()
            .then(() => {
                this.props.dispatchLogout()
            })
            .catch(err => {
                console.log('err: ', err)
            })
    }
    navigate() {
        this.props.navigation.navigate('Route1')
    }
    animate() {
        Animated.timing(
            this.AnimatedScale,
            {
                toValue: .8,
                duration: 1250,
                useNativeDriver: true
            }
        ).start(() => {
            Animated.timing(
                this.AnimatedScale,
                {
                    toValue: 1,
                    duration: 1250,
                    useNativeDriver: true
                }
            ).start(() => this.animate())
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.homeContainer}>
                    <Text style={styles.welcome}>Welcome</Text>
                    <Animated.Image
                        source={require('../assets/shape.png')}
                        style={{ tintColor: colors.primary, width: width / 2, height: width / 2, transform: [{scale: this.AnimatedScale}]}}
                        resizeMode='contain'
                    />
                    <Text onPress={this.logout.bind(this)} style={styles.welcome}>Logout</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    homeContainer: {
        alignItems: 'center'
    },
    welcome: {
        fontFamily: fonts.light,
        color: 'rgba(0, 0, 0, .85)',
        marginBottom: 26,
        fontSize: 22,
        textAlign: 'center'
    },
    registration: {
        fontFamily: fonts.base,
        color: 'rgba(0, 0, 0, .5)',
        marginTop: 20,
        fontSize: 16,
        paddingHorizontal: 20,
        textAlign: 'center'
    }
})

const mapStateToProps = state => ({
    auth: state.auth
})

const mapDispatchToProps = {
    dispatchLogout: () => logOut()
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)