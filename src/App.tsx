import { useMessageStore } from './store/messageStore';
import { HomeScreen } from './components/setup/HomeScreen';
import { BuilderLayout } from './components/builder/BuilderLayout';

function App() {
  const view = useMessageStore((s) => s.view);
  if (view === 'builder') return <BuilderLayout />;
  return <HomeScreen />;
}

export default App;
