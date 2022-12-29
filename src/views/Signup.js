import { 
    View, 
    Text , 
    StyleSheet , 
    Image, 
    TextInput, 
    Keyboard , 
    TouchableWithoutFeedback, 
    TouchableOpacity, 
    ToastAndroid, 
    KeyboardAvoidingView,
    ScrollView,
    Alert
} from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import GlobalStyle from '../styles/GlobalStyle.js'
import DataContext from '../context/DataContext.js';
import AsyncStorage from '@react-native-async-storage/async-storage';



const Signup = () => {

    const history = useNavigation();

    const { userList , setUserList , setIsLoading } = useContext(DataContext);

    const [signupUser , setSignupUser] = useState({
        name : '',
        email : '',
        phone : '',
        password : '',
        confirmPassword : ''
    });

    const handleChange = (value , name) => {
        setSignupUser({
            ...signupUser,
            [name] : value
        })
    }

    const setAlert = (msg) =>{
        Alert.alert('Warning' , msg)
    }

    const userSignup = async() =>{
        
        if(((signupUser.name).trim()).length !== 0 && ((signupUser.phone).trim()).length !== 0 &&
            ((signupUser.password).trim()).length !== 0){
                if(signupUser.password !== signupUser.confirmPassword){
                    setAlert('Password Not Matching')
                }
                else {
                    const userDataList = await AsyncStorage.getItem('Users');
                    const existingUser = JSON.parse(userDataList)
                    var tempData = (existingUser !== null && existingUser !== undefined) ? existingUser : []
                    const id = tempData.length ? tempData.length + 1 : 1
                    signupUser['id'] = id;
                    tempData.push(signupUser);
                    console.log("After Temp = ",tempData)
                    try{
                        const response = await AsyncStorage.setItem('Users' , JSON.stringify(tempData));
                        setUserList([...userList , signupUser])
                        setSignupUser({
                            name: '',email: '',phone: '',
                            password: '',confirmPassword: ''
                        });
                        history.navigate('Login')
                    }
                    catch(err){
                        console.log(err.message)
                    }
                    
                }
        }
        else {
            setAlert('Enter All Details')
        }

        
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior='padding'
            enabled={false}
        >
            <ScrollView
             style={{flex:1}}
            >
                <View style={GlobalStyle.body}>
                    <Image
                        style={styles.logo}
                        source={require('../assets/img/add_user.jpg')}
                    />
                    <Text style={styles.text}>Signup</Text>
                    <View style={styles.loginDetailsView}>
                        <Text style={styles.label}>Name <Text style={{color:'red'}}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            value={signupUser.name}
                            onChangeText={(e) => handleChange(e, 'name')}
                        // secureTextEntry                        
                        />
                        <Text style={styles.label}>Email (Optional)</Text>
                        <TextInput
                            style={styles.input}
                            value={signupUser.email}
                            onChangeText={(e) => handleChange(e, 'email')}
                        />

                        <Text style={styles.label}>Phone <Text style={{color:'red'}}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            value={signupUser.phone}
                            onChangeText={(e) => handleChange(e, 'phone')}
                        />
                        <Text style={styles.label}>Password <Text style={{color:'red'}}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            value={signupUser.password}
                            onChangeText={(e) => handleChange(e, 'password')}
                        // secureTextEntry                        
                        />
                        <Text style={styles.label}>Confirm Password <Text style={{color:'red'}}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            value={signupUser.confirmPassword}
                            onChangeText={(e) => handleChange(e, 'confirmPassword')}
                        // secureTextEntry                        
                        />
                        <TouchableOpacity
                            style={styles.loginBtn}
                            onPress={() => userSignup()}
                        >
                            <Text style={{ fontSize: 15, color: 'white' }}>Signup</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
        textAlign:'center'
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

export default Signup