import { BarCodeScanner } from 'expo-barcode-scanner';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View,Image } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import firebase from'firebase'
import db from '../config'
import * as Permissions from 'expo-permissions'
export default class TransactionScreen extends React.Component {
    constructor(){
        super()
        this.state={
            hasCamerPermissions:null,
            scanned:false,
            scannedBookId:'',
            scannedStudentId:'',
            buttonState:'normal',
                TransactionMessage:''
        }
    }
    getcameraPermission=async(id)=>{
        const {status}=await Permissions.askAsync(Permissions.CAMERA)
        this.setState({

            hasCamerPermissions:status=="granted",
            buttonState:id,
            scanned:false,
        })
    }
    handleTransaction=()=>{db.collection("books").doc(this.state.scannedBookId).get()
        .then((doc)=>{

            var book=doc.data()
            if (book.bookAvailability){
                    this.initiateBookIssue()
                    transactionMessage="bookIssued"
            }
            else(){}
        })}
    handlebarcodescanned=({data})=>{
        if(this.state.buttonState=="bookId")
        {
            this.setState({scanned:true ,scannedBookId:data,buttonState:"normal"})
        }
        else if(this.state.buttonState=="studentId"){
            this.setState({scanned:true ,scannedStudentId:data,buttonState:"normal"})
        }
    }
    render() {
        if(this.state.buttonState!=='normal'&&this.state.hasCamerPermissions){
            return(<BarCodeScanner style={StyleSheet.absoluteFill}
                onBarCodeScanned={this.state.scanned?undefined:this.handlebarcodescanned}/>)
        }
        else if(this.state.buttonState=='normal')
        {

        
        return (

            <View style={styles.container}>
                <Image source={require('../assets/download.jpg')} style={{ width: 100, height: 100 }}>

                </Image>
                <View style={styles.inputView}>
                <TextInput placeholder="BookId" style={styles.inputBox} value={this.state.scannedBookId}>

                </TextInput>
                <TouchableOpacity style={styles.scanButton} onPress={() => { this.getcameraPermission("bookId") }}>

                    <Text style={styles.buttonText}>scan</Text>
                </TouchableOpacity>
                </View>
                <View style={styles.inputView}>
                <TextInput placeholder="studentId" style={styles.inputBox} value={this.state.scannedStudentId}>

                </TextInput>
                <TouchableOpacity style={styles.scanButton} onPress={() => { this.getcameraPermission("studentId") }}>

                    <Text style={styles.buttonText}>scan</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.scanButton} onPress={() => { var transactionMessage=this.handleTransaction() }}>

                    <Text style={styles.buttonText}>submit</Text>
                </TouchableOpacity>
                </View>
            </View>
        )
        }
    }


};
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    displayText: { fontSize: 15, textDecorationLine: 'underline' },
    scanButton: { backgroundColor: '#2196F3', padding: 10, margin: 10 },
    buttonText: { fontSize: 15, textAlign: 'center', marginTop: 10 }, inputView: { flexDirection: 'row', margin: 20 },
    inputBox: { width: 200, height: 40, borderWidth: 1.5, borderRightWidth: 0, fontSize: 20 },

    scanButton: { backgroundColor: '#66BB6A', width: 50, borderWidth: 1.5, borderLeftWidth: 0 }
});