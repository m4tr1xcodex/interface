"use-client"
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarItem,
  Badge,
} from "@nextui-org/react";
import React, { useContext, useEffect, useState } from "react";
import {SocketContext} from '@/context/sockets';
import { DarkModeSwitch } from "./darkmodeswitch";

type borderColor = "default" | "success" | "danger" | "primary" | "secondary" | "warning"

export const UserDropdown = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [borderColor, setBorderColor] = useState<borderColor>("default");
  const socket = useContext(SocketContext);
  socket.on("connect", () => {
    setIsConnected(socket.connected);
  });
  socket.on("disconnect", () => {
    setIsConnected(socket.connected);
  });
  
  useEffect(()=>{
    setIsConnected(socket.connected);
    setBorderColor(isConnected ? "success" :"default");
  }, [isConnected, socket]);
  
  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
        <Badge
          isInvisible={!isConnected}
          isOneChar
          color={borderColor}
          placement="bottom-right"
          content=""
        >
          <Avatar
            as="button"
            color="default"
            isBordered
            size="md"
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          />
          </Badge>
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu
        aria-label="User menu actions"
        onAction={(actionKey) => console.log({ actionKey })}
      >
        <DropdownItem
          key="profile"
          className="flex flex-col justify-start w-full items-start"
        >
          <p>Signed in as</p>
          <p>zoey@example.com</p>
        </DropdownItem>
        <DropdownItem key="settings">My Settings</DropdownItem>
        <DropdownItem key="team_settings">Team Settings</DropdownItem>
        <DropdownItem key="analytics">Analytics</DropdownItem>
        <DropdownItem key="system">System</DropdownItem>
        <DropdownItem key="configurations">Configurations</DropdownItem>
        <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
        <DropdownItem key="logout" color="danger" className="text-danger ">
          Log Out
        </DropdownItem>
        <DropdownItem key="switch">
          <DarkModeSwitch />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
