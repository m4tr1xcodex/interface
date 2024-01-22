"use client";
import React from "react";
import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Link,
} from "@nextui-org/react";
import { VerticalDots } from "@/components/icons/table/vertical-dots";
import { openNewBackgroundTab } from "@/libs/functions";
import toast from "react-hot-toast";

interface Group {
  id: number;
  url: string;
  estado: string;
  microsegmento: string;
  started: boolean;
  finished: boolean;
}

const Groups = () => {
  // Define a state variable "items" and a function "setItems" to update the state
  const [items, setItems] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use the useEffect hook to fetch data from the API endpoint when the component mounts
  useEffect(() => {
    toast
      .promise(
        fetch("/api/groups/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }),
        {
          loading: "Cargando grupos...",
          success: "Grupos cargados correctamente",
          error: "Error al obtener los grupos",
        }
      )
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setIsLoading(false);
      });
    return () => {};
  }, []);

  const startScrapingGroup = async (item: Group, index: number) => {
    await fetch(`/api/groups/${item.id}`, {
      method: "PUT",
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        started: true,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        let spliceItems = items.splice(index, 1);
        setItems([
          ...items,
          {
            ...{
              ...item,
              started: true,
            },
          },
        ]);
        setTimeout(() => {
          let u = `${item.url}/members?exp_grp=1&estado=${item.estado}&microsegmento=${item.microsegmento}&scrap_id=${item.id}`;
          openNewBackgroundTab(u);
        }, 2e3);
      });
  };

  // Return the JSX elements wrapped in a Material-UI Grid container
  return (
    <div className="w-full px-8">
      <div className="my-4 flex justify-between">
        <h1 className="text-xl">Lista de enlaces de grupos de facebook</h1>
        <Link
          className="bg-blue-600 rounded-lg px-2 py-0 text-white"
          size="sm"
          href="/groups/new"
        >
          Agregar nuevo grupo
        </Link>
      </div>
      <div className="rounded-2xl overflow-hidden">
        <Table
          aria-label="Example static collection table"
          radius="none"
          bottomContent={
            isLoading ? (
              <div className="flex w-full justify-center">
                <Spinner color="white" size="sm" />
                <span className="ml-4">Cargando</span>
              </div>
            ) : null
          }
        >
          <TableHeader>
            <TableColumn>URL</TableColumn>
            <TableColumn>Estado</TableColumn>
            <TableColumn>Microsegmento</TableColumn>
            <TableColumn>Iniciado</TableColumn>
            <TableColumn>Terminado</TableColumn>
            <TableColumn>Acciones</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No hay grupos para mostrar."}>
            {items?.map((item: Group, index: number) => (
              <TableRow key={item.id}>
                <TableCell>{item.url}</TableCell>
                <TableCell>{item.estado}</TableCell>
                <TableCell>{item.microsegmento}</TableCell>
                <TableCell>{item.started ? "Si" : "No"}</TableCell>
                <TableCell>{item.finished ? "Si" : "No"}</TableCell>
                <TableCell>
                  <div className="relative flex justify-end items-center gap-2">
                    <Dropdown className="bg-background border-1 border-default-200">
                      <DropdownTrigger>
                        <Button
                          isIconOnly
                          radius="full"
                          size="sm"
                          variant="light"
                        >
                          <VerticalDots className="text-default-300" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu className="justify-center">
                        <DropdownItem
                          isDisabled={item.started}
                          onClick={(e) => startScrapingGroup(item, index)}
                          className="justify-center"
                        >
                          Iniciar
                        </DropdownItem>
                        <DropdownItem>Editar</DropdownItem>
                        <DropdownItem>Eliminar</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Groups;
