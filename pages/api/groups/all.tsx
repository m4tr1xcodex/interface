import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/libs/prisma";

export default async function habdler(req: NextApiRequest, res: NextApiResponse) {
    try{
        const groups = await prisma.group.findMany();

        return res.json(groups);
    }catch(err){
        console.log(err)
        console.log('keys: ', Object.keys(err));
        console.log('error.errorCode: ', err?.errorCode);
        console.error(JSON.stringify(err, null, 2));
        return res.status(500);
    }
}