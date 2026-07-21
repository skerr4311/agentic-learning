import "@testing-library/jest-dom";
import { vi } from "vitest";

global.fetch = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ applicationId: "test-id" }),
  };
});
