const COVIDSURVEYURL = "https://data.covid19india.org/v4/min/data.min.json";
const TIMEENTRIESURL = "https://data.covid19india.org/v4/min/timeseries.min.json";
$(document).ready(async function() {
    let surveyDeatils = await handleSurveyDetails(COVIDSURVEYURL, TIMEENTRIESURL);
    return
});