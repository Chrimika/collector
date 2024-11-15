import React, { useState } from "react";
import { View, StyleSheet, Alert, Image } from "react-native";
import { TextInput, Button, Text, Card, Avatar } from "react-native-paper";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const DataCollectionForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(null);
  const [photo, setPhoto] = useState(null);

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission refusée", "L'accès à la localisation est requis.");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!name || !email || !description || !location || !photo) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("description", description);
    formData.append("latitude", location.latitude);
    formData.append("longitude", location.longitude);
    formData.append("photo", {
      uri: photo,
      name: "photo.jpg",
      type: "image/jpeg",
    });

    try {
      const response = await axios.post("https://example.com/api/endpoint", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Alert.alert("Succès", "Les données ont été envoyées.");
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue lors de l'envoi.");
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title="Formulaire de collecte"
          subtitle="Remplissez les champs pour envoyer vos données"
          left={(props) => <Avatar.Icon {...props} icon="form-textbox" />}
        />
        <Card.Content>
          <TextInput
            label="Nom"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
          />
          <Button
            icon="map-marker"
            mode="contained"
            onPress={getLocation}
            style={styles.button}
          >
            Obtenir ma position
          </Button>
          {location && (
            <Text style={styles.location}>
              📍 Latitude: {location.latitude}, Longitude: {location.longitude}
            </Text>
          )}
          <Button
            icon="camera"
            mode="contained"
            onPress={pickImage}
            style={styles.button}
          >
            Prendre une photo
          </Button>
          {photo && <Image source={{ uri: photo }} style={styles.image} />}
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={handleSubmit} style={styles.submitButton}>
            Envoyer
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  card: {
    elevation: 3,
    borderRadius: 10,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginVertical: 10,
    backgroundColor: "#6200ee",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#03dac6",
    marginHorizontal: 10,
  },
  location: {
    fontSize: 14,
    marginTop: 10,
    fontStyle: "italic",
    color: "#555",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
});

export default DataCollectionForm;
