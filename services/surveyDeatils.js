let surveyDetailArray = "";
let sortedSurveyDetailArray = "";
let surveyDetailObject = "";
let timeEntryDetailObject = "";
let currentStateName = "";
let timeEntriesDetailArray = [];
let sortedDateArray = [];

handleSurveyDetails = async(surveyUrl, timeEntriesurl) => {
    let surveyDeatils = await getSurveyDetails(surveyUrl);
    let surveyDetailsArray = constructArray(surveyDeatils, );
    await getTimeEntriesDetails(timeEntriesurl);
    renderSurveyDetails(0, 10, surveyDetailsArray);
    assignPagination(surveyDetailsArray);
    renderPaginatedValues();
    searchByStateName();
    searchByDistrict(defaultHtmlElemnts.districtSearchBoxDetail);
    searchByDate(defaultHtmlElemnts.dateBoxDetail, "surveyDetail");
    sortingSurveyDetails();
    renderStateDetails();
    nextSlides();
    return;
}

getSurveyDetails = async(url) => {
    const surveyData = await getData(url);
    const surveyJsonData = await surveyData.json();
    surveyDetailObject = surveyJsonData;
    return surveyJsonData;
}

getTimeEntriesDetails = async(url) => {
    const timeEntryData = await getData(url);
    const timeEntryJsonData = await timeEntryData.json();
    timeEntryDetailObject = timeEntryJsonData;
    return timeEntryJsonData;
}

constructArray = (details) => {
    const array = [];
    for (const key in details) {
        let object = {
            [key]: details[key]
        };
        array.push(object);
    }
    surveyDetailArray = array;
    return array;
}

renderSurveyDetails = (requiredIndex, requiredLength, array) => {
    $(defaultHtmlElemnts.renderSurveyDetails).empty();
    for (let index = requiredIndex; index < requiredLength; index++) {
        const element = array[index];
        buildSurveyDetailsPlaceholder(element);
        renderStateAndDistrictDetails(element);
        searchByDistrict(defaultHtmlElemnts.districtSearchBoxDetail);
        searchByDate(defaultHtmlElemnts.dateBoxDetail, "surveyDetail");
        renderStateDetails();
    }
    return
}

renderPaginatedValues = () => {
    $(`${defaultHtmlElemnts.paginatedButtons}`).click(function() {
        const paginationValue = $(this).attr("value") + "0";
        const requiredIndex = paginationValue - 10;
        renderSurveyDetails(requiredIndex, paginationValue, surveyDetailArray);
    });
    return;
}

searchByStateName = () => {
    $(`${defaultHtmlElemnts.searchBoxDetail}`).change(function() {
        let objectLength = Object.keys(surveyDetailObject).length
        for (const [index, [key, value]] of Object.entries(Object.entries(surveyDetailObject))) {
            if (key == this.value) {
                let object = {
                    [key]: value
                }
                $(defaultHtmlElemnts.renderSurveyDetails).empty();
                $(defaultHtmlElemnts.renderPaginationDetails).empty();
                buildSurveyDetailsPlaceholder(object);
                renderStateAndDistrictDetails(object);
                return;
            } else {
                if (parseInt(index) + 1 == objectLength) {
                    if (!this.value) {
                        renderSurveyDetails(0, 10, surveyDetailArray);
                        assignPagination(surveyDetailArray);
                        renderPaginatedValues();
                        return
                    } else {
                        return renderNoData();
                    }
                }
            }
        }
    });
}

renderStateDetails = () => {
    $(defaultHtmlElemnts.detailPage).click(function() {
        let stateName = $(this).closest('div.state-details-container').attr('state');
        localStorage.setItem("stateName", stateName);
        return
    });
}

initiateDetailRender = (currentStateName) => {
    let timeEntries = timeEntryDetailObject[currentStateName].dates;
    $("#state_name").append(`<span >${currentStateName}</span>`);
    for (const key in timeEntries) {
        let prepareObject = {}
        prepareObject[key] = timeEntries[key];
        makeDetailedPageObject(prepareObject, "");
    }
    return;
}

searchByDistrict = (element, state) => {
    $(element).change(function() {
        if (!state) {
            let response = ""
            let stateName = $(this).closest('div.state-details-container').attr('state');
            if (this.value != "Search a district") {
                response = surveyDetailObject[stateName].districts[this.value];
            } else {
                response = surveyDetailObject[stateName];
            }
            let object = {
                [stateName]: response
            }
            renderStateAndDistrictDetails(object);
        } else {
            let response = ""
            let stateName = state;
            if (this.value != "Search a district") {
                response = surveyDetailObject[stateName].districts[this.value];
                let object = {
                    [this.value]: response
                }
                $("table").show();
                $(defaultHtmlElemnts.detailedTableBody).empty();
                $(defaultHtmlElemnts.detailedPageNoData).empty();
                $('table tr:eq(0) th:eq(0)').text("District");
                makeDetailedPageObject(object);
            } else {
                initiateDetailRender(staeName);
            }
        }
    })
}

searchByDate = (element, type) => {
    $(element).change(function() {
        let date = dateFormat(this.value);
        if (type == "surveyDetail") {
            if (date != "-undefined-undefined") {
                for (const key in timeEntryDetailObject) {
                    let value = timeEntryDetailObject[key].dates[date];
                    let object = {
                        [key]: value ? value : {}
                    }
                    console.log("object-------->", object);
                    renderStateAndDistrictDetails(object);
                }
            } else {
                renderSurveyDetails(0, 10, surveyDetailArray);
                assignPagination(surveyDetailArray);
                renderPaginatedValues();
                return
            }
        }
        if (type == "fullDetail") {
            let staeName = localStorage.getItem("stateName");
            if (date != "-undefined-undefined") {
                let value = timeEntryDetailObject[staeName].dates[date];
                let object = {
                    [date]: value ? value : {}
                };
                $("table").show();
                $(defaultHtmlElemnts.detailedTableBody).empty();
                $(defaultHtmlElemnts.detailedPageNoData).empty();
                $('table tr:eq(0) th:eq(0)').text("Date");
                makeDetailedPageObject(object);
            } else {
                initiateDetailRender(staeName);
            }
        }
        return
    });
}

