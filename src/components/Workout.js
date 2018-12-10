import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

export default class Workout extends React.Component {
    render(){
        return(
            <View key={this.props.keyval} style={styles.workout}>
                <Text style={styles.displayData}>{this.props.val.date}</Text>
                <Text style={styles.displayData}>{this.props.val.output}</Text>
                <Text style={styles.displayData}>{this.props.val.predict}</Text>
                <Text style={styles.displayData}>{this.props.val.goal}</Text>
                <TouchableOpacity onPress={this.props.deleteMethod} style={styles.workoutDelete}>
                    <Text style={styles.workoutDeleteText}>DELETE</Text>
                 </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    workout: {
        position: 'relative',
        padding: 20,
        paddingRight:100,
        borderBottomWidth: 2,
        borderBottomColor: 'black',
    },
    displayData: {
        paddingLeft: 20,
        borderLeftWidth: 10,
        borderLeftColor: 'black',
    },
    workoutDelete: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        top: 10,
        bottom: 10,
        right: 10,
    },
    workoutDeleteText: {
        color: 'grey'
    }
})