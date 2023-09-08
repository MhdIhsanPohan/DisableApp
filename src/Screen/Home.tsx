import {
  Platform,
  StyleSheet,
  Text,
  View,
  Linking,
  Alert,
  BackHandler,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

const Home = () => {
  const [userLocation, setUserLocation] = useState(null);
  const targetLocation = {
    latitude: 3.63413, // Ganti dengan koordinat lintang titik target Anda
    longitude: 98.7084,
  };

  useEffect(() => {
    const getLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        watchUserLocation();
      }
    };

    const watchUserLocation = async () => {
      try {
        const locationTask = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000, // Interval dalam milidetik
            distanceInterval: 10, // Jarak dalam meter
          },
          (location) => {
            setUserLocation(location.coords);
            const distance = calculateDistance(
              location.coords.latitude,
              location.coords.longitude,
              targetLocation.latitude,
              targetLocation.longitude
            );
            if (distance > 100) {
              // Di sini Anda dapat mengimplementasikan logika menampilkan pesan atau meminta pengguna untuk keluar
              Alert.alert(
                "Anda berada di luar jarak 100 meter dari titik target.",
                "Apakah Anda ingin keluar dari aplikasi?",
                [
                  {
                    text: "Tidak",
                    onPress: () => console.log("Tidak"),
                    style: "cancel",
                  },
                  {
                    text: "Ya",
                    onPress: () => BackHandler.exitApp(),
                  },
                ]
              );
            } else {
              // Jarak masih dalam 100 meter
              // Menampilkan pesan "Jarak masih aman"
              Alert.alert("Jarak masih aman");
            }
          }
        );
      } catch (error) {
        console.error("Error watching user location: ", error);
      }
    };

    getLocationPermission();

    return () => {
      Location.stopLocationUpdatesAsync("userLocationTask");
    };
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius Bumi dalam kilometer
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000; // Jarak dalam meter
    return distance;
  };
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: targetLocation.latitude,
          longitude: targetLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={targetLocation}
          title="Target Location"
          description="Deskripsi Target Location"
        />
      </MapView>
      <Text>User Location: {JSON.stringify(userLocation)}</Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: "100%",
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
