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
import DataTable, { COL_TYPES } from 'react-native-datatable-component';
import { TableView } from 'react-native-responsive-table';

const Home = () => {

    const { LoggedUser , setLoggedUser } = useContext(DataContext);

    const { isLoading , setIsLoading , setAndClearLoader } = useContext(DataContext);

    const { clearLoader , startTiming , setStartTiming } = useContext(DataContext)

    const { timeSheetData , setTimeSheetData } = useContext(DataContext)

    
    useEffect(() =>{
        setIsLoading(true)
    },[])

    const history = useNavigation();

    const logout = async () =>{

        try{
            const response = await AsyncStorage.setItem('LoggedUser' , JSON.stringify({}));
            if(response !== null){
                setLoggedUser({});
                setIsLoading(true);
                clearLoader();
                history.navigate('Login')
            }
        }
        catch(err){
            console.log(err.message)
        }
    }


    const [second , setSecond] = useState(0);
    const [time , setTime] = useState('00 : 00 : 00');

    const [isActive, setIsActive] = useState(false);

    const [startTime , setStartTime] = useState(null);
    const [stopTime , setStopTime] = useState(null);

    


    const stopTimer = async (stopTime) =>{
        console.log("Total Time = " , time);
        console.log("Start time = " , startTime);
        console.log("Stop time = " , stopTime);

        const thisHistory = {
            date : getCurrentDate() , 
            startTime : startTime , 
            stopTime : stopTime,
            totalTime : time,
            user_id : LoggedUser.id,
            user : LoggedUser.name
        }

        const HistoryData = await AsyncStorage.getItem('TimeSheet');
        const existingTimeSheet = JSON.parse(HistoryData);
        var tempData = (existingTimeSheet !== null && existingTimeSheet !== undefined) ? existingTimeSheet : []

        const id = tempData.length ? tempData.length + 1 : 1
        thisHistory['id'] = id;

        tempData.push(thisHistory);

        try{
            const response = await AsyncStorage.setItem('TimeSheet',JSON.stringify(tempData));
            setTimeSheetData([...timeSheetData , thisHistory])   
 
        }
        catch(err){
            console.log(err)
        }

        setStartTiming(false);
        setIsActive(false);
        ResetTimer();  

        console.log("History = ",thisHistory)

           
    }

   

    useEffect(() =>{
        let interval = null;
        
        if(isActive){
            interval = setInterval(() =>{
                const thisSecond = second + 1;  

                var h = Math.floor(thisSecond / 3600);
                var m = Math.floor(thisSecond % 3600 / 60);
                var s = Math.floor(thisSecond % 3600 % 60);

                var hDisplay = h > 0 ? (h < 10) ? '0' + h.toString() : h.toString()  : "00";
                var mDisplay = m > 0 ? (m < 10) ? '0' + m.toString() : m.toString()  : "00";
                var sDisplay = s > 0 ? (s < 10) ? '0' + s.toString() : s.toString()  : "00";

                setTime(hDisplay+" : "+mDisplay+" : "+sDisplay)

                setSecond(thisSecond)

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
        setTime('00 : 00 : 00');
        setStartTime(null);
    };



    const getCurrentDate = () =>{
        const today = new Date();
        let month = today.getMonth() + 1;

        const date = (today.getDate()) < 10 ? '0' + (today.getDate()) : (today.getDate());

        if(month < 10){ month = '0' + month }

        return date+"-"+month+"-"+today.getFullYear()
    }

    console.log(getCurrentDate())


    const getCurrentTime = (val) =>{
        const date = val;
        const temp_hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
        const am_pm = date.getHours() >= 12 ? "PM" : "AM";
        const hours = temp_hours < 10 ? "0" + temp_hours : temp_hours;
        const minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        const seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        const time = hours + ":" + minutes + " " + am_pm;
        console.log("Time = ",time);

        return time
    }


    const startStopTimer = () =>{
        const val = startTiming;
        console.log("Val = " , val);
        if(val === false){
            setStartTime(getCurrentTime(new Date()));
            setStopTime(null);
            setStartTiming(!val);
            setIsActive(!isActive);
        }else{
            setStopTime(getCurrentTime(new Date()));
            stopTimer(getCurrentTime(new Date()));
        } 
        
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
                    {time}
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
                    {/* <DataTable
                        data={timeSheetData} // list of objects
                        colNames={['id', 'user', 'date', 'startTime' , 'stopTime' , 'totalTime']} //List of Strings
                        colSettings={[
                            { name: 'id', type: COL_TYPES.INT, width: '10%' },
                            { name: 'user', type: COL_TYPES.STRING, width: '25%' },
                            { name: 'date', type: COL_TYPES.STRING, width: '10%' },
                            { name: 'startTime', type: COL_TYPES.STRING, width: '10%' },
                            { name: 'stopTime', type: COL_TYPES.STRING, width: '10%' },
                            { name: 'totalTime', type: COL_TYPES.STRING, width: '20%' },
                        ]}//List of Objects
                        noOfPages={1} //number
                        backgroundColor={'white'} //Table Background Color
                        headerLabelStyle={{ color: 'black', fontSize: 12 }} //Text Style Works
                    /> */}

                    <TableView
                        key={'user'}
                        height = {'77%'}
                        horizontalScroll = {true}
                        columnWidth = {100}
                        headers={[
                            {
                                name:"User",
                                reference_key:"user",
                            },
                            {
                                name:"Date",
                                reference_key:"date",
                            },
                            {
                                name:"From",
                                reference_key:"startTime",
                            },
                            {
                                name:"To",
                                reference_key:"stopTime",
                            },
                            {
                                name:"Total",
                                reference_key:"totalTime",
                            },
                        ]}
                        rows={timeSheetData}
                    />

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