import React, { createContext , useState , useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const DataContext = createContext();

export const DataProvider = ({ children }) =>{

    const [userList , setUserList] = useState([]);

    const [LoggedUser , setLoggedUser] = useState({});

    const [isLoading , setIsLoading] = useState(true);

    const [startTiming , setStartTiming] = useState(false);

    const [timeSheetData , setTimeSheetData] = useState([]);

    useEffect(() =>{
        getUserData();
        getLoggedUserData();
    },[])

    const getUserData = async () =>{
        try{
            const response = await AsyncStorage.getItem('Users');
            console.log("response = ",response);
            if(response !== null && response !== undefined){
                setUserList(JSON.parse(response))
            }            
        }
        catch(err){
            console.log(err.message)
        }
    }

    const getLoggedUserData = async () =>{
        try{
            const response = await AsyncStorage.getItem('LoggedUser');
            if(response !== null && response !== undefined) {
                setLoggedUser(JSON.parse(response))
                getTimeSheetData(JSON.parse(response))
            }
        }
        catch(err){
            console.log(err.message)
        }
    }

    const getTimeSheetData = async () =>{
        try{
            const response = await AsyncStorage.getItem('TimeSheet');
            if(response !== null && response !== undefined) { 
                if(!!LoggedUser){
                    console.log("LU in TS = ",LoggedUser);
                    const timeSheetForThisUser = (JSON.parse(response)).filter((data) => data.user_id === LoggedUser.id) 
                    console.log("Ts Data = " , timeSheetForThisUser)
                    setTimeSheetData(timeSheetForThisUser)
                }  
            }
        }
        catch(err){
            console.log(err.message)
        }
    }

    useEffect(() =>{
        getTimeSheetData()
    },[LoggedUser , setLoggedUser])

   

    const clearLoader = () =>{
        setTimeout(function(){
            setIsLoading(false)
        },3000)
    }

    return (
        <DataContext.Provider value={{
            userList , setUserList , LoggedUser , setLoggedUser,
            isLoading , setIsLoading , clearLoader,
            startTiming , setStartTiming , timeSheetData , setTimeSheetData,
        }}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContext

