/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from "express";
import TopicAreaFactory from "../factories/topicarea-factory";
import TopicAreaRepository from "../repositories/topicarea-repo";

async function listTopicAreas(req: Request, res: Response) {
    const repo = TopicAreaRepository.getInstance();
    const topicareas = await repo.list();
    res.json(topicareas);
}

async function createTopicArea(req: Request, res: Response) {
    const user = req.user;
    const { name } = req.body;

    if (!name) {
        res.status(400).send("Missing required field `name`");
        return;
    }

    const topicarea = TopicAreaFactory.createNew(name, user);

    const repo = TopicAreaRepository.getInstance();
    await repo.create(topicarea);
    res.json(topicarea);
}

async function getTopicAreaById(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
        res.status(400).send("Missing required field `id`");
        return;
    }

    const repo = TopicAreaRepository.getInstance();
    const topicArea = await repo.getTopicAreaById(id);
    res.json(topicArea);
}

async function updateTopicArea(req: Request, res: Response) {
    const user = req.user;
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        res.status(400).send("Missing required field `name`");
        return;
    }

    const repo = TopicAreaRepository.getInstance();
    await repo.renameTopicArea(id, name, user);
    res.send();
}

async function deleteTopicArea(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
        res.status(400).send("Missing required param `id`");
        return;
    }

    const repo = TopicAreaRepository.getInstance();
    const dashboardCount = await repo.getDashboardCount(id);

    if (dashboardCount > 0) {
        return res.status(409).send("Topic Area has dashboards associated to it");
    }

    await repo.delete(id);
    res.send();
}

export default {
    createTopicArea,
    listTopicAreas,
    getTopicAreaById,
    updateTopicArea,
    deleteTopicArea,
};
