import React, {useState} from "react";
import {View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {StatusBar} from "expo-status-bar";
import {Ionicons} from "@expo/vector-icons";

const Stack = createNativeStackNavigator();

const restaurants = [
  {id:1, name:"VORA Burger", category:"برجر", rating:"4.8", time:"25-35", emoji:"🍔"},
  {id:2, name:"Pizza House", category:"بيتزا", rating:"4.7", time:"30-40", emoji:"🍕"},
  {id:3, name:"Koshary Station", category:"مصري", rating:"4.6", time:"20-30", emoji:"🍲"},
  {id:4, name:"Sweet Box", category:"حلويات", rating:"4.9", time:"20-30", emoji:"🍰"}
];

const products = [
  {id:1, name:"VORA Classic Burger", price:145, desc:"برجر لحم، جبنة، خس وصوص خاص", emoji:"🍔"},
  {id:2, name:"Double Burger", price:185, desc:"قطعتان لحم مع الجبنة والصوص", emoji:"🍔"},
  {id:3, name:"Crispy Chicken", price:130, desc:"دجاج مقرمش، خس ومايونيز", emoji:"🍗"},
  {id:4, name:"French Fries", price:55, desc:"بطاطس مقرمشة", emoji:"🍟"}
];

function Home({navigation}) {
  const [search,setSearch]=useState("");
  return <View style={s.container}>
    <StatusBar style="dark"/>
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <View>
          <Text style={s.small}>توصيل إلى</Text>
          <Pressable style={s.location} onPress={()=>Alert.alert("العنوان","سيتم إضافة تحديد الموقع في النسخة القادمة.")}>
            <Ionicons name="location" size={18} color="#111"/>
            <Text style={s.address}>القاهرة، مصر</Text>
            <Ionicons name="chevron-down" size={16}/>
          </Pressable>
        </View>
        <View style={s.logoCircle}><Text style={s.logo}>V</Text></View>
      </View>

      <Text style={s.hero}>اطلب اللي نفسك فيه 👋</Text>
      <Text style={s.subhero}>أكلك المفضل لحد باب بيتك</Text>

      <View style={s.searchBox}>
        <Ionicons name="search" size={20} color="#777"/>
        <TextInput value={search} onChangeText={setSearch} placeholder="ابحث عن مطعم أو وجبة..." style={s.search}/>
      </View>

      <Text style={s.sectionTitle}>الأقسام</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:22}}>
        {["🍔 برجر","🍕 بيتزا","🍗 فرايد تشيكن","🍲 مصري","🍰 حلويات"].map((x,i)=>
          <View key={i} style={s.chip}><Text>{x}</Text></View>
        )}
      </ScrollView>

      <View style={s.banner}>
        <View><Text style={s.bannerTitle}>خصم 30%</Text><Text style={s.bannerText}>على أول طلب ليك</Text><Pressable style={s.bannerBtn}><Text style={s.bannerBtnText}>اطلب الآن</Text></Pressable></View>
        <Text style={{fontSize:70}}>🛵</Text>
      </View>

      <Text style={s.sectionTitle}>مطاعم قريبة منك</Text>
      {restaurants.filter(r=>r.name.toLowerCase().includes(search.toLowerCase()) || r.category.includes(search)).map(r=>
        <Pressable key={r.id} style={s.restaurant} onPress={()=>navigation.navigate("Restaurant",{restaurant:r})}>
          <View style={s.restaurantImage}><Text style={{fontSize:42}}>{r.emoji}</Text></View>
          <View style={{flex:1,marginHorizontal:12}}>
            <Text style={s.restaurantName}>{r.name}</Text>
            <Text style={s.muted}>{r.category} • {r.time} دقيقة</Text>
            <Text style={s.rating}>★ {r.rating}</Text>
          </View>
          <Ionicons name="chevron-back" size={20} color="#999"/>
        </Pressable>
      )}
    </ScrollView>
    <View style={s.bottom}><Ionicons name="home" size={24} color="#111"/><Ionicons name="receipt-outline" size={24} color="#999"/><Ionicons name="heart-outline" size={24} color="#999"/><Ionicons name="person-outline" size={24} color="#999"/></View>
  </View>
}

