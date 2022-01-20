import React from "react";

import { Platform } from "react-native";

import { useTheme } from "styled-components/native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Orders } from "../screens/Orders";
import { Home } from "../screens/Home";
import { BottomMenu } from "../components/BottomMenu";
import firestores from "@react-native-firebase/firestore";
import { OrderProps } from "../components/OrderCard";
import { useAuth } from "../hooks/auth";
const { Navigator, Screen } = createBottomTabNavigator();

export function UserTabRoutes() {
  const [notifications, setNotifications] = React.useState("0");
  const { COLORS } = useTheme();
  const { user } = useAuth();

  React.useEffect(() => {
    const subscribe = firestores()
      .collection("orders")
      .where("waiter_id", "==", user?.id)
      .where("status", "==", "Pronto")
      .onSnapshot((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        }) as OrderProps[];
        setNotifications(data.length.toString());
      });

    return () => subscribe();
  }, []);

  return (
    <Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.SECONDARY_900,
        tabBarInactiveTintColor: COLORS.SECONDARY_400,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 80,
          paddingVertical: Platform.OS === "ios" ? 20 : 0,
        },
      }}
    >
      <Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <BottomMenu title="Cardápio" color={color} />
          ),
        }}
      />
      <Screen
        name="orders"
        component={Orders}
        options={{
          tabBarIcon: ({ color }) => (
            <BottomMenu
              title="Pedidos"
              color={color}
              notifications={notifications}
            />
          ),
        }}
      />
    </Navigator>
  );
}
