const COVIDSURVEYURL = "https://data.covid19india.org/v4/min/data.min.json";
const TIMEENTRIESURL = "https://data.covid19india.org/v4/min/timeseries.min.json";

$(document).ready(async function() {
    let name = localStorage.getItem("stateName");
    let surveyDeatils = await getSurveyDetails(COVIDSURVEYURL);
    await getTimeEntriesDetails(TIMEENTRIESURL);
    renderDistrictDetails(name);
    constructArray(surveyDeatils);
    initiateDetailRender(name);
    searchByDate(defaultHtmlElemnts.detailedDateBoxDetail, "fullDetail");
    sortingTimeEntriesDetails();
    searchByDistrict(defaultHtmlElemnts.detailDistrict, name);
});