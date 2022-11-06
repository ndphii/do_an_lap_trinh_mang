const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const nhietdoto = document.getElementById('nhietdo');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');
const btn_find_cityname =document.getElementById('btn_find_city_name')
const inputnamecity =document.getElementById('input_city_name');
const matchlist =document.getElementById('match-list');
const btngetitem =document.getElementById("btnitemsearch");

const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

const API_KEY ='1779ca818b59557aa48558aec376d6db';


setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM'

    timeEl.innerHTML = (hoursIn12HrFormat < 10? '0'+hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10? '0'+minutes: minutes)+ ' ' + `<span id="am-pm">${ampm}</span>`

    dateEl.innerHTML = days[day] + ', ' + date+ ' ' + months[month]

}, 1000);
window.addEventListener("load",()=>{
    getWeatherData ();
});

const searchStates =async searchText =>{
    const res = await  fetch('https://raw.githubusercontent.com/ndphii/do_an_lap_trinh_mang/master/data/citylist.json');
    const states = await res.json();
    let matches= states.filter(state =>{
        const regex = new RegExp(`^${searchText}`,'gi');
        return state.name.match(regex) || state.country.match(regex);
    });
    if(searchText.length === 0){
        matches = [];
        matchlist.innerHTML ='';
    }
     outputHtml(matches);
}
 const outputHtml = matches =>{
    if (matches.length >0 ){
        const html = matches.map(match =>
        `<button onclick="getnamecitybybutton(this)" id="btnitemsearch" type="button" class="list-group-item list-group-item-action" value="${match.name}">
            ${match.name} <span>(${match.country})</span>
        </button>
        `
        ).join('');
        matchlist.innerHTML =html;
    }
}

input_city_name.addEventListener('input',()=> searchStates(input_city_name.value));

btn_find_cityname.addEventListener('click',()=>{
    
    getWeatherDataByCityName(inputnamecity.value);
    searchStates('');
    inputnamecity.value='';
    
});
function getnamecitybybutton(city){
    getWeatherDataByCityName(city.value);
    inputnamecity.value="";
    matchlist.innerHTML = "";
}
function getWeatherDataByCityName(city) {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&lang=vi&appid=${API_KEY}`).then(res => res.json()).then(data => {
        showWeatherData(data);
        })
}
function getWeatherData () {
    navigator.geolocation.getCurrentPosition((success) => {
        let {latitude, longitude } = success.coords;
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&lang=vi&appid=${API_KEY}`).then(res => res.json()).then(data => {
        console.log(data)
        showWeatherData(data);
        })
    })
}

function showWeatherData (data){
    let {sunrise, sunset} = data.city;
    let {temp,temp_max,temp_min,humidity,sea_level,pressure} = data.list[0].main;
    let {main,description,icon} = data.list[0].weather[0];
    let {speed} = data.list[0].wind;
    var nhietdo = Math.round(temp-273);
    var nhietdocaonhat = Math.round(temp_max-273);
    var nhietdothapnhat = Math.round(temp_min-273);
    var rains=0;
    timezone.innerHTML = data.city.country + " / " +data.city.name ;
    countryEl.innerHTML = data.city.coord.lat + 'N  - ' + data.city.coord.lon+'E';
    if(main==="Rain"){
        const x = Object.values(data.list[0].rain);
        rains=x[0];
        console.log(rains[0]);
    }
    nhietdoto.innerHTML = 
    `<div class="temp">
        <div class="textnhiet">${nhietdo}</div>
        <div class="textdoc">°C</div>
    </div>
    <div class="iconstemp"><img src="http://openweathermap.org/img/wn/${icon}@2x.png"></div>
    <div class="description">
        <div>${description}</div>
    </div>
    <div class="temp_min_max">
        Nhiệt độ cao nhất :${nhietdocaonhat}°C - Nhiệt độ thấp nhất :${nhietdothapnhat}°C
    </div>
    `
    ;
    currentWeatherItemsEl.innerHTML = 
    `<div class="weather-item">
        <div>Độ ẩm</div>
        <div>${humidity} %</div>
    </div>
    <div class="weather-item">
        <div>Áp suất </div>
        <div>${pressure} hPa</div>
    </div>
    <div class="weather-item">
        <div>Tốc độ gió</div>
        <div>${speed} m/s</div>
    </div>

    <div class="weather-item">
        <div>Bình Minh</div>
        <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Hoàng Hôn</div>
        <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Mực nước biển</div>
        <div>${sea_level} hPa</div>
    </div>
    <div class="weather-item">
        <div>Lượng mưa 3h qua</div>
        <div>${rains} mm</div>
    </div>
    
    `;
   
    let otherDayForcast = ''
    data.list.forEach((day, idx) => {
        var checktimday = window.moment(day.dt_txt).format('HH:mm:ss');
        var nhietdotrungbinh =Math.round(day.main.temp-273);
        var descriptiondubao =day.weather[0].description;
        if(idx == 0){
            currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn/${icon}.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">Hôm nay</div>
                <div class="templ">Cao nhất - ${nhietdocaonhat}&#176;C</div>
                <div class="templ">Thấp nhất - ${nhietdothapnhat}&#176;C</div>
            </div>
            `
        }else if(idx!=0 && checktimday==="00:00:00") {           
               //console.log("list:"+idx+" ngày cập nhật:"+day.dt_txt+" nhiệt:"+nhietdotrungbinh+"trạng thái:"+descriptiondubao);
               otherDayForcast += `
                    <div class="weather-forecast-item">
                        <div class="day">${window.moment(day.dt*1000).format('ddd DD/MM')}</div>
                        <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                        <div class="templ">${nhietdotrungbinh}&#176;C</div>
                        <div class="templ">${descriptiondubao}</div>
                    </div>
                 `
        }
    })
    weatherForecastEl.innerHTML = otherDayForcast;
}
