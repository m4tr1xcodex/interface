import React, { useEffect, useState } from "react";
import { Input, Select, SelectItem, Textarea, Button } from "@nextui-org/react";
import { estados, microsegmentos } from "@/libs/data";
import { NewGroupFromFile } from "../forms/new-group-from-file";
import { openNewBackgroundTab, removeTrailingSlash } from "@/libs/functions";
import toast from "react-hot-toast";

interface NewGroup {
  currentKey: string;
}
export const NewGroup = () => {
  const [url, setUrl] = useState<string>("");
  const [estado, setEstado] = useState<string>("");
  const [microsegmento, setMicrosegmento] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");

  const handleSelectionEstado = (e: any) => {
    setEstado(e.target.value);
  };

  const handleSelectionMicrosegmento = (e: any) => {
    setMicrosegmento(e.target.value);
  };

  const handleChangeDescription = (e: any) => {
    setDescripcion(e.target.value);
  };

  useEffect(() => {
    console.log(estado, microsegmento);
  }, [estado, microsegmento]);

  const clear = () => {
    setUrl("");
    setEstado("");
    setMicrosegmento("");
    setDescripcion("");
  };

  const save = async (toRun = false) => {
    if (url) {
      let body = {
        url: removeTrailingSlash(url),
        estado,
        microsegmento,
        description: descripcion,
        started: toRun,
      };
      await fetch("/api/groups/create", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result?.status == "error") {
            if (result?.message) toast.error(result.message);
          } else {
            clear();
            toast.success("Grupo guardado correctamente");
            if (toRun) {
              const { id } = result;
              let u = `${removeTrailingSlash(url)}/members?exp_grp=1${
                estado ? `&estado=${estado}` : null
              }${
                microsegmento ? `&microsegmento=${microsegmento}` : null
              }${`&scrap_id=${id}`}`;
              let loadingToast = toast.loading("Iniciando...");
              setTimeout(() => {
                openNewBackgroundTab(u);
                toast.dismiss(loadingToast);
              }, 4e3);
            }
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Error al guardar el grupo");
        });
    } else {
      toast.custom(
        <>
          <div className="px-4 py-2 bg-sky-600 rounded-md shadow shadow-black dark:shadow-white">
            <span className="text-white">
              Ingresa una url de grupos correctamente
            </span>
          </div>
        </>
      );
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">
        Guardar grupo para futuro scrapping
      </h3>
      <div className="flex flex-col gap-5 justify-center w-full">
        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
          <Input
            isRequired
            radius="sm"
            type="email"
            label="Url del grupo"
            value={url}
            placeholder="https://facebook.com/groups/23928273849238"
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
          <Select
            label="Estado"
            placeholder="Selecciona un estado"
            radius="sm"
            className="flex-1"
            selectedKeys={estado ? [estado] : []}
            onChange={handleSelectionEstado}
            items={estados}
          >
            {(estado) => (
              <SelectItem key={estado.value}>{estado.value}</SelectItem>
            )}
          </Select>
          <Select
            label="Microsegmento"
            placeholder="Selecciona un microsegmento"
            radius="sm"
            className="flex-1"
            selectedKeys={microsegmento ? [microsegmento] : []}
            onChange={handleSelectionMicrosegmento}
            items={microsegmentos}
          >
            {(microsegmento) => (
              <SelectItem key={microsegmento.value}>
                {microsegmento.value}
              </SelectItem>
            )}
          </Select>
        </div>
        <div className="w-full">
          <Textarea
            label="Descripción"
            placeholder="Ingresa tu descripción"
            radius="sm"
            className="flex-1"
            value={descripcion}
            onChange={handleChangeDescription}
          />
        </div>
        <div className="w-full flex justify-end gap-4">
          <NewGroupFromFile />
          <Button color="primary" radius="sm" onClick={() => save(true)}>
            Guardar e iniciar
          </Button>
          <Button color="primary" radius="sm" onClick={() => save()}>
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
};
