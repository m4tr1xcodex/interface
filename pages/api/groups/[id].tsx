import NextCors from 'nextjs-cors';
import {prisma} from '@/libs/prisma';
import type { NextApiRequest, NextApiResponse } from "next";
import { socket } from "@/context/sockets";

interface Values{
  url: string,
  description: string,
  estado: string,
  microsegmento: string,
  started: boolean,
  finished: boolean
}
interface Id{
  id?: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  
  const { 
    id
  } = req.query;
  const {
    url,
    description,
    estado,
    microsegmento,
    started,
    finished,
  } = req.body;
  
  const values:Values = {
    url,
    description,
    estado,
    microsegmento,
    started,
    finished,
  };
  //if (url) values.url = url;
  //if (description) values.descripcion = description;
  //if (estado) values.estado = estado;
  //if (microsegmento) values.microsegmento = microsegmento
  //if (started) values.started = started
  //if (finished) values.finished = finished
  
  switch(req.method){
    case 'GET':
      try{
        const getGroup = await prisma.group.findFirst({
          where: {
            id: Number(id),
          },
        });
  
        if(!getGroup){
          return res.status(404).json({
            message: "Group not found"
          });
        }
        return res.json(getGroup);
      }catch(err:any){
        console.log(err)
        console.log('keys: ', Object.keys(err));
        console.log('error.errorCode: ', err?.errorCode);
        console.error(JSON.stringify(err, null, 2));
        return res.status(500).json({
          message: "Server error",
          data: err
        });
      }
    case 'PUT':
      const group = await prisma.group.findUnique({
        where: {
          id: Number(id),
        },
      });
      if(!group) return res.status(404).json({ message: "Group not found"});

      try{
        let updated = await prisma.group.update({
          where: {
            id: Number(id),
          },
          data: req.body,
        });
        if(updated?.finished){
          console.log("Emit to socket event");
          socket.emit('scrapp-completed', true)
        }
        
        return res.status(200).json({
          status: 'success',
          message: "Updated successfully",
        });
      }catch(e:any){
        return res.status(500).json({
          status: 'error',
          message: e.message
        });
      }
    case 'DELETE':
      // Delete a specific post by its ID
      if(!id) return res.status(400).json({ error: "Missing parameter: `groupId`" });
      try{
        await prisma.group.delete({
          where: {
            id: Number(id),
          },
        });
        return res.status(200).json({
          status: 'success',
          message: "Record delete succefully"
        });
      }catch(err){
        return res.status(500).json({
          status: 'error',
          message: "Error to delete record",
          details: err
        });
      }

    default: return res.status(401).json({
      message: `The ${req.method} is not suported for this route`
    })
  }
}