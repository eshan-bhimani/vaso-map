import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar';

export function AppShell() {
  return (
    <div className="flex flex-col h-screen bg-bg-base overflow-hidden">
      <NavBar />
      <Outlet />
    </div>
  );
}
