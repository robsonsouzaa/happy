import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Switch, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import api from '../../services/api';

interface OrphanageDataRouteParams {
  position: {
    latitude: number;
    longitude: number;
  }
}
export default function OrphanageData() {
  const [nome, setNome] = useState('');
  const [sobre, setSobre] = useState('');
  const [instrucoes, setInstrucoes] = useState('');
  const [horarioFuncionamento, setHorarioFuncionamento] = useState('');
  const [abertoFimSemana, setAbertoFimSemana] = useState(true);
  const [imagens, setImagens] = useState<string[]>([]);

  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as OrphanageDataRouteParams;

  async function handleCreateOrphanage(){

    const { latitude, longitude } = params.position;

    const data = new FormData();

    data.append('nome', nome);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('sobre', sobre);
    data.append('instrucoes', instrucoes);
    data.append('horario_funcionamento', horarioFuncionamento);
    data.append('aberto_fim_semana', String(abertoFimSemana));

    imagens.forEach((imagem, index) => {
      data.append('imagem', {
        name: `imagem_${index}.jpg`,
        type: 'image/jpg',
        uri: imagem,
      } as any)
    })

    await api.post('orfanatos', data);

    navigation.navigate('OrphanagesMap');
  }

  async function handleSelectImages() {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();

    if (status !== 'granted') {
      alert('Olá, precisamos de acesso às suas fotos... ');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (result.cancelled) {
      return;
    }

    const { uri: imagem } = result;

    setImagens([...imagens, imagem]);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
      <Text style={styles.title}>Dados</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>Sobre</Text>
      <TextInput
        style={[styles.input, { height: 110 }]}
        multiline
        value={sobre}
        onChangeText={setSobre}
      />

      {/* <Text style={styles.label}>Whatsapp</Text>
      <TextInput
        style={styles.input}
      /> */}

      <Text style={styles.label}>Fotos</Text>

      <View style={styles.uploadedImagesContainer}>
        {imagens.map(imagem => {
          return (
            <Image 
              key={imagem}
              source={{ uri: imagem }}
              style={styles.uploadedImage}
            />
          );
        })}
      </View>
      <TouchableOpacity style={styles.imagesInput} onPress={handleSelectImages}>
        <Feather name="plus" size={24} color="#15B6D6" />
      </TouchableOpacity>

      <Text style={styles.title}>Visitação</Text>

      <Text style={styles.label}>Instruções</Text>
      <TextInput
        style={[styles.input, { height: 110 }]}
        multiline
        value={instrucoes}
        onChangeText={setInstrucoes}
      />

      <Text style={styles.label}>Horario de visitas</Text>
      <TextInput
        style={styles.input}
        value={horarioFuncionamento}
        onChangeText={setHorarioFuncionamento}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Atende final de semana?</Text>
        <Switch 
          thumbColor="#fff" 
          trackColor={{ false: '#ccc', true: '#39CC83' }}
          value={abertoFimSemana}
          onValueChange={setAbertoFimSemana}
        />
      </View>

      <RectButton style={styles.nextButton} onPress={handleCreateOrphanage}>
        <Text style={styles.nextButtonText}>Cadastrar</Text>
      </RectButton>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    color: '#5c8599',
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 0.8,
    borderBottomColor: '#D3E2E6'
  },

  label: {
    color: '#8fa7b3',
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 8,
  },

  comment: {
    fontSize: 11,
    color: '#8fa7b3',
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1.4,
    borderColor: '#d3e2e6',
    borderRadius: 20,
    height: 56,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 16,
    textAlignVertical: 'top',
  },

  uploadedImagesContainer: {
    flexDirection: 'row',
  },

  uploadedImage: {
    width: 64,
    height: 64,
    borderRadius: 20,
    marginBottom: 32,
    marginRight: 8,
  },

  imagesInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderStyle: 'dashed',
    borderColor: '#96D2F0',
    borderWidth: 1.4,
    borderRadius: 20,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },

  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },

  nextButton: {
    backgroundColor: '#15c3d6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    marginTop: 32,
  },

  nextButtonText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#FFF',
  }
})