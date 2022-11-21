import React from "react";
import { render, act, screen } from "@testing-library/react";
import { useLogo } from "../logo-hooks";
import StorageService from "../../services/StorageService";

describe("useLogo", () => {
  interface Props {
    s3Key: string;
  }
  const FooComponent = (props: Props) => {
    const { logoFileName } = useLogo(props.s3Key);
    return (
      <>
        <span>{logoFileName}</span>
      </>
    );
  };

  test("should fetch the logo", async () => {
    const sampleLogo: File = { name: "logo.png" } as File;
    const downloadLogoSpy = jest
      .spyOn(StorageService, "downloadLogo")
      .mockReturnValue(Promise.resolve(sampleLogo));

    await act(async () => {
      render(<FooComponent s3Key="/logo.png" />);
    });

    expect(downloadLogoSpy).toHaveBeenCalled();
    expect(screen.getByText(sampleLogo.name)).toBeInTheDocument();
  });
});
