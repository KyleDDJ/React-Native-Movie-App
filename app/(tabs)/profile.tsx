import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const Separator = () => <View className="h-[1px] bg-gray-700 my-3" />;

const settings = [
  {
    section: "Profile",
    items: [
      { label: "Username / Avatar", color: "text-white" },
      { label: "Email", color: "text-white" },
    ],
  },
  {
    section: "Security",
    items: [
      { label: "Change Password", color: "text-white" },
      { label: "Login Activity", color: "text-white" },
    ],
  },
  {
    section: "Preferences",
    items: [
      { label: "Language", color: "text-white" },
      { label: "Notifications", color: "text-white" },
    ],
  },
  {
    section: "Watchlist & History",
    items: [
      { label: "Manage Watchlist", color: "text-white" },
      { label: "Recently Watched", color: "text-white" },
    ],
  },
  {
    section: "Subscription",
    items: [
      { label: "Plan & Billing", color: "text-white" },
      { label: "Upgrade / Cancel", color: "text-white" },
    ],
  },
  {
    section: "Privacy",
    items: [
      { label: "Account Privacy", color: "text-white" },
      { label: "Sign Out", color: "text-yellow-200" },
      { label: "Delete Account", color: "text-red-500" },
    ],
  },
];

const Profile = () => {
  return (
    <View className="bg-primary flex-1 px-5 pt-20">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="items-center mb-10">
          <Image
            source={require("@/assets/images/joji.jpg")}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
          <Text className="text-white text-xl font-bold mt-4">John Doe</Text>
          <Text className="text-gray-400 text-base mt-1">
            johndoe@email.com
          </Text>
        </View>
        {settings.map((section, index) => (
          <View key={index} className="mb-5">
            <Text className="text-accent text-sm mb-3 mt-3">
              {section.section}
            </Text>

            {section.items.map((item, i) => (
              <View key={i}>
                <TouchableOpacity>
                  <Text className={`${item.color} text-xl mb-5 font-bold`}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
            {index < settings.length - 1 && <Separator />}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Profile;
