import { Stack } from 'expo-router';
import Header from './Header';
export default function ModalsLayout() {
  return (
    <Stack screenOptions={{ header: () => <Header /> }}>
      <Stack.Screen
        name="log"
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="post"
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack>
  );
} 