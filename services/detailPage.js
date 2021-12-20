const COVIDSURVEYURL = "https://data.covid19india.org/v4/min/data.min.json";
const TIMEENTRIESURL = "https://data.covid19india.org/v4/min/timeseries.min.json";

$(document).ready(async function() {
    let stateName = localStorage.getItem("stateName");
    let surveyDeatils = await getSurveyDetails(COVIDSURVEYURL);

    await getTimeEntriesDetails(TIMEENTRIESURL);
    renderDistrictDetails(stateName);
    constructArray(surveyDeatils);
    initiateDetailRender(stateName);
    searchByDate(defaultHtmlElements.detailedDateBoxDetail, "fullDetail");
    sortingTimeEntriesDetails();
    searchByDistrict(defaultHtmlElements.detailDistrict, stateName);
    return
});