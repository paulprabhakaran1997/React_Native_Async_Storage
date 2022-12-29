import { 
    View, 
    Text ,
    TextInput, 
    StyleSheet,
    TouchableOpacity,
    Image, 
    ScrollView
} from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import GlobalStyle from '../styles/GlobalStyle.js'
import DataContext from '../context/DataContext.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {

    const { LoggedUser , setLoggedUser } = useContext(DataContext);

    const { isLoading , setIsLoading } = useContext(DataContext);

    const { clearLoader , startTiming , setStartTiming } = useContext(DataContext)

    
    useEffect(() =>{
        setIsLoading(true)
    },[])

    const history = useNavigation();

    const logout = async () =>{

        try{
            const response = await AsyncStorage.setItem('LoggedUser' , JSON.stringify({}));
            if(response !== null){
                setLoggedUser({});
                clearLoader();
                history.navigate('Login')
            }
        }
        catch(err){
            console.log(err.message)
        }
    }


    const [hour , setHour] = useState(0);
    const [minute , setMinute] = useState(0);
    const [second , setSecond] = useState(0);

    const [showHour , setShowHour] = useState('00');
    const [showMinute , setShowMinute] = useState('00');
    const [showSecond , setShowSecond] = useState('00');

    const [isActive, setIsActive] = useState(false);

    const [startTime , setStartTime] = useState(null);
    const [stopTime , setStopTime] = useState(null);

    

    const secondsToHMS = (val) =>{
        d = val;
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);

        var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

        // console.log(hDisplay + mDisplay + sDisplay);

    }

    secondsToHMS(9432)


    const stopTimer = () =>{

    }

   

    useEffect(() =>{
        let interval = null;
        
        if(isActive){
            interval = setInterval(() =>{
                const thisSecond = second;
                // const thisMinute = minute;
                // const thisHour = hour;

                // if(thisSecond === 59){
                //     setMinute(thisMinute + 1)
                //     setSecond(0)
                // }
                // else {
                //     setSecond(thisSecond + 1)
                // }

                // if(thisMinute === 59){
                //     setHour(thisHour + 1);
                //     setMinute(0);
                //     setSecond(0);
                // }

                const d = thisSecond;

                var h = Math.floor(d / 3600);
                var m = Math.floor(d % 3600 / 60);
                var s = Math.floor(d % 3600 % 60);

                var hDisplay = h > 0 ? (h < 10) ? '0' + h.toString() : h.toString()  : "00";
                var mDisplay = m > 0 ? (m < 10) ? '0' + m.toString() : m.toString()  : "00";
                var sDisplay = s > 0 ? (s < 10) ? '0' + s.toString() : s.toString()  : "00";

                console.log(hDisplay+":"+mDisplay+":"+sDisplay)

                setSecond(thisSecond + 1)


                // setShowSecond(thisSecond < 10 ? '0' + (thisSecond).toString() : (thisSecond).toString())
                // setShowMinute(thisMinute < 10 ? '0' + (thisMinute).toString() : (thisMinute).toString())
                // setShowHour(thisHour < 10 ? '0' + (thisHour).toString() : (thisHour).toString())

            },1000)
        }
        else{
            clearInterval(interval)
        }

        return () => {
            clearInterval(interval);
        };
    },[isActive , second]);


    const ResetTimer = () =>{
        setSecond(0);
        setHour(0);
        setMinute(0);

        setShowSecond('00');
        setShowMinute('00');
        setShowHour('00');
    }


    const getCurrentTime = (val) =>{
        const date = val;
        const temp_hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
        const am_pm = date.getHours() >= 12 ? "PM" : "AM";
        const hours = temp_hours < 10 ? "0" + temp_hours : temp_hours;
        const minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        const seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        const time = hours + ":" + minutes + ":" + seconds + " " + am_pm;
        console.log("Time = ",time);

        return time
    }


    const startStopTimer = () =>{
        const val = startTiming;
        console.log("Val = " , val);
        if(!val){
            setStartTime(getCurrentTime(new Date()))
        }else{
            setStopTime(getCurrentTime(new Date()))
        }        
        setStartTiming(!val);
        setIsActive(!isActive);
        ResetTimer()        
    }



    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.text, {paddingLeft : 7 , color : 'white'}] }>Clockify</Text>
                <Text style={{color : 'white' , paddingRight : 0, marginRight : 0, justifyContent:'flex-end' , alignItems : 'flex-end'}}>Hello, {LoggedUser.name}</Text>
                <TouchableOpacity
                    onPress={() => logout() }
                    style={{paddingRight : 7}}
                >
                    <Image style={styles.logoutImg} source={require('../assets/img/logout.png')} />
                </TouchableOpacity>
            </View>
            <View style={styles.section1}>
                <Text style={styles.timer}>
                    <Text>{showHour} : </Text>
                    <Text>{showMinute} : </Text>
                    <Text>{showSecond}</Text>
                </Text>
                <TouchableOpacity
                    style={[styles.startBtn , { backgroundColor : startTiming ? 'red' : 'deepskyblue' } ]}
                    onPress={() => startStopTimer()}
                >
                    <Text style={{color : 'white' , fontSize : 20}}>{startTiming ? 'Stop' : 'Start'}</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.section2}>
                <View>

                </View>
            </ScrollView>
            <View style={styles.footer}>
                <Text>&copy; Lintcloud {(new Date()).getFullYear()}</Text>                
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        flexDirection : 'column'
    },
    header : {
        flex : 0,
        height:40,
        flexDirection : 'row',
        backgroundColor : 'black',
        justifyContent : 'space-between',
        alignItems:'center',
    },
    section1 : {
        flex : 0,
        height:75,
        flexDirection : 'row',
        backgroundColor : 'lightgrey',
        justifyContent : 'space-between',
        alignItems:'center',
    },
    timer : {
        fontSize : 25,
        marginLeft : 7,
        color : 'black'
    },
    startBtn : {
        marginRight : 7,
        paddingVertical : 4,
        paddingHorizontal : 7
    }, 
    section2 : {
        flex : 1,
        backgroundColor : 'white',
        paddingHorizontal:5,
        paddingVertical : 10
    },
    footer : {
        flex : 0,
        backgroundColor : 'lightgrey',
        justifyContent : 'center',
        alignItems:'center',
    },
    text : {
        fontSize : 25,
        fontWeight : 'bold'
    },
    loginBtn:{
        backgroundColor : 'red',
        justifyContent : 'center',
        alignItems : 'center',
        textAlign : 'center',
        padding : 8
    },
    logoutImg :{
        width : 25,
        height : 25 
    }
})

export default Home