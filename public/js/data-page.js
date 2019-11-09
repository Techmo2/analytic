const default_filter = '{"HumanPopulation": {"$gt": 10, "$lt": 40}, "ZombiePopulation": {"$gt": 4, "$lt": 60}}';

function addListItem(name){
    var ul = document.getElementById('dnameList');

    var li = document.createElement('li');
    li.setAttribute('id', 'dname_' + name);
    li.setAttribute('class', 'list-group-item');

    var div = document.createElement('div');
    div.setAttribute('class', 'custom-control custom-checkbox');

    var input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('class', 'custom-control-input');
    input.setAttribute('id', 'checkbox_' + name);

    var label = document.createElement('label');
    label.setAttribute('class', 'custom-control-label');
    label.setAttribute('for', 'checkbox_' + name);
    label.innerHTML = name;

    div.appendChild(input);
    div.appendChild(label);
    li.appendChild(div);
    ul.appendChild(li);
}

var lineChartData = {
    labels: ['12:30 PM', '12:31 PM', '12:32 PM', '12:33 PM', '12:34 PM', '12:35 PM', '12:36 PM', '12:37 PM'],
    datasets: [{
        label: 'Zombie Population',
        borderColor: 'rgba(200, 40, 40, 0.8)',
        backgroundColor: 'rgba(200, 100, 100, 0.8)',
        fill: false,
        data: [
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100))
        ],
        yAxisID: 'y-axis-1',
    }, {
        label: 'Human Population',
        borderColor: 'rgba(40, 40, 200, 0.8)',
        backgroundColor: 'rgba(100, 100, 200, 0.8)',
        fill: false,
        data: [
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100))
        ],
        yAxisID: 'y-axis-2'
    }]
};

var ctx = document.getElementById('chart-canvas').getContext('2d');
window.myLine = Chart.Line(ctx, {
    data: lineChartData,
    options: {
        responsive: true,
        hoverMode: 'index',
        stacked: false,
        title: {
            display: true,
            text: '{"HumanPopulation","ZombiePopulation"} : (12:30 PM - 12:38 PM) (Chronological)'
        },
        scales: {
            yAxes: [{
                type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                display: true,
                position: 'left',
                id: 'y-axis-1',
            }, {
                type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                display: true,
                position: 'right',
                id: 'y-axis-2',

                // grid line settings
                gridLines: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
            }],
        }
    }
});

document.getElementById('searchButton').onclick = function() {
    var socket = io();

    var filt = document.getElementById('conditionInput');
    if(!isJsonString(filt.value)){
        filt.value = default_filter;
    }

    var startDate = document.getElementById("dateStartInput").value;
    var endDate = document.getElementById("dateEndInput").value;
    var startTime = document.getElementById("timeStartInput").value;
    var endTime = document.getElementById("timeEndInput").value;
    var filter = document.getElementById("conditionInput").value;

    socket.emit('request_data', startDate, endDate, startTime, endTime, filter);

    socket.on('send_data', (data) => {

        window.myLine.data.datasets[0].data = [
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100))
        ];

        window.myLine.data.datasets[1].data = [
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100)),
            Math.floor(Math.random() * Math.floor(100))
        ];

        window.myLine.update({
            duration: 1500,
            easing: 'easeInOutQuart'
        });
    });

    socket.on('err_invalid_time_index', (data) => {
       window.alert("Invalid date provided");
    });

    socket.on('err_end_before_start', (data) => {
        window.alert("Your end date is before your start date, please fix and resubmit");
    })
}

function isJsonString(str){
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

addListItem("ZombiePopulation");
addListItem("HumanPopulation");
addListItem("TotalPopulation");