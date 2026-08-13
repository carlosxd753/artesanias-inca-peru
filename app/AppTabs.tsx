import { createDrawerNavigator } from "@react-navigation/drawer";

import { HomePedidosScreen } from "../presentation/screens/HomePedidosScreen";
import { AboutScreen } from "../presentation/screens/AboutScreen";
import { MyProfileScreen } from "../presentation/screens/MyProfileScreen";
import { ProductsScreen } from "../presentation/screens/ProductsScreen";
import { InspiracionScreen } from "../presentation/screens/InspiracionScreen";

const Drawer = createDrawerNavigator();

export default function AppNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,

        headerStyle: {
          backgroundColor: "#0f172a",
          height: 90,
        },

        headerTitleStyle: {
          color: "#ffffff",
          fontSize: 18,
          fontWeight: "800",
        },

        headerTintColor: "#6366f1",

        drawerStyle: {
          backgroundColor: "#0f172a",
          width: 290,
        },

        drawerLabelStyle: {
          color: "#cbd5e1",
          fontSize: 15,
          fontWeight: "600",
        },

        drawerActiveTintColor: "#ffffff",
        drawerActiveBackgroundColor: "#6366f1",

        drawerInactiveTintColor: "#94a3b8",
      }}
    >
      <Drawer.Screen name="Pedidos" component={HomePedidosScreen} />

      <Drawer.Screen name="Productos" component={ProductsScreen} />

      <Drawer.Screen name="Inspiración" component={InspiracionScreen} />

      <Drawer.Screen name="Sobre la aplicación" component={AboutScreen} />

      <Drawer.Screen name="Mi perfil" component={MyProfileScreen} />
    </Drawer.Navigator>
  );
}
