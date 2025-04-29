import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

export const { Given, When, Then, Step } = createBdd();

// const SBOM_TABLE_NAME = "Sbom table";
// const ADVISORY_TABLE_NAME = "Advisory table";

// Used for both When and Given
const visitUploadPage = async ({ page }) => {
  await page.getByRole("link", { name: "Upload" }).click();

  const header = page.locator(`xpath=(//h1[text()="Upload"])`);
  await header.waitFor({ state: "visible", timeout: 2000 });
};
Step("User visits Upload page", visitUploadPage);

Then("SBOM upload tab is selected", async ({ page }) => {
  await expect(page.getByRole("tab", { name: "SBOM" })).toHaveAttribute(
    "aria-selected",
    "true"
  );
});

Then("Drag and drop instructions are visible", async ({ page }) => {
  await expect(
    page.getByLabel("SBOM").getByText("Drag and drop files here or")
  ).toBeVisible();
});

Then("Upload button is present", async ({ page }) => {
  await expect(page.getByRole("button", { name: "Upload" })).toBeVisible();
});

Then("Accepted file types are described", async ({ page }) => {
  expect(
    page.getByLabel("SBOM").getByText("Accepted file types:")
  ).toBeVisible();
});
