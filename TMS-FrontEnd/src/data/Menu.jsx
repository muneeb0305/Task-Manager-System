import { ClipboardDocumentIcon, HomeIcon, UserIcon, UsersIcon } from "@heroicons/react/24/solid";

export const adminMenu = [
  { title: "Dashboard", icon: <HomeIcon className="w-6 h-6" />, path: '/' },
  { title: "Teams", icon: <UsersIcon className="w-6 h-6" />, path: '/team' },
  { title: "Projects", icon: <ClipboardDocumentIcon className="w-6 h-6" />, path: '/project' },
  { title: "Users", icon: <UserIcon className="w-6 h-6" />, path: '/user' },
]
