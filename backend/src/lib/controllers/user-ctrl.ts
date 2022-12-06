/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from "express";
import UserRepository from "../repositories/user-repo";
import UserFactory from "../factories/user-factory";
import { validate } from "jsonschema";
import RemoveUsersSchema from "../jsonschema/api/RemoveUsers.json";
import { Role } from "../models/user";
import logger from "../services/logger";
const escapeHtml = require("escape-html");

const authenticationRequired = process.env.AUTHENTICATION_REQUIRED === "true";

async function getUsers(req: Request, res: Response) {
    const repo = UserRepository.getInstance();
    try {
        const users = await repo.listUsers();
        return res.json(users);
    } catch (error) {
        res.status(500).send(error);
    }
}

async function addUsers(req: Request, res: Response) {
    const { role, emails } = req.body;

    if (!role) {
        res.status(400).send("Missing required body `role`");
        return;
    }

    if (
        role !== Role.Admin &&
        role !== Role.Editor &&
        role !== Role.Publisher &&
        role !== Role.Public
    ) {
        res.status(400).send("Invalid role value");
        return;
    }

    if (!authenticationRequired && role === Role.Public) {
        res.status(400).send("Public role not enabled for instance");
        return;
    }

    if (!emails) {
        res.status(400).send("Missing required body `emails`");
        return;
    }

    const userEmails = (emails as string).split(",");
    const escapedEmails = userEmails.map((email) => escapeHtml(email));

    for (const userEmail of escapedEmails) {
        if (!emailIsValid(userEmail)) {
            res.status(400).send(`Invalid email: ${userEmail}`);
            return;
        }
    }

    const repo = UserRepository.getInstance();
    try {
        await repo.addUsers(userEmails.map((email) => UserFactory.createNew(email, role)));
        return res.send();
    } catch (error) {
        // Don't return error which may reveal that user already exists
        logger.error(error);
        res.status(400).send("Bad Request");
    }
}

async function removeUsers(req: Request, res: Response) {
    const validationResult = validate(req.body, RemoveUsersSchema);
    if (!validationResult.valid) {
        res.status(400);
        logger.warn("Invalid request to remove users %o", validationResult.errors);
        return res.send(validationResult.toString());
    }

    const { usernames } = req.body;
    const repo = UserRepository.getInstance();

    logger.info("Deleting users %o", usernames);
    repo.removeUsers(usernames);

    logger.info("Users deleted successfully");
    return res.send();
}

async function resendInvite(req: Request, res: Response) {
    const { emails } = req.body;

    if (!emails) {
        res.status(400).send("Missing required body `emails`");
        return;
    }

    const userEmails = (emails as string).split(",");
    const escapedEmails = userEmails.map((email) => escapeHtml(email));

    for (const userEmail of escapedEmails) {
        if (!emailIsValid(userEmail)) {
            res.status(400).send(`Invalid email: ${userEmail}`);
            return;
        }
    }

    const repo = UserRepository.getInstance();
    try {
        await repo.resendInvite(userEmails.map((email) => email.split("@")[0]));
        return res.send();
    } catch (error) {
        res.status(500).send(error);
    }
}

async function changeRole(req: Request, res: Response) {
    const { role, usernames } = req.body;

    if (!role) {
        res.status(400).send("Missing required body `role`");
        return;
    }

    if (
        role !== Role.Admin &&
        role !== Role.Editor &&
        role !== Role.Publisher &&
        role !== Role.Public
    ) {
        res.status(400).send("Invalid role value");
        return;
    }

    if (!authenticationRequired && role === Role.Public) {
        res.status(400).send("Public role not enabled for instance");
        return;
    }

    if (!usernames) {
        res.status(400).send("Missing required body `usernames`");
        return;
    }

    const repo = UserRepository.getInstance();
    try {
        await repo.changeRole(usernames, role);
        return res.send();
    } catch (error) {
        // Don't return error which may reveal that user doesn't exists
        logger.error(error);
        res.status(400).send("Bad Request");
    }
}

/**
 * The most effective method consists in checking for @-sign somewhere in the email address.
 * Then sending a verification email to given email address.
 * If the end user can follow the validation instructions in the email message, the email address is correct.
 * @param email
 * @returns boolean
 */
function emailIsValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+$/.test(email);
}

export default {
    getUsers,
    addUsers,
    resendInvite,
    changeRole,
    removeUsers,
};
