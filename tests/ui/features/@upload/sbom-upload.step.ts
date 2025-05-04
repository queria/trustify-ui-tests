import fs from "fs";
import path from "path";
// FIXME: unused
// import { bzip2 } from "../../../common/compression"
import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

export const { Given, When, Then, Step } = createBdd();

const MENU_UPLOAD = "Upload";
const HEADER_UPLOAD = "Upload";
const BUTTON_UPLOAD = "Upload";
const TAB_SBOM = "SBOM";
const DRAG_INSTRUCTIONS = "Drag and drop files here or";
const ACCEPTED_TYPES_DESC = "Accepted file types:";

const TIMEOUT_PAGELOAD_IMPORT = 2_000;
const TIMEOUT_UPLOAD_DONE = 60_000;

const DATA_SBOM_SINGLE = ["test-upload-001.spdx.json"];

const DATA_SBOM_MULTIPLE = [
    "test-upload-002.spdx.json",
    "test-upload-003.spdx.json.bz2",
    "test-upload-004.cdx.json",
    "test-upload-005.cdx.json",
    "test-upload-006.cdx.json.bz2"
];

// HELPERS
//
const visitUploadPage = async ({ page }) => {
  await page.goto("/importers"); // dont care which page here, importers is lot faster than Dashboard
  await page.getByRole("link", { name: MENU_UPLOAD }).click();

  const header = page.locator(`xpath=(//h1[text()="${HEADER_UPLOAD}"])`);
  await header.waitFor({ state: "visible", timeout: TIMEOUT_PAGELOAD_IMPORT });
};
Step("User visits Upload page", visitUploadPage);

function assetsPath(files: string[]): string[] {
  return files.map((e) => path.join(__dirname, "assets", e));
}

const uploadFiles = async (page: Page, files: string[]) => {
  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: BUTTON_UPLOAD, exact: true }).click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(files);
};

const verifyUploadStatusCount = async (page: Page, count: number) => {
  await expect(
    page.locator(
      "#upload-sbom-tab-content .pf-v5-c-expandable-section__toggle-text"
    )
  ).toContainText(`${count} of ${count} files uploaded`, {
    timeout: TIMEOUT_UPLOAD_DONE,
  });
};

Given("Multiple SBOM files are prepared for upload", async () => {
    // FIXME: unused
    // // ensure that for multi-file upload we have compressed versions prepared
    // // (as it is better to keep them uncompressed in git repo for easier maintenance)
    // // FOR NOT DISABLED (no good/easy-to-use ts/js bz2 compression lib?)
    // const sboms = assetsPath(DATA_SBOM_MULTIPLE);
    // sboms.map((sbom) => {
    //     if (sbom.endsWith('.bz2')) {
    //         if (!fs.existsSync(sbom)) {
    //             console.log(`NEED TO COMPRESS ${sbom}`);
    //             await bzip2(sbom.replace(/.bz2$/, ""), sbom);
    //         }
    //     }
    // });
});

// PAGE CONTENT

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

// SINGLE SBOM UPLOAD

When("User uploads single SBOM file", async ({ page }) => {
  let files = assetsPath(DATA_SBOM_SINGLE);
  await uploadFiles(page, files);
});

Then(
  "Summary of uploaded files shows single file was uploaded",
  async ({ page }) => {
    await verifyUploadStatusCount(page, DATA_SBOM_SINGLE.length);
  }
);

Then("Results of uploading single file is visible", async ({ page }) => {
  const individual_results = page.locator(
    ".pf-v5-c-expandable-section__content .pf-v5-c-multiple-file-upload__status-item"
  );
  console.log(individual_results);
  await expect(
    individual_results.locator(
      ".pf-v5-c-multiple-file-upload__status-item-progress-text"
    )
  ).toContainText(DATA_SBOM_SINGLE[0], {
    // expect name of sbom to be in the list of results
    timeout: TIMEOUT_UPLOAD_DONE,
  });

  await expect(
    individual_results.locator(".pf-v5-c-progress__status .pf-v5-c-progress__measure")
  ).toContainText("100%", {
    timeout: TIMEOUT_UPLOAD_DONE,
  });
});

// MULTIPLE SBOMS UPLOAD

When("User uploads multiple SBOM files", async ({ page }) => {
  let files = assetsPath(DATA_SBOM_MULTIPLE);
  await uploadFiles(page, files);
});

Then(
  "Summary of total uploaded files shows count for multiple files",
  async ({ page }) => {
    await verifyUploadStatusCount(page, DATA_SBOM_MULTIPLE.length);
  }
);

Then("Results of multiple uploaded files are visible", async ({ page }) => {
    // TODO: unify and reuse with code for single file (can pass whole DATA_SBOM_ array)
    // TODO: likely this can be actually parameter from .feature file
    //       - structure as DATA_SBOM["single"] and DATA_SBOM["multiple"]
    //       - same could be done then for the Summary and Uploading steps
    //
  const individual_results = page.locator(
    ".pf-v5-c-expandable-section__content .pf-v5-c-multiple-file-upload__status-item"
  );
  // expect correct count of results
  await expect(individual_results).toHaveCount(DATA_SBOM_MULTIPLE.length);
  // expect result for each sbom to be present and have 100% state
  await expect(
    individual_results.locator(
      ".pf-v5-c-multiple-file-upload__status-item-progress-text"
    )
  ).toContainText(DATA_SBOM_MULTIPLE, {
    // expect name of sbom to be in the list of results
    timeout: TIMEOUT_UPLOAD_DONE,
  });

  await expect(
    individual_results.locator(".pf-v5-c-progress__status .pf-v5-c-progress__measure")
  ).toContainText(new Array(DATA_SBOM_MULTIPLE.length).fill("100%"), {
    timeout: TIMEOUT_UPLOAD_DONE,
  });
});
