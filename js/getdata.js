const albumsList = [];
const artistList = [];
const popupWrapper = document.getElementById("popup-background");
const showData = document.getElementById("showData");
const bIdL = document.getElementById("bIdL");
const showIdBtn = document.getElementById("showId");
const bandIds = document.getElementById("bandIds");
const popupErrorMsg = document.getElementById("popupError");
const loginBtn = document.getElementById("login");
const loginName = document.getElementById("name");
const loginID = document.getElementById("bId");

showData.addEventListener("click", (e) => {
    e.preventDefault();
    asyncCall(bIdL.value);
});

showIdBtn.addEventListener("click", () => {
    showIdBtn.classList.toggle("active");
    bandIds.classList.toggle("show");
});

loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    login(loginName.value, loginID.value);
});

const APIrequest = (endpoint) => {
    return new Promise( (resolve,reject) => {
        
        const data = null;

        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.open('GET', endpoint);
        xhr.setRequestHeader('X-RapidAPI-Key', 'f46e139634msh1a9d58d2c185f52p1bba68jsn64f299cc2865');
        xhr.setRequestHeader('X-RapidAPI-Host', 'spotify23.p.rapidapi.com');

        xhr.onload = () => {
        if (xhr.status == 200) {
            let data = JSON.parse(xhr.response);
            resolve(data);
        }else{
            reject(new Error('Error en la conexion'));
        }
        };

        xhr.send(data);
    });
}

function login(name, id) {

    let loginStatus = 0;
    let formMsg = document.querySelector(".form-message");

    artistList.forEach(art => {
        if((art.getName() == name) && (art.getID() == id)) {
            loginStatus = 1;
        }else if((art.getName() == name) && (art.getID() != id)) {
            loginStatus = 2;
        }
    })

    if(loginStatus == 1) {
        let removeButtons = document.getElementsByClassName("removeButton");
        console.log("buttons: ", removeButtons);
        let formFloat = document.querySelector(".form.float");
        formMsg.classList.add("show");
        formMsg.classList.add("success");

        for(let i=0; i<removeButtons.length; i++) {
            removeButtons[i].classList.add("active");
            removeButtons[i].addEventListener("click", (e) => {
                console.log("asd: ", e);
            });
        }
        
        /*removeButtons.forEach(btn => {
            btn.classList.add("active");
            btn.addEventListener("click", (e) => {
                console.log("asd: ", e);
            });
        });*/
        setTimeout(() => {
            formFloat.classList.add("hide");
        }, 3000);
    }
    if(loginStatus == 2) {
        formMsg.classList.add("show");
        formMsg.classList.add("success");
    }


}

async function asyncCall(bandID) {
  try{
        let band = await APIrequest("https://spotify23.p.rapidapi.com/artists/?ids=" + bandID);
        console.log("band: ", band);
        
        if(band.artists[0] != null) {
            let id = band.artists[0].id;
            let name = band.artists[0].name;
            let image = band.artists[0].images[0].url;
            let followers = band.artists[0].followers.total;
            let genres = band.artists[0].genres;
            let art = new Artist(id, name, image, followers, genres);
            artistList.push(art);
            addBand(art);
            hidePopup();

            if(art.getID() != null) {
                let albums = await APIrequest("https://spotify23.p.rapidapi.com/artist_albums/?id=" + art.getID() + "&offset=0&limit=5");
                let albumsArray = albums.data.artist.discography.albums.items;
                albumsArray.forEach(album => {
                    let albId = album.releases.items[0].id;
                    let albName = album.releases.items[0].name;
                    let albTracks = album.releases.items[0].tracks.totalCount;
                    let albYear = album.releases.items[0].date.year;
                    let alb = new Album(albId, albName, albTracks, albYear, id);
                    albumsList.push(alb);
                });
                addAlbums(albumsList);
            }else{
                
            }
        }else{
            showErrorMsj();
        }

  }catch(error){
    console.log(error);
  };
}

const hidePopup = () => {
    popupWrapper.classList.add("hide");
    bandIds.classList.remove("show");
}

const showErrorMsj = () => {
    popupErrorMsg.classList.add("show");
}

