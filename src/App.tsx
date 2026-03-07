import './ui/theme.css';
import './index.css';
import { useMessageStore } from './store/messageStore';
import { HomeScreen } from './components/setup/HomeScreen';
import { MessageSetup } from './components/setup/MessageSetup';
import { BuilderLayout } from './components/builder/BuilderLayout';

function App() {
  const view = useMessageStore((s) => s.view);
  if (view === 'setup') return <MessageSetup />;
  if (view === 'builder') return <BuilderLayout />;
  return <HomeScreen />;
}

export default App;
