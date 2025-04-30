import path from "path";
import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

export const { Given, When, Then, Step } = createBdd();

const MENU_UPLOAD = "Upload";
const HEADER_UPLOAD = "Upload";
const BUTTON_UPLOAD = "Upload";
const TAB_SBOM = "SBOM";
const DRAG_INSTRUCTIONS = "Drag and drop files here or";
const ACCEPTED_TYPES_DESC = "Accepted file types:";

const DATA_SBOM_SINGLE = ["test-upload-001.spdx.json"];

function assetsPath(files: string[]): string[] {
  return files.map((e) => path.join(__dirname, "assets", e));
}

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

// Verify upload of single SBOM file
const uploadFiles = async (page: Page, files: string[]) => {
  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: BUTTON_UPLOAD, exact: true }).click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(files);
};

When("User uploads single SBOM file", async ({ page }) => {
  let files = assetsPath(DATA_SBOM_SINGLE);
  await uploadFiles(page, files);
});

const verifyUploadStatusCount = async (page: Page, count: number) => {
  await expect(
    page.locator(
      "#upload-sbom-tab-content .pf-v5-c-expandable-section__toggle-text"
    )
  ).toContainText(`${count} of ${count} files uploaded`, {
    timeout: 60_000,
  });
};

Then(
  "Summary of uploaded files shows single file was uploaded",
  async ({ page }) => {
    await verifyUploadStatusCount(page, 1);
  }
);

Then("Results of uploading single file is visible", async ({ page }) => {
  await expect(
    page.locator(
      ".pf-v5-c-expandable-section__content .pf-v5-c-multiple-file-upload__status-item .pf-v5-c-multiple-file-upload__status-item-progress-text"
    )
  ).toContainText(DATA_SBOM_SINGLE[0], {
    // expect name of sbom to be in the list of results
    timeout: 60_000,
  });
  // .pf-v5-c-multiple-file-upload__status-item // done
  // -- .pf-v5-c-multiple-file-upload__status-item-progress-text .toContainText(files[0]) // done
  // -- .pf-v5-c-progress__measure .toContainText("100%") // FIXME: still missing
});
