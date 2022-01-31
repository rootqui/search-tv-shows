const d = document,
    shows = d.getElementById("shows"),
    text = d.getElementById("text-search"),
    template = d.getElementById("show-template").content,
    fragment = d.createDocumentFragment();

async function apiTvShow(query) {
    try {
        api = `http://api.tvmaze.com/search/shows?q=${query}`,
        res = await fetch(api),
        json = await res.json(res);
        if(!res.ok) throw {status:res.status, statusText: res.statusText}
        return json
    } catch (err) {
        let message = err.statusText || "An Error Occurred",
            status = err.statusText || "";
        shows.innerHTML = `<p>Error ${status}: ${message}</p>`;
    }
}

function styleAfterResults(){
    d.getElementsByTagName("html")[0].style.background = "#1d1c1c";;
    d.getElementById("main").classList.add("header-after-results");
    d.getElementById("title-banner").classList.add("title-results");
    d.getElementById("box-search-tv").classList.add("box-search-results");
}

function createCardsTVShow(data, query){
    console.log(data.length)
    console.log(data)
    if(data.length !== 0){
        data.forEach(el => {
            template.querySelector("h3").textContent = el.show.name;
            template.querySelector("div").innerHTML = el.show.summary || "No Description";
            template.querySelector("img").src = el.show.image? el.show.image.medium:"http://static.tvmaze.com/images/no-img/no-img-portrait-text.png";
    
            template.querySelector("img").alt = el.show.name;
            template.querySelector("img").style.maxWidth = "70%";

            let clone = d.importNode(template, true);
            fragment.appendChild(clone)
          });

        shows.innerHTML = "";
        shows.appendChild(fragment);
    }else{
        shows.innerHTML = "";
        let message = d.createElement("h3");
        message.setAttribute('id',"msg");
        message.textContent = `No Results Found: ${query}`;
        shows.appendChild(message);
    }

}

// Delegacion de Eventos
d.addEventListener("click",async (e)=>{
    if(e.target.matches("#search") || e.target.matches("#icon-search")){
        let query = text.value.toLowerCase();
        if(query){
            let json = await apiTvShow(query);
            styleAfterResults();
            createCardsTVShow(json, query);
        }
    }
});

d.addEventListener("keypress",async (e)=>{
    if(e.target.matches("#text-search")){
        if (e.key == "Enter"){
            let query = text.value.toLowerCase();
            if(query){
                let json = await apiTvShow(query);
                styleAfterResults();
                createCardsTVShow(json, query);
            }
        }
    }
});

window.addEventListener("load", (e)=>{
    text.value="";
})