dateFormat = (date) => {
    let formatDate = date.split("-");
    return formatDate[0] + "-" + formatDate[1] + "-" + formatDate[2];
}

generateSurvayValues = (object) => {
    let detailObject = {
        confirmed: object.confirmed ? object.confirmed : 0,
        recovered: object.recovered ? object.recovered : 0,
        deceased: object.deceased ? object.deceased : 0,
        tested: object.tested ? object.tested : 0,
        vaccinated1: object.vaccinated1 ? object.vaccinated1 : 0,
        vaccinated2: object.vaccinated2 ? object.vaccinated2 : 0
    }
    return detailObject;
}

sortingSurveyDetails = () => {
    $(defaultHtmlElemnts.sortBy).click(function() {
        const sortType = $(defaultHtmlElemnts.sortType).val();
        const sortValue = $(defaultHtmlElemnts.sortValue).val();
        if (sortType !== "Select Sort Type" && sortValue !== "Select Sort Value") {
            surveyDetailArraySorting(surveyDetailArray, sortValue);
            let sortedArray = arraySortingBasedOnType(sortType, sortedSurveyDetailArray);
            renderSurveyDetails(0, 9, sortedArray);
        }
    })
}

arraySortingBasedOnType = (sortType, array) => {
    let detail = "";
    if (sortType == "Ascending") {
        detail = array;
    } else if (sortType == "Descending") {
        detail = array.reverse();
    }
    return detail;
}

surveyDetailArraySorting = (array, key) => {
    sortedSurveyDetailArray = array;
    sortedSurveyDetailArray.sort(function(a, b) {
        let firstKey = Object.keys(a).find(keys => keys);
        let secondKey = Object.keys(b).find(keys => keys);
        return a[firstKey].total[key] - b[secondKey].total[key];
    });
}

timeEntriesDetailArraySorting = (value) => {
    let staeName = localStorage.getItem("stateName");
    let stateTimeEntry = timeEntryDetailObject[staeName].dates;
    timeEntriesDetailArray = [];
    for (const key in stateTimeEntry) {
        let object = {
            [key]: stateTimeEntry[key]
        }
        timeEntriesDetailArray.push(object);
    }
    sortDateArray(timeEntriesDetailArray, value);
}

timeEntriesObjectForm = (array) => {
    let staeName = localStorage.getItem("stateName");
    $(defaultHtmlElemnts.detailedTableBody).empty();
    $(defaultHtmlElemnts.detailedPageNoData).empty();
    $('table tr:eq(0) th:eq(0)').text("Date");
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        for (const key in element) {
            let timeEntryObject = timeEntryDetailObject[staeName].dates[key];
            let object = {
                [key]: timeEntryObject
            }
            makeDetailedPageObject(object);
        }
    }
}

sortingTimeEntriesDetails = () => {
    $(defaultHtmlElemnts.detailSortBy).click(function() {
        const sortType = $(defaultHtmlElemnts.detailSortType).val();
        const sortValue = $(defaultHtmlElemnts.detailSortValue).val();
        if (sortType !== "Select Sort Type" && sortValue !== "Select Sort Value") {
            timeEntriesDetailArraySorting(sortValue);
            let sortedArray = arraySortingBasedOnType(sortType, sortedDateArray);
            timeEntriesObjectForm(sortedArray);
            return
        }
    })
}

nextSlides = (thisId) => {
    // let varient = $(".state-container").attr("state");
    $(".next").click(function() {
        let attribute = $(this).attr("state")
        console.log("attribute---------->", attribute);
        let idSplit = attribute.split("-");
        let totalVisible = $(`#varient-Total-${idSplit[1]}`).is(':visible');
        let deltaVisible = $(`#varient-Delta-${idSplit[1]}`).is(':visible');
        let delta7Visible = $(`#varient-Delta7-${idSplit[1]}`).is(':visible');
        console.log("totalVisible----------->", totalVisible);
        console.log("deltaVisible----------->", deltaVisible);
        console.log("delta7Visible----------->", delta7Visible);
        if (totalVisible) {
            $(`#varient-Delta-${idSplit[1]}`).show();
            $(`#varient-Total-${idSplit[1]}`).hide();
            $(`#varient-Delta7-${idSplit[1]}`).hide();
        } else if (deltaVisible) {
            $(`#varient-Delta7-${idSplit[1]}`).show();
            $(`#varient-Total-${idSplit[1]}`).hide();
            $(`#varient-Delta-${idSplit[1]}`).hide();
        } else if (delta7Visible) {
            $(`#varient-Total-${idSplit[1]}`).show();
            $(`#varient-Delta7-${idSplit[1]}`).hide();
            $(`#varient-Delta-${idSplit[1]}`).hide();
        }
    });

}

sortDateArray = (array, value) => {
    sortedDateArray = [];
    console.log(array.length);
    array.forEach(function(elem, idx, arr) {
        let firstKey = Object.keys(elem).find(keys => keys);
        let object = {
            [firstKey]: elem[firstKey].total[value] ? elem[firstKey].total[value] : 0
        }
        sortedDateArray.push(object);
    });
}