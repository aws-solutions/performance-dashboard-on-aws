import { Request, Response } from "express";

async function listDashboards(req: Request, res: Response) {
    return res.json([
        {
            id: 'abc',
            name: 'Safer Streets for Cycling and Pedestrians',
            topicArea: {
                id: '123',
                name: 'Environmental Impact',
                createdBy: 'johndoe',
            }
        }
    ]);
}

async function getDashboardById(req: Request, res: Response) {
    res.json({
        id: 'abc',
        name: 'Safer Streets for Cycling and Pedestrians',
        topicArea: {
            id: '123',
            name: 'Environmental Impact',
            createdBy: 'johndoe',
        }
    })
}

export default {
    listDashboards,
    getDashboardById,
}