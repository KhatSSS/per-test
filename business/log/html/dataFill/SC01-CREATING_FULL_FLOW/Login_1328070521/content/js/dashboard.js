/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.907608695652174, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "LG-MAKE-PAYMENT-AUTOPAY-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "LG-LOAN-DETAILS-050-GET-payments/failed"], "isController": false}, {"data": [1.0, 500, 1500, "LG-070-GET-payments/failed"], "isController": false}, {"data": [0.5, 500, 1500, "AF-010-GET-Login"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-030-GET-customer/customers/customerId"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-SECURITY-050-GET-core/states/available"], "isController": false}, {"data": [1.0, 500, 1500, "LG-MAKE-PAYMENT-AUTOPAY-050-GET-payments/failed"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-PAYMENT-METHOD-100-GET-customers/customerId_encrypt"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-040-GET-origination/applicants/3795"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-070-POST-update/address"], "isController": false}, {"data": [1.0, 500, 1500, "LG-MAKE-PAYMENT-070-PATCH-core/documents"], "isController": false}, {"data": [1.0, 500, 1500, "LG-LOAN-DETAILS-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-PAYMENT-METHOD-040-GET-origination/applicants/3795"], "isController": false}, {"data": [1.0, 500, 1500, "LG-080-GET-summary?emailEncrypted"], "isController": false}, {"data": [1.0, 500, 1500, "LG-020-POST-auth/oauth/token"], "isController": false}, {"data": [0.5, 500, 1500, "LG-SAVING-DETAILS-030-GET-accounts/savings/number"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-020-GET-documents/noaa/latest/user_uuid"], "isController": false}, {"data": [1.0, 500, 1500, "LG-MAKE-PAYMENT-090-GET-payments"], "isController": false}, {"data": [1.0, 500, 1500, "LG-120-GET-missed-payment-time?customerUuid"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-SECURITY-020-GET-documents/noaa/latest/user_uuid"], "isController": false}, {"data": [1.0, 500, 1500, "LG-MAKE-PAYMENT-040-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "TEST-01-BUSINESS-LOGIN-FLOW"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-PAYMENT-METHOD-030-GET-customer/customers/customerId"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-PAYMENT-METHOD-060-GET-customers/customerId_encrypt"], "isController": false}, {"data": [1.0, 500, 1500, "LG-SAVING-DETAILS-050-GET-account/transactions"], "isController": false}, {"data": [1.0, 500, 1500, "LG-MAKE-PAYMENT-100-GET-account/transactions"], "isController": false}, {"data": [1.0, 500, 1500, "LG-SAVING-DETAILS-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "JSR223 Sampler-FunctionUtils"], "isController": false}, {"data": [1.0, 500, 1500, "LG-060-GET-dashboard"], "isController": false}, {"data": [1.0, 500, 1500, "LG-110-GET-applicants/popup/uuid"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-SECURITY-030-GET-customer/customers/customerId"], "isController": false}, {"data": [1.0, 500, 1500, "LG-LOAN-DETAILS-030-GET-full"], "isController": false}, {"data": [1.0, 500, 1500, "LG-MAKE-PAYMENT-AUTOPAY-030-GET-full"], "isController": false}, {"data": [1.0, 500, 1500, "LG-MAKE-PAYMENT-AUTOPAY-080-GET-autopay"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-PAYMENT-METHOD-050-GET-core/states/available"], "isController": false}, {"data": [1.0, 500, 1500, "LG-MAKE-PAYMENT-AUTOPAY-060-GET-payments"], "isController": false}, {"data": [1.0, 500, 1500, "LG-LOAN-DETAILS-040-PATCH-core/documents"], "isController": false}, {"data": [0.5, 500, 1500, "LG-EIDT-INFO-PAYMENT-METHOD-080-POST-method"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-060-GET-customers/customerId_encrypt"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-SECURITY-040-GET-origination/applicants/3795"], "isController": false}, {"data": [1.0, 500, 1500, "LG-090-GET-customers/customerId"], "isController": false}, {"data": [1.0, 500, 1500, "LG-030-GET-applicants/email"], "isController": false}, {"data": [0.5, 500, 1500, "LG-010-POST-check-lead-with-application"], "isController": false}, {"data": [1.0, 500, 1500, "PROF-T001-EXC-Random main action"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-SECURITY-070-PUT-auth/users"], "isController": false}, {"data": [0.5, 500, 1500, "LG-LOAN-DETAILS-060-GET-payments"], "isController": false}, {"data": [1.0, 500, 1500, "LG-MAKE-PAYMENT-080-GET-payments/failed"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "AF-020-GET-maintenance/configuration"], "isController": false}, {"data": [0.45, 500, 1500, "eProtect/paypage_01"], "isController": false}, {"data": [1.0, 500, 1500, "LG-MAKE-PAYMENT-020-GET-noaa/latest/customerUUID"], "isController": false}, {"data": [1.0, 500, 1500, "LG-130-GET-customers/popup/customerId"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-SECURITY-060-GET-customers/customerId_encrypt"], "isController": false}, {"data": [0.5, 500, 1500, "LG-EIDT-INFO-PAYMENT-METHOD-070-GET-eProtect/paypage_LINK-DEBIT-CARD"], "isController": false}, {"data": [1.0, 500, 1500, "LG-100-GET-applicants/id"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-050-GET-core/states/available"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-PAYMENT-METHOD-090-GET-customer/customers/customerId"], "isController": false}, {"data": [1.0, 500, 1500, "LG-MAKE-PAYMENT-AUTOPAY-040-PATCH-core/documents"], "isController": false}, {"data": [1.0, 500, 1500, "LG-MAKE-PAYMENT-050-GET-noaa/latest/customerUUID"], "isController": false}, {"data": [1.0, 500, 1500, "LG-LOAN-DETAILS-070-GET-account/transactions"], "isController": false}, {"data": [1.0, 500, 1500, "LG-MAKE-PAYMENT-060-GET-full"], "isController": false}, {"data": [1.0, 500, 1500, "LG-050-GET-noaa/latest/customerUUID"], "isController": false}, {"data": [1.0, 500, 1500, "LG-SAVING-DETAILS-020-GET-noaa/latest/customerUUID"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-PAYMENT-METHOD-020-GET-documents/noaa/latest/user_uuid"], "isController": false}, {"data": [1.0, 500, 1500, "LG-MAKE-PAYMENT-AUTOPAY-070-GET-account/transactions"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-PAYMENT-METHOD-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "LG-040-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "LG-MAKE-PAYMENT-010-GET-maintenance/configuration"], "isController": false}, {"data": [0.0, 500, 1500, "LG-MAKE-PAYMENT-030-POST-payment"], "isController": false}, {"data": [1.0, 500, 1500, "LG-EIDT-INFO-SECURITY-010-GET-maintenance/configuration"], "isController": false}, {"data": [1.0, 500, 1500, "LG-SAVING-DETAILS-040-PATCH-core/documents"], "isController": false}, {"data": [1.0, 500, 1500, "LG-LOAN-DETAILS-020-GET-noaa/latest/customerUUID"], "isController": false}, {"data": [1.0, 500, 1500, "LG-MAKE-PAYMENT-AUTOPAY-020-GET-noaa/latest/customerUUID"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 184, 0, 0.0, 369.37499999999994, 0, 2880, 273.0, 851.0, 1004.25, 2568.050000000002, 1.0454961276868966, 2.086691880145801, 2.010844358866546], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["LG-MAKE-PAYMENT-AUTOPAY-010-GET-maintenance/configuration", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 2.2813472510373445, 11.070409751037344], "isController": false}, {"data": ["LG-LOAN-DETAILS-050-GET-payments/failed", 1, 0, 0.0, 286.0, 286, 286, 286.0, 286.0, 286.0, 286.0, 3.4965034965034967, 1.7311789772727275, 9.543678977272728], "isController": false}, {"data": ["LG-070-GET-payments/failed", 6, 0, 0.0, 298.66666666666663, 273, 338, 296.5, 338.0, 338.0, 338.0, 0.03855050115651503, 0.019087015709329223, 0.10522329173091752], "isController": false}, {"data": ["AF-010-GET-Login", 6, 0, 0.0, 1045.3333333333335, 950, 1439, 964.0, 1439.0, 1439.0, 1439.0, 0.0377453447408153, 0.06457992576748868, 0.027719237544036233], "isController": false}, {"data": ["LG-EIDT-INFO-030-GET-customer/customers/customerId", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 5.288516773897059, 9.733312270220587], "isController": false}, {"data": ["LG-EIDT-INFO-SECURITY-050-GET-core/states/available", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 17.798251793032787, 10.842245133196721], "isController": false}, {"data": ["LG-MAKE-PAYMENT-AUTOPAY-050-GET-payments/failed", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 1.833767361111111, 10.109230324074073], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-100-GET-customers/customerId_encrypt", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 8.513871571072318, 6.670335879052368], "isController": false}, {"data": ["LG-EIDT-INFO-040-GET-origination/applicants/3795", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 7.4831039186507935, 10.521298363095237], "isController": false}, {"data": ["LG-EIDT-INFO-070-POST-update/address", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 5.429536679536679, 10.632842664092664], "isController": false}, {"data": ["LG-MAKE-PAYMENT-070-PATCH-core/documents", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 19.96606979927007, 10.293111313868613], "isController": false}, {"data": ["LG-LOAN-DETAILS-010-GET-maintenance/configuration", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 2.2908528645833335, 11.116536458333334], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-040-GET-origination/applicants/3795", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 7.54296875, 10.60546875], "isController": false}, {"data": ["LG-080-GET-summary?emailEncrypted", 6, 0, 0.0, 320.66666666666663, 304, 340, 318.5, 340.0, 340.0, 340.0, 0.03855446460700149, 0.03114979855292243, 0.104368140518172], "isController": false}, {"data": ["LG-020-POST-auth/oauth/token", 6, 0, 0.0, 478.8333333333333, 459, 497, 476.5, 497.0, 497.0, 497.0, 0.0380235365691363, 0.17700995979011008, 0.036315448012319625], "isController": false}, {"data": ["LG-SAVING-DETAILS-030-GET-accounts/savings/number", 1, 0, 0.0, 542.0, 542, 542, 542.0, 542.0, 542.0, 542.0, 1.8450184501845017, 8.916988583948338, 4.944072878228782], "isController": false}, {"data": ["LG-EIDT-INFO-020-GET-documents/noaa/latest/user_uuid", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 3.0488742618110236, 10.576863927165354], "isController": false}, {"data": ["LG-MAKE-PAYMENT-090-GET-payments", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 177.86882925724638, 9.687783061594201], "isController": false}, {"data": ["LG-120-GET-missed-payment-time?customerUuid", 6, 0, 0.0, 271.5, 257, 294, 270.0, 294.0, 294.0, 294.0, 0.038619482241474754, 0.02059202861703634, 0.10461957396274507], "isController": false}, {"data": ["LG-EIDT-INFO-SECURITY-020-GET-documents/noaa/latest/user_uuid", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 3.0488742618110236, 10.576863927165354], "isController": false}, {"data": ["LG-MAKE-PAYMENT-040-GET-maintenance/configuration", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 2.2813472510373445, 11.070409751037344], "isController": false}, {"data": ["TEST-01-BUSINESS-LOGIN-FLOW", 10, 0, 0.0, 4.3, 0, 22, 0.5, 21.6, 22.0, 22.0, 0.06322831110858199, 0.0, 0.0], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-030-GET-customer/customers/customerId", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 5.230823863636363, 9.627130681818182], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-060-GET-customers/customerId_encrypt", 1, 0, 0.0, 380.0, 380, 380, 380.0, 380.0, 380.0, 380.0, 2.631578947368421, 8.992084703947368, 7.038959703947368], "isController": false}, {"data": ["LG-SAVING-DETAILS-050-GET-account/transactions", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 4.745945785984849, 10.446259469696969], "isController": false}, {"data": ["LG-MAKE-PAYMENT-100-GET-account/transactions", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 6.5734622035573125, 10.900444664031621], "isController": false}, {"data": ["LG-SAVING-DETAILS-010-GET-maintenance/configuration", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 2.2908528645833335, 11.116536458333334], "isController": false}, {"data": ["JSR223 Sampler-FunctionUtils", 10, 0, 0.0, 32.0, 0, 312, 1.0, 281.10000000000014, 312.0, 312.0, 0.06310342651605982, 0.0, 0.0], "isController": false}, {"data": ["LG-060-GET-dashboard", 6, 0, 0.0, 417.3333333333333, 354, 500, 406.0, 500.0, 500.0, 500.0, 0.03850053259070084, 0.04085668497580883, 0.10335738680843418], "isController": false}, {"data": ["LG-110-GET-applicants/popup/uuid", 6, 0, 0.0, 253.66666666666666, 241, 261, 254.0, 261.0, 261.0, 261.0, 0.03861997940267765, 0.022176316297631306, 0.1038289094683316], "isController": false}, {"data": ["LG-EIDT-INFO-SECURITY-030-GET-customer/customers/customerId", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 5.249914461678832, 9.662266195255473], "isController": false}, {"data": ["LG-LOAN-DETAILS-030-GET-full", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 6.967474489795919, 5.462771045918368], "isController": false}, {"data": ["LG-MAKE-PAYMENT-AUTOPAY-030-GET-full", 1, 0, 0.0, 333.0, 333, 333, 333.0, 333.0, 333.0, 333.0, 3.003003003003003, 10.25243993993994, 8.03831174924925], "isController": false}, {"data": ["LG-MAKE-PAYMENT-AUTOPAY-080-GET-autopay", 1, 0, 0.0, 369.0, 369, 369, 369.0, 369.0, 369.0, 369.0, 2.710027100271003, 7.754276761517615, 7.344067581300813], "isController": false}, {"data": ["LG-EIDT-INFO-010-GET-maintenance/configuration", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 2.2908528645833335, 11.116536458333334], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-050-GET-core/states/available", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 17.945344783057852, 10.931850464876034], "isController": false}, {"data": ["LG-MAKE-PAYMENT-AUTOPAY-060-GET-payments", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 183.09453708022386, 9.976970615671641], "isController": false}, {"data": ["LG-LOAN-DETAILS-040-PATCH-core/documents", 1, 0, 0.0, 354.0, 354, 354, 354.0, 354.0, 354.0, 354.0, 2.824858757062147, 12.369791666666668, 7.9669844632768365], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-080-POST-method", 1, 0, 0.0, 646.0, 646, 646, 646.0, 646.0, 646.0, 646.0, 1.5479876160990713, 0.7664352747678018, 4.781528154024768], "isController": false}, {"data": ["LG-EIDT-INFO-060-GET-customers/customerId_encrypt", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 8.09713788507109, 6.338399733412323], "isController": false}, {"data": ["LG-EIDT-INFO-SECURITY-040-GET-origination/applicants/3795", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 7.5732617971887555, 10.648060993975903], "isController": false}, {"data": ["LG-090-GET-customers/customerId", 6, 0, 0.0, 287.33333333333337, 275, 296, 291.5, 296.0, 296.0, 296.0, 0.03860755421144071, 0.055498359178946015, 0.10221199166720288], "isController": false}, {"data": ["LG-030-GET-applicants/email", 6, 0, 0.0, 301.66666666666663, 282, 324, 301.5, 324.0, 324.0, 324.0, 0.038414505317207776, 0.08523218367255475, 0.10350158219743776], "isController": false}, {"data": ["LG-010-POST-check-lead-with-application", 6, 0, 0.0, 1014.0, 950, 1072, 1007.0, 1072.0, 1072.0, 1072.0, 0.03787974443799086, 0.02030857392232127, 0.02944558259046946], "isController": false}, {"data": ["PROF-T001-EXC-Random main action", 10, 0, 0.0, 12.899999999999999, 0, 117, 1.5, 105.50000000000004, 117.0, 117.0, 0.0632359078779294, 0.0, 0.0], "isController": false}, {"data": ["LG-EIDT-INFO-SECURITY-070-PUT-auth/users", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 6.76206043144208, 6.6627881205673765], "isController": false}, {"data": ["LG-LOAN-DETAILS-060-GET-payments", 1, 0, 0.0, 751.0, 751, 751, 751.0, 751.0, 751.0, 751.0, 1.3315579227696406, 65.33866303262317, 3.5603570239680424], "isController": false}, {"data": ["LG-MAKE-PAYMENT-080-GET-payments/failed", 1, 0, 0.0, 279.0, 279, 279, 279.0, 279.0, 279.0, 279.0, 3.5842293906810037, 1.774613575268817, 9.783126120071683], "isController": false}, {"data": ["AF-020-GET-maintenance/configuration", 6, 0, 0.0, 760.8333333333334, 241, 934, 845.5, 934.0, 934.0, 934.0, 0.037895534642834586, 0.065021928093223, 0.03197435735489168], "isController": false}, {"data": ["eProtect/paypage_01", 10, 0, 0.0, 958.8000000000001, 504, 2880, 600.5, 2730.4000000000005, 2880.0, 2880.0, 0.06160898012494301, 0.028036899158421332, 0.07604858484172654], "isController": false}, {"data": ["LG-MAKE-PAYMENT-020-GET-noaa/latest/customerUUID", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 3.0369178921568625, 10.535386029411764], "isController": false}, {"data": ["LG-130-GET-customers/popup/customerId", 6, 0, 0.0, 256.16666666666663, 245, 264, 257.0, 264.0, 264.0, 264.0, 0.03862520036822691, 0.024857428752599154, 0.10248502871139895], "isController": false}, {"data": ["LG-EIDT-INFO-SECURITY-060-GET-customers/customerId_encrypt", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 8.829437177002584, 6.911640019379845], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-070-GET-eProtect/paypage_LINK-DEBIT-CARD", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.9143115039840637, 2.474477091633466], "isController": false}, {"data": ["LG-100-GET-applicants/id", 6, 0, 0.0, 266.0, 257, 273, 267.5, 273.0, 273.0, 273.0, 0.03861600247142416, 0.0728198249729688, 0.10238520186515292], "isController": false}, {"data": ["LG-EIDT-INFO-050-GET-core/states/available", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 17.798251793032787, 10.842245133196721], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-090-GET-customer/customers/customerId", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 5.316840277777778, 9.80541087962963], "isController": false}, {"data": ["LG-MAKE-PAYMENT-AUTOPAY-040-PATCH-core/documents", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 16.400397940074907, 10.562968164794007], "isController": false}, {"data": ["LG-MAKE-PAYMENT-050-GET-noaa/latest/customerUUID", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 2.9900156853281854, 10.372677364864865], "isController": false}, {"data": ["LG-LOAN-DETAILS-070-GET-account/transactions", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 4.6404803240740735, 10.21412037037037], "isController": false}, {"data": ["LG-MAKE-PAYMENT-060-GET-full", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 9.90022452346041, 7.849729655425219], "isController": false}, {"data": ["LG-050-GET-noaa/latest/customerUUID", 6, 0, 0.0, 273.0, 264, 286, 272.0, 286.0, 286.0, 286.0, 0.03852005932089136, 0.029830475626432464, 0.10348504217946496], "isController": false}, {"data": ["LG-SAVING-DETAILS-020-GET-noaa/latest/customerUUID", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 2.9900156853281854, 10.372677364864865], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-020-GET-documents/noaa/latest/user_uuid", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 3.001604893410853, 10.412881540697674], "isController": false}, {"data": ["LG-MAKE-PAYMENT-AUTOPAY-070-GET-account/transactions", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 4.894256591796875, 10.772705078125], "isController": false}, {"data": ["LG-EIDT-INFO-PAYMENT-METHOD-010-GET-maintenance/configuration", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 2.3004380230125525, 11.163049163179917], "isController": false}, {"data": ["LG-040-GET-maintenance/configuration", 6, 0, 0.0, 251.83333333333334, 239, 260, 253.0, 260.0, 260.0, 260.0, 0.038525005939271745, 0.021181228851376948, 0.10278351193954142], "isController": false}, {"data": ["LG-MAKE-PAYMENT-010-GET-maintenance/configuration", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 2.253297899590164, 10.934298155737705], "isController": false}, {"data": ["LG-MAKE-PAYMENT-030-POST-payment", 1, 0, 0.0, 2513.0, 2513, 2513, 2513.0, 2513.0, 2513.0, 2513.0, 0.3979307600477517, 0.21295513330680463, 1.0779882113012336], "isController": false}, {"data": ["LG-EIDT-INFO-SECURITY-010-GET-maintenance/configuration", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 2.3004380230125525, 11.163049163179917], "isController": false}, {"data": ["LG-SAVING-DETAILS-040-PATCH-core/documents", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 16.713382633587784, 10.764551526717558], "isController": false}, {"data": ["LG-LOAN-DETAILS-020-GET-noaa/latest/customerUUID", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 3.0609251482213438, 10.618669713438734], "isController": false}, {"data": ["LG-MAKE-PAYMENT-AUTOPAY-020-GET-noaa/latest/customerUUID", 1, 0, 0.0, 278.0, 278, 278, 278.0, 278.0, 278.0, 278.0, 3.5971223021582737, 2.7856620953237408, 9.663753372302157], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 184, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