const addAlbums = (albums) => {

    const container = document.getElementById("listBody");
    const fragment = document.createDocumentFragment();

    albums.forEach(album => {

        const itemWrapper = document.createElement("div");
        itemWrapper.classList.add("l4");

        const ulName = document.createElement("ul");
        const nameItem = document.createElement("li");
        nameItem.innerHTML = album.getName();
        ulName.appendChild(nameItem);
        itemWrapper.appendChild(ulName);

        const ulTrack = document.createElement("ul");
        const trackItem = document.createElement("li");
        trackItem.innerHTML = album.getTracks();
        ulTrack.appendChild(trackItem);
        itemWrapper.appendChild(ulTrack);

        const ulYear = document.createElement("ul");
        const yearItem = document.createElement("li");
        yearItem.innerHTML = album.getYear();
        ulYear.appendChild(yearItem);
        itemWrapper.appendChild(ulYear);

        const ulRemove = document.createElement("ul");
        const removeItem = document.createElement("li");
        const removeItemButton = document.createElement("button");
        removeItemButton.classList.add("removeButton");
        removeItemButton.innerHTML = "Delete album";
        removeItem.appendChild(removeItemButton);
        ulRemove.appendChild(removeItem);
        itemWrapper.appendChild(ulRemove);

        fragment.appendChild(itemWrapper);

    });

    container.appendChild(fragment);
}

const addBand = (artist) => {

    const container = document.getElementById("description-data");
    const fragment = document.createDocumentFragment();

    let image = artist.getImage();
    const bandImage = document.createElement("img");
    bandImage.src = image;
    bandImage.classList.add("band-image");
    fragment.appendChild(bandImage);

    let name = artist.getName();
    const bandName = document.createElement("h3");
    bandName.innerHTML = name;
    bandName.classList.add("band-name");
    fragment.appendChild(bandName);

    let followers = artist.getFollowers();
    const bandFollowers = document.createElement("span");
    bandFollowers.innerHTML = "Followers: " + followers;
    bandFollowers.classList.add("band-followers");
    fragment.appendChild(bandFollowers);

    let genres = artist.getGenres();
    const bandGenres = document.createElement("span");
    bandGenres.innerHTML = "Genres: " + genres;
    bandGenres.classList.add("band-genres");
    fragment.appendChild(bandGenres);

    let ID = artist.getID();
    const bandID = document.createElement("span");
    bandID.innerHTML = "Band ID: " + ID;
    bandID.classList.add("band-id");
    fragment.appendChild(bandID);

    container.appendChild(fragment);
}

const showAlbumData = (info) => {
    const container = document.getElementById("popup");
    const fragment = document.createDocumentFragment();

    let image = info.albums[0].images[0].url;
    const albumImage = document.createElement("img");
    albumImage.src = image;
    albumImage.classList.add("album-image");
    fragment.appendChild(albumImage);

    let name = info.albums[0].name;
    const albumName = document.createElement("h3");
    albumName.innerHTML = name;
    albumName.classList.add("album-name");
    fragment.appendChild(albumName);

    let band = info.albums[0].artists[0].name;
    const albumBand = document.createElement("h3");
    albumBand.innerHTML = band;
    albumBand.classList.add("album-band");
    fragment.appendChild(albumBand);

    let tracks = info.albums[0].total_tracks;
    const albumTracks = document.createElement("p");
    albumTracks.innerHTML = "Tracks: " + tracks;
    albumTracks.classList.add("album-tracks");
    fragment.appendChild(albumTracks);

    let release = info.albums[0].release_date;
    const albumRelease = document.createElement("p");
    albumRelease.innerHTML = "Release date: " + release;
    albumRelease.classList.add("album-release");
    fragment.appendChild(albumRelease);

    container.appendChild(fragment);

    popupWrapper.classList.add("showP");
    container.classList.add("showP");

}
 

class Artist {
    constructor(id, name, image, followers, genres) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.followers = followers;
        this.genres = genres;
    }

    getID() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getImage() {
        return this.image;
    }
    getFollowers() {
        return this.followers;
    }
    getGenres() {
        let genresString = "";
        this.genres.forEach((genre, index) => {
            if(index == 0) {
                genresString = genre;
            }else{
                genresString = genresString + " ," + genre;
            }
        })

        return genresString;
    }

    setName(name) {
        this.name = name;
    }
    setImage(image) {
        this.image = image;
    }
    setName(followers) {
        this.followers = followers;
    }
    setName(genres) {
        this.genres = genres;
    }
}

class Album {
    constructor(id, name, tracks, year, artistID) {
        this.id = id;
        this.name = name;
        this.tracks = tracks;
        this.year = year;
        this.artistID = artistID;
    }
    getID() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getTracks() {
        return this.tracks;
    }
    getYear() {
        return this.year;
    }
    getArtistID() {
        return this.artistID;
    }

    setName(name) {
        this.name = name;
    }
    setTracks(tracks) {
        this.tracks = tracks;
    }
    setYear(year) {
        this.year = year;
    }
    setArtistID(artistID) {
        this.artistID = artistID;
    }
}
