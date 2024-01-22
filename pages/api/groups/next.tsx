import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/libs/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const getGroup = await prisma.group.findFirst({
      where: {
        finished: false,
        started: false,
      },
    });

    if (!getGroup) {
      return res.status(404).json({
        status: "error",
        message: "No more groups found",
      });
    }
    const updatedGroup = await prisma.group.update({
      where: { id: getGroup?.id },
      data: { started: true },
    });
    return res.status(200).json(updatedGroup);
  } catch (err: any) {
    console.log(err);
    console.log("keys: ", Object.keys(err));
    console.log("error.errorCode: ", err?.errorCode);
    console.error(JSON.stringify(err, null, 2));
    return res.status(500);
  }
}
