import React from 'react'
import { View, Text, StyleSheet, Image, Button, Animated, Dimensions, ScrollView, TouchableOpacity } from 'react-native'

import { connect } from 'react-redux'
import Amplify, { Auth, API, graphqlOperation } from 'aws-amplify'
import aws_exports from '../../src/aws-exports'
Amplify.configure(aws_exports);

import BluetoothSerial from 'react-native-bluetooth-serial'

import { logOut } from '../actions'
import { colors, fonts } from '../theme'
const { width, height } = Dimensions.get('window')

import Workout from '../components/Workout'

// define bluetooth module to connnect to
const device = {
    name: 'RNBT-584E',
    id: '00:06:66:7D:58:4E'
}

class Home extends React.Component {
    static navigationOptions = {
        header: null
    }

    // ran everytime component is instantiated
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            powerArray: [],
            workoutArray: [],
            kwhProduced: 0,
            b1: 0,
            b2: 0,
            r2: 0,
            workoutPrediction: '',
            value: false,
            devices: [],
            isEnabled: false,
            connected: false,
            crash: false,
            analyzeWorkout: false
        }
    }

    // log regression
    logRegression = () => {
        alert('workout finished')
        let numDataPoints = 15
        let x = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
        let x1 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        let y = []

        // x1 = ln(x)
        for (let i = 0; i < numDataPoints; i++) {
            x1[i] += Math.log(x[i]);
        }

        // sum x1
        let sumx1 = 0;
        for (let i = 0; i < numDataPoints; i++) {
            sumx1 += x1[i];
        }

        // copy array into variable
        for (let i = 0; i < 15; i++) {
            y[i] = parseFloat(this.state.powerArray[i]);
        }

        // sum of all points in y
        let sumy = 0
        for (let i = 0; i < numDataPoints; i++) {
            sumy += y[i]
        }

        let totalKwh = sumy / 1000 * 0.5

        // calculate means
        let meany = sumy
        let meanx1 = sumx1 / numDataPoints

        let sxx = 0;
        let sxy = 0;
        let syy = 0;

        // calculte Sxx, Syy, Sxy
        for (let i = 0; i < numDataPoints; i++) {
            let xx = x1[i] - meanx1;
            let yy = y[i] - meany;

            sxx += Math.pow(xx, 2);
            sxy += xx * yy;
            syy += Math.pow(yy, 2);
        }

        let calcR2 = 1 - (sxx/sxy)
        let calcB2 = sxy/sxx
        let calcB1 = meany - (calcB2 * meanx1)
        let yPredict = 0

        for (let i = 1; i < 1800; i++) {
            yPredict += calcB1 + (calcB2*Math.log(i))
        }

        // kWh
        yPredict = yPredict / 1000 * 0.5

        this.setState({
            // r squared value
            r2: calcR2,

            // find coefficients
            b2: calcB2,
            //
            b1: calcB1,
            workoutPrediction: yPredict.toFixed(3),
            kwhProduced: totalKwh.toFixed(3)
        })

        // alert(y);
        // alert(this.state.r2)
        // alert(this.state.b2)
        // alert(this.state.b1)
    }

    // start workout
    startWorkout = () => {
        this.setState ({
            analyzeWorkout: false
        })
        // set timer to collect data for 15 seconds
        // setTimeout(() => {
        //     // check if connect
        //     if (this.state.connected) {
        //         // read data from Bluetooth devicde
        //         BluetoothSerial.readFromDevice().then((data) => {
        //
        //             // collect data every second
        //             setInterval(() => {
        //                 // if (data) {
        //                     this.setState(state => {
        //                         const powerArray = state.powerArray.push(data)
        //                     })
        //                 // }
        //             }, 5000)
        //         })
        //     }
        // }, 15000)
    let time = 0
    let timerId = setInterval(() => {
        this.setState(state => {

            const powerArray = state.powerArray.push(1.1)
            // time += 1
            // alert(time)
            if(time > 14) {
                alert('workout finished')
            }
        })
    }, 1000)

    setTimeout(() => { clearInterval(timerId); this.logRegression(); }, 16000);

    // let timerId = setInterval(() => {
    //     this.setState(state => {
    //         const powerArray = state.powerArray.push(data)
    //         alert(this.state.powerArray)
    //     })
    // }, 1000)

    // if (this.state.connected) {
    //     BluetoothSerial.readFromDevice().then((data) => {
    //         setTimeout(() => { clearInterval(timerId); alert('workout finished'); }, 16000);
    //
    //      })
    // }
    };

    // connect to bluetooth module
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

    addWorkout() {
        var d = new Date()

        this.state.workoutArray.push({
            'date' : (d.getMonth() + 1) +
                "/" + d.getDate() +
                "/" + d.getFullYear(),
            'output' : 'kWh produced: ' + this.state.kwhProduced,
            'predict' : 'prediction for 30 min workout (kWh): ' + this.state.workoutPrediction,
        })
        this.setState({
            workoutArray: this.state.workoutArray,
            powerArray: [],
            analyzeWorkout: true
        })

    }

    deleteWorkout(key) {
        this.state.workoutArray.splice(key, 1);
        this.setState({ workoutArray: this.state.workoutArray })
    }


    componentDidMount() {
        Promise.all([BluetoothSerial.isEnabled(), BluetoothSerial.list()])
            .then((values) => {
                const[isEnabled, devices] = values
                this.setState({
                    isEnabled,
                    devices
                })
                if (this.state.isEnabled === false) {
                    alert('Bluetooth must be switched on and paired with device')
                }

            })

        // connect bluetooth device
        this.connect();


        // for testing getting data: alert if data is not null or empty
        // setTimeout(() => {
        //     if (this.state.connected) {
        //         BluetoothSerial.readFromDevice().then((data) => {
        //
        //             setInterval(() => {
        //             // dispaly data if it exists
        //                 if(data) {
        //                     alert(data)
        //                 }
        //             }, 1000)
        //
        //         }) , 10000
        //     }
        // })

        // BluetoothSerial.readFromDevice().then((data) => {
        //     if(data !==  null && data !== '') {
        //         alert(data)
        //     }
        // })

    }

    // user logout
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

    // array display
        // { this.state.powerArray.map((item, key)=>(
        // <Text key={key}> { item } </Text>)
        // )}

    render() {
        let workouts = this.state.workoutArray.map((val, key) => {
            return <Workout key={key} keyval={key} val={val}
            deleteMethod= {() => this.deleteWorkout(key)} />
        })

        return (
                <View style={styles.container}>
                    <View style={styles.homeContainer}>
                        <TouchableOpacity onPress={this.startWorkout.bind(this)}><Text style={styles.welcome}>Start Workout</Text></TouchableOpacity>
                        <TouchableOpacity onPress={this.addWorkout.bind(this)}><Text style={styles.welcome}>Add Workout</Text></TouchableOpacity>
                        <TouchableOpacity onPress={this.logout.bind(this)}><Text style={styles.welcome}>Logout</Text></TouchableOpacity>
                    </View>
                    <ScrollView>
                            {workouts}
                    </ScrollView>
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