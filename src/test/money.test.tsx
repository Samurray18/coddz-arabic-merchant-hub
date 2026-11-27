import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LanguageProvider } from "@/hooks/use-language";
import { Money } from "@/components/money";

describe("Money", () => {
  it("renders a bdi with the right dir per language", () => {
    const { unmount } = render(
      <LanguageProvider>
        <Money value={5000} />
      </LanguageProvider>,
    );
    const bdi = screen.getByText(/5/).closest("bdi");
    expect(bdi).not.toBeNull();
    expect(bdi?.getAttribute("dir")).toBe("rtl");
    unmount();

    // French
    window.localStorage.setItem("coddz_lang", "fr");
    render(
      <LanguageProvider>
        <Money value={5000} />
      </LanguageProvider>,
    );
    const bdi2 = screen.getByText(/5/).closest("bdi");
    expect(bdi2?.getAttribute("dir")).toBe("ltr");
    window.localStorage.removeItem("coddz_lang");
  });
});
