/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { mocked } from "ts-jest/utils";
import { InvalidFriendlyURL, ItemNotFound } from "../../errors";
import { Dashboard } from "../../models/dashboard";
import FriendlyURLService from "../friendlyurl-service";
import DashboardRepository from "../../repositories/dashboard-repo";

jest.mock("../../repositories/dashboard-repo");

const repository = mocked(DashboardRepository.prototype);
const dashboard = {
  id: "123456789",
  name: "My AWS Dashboard",
  parentDashboardId: "123456789",
} as Dashboard;

beforeEach(() => {
  DashboardRepository.getInstance = jest.fn().mockReturnValue(repository);
});

describe("generateOrValidate", () => {
  test("throws exception if provided URL is invalid", async () => {
    expect(async () => {
      await FriendlyURLService.generateOrValidate(
        dashboard,
        "this is &? invalid"
      );
    }).rejects.toThrow(InvalidFriendlyURL);
  });

  test("throws exception if URL is already taken", () => {
    expect(async () => {
      const existingDashboard = { parentDashboardId: "001" } as Dashboard;
      repository.getDashboardByFriendlyURL = jest
        .fn()
        .mockReturnValueOnce(existingDashboard);
      await FriendlyURLService.generateOrValidate(dashboard, "foobar");
    }).rejects.toThrow(InvalidFriendlyURL);
  });

  test("returns the URL when it is valid", async () => {
    // Simulate friendlyURL is not already taken
    repository.getDashboardByFriendlyURL = jest
      .fn()
      .mockImplementationOnce(() => {
        throw new ItemNotFound();
      });

    const url = await FriendlyURLService.generateOrValidate(
      dashboard,
      "foobar"
    );

    expect(url).toEqual("foobar");
    expect(repository.getDashboardByFriendlyURL).toBeCalledWith("foobar");
  });
});

describe("generateFromDashboardName", () => {
  test("generates a sanitized URL", () => {
    const scenarios = [
      {
        dashboardName: "COVID-19",
        expectedUrl: "covid-19",
      },
      {
        dashboardName: "La Construcción",
        expectedUrl: "la-construcción",
      },
      {
        dashboardName: "Jen'O Brien",
        expectedUrl: "jen-o-brien",
      },
      {
        dashboardName: "Performance Dashboard @ AWS",
        expectedUrl: "performance-dashboard-aws",
      },
      {
        dashboardName: "This is - great",
        expectedUrl: "this-is-great",
      },
      {
        dashboardName: "A Construção",
        expectedUrl: "a-construção",
      },
      {
        dashboardName: "訳サービスで、テキストや",
        expectedUrl: "訳サービスで、テキストや",
      },
      {
        dashboardName: "!	#	$	&	'	(	)	*	+	,	/	:	;	=	?	@	[	] hi",
        expectedUrl: "hi",
      },
      {
        dashboardName: "-test-name-",
        expectedUrl: "test-name",
      },
    ];

    scenarios.forEach((scenario) => {
      expect(
        FriendlyURLService.generateFriendlyURL(scenario.dashboardName)
      ).toEqual(scenario.expectedUrl);
    });
  });
});

describe("isValid", () => {
  test("validates the URL does not contain reserved characters", () => {
    const scenarios = [
      {
        url: "foo-bar",
        isValid: true,
      },
      {
        url: "foo&bar",
        isValid: false,
      },
      {
        url: "foo?bar",
        isValid: false,
      },
      {
        url: "foo$bar",
        isValid: false,
      },
      {
        url: "foo / bar",
        isValid: false,
      },
      {
        url: "foo@bar",
        isValid: false,
      },
      {
        url: "foo;bar",
        isValid: false,
      },
    ];

    scenarios.forEach(({ url, isValid }) => {
      expect(FriendlyURLService.isValid(url)).toBe(isValid);
    });
  });
});
