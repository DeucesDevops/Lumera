import { Tabs } from "expo-router";
import { BookOpen, CalendarDays, Home, UserRound, Waves } from "lucide-react-native";

const iconColor = (focused: boolean) => (focused ? "#A23D72" : "#94818F");

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#A23D72",
        tabBarInactiveTintColor: "#94818F",
        tabBarStyle: {
          backgroundColor: "#FFF7F1",
          borderTopColor: "rgba(162, 61, 114, 0.14)",
          height: 82,
          paddingBottom: 22,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Today",
          tabBarIcon: ({ focused }) => <Home size={21} color={iconColor(focused)} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ focused }) => <CalendarDays size={21} color={iconColor(focused)} />,
        }}
      />
      <Tabs.Screen
        name="pregnancy"
        options={{
          title: "Pregnancy",
          tabBarIcon: ({ focused }) => <Waves size={21} color={iconColor(focused)} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: "Learn",
          tabBarIcon: ({ focused }) => <BookOpen size={21} color={iconColor(focused)} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => <UserRound size={21} color={iconColor(focused)} />,
        }}
      />
    </Tabs>
  );
}
