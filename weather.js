const apiKey = "833d9a9d9c6e0f89200ad578c553afb2";
        const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
    
        const searchBox = document.querySelector(".search input");
        const searchBtn = document.querySelector(".search button");
        const weatherIcon = document.querySelector(".weather-icon");
        const historyList = document.getElementById("history-list");
        const loadingSpinner = document.querySelector(".loading");
        const weatherSection = document.querySelector(".weather");
        const timeoutWarning = document.createElement("p");
    
        // Add timeout warning for long responses
        timeoutWarning.className = "timeout-warning";
        timeoutWarning.textContent = "The server is taking longer than expected. Please wait...";
        timeoutWarning.style.display = "none";
        document.body.appendChild(timeoutWarning);
   
        function updateHistory(city) {
            let history = JSON.parse(localStorage.getItem("cityHistory")) || [];
            if (!history.includes(city)) {
                history.push(city);
                localStorage.setItem("cityHistory", JSON.stringify(history));
                renderHistory();
            }
        }
    
        function renderHistory() {
            const history = JSON.parse(localStorage.getItem("cityHistory")) || [];
            historyList.innerHTML = "";
            history.forEach(city => {
                const li = document.createElement("li");
                li.textContent = city;
                li.addEventListener("click", () => checkWeather(city));
                historyList.appendChild(li);
            });
        }
    
        async function checkWeather(city) {
            if (!city.trim()) {
                alert("Please enter a valid city name.");
                return;
            }
    
            loadingSpinner.style.display = "block";
            timeoutWarning.style.display = "none";
            weatherSection.style.display = "none";
            document.querySelector(".error").style.display = "none";
    
            const timeoutId = setTimeout(() => {
                timeoutWarning.style.display = "block";
            }, 5000); // Display warning if response takes more than 5 seconds
    
            try {
                const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
                clearTimeout(timeoutId); // Clear timeout if API responds
                loadingSpinner.style.display = "none";
    
                if (!response.ok) {
                    throw new Error("City not found");
                }
    
                const data = await response.json();
                document.querySelector(".city").innerHTML = data.name;
                document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
                document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
                document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
    
                if(data.weather[0].main == "Clouds"){
                    weatherIcon.src="clouds.png";
                }
               else if(data.weather[0].main == "Clear"){
                    weatherIcon.src="clear.png";
                }
               else if(data.weather[0].main == "Mist"){
                    weatherIcon.src="mist.png";
                }
               else if(data.weather[0].main == "Rain"){
                    weatherIcon.src="rain.png";
                }
              else if(data.weather[0].main == "Drizzle"){
                    weatherIcon.src="drizzle.png";
                }
    
                weatherSection.style.display = "block";
                updateHistory(city);
            } catch (error) {
                document.querySelector(".error").style.display = "block";
                weatherSection.style.display = "none";
            } finally {
                loadingSpinner.style.display = "none";
                timeoutWarning.style.display = "none";
            }
        }
        function showList(){
            if(historyList.style.display === "none")   
            historyList.style.display = "block";
        else
            historyList.style.display="none";
        }
    
        searchBtn.addEventListener("click", () => {
            checkWeather(searchBox.value);
        });
    
        renderHistory();