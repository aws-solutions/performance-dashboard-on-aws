/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { render, act, screen } from "@testing-library/react";
import { useTopicArea, useTopicAreas } from "../topicarea-hooks";
import BackendService from "../../services/BackendService";

describe("useTopicArea", () => {
    interface Props {
        topicAreaId: string;
    }
    const FooComponent = (props: Props) => {
        const { topicarea } = useTopicArea(props.topicAreaId);
        return (
            <>
                <span>{topicarea?.name}</span>
            </>
        );
    };

    test("should fetch the topic area", async () => {
        const sampleTopicArea: any = { name: "dummy" };
        const fetchTopicAreaByIdSpy = jest
            .spyOn(BackendService, "fetchTopicAreaById")
            .mockImplementation(() => Promise.resolve(sampleTopicArea));

        await act(async () => {
            render(<FooComponent topicAreaId="uuid" />);
        });

        expect(fetchTopicAreaByIdSpy).toHaveBeenCalled();
        expect(screen.getByText(sampleTopicArea.name)).toBeInTheDocument();
    });

    const TopicAreasComponent = () => {
        const { topicareas } = useTopicAreas();
        return (
            <>
                <span>{topicareas.length}</span>
            </>
        );
    };

    test("should fetch the topic areas", async () => {
        const sampleTopicAreas: any[] = [{ name: "dummy" }];
        const fetchTopicAreas = jest
            .spyOn(BackendService, "fetchTopicAreas")
            .mockImplementation(() => Promise.resolve(sampleTopicAreas));

        await act(async () => {
            render(<TopicAreasComponent />);
        });

        expect(fetchTopicAreas).toHaveBeenCalled();
        expect(screen.getByText(sampleTopicAreas.length)).toBeInTheDocument();
    });
});
