import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/libs/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST")
    return res
      .status(401)
      .json({
        message: `The ${req.method} method is not supported for this route.`,
      });

    const {
      url,
      estado,
      microsegmento,
      description,
      started,
      finished,
    } = req.body;
    
    const getGroup = await prisma.group.findFirst({
      where: {
        url: url,
      },
    });
    if(getGroup) return res.status(404).json({
      status: 'error',
      message: 'This URL already exists in the database.'
    });
    
    try{
      const group = await prisma.group.create({
        data: {
          url,
          estado,
          microsegmento,
          description,
          started,
          finished
        },
      });
      
      return res.status(201).json(group);
    }catch(err:any){
      console.log(err)
      console.log('keys: ', Object.keys(err));
      console.log('error.errorCode: ', err?.errorCode);
      console.error(JSON.stringify(err, null, 2));
      return res.status(500).json({
        status: 'error',
        message: "Error to create a record",
        details: err
      });
    }

    //res.end(`Post: ${gid}`);
}
