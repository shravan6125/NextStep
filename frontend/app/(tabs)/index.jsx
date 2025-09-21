import { Image, Text, View ,StyleSheet, TouchableOpacity} from "react-native";
import Colors from '../../constants/Color'
import { useRouter } from "expo-router";
export default function Index() {

const router=useRouter();

  return(
   <View
    style= {{
      flex:1,
      backgroundColor: Colors.WHITE
    }}
  >
    <Image source= {require('../../assets/images/1738258695387.png')}
    style={{
      width: '100%',
      height: 300,
      marginTop: 30
    }}
   
    />
     <View style={{
      padding: 25,
      backgroundColor:'#0077B6',
      height: '100%',
      borderTopLeftRadius: 35,
      borderTopRightRadius: 35,

     }}
    
     >
      <Text style={{
          fontSize: 35,
          fontWeight: 'bold',
          textAlign: 'center',
          color: Colors.WHITE       
      }}>Welcome To NextStep!</Text>
      <Text style={{
        fontSize: 20,
        color: Colors.WHITE,
        marginTop: 20,
        textAlign: 'center'

      }}>The future depends on what you do today.</Text>

        <TouchableOpacity style={styles.button}
        onPress={()=>router.push('/auth/roleSelectionCreate')}
        >
          <Text style={[styles.buttonText, {color: '#0077B6'}]}>Get Started</Text>
        </TouchableOpacity>
     

        <TouchableOpacity style={[styles.button, {
          backgroundColor:'#0077B6',
          borderWidth: 1,
          borderColor: Colors.WHITE
        }]}onPress={()=>router.push('/auth/roleSelectionLogin')}
        >
          <Text style={[styles.buttonText,{color: Colors.WHITE}]}>Already have an Account?</Text>
        </TouchableOpacity>


     </View>
   
  </View>

  );
}


const styles = StyleSheet.create({
  button:{
     padding: 15,
     backgroundColor: Colors.WHITE,
     marginTop: 20,
     borderRadius: 10
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 18,
  }
})