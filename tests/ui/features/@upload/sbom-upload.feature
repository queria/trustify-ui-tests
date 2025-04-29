Feature: Upload SBOM
    Background: Authentication
        Given User is authenticated

    Scenario Outline: Verify Upload SBOM page content
       When User visits Upload page
       Then SBOM upload tab is selected
       And Drag and drop instructions are visible
       And Upload button is present
       And Accepted file types are described

#   Scenario Outline: Upload single SBOM
#       Given User visits Upload page
#       When User uploads single SBOM file
#       Then Summary of total uploaded files is updated
#       And Results of uploading single file is visible
#
#   Scenario Outline: Upload multiple SBOMs
#       Given User visits Upload page
#       When User uploads multiple SBOM files
#       Then Summary of total uploaded files is updated
#       And Results of all uploaded files are visible
#
#   Scenario Outline: Upload multiple SBOMs (some bz2 compressed)
#       Given User visits Upload page
#       When User uploads multiple SBOM files with mixed compression
#       Then Summary of total uploaded files is updated
#       And Results of all uploaded files are visible

