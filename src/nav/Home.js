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
            goalPredict: 0,
            charge10Percent: 0,
            workoutPrediction: '',
            powerInput: '',
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
        let goalCalc = this.state.powerInput

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

        let calcB2 = sxy/sxx
        let calcB1 = meany - (calcB2 * meanx1)
        let yPredict = 0

        // 1/4 t^2 (2 a + 2 b log(t) - 3 b)
        // t = e^(3/2 - a/b)

        // predicted set value / 15 sec
        let predictedSetValue = sumy / 15

        // energy to charge phone = 2.76
        // 2.76 / predictSetValue (watts)
        let charge10 =  2.76 / predictedSetValue * 60 / 10


        // 30 min of working out
        for (let i = 1; i < 1800; i++) {
            yPredict += calcB1 + (calcB2*Math.log(i))
        }

        // kWh
        yPredict = yPredict / 1000 * 0.5

        let goalOutput = Math.exp((goalCalc - calcB1) / calcB2)/60

        this.setState({

            // find coefficients
            b2: calcB2,
            b1: calcB1,
            workoutPrediction: yPredict.toFixed(3),
            kwhProduced: totalKwh.toFixed(3),
            charge10Percent: charge10.toFixed(3),
        })
    }

    // start workout
    startWorkout = () => {
        this.setState ({
            analyzeWorkout: false
        })

        let data1 = 0;
        let timerId = setInterval(() => {
            if (this.state.connected) {
                BluetoothSerial.readFromDevice().then((data) =>
                    this.setState(state => {
                    if (!data) {
                        const powerArray = state.powerArray.push(data1)
                    } else {
                        const powerArray = state.powerArray.push(data)
                    }
                        alert(this.state.powerArray)
                    })
                )
            }
        }, 1000)

        setTimeout(() => { clearInterval(timerId); this.logRegression(); }, 16000);
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
            'output' : 'kWh produced: ' + this.state.kwhProduced + ' kWh',
            'predict' : 'prediction for 30 min workout: ' + this.state.workoutPrediction + ' kWh',
            'goal' : 'time to charge phone +10%: ' + this.state.charge10Percent + ' min',
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
//<Timer interval={timerData.timer} />

    render() {
        let workouts = this.state.workoutArray.map((val, key) => {
            return <Workout key={key} keyval={key} val={val}
            deleteMethod= {() => this.deleteWorkout(key)} />
        })

        return (
                <View style={styles.container}>
                    <View style={styles.homeContainer}>
                        <TouchableOpacity onPress={this.startWorkout.bind(this)}>
                            <Text style={styles.welcome}>Start</Text>
                        </TouchableOpacity>

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
        flex: 1,
        paddingHorizontal: 20
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
    },
    timer: {
        fontSize: 76,
        fontWeight: '200',
        paddingTop: 100,
    },
    row: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        justifyContent: 'space-between',
        marginTop: 80
    }
})

const mapStateToProps = state => ({
    auth: state.auth
})

const mapDispatchToProps = {
    dispatchLogout: () => logOut()
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)