function Restaurant({route,navigation}) {
  const {restaurant}=route.params;
  const [cart,setCart]=useState([]);
  const add=(p)=>setCart([...cart,p]);
  return <View style={s.container}>
    <StatusBar style="dark"/>
    <ScrollView>
      <View style={s.restHero}><Text style={{fontSize:70}}>{restaurant.emoji}</Text></View>
      <View style={{padding:18}}>
        <Text style={s.bigTitle}>{restaurant.name}</Text>
        <Text style={s.muted}>{restaurant.category} • ★ {restaurant.rating} • {restaurant.time} دقيقة</Text>
        <Text style={s.sectionTitle}>الأكثر طلباً</Text>
        {products.map(p=><View key={p.id} style={s.product}>
          <View style={s.productImg}><Text style={{fontSize:35}}>{p.emoji}</Text></View>
          <View style={{flex:1,marginHorizontal:12}}>
            <Text style={s.productName}>{p.name}</Text>
            <Text style={s.muted}>{p.desc}</Text>
            <Text style={s.price}>{p.price} جنيه</Text>
          </View>
          <Pressable style={s.add} onPress={()=>add(p)}><Text style={s.addText}>+</Text></Pressable>
        </View>)}
      </View>
    </ScrollView>
    {cart.length>0 && <Pressable style={s.cartBar} onPress={()=>navigation.navigate("Cart",{cart})}>
      <Text style={s.cartText}>السلة ({cart.length})</Text><Text style={s.cartText}>{cart.reduce((a,b)=>a+b.price,0)} جنيه</Text>
    </Pressable>}
  </View>
}

function Cart({route,navigation}) {
  const cart=route.params?.cart||[];
  const total=cart.reduce((a,b)=>a+b.price,0);
  return <View style={s.container}>
    <StatusBar style="dark"/>
    <ScrollView contentContainerStyle={{padding:18}}>
      <Text style={s.bigTitle}>سلة الطلب</Text>
      {cart.map((p,i)=><View key={i} style={s.cartItem}><Text style={{fontSize:30}}>{p.emoji}</Text><Text style={{flex:1,marginHorizontal:12}}>{p.name}</Text><Text>{p.price} ج</Text></View>)}
      <View style={s.summary}><Text>الإجمالي</Text><Text style={s.total}>{total} جنيه</Text></View>
      <Pressable style={s.primary} onPress={()=>navigation.navigate("Checkout",{total})}><Text style={s.primaryText}>إتمام الطلب</Text></Pressable>
    </ScrollView>
  </View>
}

function Checkout({route,navigation}) {
  const total=route.params?.total||0;
  const [address,setAddress]=useState("");
  return <View style={s.container}>
    <StatusBar style="dark"/>
    <ScrollView contentContainerStyle={{padding:18}}>
      <Text style={s.bigTitle}>تأكيد الطلب</Text>
      <Text style={s.label}>عنوان التوصيل</Text>
      <TextInput value={address} onChangeText={setAddress} placeholder="اكتب عنوانك بالتفصيل" style={s.input}/>
      <Text style={s.label}>طريقة الدفع</Text>
      <View style={s.payment}><Ionicons name="cash-outline" size={24}/><Text>الدفع عند الاستلام</Text></View>
      <View style={s.summary}><Text>إجمالي الطلب</Text><Text style={s.total}>{total} جنيه</Text></View>
      <Pressable style={s.primary} onPress={()=>Alert.alert("تم الطلب 🎉","طلبك اتسجل بنجاح في VORA.")}><Text style={s.primaryText}>تأكيد الطلب</Text></Pressable>
    </ScrollView>
  </View>
}

export default function App(){
 return <NavigationContainer><Stack.Navigator screenOptions={{headerShown:false}}>
   <Stack.Screen name="Home" component={Home}/>
   <Stack.Screen name="Restaurant" component={Restaurant}/>
   <Stack.Screen name="Cart" component={Cart}/>
   <Stack.Screen name="Checkout" component={Checkout}/>
 </Stack.Navigator></NavigationContainer>
}

