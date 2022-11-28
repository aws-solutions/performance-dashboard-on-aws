import React from "react";
import { render, act, screen } from "@testing-library/react";
import {
  useHomepage,
  usePublicHomepage,
  usePublicHomepageSearch,
} from "../homepage-hooks";
import BackendService from "../../services/BackendService";
import { PublicHomepage } from "../../models";

describe("useHomepage", () => {
  const FooComponent = () => {
    const { homepage } = useHomepage();
    return (
      <>
        <span>{homepage?.title}</span>
      </>
    );
  };

  test("should fetch the home page", async () => {
    const sampleHomePage = { title: "Home Page" };
    const fetchHomepageSpy = jest
      .spyOn(BackendService, "fetchHomepage")
      .mockImplementation(() => Promise.resolve(sampleHomePage));

    await act(async () => {
      render(<FooComponent />);
    });

    expect(fetchHomepageSpy).toHaveBeenCalled();
    expect(screen.getByText(sampleHomePage.title)).toBeInTheDocument();
  });
});

describe("usePublicHomepage", () => {
  const FooComponent = () => {
    const { homepage } = usePublicHomepage();
    return (
      <>
        <span>{homepage?.title}</span>
      </>
    );
  };

  test("should fetch the home page", async () => {
    const sampleHomePage = { title: "Public Home Page" };
    const fetchPublicHomepageSpy = jest
      .spyOn(BackendService, "fetchPublicHomepage")
      .mockImplementation(() => Promise.resolve(sampleHomePage));

    await act(async () => {
      render(<FooComponent />);
    });

    expect(fetchPublicHomepageSpy).toHaveBeenCalled();
    expect(screen.getByText(sampleHomePage.title)).toBeInTheDocument();
  });
});

describe("usePublicHomepageSearch", () => {
  interface Props {
    query: string;
  }
  const FooComponent = (props: Props) => {
    const { homepage } = usePublicHomepageSearch(props.query);
    return (
      <>
        <span>{homepage?.title}</span>
      </>
    );
  };

  test("should fetch the home page", async () => {
    const sampleHomePage = { title: "Public Home Page" } as PublicHomepage;
    const fetchPublicHomepageWithQuerySpy = jest
      .spyOn(BackendService, "fetchPublicHomepageWithQuery")
      .mockImplementation(() => Promise.resolve(sampleHomePage));

    await act(async () => {
      render(<FooComponent query="some-query" />);
    });

    expect(fetchPublicHomepageWithQuerySpy).toHaveBeenCalled();
    expect(screen.getByText(sampleHomePage.title)).toBeInTheDocument();
  });
});
