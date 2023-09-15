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
    
async function asyncCall() {
  try{
        let band = await APIrequest("https://spotify23.p.rapidapi.com/artists/?ids=3WrFJ7ztbogyGnTHbHJFl2");
        addBand(band);
        let albums = await APIrequest("https://spotify23.p.rapidapi.com/artist_albums/?id=3WrFJ7ztbogyGnTHbHJFl2&offset=0&limit=100");
        addAlbums(albums);
  }catch(error){
    console.log(error);
  };
}

const addAlbums = (info) => {

    const albums = info.data.artist.discography.albums.items;
    
    const container = document.getElementById("listBody");
    const fragment = document.createDocumentFragment();

    albums.forEach(album => {

        const itemWrapper = document.createElement("div");
        itemWrapper.classList.add("l4");

        const ulName = document.createElement("ul");
        const nameItem = document.createElement("li");
        nameItem.innerHTML = album.releases.items[0].name;
        ulName.appendChild(nameItem);
        itemWrapper.appendChild(ulName);

        const ulTrack = document.createElement("ul");
        const trackItem = document.createElement("li");
        trackItem.innerHTML = album.releases.items[0].tracks.totalCount;
        ulTrack.appendChild(trackItem);
        itemWrapper.appendChild(ulTrack);

        const ulYear = document.createElement("ul");
        const yearItem = document.createElement("li");
        yearItem.innerHTML = album.releases.items[0].date.year;
        ulYear.appendChild(yearItem);
        itemWrapper.appendChild(ulYear);

        const ulId = document.createElement("ul");
        const idItem = document.createElement("li");
        idItem.innerHTML = album.releases.items[0].id;
        ulId.appendChild(idItem);
        itemWrapper.appendChild(ulId);

        fragment.appendChild(itemWrapper);

    });

    container.appendChild(fragment);
}

const addBand = (info) => {

    const container = document.getElementById("description-data");
    const fragment = document.createDocumentFragment();

    let image = info.artists[0].images[0].url;
    const bandImage = document.createElement("img");
    bandImage.src = image;
    bandImage.classList.add("band-image");
    fragment.appendChild(bandImage);

    let name = info.artists[0].name;
    const bandName = document.createElement("h3");
    bandName.innerHTML = name;
    bandName.classList.add("band-name");
    fragment.appendChild(bandName);

    let followers = info.artists[0].followers.total;
    const bandFollowers = document.createElement("span");
    bandFollowers.innerHTML = "Followers: " + followers;
    bandFollowers.classList.add("band-followers");
    fragment.appendChild(bandFollowers);

    container.appendChild(fragment);

}
 

asyncCall();