const s=StyleSheet.create({
 container:{flex:1,backgroundColor:"#fff"},
 header:{paddingTop:18,paddingHorizontal:18,flexDirection:"row",justifyContent:"space-between",alignItems:"center"},
 logoCircle:{width:48,height:48,borderRadius:16,backgroundColor:"#111",alignItems:"center",justifyContent:"center"},
 logo:{color:"#fff",fontSize:26,fontWeight:"900"},
 small:{fontSize:12,color:"#777",textAlign:"right"},
 location:{flexDirection:"row",alignItems:"center",gap:5,marginTop:3},
 address:{fontWeight:"700"},
 hero:{fontSize:28,fontWeight:"900",marginTop:28,marginHorizontal:18,textAlign:"right"},
 subhero:{color:"#777",marginTop:5,marginHorizontal:18,textAlign:"right"},
 searchBox:{margin:18,backgroundColor:"#f5f5f5",borderRadius:15,padding:12,flexDirection:"row",alignItems:"center"},
 search:{flex:1,marginLeft:8,textAlign:"right"},
 sectionTitle:{fontSize:20,fontWeight:"900",marginHorizontal:18,marginBottom:12,textAlign:"right"},
 chip:{backgroundColor:"#f5f5f5",padding:13,borderRadius:14,marginLeft:8},
 banner:{marginHorizontal:18,marginBottom:25,padding:20,borderRadius:22,backgroundColor:"#111",flexDirection:"row",justifyContent:"space-between",alignItems:"center"},
 bannerTitle:{color:"#fff",fontSize:25,fontWeight:"900"}, bannerText:{color:"#ddd",marginTop:3},
 bannerBtn:{backgroundColor:"#fff",paddingHorizontal:15,paddingVertical:8,borderRadius:10,marginTop:12,alignSelf:"flex-start"},
 bannerBtnText:{fontWeight:"800"},
 restaurant:{marginHorizontal:18,marginBottom:14,padding:12,borderRadius:18,borderWidth:1,borderColor:"#eee",flexDirection:"row",alignItems:"center"},
 restaurantImage:{width:72,height:72,borderRadius:16,backgroundColor:"#f5f5f5",alignItems:"center",justifyContent:"center"},
 restaurantName:{fontWeight:"900",fontSize:17,textAlign:"right"}, muted:{color:"#777",fontSize:12,marginTop:4,textAlign:"right"}, rating:{marginTop:5,fontWeight:"700"},
 bottom:{height:68,borderTopWidth:1,borderTopColor:"#eee",flexDirection:"row",justifyContent:"space-around",alignItems:"center"},
 restHero:{height:190,backgroundColor:"#f4f4f4",alignItems:"center",justifyContent:"center"},
 bigTitle:{fontSize:27,fontWeight:"900",textAlign:"right",marginBottom:5},
 product:{flexDirection:"row",alignItems:"center",marginBottom:14,padding:10,borderRadius:18,borderWidth:1,borderColor:"#eee"},
 productImg:{width:68,height:68,borderRadius:15,backgroundColor:"#f5f5f5",alignItems:"center",justifyContent:"center"},
 productName:{fontWeight:"900",fontSize:15,textAlign:"right"}, price:{fontWeight:"900",marginTop:6,textAlign:"right"},
 add:{width:38,height:38,borderRadius:12,backgroundColor:"#111",alignItems:"center",justifyContent:"center"}, addText:{color:"#fff",fontSize:25},
 cartBar:{position:"absolute",bottom:18,left:18,right:18,backgroundColor:"#111",borderRadius:16,padding:17,flexDirection:"row",justifyContent:"space-between"},
 cartText:{color:"#fff",fontWeight:"900"},
 cartItem:{paddingVertical:14,borderBottomWidth:1,borderBottomColor:"#eee",flexDirection:"row",alignItems:"center"},
 summary:{marginTop:25,padding:18,backgroundColor:"#f6f6f6",borderRadius:16,flexDirection:"row",justifyContent:"space-between",alignItems:"center"},
 total:{fontSize:20,fontWeight:"900"}, primary:{backgroundColor:"#111",padding:17,borderRadius:16,alignItems:"center",marginTop:18}, primaryText:{color:"#fff",fontSize:17,fontWeight:"900"},
 label:{fontWeight:"900",marginTop:22,marginBottom:8,textAlign:"right"}, input:{borderWidth:1,borderColor:"#ddd",borderRadius:14,padding:14,textAlign:"right",minHeight:55},
 payment:{borderWidth:1,borderColor:"#ddd",borderRadius:14,padding:16,flexDirection:"row",gap:12,alignItems:"center"}
})
