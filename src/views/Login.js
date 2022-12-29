import { 
    View, 
    Text , 
    StyleSheet , 
    TextInput ,
    Image, 
    Keyboard , 
    TouchableWithoutFeedback, 
    TouchableOpacity, 
    ToastAndroid,
    Alert,
} from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import GlobalStyle from '../styles/GlobalStyle.js'
import DataContext from '../context/DataContext.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DismissKeyboard = ({children}) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss() }>
        {children}
    </TouchableWithoutFeedback>
)

const Login = ({route}) => {
    const UserData = route.params.User;
    // console.log(UserData);
    const [userName , setUserName] = useState('');
    const [password , setPassword] = useState('');

    const { isLoading , setIsLoading } = useContext(DataContext)

    const history = useNavigation()
    
    const { userList , setUserList , LoggedUser , setLoggedUser } = useContext(DataContext);

    console.log("LogUser = " , LoggedUser);

    console.log("UserList = " , userList);

    const { clearLoader } = useContext(DataContext)


    useEffect(() =>{
        if(Object.keys(LoggedUser).length !== 0){
            setIsLoading(true);
            clearLoader();
            history.navigate('Home');
        } 
        else{
            setIsLoading(true);
            clearLoader()
        }
    },[])

   

    const setAlert = (msg) =>{
        Alert.alert('Warning' , msg)
    }

    const validateUser = async() => {
        Keyboard.dismiss();

        if((userName.trim()).length !== 0){
            if((password.trim().length !== 0)){
                console.log("Success = " , userList);
                const isValidUser = userList.filter((data) => 
                    {
                        console.log('Email = ' , data.email);
                        console.log('Phone = ' , data.phone);
                        console.log('Password = ' , data.password);
                        console.log('Username' , userName);
                        console.log('UserPAss' , password);
                        return  (userName === data.email || userName === data.phone) && (password === data.password)
                    }
                );

                console.log("IsValid User = " , isValidUser)

                if(isValidUser.length !== 0){
                    try{
                        await AsyncStorage.setItem('LoggedUser' , JSON.stringify(isValidUser[0]));
                        setLoggedUser(isValidUser[0])
                        setUserName('');
                        setPassword('');
                        setIsLoading(true)
                        clearLoader()
                        setTimeout(() => { history.navigate('Home') },3000)
                    }
                    catch(err){
                        console.log(err.message)
                    }
                    
                }
                else {
                    setAlert('Invalid Username Or Password')
                }
            }
            else {
                setAlert('Please Enter Password')
            }
        }
        else{
            setAlert('Please Enter Email / Phone')
        }

        
    }


    return (
        <DismissKeyboard>
            {!isLoading ? (
                <View style={GlobalStyle.body}>
                <Image
                    style={styles.logo}
                    source={require('../assets/img/developer.png')}
                />
                <Text style={styles.text}>Login</Text>
                <View style={styles.loginDetailsView}>
                    <Text style={styles.label}>Email / Phone</Text>
                    <TextInput
                        style={styles.input}
                        value={userName}
                        onChangeText={(e) => setUserName(e)}
                    />
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        // secureTextEntry
                        value={password}
                        onChangeText={(e) => setPassword(e)}
                    />                    
                    <TouchableOpacity
                        style={styles.loginBtn}
                        onPress={() => validateUser()}
                    >
                        <Text style={{ fontSize: 15, color: 'white' }}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={styles.link}>
                            Forget Password ?
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => history.navigate('Signup')}>
                        <Text style={styles.link}>
                            Not a User / SignUp ?
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            ) : (
                <View style={GlobalStyle.body}>
                    <Image style={styles.logo} source={require('../assets/img/loader.gif')} />
                </View>
            )}
        </DismissKeyboard>
    )
}

const styles = StyleSheet.create({
    logo:{
        width:125,
        height : 125
    },
    text : {
        fontSize : 25,
        fontWeight : 'bold'
    },
    loginDetailsView:{
        marginTop : 15
    },
    label : {
        fontSize : 17,
        marginBottom : 5,
        textAlign : 'center'
    },
    input : {
        borderWidth : 0.5,
        borderColor : 'lightgrey',
        paddingHorizontal:5,
        paddingVertical : 2,
        width : 170,
        marginBottom : 15,
        textAlign:'center',
    },
    loginBtn:{
        backgroundColor : 'green',
        justifyContent : 'center',
        alignItems : 'center',
        textAlign : 'center',
        marginHorizontal:25,
        marginVertical : 15,
        padding : 8
    },
    link:{
        color:'blue',
        textAlign:'center',
        textDecorationLine: "underline",
        textDecorationStyle: "solid",
        marginBottom:12
    }
})

export default Login