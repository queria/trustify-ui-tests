import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

export const { Given, When, Then, Step } = createBdd();

const MENU_UPLOAD = "Upload";
const HEADER_UPLOAD = "Upload";
const BUTTON_UPLOAD = "Upload";
const TAB_SBOM = "SBOM";
const DRAG_INSTRUCTIONS = "Drag and drop files here or";
const ACCEPTED_TYPES_DESC = "Accepted file types:";

// Used for both When and Given
const visitUploadPage = async ({ page }) => {
  await page.getByRole("link", { name: MENU_UPLOAD }).click();

  const header = page.locator(`xpath=(//h1[text()="${HEADER_UPLOAD}"])`);
  await header.waitFor({ state: "visible", timeout: 2000 });
};
Step("User visits Upload page", visitUploadPage);

// Verify initial content of Upload page
Then("SBOM upload tab is selected", async ({ page }) => {
  await expect(page.getByRole("tab", { name: TAB_SBOM })).toHaveAttribute(
    "aria-selected",
    "true"
  );
});

Then("Drag and drop instructions are visible", async ({ page }) => {
  await expect(
    page.getByLabel("SBOM").getByText(DRAG_INSTRUCTIONS)
  ).toBeVisible();
});

Then("Upload button is present", async ({ page }) => {
  await expect(page.getByRole("button", { name: "Upload" })).toBeVisible();
});

Then("Accepted file types are described", async ({ page }) => {
  expect(page.getByLabel("SBOM").getByText(ACCEPTED_TYPES_DESC)).toBeVisible();
});
