let defaultHtmlElements = {
    districtSearchBoxDetail: ".district-search-input",
    renderSurveyDetails: "#render_survey_details",
    detailedDateBoxDetail: "#detailed_date_box",
    detailedTableBody: "#detailed_table_body",
    renderPaginationDetails: "#pagination",
    detailedPageNoData: "#render_no_data",
    detailSortValue: "#detail_sort_value",
    detailSortType: "#detail_sort_type",
    detailDistrict: "#detail_district",
    detailSortBy: "#detailed_sort_by",
    paginatedButtons: ".pageValue",
    searchBoxDetail: "#search_box",
    dateBoxDetail: "#date_box",
    detailPage: ".detail-page",
    sortValue: "#sort_value",
    stateName: "#state_name",
    sortType: "#sort_type",
    sortBy: "#sort_by",
}

assignPagination = (array) => {

    let surveyDetailsLength = array.length;
    let pageLength = Math.round(surveyDetailsLength / 10);
    return renderPagination(pageLength);
}

buildSurveyDetailsPlaceholder = (object) => {
    for (const key in object) {
        const districtptions = generateOptions(object[key].districts);

        let display =
            `<div class="state-details-container" state="${key}">
            <div class="flex align-item-center justify-between">
                <h2>${key}</h2>
                <select class="input-box district-search-input" placeholder="Select a District">
                    <option>Select a District</option>
                    ${districtptions}
                </select>
            </div>
            <div class="rows" id=${key}></div> 
            <div class="btn-container">
                <a href="./pages/detailPage.html" target="_blank" class="detail-page"><button>
                Details</button></a>
            </div>
        </div>`;

        return $(defaultHtmlElements.renderSurveyDetails).append(display);
    }
}

renderStateAndDistrictDetails = (element) => {

    for (const key in element) {
        $(`#${key}`).empty();
        const totalSurveyValues = element[key].total ? element[key].total : {};
        const deltaSurveyValues = element[key].delta ? element[key].delta : {};
        const delta7SurveyValues = element[key].delta7 ? element[key].delta7 : {};
        const totalSurveyDeatils = generateSurvayValues(totalSurveyValues);
        const deltaSurveyDeatils = generateSurvayValues(deltaSurveyValues);
        const delta7SurveyDeatils = generateSurvayValues(delta7SurveyValues);

        let display = `<div class="slideshow-container">
                            ${renderSurveyHtml(key, "Total", totalSurveyDeatils)}
                            ${renderSurveyHtml(key, "Delta", deltaSurveyDeatils)}
                            ${renderSurveyHtml(key, "Delta7", delta7SurveyDeatils)}
                            <a class="next" state="state-${key}">&#10095;</a>
                        </div>
                        <br>`;
        $(`#${key}`).append(display);
        $(`#varient-Delta-${key}`).hide();
        $(`#varient-Delta7-${key}`).hide();
    }
    return
}

renderSurveyHtml = (state, heading, object) => {

    let display = ` <div class="slide">
                    <div class="state-container"id="varient-${heading}-${state}" state="${state}">
                        <div>
                            <h3 class="text-center">${heading}</h3>
                        </div>
                        <div class="mlr-30">
                            <div class="flex align-items-center justify-between">
                                <p>Confirmed </p> <p> ${object.confirmed}</p>
                            </div>
                            <div class="flex align-items-center justify-between">
                                <p>Recovered </p> <p>${object.recovered} </p>
                            </div>
                            <div class="flex align-items-center justify-between">
                                <p>Deceased </p> <p> ${object.deceased} </p>
                             </div>
                            <div class="flex align-items-center justify-between">
                                <p>Tested </p> <p> ${object.tested} </p>
                            </div>
                            <div class="flex align-items-center justify-between">
                                <p>Vaccinated1</p> <p> ${object.vaccinated1} </p>
                            </div> <div class="flex align-items-center justify-between">
                                <p>Vaccinated2 </p> <p> ${object.vaccinated2} </p>
                            </div>
                        </div>
                    </div>
                </div>`;
    return display;

}

generateOptions = (districts) => {

    let options = "";
    for (const key in districts) {
        options += `<option value="${key}">${key}</option>`
    }
    return options;
}

renderDistrictDetails = (state) => {

    const districts = surveyDetailObject[state].districts;
    let options = generateOptions(districts);
    return $(defaultHtmlElements.detailDistrict).append(options);
}

renderPagination = (paginationLength) => {

    let display = "";
    for (let index = 0; index < paginationLength; index++) {
        display += `<a  class="pageValue" value="${index + 1}">${index + 1}</a>`
    }
    return $(defaultHtmlElements.renderPaginationDetails).append(display);
}

renderNoData = () => {

    $(defaultHtmlElements.renderSurveyDetails).empty();
    $(defaultHtmlElements.renderPaginationDetails).empty();
    let display = `<div class="render-message"><span >No data Found</span></div>`;
    return $(defaultHtmlElements.renderSurveyDetails).append(display);
}

makeDetailedPageObject = (object) => {

    let detailedPageObject = prepareDetailedObject(object);
    if (detailedPageObject.status) {
        let display = `<tr>
                    <td>${detailedPageObject.date}</td>
                    <td>${detailedPageObject.total.confirmed}</td>
                    <td>${detailedPageObject.total.recovered}</td>
                    <td>${detailedPageObject.total.deceased}</td>
                    <td>
                        Confirmed:${detailedPageObject.delta.confirmed}<br/>
                        Recovered:${detailedPageObject.delta.recovered}<br/>
                        Deceased:${detailedPageObject.delta.deceased}
                    </td>
                    <td>
                        Confirmed:${detailedPageObject.delta7.confirmed}<br/>
                        Recovered:${detailedPageObject.delta7.recovered}<br/>
                        Deceased:${detailedPageObject.delta7.deceased}
                    </td>
                </tr>`;
        return $(defaultHtmlElements.detailedTableBody).append(display);
    } else {
        $("table").hide();
        return $(defaultHtmlElements.detailedPageNoData).append(`<span>No Data Found</span>`);
    }
}

prepareDetailedObject = (object) => {

    let requiredObject = {
        date: "",
        total: {},
        delta: {},
        delta7: {}
    }
    for (const key in object) {
        requiredObject["date"] = key;
        if (!object[key].delta) {
            varientNotIncluded(requiredObject, "delta");
        } else {
            varientIncluded(requiredObject, "delta", object, key);
        }
        if (!object[key].delta7) {
            varientNotIncluded(requiredObject, "delta7");
        } else {
            varientIncluded(requiredObject, "delta7", object, key);
        }
        if (!object[key].total) {
            varientNotIncluded(requiredObject, "total");
        } else {
            varientIncluded(requiredObject, "total", object, key);
        }
        if (!object[key].delta && !object[key].delta7 && !object[key].total) {
            requiredObject = {
                status: false
            }
        }
    }
    return requiredObject;
}

varientNotIncluded = (object, type) => {

    object[type]["confirmed"] = 0;
    object[type]["deceased"] = 0;
    object[type]["recovered"] = 0;
    return object;
}

varientIncluded = (requiredObject, type, defaultObject, key) => {

    requiredObject["status"] = true;
    requiredObject[type]["confirmed"] = defaultObject[key][type].confirmed ? defaultObject[key][type].confirmed : 0;
    requiredObject[type]["deceased"] = defaultObject[key][type].deceased ? defaultObject[key][type].deceased : 0;
    requiredObject[type]["recovered"] = defaultObject[key][type].recovered ? defaultObject[key][type].recovered : 0;
    return requiredObject
}