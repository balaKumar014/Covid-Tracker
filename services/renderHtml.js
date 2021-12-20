let defaultHtmlElemnts = {
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
    let data = Math.round(surveyDetailsLength / 10);
    renderpagination(data);
}

buildSurveyDetailsPlaceholder = (object) => {
    for (const key in object) {
        const districtptions = generateOptions(object[key].districts);
        let display = `<div class="state-details-container" state="${key}">
                        <div class="flex align-item-center justify-between">
                            <h2>${key}</h2>
                            <select class="input-box district-search-input" placeholder="search a district">
                                <option>Search a district</option>
                                ${districtptions}
                            </select>
                        </div>
                        <div class="rows" id=${key}></div>
                        <div class="btn-container">
                        <a href="./pages/detailPage.html" target="_blank" class="detail-page">Details</a>
                        </div>
                    </div>`
        $(defaultHtmlElemnts.renderSurveyDetails).append(display);
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
                            ${renderSurveyHtml(key,"Total", totalSurveyDeatils)}
                            ${renderSurveyHtml(key,"Delta", deltaSurveyDeatils)}
                            ${renderSurveyHtml(key,"Delta7", delta7SurveyDeatils)}
                            <a class="next" state="state-${key}">&#10095;</a>
                        </div><br>`;
        $(`#${key}`).append(display);
        $(`#varient-Delta-${key}`).hide();
        $(`#varient-Delta7-${key}`).hide();
    }
}

renderSurveyHtml = (state, heading, object) => {
    let html = ` <div class="slide">
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
    return html;

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
    $(defaultHtmlElemnts.detailDistrict).append(options);
}

renderpagination = (paginationLength) => {
    let html = "";
    for (let index = 0; index < paginationLength; index++) {
        html += `<a  class="pageValue" value="${index + 1}">${index + 1}</a>`
    }
    $(defaultHtmlElemnts.renderPaginationDetails).append(html);
}

renderNoData = () => {
    $(defaultHtmlElemnts.renderSurveyDetails).empty();
    $(defaultHtmlElemnts.renderPaginationDetails).empty();
    let html = `<div class="render-message"><span >No data Found</span></div>`;
    $(defaultHtmlElemnts.renderSurveyDetails).append(html);
}

makeDetailedPageObject = (object) => {
    console.log("object----------->", object);
    let detailedPageObject = prepareDetailedObject(object);
    if (detailedPageObject.status) {
        let display = `<tr>
                    <td>${detailedPageObject.date}</td>
                    <td>${detailedPageObject.total.confirmed}</td>
                    <td>${detailedPageObject.total.recovered}</td>
                    <td>${detailedPageObject.total.deceased}</td>
                    <td>
                        confirmed:${detailedPageObject.delta.confirmed}
                        recovered:${detailedPageObject.delta.recovered}
                        deceased:${detailedPageObject.delta.deceased}
                    </td>
                    <td>
                        confirmed:${detailedPageObject.delta7.confirmed}
                        recovered:${detailedPageObject.delta7.recovered}
                        deceased:${detailedPageObject.delta7.deceased}
                    </td>
                </tr>`;
        $(defaultHtmlElemnts.detailedTableBody).append(display);
    } else {
        $("table").hide();
        $(defaultHtmlElemnts.detailedPageNoData).append(`<span>No Data Found</span>`);
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
            requiredObject.delta["confirmed"] = 0;
            requiredObject.delta["deceased"] = 0;
            requiredObject.delta["recovered"] = 0;
        } else {
            requiredObject["status"] = true;
            requiredObject.delta["confirmed"] = object[key].delta.confirmed ? object[key].delta.confirmed : 0;
            requiredObject.delta["deceased"] = object[key].delta.deceased ? object[key].delta.deceased : 0;
            requiredObject.delta["recovered"] = object[key].delta.recovered ? object[key].delta.recovered : 0;
        }
        if (!object[key].delta7) {
            requiredObject.delta7["confirmed"] = 0;
            requiredObject.delta7["deceased"] = 0;
            requiredObject.delta7["recovered"] = 0;
        } else {
            requiredObject["status"] = true;
            requiredObject.delta7["confirmed"] = object[key].delta7.confirmed ? object[key].delta7.confirmed : 0;
            requiredObject.delta7["deceased"] = object[key].delta7.deceased ? object[key].delta7.deceased : 0;
            requiredObject.delta7["recovered"] = object[key].delta7.recovered ? object[key].delta7.recovered : 0;
        }
        if (!object[key].total) {
            requiredObject.total["confirmed"] = 0;
            requiredObject.total["deceased"] = 0;
            requiredObject.total["recovered"] = 0;
        } else {
            requiredObject["status"] = true;
            requiredObject.total["confirmed"] = object[key].total.confirmed ? object[key].total.confirmed : 0;
            requiredObject.total["deceased"] = object[key].total.deceased ? object[key].total.deceased : 0;
            requiredObject.total["recovered"] = object[key].total.recovered ? object[key].total.recovered : 0;
        }
        if (!object[key].delta && !object[key].delta7 && !object[key].total) {
            requiredObject = {
                status: false
            }
        }
    }
    return requiredObject;
}