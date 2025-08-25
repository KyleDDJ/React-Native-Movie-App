import { settings } from "@/constants/settings";
import React, { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Profile = () => {
  const [username, setUsername] = useState("John Doe");
  const [is_modal_visible, setModalVisible] = useState(false);
  const [temp_name, setTempName] = useState(username);

  const Separator = () => <View className="h-[1px] bg-gray-700 my-3" />;

  const openEditModal = () => {
    setTempName(username);
    setModalVisible(true);
  };

  const saveProfile = () => {
    setUsername(temp_name);
    setModalVisible(false);
  };

  return (
    <View className="bg-primary flex-1 px-5 pt-20">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="items-center mb-10">
          <TouchableOpacity
            onPress={openEditModal}
            className="items-center mb-10"
          >
            <Image
              source={require("@/assets/images/joji.jpg")}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
            <Text className="text-white text-xl font-bold mt-4">
              {username}
            </Text>
            <Text className="text-gray-400 text-base mt-1">
              johndoe@email.com
            </Text>
          </TouchableOpacity>
        </View>

        {settings.map((section, index) => (
          <View key={index} className="mb-5">
            <Text className="text-accent text-lg mb-3 mt-3">
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

        <View className="justify-center items-center">
          <Text className="text-gray-400 text-base mt-1">
            App Version: 1.0.0
          </Text>
        </View>
      </ScrollView>

      <Modal visible={is_modal_visible} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/60">
          <View className="bg-primary w-80 p-5 rounded-xl">
            <Text className="text-white text-lg font-bold mb-3">
              Edit Username
            </Text>
            <TextInput
              onChangeText={setTempName}
              value={temp_name}
              placeholder="Enter new username"
              placeholderTextColor="#999"
              className="bg-dark-200 text-white p-3 rounded-md mb-5"
            />
            <View className="flex-row justify-end gap-3">
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text className="text-gray-400 text-lg font-bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveProfile}>
                <Text className="text-accent text-lg font-bold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Profile;
