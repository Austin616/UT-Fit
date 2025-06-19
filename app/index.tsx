import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Page</Text>
      <Link href="/profile">Go to Profile</Link>
      <Link href="/log">Go to Log</Link>
    </View>
  );
}
