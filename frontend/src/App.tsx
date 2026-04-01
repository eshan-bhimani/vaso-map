import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import MapExplorer from './pages/MapExplorer';
import FlashcardsHome from './pages/FlashcardsHome';
import FlashcardStudy from './pages/FlashcardStudy';

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <MapExplorer /> },
      { path: '/flashcards', element: <FlashcardsHome /> },
      { path: '/flashcards/:deckId', element: <FlashcardStudy /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
