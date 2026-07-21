import type { ReactElement } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApplicationList } from "../../src/components/ApplicationList";
import type { Application } from "../../src/types";

const mockApplications: Application[] = [
  {
    id: "1",
    name: "Test App 1",
    description: "First test application",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Test App 2",
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
  },
];

const renderWithRouter = (component: ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("ApplicationList", () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders applications correctly", () => {
    renderWithRouter(
      <ApplicationList
        applications={mockApplications}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />,
    );

    expect(screen.getByText("Test App 1")).toBeInTheDocument();
    expect(screen.getByText("Test App 2")).toBeInTheDocument();
    expect(screen.getByText("First test application")).toBeInTheDocument();
  });

  it("shows empty state when no applications exist", () => {
    renderWithRouter(
      <ApplicationList
        applications={[]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />,
    );

    expect(screen.getByText("No applications found")).toBeInTheDocument();
  });

  it("calls onEdit when edit is clicked", () => {
    renderWithRouter(
      <ApplicationList
        applications={mockApplications}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />,
    );

    fireEvent.click(screen.getAllByRole("button")[0]);
    fireEvent.click(screen.getByText("Edit"));

    expect(mockOnEdit).toHaveBeenCalledWith(mockApplications[0]);
  });
});
