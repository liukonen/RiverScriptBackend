package main

import (
	"encoding/json"
	"fmt"
	"github.com/aichaos/rivescript-go"
	"github.com/gorilla/mux"
	"github.com/swaggo/http-swagger"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
	"sync"
	"time"
	"github.com/goddtriffin/helmet"
)

var cache = sync.Map{}
var bot *rivescript.RiveScript
var once sync.Once

func main() {

	go func() {
		for {
			time.Sleep(60 * time.Minute)
			cache.Delete("weather")
		}
	}()

	r := mux.NewRouter()

	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		user := r.URL.Query().Get("user")
		if user == "" {
			user = "local-user"
		}

		rawInput := r.URL.Query().Get("text")
		if rawInput == "" {
			http.Redirect(w, r, "/api-docs/index.html", http.StatusSeeOther)
			return
		}

		query := strings.ToLower(rawInput)
		if strings.Contains(query, "weather") {
			output, err := GetWeather()
			if err != nil {
				fmt.Fprintf(w, "For some reason, I can't lookup the weather... odd. I'm indoors, so it doesn't matter to me anyway.")
				return
			}
			fmt.Fprintf(w, output)
		} else if strings.Contains(query, "who's") || strings.Contains(query, "who is") || strings.Contains(query, "tell me about") || strings.Contains(query, "what is") {
			ln := 0
			testLn := 1
			for testLn != ln {
				ln = len(query)
				query = strings.Replace(query, "who's", "", -1)
				query = strings.Replace(query, "who is", "", -1)
				query = strings.Replace(query, "tell me about", "", -1)
				query = strings.Replace(query, "what is", "", -1)
				testLn = len(query)
			}
			fmt.Fprintf(w, GetInfo(rawInput))
		} else {
			rawInput = strings.ReplaceAll(rawInput, `"`, "")  
			fmt.Fprintf(w, botreply(user, rawInput))
		}
	})
	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("./static/"))))

	r.PathPrefix("/api-docs/").Handler(httpSwagger.Handler(
		httpSwagger.URL("../static/openapi.json"),
		httpSwagger.DeepLinking(true),
		httpSwagger.DocExpansion("none"),
	)).Methods(http.MethodGet)

	port := "5000"
	if p := os.Getenv("PORT"); p != "" {
		port = p
	}

	helmet := helmet.Default()
	fmt.Println("GO Gorilla mux is working on port", port)
	log.Fatal(http.ListenAndServe(":"+port, helmet.Secure(r)))
}

func botreply(user string, input string) string {
	once.Do(func() {
		bot = rivescript.New(rivescript.WithUTF8())
		bot.LoadFile("rs-standard.rive")
		bot.SortReplies()
	})
	response, err := bot.Reply(user, input)
	if err != nil {
		log.Fatalf("Error loading file: %s\n", err)
	}
	return response
}

type weatherData struct {
	Properties struct {
		Periods []struct {
			DetailedForecast string `json:"detailedForecast"`
		} `json:"periods"`
	} `json:"properties"`
}

func GetWeather() (string, error) {
	value, found := cache.Load("weather")

	if found {
		return value.(string), nil
	} else {
		req, err := http.NewRequest("GET", "https://api.weather.gov/gridpoints/MKX/80,70/forecast", nil)
		if err != nil {
			return "", err
		}
		req.Header.Set("User-Agent", "(bot.liukonen.dev, liukonen@gmail.com)")
		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			return "", err
		}
		defer resp.Body.Close()

		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			return "", err
		}

		var data weatherData
		err = json.Unmarshal(body, &data)
		if err != nil {
			return "", err
		}
		responseValue := data.Properties.Periods[0].DetailedForecast
		cache.Store("weather", responseValue)
		return responseValue, nil
	}

}

func GetInfo(request string) string {
	apiURL := "https://api.duckduckgo.com/"
	params := url.Values{}
	params.Add("q", request)
	params.Add("format", "json")

	res, err := http.Get(apiURL + "?" + params.Encode())
	if err != nil {
		return err.Error()
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return err.Error()
	}

	var result map[string]interface{}
	err = json.Unmarshal(body, &result)
	if err != nil {
		return err.Error()
	}

	abstractText, ok := result["AbstractText"].(string)
	if ok && abstractText != "" {
		return fmt.Sprintf("I found on Duck Duck go, that %s", abstractText)
	}

	abstractURL, ok := result["AbstractURL"].(string)
	if ok && abstractURL != "" {
		abstractSource, _ := result["AbstractSource"].(string)
		heading, _ := result["Heading"].(string)
		return fmt.Sprintf("I found something from Duck Duck Go on %s %s %s", abstractSource, heading, abstractURL)
	}

	abstractSource, _ := result["AbstractSource"].(string)
	return abstractSource
}
