/**
 * Custom bottom tab layout for the application
 *
 * This file configures the bottom navigation using `expo-router` Tabs.
 * Each tab uses a custom `TabIcon` component to display active/inactive states.
 */

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Tabs } from "expo-router"; // Navigation Tabs from expo-router
import React from "react";
import { Image, ImageBackground, Text, View } from "react-native";

/**
 * Renders a custom tab icon for the bottom navigation bar.
 *
 * @param {Object} props
 * @param {boolean} props.focused - Indicates if the tab is currently active.
 * @param {any} props.icon - The icon image source.
 * @param {string} props.title - The tab label.
 *
 * @returns {JSX.Element} A styled tab icon (highlighted if focused).
 */
function TabIcon({ focused, icon, title }: any) {
  if (focused) {
    return (
      // Active state: shows highlighted background and label
      <ImageBackground
        source={images.highlight}
        className="flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden"
      >
        <Image source={icon} tintColor="#151312" className="size-5" />
        <Text className="text-secondary text-base font-semibold ml-2">
          {title}
        </Text>
      </ImageBackground>
    );
  }
  // Inactive state: shows only the icon
  return (
    <View className="size-full justify-center items-center mt-4 rounded-full">
      <Image source={icon} tintColor="#A8B5DB" className="size-5" />
    </View>
  );
}

/**
 * Main bottom tab layout component.
 *
 * - Configures the tab bar style (rounded, floating, custom colors).
 * - Uses `TabIcon` for custom icons and labels.
 * - Defines four screens: Home, Search, Saved, and Profile.
 *
 * @returns {JSX.Element} The configured Tabs layout.
 */
const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: "#0f0d23",
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 52,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "0f0D23",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.search} title="Search" />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.save} title="Saved" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.person} title="Profile" />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
